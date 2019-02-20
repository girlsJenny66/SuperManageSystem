<template>
    <div class="password-modify">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>修改账号密码</span>
            </div>
            <div class="text item">
                <!-- 修改密码表单 -->
                <el-form size="mini" :model="passwordEditForm" status-icon :rules="rules" ref="passwordEditForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="原密码" prop="oldPwd">
                        <el-input type="text" v-model="passwordEditForm.oldPwd" autocomplete="off" ></el-input>
                    </el-form-item>

                    <el-form-item label="新密码" prop="newPwd">
                        <el-input type="text" v-model="passwordEditForm.newPwd" autocomplete="off" ></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码" prop="checkNewPwd">
                        <el-input type="text" v-model="passwordEditForm.checkNewPwd" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('passwordEditForm')">修改</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import qs from 'qs';
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

    //验证原密码的函数
    const checkOldPass = (rule,value,callback) => {
      //获取当前登录的账户
      let username = window.localStorage.getItem('username');
      //发送请求给后端
      this.axios.get(`http://172.16.9.46:999/account/checkoldpwd?username=${username}&oldPwd=${value}`)
      .then(response => {
        let {error_code,reason} = response.data;
        //判断
        if(error_code !== 0){
          callback(new Error(reason))
        } else{
          callback()
        }    
      })
      .catch(err => {
        console.log(err);       
      })
    }

    //验证新密码的函数
    const newPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 3 || value.length > 6) {
        callback(new Error("密码长度为 3 - 6 位"));
      } else if (!checkSpecificKey(value)) {
        callback(new Error("密码不能包含特殊字符"));
      } else {
        if (this.passwordEditForm.checkNewPass !== "") {
          //当确认密码不为空，就调用确认密码的验证
          this.$refs.passwordEditForm.validateField("checkNewPass");
        }
        //成功的回调
        callback();
      }
    };

    //确认新密码的验证函数
    const checkNewPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordEditForm.newPwd) {
        // 如果确认密码 和 密码不同
        callback(new Error("两次输入密码不一致"));
      }
      callback();
    };

    return {
      passwordEditForm: {
        oldPwd: "",
        newPwd: "",
        checkNewPwd: ""
      },
      //验证规则
      rules: {
        //验证原密码
        oldPwd: [
          //非空验证
          { required: true, validator: checkOldPass, trigger: "blur" }
        ],
        //验证密码
        newPwd: [
          //非空验证
          { required: true, validator: newPass, trigger: "blur" }
        ],
        //验证确认密码
        checkNewPwd: [
          //非空验证
          { required: true, validator: checkNewPass, trigger: "blur" }
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
            username: window.localStorage.getItem('username'),
            oldPwd: this.passwordEditForm.oldPwd,
            newPwd: this.passwordEditForm.newPwd
          };
          //发送请求 把参数发给后端
          this.axios.post('http://172.16.9.46:999/account/saveeditnewpwd',qs.stringify(params))
          .then(response => {
            let {error_code,reason} = response.data;
            if(error_code === 0){
              //清除token
              window.localStorage.removeItem('token');
              //弹出修改成功的提示
              this.$message({
                type:"success",
                message:reason
              });
              //跳转到login页面
              setTimeout(()=>{
                this.$router.push('/login')
              },1000)
            }else{
              this.$message.error(reason)
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
}
</script>

<style lang="less">
    .password-modify{
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