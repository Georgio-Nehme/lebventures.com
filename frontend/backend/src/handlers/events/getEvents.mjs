import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLE, response, errorResponse } from '../../shared/db.mjs';

export const handler = async () => {
  try {
    const result = await db.send(new ScanCommand({ TableName: TABLE }));
    const events = (result.Items ?? []).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    return response(200, events);
  } catch (err) {
    console.error('getEvents error:', err);
    return errorResponse(500, 'Failed to fetch events');
  }
};
