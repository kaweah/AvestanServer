// AvestanServer.js

var express = require('express');
var app = express();
var fs = require("fs");

var levelup = require('levelup');
var leveldown = require('leveldown');
// var path = require('path');
// var dbPath = process.env.DB\_PATH || path.join(\_\_dirname, 'mydb');
var db = levelup(leveldown('./levelupdb'));

app.use(express.json());       // to support JSON-encoded bodies

// Get record by key

app.get('/get', function (req, res) {
  console.log("req.query.word: " + req.query.word);

  db.get(req.query.word, function(err, value) {
    if (err) {
      return handleError(err);
    }
    console.log('value:', value);
    res.end(value);
  });
});

app.get('/words', function (req, res) {
   fs.readFile( __dirname + "/" + "words.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

/*
app.get('/wordByDef', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "words.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var def = req.query.def;
      console.log(def);
      var selections = [];
      users.map(function(user) {
	if (user.definitions.includes(def)) {
          console.log( user );
    	  selections.push(user);
	}
      });
      res.end(JSON.stringify(selections));
   });
});

app.get('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "words.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var id = req.params.id;
      users.map(function(user) {
	if (user.id == id) {
          console.log( user );
          res.end( JSON.stringify(user));, value] of db.iterator()) 
	}
      });
   });
})
*/

// Get all records
// This API should be replaced by an API that provides an array of keys,
// defined, perhaps, by a start index and a count.

app.get('/getAll', function (req, res) {
  console.log("Getting all records ...");

  var readStream = db.createReadStream();
  var array = "[ "; // Add space for final comma removal in case of empty array.

  // Setup callbacks

  readStream.on("close", function () {
    // trim off final comma.
    array = array.substring(0, array.length-1) + "]";
    console.log('final array: ', array);
    res.end(array);
  });

  readStream.on('data', function (data) {
    // add data.key & data.value to JSON array
    var element = "{ \"old\": \"" + data.key + "\", " + data.value + " }"; 
    // console.log('element:', element);
    array += element + ',';
    // console.log('array: ', array);
  });
});

app.post('/set', function (req, res) {
  console.log("req.query.word: " + req.query.word);
  // var value = JSON.stringify(req.body);
  var value = "\"younger\": \"" + req.body.younger + "\", \"definitions\": \"" + req.body.definitions + "\"";
  // console.log("req.body: " + value);
  // console.log("req.body.younger: " + req.body.younger);
  // console.log("req.body.definitions: " + req.body.definitions);
  
  db.put(req.query.word, value);

  res.end(value);
});

app.delete('/', function (req, res) {
  var key = req.query.word;
  console.log("key: " + key);

  db.del(key);

  res.end("Deleted: " + key);
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
