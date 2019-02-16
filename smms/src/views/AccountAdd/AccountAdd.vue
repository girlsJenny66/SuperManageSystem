<template>
  <div class="account-add">
    <!-- 面板组件 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加管理员账号</span>
      </div>
      <div class="text item">
        <!-- 添加账号表单 -->
        <el-form size="mini" :model="accoutAddForm" status-icon :rules="rules" ref="accoutAddForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="accoutAddForm.username" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input type="text" v-model="accoutAddForm.password" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPwd">
            <el-input type="text" v-model="accoutAddForm.checkPwd" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="选择用户组" prop="userGroup">
            <el-select v-model="accoutAddForm.userGroup" placeholder="选择用户组">
              <el-option label="普通用户" value="普通用户"></el-option>
              <el-option label="高级管理员" value="高级管理员"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('accoutAddForm')">添加</el-button>
            <el-button @click="resetForm('accoutAddForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入qs库
import qs from "qs";

export default {
  data() {
    // 包含特殊字符的函数
    const checkSpecificKey = str => {
      var specialKey =
        "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) != -1) {
          return false;
        }
      }
      return true;
    };

    //验证密码的函数
    const pass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 3 || value.length > 6) {
        callback(new Error("密码长度为 3 - 6 位"));
      } else if (!checkSpecificKey(value)) {
        callback(new Error("密码不能包含特殊字符"));
      } else {
        if (this.accoutAddForm.checkPwd !== "") {
          //当确认密码不为空，就调用确认密码的验证
          this.$refs.accoutAddForm.validateField("checkPwd");
        }
        //成功的回调
        callback();
      }
    };

    //确认密码的验证函数
    const checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.accoutAddForm.password) {
        // 如果确认密码 和 密码不同
        callback(new Error("两次输入密码不一致"));
      }
      callback();
    };

    return {
      accoutAddForm: {
        username: "",
        password: "",
        checkPwd: "",
        userGroup:""
      },
      //验证规则
      rules: {
        //验证用户名
        username: [
          //非空验证
          { required: true, message: "请输入账号", trigger: "blur" },
          //长度验证
          { min: 3, max: 6, message: "账号长度在 3 - 6 位", trigger: "blur" }
        ],
        //验证密码
        password: [
          //非空验证
          { required: true, validator: pass, trigger: "blur" }
        ],
        //验证确认密码
        checkPwd: [
          //非空验证
          { required: true, validator: checkPass, trigger: "blur" }
        ],
        //选择用户组验证
        userGroup: [
          { required: true, message: '请选择用户组', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    //点击登录按钮 触发这个函数
    submitForm(formName) {
      //获取表单组件 调用验证方法
      this.$refs[formName].validate(valid => {
        //如果所有验证通过，valid就是true
        if (valid) {
          //后续吧收集的账号和密码 一起发送给后台 验证账号和密码的正确性
          //收集账号和密码
          const params = {
            username: this.accoutAddForm.username,
            password: this.accoutAddForm.password,
            usergroup:this.accoutAddForm.userGroup
          };

          //使用axios发送数据给后端
          this.axios.post('http://127.0.0.1:999/account/accountadd',qs.stringify(params))
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
               this.$router.push("/accountmanage")
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
    },
    //点击重置按钮 触发这个函数
    resetForm(formName) {
      //获取表单组件 调用重置方法
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less">
.account-add {
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