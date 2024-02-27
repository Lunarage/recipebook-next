import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiResponse, RecipeRating } from '@/types/APIResponses';
import { HTTP_METHOD_NOT_ALLOWED } from '@/lib/html_codes';
import getRating from '@/lib/prisma/rating/getRating';
import { handleDatabaseResult } from '@/lib/prisma/common';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<RecipeRating>>,
) {
  switch (request.method) {
    case 'GET': {
      const rid = Number(request.query.rid);
      const uid = Number(request.query.uid);
      const result = await getRating({ rid, uid });
      handleDatabaseResult(result, response);
      break;
    }
    default: {
      response.status(HTTP_METHOD_NOT_ALLOWED);
      response.json({ message: 'Method not allowed', content: [] });
      response.end();
    }
  }
}
