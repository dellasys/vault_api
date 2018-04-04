var nano = require('nano')('http://localhost:5984');
var vaultApi = nano.db.use('vault_api');
const errorNotFound = {statusCode:404, error:'Not Found'};

//getData by using view to display key as mykey & value as value1 {"key":"mykey","value":"value1"}
const getDataView = function (key) {
    var keyObj = {
        key: key
    };
    var result = new Promise(function (resolve, reject) {
        vaultApi.view('getData', 'getdata', keyObj, function (err, body) {
            if (!err) {
                resolve(body);
            } else {
                reject(err);
            }
        })
    })

    return result;
}
//Get the best data by deciding with or without timestamp query string
const getBestData = function(data, queryTimeStamp = ''){
    var tempResult = {};

    if(data.length > 0){
        var resRowData = data;
        var bestData = {}
        if(queryTimeStamp){
            bestData = getTheNearestTimestamp(resRowData,queryTimeStamp);
        }else{
            bestData = sortArrayByTimestamp(resRowData);
        }
        if(bestData[0]){
            return {
                value : bestData[0].value.value
            }
        }else{
            return errorNotFound;
        }
    }else{
        return errorNotFound;
    }
}
//Insert doc 
const postData = function (data) {
    var key = Object.keys(data)[0];
    var objData = {
        mykey: key,
        value: data[key]
    }
    var result = new Promise(function (resolve, reject) {
        var tempData = { ...objData,
            timestamp: getTimeStamp()
        };
        
        vaultApi.insert(tempData, function (err, body) {
            var tempBody = {
                ...body,
                ...tempData
            }

            if (!err) {
                resolve(tempBody);
            } else {
                reject(err);
            }
        })
    })

    return result;
}

//Get Current timestamp
const getTimeStamp = function () {
    return Date.now();
}

//Sort array in descending order
const sortArrayByTimestamp = function (array) {
    var sortedArray = array.sort(function(a,b){
        return b.value.timestamp - a.value.timestamp;
    })
    return sortedArray;
}
//Get nearest timestamp object
function getTheNearestTimestamp(arr,timstampQuery){
    var sortedArray = arr.sort(function(a, b) {
        var distance_a = Math.abs(timstampQuery - a.value.timestamp);
        var distance_b = Math.abs(timstampQuery - b.value.timestamp);
        return distance_a - distance_b;
    });

    var beforedates = sortedArray.filter(function(d){
        return d.value.timestamp - timstampQuery <= 0;
    })
    return beforedates;
}

module.exports = {
    getTimeStamp: getTimeStamp,
    postData: postData,
    // getData : getData,
    getTheNearestTimestamp : getTheNearestTimestamp,
    sortArrayByTimestamp : sortArrayByTimestamp,
    getDataView: getDataView,
    getBestData : getBestData
}