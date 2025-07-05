import jwt, { SignOptions } from 'jsonwebtoken';

// Ensure JWT_SECRET is defined and typed correctly
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

export function signJWT(
  payload: JwtPayload,
  expiresIn: string | number = '7d'
): string {
  console.log("signJWT running")
  const options: SignOptions = { 
    expiresIn: expiresIn as any // Cast to any to bypass the StringValue type issue
  };
  return jwt.sign(payload, JWT_SECRET as string, options);
}

export function verifyJWT(token: string): JwtPayload | null {
  try {
    console.log("veriftJWT running")
    const decoded = jwt.verify(token, JWT_SECRET as string);
    
    // Type guard to ensure the decoded token has the expected shape
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