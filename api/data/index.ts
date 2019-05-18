
import {
  getUsersCollection, getPostsCollection
} from "./config";
import { Collection, WriteOpResult,
  UpdateWriteOpResult } from "mongodb";
import uuidv1 from "uuid/v1";
import bcrypt from "bcrypt";

import { User, Post } from "./types";

const usersPromise: Promise<Collection<User>> = getUsersCollection();
const postsPromise: Promise<Collection<Post>> = getPostsCollection();

export async function addUser(
  name: string, email: string, password: string, dob: Date
): Promise<User> {
  if (await getUserByEmail(email) !== null) {
    throw new Error("DB Error User already exists for email");
  }

  const _id: string = uuidv1();

  const users: Collection<User> = await usersPromise;
  const insert = await users.insertOne({
    _id, name, email,
    password, dob
  });
  if (insert.insertedCount === 0) {
    throw new Error("DB Error adding user");
  }
  // return user info by checking for it in the DB
  return getUserById(_id) as Promise<User>;
}

export async function getUserById ( id: string ): Promise<User | null> {
  const users: Collection<User> = await usersPromise;
  return users.findOne({ _id: id });
}

export async function getUserByEmail ( email:string ): Promise<User | null> {
  const users: Collection<User> = await usersPromise;
  return users.findOne({ email });
}

export async function checkPw ( email: string, password: string ): Promise<boolean> {
  const user: User | null = await getUserByEmail(email);
  if (user === null) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(password, user.password);
}

export async function getAllPostsById ( id: string ): Promise<Array<Post>> {
  const posts: Collection<Post> = await postsPromise;
  const postList: Array<Post> = await posts.find({ user: id }).toArray();
  return postList || [ ];
}

export async function getSinglePostByUserDate ( id: string, date: Date ): Promise<Post | null> {
  const posts: Collection<Post> = await postsPromise;
  return posts.findOne({ user: id, date: date });
}

export async function getPostById ( id: string ): Promise<Post | null> {
  const posts: Collection<Post> = await postsPromise;
  return await posts.findOne({ _id: id });
}

export async function updatePost( uid: string, date: Date, content: string ): Promise<Post | null> {
  const posts: Collection<Post> = await postsPromise;
  const post: UpdateWriteOpResult = await posts.updateOne({
    user: uid, date: date
  }, {
    $set: { content: content }
  });
  if (post === null) {
    throw new Error("DB Error Post not found");
  }
  return getPostById(uid);
}

export async function addEntry ( uid: string, date: Date, content: string ): Promise<Post | null> {
  if ((await getSinglePostByUserDate(uid, date)) != null) {
    throw "DB Error Post already exists for that User/Date";
  }

  const _id: string = uuidv1();

  const posts: Collection<Post> = await postsPromise;
  const insert = await posts.insertOne({
    _id, user: uid,
    date, content
  });
  if (insert.insertedCount === 0) {
    throw new Error("DB Error adding user");
  }
  // return user info by checking for it in the DB
  return getPostById(_id);
}

export async function deletePost ( uid: string, date: Date ): Promise<boolean> {
  const posts: Collection<Post> = await postsPromise;
  const del: WriteOpResult = await posts.remove({ user: uid, date: date });
  return !!del.result;
}
