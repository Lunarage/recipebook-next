import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { HTTP_OK, HTTP_UNAUTHORIZED } from '@/lib/html_codes';
import createRecipe from '@/lib/prisma/recipe/createRecipe';
import getRecipes from '@/lib/prisma/recipe/getRecipes';
import { ApiResponse, Recipe } from '@/types/APIResponses';

const secret = process.env.SECRET;

const handler: NextApiHandler = async (
  request: NextApiRequest,
  response: NextApiResponse<ApiResponse<Recipe[]>>,
) => {
  switch (request.method) {
    case 'GET': {
      const { byAge, byRating, limit } = request.query;
      const result = await getRecipes(
        Boolean(byRating),
        Boolean(byAge),
        Number(limit),
      );
      response.status(HTTP_OK);
      response.json({ message: result.message, content: result.content });
      response.end();
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

      const { title, description, ingredients, steps } = request.body;
      const result = await createRecipe({
        title,
        description,
        ingredients,
        steps,
        authorId,
      });
      response.status(HTTP_OK);
      response.json({ message: result.message, content: result.content });
      response.end();
      break;
    }
    default: {
      response.status(405);
      response.json({ message: 'Method not allowed', content: [] });
      response.end();
    }
  }
};

export default handler;
