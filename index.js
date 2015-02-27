/**
 * promise mongo
 */

//glob var
var
slice = Array.prototype.slice
,mongo = require('mongodb')
,_ = require('lodash')


//main factory
function PM() {
	this.init()
}

PM.mongo = mongo

PM.prototype.init = function() {
	this.cf = {}
	this.cols = {}
	this.mongo = mongo
}

/**
 * make a thunk function to promise function
 * which returns a promise
 *
 * @param {Function} thunk function, with the last argument a callback
 * @return {Function}
 * @api public
 */


PM.prototype.toPromise = function(thunk) {
	return function() {
		var args = slice.call(arguments)
		,ctx = this
		return new Promise(function(resolve, reject) {
			args.push(function(err, val){
				if(err) reject(err)
				else resolve(val)
			})
			thunk.apply(ctx, args)
		})
	}
}

PM.prototype.connect = PM.prototype.toPromise(mongo.MongoClient.connect)

/**
 * init db operation
 *
 * @param {Array or String} collectionNames
 * @other params: the same as MongoClient.connect
 * (url, options, callback) 
 * visit http://mongodb.github.io/node-mongodb-native/2.0/api/MongoClient.html#connect
 * for params detail
 * @return {Promise}
 * @api public
 */

PM.prototype.initDb = function(collectionNames) {
	var th = this
	var connectAgrs = slice.call(arguments, 1)

	//init db obj
	return Promise.all([this.initDbCols(collectionNames), this.initCursorMethods()])
	.then(function() {
		return th.connect.apply(null, connectAgrs)
	})
	.then(function(mdb) {
		th.mdb = mdb
		return th.initColMethods(mdb, collectionNames)
	})



}


/**
 * init collection objects
 * like db.users, db.books ...
 *
 * @param {Array or String} collectionNames
 * @return {Promise}
 * @api public
 */

PM.prototype.initDbCols = function(collectionNames) {

	var th = this
	//if string, convert to array
	if(!_.isArray(collectionNames)) collectionNames = [collectionNames]

	//init db.collection objects
	_.each(collectionNames, function(col) {
		th.cols[col] = {}
	})

	return Promise.resolve()

}

/**
 * init connection, and collection objects
 *
 * @params the same as MongoClient.connect
 * (url, options, callback) 
 * visit http://mongodb.github.io/node-mongodb-native/2.0/api/MongoClient.html#connect
 * for params detail
 *
 * @return {Function}
 * @api public
 */



/**
 * init dcollection methods, like db.users.find...
 *
 * @param {db} mdb
 * @param {Array or String} collectionNames
 * @return {Promise}
 * @api public
 */

PM.prototype.initColMethods = function(mdb, collectionNames) {

	var th = this
	//if string, convert to array
	if(!_.isArray(collectionNames)) collectionNames = [collectionNames]

	_.each(collectionNames, function(col) {

		th.cols[col].findOne = function(query, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).findOne(query || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		th.cols[col].save = function(doc) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).save(doc || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		th.cols[col].find = function(query) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).find(query || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		th.cols[col].update = function(selector, doc, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).update(selector || {}, doc || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		th.cols[col].remove = function(selector, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).remove(selector || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		th.cols[col].group = function(keys, condition, initial, reduce, finalize, command, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col)
				.group(keys, condition, initial, reduce, finalize, command, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		th.cols[col].insert = function(doc, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).insert(doc || {}, options || {},  function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		th.cols[col].mapReduce = function(map, reduce, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).mapReduce(map || {}, reduce || {}, options || null, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		th.cols[col].insertMany = function(docs, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).insertMany(docs || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}	

		th.cols[col].insertOne = function(doc, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).insertOne(doc || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}	

		th.cols[col].count = function(query, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).count(query || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		th.cols[col].drop = function() {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).drop({}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		th.cols[col].findAndModify = function(query, sort, doc, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).findAndModify(query || {}, sort || [], doc || {}, options || null, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}	

	})

	return Promise.resolve()
}


/**
 * init cursor methods, like cursor.toArray()
 *
 * @return {Promise}
 * @api public
 */

PM.prototype.initCursorMethods = function() {

	var th = this
	,cf = th.cf
	
	cf.toArray = function(cur) {
		return new Promise(function(resolve, reject) {
			cur.toArray(function(err, val) {
				if(err) reject(err)
				else resolve(val)
			})
		})
	}

	cf.limit = function(cur, count) {
		return new Promise(function(resolve, reject) {
			cur.limit(count || 0, function(err, val) {
				if(err) reject(err)
				else resolve(val)
			})
		})
	}

	cf.sort = function(cur, sort) {
		return new Promise(function(resolve, reject) {
			cur.sort(sort || {}, function(err, val) {
				if(err) reject(err)
				else resolve(val)
			})
		})
	}

	cf.skip = function(cur, count) {
		return new Promise(function(resolve, reject) {
			cur.skip(count || 0, function(err, val) {
				if(err) reject(err)
				else resolve(val)
			})
		})
	}

	return Promise.resolve()
}


//expose
module.exports = PM

