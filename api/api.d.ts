
declare namespace Express {
  export interface Request {
    token: { id: string, email: string };
  }
}
