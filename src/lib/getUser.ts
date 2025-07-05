// lib/getUser.ts
import { verifyJWT } from './auth';
import { cookies } from 'next/headers';

export async function getUser() {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const user = verifyJWT(token);
    return user;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
}
