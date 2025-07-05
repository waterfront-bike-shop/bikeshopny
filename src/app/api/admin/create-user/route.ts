// app/api/admin/create-user/route.ts
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import argon2 from 'argon2';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = token ? verifyJWT(token) : null;

  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { email, username, password, firstName, lastName } = await req.json();

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashed = await argon2.hash(password);

  await prisma.user.create({
    data: {
      email,
      username,
      password: hashed,
      firstName,
      lastName,
      isActive: true,
      isAdmin: false, // default unless specified
    },
  });

  return NextResponse.json({ success: true });
}
