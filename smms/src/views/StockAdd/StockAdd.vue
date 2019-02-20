<template>
  <div class="stock-add">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>商品入库</span>
      </div>
      <div class="text item">
        <el-form
          ref="enterForm"
          :model="enterForm"
          :rules="rules"
          label-width="150px"
          style="width:300px;text-align:left;"
          inline
          size="mini"
        >
          <el-form-item
            label="商品条形码："
            prop="barcode"
          >
            <el-input v-model="enterForm.barcode"></el-input>
          </el-form-item>
          <el-form-item
            label="商品名称："
            prop="goodsname"
          >
            <el-input v-model="enterForm.goodsname"></el-input>
          </el-form-item>
          <el-form-item label="所属分类" prop="categories">
            <el-select v-model="enterForm.categories" placeholder="-----选择分类-----">
              <el-option label="家居日用类" value="家居日用类"></el-option>
              <el-option label="食品类" value="食品类"></el-option>
              <el-option label="电器类" value="电器类"></el-option>
              <el-option label="酒水类" value="酒水类"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="进价（元）："
            prop="productAdd"
          >
            <el-input v-model="enterForm.productAdd"></el-input>
          </el-form-item>
          <el-form-item
            label="入库："
            prop="warehousing"
          >
            <el-input v-model="enterForm.warehousing"></el-input>
          </el-form-item>
          <el-form-item
            label="库存："
            prop="inventory"
          >
            <el-input v-model="enterForm.inventory"></el-input>
          </el-form-item>
          <el-form-item
            label="已售："
            prop="sold"
          >
            <el-input v-model="enterForm.sold"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-button
            type="success"
            @click="submitForm('enterForm')"
          >入库</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入qs库
import qs from "qs";

export default {
  data() {
    return {
      enterForm: {
        barcode: "",
        goodstname: "",
        categories:"",
        purchasingPrice: "",
        enter: "",
        inventory: "",
        outOfPrint: ""
      },
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
    };
  },
  methods: {
    // 点击登录按钮 触发这个函数
    submitForm(formName) {
      // 获取表单组件 调用验证方法
      this.$refs[formName].validate(valid => {
        // 如果所有验证通过 valid就是true
        if (valid) {
          // 收集用户输入的所有账号数据
          let params = {
            barcode: this.enterForm.barcode,
            goodsname: this.enterForm.goodsname,
            categories: this.enterForm.categories,
            productAdd: this.enterForm.productAdd,
            warehousing: this.enterForm.warehousing,
            inventory: this.enterForm.inventory,
            sold: this.enterForm.sold
          };

          // 使用axios发送数据给后端
          this.axios
            .post("http://172.16.9.46:999/stock/stockadd", qs.stringify(params))
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

                // 跳转到库存管理列表
                this.$router.push("/stockmanage");
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
.stock-add {
  .el-card {
    .el-card__header {
      text-align-last: left;
      font-size: 18px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
    .el-form-item__label {
      text-align: left;
    }
  }
}
</style>
