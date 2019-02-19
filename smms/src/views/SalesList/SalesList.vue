<template>
  <div class="sales-list">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>销售明细</span>
      </div>
      <div class="text item">
        <!-- 销售明细表单 -->
        <el-form
          size="mini"
          style="text-align:left;"
          :inline="true"
          :model="salesListForm"
          class="demo-form-inline"
          label-position="left"
        >
          <!-- 开始时间 -->
          <el-form-item label="开始时间：">
            <div class="block">
              <el-date-picker
                v-model="startTime"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <!-- 结束时间 -->
          <el-form-item label="结束时间：">
            <div class="block">
              <el-date-picker
                v-model="endTime"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
          </el-form-item><br>
          <!-- 搜索 -->
          <el-form-item
            prop="serch"
            label="搜索："
          >
            <el-input
              type="text"
              v-model="salesListForm.keyword"
              autocomplete="off"
              style="width:200px;"
              placeholder="请输入商品名称，订单号"
            ></el-input>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
            >查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 销售明细表格 -->
        <el-table
          ref="multipleTable"
          :data="salesListTableData"
          tooltip-effect="dark"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>
          <el-table-column
            prop="ordernum"
            label="订单号"
          >
          </el-table-column>
          <el-table-column
            prop="goodsname"
            label="名称"
          >
          </el-table-column>
          <el-table-column
            prop="number"
            label="数量"
          >
          </el-table-column>
          <el-table-column
            prop="price"
            label="实际售价"
          >
          </el-table-column>
          <el-table-column
            prop="saleTotalPrice"
            label="优惠（促销/会员）"
          >
          </el-table-column>
          <el-table-column
            prop="refund"
            label="退款"
          >
          </el-table-column>

          <el-table-column
            label="销售时间"
            prop="ctime"
          >
            <template slot-scope="scope">{{ scope.row.ctime | filterCtime}}</template>
          </el-table-column>

          <el-table-column label="管理">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row.id)"
              >
                <i class="el-icon-edit"></i>编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)"
              >
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
            :page-sizes="[1, 5, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <!-- 批量删除 -->
        <div style="margin-top: 20px;text-align:left;">
          <el-button @click="batchDelete">批量删除</el-button>
          <el-button @click="cancelSelect()">取消选择</el-button>
        </div>
        <!-- 修改的弹出模态框 -->
        <el-dialog
          title="销售明细修改"
          width="400px"
          :visible.sync="flag"
          style="text-align:center;"
        >
          <!-- 回填表单 -->
          <el-form
            :model="editForm"
            label-width="100px"
            :rules="rules"
          >

            <el-form-item
              label="订单号："
              prop="ordernum"
            >
              <el-input
                type="text"
                v-model="editForm.ordernum"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="名称："
              prop="goodsname"
            >
              <el-input
                type="text"
                v-model="editForm.goodsname"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="数量："
              prop="number"
            >
              <el-input
                type="text"
                v-model="editForm.number"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="实际售价："
              prop="price"
            >
              <el-input
                type="text"
                v-model="editForm.price"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="优惠："
              prop="saleTotalPrice"
            >
              <el-input
                type="text"
                v-model="editForm.saleTotalPrice"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="退款："
              prop="refund"
            >
              <el-input
                type="text"
                v-model="editForm.refund"
                autocomplete="off"
              ></el-input>
            </el-form-item>

          </el-form>
          <!-- 表单的尾部 -->
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="flag = false">取 消</el-button>
            <el-button
              type="primary"
              @click="saveEdit"
            >确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入moment
import moment from "moment";

import qs from "qs";
export default {
  data() {
    return {
      startTime: "",
      endTime: "",
      currentPage: 1, //当前页数
      pageSize: 5, //每页条数
      total: 1, //数据总条数
      flag: false, // 控制修改模态框的显示和隐藏
      selectedAccount: [], // 被选中的账号数据
      editForm: {
        // 修改表单数据
        ordernum: "",
        goodsname: "",
        number: "",
        price: "",
        saleTotalPrice: "",
        refund: ""
      },
      salesListForm: {
        keyword: ""
      },
      salesListTableData: [], //表格数据
      rules: {
        // 验证条形码
        goodsname: [
          // 非空验证
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        // 验证条形码
        ordernum: [
          // 非空验证
          { required: true, message: "请输入订单号", trigger: "blur" }
        ],
        // 验证进价
        number: [
          // 非空验证
          { required: true, message: "请输入数量", trigger: "blur" }
        ],
        price: [
          // 非空验证
          { required: true, message: "请输入单价", trigger: "blur" }
        ],
        saleTotalPrice:[
          { required: true, message: "请输入优惠价格", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 自动发送请求 获取数据
    this.getStockListByPage();
  },
  methods: {
    onSubmit() {
      this.getStockListByPage();
    },
    // 按照分页显示数据的函数
    getStockListByPage() {
      // 收集当前页码 和 每页显示条数
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      let keyword = this.salesListForm.keyword;
      // 发送ajax请求 把分页数据发送给后端
      this.axios
        .get("http://127.0.0.1:999/sales/saleslistbypage", {
          params: {
            pageSize,
            currentPage,
            keyword
          }
        })
        .then(response => {
          // 接收后端返回的数据总条数 total 和 对应页码的数据 data
          let { total, data } = response.data;
          // 赋值给对应的变量即可
          this.total = total;
          this.salesListTableData = data;
          // 如果当前页没有数据 且 排除第一页
          if (!data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getStockListByPage();
          }
        })
        .catch(err => {
          console.log(err);
        });
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
      this.selectedSales = val;
    },
    // 批量删除
    batchDelete() {
      // 收集需要删除的账号的id（勾选几个 就是几个 数据类型应该是一个数组）
      let selectedId = this.selectedSales.map(v => v.id);

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
            .get(`http://127.0.0.1:999/sales/batchdelete`, {
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
          });
        });
    },
    // 取消选中
    cancelSelect() {
      this.$refs.multipleTable.clearSelection();
    },

    // 删除商品函数
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
            .get(`http://127.0.0.1:999/sales/salesdel?id=${id}`)
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
        .get(`http://127.0.0.1:999/sales/salesedit?id=${id}`)
        .then(response => {
          // 接收后端的数据，后端返回的数据即使只有一条 也是数组
          let result = response.data[0];
          // 回填表单
          this.editForm.ordernum = result.ordernum;
          this.editForm.goodsname = result.goodsname;
          this.editForm.number = result.number;
          this.editForm.price = result.price;
          this.editForm.saleTotalPrice = result.saleTotalPrice;
          this.editForm.refund = result.refund;

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
        ordernum: this.editForm.ordernum,
        goodsname: this.editForm.goodsname,
        number: this.editForm.number,
        price: this.editForm.price,
        saleTotalPrice: this.editForm.saleTotalPrice,
        refund: this.editForm.refund,
        editId: this.editId
      };
      // 发送ajax请求 把新数据和原来的id一起发送给后端
      this.axios
        .post("http://127.0.0.1:999/sales/saleseditsave", qs.stringify(params))
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
  },
  //过滤器
  filters: {
    // 过滤时间的函数
    filterCtime(ctime) {
      return moment(ctime).format("YYYY/MM/DD HH:mm:ss");
    }
  }
};
</script>


<style lang="less">
.sales-list {
  .el-card {
    .el-card__header {
      text-align-last: left;
      font-size: 18px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
  }
}
</style>
