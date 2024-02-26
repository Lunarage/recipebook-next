import type { NextApiRequest, NextApiResponse } from 'next';
import type { ApiResponse, Recipe } from '@/types/APIResponses';
import getRecipe from '@/lib/prisma/recipe/getRecipe';
import {
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_TEAPOT,
} from '@/lib/html_codes';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<Recipe>>,
) {
  const rid = Number(request.query.rid);
  switch (request.method) {
    case 'GET': {
      const result = await getRecipe({ rid });
      switch (result.type) {
        case 'OK': {
          response.status(HTTP_OK);
          response.json({ message: result.message, content: result.content });
          response.end();
          break;
        }
        case 'INVALID INPUT': {
          response.status(HTTP_BAD_REQUEST);
          response.json({ message: result.message, content: {} });
          response.end();
          break;
        }
        case 'NOT FOUND': {
          response.status(HTTP_NOT_FOUND);
          response.json({ message: result.message, content: {} });
          response.end();
          break;
        }
        case 'SERVER ERROR': {
          response.status(HTTP_INTERNAL_SERVER_ERROR);
          response.json({ message: result.message, content: {} });
          response.end();
          break;
        }
        case 'UNKNOWN': {
          response.status(HTTP_INTERNAL_SERVER_ERROR);
          response.json({ message: result.message, content: {} });
          response.end();
          break;
        }
        default: {
          response.status(HTTP_TEAPOT);
          response.end();
        }
      }
      break;
    }
    case 'PUT': {
      const result = await getRecipe({ rid });
      response.status(HTTP_OK);
      response.json({ message: result.message, content: result.content });
      response.end();
      break;
    }
    case 'DELETE': {
      const result = await getRecipe({ rid });
      response.status(HTTP_OK);
      response.json({ message: result.message, content: result.content });
      response.end();
      break;
    }
    default: {
      response.status(405);
      response.json({ message: 'Method not allowed', content: {} });
      response.end();
    }
  }
}
