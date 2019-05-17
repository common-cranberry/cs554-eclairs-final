"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_cfg_1 = __importDefault(require("./db_cfg"));
const uuidv1 = require('uuid/v1');
const bcrypt = require("bcrypt");
// @ts-ignore
const saltRounds = 12;
let users; // did this way to avoid possible undeclared TS err
let posts;
users = db_cfg_1.default().users;
posts = db_cfg_1.default().posts;
// helpers
function checkNumArgs(needArgs, givenArgs) {
    if (needArgs !== givenArgs) {
        throw 'DB: Incorrect number of args given - given: ' + givenArgs + ', needed: ' + needArgs;
    }
}
// USER data
async function addUser(name, email, pw, dob) {
    // @ts-ignore
    checkNumArgs(4, arguments.length);
    if (!name)
        throw "DB addUser needs name";
    if (!email)
        throw "DB addUser needs email";
    if (!name)
        throw "DB addUser needs name";
    if (await getUserByEmail(email) != null)
        throw "DB Error User already exists for email";
    let newUser = {
        _id: uuidv1(),
        name: name,
        email: email,
        password: pw,
        dob: dob
    };
    let coll = await users();
    let insert = await coll.insertOne(newUser);
    if (insert.insertedCount === 0)
        throw "DB Error adding user";
    // return user info by checking for it in the DB
    return await getUserById(newUser._id);
}
async function getUserById(id) {
    // @ts-ignore
    checkNumArgs(1, arguments.length);
    if (!id)
        throw "DB getUser needs ID";
    let coll = await users();
    let user = await coll.findOne({ _id: id });
    if (user === null)
        throw "DB Error User not found";
    return user;
}
async function getUserByEmail(email) {
    // @ts-ignore
    checkNumArgs(1, arguments.length);
    if (!email)
        throw "DB getUser needs Email";
    let coll = await users();
    return await coll.findOne({ email: email });
}
async function checkPw(email, pw) {
    // @ts-ignore
    checkNumArgs(2, arguments.length);
    if (!email)
        throw "DB validate needs Email";
    if (!pw)
        throw "DB validate needs PW";
    let user = await getUserByEmail(email);
    if (user === null)
        throw "DB Error User not found";
    return await bcrypt.compare(pw, user.password);
}
// POSTS data
async function getAllPostsById(id) {
    // @ts-ignore
    checkNumArgs(1, arguments.length);
    if (!id)
        throw "DB getPosts needs ID";
    let coll = await posts();
    let postList = await coll.find({ user: id }).toArray();
    if (postList === null)
        throw "DB Error No posts found for user";
    return postList;
}
async function getSinglePostByUserDate(id, date) {
    // @ts-ignore
    checkNumArgs(2, arguments.length);
    if (!id)
        throw "DB getPost needs ID";
    if (!id)
        throw "DB getPost needs Date";
    let coll = await posts();
    return await coll.findOne({ user: id, date: date });
}
async function getPostById(id) {
    // @ts-ignore
    checkNumArgs(1, arguments.length);
    if (!id)
        throw "DB getPost needs ID";
    let coll = await posts();
    return await coll.findOne({ _id: id });
}
async function updatePost(uid, date, content) {
    // @ts-ignore
    checkNumArgs(3, arguments.length);
    if (!uid)
        throw "DB getPost needs ID";
    if (!uid)
        throw "DB getPost needs Date";
    if (!uid)
        throw "DB getPost needs new content";
    let coll = await posts();
    let post = await coll.updateOne({ user: uid, date: date }, { $set: { content: content } });
    if (post === null)
        throw "DB Error Post not found";
    return post;
}
async function addEntry(uid, date, content) {
    // @ts-ignore
    checkNumArgs(3, arguments.length);
    if (!uid)
        throw "DB addUser needs name";
    if (!date)
        throw "DB addUser needs email";
    if (!content)
        throw "DB addUser needs name";
    let existing = await getSinglePostByUserDate(uid, date);
    if (existing != null)
        throw "DB Error Post already exists for that User/Date";
    let newPost = {
        _id: uuidv1(),
        user: uid,
        date: date,
        content: content
    };
    let coll = await posts();
    let insert = await coll.insertOne(newPost);
    if (insert.insertedCount === 0)
        throw "DB Error adding user";
    // return user info by checking for it in the DB
    return await getPostById(newPost._id);
}
async function deletePost(uid, date) {
    // @ts-ignore
    checkNumArgs(2, arguments.length);
    if (!uid)
        throw "DB delPost needs userid";
    if (!date)
        throw "DB delPost needs date";
    let coll = await posts();
    let del = await coll.remove({ user: uid, date: date });
    if (del.deletedCount === 0)
        throw "DB Error deleting post";
    return;
}
module.exports = {
    addUser,
    getUserById,
    getUserByEmail,
    checkPw,
    getSinglePostByUserDate,
    getPostById,
    getAllPostsById,
    updatePost,
    addEntry,
    deletePost
};
//# sourceMappingURL=data.js.map