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

## about promise

if no `global.Promise`, will use `promise` module.

## migrate from 0.3 to 0.4

0.3 support mongodb 1.4.3, 0.4 support mongodb 2.0.25, but old methods are all implanted, nothing would break. a few tips:
- add new methods: `deleteOne`, `deleteMany`, `updateOne`, `updateMany`, `insertOne`, `insertMany`, `findOneAndUpdate` and `findOneAndRemove`
- removed `drop` since it will break the collection
- `remove`, `update`, `insert` methods are marked for deprecation and will be removed in a future 3.0 driver, but `promise-mongo` still support them, inside the function `promise-mongo` use `deleteOne`, `deleteMany`, `updateOne`, `updateMany`, `insertOne`, `insertMany`, so no worries.
- but use `deleteOne`, `deleteMany`, `updateOne`, `updateMany`, `insertOne`, `insertMany` is still preferred for performance reason.
- `collection.find` in 2.0.25 prefer chain command like `collection.find().limit(1)` instead of `collection.find({}, { limit: 1})`, but it is still supported for now.
- `findAndModify` is deprecated in 2.0.25, but `promise-mongo` still support it by proxy it to `findOneAndUpdate` and `findOneAndRemove`, but `findOneAndUpdate` and `findOneAndRemove` is preferred for performance reason.


## Installation

```bash
$ npm install promise-mongo
```

## use

```javascript
var PM = require('promise-mongo')
var pm = new PM()
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
var PM = require('promise-mongo')
var pm = new PM()
var collectionNames = [ 'user', 'book', 'post' ]
var mongo = PM.mongo
,RepelSet = mongo.ReplSet
,Server = mongo.Server
,repls = new RepelSet([
	new Server({
		host: '100.100.5.100'
		,port: '27017'
	})
	,new Server({
		host: '100.100.5.99'
		,port: '27017'
	})
	,new Server({
		host: '100.100.5.98'
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
	db.user.findOne({ name: 'aya' }, {
		fields: { _id: false }
	})
	.then(function(user) {
		console.log(user)
	})

	db.user.find({}, {
		limit: 1
		,skip: 1
		,fields: { _id: 0 }
	})
	.then(cf.toArray)
	.then(function(users) {
		console.log(users)
	})

	db.user.find()
	.then(function(cur) {
		return cf.limit(cur, 1)
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
db.collectionName.find = function(query, options) 
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

//pm.mongo = PM.mongo = require('mongodb')
pm.mongo //or PM.mongo

//mongodb instance
pm.mdb

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

0.4.1 support mongodb 2.0.27, all methods have test, `group` have default options

0.4.0 support mongodb 2.0.25, rewrite tests.

0.3.0

+ collection.find() now have `options` param.
+ add tests for collection.find(), collection.remove(), collection.count()

0.2.1 use mongodb 1.4 (not compatible with 2.0.25 yet).

0.2.0 include promise module for non-es6 user.

0.1.4 code optimazation, use inline slice(arguments)

0.1.3 code optimazation, do not use argument directly(but still use slice)

0.1.2 expose mongodb instance to `pm.mdb`

0.1.1 expose PM.mongo

0.1.0 now return PM instance, support multi connection

0.0.3 expose mongodb to pm.mongo

0.0.2 add cursor.skip



## license

MIT
