# promise-mongo

a mongodb wrapper, make everything return promise.

## intro

with `promise-mongo` we can do it like this:

```javascript

db.user.findOne({ name: 'zxd' })
.then(function(doc) {
	console.log(doc)
	//{ name: 'zxd', _id: 54b9e4e6ab3af9ac298e241e }
})

//or
db.user.find()
.then(cf.toArray)
.then(function(docs) {
	console.log(docs)
	//[{ name: 'zxd', _id: 54b9e4e6ab3af9ac298e241e }, { name: 'aya', _id: 54b9e4e6ab3af9ac298e2421 } ]
})

```

## Platform Compatibility

`promise-mongo` requires a Promise implementation. For versions of node < 0.11 , you should/must include your own Promise polyfill.

## Installation

```bash
$ npm install promise-mongo
```

## use

```javascript
var pm = require('promise-mongo')
var collectionNames = [ 'user', 'book', 'post' ]
pm.initDb(collectionNames, 'mongodb://127.0.0.1:27017/test')
.then(function(mdb) {

	//db connected
	//now we can do db operations

	//db collections reference
	var db = pm.cols

	//cursor functions reference
	var cf = pm.cf

	//now do it
	db.user.findOne()
	.then(function(user) {
		console.log(user)
	})

	db.user.find()
	.then(function(cursor) {
		return cf.limit(cursor, 2)
	})
	.then(cf.toArray)
	.then(function(users) {
		console.log(users)
	})
})
```


use replset

```javascript
var pm = require('promise-mongo')
var collectionNames = [ 'user', 'book', 'post' ]
var mongo = pm.mongo
,RepelSet = mongo.ReplSet
,Server = mongo.Server
,repls = new RepelSet([
	new Server({
		host: '10.10.5.100'
		,port: '27017'
	})
	,new Server({
		host: '10.10.5.99'
		,port: '27017'
	})
	,new Server({
		host: '10.10.5.98'
		,port: '27017'
	})
])

pm.initDb(collectionNames, 'mongodb://127.0.0.1:27017/test', { replSet: repls })
.then(function(mdb) {

	//db connected
	//now we can do db operations

	//db collections reference
	var db = pm.cols

	//cursor functions reference
	var cf = pm.cf

	//now do it
	db.user.findOne()
	.then(function(user) {
		console.log(user)
	})

	db.user.find()
	.then(function(cursor) {
		return cf.limit(cursor, 2)
	})
	.then(cf.toArray)
	.then(function(users) {
		console.log(users)
	})
})

```

## docs

`promise-mongo` did not cover all the collection and cursor methods yet.

collection methods:

```javascript
db.collectionName.findOne = function(query, options)
db.collectionName.save = function(doc) 
db.collectionName.find = function(query) 
db.collectionName.update = function(selector, doc, options) 
db.collectionName.remove = function(selector, options) 
db.collectionName.group = function(keys, condition, initial, reduce, finalize, command, options) 
db.collectionName.insert = function(doc, options) 
db.collectionName.mapReduce = function(map, reduce, options) 
db.collectionName.insertMany = function(docs, options) 
db.collectionName.insertOne = function(doc, options) 
db.collectionName.count = function(query, options) 
db.collectionName.drop = function() 
db.collectionName.findAndModify = function(query, sort, doc, options) 
```

cursor methods:

```javascript
cf.sort = function(cursor, obj)
cf.toArray = function(cursor) 
cf.limit  = function(cursor, count) 
cf.skip = function(cursor, count) 
```

exposed function & reference

```javascript
//make a callback function return promise
pm.toPromise

//pm.mongo = require('mongodb')
pm.mongo
```

## test

test cases is not complete yet.
make sure `'mongodb://127.0.0.1:27017/test'` is available or edit test yourself.

```bash
$ git clone https://github.com/zxdong262/promise-mongo.git
$ cd promise-mongo
$ sudo npm install
$ sudo npm install mocha -g
$ mocha --reporter spec
```

## change log

0.0.3 expose mongodb to pm.mongo
0.0.2 add cursor.skip



## license

MIT
