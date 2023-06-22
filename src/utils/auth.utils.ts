import * as argon from 'argon2';

export async function hashString(value: string): Promise<string> {
  return await argon.hash(value);
}
