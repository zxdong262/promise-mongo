
var assert = require('assert')
var PM = require('..')
var pm = new PM()
var readFile = require('fs').readFile
var uid = new Date().getTime()
var collectionNames = ['user' + uid, 'post' + uid, 'lang' + uid]
var dbUrl = 'mongodb://127.0.0.1:27017/test' + uid
var _ = require('lodash')
var util = require('util')

/*! 
 * test with replset
var mongo = pm.mongo
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
		})
	})
})

function test() {
	var db = pm.cols
	var cf = pm.cf

	describe('db.collectionName.collectionMethod()', function() {

		it('db.col.insert(doc)',function(done) {
			db['user' + uid].insert({ name: 'dci' + uid })
			.then(function() {
				return db['user' + uid].findOne({ name: 'dci' + uid })
			})
			.then(function(res) {
				assert(res.name === 'dci' + uid)
				done()
			})
		})

		it('db.col.insert(docArray)',function(done) {
			db['user' + uid].insert([{ aa: 1 }, { aa: 1 }])
			.then(function() {
				return db['user' + uid].find({ aa: 1 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(
					res.length === 2 &&
					res[0].aa &&
					res[1].aa
				)
				done()
			})
		})

		it('db.col.insertOne(doc)',function(done) {
			db['user' + uid].insertOne({ name: 'inso' + uid })
			.then(function() {
				return db['user' + uid].findOne({ name: 'inso' + uid })
			})
			.then(function(res) {
				assert(res.name === 'inso' + uid)
				done()
			})
		})

		it('db.col.insertMany(docArray)',function(done) {
			db['user' + uid].insertMany([{ insm: 1 }, { insm: 1 }])
			.then(function() {
				return db['user' + uid].find({ insm: 1 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(
					res.length === 2 &&
					res[0].insm &&
					res[1].insm
				)
				done()
			})
		})

		it('db.col.save()',function(done) {
			db['user' + uid].save({ name: 'dcs' + uid })
			.then(function() {
				return db['user' + uid].findOne({ name: 'dcs' + uid })
			})
			.then(function(res) {
				assert(res.name === 'dcs' + uid)
				done()
			})
		})

		it('db.col.findOne()',function(done) {
			db['user' + uid].insertOne({ name: 'dcfo' + uid })
			.then(function() {
				return db['user' + uid].findOne({ name: 'dcfo' + uid })
			})
			.then(function(res) {
				assert(res.name === 'dcfo' + uid)
				done()
			})
		})

		it('db.col.findOne() with option:fields',function(done) {
			db['user' + uid].insertOne({ name: 'dcfo1' + uid })
			.then(function() {
				return db['user' + uid].findOne({ name: 'dcfo1' + uid }, { fields: { _id: 0 } })
			})
			.then(function(res) {
				assert(res.name === 'dcfo1' + uid && !res._id)
				done()
			})
		})

		it('db.col.findAndModify() return original doc',function(done) {
			db['user' + uid].insertOne({ name: 'dcfam1' + uid, a: 2 })
			.then(function() {
				return db['user' + uid].findAndModify(
					{ name: 'dcfam1' + uid }
					,[[ 'name', 1 ]]
					,{ $set: { a: 1 } }
					,{}
				)
			})
			.then(function(res) {
				assert(res.a === 2)
				done()
			})
		})

		it('db.col.findAndModify() return updated doc',function(done) {
			db['user' + uid].insertMany([{ name: 'dcfam' + uid, a: 2 }, { name: 'dcfam' + uid, a: 3 }])
			.then(function() {
				return db['user' + uid].findAndModify(
					{ name: 'dcfam' + uid }
					,[[ 'a', -1 ]]
					,{ $set: { x: 1 } }
					,{ new: true }
				)
			})
			.then(function(res) {
				assert(res.x === 1 && res.a === 3)
				done()
			})
		})

		it('db.col.findAndModify() remove doc',function(done) {
			db['user' + uid].insertOne({ name: 'dcfamr' + uid, a: 2 })
			.then(function() {
				return db['user' + uid].findAndModify(
					{ name: 'dcfamr' + uid }
					,[[ 'name', 1 ]]
					,{ $set: { a: 1 } }
					,{ remove: true }
				)
			})
			.then(function(res) {
				assert(res.a === 2)
				return db['user' + uid].findOne({
					name: 'dcfamr' + uid
				})
			})
			.then(function(res) {
				assert(!res)
				done()
			})
		})

		it('db.col.findOneAndUpdate() return original doc',function(done) {
			db['user' + uid].insertOne({ name: 'foau' + uid, a: 2 })
			.then(function() {
				return db['user' + uid].findOneAndUpdate(
					{ name: 'foau' + uid }
					,{ $set: { a: 1 } }
				)
			})
			.then(function(res) {
				assert(res.a === 2)
				done()
			})
		})

		it('db.col.findOneAndDelete()',function(done) {
			db['user' + uid].insertOne({ name: 'dcfd' + uid, a: 2 })
			.then(function() {
				return db['user' + uid].findOneAndDelete(
					{ name: 'dcfd' + uid }
				)
			})
			.then(function(res) {
				assert(res.name === 'dcfd' + uid)
				return db['user' + uid].findOne({
					name: 'dcfd' + uid
				})
			})
			
			.then(function(res) {
				assert(!res)
				done()
			})
		})

		it('db.col.update() will update all matches',function(done) {
			db['user' + uid].insertMany([{ ax1: 1 }, { ax1: 1 }])
			.then(function() {
				return db['user' + uid].update({ ax1: 1 }, { $set: { c: 3 }})
			})
			.then(function() {
				return db['user' + uid].find({ c: 3 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length === 2)
				done()
			})
		})

		it('db.col.updateOne() only update one match',function(done) {
			db['user' + uid].insertMany([{ bb: 1, xx: 2 }, { bb: 1, xx: 1 }])
			.then(function() {
				return db['user' + uid].updateOne({ bb: 1 }, { $set: { ax: 3 } })
			})
			.then(function() {
				return db['user' + uid].find({ ax: 3 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length === 1)
				done()
			})
		})

		it('db.col.updateMany() update all matches',function(done) {
			db['user' + uid].insertMany([{ cc: 1, xx: 2 }, { cc: 1, xx: 1 }])
			.then(function() {
				return db['user' + uid].updateMany({ cc: 1 }, { $set: { ccx: 3 } })
			})
			.then(function() {
				return db['user' + uid].find({ ccx: 3 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length === 2)
				done()
			})
		})

		it('db.col.remove() will remove all matches',function(done) {

			db['user' + uid].insertMany([{ rm: 1 }, { rm: 1 }])
			.then(function(res) {
				return db['user' + uid].remove({ rm: 1 })
			})
			.then(function() {
				return db['user' + uid].findOne({ rm: 1 })
			})
			.then(function(res) {
				assert(!res)
				done()
			})
		})

		it('db.col.deleteMany() will remove all matches',function(done) {

			db['user' + uid].insertMany([{ dm: 1 }, { dm: 1 }])
			.then(function(res) {
				return db['user' + uid].deleteMany({ dm: 1 })
			})
			.then(function() {
				return db['user' + uid].findOne({ dm: 1 })
			})
			.then(function(res) {
				assert(!res)
				done()
			})

		})

		it('db.col.deleteOne() will remove all matches',function(done) {

			db['user' + uid].insertMany([{ do: 1 }, { do: 1 }])
			.then(function(res) {
				return db['user' + uid].deleteOne({ do: 1 })
			})
			.then(function() {
				return db['user' + uid].findOne({ do: 1 })
			})
			.then(function(res) {
				assert(res.do)
				done()
			})
			
		})

		it('db.col.count()',function(done) {
			db['user' + uid].insertMany([{ ct: 1 }, { ct: 1 }])
			.then(function(res) {
				return db['user' + uid].count({ ct: 1 })
			})
			.then(function(res) {
				assert(res === 2)
				done()
			})
		})

		it('db.col.find()',function(done) {

			db['user' + uid].insertMany([{ fd: 1 }, { fd: 1 }])
			.then(function(res) {
				return db['user' + uid].find({ fd: 1 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length === 2)
				done()
			})

		})

		it('db.col.find() with option(skip)',function(done) {

			db['user' + uid].insertMany([{ fcs: 1 }, { fcs: 1 }, { fcs: 1 }, { fcs: 1 }])
			.then(function(res) {
				return db['user' + uid].find({ fcs: 1 }, { skip: 1 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length === 3)
				done()
			})
			
		})

		it('db.col.find() with option(limit)',function(done) {

			db['user' + uid].insertMany([{ fcl: 1 }, { fcl: 1 }, { fcl: 1 }, { fcl: 1 }])
			.then(function(res) {
				return db['user' + uid].find({ fcl: 1 }, { limit: 1 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length === 1)
				done()
			})
			
		})

		it('db.col.find() with option(fields)',function(done) {

			db['user' + uid].insertMany([{ fcf: 1 }, { fcf: 1 }, { fcf: 1 }, { fcf: 1 }])
			.then(function(res) {
				return db['user' + uid].find({ fcf: 1 }, {fields: { _id: 0 }})
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(res.length && !res[0]._id)
				done()
			})
			
		})

		it('db.col.distinct()',function(done) {

			db['user' + uid].insertMany([{adis:0, bdis:{cdis:'adis'}}, {adis:1, bdis:{cdis:'b'}}, {adis:1, bdis:{cdis:'c'}},
		{adis:2, b:{cdis:'a'}}, {adis:3}, {adis:3}])
			.then(function(res) {
				return db['user' + uid].distinct('adis')
			})

			.then(function(res) {
				res = res.sort()
				assert(res.length === 4 && res[0] === 0)
				done()
			})
			
		})


		it('db.col.group()',function(done) {

			db['lang' + uid].insertMany(
				[
					{'title' : 'java sun', 'author' : 'jk', 'day' : '2012-12-14', 'tags' : ['java', 'nosql', 'spring']}
					,{'title' : 'SSH2', 'author' : 'cj', 'day' : '2012-5-10', 'tags' : ['struts2', 'hibernate', 'spring']}
					,{'title' : 'C#', 'author' : 'zt', 'day' : '2012-4-3', 'tags' : ['C#', 'SQL']}
					,{'title' : 'PHP Mongo', 'author' : 'lx', 'day' : '2012-12-14', 'tags' : ['PHP', 'nosql', 'mongo']}
				]
			)
			.then(function(res) {
				return db['lang' + uid].group(
					{}
					,{}
					,{ tags:[], a: 1}
					,function(doc, prev) {
						prev.tags.push('a')
						prev.a ++
					}
					,function(prev) {
						prev.a ++
					}
					,true
					,{}
				)
			})

			.then(function(res) {
				//console.log(res)
				assert(res[0].a === 6 && res[0].tags.length === 4)
				done()
			})
			
		})

		it('db.col.mapReduce()',function(done) {

			db['post' + uid].insertMany(
				[
					{mr:1, 'title' : 'java sun', 'author' : 'jk', 'day' : '2012-12-14', 'tags' : ['java', 'nosql', 'spring']}
					,{mr:1, 'title' : 'SSH2', 'author' : 'cj', 'day' : '2012-5-10', 'tags' : ['struts2', 'hibernate', 'spring']}
					,{mr:1, 'title' : 'C#', 'author' : 'zt', 'day' : '2012-4-3', 'tags' : ['C#', 'SQL']}
					,{mr:1, 'title' : 'PHP Mongo', 'author' : 'lx', 'day' : '2012-12-14', 'tags' : ['PHP', 'nosql', 'mongo']}
				]
			)
			.then(function(res) {
				return db['post' + uid].mapReduce(
					function() {
						emit(this.title, this.tags.length)
					}
					,function(title, mr) {
					}
					,{
						out: {inline:1}
					}
				)
			})

			.then(function(res) {
				assert(res.length === 4)
				done()
			})
			
		})

		//todo, more...



	})

	describe('cursor.cursorMethod()', function() {

		it('cursor.toArray()',function(done) {
			db['user' + uid].insertMany([{ cta: 1 }, { cta: 1 }, { cta: 1 }, { cta: 1 }])
			.then(function(res) {
				return db['user' + uid].find({ cta: 1 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(util.isArray(res) || res.length === 4)
				done()
			})
		})

		it('cursor.limit(Number)',function(done) {
			db['user' + uid].insertMany([{ cli: 1 }, { cli: 1 }, { cli: 1 }, { cli: 1 }])
			.then(function(res) {
				return db['user' + uid].find({ cli: 1 })
			})
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
			db['user' + uid].insertMany([{ cso: 1, nsm: 1 }, { cso: 1, nsm: 2 }, { cso: 1, nsm: 3 }, { cso: 1, nsm: 4 }])
			.then(function(res) {
				return db['user' + uid].find({ cso: 1 })
			})
			.then(function(cur) {
				return cf.sort(cur, { nsm: -1 })
			})
			.then(cf.toArray)
			.then(function(res) {
				assert(res[0].nsm === 4)
				done()
			})
		})

		it('cursor.skip(count)',function(done) {
			db['user' + uid].insertMany([{ ski: 1 }, { ski: 1 }, { ski: 1 }, { ski: 1 }])
			.then(function(res) {
				return db['user' + uid].find({ ski: 1 })
			})
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


