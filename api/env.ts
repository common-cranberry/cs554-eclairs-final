
export const JWT_SECRET: string =
  process.env.JWT_SECRET || "llama";

export const BCRYPT_ROUNDS: number =
  Number(process.env.BCRYPT_ROUNDS || 12);

export const PORT: number =
  Number(process.env.PORT || 3000);

export const MONGO_HOST: string =
  process.env.MONGO_HOST || "localhost";

export const MONGO_PORT: string =
  process.env.MONGO_PORT || "27017";

export const MONGO_BASE: string =
  process.env.MONGO_BASE || "554fp";

export const MONGO_COLLECTION_USERS: string =
  process.env.MONGO_COLLECTION_USERS || "users";

export const MONGO_COLLECTION_POSTS: string =
  process.env.MONGO_COLLECTION_POSTS || "posts";
