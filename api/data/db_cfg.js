"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// DB config file
const MongoClient = require('mongodb').MongoClient;
// constant variables
const MONGO_URL = 'mongodb://localhost';
const MONGO_PORT = '27017';
const MONGO_DB_NAME = '554fp';
const MONGO_COLLECTION_USERS = 'users';
const MONGO_COLLECTION_POSTS = 'posts';
async function connectDb() {
    // await MongoClient.connect(MONGO_URL + ':' + MONGO_PORT + '/' + MONGO_DB_NAME, { useNewUrlParser: true });
    let connection = undefined;
    let db = undefined;
    if (!connection) {
        connection = await MongoClient.connect(MONGO_URL + ':' + MONGO_PORT, { useNewUrlParser: true });
        // @ts-ignore
        db = await connection.db(MONGO_DB_NAME);
    }
    return db;
}
// adapted from CS546 project
const getCollectionFn = collection => {
    let _col = undefined;
    return async () => {
        if (!_col) {
            let db = await connectDb();
            // @ts-ignore
            _col = await db.collection(collection);
        }
        return _col;
    };
};
function getColls() {
    return {
        users: getCollectionFn(MONGO_COLLECTION_USERS),
        posts: getCollectionFn(MONGO_COLLECTION_POSTS)
    };
}
exports.default = getColls;
//# sourceMappingURL=db_cfg.js.map