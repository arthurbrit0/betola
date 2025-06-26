import { jwtVerify, JWTPayload } from 'jose';

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
}
const secretKey = new TextEncoder().encode(secret);

export async function verifyAuthToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secretKey);
  return payload;
} 