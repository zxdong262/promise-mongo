/**
 * promise mongo
 */

//glob var
var
mongo = require('mongodb')
,_ = require('lodash')

//promise global object check
,Promise = global.Promise || require('promise')


//main factory
function PM() {
	this.init()
}

PM.mongo = mongo

PM.prototype.init = function() {
	this.cf = {}
	this.cur = {}
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

		//arguments to array
		var $_len = arguments.length
		var args = new Array($_len)
		for(var $_i = 0; $_i < $_len; ++$_i) {
			args[$_i] = arguments[$_i]
		}

		var ctx = this
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

	//arguments to array
	var $_len = arguments.length
	var connectAgrs = new Array($_len - 1)
	for(var $_i = 1; $_i < $_len; ++$_i) {
		connectAgrs[$_i - 1] = arguments[$_i]
	}

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
	,_collectionNames = collectionNames

	//if string, convert to array
	if(!_.isArray(_collectionNames)) _collectionNames = [_collectionNames]

	//init db.collection objects
	_.each(_collectionNames, function(col) {
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
	,_collectionNames = collectionNames

	//if string, convert to array
	if(!_.isArray(_collectionNames)) _collectionNames = [_collectionNames]

	_.each(_collectionNames, function(col) {

		//done
		th.cols[col].findOne = function(query, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).findOne(query || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok
		th.cols[col].save = function(doc, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).save(doc || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok
		th.cols[col].find = function(query, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).find(query || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok: use updateMany inside
		th.cols[col].update = function(selector, doc, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).updateMany(selector || {}, doc || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok
		th.cols[col].updateOne = function(selector, doc, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).updateOne(selector || {}, doc || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok
		th.cols[col].updateMany = function(selector, doc, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).updateMany(selector || {}, doc || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok:use deleteMany inside for legacy, should use deleteOne when delete one 
		th.cols[col].remove = function(selector, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).deleteMany(selector || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok
		th.cols[col].deleteMany = function(selector, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).deleteMany(selector || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok
		th.cols[col].deleteOne = function(selector, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).deleteOne(selector || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok
		th.cols[col].distinct = function(key, query, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).distinct(key || '', query || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok
		th.cols[col].group = function(keys, condition, initial, reduce, finalize, command, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col)
				.group(keys || {}, condition || {}, initial || {}, reduce || '', finalize || '', command, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok: use insertOne and insertMany inside
		th.cols[col].insert = function(doc, options) {
			return new Promise(function(resolve, reject) {
				if(_.isArray(doc)) mdb.collection(col).insertMany(doc || [], options || {},  function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
				else mdb.collection(col).insertOne(doc || {}, options || {},  function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok
		th.cols[col].mapReduce = function(map, reduce, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).mapReduce(map || '', reduce || '', options || null, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok
		th.cols[col].insertMany = function(docs, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).insertMany(docs || [], options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}	

		//ok
		th.cols[col].insertOne = function(doc, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).insertOne(doc || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}	

		//ok
		th.cols[col].count = function(query, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).count(query || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result)
				})
			})
		}

		//ok: use updateOne inside
		th.cols[col].findAndModify = function(_query, _sort, _doc, _options) {
			var query = _query || {}
			,sort = _sort
			,doc = _doc || {}
			,options = _options || {}

			//options.new -> options.returnOriginal
			options.returnOriginal = !options.new

			//options.fields -> options.projection
			options.projection = options.fields

			//options.wtimeout -> options.maxTimeMS
			options.maxTimeMS = options.wtimeout

			//sort -> options.sort
			options.sort = sort

			return new Promise(function(resolve, reject) {
				if(options.remove) mdb.collection(col).findOneAndDelete(query, options, function(err, result) {
					if(err) reject(err)
					else resolve(result.value)
				})
				else mdb.collection(col).findOneAndUpdate(query, doc, options, function(err, result) {
					if(err) reject(err)
					else resolve(result.value)
				})
			})
		}

		//ok
		th.cols[col].findOneAndUpdate = function(filter, update, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).findOneAndUpdate(filter || {}, update || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result.value)
				})
			})
		}

		//ok
		th.cols[col].findOneAndDelete = function(filter, options) {
			return new Promise(function(resolve, reject) {
				mdb.collection(col).findOneAndDelete(filter || {}, options || {}, function(err, result) {
					if(err) reject(err)
					else resolve(result.value)
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
	,cur = th.cur
	
	cf.toArray = function(cur) {
		return new Promise(function(resolve, reject) {
			cur.toArray(function(err, val) {
				if(err) reject(err)
				else resolve(val)
			})
		})
	}

	//Deprecated
	cf.limit = function(cur, count) {
		return Promise.resolve(cur.limit(count || 0))
	}

	//Deprecated
	cf.sort = function(cur, sort) {
		return Promise.resolve(cur.sort(sort || {}))
	}

	//Deprecated
	cf.skip = function(cur, count) {
		return Promise.resolve(cur.skip(count || 0))
	}


	//new cursor functions, more friendly, 
	//fix https://github.com/zxdong262/promise-mongo/issues/2

	cur.toArray = function(cur) {
		return new Promise(function(resolve, reject) {
			cur.toArray(function(err, val) {
				if(err) reject(err)
				else resolve(val)
			})
		})
	}

	cur.limit = function(count) {
		return function(cur) {
			return Promise.resolve(cur.limit(count || 0))
		}
	}

	cur.sort = function(sort) {
		return function(cur) {
			return Promise.resolve(cur.sort(sort || {}))
		}
	}

	cur.skip = function(count) {
		return function(cur) {
			return Promise.resolve(cur.skip(count || 0))
		}
	}

	return Promise.resolve()
}


//expose
module.exports = PM

