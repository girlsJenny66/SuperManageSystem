<template>
    <div class="password-modify">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>修改账号密码</span>
            </div>
            <div class="text item">
                <!-- 修改密码表单 -->
                <el-form size="mini" :model="passwordEditForm" status-icon :rules="rules" ref="passwordEditForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="原密码" prop="password">
                        <el-input type="text" v-model="passwordEditForm.password" autocomplete="off" ></el-input>
                    </el-form-item>

                    <el-form-item label="新密码" prop="newPwd">
                        <el-input type="text" v-model="passwordEditForm.newPwd" autocomplete="off" ></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码" prop="checkPwd">
                        <el-input type="text" v-model="passwordEditForm.checkPwd" autocomplete="off"></el-input>
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
        if (this.passwordEditForm.checkPwd !== "") {
          //当确认密码不为空，就调用确认密码的验证
          this.$refs.passwordEditForm.validateField("checkPwd");
        }
        //成功的回调
        callback();
      }
    };

    //确认密码的验证函数
    const checkPass = (rule, value, callback) => {
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
        password: "",
        newPwd: "",
        checkPwd: ""
      },
      //验证规则
      rules: {
        //验证密码
        password: [
          //非空验证
          { required: true, validator: pass, trigger: "blur" }
        ],
        //验证密码
        newPwd: [
          //非空验证
          { required: true, validator: pass, trigger: "blur" }
        ],
        //验证确认密码
        checkPwd: [
          //非空验证
          { required: true, validator: checkPass, trigger: "blur" }
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
          alert("恭喜你,密码修改成功！");
          //后续吧收集的账号和密码 一起发送给后台 验证账号和密码的正确性
          //收集账号和密码
          const params = {
            username: this.passwordEditForm.username,
            password: this.passwordEditForm.newPwd,
          };
          //发送请求 把参数发给后端
          //console.log(params);

          //跳转到账号管理页面
          this.$router.push("/accountmanage")
        } else {
          //否则就是false
          alert("sorry,前端验证失败！");
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