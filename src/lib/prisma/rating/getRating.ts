import { ValidationError, number, object } from 'yup';
// import {
//   PrismaClientKnownRequestError,
//   PrismaClientUnknownRequestError,
//   PrismaClientValidationError,
// } from '@prisma/client/runtime/library';
import type { databaseResult } from '@/lib/prisma/common';
import prisma from '@/lib/prisma/prisma';

export default async function getRating({
  rid,
  uid,
}: {
  rid: number;
  uid: number;
}): Promise<databaseResult> {
  const data = { rid, uid };

  const ratingSchema = object({
    rid: number().required(),
    uid: number().required(),
  });
  try {
    await ratingSchema.validate(data);
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
    const castData = ratingSchema.cast(data);
    const response = await prisma.recipeRating.findUnique({
      where: {
        recipeId_userId: {
          recipeId: castData.rid,
          userId: castData.uid,
        },
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
