<template>
  <div class="goods-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加商品</span>
      </div>
      <div class="text item">
        <!-- 添加商品表单 -->
        <el-form size="mini" :model="goodsAddForm" status-icon :rules="rules" ref="goodsAddForm" label-width="100px" class="demo-ruleForm">         
          <el-form-item label="所属分类" prop="categories">
            <el-select v-model="goodsAddForm.categories" placeholder="-----选择分类-----">
              <el-option label="家居日用" value="家居日用"></el-option>
              <el-option label="食品" value="食品"></el-option>
              <el-option label="电器" value="电器"></el-option>
              <el-option label="饮料" value="饮料"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品条形码" prop="barCode">
            <el-input v-model="goodsAddForm.barCode"></el-input>
            <el-button type="success">生成条形码</el-button>        
          </el-form-item>

          <el-form-item label="商品名称" prop="goodsname">
            <el-input v-model="goodsAddForm.goodsname"></el-input>
          </el-form-item>

          <el-form-item label="商品售价" prop="price">
            <el-input v-model="goodsAddForm.price"></el-input>元
          </el-form-item>

          <el-form-item label="市场价">
            <el-input v-model="goodsAddForm.marketPrice"></el-input>元
            默认市场价为售价的1.2倍
          </el-form-item>

          <el-form-item label="商品进价">
            <el-input v-model="goodsAddForm.purchasePrice"></el-input>元
          </el-form-item>

          <el-form-item label="入库数量">
            <el-input v-model="goodsAddForm.stockNum"></el-input>
            计重商品单位为千克
          </el-form-item>

          <el-form-item label="商品重量">
            <el-input v-model="goodsAddForm.goodsWeight"></el-input>
          </el-form-item>

          <el-form-item label="商品单位">
            <el-input v-model="goodsAddForm.goodsUnit"></el-input>
          </el-form-item>

          <el-form-item label="会员优惠">
            <el-radio-group v-model="goodsAddForm.memberDiscount">
              <el-radio label="享受"></el-radio>
              <el-radio label="不享受"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否促销">
            <el-radio-group v-model="goodsAddForm.sales">
              <el-radio label="启用"></el-radio>
              <el-radio label="禁用"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="商品简介">
            <el-input type="textarea" autosize v-model="goodsAddForm.goodsDesc"></el-input>
            不超过200个汉字
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onAdd('goodsAddForm')">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      goodsAddForm:{
        categories: "",
        barCode: "",
        goodsname: "",
        price:"",
        marketPrice:"",
        purchasePrice:"",
        stockNum:"",
        goodsWeight:"",
        goodsUnit:"",
        memberDiscount:"享受",
        sales:"禁用",
        goodsDesc:""
      },
      rules:{
        categories:[
          { required: true, message: "请选择所属分类", trigger: "change" }
        ],
        barCode:[
          { required: true, message: "请选择条形码", trigger: "blur" }
        ],
        goodsname:[
          { required: true, message: "请选择商品名称", trigger: "blur" }
        ],
        price:[
          { required: true, message: "请选择商品售价", trigger: "blur" }
        ]
      }
    }
    
  },
  methods:{
    onAdd(formName){
      //获取表单组件 调用验证方法
      this.$refs[formName].validate(valid => {
        //如果所有验证通过，valid就是true
        if (valid) {
          alert("恭喜你,添加商品成功");
          //后续吧收集的账号和密码 一起发送给后台 验证账号和密码的正确性
          //收集账号和密码
          const params = {
            categories: this.goodsAddForm.categories,
            barCode: this.goodsAddForm.barCode,
            goodsname:this.goodsAddForm.goodsname,
            price:this.goodsAddForm.price,
          };
          //发送请求 把参数发给后端
          //console.log(params);

          //跳转到账号管理页面
          this.$router.push("/goodsmanage")
        } else {
          //否则就是false
          alert("sorry,添加商品失败，请将必填项补全！");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.goods-add {
  .el-card {
    .el-card__header {
      text-align-last: left;
      font-size: 18px;
      font-weight: 600;
      background-color: #f1f1f1;
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
}
</style>