// import { ValidationError, array, number, object, string } from 'yup';
// import {
//   PrismaClientKnownRequestError,
//   PrismaClientUnknownRequestError,
//   PrismaClientValidationError,
// } from '@prisma/client/runtime/library';
import type { databaseResult } from '@/lib/prisma/common';
import prisma from '@/lib/prisma/prisma';

export default async function getCategories(): Promise<databaseResult> {
  try {
    const response = await prisma.category.findMany();
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
