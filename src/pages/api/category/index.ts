import { NextApiRequest, NextApiResponse } from 'next';
import { Category } from '@prisma/client';
import { ApiResponse } from '@/types/APIResponses';
import getCategories from '@/lib/prisma/category/getRecipes';
import { handleDatabaseResult } from '@/lib/prisma/common';
import { HTTP_METHOD_NOT_ALLOWED } from '@/lib/html_codes';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<Category>>,
) {
  switch (request.method) {
    case 'GET': {
      const result = await getCategories();
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
