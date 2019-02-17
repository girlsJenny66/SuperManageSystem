<template>
  <div class="member-add">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>添加编辑账号</span>
      </div>
      <div class="text item">
        <!-- 添加会员表单 -->
        <el-form
          size="mini"
          :model="memberAddForm"
          status-icon
          :rules="rules"
          ref="memberAddForm"
          label-width="100px"
          class="demo-ruleForm">
          <el-form-item
            label="真实名字"
            prop="membername"
          >
            <el-input v-model="memberAddForm.membername"></el-input>
          </el-form-item>

          <el-form-item
            label="会员卡卡号"
            prop="cardsnum"
          >
            <el-input v-model="memberAddForm.cardsnum"></el-input>
          </el-form-item>

          <el-form-item
            label="用户组"
            prop="usergroup"
          >
            <el-select
              v-model="memberAddForm.usergroup"
              placeholder="-----选择分类-----"
            >
              <el-option
                label="普通会员50%"
                value="普通会员50%"
              ></el-option>
              <el-option
                label="铜牌会员60%"
                value="铜牌会员60%"
              ></el-option>
              <el-option
                label="银牌会员70%"
                value="银牌会员70%"
              ></el-option>
              <el-option
                label="金牌会员90%"
                value="金牌会员90%"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="身份证号">
            <el-input v-model="memberAddForm.idnum"></el-input>
          </el-form-item>

          <el-form-item label="用户状态">
            <el-radio-group v-model="memberAddForm.status">
              <el-radio label="启用"></el-radio>
              <el-radio label="禁用"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="会员积分"
            prop="memberintegral"
          >
            <el-input v-model="memberAddForm.memberintegral"></el-input>

          </el-form-item>
          <el-form-item label="手机号码" prop="telphone">
            <el-input v-model="memberAddForm.telphone"></el-input>
          </el-form-item>

          <el-form-item label="座机号码" prop="phone">
            <el-input v-model="memberAddForm.phone"></el-input>
          </el-form-item>

          <el-form-item label="邮箱地址">
            <el-input v-model="memberAddForm.email"></el-input>
          </el-form-item>

          <el-form-item
            label="地区选择"
            style="width:400px;"
          >
            <el-select
              v-model="memberAddForm.selectProvince"            
              placeholder="---请选择省份---"
              style="width:140px;"
            >
              <el-option
                v-for="item in province"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-select
              v-model="memberAddForm.selectCity"
              collapse-tags
              style="margin-left: 20px;width:140px;"
              placeholder="---请选择城市---"
            >
              <el-option
                v-for="item in city"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="详细地址">
            <el-input v-model="memberAddForm.detailAddress"></el-input>
          </el-form-item>

          <el-form-item label="邮政编码">
            <el-input v-model="memberAddForm.postalcode"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="onAdd('memberAddForm')"
            >添加</el-button>
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
        memberAddForm:{
          status:"禁用"
        },
        province: [
            {
                value: '选项1',
                label: '四川'
            }, 
            {
                value: '选项2',
                label: '湖南'
            },
            {
                value: '选项3',
                label: '湖北'
            }, 
            {
                value: '选项4',
                label: '河南'
            }, 
            {
                value: '选项5',
                label: '河北'
            }
        ],
        city: [
            {
                value: '选项1',
                label: '成都'
            }, 
            {
                value: '选项2',
                label: '眉山'
            },
            {
                value: '选项3',
                label: '资阳'
            }, 
            {
                value: '选项4',
                label: '绵阳'
            }, 
            {
                value: '选项5',
                label: '南充'
            }
        ],
        rules:{
          membername:[
            //非空验证
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
            //长度验证
            { min: 2, max: 6, message: '账号长度在 2 - 6 位', trigger: 'blur' }
          ],
          cardsnum:[
            //非空验证
            { required: true, message: '请输入卡号', trigger: 'blur' }
          ],
          usergroup:[
            //非空验证
            { required: true, message: '请输入用户组', trigger: 'change' }
          ],
          memberintegral:[
            //非空验证
            { required: true, message: '请输入积分', trigger: 'blur' }
          ],
          telphone:[
            //非空验证
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          phone:[
            //非空验证
            { required: true, message: '请输入座机号', trigger: 'blur' }
          ]
        }
      }
  },
  methods:{
    onAdd(formName){
      //获取表单组件 调用验证方法
      this.$refs[formName].validate((valid) => {
          //如果所有验证通过，valid就是true
          if (valid) {
              //收集必写的数据
              const params = {
                  membername:this.memberAddForm.membername,
                  cardsnum:this.memberAddForm.cardsnum,
                  usergroup:this.memberAddForm.usergroup,
                  memberintegral:this.memberAddForm.memberintegral,
                  telphone:this.memberAddForm.telphone,
                  phone:this.memberAddForm.phone,
              }
              //发送请求 把参数发给后端
              this.axios.post('http://127.0.0.1:999/member/memberadd',qs.stringify(params))
               .then(response => {
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
                  this.$router.push("/membermanage")
                }else{
                  //弹出失败的提示
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
}
</script>

<style lang="less">
.member-add {
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

