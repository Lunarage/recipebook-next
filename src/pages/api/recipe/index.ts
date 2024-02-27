import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { HTTP_METHOD_NOT_ALLOWED, HTTP_UNAUTHORIZED } from '@/lib/html_codes';
import createRecipe from '@/lib/prisma/recipe/createRecipe';
import getRecipes from '@/lib/prisma/recipe/getRecipes';
import { ApiResponse, Recipe } from '@/types/APIResponses';
import { handleDatabaseResult } from '@/lib/prisma/common';

const secret = process.env.SECRET;

const handler: NextApiHandler = async (
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<Recipe[]>>,
) => {
  switch (request.method) {
    case 'GET': {
      const { sort, limit, title } = request.query;
      const categories = request.query.categories
        ? (request.query.categories as string).split(',')
        : [];

      const result = await getRecipes({
        filters: {
          categories: (categories as string[]).map((category) => {
            return Number(category);
          }),
          title: String(title),
        },
        sort: String(sort),
        limit: Number(limit),
      });
      handleDatabaseResult(result, response);
      break;
    }
    case 'POST': {
      const jwToken = await getToken({ req: request, secret });

      if (!jwToken) {
        response.status(HTTP_UNAUTHORIZED);
        response.json({ message: 'Not signed in', content: [] });
        response.end();
        return;
      }

      const authorId = jwToken.user.id;

      const { title, description, ingredients, steps, categories } =
        request.body;
      const result = await createRecipe({
        title,
        description,
        ingredients,
        steps,
        authorId,
        categories,
      });
      handleDatabaseResult(result, response);
      break;
    }
    default: {
      response.status(HTTP_METHOD_NOT_ALLOWED);
      response.json({ message: 'Method not allowed', content: [] });
      response.end();
    }
  }
};

export default handler;
