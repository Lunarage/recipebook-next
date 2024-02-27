import { ValidationError, array, number, object, string } from 'yup';
// import {
//   PrismaClientKnownRequestError,
//   PrismaClientUnknownRequestError,
//   PrismaClientValidationError,
// } from '@prisma/client/runtime/library';
import type { databaseResult } from '@/lib/prisma/common';
import prisma from '@/lib/prisma/prisma';

export default async function createRecipe({
  title,
  description,
  ingredients,
  steps,
  authorId,
  categories,
}: {
  title: string;
  description: string;
  ingredients: [];
  steps: [];
  authorId: number;
  categories: string[];
}): Promise<databaseResult> {
  const data = { title, description, ingredients, steps, authorId, categories };

  const recipeSchema = object({
    title: string().required(),
    description: string().ensure(),
    ingredients: array().of(
      object({
        name: string().required(),
        amount: number().required(),
        unit: string().required(),
      }),
    ),
    steps: array().of(string().ensure()),
    authorId: number(),
    categories: array()
      .of(object({ name: string().ensure() }))
      .required(),
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
    const [response0, response] = await prisma.$transaction([
      prisma.category.createMany({
        data: castData.categories,
        skipDuplicates: true,
      }),
      prisma.recipe.create({
        data: {
          description: castData.description,
          title: castData.title,
          authorId: castData.authorId,
          steps: castData.steps,
          Ingredient: {
            create: castData.ingredients,
          },
          Category: {
            connect: castData.categories,
          },
        },
      }),
    ]);
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
