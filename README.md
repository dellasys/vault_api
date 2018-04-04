# vault_api
DB: CouchDB

DB name : vault_api

DEMO Link : 
https://vaultapi20180404.herokuapp.com/object/

ONLY GET and POST requests

## Running in Localhost :
You need to create a view in couchDB with the following details :
* Design Document name : getData
* Index name : getdata
* Map function:
``` js
function (doc) {
  if(doc.mykey && doc.value){
    emit(doc.mykey, {"value":doc.value,"timestamp":doc.timestamp});
  }
}
```

## Configuration
Change MODE in .env file to either CLOUD or LOCAL for switching the connection.
```js
# Switch between CLOUD or LOCAL
MODE=CLOUD
HOST=xxx.com
USERNAME=xxxxx
PASSWORD=xxxxx
LOCALHOST=http://localhost:5984
PORT=3000
```

