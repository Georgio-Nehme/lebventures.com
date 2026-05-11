import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { response, errorResponse } from '../../shared/db.mjs';

const s3 = new S3Client({});
const BUCKET = process.env.IMAGES_BUCKET;

const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/gpx+xml': 'gpx',
  'application/vnd.google-earth.kml+xml': 'kml',
};

export const handler = async (event) => {
  let body;
  try { body = JSON.parse(event.body ?? '{}'); }
  catch { return errorResponse(400, 'Invalid JSON body'); }

  const { eventId, contentType, purpose = 'image' } = body;

  if (!eventId) return errorResponse(400, 'eventId is required');
  if (!contentType || !ALLOWED_TYPES[contentType])
    return errorResponse(400, `contentType must be one of: ${Object.keys(ALLOWED_TYPES).join(', ')}`);

  const ext = ALLOWED_TYPES[contentType];
  const folder = purpose === 'trail' ? 'trails' : 'images/events';
  const key = `${folder}/${eventId}.${ext}`;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min

    return response(200, {
      uploadUrl,
      publicUrl: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key,
    });
  } catch (err) {
    console.error('getUploadUrl error:', err);
    return errorResponse(500, 'Failed to generate upload URL');
  }
};
