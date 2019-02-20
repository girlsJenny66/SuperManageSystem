<template>
  <div class="goods-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品管理</span>
      </div>
      <div class="text item">
        <!-- 商品管理表单 -->
        <el-form size="mini" style="text-align:left;" :inline="true" :model="goodsmanage" class="demo-form-inline" label-position="left">
          <!-- 选择分类 -->
          <el-form-item>
            <el-select v-model="goodsmanage.categories" placeholder="--请选择分类--" label-width="50px">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="家居日用类" value="家居日用类"></el-option>
              <el-option label="食品类" value="食品类"></el-option>
              <el-option label="电器类" value="电器类"></el-option>
              <el-option label="酒水类" value="酒水类"></el-option>
            </el-select>
          </el-form-item>
          <!-- 关键字 -->
          <el-form-item prop="keyword" label="关键字">
            <el-input type="text" v-model="goodsmanage.keyword" autocomplete="off" placeholder="商品名称或条形码"></el-input>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 商品管理表格 -->
        <el-table ref="multipleTable" :data="manageTableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="barcode" label="商品条形码">
          </el-table-column>
          <el-table-column prop="goodsname" label="商品名称">
          </el-table-column>
          <el-table-column prop="categories" label="所属分类">
          </el-table-column>
          <el-table-column prop="price" label="售价(元)">
          </el-table-column>
          <el-table-column prop="salesprice" label="促销价(元)">
          </el-table-column>
          <el-table-column prop="marketprice" label="市场价(元)">
          </el-table-column>
          <el-table-column prop="stocknum" label="库存">
          </el-table-column>
          <el-table-column prop="totalinven" label="库存总额(元)">
          </el-table-column>
          <el-table-column prop="totalsales" label="销售总额(元)">
          </el-table-column>
          <el-table-column label="管理">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)">
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                <i class="el-icon-delete"></i>
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
            :total="total">
          </el-pagination>
        </div>

        <!-- 批量删除按钮和取消选中按钮 -->
        <div style="margin-top: 20px;text-align:left;">
          <el-button @click="batchDelete">批量删除</el-button>
          <el-button @click="cancelSelect()">取消选择</el-button>
        </div>

        <!-- 修改的弹出模态框 -->
        <el-dialog title="修改商品信息" :visible.sync="flag" width="400px">
          <!-- 回填表单 -->
          <el-form :model="editForm" label-width="60px" :rules="rules" ref="editForm">
            <el-form-item label="商品条形码" prop="barcode">
              <el-input style="width: 217px;" v-model="editForm.barcode" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="商品名称" prop="goodsname">
              <el-input style="width: 217px;" v-model="editForm.goodsname" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="所属分类" prop="categories">
              <el-select v-model="editForm.categories" placeholder="请选择分类">
                <el-option label="家居日用类" value="家居日用类"></el-option>
                <el-option label="食品类" value="食品类"></el-option>
                <el-option label="电器类" value="电器类"></el-option>
                <el-option label="酒水类" value="酒水类"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="进价" prop="purchaseprice">
              <el-input style="width: 217px;" v-model="editForm.purchaseprice" autocomplete="purchaseprice"></el-input>
            </el-form-item>

            <el-form-item label="售价" prop="price">
              <el-input style="width: 217px;" v-model="editForm.price" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="促销价" prop="salesprice">
              <el-input style="width: 217px;" v-model="editForm.salesprice" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="市场价" prop="marketprice">
              <el-input style="width: 217px;" v-model="editForm.marketprice" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="库存" prop="stocknum">
              <el-input style="width: 217px;" v-model="editForm.stocknum" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="销售数量" prop="salenum">
              <el-input style="width: 217px;" v-model="editForm.salenum" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="库存总额" prop="totalinven">
              <el-input style="width: 217px;" v-model="editForm.totalinven" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="销售总额" prop="totalsales">
              <el-input style="width: 217px;" v-model="editForm.totalsales" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="flag = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit('editForm')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import qs from 'qs';
