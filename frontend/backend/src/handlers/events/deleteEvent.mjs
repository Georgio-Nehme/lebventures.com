import { DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { db, TABLE, response, errorResponse } from '../../shared/db.mjs';

const s3 = new S3Client({});

export const handler = async (event) => {
  const { id } = event.pathParameters ?? {};
  if (!id) return errorResponse(400, 'Missing event id');

  try {
    const existing = await db.send(new GetCommand({ TableName: TABLE, Key: { id } }));
    if (!existing.Item) return errorResponse(404, 'Event not found');

    // Delete associated S3 image if present
    const item = existing.Item;
    if (item.image) {
      const key = item.image.replace(/^\//, '');
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: process.env.IMAGES_BUCKET, Key: key }));
      } catch (s3Err) {
        console.warn('S3 image deletion failed (continuing):', s3Err.message);
      }
    }

    await db.send(new DeleteCommand({ TableName: TABLE, Key: { id } }));
    return response(200, { deleted: id });
  } catch (err) {
    console.error('deleteEvent error:', err);
    return errorResponse(500, 'Failed to delete event');
  }
};
