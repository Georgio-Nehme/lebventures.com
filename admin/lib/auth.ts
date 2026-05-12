const REGION    = process.env.NEXT_PUBLIC_COGNITO_REGION!;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const ENDPOINT  = `https://cognito-idp.${REGION}.amazonaws.com/`;

async function cognitoPost(target: string, body: object) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.__type || 'Auth error');
  return data;
}

export interface AuthResult {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export interface NewPasswordRequired {
  type: 'NEW_PASSWORD_REQUIRED';
  session: string;
  username: string;
}

export interface PasswordResetRequired {
  type: 'PASSWORD_RESET_REQUIRED';
  username: string;
}

export async function signIn(
  username: string,
  password: string
): Promise<AuthResult | NewPasswordRequired | PasswordResetRequired> {
  try {
    const data = await cognitoPost('InitiateAuth', {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: { USERNAME: username, PASSWORD: password },
    });

    if (data.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      return { type: 'NEW_PASSWORD_REQUIRED', session: data.Session, username };
    }

    return {
      idToken:      data.AuthenticationResult.IdToken,
      accessToken:  data.AuthenticationResult.AccessToken,
      refreshToken: data.AuthenticationResult.RefreshToken,
    };
  } catch (err: unknown) {
    if (err instanceof Error && (err.message.includes('PasswordResetRequiredException') || err.message.includes('Password reset required'))) {
      await cognitoPost('ForgotPassword', { ClientId: CLIENT_ID, Username: username });
      return { type: 'PASSWORD_RESET_REQUIRED', username };
    }
    throw err;
  }
}

export async function confirmForgotPassword(
  username: string,
  code: string,
  newPassword: string
): Promise<void> {
  await cognitoPost('ConfirmForgotPassword', {
    ClientId: CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
  });
}

export async function setNewPassword(
  username: string,
  newPassword: string,
  session: string
): Promise<AuthResult> {
  const data = await cognitoPost('RespondToAuthChallenge', {
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ClientId: CLIENT_ID,
    ChallengeResponses: { USERNAME: username, NEW_PASSWORD: newPassword },
    Session: session,
  });
  return {
    idToken:      data.AuthenticationResult.IdToken,
    accessToken:  data.AuthenticationResult.AccessToken,
    refreshToken: data.AuthenticationResult.RefreshToken,
  };
}

export function saveAuth(auth: AuthResult) {
  sessionStorage.setItem('lv_id_token',      auth.idToken);
  sessionStorage.setItem('lv_access_token',  auth.accessToken);
  sessionStorage.setItem('lv_refresh_token', auth.refreshToken);
}

export function getToken(): string | null {
  return sessionStorage.getItem('lv_id_token');
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function signOut() {
  sessionStorage.removeItem('lv_id_token');
  sessionStorage.removeItem('lv_access_token');
  sessionStorage.removeItem('lv_refresh_token');
}
