var express = require('express');
var cors = require('cors');
var passport = require('passport');
var MongoClient = require('mongodb').MongoClient;

const MONGO_URL='mongodb://localhost'
const MONGO_PORT='27017';
const MONGO_DB_NAME='project';
const MONGO_COLLECTION_USERS='users';
const MONGO_COLLECTION_POSTS='posts';
/*
MongoClient.connect(MONGO_URL + ':' + MONGO_PORT + '/' + MONGO_DB_NAME, (err, client) => {
    if (err){
        console.log(err);
    }

    var db = client.db(MONGO_DB_NAME);
});
*/
//Run on port 3000
const port = 3000;
const app = express();

//Need to enable cors for requests from front end
app.use(cors());

app.get('/', (req, res) => {
    res.send("The rest server is up and running.")
})

app.post('/register', (req, res) => {

});

app.post('/login', (req, res) => {

});

app.post('/logout', (req, res) => {

});

app.get('/entries', (req, res) => {

});

app.get('/entries/:date', (req, res) => {

});

app.put('/entries/:date', (req, res) => {

});

app.post('/entries/:date', (req, res) => {

});

app.delete('/entries/:date', (req, res) => {

})

//Start server
app.listen(port, () => {
    console.log('Rest service started');
});