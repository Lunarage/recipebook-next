import { NextApiResponse } from 'next';
import {
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND,
  HTTP_OK,
  HTTP_TEAPOT,
} from '../html_codes';

export interface databaseResult {
  type: 'OK' | 'INVALID INPUT' | 'SERVER ERROR' | 'NOT FOUND' | 'UNKNOWN';
  message: string;
  content?: any;
}

export const handleDatabaseResult = (
  result: databaseResult,
  response: NextApiResponse,
) => {
  switch (result.type) {
    case 'OK': {
      response.status(HTTP_OK);
      response.json({ message: result.message, content: result.content });
      response.end();
      break;
    }
    case 'INVALID INPUT': {
      response.status(HTTP_BAD_REQUEST);
      response.json({ message: result.message, content: [] });
      response.end();
      break;
    }
    case 'NOT FOUND': {
      response.status(HTTP_NOT_FOUND);
      response.json({ message: result.message, content: [] });
      response.end();
      break;
    }
    case 'SERVER ERROR': {
      response.status(HTTP_INTERNAL_SERVER_ERROR);
      response.json({ message: result.message, content: [] });
      response.end();
      break;
    }
    case 'UNKNOWN': {
      response.status(HTTP_INTERNAL_SERVER_ERROR);
      response.json({ message: result.message, content: [] });
      response.end();
      break;
    }
    default: {
      response.status(HTTP_TEAPOT);
      response.json({ message: 'I AM A TEAPOT', content: [] });
      response.end();
    }
  }
};
