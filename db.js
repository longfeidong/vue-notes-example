// 创建存储数据的对象
const db = new loki('notes', {
	autoload: true,
	autoloadCallback: databaseInitialize,
	autosave: true,
	autosaveInterval: 3000
})

function databaseInitialize() {
	const notes = db.getCollection('notes')
	if (notes === null) {
		db.addCollection('notes')
	}
}

function loadCollection(collection) {
	return new Promise((resolve) => {
		// 加载数据库
		db.loadDatabase({}, () => {
			const _collection = db.getCollection(collection) || db.addCollection(collection)
			resolve(_collection)
		})
	})
}

// // 获取notes数据结合
// const notesCollection = db.getCollection('notes')
// // 获取集合的所有文档
// notesCollection.find()
// // 向集合中插入一个文档
// notesCollection.insert({'body': 'Hello'})
// notesCollection.insert({'body': '你好'})
// notesCollection.find()
// // 查询文档，提供查询参数,返回值是一个数组
// notesCollection.find({'$loki': 1})
// // 想获取到具体的对象就用findOne
// const note = notesCollection.findOne({'$loki': 1})
// // 修改数据
// note.body = 'hola'
// // 更新修改的数据
// notesCollection.update(note)
// console.log(note)
// // 删除文档
// notesCollection.remove(note)
// // 再次查询下id为1的文档
// notesCollection.findOne({'$loki': 1})

