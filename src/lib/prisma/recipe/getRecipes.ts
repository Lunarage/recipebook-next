// import { ValidationError, array, number, object, string } from 'yup';
// import {
//   PrismaClientKnownRequestError,
//   PrismaClientUnknownRequestError,
//   PrismaClientValidationError,
// } from '@prisma/client/runtime/library';
import { userFieldsMinimal } from '@/lib/auth/common';
import type { databaseResult } from '@/lib/prisma/common';
import type { Recipe } from '@/types/APIResponses';
import prisma from '@/lib/prisma/prisma';

export default async function getRecipes(
  byRating: boolean = false,
  byAge: boolean = false,
  limit: number = 3,
): Promise<databaseResult> {
  try {
    if (byRating) {
      // const response = await prisma.recipe.findMany({
      //   include: {
      //     author: { select: userFieldsMinimal },
      //     Ingredient: true,
      //     Category: true,
      //     RecipeRating: true,
      //   },
      //   take: limit,
      // });
      const response = await prisma.$queryRaw<Recipe>`SELECT
          id,
          "createdAt",
          "updatedAt",
          "authorId",
          title,
          description,
          steps,
          (SELECT row_to_json(t)::jsonb FROM (SELECT "User".id, "User".username, "User".name FROM "User" WHERE "User".id = "Recipe"."authorId") t) as author,
          (SELECT json_agg(json_build_object('id', id, 'name', name, 'amount', amount, 'unit', unit)) FROM (SELECT * FROM "Ingredient" WHERE "Ingredient"."recipeId" = "Recipe".id)) as "Ingredient",
          -- (SELECT json_agg(json_build_object('id', id, 'name', name)) FROM (SELECT id, name FROM "Category" WHERE id IN (SELECT "A" FROM "_CategoryToRecipe" WHERE "B" = "Recipe".id))) as "Category"
          (SELECT json_agg(json_build_object('rating', rating, 'recipeId', "recipeId", 'userId', "userId")) FROM (SELECT * FROM "RecipeRating" WHERE "RecipeRating"."recipeId" = "Recipe".id)) as "RecipeRating"
        FROM "Recipe" 
        ORDER BY (SELECT COALESCE(AVG(rating),0) FROM "RecipeRating" WHERE "recipeId" = "Recipe".id) DESC
        LIMIT ${limit}`;
      const result: databaseResult = {
        type: 'OK',
        message: 'OK',
        content: response,
      };
      return Promise.resolve(result);
    }
    if (byAge) {
      const response = await prisma.recipe.findMany({
        include: {
          author: { select: userFieldsMinimal },
          Ingredient: {
            select: {
              id: true,
              name: true,
              amount: true,
              unit: true,
            },
          },
          Category: true,
          RecipeRating: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      const result: databaseResult = {
        type: 'OK',
        message: 'OK',
        content: response,
      };
      return Promise.resolve(result);
    }
    const response = await prisma.recipe.findMany({
      include: {
        author: { select: userFieldsMinimal },
        Ingredient: {
          select: {
            id: true,
            name: true,
            amount: true,
            unit: true,
          },
        },
        Category: true,
        RecipeRating: true,
      },
      take: limit || 3,
    });
    const result: databaseResult = {
      type: 'OK',
      message: 'OK',
      content: response,
    };
    return Promise.resolve(result);
  } catch (error: any) {
    const result: databaseResult = {
      type: 'UNKNOWN',
      message: error.message,
    };
    return Promise.resolve(result);
  }
}
