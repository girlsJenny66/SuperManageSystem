<template>
  <div class="return-goods">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>商品退货</span>
      </div>
      <div class="text item">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          inline
          style="text-align:left;"
        >
          <!-- 搜索框 -->
          <el-form-item label="订单号：">
            <el-input v-model="form.ordernum"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item>
            <el-button
              type="success"
              @click="inquire"
            >查询</el-button>
          </el-form-item>

          <!-- 修改的弹出模态框 -->
          <el-dialog
            title="商品退货"
            width="500px"
            :visible.sync="flag"
          >
            <!-- 回填表单 -->
            <el-form
              :model="editForm"
              label-width="100px"
              :rules="rules"
            >

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
              >退货</el-button>
            </div>
          </el-dialog>
        </el-form>

      </div>
    </el-card>
  </div>
</template>

<script>
import qs from 'qs';
export default {
  data() {
    return {
      form: {
        ordernum: ""
      },
      flag: false, // 控制修改模态框的显示和隐藏
      editForm: {
        // 修改表单数据
        goodsname: "",
        number: "",
        price: "",
        saleTotalPrice: "",
        refund: ""
      },
      ordernum:"",
      rules: {
        // 验证条形码
        goodsname: [
          // 非空验证
          { required: true, message: "请输入商品名称", trigger: "blur" }
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
  methods: {
    // 查询
    inquire(ordernum) {
      // 把要修改的这一条数据保存下来
      this.ordernum = this.form.ordernum;
      
      if (ordernum !== "") {
        this.axios
          .get(`http://127.0.0.1:999/sales/sales001?ordernum=${this.ordernum}`)
          .then(response => {
            // 接收后端的数据，后端返回的数据即使只有一条 也是数组
            let result = response.data[0];
            // 回填表单
            this.editForm.goodsname = result.goodsname;
            this.editForm.number = result.number;
            this.editForm.price = result.price;
            this.editForm.saleTotalPrice = result.saleTotalPrice;
 
            // 显示模态框 (回填数据之后)
            this.flag = true;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        return false;
      }
    },

    // 发送请求 把id发送给后端

    // 保存退货信息
    saveEdit() {
      // 收集新数据 和 一个原来的id
      let params = {
        goodsname: this.editForm.goodsname,
        number: this.editForm.number,
        price: this.editForm.price,
        saleTotalPrice: this.editForm.saleTotalPrice,
        refund: this.editForm.refund,
        ordernum: this.ordernum
      };
      console.log(params);
      
      // 发送ajax请求 把新数据和原来的id一起发送给后端
      this.axios
        .post("http://127.0.0.1:999/sales/sales002", qs.stringify(params))
        .then(response => {
          // 接收错误码和提示信息
          let { error_code, reason } = response.data;
          if (error_code === 0) {
            // 弹出成功的提示
            this.$message({
              type: "success",
              message: reason
            });
            this.flag = false;
            this.$router.push('/saleslist');
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
};
</script>

<style lang="less">
.return-goods {
  .el-card {
    .el-card__header {
      text-align-last: left;
      font-size: 18px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
    .el-card__body{
      .el-dialog__body{
        .el-form{
          .el-form-item{
            .el-form-item__label{
              width: 100px!important;
            }
            .el-form-item__content{
              width: 330px;
              margin-left: 0!important;
              .el-form-item__error{
                  margin-left: 110px;
                }
            }
          }
        }
      }
    }
  }
}
</style>