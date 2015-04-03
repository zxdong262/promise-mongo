
var assert = require('assert')
var PM = require('..')
var pm = new PM()
var readFile = require('fs').readFile
var uid = new Date().getTime()
var collectionNames = ['user' + uid, 'post' + uid]
var dbUrl = 'mongodb://127.0.0.1:27017/test'
var _ = require('lodash')
var util = require('util')

/*! 
 * test with replset
var mongo = pm.mongo
,RepelSet = mongo.ReplSet
,Server = mongo.Server
,repels = new RepelSet([
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

*/

describe('pm.initDb', function() {
	it('all db collection Methods created', function(done) {
		/*! 
 		 * test with replset

		pm.initDb(collectionNames, dbUrl, { replSet: repels })

		 */
		pm.initDb(collectionNames, dbUrl)
		.then(function() {
			test()
			done()
		}, function(err) {
			assert(!err)
			done()
		})
	})
})

function test() {
	var db = pm.cols
	var cf = pm.cf

	describe('db.collectionName.collectionMethod()', function() {

		it('db.col.save()',function(done) {
			db['user' + uid].save({ name: 'test' + uid })
			.then(function(res) {
				assert(res)
				done()
			})
		})

		it('db.col.findOne()',function(done) {
			db['user' + uid].findOne({ name: 'test' + uid })
			.then(function(res) {
				assert(res)
				done()
			})
		})

		it('db.col.findOne() with option fields',function(done) {
			db['user' + uid].findOne({ name: 'test' + uid }, { fields: { _id: 0 } })
			.then(function(res) {
				assert(res && !res._id)
				done()
			})
		})

		it('db.col.findAndModify()',function(done) {
			db['user' + uid].findAndModify(
				{ name: 'test' + uid }
				,[[ 'name', 1 ]]
				,{ $set: { a: 1 } }
				,{ new: true }
			)
			.then(function(res) {
				assert(res.a === 1)
				done()
			})
		})

		it('db.col.insert(doc)',function(done) {
			db['user' + uid].insert({ name: 'test' + uid + '0'})
			.then(function(res) {
				assert(res)
				done()
			})
		})

		it('db.col.insert(docArray)',function(done) {
			db['user' + uid].insert([{ name: 'test' + uid + '0'}, { name: 'aya' }])
			.then(function(res) {
				assert(res)
				done()
			})
		})

		it('db.col.update()',function(done) {
			db['user' + uid].update({ name: 'test' + uid + '0'}, { $set: { name: 'updated' }})
			.then(function() {
				return db['user' + uid].findOne({ name: 'updated' })
			})
			.then(function(res) {
				assert(res.name === 'updated')
				done()
			})
		})

		it('db.col.remove()',function(done) {

			db['user' + uid].insert({ name: 'test' + uid + 'x'})
			.then(function(res) {
				return db['user' + uid].remove({ name: 'test' + uid + 'x' })
			})
			.then(function() {
				return db['user' + uid].findOne({ name: 'test' + uid + 'x' })
			})
			.then(function(res) {
				assert(!res)
				done()
			})
		})

		it('db.col.count()',function(done) {

			db['user' + uid].count({ name: 'test' + uid + '0'})
			.then(function(res) {
				assert(res === 1)
				done()
			})
		})

		it('db.col.find()',function(done) {

			db['user' + uid].find()
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length === 4)
				done()
			})
		})

		it('db.col.find() with option(skip)',function(done) {

			db['user' + uid].find({}, { skip: 1 })
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length === 3)
				done()
			})
		})

		it('db.col.find() with option(limit)',function(done) {

			db['user' + uid].find({}, { limit: 1 })
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length === 1)
				done()
			})
		})


		it('db.col.find() with option(fields)',function(done) {

			db['user' + uid].find({}, { fields: { name: 1, _id: 0 } })
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length && !res[0]._id && res[0].name)
				done()
			})
		})

		//todo, more...



	})

	describe('cursor.cursorMethod()', function() {

		it('cursor.toArray()',function(done) {
			db['user' + uid].find({})
			.then(cf.toArray)
			.then(function(res) {
				assert(util.isArray(res))
				done()
			})
		})

		it('cursor.limit(Number)',function(done) {
			db['user' + uid].find({})
			.then(function(cur) {
				return cf.limit(cur, 1)
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length === 1)
				done()
			})
		})

		it('cursor.sort(Object)',function(done) {
			db['user' + uid].find({})
			.then(function(cur) {
				return cf.sort(cur, { name: -1 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(res[0].name[0] === 'u')
				done()
			})
		})

		it('cursor.skip(count)',function(done) {
			db['user' + uid].find({})
			.then(function(cur) {
				return cf.skip(cur, 1)
			})
			.then(cf.toArray)
			.then(function(res) {

				assert(res.length === 3)
				done()
			})
		})


	})


	describe('mongodb instance exposed', function() {

		it('pm.mdb exist and drop ok',function(done) {
			pm.mdb.dropDatabase(function(err, result) {
				assert(!err && result)
				done()
			})
			
		})


	})

}


