var nano = require('nano')('http://localhost:5984');
var vaultApi = nano.db.use('vault_api');


const getData = function(key){
    var result = new Promise(function(resolve, reject){
        vaultApi.get(key, function(err, body){
            
            if(!err){
                resolve(body);
            }else{
                if(err.error === 'not_found' && err.statusCode === 404){
                    reject(recordNotFound(err));
                }else{
                    reject(unexpecetedError(err));
                }
            }
        })
    })

    return result;
}

const postData = function(data){
    
    var result = new Promise(function(resolve, reject){
        vaultApi.insert(data, function(err, body){
            var concatBody = {...data, ...body};

            if(!err){
                resolve(concatBody);
            }else{
                reject(err);
            }
        })
    })

    return result;
}

const updateObject = async function(data){
    var _id = data._id;
    var getRes = await getData(_id).catch(err => {return err});
    var revKeyObj = {};

    if(getRes.value !== 404 && getRes._rev){
        revKeyObj = {_rev : getRes._rev};
    }
    
    var concatBody = {...data, ...revKeyObj};
    var postRes = await postData(concatBody).catch(err => {return err});

    return postRes;
}

const getTimeStamp = function(){
    return Date.now();
}


const recordNotFound = function(err){
    return {
        error : err.error,
        value : err.statusCode,
        statusCode : err.statusCode,
        errorText : '404 value not found'
	};
}

const unexpecetedError = function(err){
    return {
        error : err.error,
        value : err.statusCode,
        statusCode : err.statusCode,
        errorText : err.statusCode + ' ' + err.error
    };
}

module.exports = {
    getTimeStamp : getTimeStamp,
    postData : postData,
    updateObject : updateObject,
    getData : getData
}
