import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiResponse, Recipe } from '@/types/APIResponses';
import getRecipe from '@/lib/prisma/recipe/getRecipe';
import { HTTP_METHOD_NOT_ALLOWED } from '@/lib/html_codes';
import { handleDatabaseResult } from '@/lib/prisma/common';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<Recipe>>,
) {
  const rid = Number(request.query.rid);
  switch (request.method) {
    case 'GET': {
      const result = await getRecipe({ rid });
      handleDatabaseResult(result, response);
      break;
    }
    default: {
      response.status(HTTP_METHOD_NOT_ALLOWED);
      response.json({ message: 'Method not allowed', content: {} });
      response.end();
    }
  }
}
