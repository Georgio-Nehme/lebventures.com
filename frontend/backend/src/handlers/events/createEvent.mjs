import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLE, response, errorResponse } from '../../shared/db.mjs';
import { randomUUID } from 'crypto';

const VALID_TYPES = ['hiking','climbing','camping','heritage','canyoning','biking','workshop','water','snow','leisure','kids'];
const VALID_DIFFICULTIES = ['Easy','Moderate','Challenging','Expert'];

function validate(data) {
  const required = ['title','type','date','time','duration','location','region','lat','lng','difficulty','spots','spotsLeft','price','description','highlights','guide'];
  for (const field of required) {
    if (data[field] === undefined || data[field] === null || data[field] === '')
      return `Missing required field: ${field}`;
  }
  if (!VALID_TYPES.includes(data.type)) return `Invalid type: ${data.type}`;
  if (!VALID_DIFFICULTIES.includes(data.difficulty)) return `Invalid difficulty: ${data.difficulty}`;
  if (!Array.isArray(data.highlights) || data.highlights.length === 0) return 'highlights must be a non-empty array';
  return null;
}

export const handler = async (event) => {
  let body;
  try { body = JSON.parse(event.body ?? '{}'); }
  catch { return errorResponse(400, 'Invalid JSON body'); }

  const validationError = validate(body);
  if (validationError) return errorResponse(400, validationError);

  const item = {
    ...body,
    id: `ev-${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    spots: Number(body.spots),
    spotsLeft: Number(body.spotsLeft),
    price: Number(body.price),
    lat: Number(body.lat),
    lng: Number(body.lng),
  };

  try {
    await db.send(new PutCommand({ TableName: TABLE, Item: item }));
    return response(201, item);
  } catch (err) {
    console.error('createEvent error:', err);
    return errorResponse(500, 'Failed to create event');
  }
};
