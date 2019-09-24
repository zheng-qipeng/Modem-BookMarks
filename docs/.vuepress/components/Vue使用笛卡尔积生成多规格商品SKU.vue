<template>
  <el-card>
    <!-- {{ form }} -->
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
    <!-- {{ tableData }} -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column
        v-for="(item, index) in tableTitle"
        :key="index"
        :prop="JSON.stringify(index)"
        :label="item"
      ></el-table-column>
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
    <el-button type="primary" @click="end" style="margin-top: 10px;">提交</el-button>
  </el-card>
</template>

<script>
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
    cartesianProduct (arr) {
      return Array.prototype.reduce.call(arr, function (a, b) {
        let ret = []
        a.forEach(function (a) {
          b.forEach(function (b) {
            ret.push(a.concat([b]))
          })
        })
        return ret
      }, [[]])
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
        // 顺便创建表格表头的数据
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
</script>

<style lang='scss'>
table[class^="el-table"] {
  margin: 0;
}
</style>
