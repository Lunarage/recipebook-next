import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiResponse, RecipeRating } from '@/types/APIResponses';
import { HTTP_METHOD_NOT_ALLOWED, HTTP_OK } from '@/lib/html_codes';
import getRating from '@/lib/prisma/rating/getRating';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<RecipeRating>>,
) {
  switch (request.method) {
    case 'GET': {
      const rid = Number(request.query.rid);
      const uid = Number(request.query.uid);
      const result = await getRating({ rid, uid });
      response.status(HTTP_OK);
      response.json({ message: result.message, content: result.content });
      response.end();
      break;
    }
    default: {
      response.status(HTTP_METHOD_NOT_ALLOWED);
      response.json({ message: 'Method not allowed', content: [] });
      response.end();
    }
  }
}
