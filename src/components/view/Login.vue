<template>
  <el-row class="LoginWrapper">
    <div class="blue-bg-silver"></div>
    <div class="LoginContainer">
        <h3>AnyChat统一视频见证平台</h3>
        <el-form :label-position="'top'" :model="LoginForm" :rules="rules" ref="LoginForm" label-width="100px" class="LoginForm">
        <el-form-item label="账号:" prop="username" class="labelDispay">
          <el-input v-model="LoginForm.username" class="inputBorder username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password" class="labelDispay">
          <el-input type="password" v-model="LoginForm.password" class="inputBorder password" placeholder="请输入密码"></el-input>
        </el-form-item>
          <el-form-item label="验证码:" class="labelDispay marginBottom">
              <el-input type="text" v-model="LoginForm.verifycode" class="inputBorder" placeholder="请输入验证码"></el-input>
              <img :src="verifycodeUrl" @click="verifycode" class="imgcode">
          </el-form-item>
        <el-form-item prop="type" class="marginBottom">
          <el-checkbox-group v-model="LoginForm.remember" >
            <el-checkbox name="remember" class="checkbox" v-model="checked" @click="checkBox">记住密码</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button class="LoginButton" type="primary" @click="SubmitForm('LoginForm')">登录</el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      LoginForm: {
        username: '',
        password: '',
        verifycode:'',
        remember: false,
      },
      verifycodeUrl:'/AnyChatFaceXAdmin/checkCode/getCheckcode',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      },
        checked:'',
    };
  },
  mounted(){
      if(localStorage.userInfo){
          var userInfo=JSON.parse(localStorage.userInfo);
          if(userInfo.remember){
              this.LoginForm.username=userInfo.username;
              this.LoginForm.password=userInfo.password;
              this.LoginForm.remember=userInfo.remember;
          }
      }

  },
  methods: {
    SubmitForm(formName) {
      var that=this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http(
            {
              method: 'POST',
              url: '/AnyChatFaceXAdmin/loginAdmin/loginVerify',
              body: {
                'accountid': that.LoginForm.username,
                'password': that.LoginForm.password,
                'verifycode':that.LoginForm.verifycode,
              },
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              emulateJSON: true
            }
          ).then(function(data) {
              console.log(typeof data)
                if(data.body.errorcode==1){
                    that.$message.error(data.body.msg);
                    that.verifycode()
                }else if(data.body.errorcode==0){
                    console.log('登陆成功');
                    sessionStorage.setItem("content",JSON.stringify(data.body.content));
                    this.$router.push({ path: '/Home/Overview' })
                }
          }, function(error) {
              that.$message.error('请求错误')
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    verifycode(){
        this.verifycodeUrl='/AnyChatFaceXAdmin/checkCode/getCheckcode?'+Math.random();
    },
    checkBox(){

        var that=this;
        that.LoginForm.remember=!that.LoginForm.remember;
        var data = {
            username:that.LoginForm.username,
            password:that.LoginForm.password,
            remember:that.LoginForm.remember,
        };
        localStorage.setItem("userInfo",JSON.stringify(data));

     }

  }
}
</script>

<style>
    .LoginWrapper .inputBorder input{
        border: 1px solid #e5e5e5;
        box-shadow: none;
        font-weight: normal;
        font-size: 12px;
        height: 37px;
        line-height: 26px;
        border-radius: 0px;
        color: #555;
        font-family: inherit;

    }

    .LoginWrapper .inputBorder.username input{
        background: url("../../assets/img/username.png") no-repeat;
        background-position: 95% 50%;
    }
    .LoginWrapper .inputBorder.password input{
        background: url("../../assets/img/password.png") no-repeat;
        background-position: 95% 50%;
    }
    .LoginWrapper .labelDispay label{
        display: block !important;
    }
    .LoginWrapper .labelDispay label:before{
        content: '' !important;
    }
    .LoginWrapper .imgcode{
        position: absolute;
        cursor: pointer;
        right: 0px;
        top: 0px;
        height: 37px;
        width: 106px;
        background: #FAFAFA;
    }
    .LoginWrapper .checkbox{
        text-align: left;
        width: 100%;
        margin: 2px 0px;
    }
    .LoginWrapper .marginBottom{
        margin-bottom: 0px;
    }
    .LoginWrapper .inputBorder input::-webkit-input-placeholder { /* WebKit browsers */
        color:    #CBCBCB;
    }
    .LoginWrapper .inputBorder input::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color:    #CBCBCB;
    }
    .LoginWrapper .inputBorder input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color:    #CBCBCB;
    }
    .LoginWrapper .inputBorder input:-ms-input-placeholder { /* Internet Explorer 10+ */
        color:    #CBCBCB;
    }
    .checkbox>span>span{
        border: 1px solid #DADADA;
        border-radius:0px;
    }
    .LoginButton{
        border-radius: 0px;
    }
    .el-notification{
        right: 50%;
        margin-right: -165px;
        font-family: 微软雅黑;
    }
</style>
<style scoped>
    *{
        font-family: 微软雅黑 !important;
    }
    body{
        overflow-x: hidden;
        font-family: 微软雅黑 !important;
    }
    .LoginWrapper {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .LoginContainer {
        background: #fff;
        -webkit-box-shadow: 0px 1px 10px #CFCFCF;
        box-shadow: 0px 1px 10px #CFCFCF;
        padding: 2% 5%;
        /* display: table-cell; */
        min-width: 100px;
        min-height: 100px;
        text-align: center;
        vertical-align: middle;
        position: absolute;
        left: 50%;
        top:50%;
        margin-left:-200px;
        margin-top:-200px;
    }
    .LoginContainer h3{
        margin: 0 0px 25px;
        padding: 0px;
        text-align: center;
        margin-bottom: 15px;
        font-size: 22px;
    }
    .LoginButton {
        width: 100%;
    }
    .blue-bg-silver {
        position: absolute;
        top: 0;
        z-index: -1;
        width: 100vw;
        height: 50vh;
        background-color: #004790;
        left: 0;
    }

</style>
