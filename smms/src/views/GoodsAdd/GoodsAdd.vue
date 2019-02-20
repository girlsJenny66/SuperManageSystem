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
              <el-option label="家居日用类" value="家居日用类"></el-option>
              <el-option label="食品类" value="食品类"></el-option>
              <el-option label="电器类" value="电器类"></el-option>
              <el-option label="酒水类" value="酒水类"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品条形码" prop="barcode">
            <el-input v-model="goodsAddForm.barcode"></el-input>
      
          </el-form-item>

          <el-form-item label="商品名称" prop="goodsname">
            <el-input v-model="goodsAddForm.goodsname"></el-input>
          </el-form-item>

          <el-form-item label="商品进价" prop="purchaseprice">
            <el-input v-model="goodsAddForm.purchaseprice" @blur="autoPrice"></el-input>
          </el-form-item>

          <el-form-item label="商品售价" prop="price">
            <el-input v-model="goodsAddForm.price" @blur="autoPrice"></el-input>
          </el-form-item>

          <el-form-item label="促销价" prop="salesprice">
            <el-input v-model="goodsAddForm.salesprice" @blur="autoPrice"></el-input>
          </el-form-item>

          <el-form-item label="市场价" prop="marketprice">
            <el-input v-model="goodsAddForm.marketprice" @blur="autoPrice"></el-input>
          </el-form-item>

          <el-form-item label="入库数量" prop="stocknum">
            <el-input v-model="goodsAddForm.stocknum"></el-input>
          </el-form-item>

          <el-form-item label="销售数量" prop="salenum">
            <el-input v-model="goodsAddForm.salenum"></el-input>
          </el-form-item>

          <el-form-item label="商品单位">
            <el-select v-model="goodsAddForm.goodsUnit" placeholder="-----选择单位-----">
                <el-option label="个" value="个"></el-option>
                <el-option label="件" value="件"></el-option>
                <el-option label="盒" value="盒"></el-option>
                <el-option label="斤" value="斤"></el-option>
                <el-option label="袋" value="袋"></el-option>
                <el-option label="瓶" value="瓶"></el-option>
                <el-option label="箱" value="箱"></el-option>
            </el-select>
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
            <el-input type="textarea" v-model="goodsAddForm.goodsDesc"></el-input>
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
import qs from 'qs';
export default {
  data(){
    return{
      goodsAddForm:{
        categories: "",
        barcode: "",
        goodsname: "",
        purchaseprice:"",
        price:"",
        salesprice:"",
        marketprice:"",
        stocknum:"",
        salenum:"",
        goodsUnit:"",
        memberDiscount:"享受",
        sales:"禁用",
        goodsDesc:""
      },
      rules:{
        categories:[
          { required: true, message: "请选择所属分类", trigger: "change" }
        ],
        barcode:[
          { required: true, message: "条形码不能为空", trigger: "blur" }
        ],
        goodsname:[
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        purchaseprice:[
          { required: true, message: "商品进价不能为空", trigger: "blur" }
        ],
        price:[
          { required: true, message: "商品售价不能为空", trigger: "blur" }
        ],
        salesprice:[
          { required: true, message: "促销价不能为空", trigger: "blur" }
        ],
        marketprice:[
          { required: true, message: "市场价不能为空", trigger: "blur" }
        ],
        stocknum:[
          { required: true, message: "库存数量不能为空", trigger: "blur" }
        ],
        salenum:[
          { required: true, message: "销售数量不能为空", trigger: "blur" }
        ]
      }
    }
    
  },
  methods:{
    //自动填充价格
    autoPrice(){
      //商品售价
      this.goodsAddForm.price = this.goodsAddForm.purchaseprice*2;
      //促销价
      this.goodsAddForm.salesprice = this.goodsAddForm.purchaseprice*2-2;
      //市场价
      this.goodsAddForm.marketprice = this.goodsAddForm.purchaseprice*3;
    },
    onAdd(formName){
      //获取表单组件 调用验证方法
      this.$refs[formName].validate(valid => {
        //如果所有验证通过，valid就是true
        if (valid) {
          //后续吧收集的账号和密码 一起发送给后台 验证账号和密码的正确性
          //收集账号和密码
          const params = {
            categories:this.goodsAddForm.categories,
            barcode: this.goodsAddForm.barcode,            
            goodsname:this.goodsAddForm.goodsname,
            purchaseprice:this.goodsAddForm.purchaseprice,
            price:this.goodsAddForm.price,
            salesprice:this.goodsAddForm.salesprice,
            marketprice:this.goodsAddForm.marketprice,
            stocknum:this.goodsAddForm.stocknum,
            salenum:this.goodsAddForm.salenum,
            goodsUnit:this.goodsAddForm.goodsUnit,
            memberDiscount:this.goodsAddForm.memberDiscount,
            sales:this.goodsAddForm.sales,
            goodsDesc:this.goodsAddForm.goodsDesc
          };
          //使用axios发送数据给后端
          this.axios.post('http://172.16.9.46:999/goods/goodsadd',qs.stringify(params))
           .then(response => {
             //console.log(response.data); 
            //接收后端传送的错误码和提示信息
            let { error_code , reason } = response.data;
            //根据后端响应的数据判断
            if(error_code === 0){
              //弹出成功的提示
              this.$message({
                type:"success",
                message: reason
              })
              //跳转到账号管理页面
              this.$router.push("/goodsmanage")
            }else{
              // 弹出失败的提示
              this.$message.error(reason);
            }           
          })
          .catch(err => {
            console.log(err);           
          })          
        } else {
          //否则就是false
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