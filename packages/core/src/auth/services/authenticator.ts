export interface IAuthenticator {
  sign(payload: Record<string, unknown>, options?: Record<string, unknown>): Promise<string>;
} 