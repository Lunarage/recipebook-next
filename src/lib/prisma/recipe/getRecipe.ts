import { ValidationError, number, object } from 'yup';
// import {
//   PrismaClientKnownRequestError,
//   PrismaClientUnknownRequestError,
//   PrismaClientValidationError,
// } from '@prisma/client/runtime/library';
import { userFieldsMinimal } from '@/lib/auth/common';
import type { databaseResult } from '@/lib/prisma/common';
import prisma from '@/lib/prisma/prisma';

export default async function getRecipe({
  rid,
}: {
  rid: number;
}): Promise<databaseResult> {
  const data = { rid };

  const recipeSchema = object({
    rid: number().required(),
  });
  try {
    await recipeSchema.validate(data);
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
    const castData = recipeSchema.cast(data);
    const response = await prisma.recipe.findUnique({
      where: {
        id: castData.rid,
      },
      include: {
        author: { select: userFieldsMinimal },
        Ingredient: true,
        Category: true,
        RecipeRating: true,
      },
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
