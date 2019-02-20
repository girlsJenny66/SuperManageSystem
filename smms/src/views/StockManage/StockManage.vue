<template>
    <div class="stock-manage">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>库存管理</span>
            </div>
            <div class="text item">
                <!-- 商品管理表单 -->
                <el-form size="mini" style="text-align:left;" :inline="true" :model="commodityForm" class="demo-form-inline" label-position="left">
                  <!-- 选择分类 -->
                  <el-form-item>
                    <el-select v-model="commodityForm.categories" placeholder="--请选择分类--" label-width="50px">
                      <el-option label="全部" value="全部"></el-option>
                      <el-option label="家居日用类" value="家居日用类"></el-option>
                      <el-option label="食品类" value="食品类"></el-option>
                      <el-option label="电器类" value="电器类"></el-option>
                      <el-option label="酒水类" value="酒水类"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- 关键字 -->
                  <el-form-item prop="keyword" label="关键字">
                    <el-input type="text" v-model="commodityForm.keyword" autocomplete="off" placeholder="商品名称或条形码"></el-input>
                  </el-form-item>
                  <!-- 查询按钮 -->
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                  </el-form-item>
                </el-form>
                <!-- 表格 -->
                <template>
                    <el-table
                        ref="multipleTable"
                        :data="commodityTableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <!-- 单选框 -->
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>

                        <!-- 条形码 -->
                        <el-table-column
                        prop="barcode"
                        label="商品条形码"
                        >
                        </el-table-column>

                        <!-- 商品名称 -->
                        <el-table-column
                        prop="goodsname"
                        label="商品名称"
                        >
                        </el-table-column>

                        <!-- 分类 -->
                        <el-table-column
                        prop="categories"
                        label="分类"
                        >
                        </el-table-column>

                        <!-- 进价 -->
                        <el-table-column
                        prop="productAdd"
                        label="进价（元）"
                        show-overflow-tooltip>
                        </el-table-column>

                        <!-- 入库 -->
                        <el-table-column
                        prop="warehousing"
                        label="入库"
                        show-overflow-tooltip>
                        </el-table-column>

                        <!-- 库存 -->
                        <el-table-column
                        prop="inventory"
                        label="库存"
                        show-overflow-tooltip>
                        </el-table-column>


                        <!-- 已售 -->
                        <el-table-column
                        prop="sold"
                        label="已售"
                        show-overflow-tooltip>
                        </el-table-column>

                        <!-- 管理 -->
                        <el-table-column
                        prop="administration"
                        label="管理"
                        >
                            <template slot-scope="scope">
                                <el-button
                                type="primary"
                                size="mini"
                                @click="handleEdit(scope.row.id)">
                                <i class="el-icon-edit"></i> 修改
                                </el-button>
                                <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.row.id)">
                                <i class="el-icon-delete"></i>删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    
                    <!-- 分页 -->
                    <div style="margin-top: 20px; text-align: left;">
                   <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[1, 3, 5, 10, 20, 50]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
                  </el-pagination>
                </div>

                  <!-- 批量删除 -->
                  <div style="margin-top: 20px;text-align:left;">
                      <el-button @click="batchDelete">批量删除</el-button>
                      <el-button @click="cancelSelect()">取消选择</el-button>
                  </div>
                    <!-- 修改的弹出模态框 -->
                      <el-dialog title="商品修改" width="600px" :visible.sync="flag">
                        <!-- 回填表单 -->
                        <el-form :model="editForm"  label-width="200px" :rules="rules">
                            
                          <el-form-item label="商品条形码：" prop="barcode">
                              <el-input type="text" v-model="editForm.barcode" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="商品名称：" prop="goodsname">
                              <el-input type="text" v-model="editForm.goodsname" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="所属分类" prop="categories">
                            <el-select v-model="editForm.categories" placeholder="请选择分类">
                              <el-option label="家居日用类" value="家居日用类"></el-option>
                              <el-option label="食品类" value="食品类"></el-option>
                              <el-option label="电器类" value="电器类"></el-option>
                              <el-option label="酒水类" value="酒水类"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="进价（元）：" prop="productAdd">
                              <el-input type="text" v-model="editForm.productAdd" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="入库：" prop="warehousing">
                              <el-input type="text" v-model="editForm.warehousing" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="库存：" prop="inventory">
                              <el-input type="text" v-model="editForm.inventory" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="已售：" prop="sold">
                              <el-input type="text" v-model="editForm.sold" autocomplete="off"></el-input>
                          </el-form-item>

                        

                        </el-form>
                        <!-- 表单的尾部 -->
                        <div slot="footer" class="dialog-footer">
                          <el-button @click="flag = false">取 消</el-button>
                          <el-button type="primary" @click="saveEdit">确 定</el-button>
                        </div>
                      </el-dialog>      
                
                </template>
            </div>
        </el-card>
    </div>
