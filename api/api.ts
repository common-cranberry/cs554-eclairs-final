const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const db = require('./data/data.js');
const bcrypt = require("bcrypt");
const saltRounds = 12;
const bluebird = require("bluebird");
const redis = require("redis");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// jwt secret
const jwtKey = "AAABAHng0VzwE96spWUNuk4ON4ftocYIoHwr31s4lAx1lV9TzNVl3SoU5gFiJNqd\n" +
    "bsSMzRPn+OT/rv9Wa8rsedGY4aWQAPaa1jKEBjLYGIe+Qwdq/XGTOgieWHh4OyAb\n" +
    "eFBiS1s8uW9lGx4F0vtVRzwHrlF1KXtpVZFZKXHSPQRuUv+WdSrsISdC8l8NEUKH\n" +
    "GPAXW//pnQWKRIIH9M53WUE3fl5/utq8iKg3n2/OpuVf/LFhF3C1zmwTMfl7Cqc8\n" +
    "dxO3BdNJgYQzejWvk1b1+eHBgEj0VXfKetkuCEVUUcVjo+QHxgG/mbFsTuIMboqR\n" +
    "Lu9xwB4pE8zRMb8l7/C2vbSp5A0AAACBAPiNNuce7YDqL/Jp3nE4zot3Eu4tQtF/\n" +
    "VgnOQf6I7mncaW72ZDZvp1R+ArpHig2mTiOfOZhnRQ/iWlCJPXFTQjjMHUYCn4oL\n" +
    "GUdYTJbdWwLewZAjPRalqxG8s2d4J7pOKDedaz9WxORUqwKLP8JM9tE8Hgg1ROAS\n" +
    "9o8paJveatSFAAAAgQCIm1SR56JDY4z56nu3QGmUd5Npub9aJBiieyKUcEQzsLj2\n" +
    "HwOdeajS7fDZaSENYfpqJIgVmpLluWDid7zn4/TuSCiDMUobJHrJ/VO1w90GoIN6\n" +
    "PA3AK3+dLwwB2ynx3IbNmYJy5rY5vT69EEtenn6tzPQjaYKzhYQu1s4THs+zfQAA\n" +
    "AIAYXf6eteYBFRVpUkfFMOaHHw1g0PH9S/55bPxj7EwI4SdrnUHT/YUk6k6j7pbL\n" +
    "I/coDvYOmdDFgBK2NoI4sEQ1J1WYJl30RybVnmBeAvLs44qAW+bRpB+pfyt/Vsrp\n" +
    "4VvPc8bwwhUQIHTq24vef9AToj6m7dhIgVhDNoLNi6w1gQ==";

//Run on port 3000
const port = 3000;
const app = express();

//Need to enable cors for requests from front end
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => {
    req;
    res.send("The rest server is up and running.")
});

app.post('/register', async (req, res) => {
    try {
        let hashpw = await bcrypt.hash(req.body.password,saltRounds);
        let addedUser = await db.addUser(req.body.name,req.body.email,hashpw,req.body.dob);
        let token = jwt.sign({id:addedUser._id,email:addedUser.email},jwtKey);
        res.status(200).json({id:addedUser._id,name:addedUser.name,token});
    } catch (e) {
        res.status(500).json({error:e});
    }
});

app.post('/login', async (req, res) => {
    try {
        let valid = await db.checkPw(req.body.email,req.body.pw);
        if (valid) {
            let user = await db.getUserByEmail(req.body.email);
            let token = jwt.sign({id:user._id,email:user.email},jwtKey);
            res.status(200).json({id:user._id,name:user.name,token});
        } else {
            res.status(403).json({error:"Invalid Login"});
        }
    } catch (e) {
        res.status(500).json({error:e});
    }
});

app.get('/entries', async (req, res) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    let payload;
    try {
        payload = jwt.verify(token,jwtKey);
    } catch (e) {
        res.status(403).json({error:"Invalid Login"});
        return;
    }
    try {
        let posts = await db.getAllPostsById(payload.id);
        res.status(200).json({posts});
    } catch (e) {
        res.status(500).json({error:e});
    }
});

app.get('/entries/:date', async (req, res) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    let payload;
    try {
        payload = jwt.verify(token,jwtKey);
    } catch (e) {
        res.status(403).json({error:"Invalid Login"});
        return;
    }
    let date = req.params.date;
    try {
        let post = await db.getSinglePostByUserDate(payload.id,date);
        res.status(200).json(post);
    } catch (e) {
        res.status(500).json({error:e});
    }
});

app.put('/entries/:date', async (req, res) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    let payload;
    try {
        payload = jwt.verify(token,jwtKey);
    } catch (e) {
        res.status(403).json({error:"Invalid Login"});
        return;
    }
    let date = req.params.date;
    try {
        await db.updatePost(payload.id,date,req.body.content);
        res.status(200).json({msg:"updated"});
    } catch (e) {
        res.status(500).json({error:e});
    }
});

app.post('/entries/:date', async (req, res) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    let payload;
    try {
        payload = jwt.verify(token,jwtKey);
    } catch (e) {
        res.status(403).json({error:"Invalid Login"});
        return;
    }
    let date = req.params.date;
    try {
        await db.addEntry(payload.id,date,req.body.content);
        res.status(200).json({msg:"posted"});
    } catch (e) {
        res.status(500).json({error:e});
    }
});

app.delete('/entries/:date', async (req, res) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    let payload;
    try {
        payload = jwt.verify(token,jwtKey);
    } catch (e) {
        res.status(403).json({error:"Invalid Login"});
        return;
    }
    let date = req.params.date;
    try {
        await db.deletePost(payload.id,date);
        res.status(200).json({msg:"deleted"});
    } catch (e) {
        res.status(500).json({error:e});
    }
});

//Start server
app.listen(port, () => {
    console.log('Rest service started');
});