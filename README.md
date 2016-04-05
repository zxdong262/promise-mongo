# promise-mongo
[![Build Status](https://travis-ci.org/zxdong262/promise-mongo.svg?branch=master)](https://travis-ci.org/zxdong262/promise-mongo)

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
.then(cur.toArray)
.then(function(docs) {
	console.log(docs)
	//[{ name: 'zxd', _id: 54b9e4e6ab3af9ac298e241e }, { name: 'aya', _id: 54b9e4e6ab3af9ac298e2421 } ]
})

//or in koa/co
var user = yield db.user.findOne({ name: 'zxd' })

```

## install note

if failed when installing kerberos, you may need `sudo apt-get install libkrb5-dev`

## about promise

if no `global.Promise`, will use `promise` module.

## migrate from 0.3 to 0.4

0.3 support mongodb 1.4.3, 0.4 support mongodb 2.0.25, but old methods are all implanted, nothing would break. a few tips:
- add new methods: `deleteOne`, `deleteMany`, `updateOne`, `updateMany`, `insertOne`, `insertMany`, `findOneAndUpdate` and `findOneAndDelete`
- removed `drop` since it will break the collection
- `remove`, `update`, `insert` methods are marked for deprecation and will be removed in a future 3.0 driver, but `promise-mongo` still support them, inside the function `promise-mongo` use `deleteOne`, `deleteMany`, `updateOne`, `updateMany`, `insertOne`, `insertMany`, so no worries.
- but use `deleteOne`, `deleteMany`, `updateOne`, `updateMany`, `insertOne`, `insertMany` is still preferred for performance reason.
- `collection.find` in 2.0.25 prefer chain command like `collection.find().limit(1)` instead of `collection.find({}, { limit: 1})`, but it is still supported for now.
- `findAndModify` is deprecated in 2.0.25, but `promise-mongo` still support it by proxy it to `findOneAndUpdate` and `findOneAndDelete`, but `findOneAndUpdate` and `findOneAndDelete` is preferred for performance reason.
- use `new Server('100.100.5.100', 27017)` instead of  `new Server( { host: '100.100.5.100', port: '27017' } )`

## Installation

```bash
$ npm install promise-mongo
```

## use

see more example from `test/test.js`

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
	var cur = pm.cur

	//now do it
	db.user.findOne()
	.then(function(user) {
		console.log(user)
	})

	db.user.find()
	.then(cur.limit(2))
	.then(cur.skip(1))
	.then(cur.sort({ name: -1 }))
	.then(cur.toArray)
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
,repels = new RepelSet([
	new Server(
		'100.100.5.100'
		,27017
	)
	,new Server(
		'100.100.5.99'
		,27017
	)
	,new Server(
		'100.100.5.98'
		,27017
	)
])

pm.initDb(collectionNames, 'mongodb://127.0.0.1:27017/test', { replSet: repls })
.then(function(mdb) {

	//db connected
	//now we can do db operations

	//db collections reference
	var db = pm.cols

	//cursor functions reference
	var cur = pm.cur

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
	.then(cur.toArray)
	.then(function(users) {
		console.log(users)
	})

	db.user.find()
	.then(cur.limit(1))
	.then(cur.skip(1))
	.then(cur.sort({ name: -1 }))
	.then(cur.toArray)
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
db.collectionName.update = function(selector, doc, options)  //deprecated
db.collectionName.updateOne = function(selector, doc, options) 
db.collectionName.updateMany = function(selector, doc, options) 
db.collectionName.remove = function(selector, options)  //deprecated
db.collectionName.deleteOne = function(selector, options) 
db.collectionName.deleteMany = function(selector, options) 
db.collectionName.group = function(keys, condition, initial, reduce, finalize, command, options) 
db.collectionName.insert = function(doc, options)  //deprecated
db.collectionName.insertMany = function(docs, options) 
db.collectionName.insertOne = function(doc, options) 
db.collectionName.mapReduce = function(map, reduce, options) 
db.collectionName.count = function(query, options) 
db.collectionName.drop = function() 
db.collectionName.findAndModify = function(query, sort, doc, options) //deprecated
db.collectionName.findOneAndUpdate = function(filter, update, options) 
db.collectionName.findOneAndDelete = function(filter, options)
```

read <a href='http://mongodb.github.io/node-mongodb-native/2.1/api-docs/'>http://mongodb.github.io/node-mongodb-native/2.0/api-docs/</a> for details.

cursor methods:

```javascript
cf.sort = function(cursor, obj)//Deprecated
cf.toArray = function(cursor) //Deprecated
cf.limit  = function(cursor, count) //Deprecated
cf.skip = function(cursor, count) //Deprecated
```

since 1.1.0 use `cur.cursorMethod` instead of `cf.cursorMethod`, but `cf.cursorMethod` is still keeped for legacy reason, so nothing would break.

```javascript
cur.sort = function(Object)
cur.toArray = function() 
cur.limit  = function(count) 
cur.skip = function(count) 
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

make sure `'mongodb://127.0.0.1:27017/test'` is available or edit test yourself.

```bash
git clone https://github.com/zxdong262/promise-mongo.git
cd promise-mongo
sudo npm install
sudo npm install mocha -g
mocha
```

## change log

3.0.0 rewrite with es6 feature, drop promise/lodash module dependency, support node 4.0+ only, use mongodb native 2.1.7.

2.0.0 use mongodb 2.0.44, compatible with node v4, you may need install `libkrb5-dev` by `sudo apt-get install libkrb5-dev` or something else.

1.1.0 add pm.cur.cursorMethods

0.4.2 add test for `mapReduce`

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
