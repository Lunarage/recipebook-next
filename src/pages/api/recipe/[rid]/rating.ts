import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import type { ApiResponse, RecipeRating } from '@/types/APIResponses';
import {
  HTTP_METHOD_NOT_ALLOWED,
  HTTP_UNAUTHORIZED,
} from '@/lib/html_codes';
import createOrUpdateRating from '@/lib/prisma/rating/createOrUpdateRating';
import { handleDatabaseResult } from '@/lib/prisma/common';

const secret = process.env.SECRET;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<RecipeRating>>,
) {
  switch (request.method) {
    case 'POST': {
      const jwToken = await getToken({ req: request, secret });

      if (!jwToken) {
        response.status(HTTP_UNAUTHORIZED);
        response.json({ message: 'Not signed in', content: [] });
        response.end();
        return;
      }

      const uid = jwToken.user.id;
      const { rid, rating } = request.body;

      const result = await createOrUpdateRating({ rid, uid, rating });
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
