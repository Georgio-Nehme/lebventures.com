import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLE, response, errorResponse } from '../../shared/db.mjs';

export const handler = async (event) => {
  const { id } = event.pathParameters ?? {};
  if (!id) return errorResponse(400, 'Missing event id');

  try {
    const result = await db.send(new GetCommand({ TableName: TABLE, Key: { id } }));
    if (!result.Item) return errorResponse(404, 'Event not found');
    return response(200, result.Item);
  } catch (err) {
    console.error('getEvent error:', err);
    return errorResponse(500, 'Failed to fetch event');
  }
};
