<template>
  <div class="member-manage">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>会员管理</span>
      </div>
      <div class="text item">
        <!-- 会员管理表单 -->
        <el-form size="mini" style="text-align:left;" :inline="true" :model="memberManageForm" class="demo-form-inline" label-position="left">
          <!-- 搜索 -->
          <el-form-item prop="keyword" label="搜索：">
            <el-input type="text" v-model="memberManageForm.keyword" placeholder="请输入会员卡，会员名，电话，手机" autocomplete="off" style="width:230px;"></el-input>
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <!-- 会员管理表格 -->
        <el-table ref="multipleTable" :data="memManageTableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="cardsnum" label="会员卡卡号">
          </el-table-column>
          <el-table-column prop="membername" label="会员姓名">
          </el-table-column>
          <el-table-column prop="membergrade" label="会员等级">
          </el-table-column>
          <el-table-column prop="memberintegral" label="会员积分">
          </el-table-column>
          <el-table-column prop="discount" label="折扣">
          </el-table-column>
          <el-table-column prop="telphone" label="手机号">
          </el-table-column>
          <el-table-column prop="phone" label="座机号">
          </el-table-column>
          <el-table-column label="管理">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)">
                <i class="el-icon-edit"></i>编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
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
            <el-form-item label="会员姓名" prop="membername">
              <el-input style="width: 217px;" v-model="editForm.membername" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="用户组" prop="usergroup">
              <el-select v-model="editForm.usergroup" placeholder="请选择用户组">
                <el-option label="普通会员50%" value="普通会员50%"></el-option>
                <el-option label="铜牌会员60%" value="铜牌会员60%"></el-option>
                <el-option label="银牌会员70%" value="银牌会员70%"></el-option>
                <el-option label="金牌会员90%" value="金牌会员90%"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="会员积分" prop="memberintegral">
              <el-input style="width: 217px;" v-model="editForm.memberintegral" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="telphone">
              <el-input style="width: 217px;" v-model="editForm.telphone" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="座机号" prop="phone">
              <el-input style="width: 217px;" v-model="editForm.phone" autocomplete="off"></el-input>
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
  data(){
    return{
      memberManageForm:{
        keyword:""
      },
      memManageTableData:[],
      selectedMember:[],
      total:0,
      currentPage:1,
      pageSize:5,
      editid:"",
      editForm:{
        membername:"",
        usergroup:"",
        memberintegral:"",
        telphone:"",
        phone:""
      },
      flag:false,
      rules:{
        membername:[
          //非空验证
          { required: true, message: '请输入会员姓名', trigger: 'blur' },
          //长度验证
          { min: 2, max: 6, message: '账号长度在 2 - 6 位', trigger: 'blur' }
        ],
        usergroup:[
          //非空验证
          { required: true, message: '用户组不能为空', trigger: 'change' }
        ],
        memberintegral:[
          //非空验证
          { required: true, message: '积分不能为空', trigger: 'blur' }
        ],
        telphone:[
          //非空验证
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        phone:[
          //非空验证
          { required: true, message: '座机号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    //自动发送请求，获取所有用户账户数据 
    this.getMemberListByPage();
  },
  methods:{
    //请求所有会员数据的函数
    // getMemberList(){
    //   this.axios("http://172.16.9.46:999/member/memberlist")
    //    .then(response => {
    //      //把后端返回的会员数据 赋值给会员管理表格
    //      this.memManageTableData = response.data;       
    //    })
    //    .catch(err => {
    //      console.log(err);         
    //    })
    // },
    //按照分页显示数据的函数
    getMemberListByPage(){
      //收集当前页码和每页显示条数
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;
      let keyword = this.memberManageForm.keyword;
      //发送ajax请求,把数据发送给后台
      this.axios.get('http://172.16.9.46:999/member/memberlistbypage',{
        params:{
          pageSize,
          currentPage,
          keyword
        }
      })
      .then(response => {
        //console.log(response.data);
        //接收后端返回的数据
        let {total,data} = response.data;
        //赋值给对应的变量
        this.total = total;
        this.memManageTableData = data;
        //如果当前页没有数据且排除第一页
        if(!data.length && currentPage !== 1){
          //页码减去1
          this.currentPage -= 1;
          //在调用自己
          this.getMemberListByPage();
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
      this.getMemberListByPage();
    },
    //当前页码改变，触发这个函数
    handleCurrentChange(val){
      //保存当前页面
      this.currentPage = val;
      //调用分页函数
      this.getMemberListByPage();
    },

    onSubmit(){
      this.getMemberListByPage();
    },
    //修改数据
    handleEdit(id){
      //保存要修改的id
      this.editid = id;
      //发送请求
      this.axios.get(`http://172.16.9.46:999/member/memberedit?id=${id}`)
      .then(response=>{
        //接收数据
         let resultData = response.data[0];
         //回填进表单
         this.editForm.membername = resultData.membername;
         this.editForm.usergroup = resultData.membergrade+resultData.discount;
         this.editForm.memberintegral = resultData.memberintegral;
         this.editForm.telphone = resultData.telphone;
         this.editForm.phone = resultData.phone;
         
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
            membername: this.editForm.membername,
            usergroup: this.editForm.usergroup,
            memberintegral: this.editForm.memberintegral,
            telphone: this.editForm.telphone,
            phone: this.editForm.phone,
            editid: this.editid
          };
          //发送请求，将修改的数据和原来的id一起发送给后端
          this.axios.post('http://172.16.9.46:999/member/membereditsave',qs.stringify(params))
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
              this.getMemberListByPage();  
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
        this.axios.get(`http://172.16.9.46:999/member/memberdel?id=${id}`)
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
            this.getMemberListByPage();
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
      this.selectedMember = val;
    },
    //批量删除
    batchDelete(){
      //收集需要删除账号的id
      let delId = this.selectedMember.map(v => v.id);
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
        this.axios.get(`http://172.16.9.46:999/member/batchdelete?id=${delId}`)
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
            this.getMemberListByPage();
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
.member-manage {
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