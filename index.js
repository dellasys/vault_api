const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// to support JSON-encoded bodies
app.use( bodyParser.json() ); 
const functions = require('./src/functions');

app.get('/',(req, res) => res.send('Hello World'));

app.get('/object/:key', function(req,res){
    var timeStamp = functions.getTimeStamp();
    try{
        functions.getData(req.params.key).then(result => {
            
            var tempResult = {
                // key:req.params.key,
                value:result,
                // timestamp:timeStamp
            }
            
            res.send(tempResult)
        }).catch(err => {
            res.send(err);
        })
        
    }catch(err){
        res.send(err);
    }
});

app.post('/object',function(req, res){
    var timeStamp = functions.getTimeStamp();
    var _id = req.body._id || 0
    try{
        if(_id){
            functions.updateObject(req.body).then(updateObjRes => {

                var tempResult = {
                    key:_id,
                    value:updateObjRes,
                    timestamp:timeStamp
                }
                res.send(tempResult);
                
            }).catch(err => {
                res.send(err);
            })
        }else{

            functions.postData(req.body).then(postRes => {
                console.log(postRes);
                // var tempResult = {
                //     key:_id,
                //     value:updateObjRes,
                //     timestamp:timeStamp
                // }
                res.send(postRes);
            }).catch(err => {
                res.send(err);
            })
        }
        
    }catch(err){
        res.send(err);
    }

    // res.send(req.body);
});




var port = 3000;
var server = app.listen(port, () => {
	console.log('App start listening on port ' + port + '.....');
});

module.exports = server;


