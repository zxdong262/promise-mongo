
var assert = require('assert')
var pm = require('..')
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

}


