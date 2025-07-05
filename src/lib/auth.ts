import jwt, { SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';  // <-- import this for correct expiresIn typing sting + num

// Ensure JWT_SECRET is defined and typed correctly
const jwt_secret = process.env.JWT_SECRET;
if (!jwt_secret) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET: string = jwt_secret;

export interface JwtPayload {
  sub: string; // user id
  email: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

export function signJWT(
  payload: JwtPayload,
  expiresIn: StringValue | number = '7d'  // <-- use StringValue | number here
): string {
  console.log("signJWT running");
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJWT(token: string): JwtPayload | null {
  try {
    console.log("verifyJWT running");
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (
      typeof decoded === 'object' && 
      decoded !== null && 
      'sub' in decoded && 
      'email' in decoded && 
      'isAdmin' in decoded
    ) {
      return decoded as JwtPayload;
    }
    return null;
  } catch {
    return null;
  }
}
