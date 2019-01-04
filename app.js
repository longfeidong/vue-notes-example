const Editor = {
	props: ['entityObject'],
	data () {
		return {
			entity: this.entityObject
		}
	},
	methods: {
		update () {
			this.$emit('update')
		}
	},
	template: `
		<div class="ui form">
			<div class="field">
				<textarea 
					rows="5" 
					placeholder="写点东西……" 
					v-model="entity.body"
					@input="update"
				></textarea>
			</div>
		</div>
	`
}

const Note = {
  props: ['entityObject'],
  data () {
    return {
      entity: this.entityObject,
      isShow: false
    }
  },
  computed: {
  	header () {
  		// 截取字符长度
  		return _.truncate(this.entity.body, {length: 30})
  	},
  	updated () {
  		// 格式化内存数据库中的更新时间
  		return moment(this.entity.meta.updated).fromNow()
  	},
  	words () {
  		return this.entity.body.trim().length
  	}
  },
  methods: {
  	handleClickShow () {
  		this.isShow = !this.isShow
  	},
  	save () {
  		loadCollection('notes')
  			.then((collection) => {
  				collection.update(this.entity)
  				collection.saveDatabase
  			})
  	},
  	destroy () {
  		this.$emit('destroy', this.entity.$loki)
  	}
  },
  components: {
  	'editor': Editor
  },
  template: `
    <div class="item">
    	<div class="meta">{{ updated }}</div>
      <div class="content">
        <div class="header" @click="handleClickShow">{{ header || '新建笔记' }}</div>
        <div class="extra">
        	<editor :entityObject="entityObject" @update="save" v-if="isShow"></editor>
        	{{ words }} 字
        	<i class="right floated trash icon" v-if="isShow" @click="destroy"></i>
        </div>
      </div>
    </div>
  `
}

const Notes = {
  created () {
    // 加载 notes集合中的内容
    loadCollection('notes')
      .then((collection) => {
        // console.log(collection)
        /*
          chain方法，用于在集合上开始一系列链式操作
          find方法，获取集合中的所有内容
          simplesort方法，排序方式，以$loki,降序(isdesc)排列
        */
        const _entites = collection.chain()
          .find()
          .simplesort('$loki', 'isdesc')
          .data()
        this.entites = _entites
        console.log(this.entites)
      })
  },
  data () {
    return {
      entites: []
    }
  },
  computed: {
  	isShow () {
    	return !this.entites.length
    }
  },
  methods: {
    create (collection) {
      loadCollection('notes')
        .then((collection) => {
          const entity = collection.insert({
            body: ''
          })
          // 保存数据库
          db.saveDatabase()
          this.entites.unshift(entity)
        })
    },
    handleRemoveNote (id) {
    	// 筛选出id不等于被删除的id的元素
    	const _entites = this.entites.filter((entity) => {
    		return entity.$loki !== id
    	})
    	this.entites = _entites
    	// 删除数据库中的数据
    	loadCollection('notes')
    		.then((collection) => {
    			collection.remove({
    				$loki: id
    			})
    			db.saveDatabase()
    		})
    }
  },
  components: {
    'note': Note
  },
  template: `
    <div class="ui container notes">
      <h4 class="ui horizontal divider header">
        <i class="paw icon"></i>
        Notes App _ Vue.js
      </h4>
      <a class="ui right floated basic violet button"
        @click="create"
      >
        添加笔记
      </a>
      <div class="ui divided items">
        <note
          v-for="entity of entites"
          :key="entity.$loki"
          :entityObject="entity"
          @destroy="handleRemoveNote"
        >
        </note>
        <span class="ui small disabled header" v-if="isShow">还没有笔记呢？请点击"添加笔记"按钮~</span>
      </div>
    </div>
  `
}

const app = new Vue({
  el: '#app',
  components: {
    'notes': Notes
  },
  template: `
    <div>
      <notes></notes>
    </div>
  `
})