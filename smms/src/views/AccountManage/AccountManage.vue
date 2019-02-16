<template>
  <div class="account-manage">
    <!-- 面板组件 -->
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>账号管理</span>
      </div>
      <div class="text item">
        <!-- 账号管理表格 -->
        <el-table
          ref="multipleTable"
          :data="accountData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          >
          </el-table-column>

          <el-table-column
            prop="username"
            label="用户名"
          >
          </el-table-column>

          <el-table-column
            prop="usergroup"
            label="用户组"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column label="创建日期">
            <template slot-scope="scope">{{ scope.row.ctime | filterCtime}}</template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row.id)"
              ><i class="el-icon-edit"></i> 编辑 </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)"
              ><i class="el-icon-delete"></i> 删除 </el-button>
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
        <el-dialog title="修改账号" :visible.sync="flag" width="400px">
          <!-- 回填表单 -->
          <el-form :model="editForm" label-width="60px" :rules="rules" ref="editForm">
            <el-form-item label="账号" prop="username">
              <el-input style="width: 217px;" v-model="editForm.username" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="用户组" prop="usergroup">
              <el-select v-model="editForm.usergroup" placeholder="请选择用户组">
                <el-option label="普通用户" value="普通用户"></el-option>
                <el-option label="高级管理员" value="高级管理员"></el-option>
              </el-select>
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
//引入moment
import moment from 'moment';
//引入qs
import qs from 'qs';

export default {
  data() {
    return {
      accountData: [],
      editid: "",
      flag:false,
      editForm:{
        username:"",
        usergroup:""
      },
      selectedAccount:[],
      total:0,
      currentPage:1,
      pageSize:5,
      //模态框表单验证规则
      rules:{
        //验证账号
        username:[
          //非空验证
          { required: true, message: '修改的账号不能为空', trigger: 'blur' },
          //长度验证
          { min: 3, max: 6, message: '账号长度在 3 - 6 位', trigger: 'blur' }
        ],
        //选择用户组验证
        usergroup: [
          { required: true, message: '请选择用户组', trigger: 'change' }
        ]
      }        
    };
  },
  created(){
    //自动发送请求，获取所有用户账户数据
    //console.log("自动发送请求");    
    this.getAccountListByPage();
  },
  methods: {
    //请求所有账号数据的函数
    // getAccountList(){
    //   this.axios("http://127.0.0.1:999/account/accountlist")
    //    .then(response => {
    //      //把后端返回的账号数据 赋值给用户账号数据accountData
    //      this.accountData = response.data;       
    //    })
    //    .catch(err => {
    //      console.log(err);         
    //    })
    // },

    //按照分页显示数据的函数
    getAccountListByPage(){
      //收集当前页码和每页显示条数
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      //发送ajax请求,把数据发送给后台
      this.axios.get('http://127.0.0.1:999/account/accountlistbypage',{
        params:{
          pageSize,
          currentPage
        }
      })
      .then(response => {
        //console.log(response.data);
        //接收后端返回的数据
        let {total,data} = response.data;
        //赋值给对应的变量
        this.total = total;
        this.accountData = data;
        //如果当前页没有数据且排除第一页
        if(!data.length && currentPage !== 1){
          //页码减去1
          this.currentPage -= 1;
          //在调用自己
          this.getAccountListByPage();
        }     
      })
      .catch(err => {
        console.log(err);       
      })
    },
    //每页显示的数据条数改变，触发这个函数
    handleSizeChange(val){
      //console.log(val);
      //保存每页显示的条数
      this.pageSize = val;
      //调用分页函数
      this.getAccountListByPage();
    },
    //当前页码改变，触发这个函数
    handleCurrentChange(val){
      //console.log(val);
      //保存当前页面
      this.currentPage = val;
      //调用分页函数
      this.getAccountListByPage();
    },

    //当单选框的选中状态改变,就会触发这个函数,val就是选中的数据,它是一个数组
    handleSelectionChange(val) {
      //console.log(val); 
      //把被选中的账号，保存在一个变量中     
      this.selectedAccount = val;
    },
    //批量删除
    batchDelete(){
      //收集需要删除账号的id
      let delId = this.selectedAccount.map(v => v.id);
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
          this.axios.get(`http://127.0.0.1:999/account/batchdelete?id=${delId}`)
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
              this.getAccountListByPage();
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
    },     
    //删除账号
    handleDelete(id){
      this.$confirm("你确定要删除吗","提示",{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        //发送ajax，把id发给后端
        this.axios.get(`http://127.0.0.1:999/account/accountdel?id=${id}`)
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
            this.getAccountListByPage();
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
    //修改
    handleEdit(id){
      //保存要修改的id
      this.editid = id;
      
      //发送请求，将新数据和原来的id发给后端
      this.axios.get(`http://127.0.0.1:999/account/accountedit?id=${id}`)
       .then(response => {         
         //接收数据
         let resultData = response.data[0];
         //回填进表单
         this.editForm.username = resultData.username;
         this.editForm.usergroup = resultData.usergroup;
         
         //弹出模态框
         this.flag = true;
       })
       .catch(err => {
         console.log(err);        
       })
    },
    //保存修改
    saveEdit(formName){
      //获取表单组件 调用验证方法
      this.$refs[formName].validate(valid => {
        //如果所有验证通过，valid就是true
        if (valid) {
          //保存修改的数据和原来的id
          let params = {
            username: this.editForm.username,
            usergroup: this.editForm.usergroup,
            editid: this.editid
          };
          
          //发送请求，将修改的数据和原来的id一起发送给后端
          this.axios.post('http://127.0.0.1:999/account/accounteditsave',qs.stringify(params))
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
              this.getAccountListByPage();  
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
    }  
  },
  //过滤器
  filters:{
    // 过滤时间的函数
    filterCtime(ctime) {
      return moment(ctime).format("YYYY/MM/DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less">
.account-manage {
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