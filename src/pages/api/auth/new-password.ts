import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username, password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: {
      username,
    },
    data: {
      password: hashPassword,
    },
  });
  res.status(200).end();
}
