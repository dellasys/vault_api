const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

// to support JSON-encoded bodies
app.use(bodyParser.json());
const functions = require('./src/functions');

app.get('/', (req, res) => res.send('Hello World'));

app.get('/object/:key', function (req, res) {
    var queryTimeStamp = req.query.timestamp;

    try {
        functions.getDataView(req.params.key).then(getRes => {
            var result = functions.getBestData(getRes.rows, queryTimeStamp);

            res.send(result);
        }).catch(err => {
            res.send(err);
        })

    } catch (err) {
        res.send(err);
    }
});

app.post('/object', function (req, res) {
    var _id = req.body._id || 0
    try {
        functions.postData(req.body).then(updateObjRes => {
            var tempResult = {
                key: updateObjRes.mykey,
                value: updateObjRes.value,
                timestamp: updateObjRes.timestamp
            }
            res.send(tempResult);

        }).catch(err => {
            res.send(err);
        })
    } catch (err) {
        res.send(err);
    }
});




var port = 3000;
var server = app.listen(port, () => {
    console.log('App start listening on port ' + port + '.....');
});

// module.exports = server;