</template>

<script>
import qs from 'qs';
export default {
    data() {
      return {
        currentPage: 1,//当前页数
        pageSize: 5,//每页条数
        total: 1,//数据总条数
        flag: false, // 控制修改模态框的显示和隐藏
        selectedAccount: [], // 被选中的账号数据
        editForm: {
            // 修改表单数据
            barcode: "",
            goodsname: "",
            categories:"",            
            productAdd:"",
            warehousing:"",
            inventory:"",
            sold:""
        },
        commodityForm: {
          categories:"",
          keyword:""
        },
        commodityTableData: [],//表格数据
        selectedStock:[],
        rules: {
          // 验证条形码
          barcode: [
            // 非空验证
            { required: true, message: "请输入条形码", trigger: "blur" }
          ],
          // 验证名称
          goodsname: [
            // 非空验证
            { required: true, message: "请输入商品名称", trigger: "blur" }
          ],
          categories:[
            { required: true, message: "请选择所属分类", trigger: "change" }
          ],
          // 验证进价
          productAdd: [
            // 非空验证
            { required: true, message: "请输入进价", trigger: "blur" }
          ],
          // 验证入库
          warehousing: [
            // 非空验证
            { required: true, message: "请输入入库数量", trigger: "blur" }
          ],
          // 验证库存
          inventory: [
            // 非空验证
            { required: true, message: "请输入库存数量", trigger: "blur" }
          ],
          // 验证已售
          sold: [
            // 非空验证
            { required: true, message: "请输入已售数量", trigger: "blur" }
          ]
        }
      }
        
    },
    created() {
      // 自动发送请求 获取数据 
      this.getStockListByPage();
    },
    methods: {
    onSubmit(){
      this.getStockListByPage();
    },
   // 按照分页显示数据的函数
    getStockListByPage () {
     
      // 收集当前页码 和 每页显示条数
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      let categories= this.commodityForm.categories;
      let keyword = this.commodityForm.keyword;
      // 发送ajax请求 把分页数据发送给后端
      this.axios.get('http://172.16.9.46:999/stock/stocklistbypage', {
        params: {
          pageSize,
          currentPage,
          categories,
          keyword
        }
      })
        .then(response => {
          // 接收后端返回的数据总条数 total 和 对应页码的数据 data
          let {total, data} = response.data;
          // 赋值给对应的变量即可
          this.total = total;
          this.commodityTableData = data;
          // 如果当前页没有数据 且 排除第一页
          if ( !data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getStockListByPage();
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    
    // 每页显示条数改变 就会触发这个函数
    handleSizeChange(val) {
      // 保存每页显示的条数
      this.pageSize = val;
      // 调用分页函数
      this.getStockListByPage();
    },
    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // 保存当前页码
      this.currentPage = val;
      // 调用分页函数
      this.getStockListByPage();
    },
    // 当单选框的选中状态改变 就会触发这个函数
    handleSelectionChange(val) {
      // 把被选中的账号 保存到一个变量中
      this.selectedStock = val;
    },
    // 批量删除
    batchDelete() {
      // 收集需要删除的账号的id（勾选几个 就是几个 数据类型应该是一个数组）
      let selectedId = this.selectedStock.map(v => v.id);

      // 如果用户什么都不选
      if (!selectedId.length) {
        this.$message.error("请选择需要删除的商品");
        return;
      }

      // 确认框
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 发送ajax 把需要删除账号数据的id发送给后端
          this.axios
            .get(`http://172.16.9.46:999/stock/batchdelete`, {
              params: {
                selectedId
              }
            })
            .then(response => {
              // 接收错误码和提示信息
              let { error_code, reason } = response.data;
              // 判断
              if (error_code === 0) {
                // 成功
                // 弹出成功提示
                this.$message({
                  type: "success",
                  message: reason
                });
                // 刷新列表
                this.getStockListByPage();
              } else {
                // 失败
                // 弹出失败的提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
         // 如果是取消 就执行catch
        .catch(() => {
          // 弹出取消删除的提示
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    // 取消选中
    cancelSelect() {
      this.$refs.multipleTable.clearSelection();
    },
    // 删除账号函数
    handleDelete(id) {
      // 确认框
      this.$confirm("你确定要删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        // 如果是确定 就执行then
        .then(() => {
          // 发送ajax 把id传给后端
          this.axios
            .get(`http://172.16.9.46:999/stock/stockdel?id=${id}`)
            .then(response => {
              // 接收后端返回的错误码 和 提示信息
              let { error_code, reason } = response.data;
              // 判断
              if (error_code === 0) {
                // 弹出删除成功的提示
                this.$message({
                  type: "success",
                  message: reason
                });
                // 刷新列表（再次调用请求所有用户账号的函数 由于之前已经删除了 所以再次请求 得到的是删除后的数据）
                this.getStockListByPage();
              } else {
                // 弹出删除失败的提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        // 如果是取消 就执行catch
        .catch(() => {
          // 弹出取消删除的提示
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改
    handleEdit(id) {
      // 把要修改的这一条数据的id保存下来
      this.editId = id;

      // 发送请求 把id发送给后端
      this.axios
        .get(`http://172.16.9.46:999/stock/stockedit?id=${id}`)
        .then(response => {
          // 接收后端的数据，后端返回的数据即使只有一条 也是数组
          let result = response.data[0];
          // 回填表单
          this.editForm.barcode = result.barcode;
          this.editForm.goodsname = result.goodsname;
          this.editForm.categories = result.categories;
          this.editForm.productAdd = result.productAdd;
          this.editForm.warehousing = result.warehousing;
          this.editForm.inventory = result.inventory;
          this.editForm.sold = result.sold;

          // 显示模态框 (回填数据之后)
          this.flag = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 保存修改
    saveEdit() {
      // 收集新数据 和 一个原来的id
      let params = {
        barcode: this.editForm.barcode,
        goodsname: this.editForm.goodsname,
        categories: this.editForm.categories,
        productAdd: this.editForm.productAdd,
        warehousing: this.editForm.warehousing,
        inventory: this.editForm.inventory,
        sold: this.editForm.sold,
        editId: this.editId
      };
      // 发送ajax请求 把新数据和原来的id一起发送给后端
      this.axios
        .post(
          "http://172.16.9.46:999/stock/stockeditsave",
          qs.stringify(params)
        )
        .then(response => {
          // 接收错误码和提示信息
          let { error_code, reason } = response.data;
          if (error_code === 0) {
            // 弹出成功的提示
            this.$message({
              type: "success",
              message: reason
            });
            // 刷新列表（重新请求所有账号数据）
            this.getStockListByPage();
          } else {
            // 弹出失败的提示
            this.$message.error(reason);
          }
          // 关闭模态框
          this.flag = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
    }

</script>

<style lang="less">
.stock-manage{
    .el-card {
        .el-card__header {
            text-align-last: left;
            font-size: 18px;
            font-weight: 600;
            background-color: #f1f1f1;
        }
        .el-card__body{         
            .el-form-item__content{
            width:210px;
        }
           
      }
    }
}
</style>