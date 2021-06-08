
# Vue使用笛卡尔积生成多规格商品SKU

## 简述

 &emsp;&emsp;之前做b2c商城后台管理系统的时候，有个添加商品多规格的需求，让商家根据不同的商品编辑自定义规格和参数，参考图片：

![Vue使用笛卡尔积生成多规格商品SKU](/modem-bookmarks/image/Vue使用笛卡尔积生成多规格商品SKU/参考图片.png)

&emsp;&emsp;比如手机商品，有颜色、版本、购买方式、套餐，四种不同规格，如果一个个让商家输入的话，岂不是太不符合人性化了；
经过一阵手忙脚乱，试写了demo，功能可以大致实现，就是数据有些混乱，突然，公司的后端大哥在身后拍了拍我肩膀，提示我“笛卡尔积”算法，说完发我一个用vue实现商品sku生成的案例网址，匆忙py感谢之后，立马下载案例 => npm install => npm run dev，虽然运行出来的结果没有达到期待，只能实现固定两种规格生成，但重点是“笛卡尔积”提示了我该如何做出来这个需求。

## 功能实现

&emsp;&emsp;在公司把模块弄好之后，回去也整理了，把模块简单的分离出来，在这里用elementUi实现一下，方便日后浏览：

```html
  <el-card>
    <el-form>
      <template v-for="(item, index) in form">
        <el-form-item label="规格名">
          <el-input v-model="item.name" placeholder="规格名" style="width: 200px;">
            <el-button
              slot="append"
              @click="delIcon(form, index, undefined)"
              icon="el-icon-delete"
              style="background: pink;"
              v-if="index !== 0"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="规格值">
          <el-input
            v-for="(item2, index2) in item.children"
            :key="index2"
            v-model="item2.value"
            placeholder="规格值"
            style="width: 200px;"
          >
          <!-- element封装好的，可以很方便的使用插槽，比如在输入框添加按钮 -->
            <el-button
              slot="append"
              icon="el-icon-delete"
              @click="delIcon(item.children, index2, index2)"
              v-if="index2 !== 0"
            ></el-button>
          </el-input>
          <el-button type="text" @click="item.children.push({value: ''})">添加规格值</el-button>
        </el-form-item>
      </template>
    </el-form>
    <el-button type="primary" @click="add" style="margin-bottom: 10px;">添加规格</el-button>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :prop="JSON.stringify(index)"
        :label="item"
      ></el-table-column>
      <!-- 以下按需求可以随意添加，记得修改后面的toArr方法 -->
      <el-table-column label="价格(元)">
        <template slot-scope="scope">
          <el-input v-model="scope.row[scope.row.length - 2]" />
        </template>
      </el-table-column>
      <el-table-column label="重量(kg)">
        <template slot-scope="scope">
          <el-input v-model="scope.row[scope.row.length - 1]" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 这里只是简单把规格合并出来，具体怎么提交都可以按需求来做 -->
    <el-button type="primary" @click="end" style="margin-top: 10px;">提交</el-button>
  </el-card>
```

```javascript
export default {
  data () {
    return {
      form: [{ // 数据
        name: '',
        children: [
          { value: '' }
        ]
      }],
      tableTitle: [], // 规格表格头标题
      tableData: [] // 规格表格数据
    }
  },
  methods: {
    // 添加规格
    add () {
      this.form.push({ 'name': '', 'children': [{ 'value': '' }] })
    },
    // 删除规格
    delIcon (arr, index, index2) {
      if (index2 === undefined) {
        this.tableTitle.splice(index + 1, 1)
        arr.splice(index, 1)
        return
      } else {
        arr.splice(index, 1)
        return
      }
    },
    // 笛卡尔积
    cartesianProduct (arr) { // 传入集合
      return Array.prototype.reduce.call(arr, function (a, b) { // 使用数组原型reduce方法
        let ret = []
        a.forEach(function (a) {
          b.forEach(function (b) {
            ret.push(a.concat([b])) // 合并每个集合
          })
        })
        return ret
      }, [[]]) // 初始值 [[]]
    },
    // 表单转表格数据
    jsonToArray (arr) {
      let newArr = [] // 创建新数组
      let oldArr = arr // 复制旧数组
      this.tableTitle = [] // 避免重新提交数据混乱，先清空
      // 遍历传进来的数组，对子数组再遍历，取到value值，添加到刚创建的新数组中，这里主要为了转换成 笛卡尔积 所需用到的数组格式。 
      // 例： '[{ "name": "颜色", "children": [{ "value": "红" }, { "value": "黄" }] }, { "name": "重量", "children": [{ "value": "1g" }, { "value": "2g" }] }]'  =>  '[['红', '黄'], ['1g', '2g']]' "
      oldArr.map(item => {
        newArr.push(item.children.map(item2 => item2.value))
        // 顺便添加到表格表头的数据
        this.tableTitle.push(item.name)
      })
      // 使用笛卡尔积
      this.tableData = this.cartesianProduct(newArr)
      // 在每个一维数组添加自己另外需要的数据
      this.tableData.map(item3 => {
        item3.push('')
        item3.push('')
      })
    },
    end () {
      this.$confirm('是否确定数据无误?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /* 开始提交 */
        this.jsonToArray(this.form)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
```

## 添加规格的图片展示

![Vue使用笛卡尔积生成多规格商品SKU](/modem-bookmarks/image/Vue使用笛卡尔积生成多规格商品SKU/添加规格.png)

## 提交结果的图片展示

![Vue使用笛卡尔积生成多规格商品SKU](/modem-bookmarks/image/Vue使用笛卡尔积生成多规格商品SKU/提交图片1.png)
![Vue使用笛卡尔积生成多规格商品SKU](/modem-bookmarks/image/Vue使用笛卡尔积生成多规格商品SKU/提交图片2.png)
![Vue使用笛卡尔积生成多规格商品SKU](/modem-bookmarks/image/Vue使用笛卡尔积生成多规格商品SKU/提交图片3.png)
![Vue使用笛卡尔积生成多规格商品SKU](/modem-bookmarks/image/Vue使用笛卡尔积生成多规格商品SKU/提交图片4.png)
![Vue使用笛卡尔积生成多规格商品SKU](/modem-bookmarks/image/Vue使用笛卡尔积生成多规格商品SKU/提交图片5.png)

## Demo

&emsp;&emsp;可以试一下使用elementUi做的一个demo

<Vue使用笛卡尔积生成多规格商品SKU />

## 结语

&emsp;&emsp;可以看出来，相比一个个不同的属性去添加，这样人性化了不止一点点，虽然这只是一个小需求，做电商的应该都经常写到的小代码块，但也在让我学到，有些时候，代码不是敲的多的就牛逼，最终实现给用户的操作性等才能考验代码的质量，前端学无止境，继续加油！
