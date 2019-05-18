
/// <reference path="./api.d.ts" />

import express, { Express,
  Request, Response,
  NextFunction, Router } from "express";
import methodOverride from "method-override";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { promisifyAll } from "bluebird";
import { RedisClient } from "redis";
import { validate } from "jsonschema";
import asyncHandler from "express-async-handler";
// import httpIn from "http";
import socketIO from "socket.io";

import * as db from "./data";
import { User } from "./data/types";
import { BCRYPT_ROUNDS, JWT_SECRET, PORT } from "./env";

promisifyAll(RedisClient.prototype);

const app: Express = express();
const auth: Router = Router();
// const http = new httpIn.Server(app);

app.use(cors({ maxAge: 600 }));
app.use(json());
app.use(urlencoded({ extended: false }));
const io = socketIO.listen(app.listen(PORT));

io.on("connection", (socket) => {
  // connection
  console.log("socket connected");
  socket.on("disconnect",() => {
    console.log("socket disconnected");
    // dc
  })
});

app.get("/", function ( _: Request, res: Response ): void {
  res.status(200).json({ status: "UP" });
});

app.post("/register", asyncHandler(async function (
  req: Request, res: Response
): Promise<void> {
  const { instance: {
    name, email, password, dob
  } } = validate(req.body, {
    type: "object",
    properties: {
      name: { type: "string", "required": true },
      email: { type: "string", "required": true },
      password: { type: "string", "required": true },
      dob: { type: [ "integer", "string" ], "required": true }
    }
  }, { throwError: true, propertyName: "registration" });
  const hash: string = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user: any = await db.addUser(name, email, hash, new Date(dob));
  const token = jwt.sign({ id: user._id, email: user.email}, JWT_SECRET);
  res.status(200).json({ user, token });
}));

app.post("/login", asyncHandler(async function (
  req: Request, res: Response
): Promise<void> {
  const { instance: {
    email, password
  } } = validate(req.body, {
    type: "object",
    properties: {
      email: { type: "string", "required": true },
      password: { type: "string", "required": true }
    }
  }, { throwError: true, propertyName: "login" });
  if (!await db.checkPw(email, password)) {
    res.status(403).json({ errors: [ "Invalid credentials" ] });
    return;
  }
  const user = await db.getUserByEmail(email) as User;
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
  res.status(200).json({ user, token });
}));

app.use("/", auth);

auth.use(function ( req: Request, res: Response, next: NextFunction ): void {
  const auth: string | undefined = req.headers.authorization;
  if (!auth) {
    res.status(400).json({ errors: [ "Missing authorization" ] });
    return;
  }
  if (!/^bearer\s/i.test(auth)) {
    res.status(400).json({ error: [ "Malformed authorization" ] });
    return;
  }
  const token: string = auth.slice(7);
  try {
    req.token = <any> jwt.verify(token, JWT_SECRET);
    return next();
  } catch ( err ) {
    res.status(403).json({ errors: [ err.message ] });
  }
});

auth.get("/entries", asyncHandler(async function (
  req: Request, res: Response
): Promise<void> {
  const posts = await db.getAllPostsById(req.token.id);
  res.status(200).json({ posts });
}));

auth.get("/entries/:date", asyncHandler(async function (
  req: Request, res: Response
): Promise<void> {
  const post: any = await db.getSinglePostByUserDate(req.token.id, req.params.date);
  res.status(200).json(post);
}));

auth.put("/entries/:date", asyncHandler(async function (
  req: Request, res: Response
): Promise<void> {
  const { instance: { content } } = validate(req.body, {
    type: "object",
    properties: { content: { type: "string", "required": true } }
  }, { throwError: true, propertyName: "entry" });
  const post: any = await db.updatePost(req.token.id, req.params.date, content);
  res.status(200).json(post);
}));

auth.post("/entries/:date", asyncHandler(async function (
  req: Request, res: Response
): Promise<void> {
  const { instance: { content } } = validate(req.body, {
    type: "object",
    properties: { content: { type: "string", "required": true } }
  }, { throwError: true, propertyName: "entry" });
  const post: any = await db.addEntry(req.token.id, req.params.date, content);
  io.emit("newPost",{date: req.params.date});
  res.status(200).json(post);
}));

auth.delete("/entries/:date", asyncHandler(async function (
  req: Request, res: Response
): Promise<void> {
  const success: boolean = await db.deletePost(req.token.id, req.params.date);
  res.status(200).json({ success });
}));

app.use(methodOverride());
app.use(<any> function (
  err: Error & {
    status?: number, statusCode?: number
  }, _: Request,
  res: Response, next: NextFunction
): void {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || err.statusCode || 500);
  res.json({ errors: [ err.toString() ] });
});

//Start server
app.listen(PORT, function ( ): void {
  console.log(`0.0.0.0:${PORT}`);
});
