export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
}
 
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
 