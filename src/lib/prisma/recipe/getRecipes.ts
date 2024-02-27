import { ValidationError, array, number, object, string } from 'yup';
// import {
//   PrismaClientKnownRequestError,
//   PrismaClientUnknownRequestError,
//   PrismaClientValidationError,
// } from '@prisma/client/runtime/library';
import { userFieldsMinimal } from '@/lib/auth/common';
import type { databaseResult } from '@/lib/prisma/common';
import type { Recipe } from '@/types/APIResponses';
import prisma from '@/lib/prisma/prisma';

export default async function getRecipes({
  filters,
  sort,
  limit,
}: {
  filters?: {
    title?: string;
    categories?: number[];
  };
  sort: string;
  limit: number;
}): Promise<databaseResult> {
  const data = { filters, sort, limit };
  const searchSchema = object({
    filters: object({
      title: string(),
      categories: array().of(number()),
    }),
    sort: string(), // .matches(/(byAge) | (byRating) | (byTitle)/),
    limit: number().min(1).required(),
  });
  try {
    await searchSchema.validate(data);
  } catch (error: any) {
    if (!(error instanceof ValidationError)) {
      const result: databaseResult = {
        type: 'UNKNOWN',
        message: error.message,
      };
      return Promise.resolve(result);
    }
    const result: databaseResult = {
      type: 'INVALID INPUT',
      message: error.errors.join(),
    };
    return Promise.resolve(result);
  }
  try {
    const {
      sort: castSort,
      limit: castLimit,
      filters: castFilters,
    } = searchSchema.cast(data);
    if (castSort === 'byRating') {
      const response = await prisma.$queryRaw<Recipe>`
          WITH categories AS (
            SELECT "Category".id, name, "B"
            FROM "Category"
            JOIN "_CategoryToRecipe" ON "A" = "Category".id
          )
          SELECT
          id,
          "createdAt",
          "updatedAt",
          "authorId",
          title,
          description,
          steps,
          (SELECT row_to_json(t)::jsonb FROM (SELECT "User".id, "User".username, "User".name FROM "User" WHERE "User".id = "Recipe"."authorId") t) as author,
          (SELECT COALESCE(json_agg(t.*), '[]'::json) FROM (SELECT * FROM "Ingredient" WHERE "Ingredient"."recipeId" = "Recipe".id) as t) as "Ingredient",
          (SELECT COALESCE(json_agg(t.*), '[]'::json) FROM (SELECT id, name FROM categories WHERE "B" = "Recipe".id ) as t) as "Category",
          (SELECT COALESCE(json_agg(t.*), '[]'::json) FROM (SELECT * FROM "RecipeRating" WHERE "RecipeRating"."recipeId" = "Recipe".id) as t) as "RecipeRating"
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
    const sortToObject = {
      byAge: { createdAt: 'desc' },
      byTitle: { title: 'desc' },
    };
    const orderBy = sortToObject[castSort];
    let where = {};
    if (castFilters.categories?.length) {
      where = {
        Category: {
          every: {
            id: {
              in: castFilters.categories,
            },
          },
        },
        ...where,
      };
    }
    if (castFilters.title) {
      where = {
        title: { contains: castFilters.title },
      };
    }
    console.log(where);
    const response = await prisma.recipe.findMany({
      where,
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
      orderBy,
      take: castLimit || 3,
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
