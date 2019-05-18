
import { MongoClient, Db, Collection } from "mongodb";

import {
  MONGO_HOST, MONGO_PORT, MONGO_BASE,
  MONGO_TOKEN, MONGO_OPTIONS,
  MONGO_COLLECTION_USERS,
  MONGO_COLLECTION_POSTS } from "../env";

import { User, Post } from "./types";

async function getClient ( ): Promise<MongoClient> {
  return MongoClient.connect(
    `mongodb://${
      MONGO_TOKEN ? MONGO_TOKEN + "@" : ""
    }${MONGO_HOST}:${MONGO_PORT}${MONGO_OPTIONS}`,
    { useNewUrlParser: true });
}

async function getDatabase ( ): Promise<Db> {
  const client = await getClient();
  return client.db(MONGO_BASE);
}

async function getCollection (
  collection: string
): Promise<Collection> {
  const db: Db = await getDatabase();
  return db.collection(collection);
};

export async function getUsersCollection ( ): Promise<Collection<User>> {
  return getCollection(MONGO_COLLECTION_USERS);
}
export async function getPostsCollection ( ): Promise<Collection<Post>> {
  return getCollection(MONGO_COLLECTION_POSTS);
}
