import { UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLE, response, errorResponse } from '../../shared/db.mjs';

// Fields the client is allowed to update
const MUTABLE_FIELDS = ['title','type','date','time','duration','location','region','lat','lng',
  'difficulty','spots','spotsLeft','price','description','highlights','guide','image','trailFile'];

export const handler = async (event) => {
  const { id } = event.pathParameters ?? {};
  if (!id) return errorResponse(400, 'Missing event id');

  let body;
  try { body = JSON.parse(event.body ?? '{}'); }
  catch { return errorResponse(400, 'Invalid JSON body'); }

  // Verify the event exists
  try {
    const existing = await db.send(new GetCommand({ TableName: TABLE, Key: { id } }));
    if (!existing.Item) return errorResponse(404, 'Event not found');
  } catch (err) {
    console.error('updateEvent lookup error:', err);
    return errorResponse(500, 'Failed to fetch event');
  }

  const updates = Object.entries(body).filter(([k]) => MUTABLE_FIELDS.includes(k));
  if (updates.length === 0) return errorResponse(400, 'No valid fields to update');

  updates.push(['updatedAt', new Date().toISOString()]);

  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};
  const setParts = updates.map(([k, v], i) => {
    const nameKey = `#f${i}`;
    const valKey = `:v${i}`;
    ExpressionAttributeNames[nameKey] = k;
    ExpressionAttributeValues[valKey] = v;
    return `${nameKey} = ${valKey}`;
  });

  try {
    const result = await db.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression: `SET ${setParts.join(', ')}`,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }));
    return response(200, result.Attributes);
  } catch (err) {
    console.error('updateEvent error:', err);
    return errorResponse(500, 'Failed to update event');
  }
};
