#!/usr/bin/env node
/**
 * backend/deploy.mjs
 *
 * Deploys all LebVentures AWS backend resources using the AWS SDK v3.
 * No SAM or AWS CLI required — just Node.js + AWS credentials.
 *
 * Run:  node deploy.mjs
 * Safe to re-run — existing resources are detected and reused.
 *
 * If the IAM role doesn't exist yet, the script will stop and print
 * instructions for creating it in the AWS Console, then re-run with:
 *
 *   node deploy.mjs --role-arn=arn:aws:iam::ACCOUNT:role/ROLE_NAME
 */

import { execSync }  from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { STSClient, GetCallerIdentityCommand }                    from '@aws-sdk/client-sts';
import { IAMClient, GetRoleCommand }                              from '@aws-sdk/client-iam';
import { DynamoDBClient, CreateTableCommand,
         DescribeTableCommand }                                    from '@aws-sdk/client-dynamodb';
import { S3Client, CreateBucketCommand, HeadBucketCommand,
         PutBucketCorsCommand, PutBucketPolicyCommand,
         PutPublicAccessBlockCommand }                             from '@aws-sdk/client-s3';
import { CognitoIdentityProviderClient,
         CreateUserPoolCommand, CreateUserPoolClientCommand }       from '@aws-sdk/client-cognito-identity-provider';
import { LambdaClient, CreateFunctionCommand,
         UpdateFunctionCodeCommand, GetFunctionCommand,
         AddPermissionCommand }                                    from '@aws-sdk/client-lambda';
import { ApiGatewayV2Client, CreateApiCommand,
         CreateIntegrationCommand, CreateRouteCommand,
         CreateStageCommand, CreateAuthorizerCommand }             from '@aws-sdk/client-apigatewayv2';

// ─── Config ───────────────────────────────────────────────────────────────────
const __dir    = dirname(fileURLToPath(import.meta.url));
const REGION   = 'eu-central-1';
const PREFIX   = 'lebventures';
const CORS_URL = 'https://lebventures.com';

const STATE_FILE = join(__dir, 'deployed.json');

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args    = Object.fromEntries(process.argv.slice(2).map(a => a.replace('--','').split('=')));
const cliRole = args['role-arn'] ?? null;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const log  = msg  => console.log(`\n✅  ${msg}`);
const step = msg  => console.log(`\n🔄  ${msg}…`);
const warn = msg  => console.log(`⚠️   ${msg}`);
const box  = lines => {
  const w = Math.max(...lines.map(l => l.length)) + 4;
  const bar = '═'.repeat(w);
  console.log(`\n╔${bar}╗`);
  lines.forEach(l => console.log(`║  ${l.padEnd(w - 2)}  ║`));
  console.log(`╚${bar}╝\n`);
};

const loadState  = ()      => existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE,'utf8')) : {};
const saveState  = state   => writeFileSync(STATE_FILE, JSON.stringify(state,null,2));
const sleep      = ms      => new Promise(r => setTimeout(r, ms));

