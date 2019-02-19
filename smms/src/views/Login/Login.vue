<template>
    <div class="login">
        <!-- 登录表单容器 -->
        <div class="login-wrapper">
            <!-- 登录标题 -->
            <h2 class="title">
                <i class="el-icon-menu"></i>
                华联超市管理系统-登录
            </h2>
            <!-- 登录表单 -->
            <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="username">
                    <el-input type="text" v-model="loginForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="text" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPwd">
                    <el-input type="text" v-model="loginForm.checkPwd" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import qs from 'qs';
export default {
    data() {
        // 包含特殊字符的函数
        const checkSpecificKey = str => {
            var specialKey ="[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
            for (var i = 0; i < str.length; i++) {
                if (specialKey.indexOf(str.substr(i, 1)) != -1) {
                    return false;
                }
            }
            return true;
        };

        //验证密码的函数
        const pass = (rule, value, callback) => {
            if(value === ""){
                callback(new Error("请输入密码"));
            }else if(value.length < 3 || value.length >6){
                callback(new Error("密码长度为 3 - 6 位"));
            }else if(!checkSpecificKey(value)){
                callback(new Error("密码不能包含特殊字符"));
            }else{
                if(this.loginForm.checkPwd !== ""){
                    //当确认密码不为空，就调用确认密码的验证
                    this.$refs.loginForm.validateField("checkPwd");
                }
                //成功的回调
                callback();
            }
        }

        //确认密码的验证函数
        const checkPass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码")); 
            } else if (value !== this.loginForm.password) {
                // 如果确认密码 和 密码不同
                callback(new Error("两次输入密码不一致"));
            }
            callback();
        };     

        return {
            //登录表单的数据
            loginForm: {
                username: '',
                password: '',
                checkPwd: ''
            },
            //验证规则
            rules: {
                //验证用户名
                username:[
                    //非空验证
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    //长度验证
                    { min: 3, max: 6, message: '账号长度在 3 - 6 位', trigger: 'blur' }
                ],
                //验证密码
                password:[
                    //非空验证
                    { required: true, validator:pass, trigger: 'blur' },
                    ],
                //验证确认密码
                checkPwd:[
                    //非空验证
                    { required: true, validator:checkPass, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        //点击登录按钮 触发这个函数
        submitForm(formName) {
            //获取表单组件 调用验证方法
            this.$refs[formName].validate((valid) => {
                //如果所有验证通过，valid就是true
                if (valid) {
                    //收集帐号和密码
                    const params = {
                        username:this.loginForm.username,
                        password:this.loginForm.password
                    }
                    //发送请求 把参数发给后端验证账号和密码是否存在
                    this.axios.post('http://127.0.0.1:999/login/checklogin',qs.stringify(params))
                    .then(response => {
                        //接收后端传过来的数据
                        let {error_code,reason,token,username} = response.data;
                        
                        //判断
                        if(error_code === 0){
                            //把token存在浏览器的存储中
                            window.localStorage.setItem('token',token);
                            //把username也存在浏览器的存储中
                            window.localStorage.setItem('username',username);
                            //弹出成功的提示框
                            this.$message({
                                type:"success",
                                message:reason
                            })
                            //跳转到后台首页
                            this.$router.push('/')
                        } else{
                            //弹出失败的提示框
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
        },
        //点击重置按钮 触发这个函数
        resetForm(formName) {
            //获取表单组件 调用重置方法
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<style lang="less">  
    .login{
        width: 100%;
        height: 100%;
        background: url(./login.jpg) no-repeat;
        background-size: 100% 100%;                   
        .login-wrapper{
            width: 500px;
            height: 350px;
            border-radius: 8px;
            background-color: rgba(69, 69, 69, .8);
            color: #fff;
            // 让盒子垂直水平都居中
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            padding: 26px 50px 10px 10px;
            .title{
                padding-bottom: 10px;
                padding-left: 56px;
            }
            .el-form {
                .el-form-item {
                    .el-form-item__label {
                        color: #fff;
                    }
                }
            }
        }
    }
</style>

