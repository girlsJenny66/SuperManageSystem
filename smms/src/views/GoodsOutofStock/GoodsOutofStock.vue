<template>
  <div class="goods-outofstock">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>商品销售</span>
      </div>
      <div class="text item">
        <!-- 商品销售表单 -->
        <el-form
          size="mini"
          :model="goodsSalesForm"
          status-icon
          :rules="rules"
          ref="goodsSalesForm"
          label-width="150px"
          class="demo-ruleForm"
          style="width:400px;">
          <el-form-item
            label="商品名称"
            prop="goodsname"
          >
            <el-input v-model="goodsSalesForm.goodsname"></el-input>
          </el-form-item>

          <el-form-item
            label="订单号"
            prop="ordernum"
          >
            <el-input v-model="goodsSalesForm.ordernum"></el-input>
          </el-form-item>

          <el-form-item
            label="商品条形码"
            prop="barcode"
          >
            <el-input v-model="goodsSalesForm.barcode"></el-input>
          </el-form-item>

          <el-form-item
            label="数量"
            prop="number"
          >
            <el-input v-model="goodsSalesForm.number"></el-input>
          </el-form-item>

          <el-form-item
            label="单价"
            prop="price"
          >
            <el-input v-model="goodsSalesForm.price"></el-input>
          </el-form-item>

          <el-form-item
            label="优惠"
            prop="discount"
          >
            <el-input v-model="goodsSalesForm.discount"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="onOrder('goodsSalesForm')"
            >加入订单</el-button>
          </el-form-item>

        </el-form>

        <!-- 商品销售表格 -->
        <el-table
          ref="multipleTable"
          :data="goodsSalesTableData"
          tooltip-effect="dark"
          style="width: 100%;"
          empty-text="暂无商品">
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
            label="单价（元）"
          >
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="总价（元）"
          >
          </el-table-column>
          <el-table-column
            prop="saleTotalPrice"
            label="优惠总价（元）"
          >
          </el-table-column>
        </el-table>

      </div>
    </el-card>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      goodsSalesForm: {
        goodsname: "",
        ordernum: "",
        barcode: "",
        number: "",
        price: "",
        discount:""
      },
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
        // 验证名称
        barcode: [
          // 非空验证
          { required: true, message: "请输入条形码", trigger: "blur" }
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
        discount:[
          { required: true, message: "请输入优惠价格", trigger: "blur" }
        ]
      },
      goodsSalesTableData: []
    };
  },
  created() {
    // 自动发送请求 获取数据
    this.getCometList();
  },
  methods: {
    // 请求所有账号数据的函数
    getCometList() {
      this.axios
        .get("http://172.16.9.46:999/sales/comeList")
        .then(response => {
          // 把后端返回的账号数据 赋值给商品出库表格数据
          this.goodsSalesTableData = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    onOrder(formName) {
      // 获取表单组件 调用验证方法
      this.$refs[formName].validate(valid => {
        // 如果所有验证通过 valid就是true
        if (valid) {
          // 收集用户输入的所有账号数据
          let params = {
            goodsname: this.goodsSalesForm.goodsname,
            ordernum: this.goodsSalesForm.ordernum,
            barcode: this.goodsSalesForm.barcode,
            number: this.goodsSalesForm.number,
            price: this.goodsSalesForm.price,
            discount: this.goodsSalesForm.discount,
            totalPrice: this.goodsSalesForm.number * this.goodsSalesForm.price,
            saleTotalPrice: this.goodsSalesForm.number * this.goodsSalesForm.discount,
          };
          console.log(params);
          
          // 使用axios发送数据给后端
          this.axios
            .post("http://172.16.9.46:999/sales/come", qs.stringify(params))
            .then(response => {
              // 接收后端返回的错误码 和 提示信息
              let { error_code, reason } = response.data;

              // 根据后端响应的数据判断
              if (error_code === 0) {
                // 弹出成功的提示
                this.$message({
                  type: "success",
                  message: reason
                });
                this.getCometList();
                this.$router.push('/saleslist');
              } else {
                // 弹出失败的提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          // 否则就是false
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.goods-outofstock {
  .el-card {
    .el-card__header {
      text-align-last: left;
      font-size: 18px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
  }
  .el-card__body {
    text-align: left;
    .el-form {
      width: 290px;
      .el-form-item {
        margin-bottom: 24px;
      }
    }
  }
}
</style>