// ─── AWS clients ─────────────────────────────────────────────────────────────
const cfg  = { region: REGION };
const sts  = new STSClient(cfg);
const iam  = new IAMClient({ region: 'us-east-1' });
const ddb  = new DynamoDBClient(cfg);
const s3   = new S3Client(cfg);
const cog  = new CognitoIdentityProviderClient(cfg);
const lam  = new LambdaClient(cfg);
const apig = new ApiGatewayV2Client(cfg);

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN
// ═════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('\n🚀  LebVentures Backend Deployment');
  console.log('────────────────────────────────────\n');

  const state = loadState();

  // 1 ── Identity ─────────────────────────────────────────────────────────────
  step('Fetching AWS identity');
  const { Account: accountId } = await sts.send(new GetCallerIdentityCommand({}));
  log(`Account: ${accountId}  Region: ${REGION}`);

  // 2 ── IAM Role ─────────────────────────────────────────────────────────────
  const roleName = `${PREFIX}-lambda-role`;
  let roleArn = cliRole ?? state.roleArn ?? null;

  if (!roleArn) {
    // Try to get existing role
    step(`Checking for IAM role: ${roleName}`);
    try {
      const res = await iam.send(new GetRoleCommand({ RoleName: roleName }));
      roleArn = res.Role.Arn;
      log(`Found existing role: ${roleArn}`);
    } catch {
      // Role doesn't exist and we can't create it — print console instructions
      box([
        '  ACTION REQUIRED — Create IAM Role in AWS Console  ',
        '',
        'Your AWS user lacks iam:CreateRole permission.',
        'Create the role manually, then re-run this script.',
        '',
        'Step 1:  Go to https://console.aws.amazon.com/iam/home#/roles',
        'Step 2:  Click "Create role"',
        'Step 3:  Trusted entity → AWS service → Lambda → Next',
        'Step 4:  Attach policy: AWSLambdaBasicExecutionRole → Next',
        `Step 5:  Role name: ${roleName}`,
        'Step 6:  Click "Create role"',
        'Step 7:  Open the new role → "Add permissions" → "Create inline policy"',
        'Step 8:  Switch to JSON tab, paste the policy below, name it "lebventures-inline"',
        '',
        `DynamoDB table ARN:  arn:aws:dynamodb:${REGION}:${accountId}:table/${PREFIX}-events`,
        `S3 bucket ARN:       arn:aws:s3:::${PREFIX}-images-${accountId}`,
        '',
        'Inline policy JSON → saved to: backend/iam-inline-policy.json',
        '',
        'Then re-run:  node deploy.mjs --role-arn=<paste the Role ARN here>',
      ]);

      // Save the inline policy JSON for easy copy-paste
      const inlinePolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'DynamoDB',
            Effect: 'Allow',
            Action: ['dynamodb:GetItem','dynamodb:PutItem','dynamodb:UpdateItem',
                     'dynamodb:DeleteItem','dynamodb:Scan','dynamodb:Query'],
            Resource: `arn:aws:dynamodb:${REGION}:${accountId}:table/${PREFIX}-events`,
          },
          {
            Sid: 'S3',
            Effect: 'Allow',
            Action: ['s3:PutObject','s3:GetObject','s3:DeleteObject'],
            Resource: `arn:aws:s3:::${PREFIX}-images-${accountId}/*`,
          },
        ],
      };
      writeFileSync(join(__dir, 'iam-inline-policy.json'), JSON.stringify(inlinePolicy, null, 2));

      // Continue deploying non-Lambda resources (DynamoDB, S3, Cognito, API GW)
      console.log('⏭️   Continuing with DynamoDB, S3, Cognito, and API Gateway…\n');
    }
  } else {
    log(`Using role: ${roleArn}`);
    state.roleArn = roleArn;
  }

  // 3 ── DynamoDB ─────────────────────────────────────────────────────────────
  const tableName = `${PREFIX}-events`;
  step(`DynamoDB table: ${tableName}`);
  try {
    await ddb.send(new DescribeTableCommand({ TableName: tableName }));
    warn('Table already exists — reusing');
  } catch {
    await ddb.send(new CreateTableCommand({
      TableName: tableName,
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    }));
    log(`Table created: ${tableName}`);
  }
  state.tableName = tableName;

  // 4 ── S3 Bucket ────────────────────────────────────────────────────────────
  const bucketName = `${PREFIX}-images-${accountId}`;
  step(`S3 bucket: ${bucketName}`);
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    warn('Bucket already exists — reusing');
  } catch {
    await s3.send(new CreateBucketCommand({
      Bucket: bucketName,
      CreateBucketConfiguration: { LocationConstraint: REGION },
    }));
    await s3.send(new PutPublicAccessBlockCommand({
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false, BlockPublicPolicy: false,
        IgnorePublicAcls: false, RestrictPublicBuckets: false,
      },
    }));
    await s3.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [{ Sid: 'PublicRead', Effect: 'Allow', Principal: '*',
          Action: 's3:GetObject', Resource: `arn:aws:s3:::${bucketName}/*` }],
      }),
    }));
    await s3.send(new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [{
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET','PUT','POST','DELETE','HEAD'],
          AllowedOrigins: [CORS_URL, 'http://localhost:4321'],
          MaxAgeSeconds: 3600,
        }],
      },
    }));
    log(`Bucket created: ${bucketName}`);
  }
  state.bucketName    = bucketName;
  state.imagesBaseUrl = `https://${bucketName}.s3.${REGION}.amazonaws.com`;

  // 5 ── Cognito ─────────────────────────────────────────────────────────────
  step('Cognito User Pool');
  let poolId, clientId;
  if (state.poolId) {
    warn('User Pool already deployed — reusing');
    poolId   = state.poolId;
    clientId = state.clientId;
  } else {
    const pool = await cog.send(new CreateUserPoolCommand({
      PoolName: `${PREFIX}-admins`,
      UsernameAttributes: ['email'],
      AutoVerifiedAttributes: ['email'],
      AdminCreateUserConfig: { AllowAdminCreateUserOnly: true },
      Policies: {
        PasswordPolicy: {
          MinimumLength: 10, RequireUppercase: true,
          RequireLowercase: true, RequireNumbers: true, RequireSymbols: false,
        },
      },
    }));
    poolId = pool.UserPool.Id;

    const client = await cog.send(new CreateUserPoolClientCommand({
      UserPoolId: poolId,
      ClientName: `${PREFIX}-admin-web`,
      GenerateSecret: false,
      ExplicitAuthFlows: [
        'ALLOW_USER_SRP_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH',
        'ALLOW_USER_PASSWORD_AUTH',
      ],
      AccessTokenValidity: 8, IdTokenValidity: 8, RefreshTokenValidity: 30,
      TokenValidityUnits: { AccessToken: 'hours', IdToken: 'hours', RefreshToken: 'days' },
    }));
    clientId = client.UserPoolClient.ClientId;
    log(`User Pool: ${poolId}  Client: ${clientId}`);
  }
  state.poolId    = poolId;
  state.clientId  = clientId;
  state.issuerUrl = `https://cognito-idp.${REGION}.amazonaws.com/${poolId}`;

  // 6 ── API Gateway HTTP API ────────────────────────────────────────────────
  step('API Gateway HTTP API');
  let apiId, apiEndpoint;
  if (state.apiId) {
    warn('API already deployed — reusing');
    apiId       = state.apiId;
    apiEndpoint = state.apiEndpoint;
  } else {
    const api = await apig.send(new CreateApiCommand({
      Name: `${PREFIX}-api`,
      ProtocolType: 'HTTP',
      CorsConfiguration: {
        AllowOrigins: [CORS_URL, 'http://localhost:4321'],
        AllowHeaders: ['Content-Type', 'Authorization'],
        AllowMethods: ['GET','POST','PUT','DELETE','OPTIONS'],
        MaxAge: 600,
      },
    }));
    apiId       = api.ApiId;
    apiEndpoint = api.ApiEndpoint;
    log(`API created: ${apiId}  Endpoint: ${apiEndpoint}`);

    await apig.send(new CreateStageCommand({
      ApiId: apiId,
      StageName: '$default',
      AutoDeploy: true,
    }));
  }
  state.apiId       = apiId;
  state.apiEndpoint = apiEndpoint;

  // 7 ── Cognito JWT Authorizer ──────────────────────────────────────────────
  let authorizerId;
  if (state.authorizerId) {
    warn('Authorizer already created — reusing');
    authorizerId = state.authorizerId;
  } else {
    step('Cognito JWT authorizer');
    const auth = await apig.send(new CreateAuthorizerCommand({
      ApiId: apiId,
      Name: 'cognito-jwt',
      AuthorizerType: 'JWT',
      IdentitySource: ['$request.header.Authorization'],
      JwtConfiguration: {
        Issuer: state.issuerUrl,
        Audience: [clientId],
      },
    }));
    authorizerId = auth.AuthorizerId;
    log(`Authorizer: ${authorizerId}`);
  }
  state.authorizerId = authorizerId;
  saveState(state);

  // ── If we don't have a role yet, stop here and wait ───────────────────────
  if (!roleArn) {
    saveState(state);
    box([
      '  Partial deployment complete!  ',
      '',
      `  DynamoDB table : ${tableName}`,
      `  S3 bucket      : ${bucketName}`,
      `  Cognito pool   : ${poolId}`,
      `  API Gateway    : ${apiEndpoint}`,
      '',
      '  ⏸  Paused — waiting for IAM role.',
      '',
      '  After creating the role in the console,',
      '  re-run:  node deploy.mjs --role-arn=<Role ARN>',
    ]);
    return;
  }

  // 8 ── Bundle & deploy Lambdas ─────────────────────────────────────────────
  const functions = [
    { name: 'getEvents',    entry: 'src/handlers/events/getEvents.mjs',    public: true  },
    { name: 'getEvent',     entry: 'src/handlers/events/getEvent.mjs',     public: true  },
    { name: 'createEvent',  entry: 'src/handlers/events/createEvent.mjs',  public: false },
    { name: 'updateEvent',  entry: 'src/handlers/events/updateEvent.mjs',  public: false },
    { name: 'deleteEvent',  entry: 'src/handlers/events/deleteEvent.mjs',  public: false },
    { name: 'getUploadUrl', entry: 'src/handlers/upload/getUploadUrl.mjs', public: false },
  ];

  const distDir = join(__dir, '.dist');
  if (existsSync(distDir)) rmSync(distDir, { recursive: true });
  mkdirSync(distDir, { recursive: true });

  state.lambdaArns = state.lambdaArns || {};
  const envVars = {
    EVENTS_TABLE:  tableName,
    IMAGES_BUCKET: bucketName,
    CORS_ORIGIN:   CORS_URL,
  };

  for (const fn of functions) {
    const fnName  = `${PREFIX}-${fn.name}`;
    const outFile = join(distDir, `${fn.name}.mjs`);
    const zipFile = join(distDir, `${fn.name}.zip`);

    step(`Bundling + deploying ${fnName}`);
    execSync(
      `node_modules/.bin/esbuild ${fn.entry} --bundle --platform=node --target=node20 --format=esm --outfile="${outFile}"`,
      { cwd: __dir, stdio: 'pipe' }
    );
    execSync(
      `powershell -Command "Compress-Archive -Force -Path '${outFile}' -DestinationPath '${zipFile}'"`,
      { stdio: 'pipe' }
    );

    const zipBuffer = readFileSync(zipFile);
    let fnArn;

    try {
      await lam.send(new GetFunctionCommand({ FunctionName: fnName }));
      warn(`${fnName} exists — updating code`);
      const upd = await lam.send(new UpdateFunctionCodeCommand({
        FunctionName: fnName, ZipFile: zipBuffer,
      }));
      fnArn = upd.FunctionArn;
    } catch {
      const created = await lam.send(new CreateFunctionCommand({
        FunctionName: fnName,
        Runtime: 'nodejs20.x',
        Role: roleArn,
        Handler: `${fn.name}.handler`,
        Code: { ZipFile: zipBuffer },
        Environment: { Variables: envVars },
        Timeout: 10,
        MemorySize: 256,
        Architectures: ['x86_64'],
      }));
      fnArn = created.FunctionArn;
      log(`Lambda created: ${fnArn}`);
    }
    state.lambdaArns[fn.name] = fnArn;
    saveState(state);
  }

  // 9 ── Routes ──────────────────────────────────────────────────────────────
  if (!state.routesCreated) {
    step('Creating API routes');
    const routes = [
      { method: 'GET',    path: '/events',      fn: 'getEvents',    pub: true  },
      { method: 'GET',    path: '/events/{id}', fn: 'getEvent',     pub: true  },
      { method: 'POST',   path: '/events',      fn: 'createEvent',  pub: false },
      { method: 'PUT',    path: '/events/{id}', fn: 'updateEvent',  pub: false },
      { method: 'DELETE', path: '/events/{id}', fn: 'deleteEvent',  pub: false },
      { method: 'POST',   path: '/upload-url',  fn: 'getUploadUrl', pub: false },
    ];

    for (const r of routes) {
      const fnArn = state.lambdaArns[r.fn];
      const integration = await apig.send(new CreateIntegrationCommand({
        ApiId: apiId,
        IntegrationType: 'AWS_PROXY',
        IntegrationUri: fnArn,
        PayloadFormatVersion: '2.0',
      }));

      const routeDef = {
        ApiId: apiId,
        RouteKey: `${r.method} ${r.path}`,
        Target: `integrations/${integration.IntegrationId}`,
      };
      if (!r.pub) {
        routeDef.AuthorizationType = 'JWT';
        routeDef.AuthorizerId = authorizerId;
      }
      await apig.send(new CreateRouteCommand(routeDef));

      try {
        await lam.send(new AddPermissionCommand({
          FunctionName: fnArn,
          StatementId: `apigw-${r.fn}-${Date.now()}`,
          Action: 'lambda:InvokeFunction',
          Principal: 'apigateway.amazonaws.com',
          SourceArn: `arn:aws:execute-api:${REGION}:${accountId}:${apiId}/*/*`,
        }));
      } catch { /* already exists */ }

      log(`Route: ${r.method} ${r.path}`);
    }

    state.routesCreated = true;
    saveState(state);
  } else {
    warn('Routes already created — skipping');
  }

  // 10 ── Write .env ──────────────────────────────────────────────────────────
  const envPath = join(__dir, '..', '.env');
  writeFileSync(envPath, [
    '# Auto-generated by backend/deploy.mjs',
    `PUBLIC_API_URL=${apiEndpoint}`,
    `PUBLIC_COGNITO_POOL_ID=${poolId}`,
    `PUBLIC_COGNITO_CLIENT_ID=${clientId}`,
  ].join('\n') + '\n');
  log('.env updated');

  // 11 ── Summary ─────────────────────────────────────────────────────────────
  box([
    '  🎉  Full deployment complete!  ',
    '',
    `  API URL   : ${apiEndpoint}`,
    `  Pool ID   : ${poolId}`,
    `  Client ID : ${clientId}`,
    `  Bucket    : ${bucketName}`,
    '',
    '  Next — create your admin user in AWS Console:',
    '  Cognito → User Pools → lebventures-admins',
    '  → Users → Create user → enter your email',
    '',
    '  Then rebuild:  npm run build  (in project root)',
  ]);
}

main().catch(err => {
  console.error('\n❌  Deployment failed:', err.message ?? err);
  process.exit(1);
});