export default {
  data() {
    return {
      goodsmanage: {
        categories: "",
        keyword:""    
      }, 
      manageTableData: [],
      selectedGoods:[],
      total:0,
      currentPage:1,
      pageSize:5,
      editid:"",
      editForm:{
        barcode: "",            
        goodsname:"",
        categories: "",
        purchaseprice:"",
        price:"",
        salesprice:"",
        marketprice:"",
        stocknum:"",
        salenum:"",
        totalinven:"",
        totalsales:""
      },
      flag:false,
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
        totalinven:[
          { required: true, message: "库存总额不能为空", trigger: "blur" }
        ],
        totalsales:[
          { required: true, message: "销售总额不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created(){
    //自动发送请求，获取所有用户账户数据 
    this.getGoodsListByPage();
  },
  methods:{
    //按照分页显示数据的函数
    getGoodsListByPage(){
      //收集当前页码和每页显示条数
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      let categories= this.goodsmanage.categories;
      let keyword = this.goodsmanage.keyword
      //发送ajax请求,把数据发送给后台
      this.axios.get('http://172.16.9.46:999/goods/goodslistbypage',{
        params:{
          pageSize,
          currentPage,
          categories,
          keyword
        }
      })
      .then(response => {
        //console.log(response.data);
        //接收后端返回的数据
        let {total,data} = response.data;
        //赋值给对应的变量
        this.total = total;
        this.manageTableData = data;
        //如果当前页没有数据且排除第一页
        if(!data.length && currentPage !== 1){
          //页码减去1
          this.currentPage -= 1;
          //在调用自己
          this.getGoodsListByPage();
        }     
      })
      .catch(err => {
        console.log(err);       
      })
    },
    //每页显示的数据条数改变，触发这个函数
    handleSizeChange(val){
      //保存每页显示的条数
      this.pageSize = val;
      //调用分页函数
      this.getGoodsListByPage();
    },
    //当前页码改变，触发这个函数
    handleCurrentChange(val){
      //保存当前页面
      this.currentPage = val;
      //调用分页函数
      this.getGoodsListByPage();
    },

    //查询
    onSubmit(){
      this.getGoodsListByPage();
    },
    //修改数据
    handleEdit(id){
      //保存要修改的id
      this.editid = id;
      //发送请求
      this.axios.get(`http://172.16.9.46:999/goods/goodsedit?id=${id}`)
      .then(response=>{
        //接收数据
         let resultData = response.data[0];
         //回填进表单
         this.editForm.barcode = resultData.barcode;
         this.editForm.goodsname = resultData.goodsname;
         this.editForm.categories = resultData.categories;
         this.editForm.purchaseprice = resultData.purchaseprice;
         this.editForm.price = resultData.price;
         this.editForm.salesprice = resultData.salesprice;
         this.editForm.marketprice = resultData.marketprice;
         this.editForm.stocknum = resultData.stocknum;
         this.editForm.salenum = resultData.salenum;
         this.editForm.totalinven = resultData.totalinven;
         this.editForm.totalsales = resultData.totalsales;
         
         //弹出模态框
         this.flag = true;      
      })
      .catch(err=>{
        console.log(err);    
      })
    },
    //保存修改
    saveEdit(formName){
      this.$refs[formName].validate(valid=>{
        //如果所有验证都通过
        if(valid){
          //保存修改的数据和原来的id
          let params = {
            barcode: this.editForm.barcode,
            goodsname: this.editForm.goodsname,
            categories: this.editForm.categories,
            price: this.editForm.price,
            salesprice: this.editForm.salesprice,
            marketprice: this.editForm.marketprice,
            stocknum: this.editForm.stocknum,
            totalinven: this.editForm.totalinven,
            totalsales: this.editForm.totalsales,
            editid: this.editid
          };
          //发送请求，将修改的数据和原来的id一起发送给后端
          this.axios.post('http://172.16.9.46:999/goods/goodseditsave',qs.stringify(params))
          .then(response => {
            //接收后端传回来的数据
            let {error_code,reason} = response.data;
            //判断
            if(error_code === 0){
              //弹出成功的提示框
              this.$message({
                type:"success",
                message:reason
              })
              //刷新列表
              this.getGoodsListByPage();  
            }else{
              this.$message.error(reason)
            }
            //关闭模态框
            this.flag = false;           
          })
          .catch(err => {
            console.log(err);        
          })
        }
      })
    },
    //删除数据
    handleDelete(id){
      this.$confirm("你确定要删除吗","提示",{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        //发送ajax，把id发给后端
        this.axios.get(`http://172.16.9.46:999/goods/goodsdel?id=${id}`)
        .then(response => {
          //接收后端发送的错误码和提示信息
          let {error_code,reason} = response.data;
          //判断
          if(error_code === 0){
            //弹出删除成功的提示
            this.$message({
              type: "success",
              message: reason
            });
            // 输出列表
            this.getGoodsListByPage();
          } else {
            // 弹出删除失败的提示
            this.$message.error(reason);
          }                 
        })
        .catch(err => {
          console.log(err);        
        })
      })
      .catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

    },
    //当单选框的选中状态改变,就会触发这个函数,val就是选中的数据,它是一个数组
    handleSelectionChange(val){     
      //把被选中的账号，保存在一个变量中     
      this.selectedGoods = val;
    },
    //批量删除
    batchDelete(){
      //收集需要删除商品的id
      let delId = this.selectedGoods.map(v => v.id);
      //console.log(delId);
      //如果用户什么都不选
      if(!delId.length){
        this.$message.error("请选择以后再操作");
        return;
      }
      //确认框
      this.$confirm("你确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        //发送请求，将需要删除账号的id发给后端
        this.axios.get(`http://172.16.9.46:999/goods/batchdelete?id=${delId}`)
        .then(response => {
          //获取后端返回的数据
          let {error_code,reason} = response.data;
          //判断
          if(error_code === 0){
            //弹出成功的提示
            this.$message({
              type: "success",
              message: reason
            })
            //刷新列表
            this.getGoodsListByPage();
          }else{
            this.$message.error(reason)
          }            
        })
        .catch(err => {
          console.log(err);            
        })
      })
      //如果是取消，弹出取消删除提示
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        })
      })
    },
    //取消选中
    cancelSelect(){
      this.$refs.multipleTable.clearSelection();
    }   
  }
};
</script>
<style lang="less">
.goods-manage {
  .el-card {
    .el-card__header {
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      background: #f1f1f1;
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