<template>
    <el-row class="service-Wrapper">
        <el-tabs type="border-card">
            <el-tab-pane label="申请人信息">
                <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名">
                                <el-input v-model="formLabelAlign.name" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" :span="12">
                                <el-input v-model="formLabelAlign.sex" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="民族" :span="12">
                                <el-input v-model="formLabelAlign.nation" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出生日期" :span="12">
                                <el-input v-model="formLabelAlign.birthday" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="身份证号码">
                        <el-input v-model="formLabelAlign.identity" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="证件有效期">
                        <el-input v-model="formLabelAlign.identitydate" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="formLabelAlign.phone" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="截图信息">
                <div class="apply-user">申请人信息 :
                    <span>{{applyUser}}</span>
                </div>
                <el-row :gutter="10">
                    <el-col :span="12" class="pic-box">
                        <img :src="frontPic">
                        <div>身份证正面</div>
                    </el-col>
                    <el-col :span="12" class="pic-box">
                        <img :src="backPic">
                        <div>身份证反面</div>
                    </el-col>

                    <el-col :span="12" :offset="6" class="snap-box">
                        <img :src="snapPicUrl">
                        <div>拍照图片</div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="服务信息">
                <div class="service-box">当前已服务 :
                    <span>{{serviceNum}}</span> 人, 其中视频见证通过 ：
                    <span>{{successNum}}</span> 人, 驳回 ：
                    <span>{{rejectNum}}</span> 人
                </div>
                <div class="queue-box">当前排队人数 :
                    <span>{{queningUserCount}}</span> 人</div>
                <div>已服务时长 :
                    <span>{{duration}}</span>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            labelPosition: 'right',
            formLabelAlign: {
                name: '',
                sex: '',
                nation: '',
                birthday: '',
                identity: '',
                identitydate: '',
                phone: ''
            },
            applyUser: '',
            frontPic: '../../assets/img/front.jpg',
            backPic: '../../assets/img/back.jpg',
            // snapPic: '../../assets/img/client.png',
            serviceNum: '',
            successNum: '',
            rejectNum: '',
            // queueNum: '',
            duration: "00:00",
            currentServiceTime: 0,//当前服务时长计算器;
            myServiceTimer: -1,//服务时长定时器
            serviceInfoTimer: -1,//心跳定时器;
            tradeNo:''
        };
    },
    computed:{
        snapPicUrl:function(){
            console.log(this.snapPicStr+"照片地址");
            return this.snapPicStr ? this.snapPicStr : "../../assets/img/client.png"
        }
    },
    created:function(){
        console.log(this.tradeData);
        this.showUserInfo(this.tradeData);
        this.getSeriveInfo();
    },
    props: {
        tradeData:{
            required:true
        },
        snapPicStr:{
            type:String,
            required:true
        },
        queningUserCount:{
            // required:true,
            default:0
        }
    },
    methods: {
        formatTime: function(val) {
            var s = parseInt(val);
            var m = 0, h = 0;
            if (s > 59) {
                m = parseInt(s / 60);
                s = parseInt(s % 60);
                if (m > 59) {
                    h = parseInt(m / 60);
                    m = parseInt(m % 60);
                }
            }
            var _s = s >= 10 ? s + '' : '0' + s;
            var _m = m >= 10 ? m + '' : '0' + m;
            var _h = h >= 10 ? h + '' : '0' + h;
            return _h + ":" + _m + ":" + _s;
        },
        getSeriveInfo: function() {
            // alert('进来了');
            var url = "/AnyChatFaceX/web/agent/getServiceInfo";
            var _this = this;
            // ajax请求不会改变作用域;
            this.$http.get(url).then(function(res) {
                console.log(res);
                if(res.body.errorcode==0){
                    var res = res.body.content;
                    this.serviceNum = res.totalServiceNum;
                    this.successNum = res.successServiceNum;
                    this.rejectNum = res.failServiceNum;
                    this.duration = this.formatTime(Math.ceil(res.serviceTime/1000));
                    this.currentServiceTime = Math.ceil(res.serviceTime/1000);
                    this.startTimer();
                }
            })
        },
        startTimer: function() {
            var _this = this;
            if (this.myServiceTimer) {
                clearInterval(this.myServiceTimer);
                this.myServiceTimer = 333;
            }
            this.myServiceTimer = setInterval(function(){_this.myTimer()},1000)
        },
        myTimer: function() {
            this.currentServiceTime++;
            this.duration = this.formatTime(this.currentServiceTime);
        },
        stopTimer: function() {
            clearInterval(this.myServiceTimer);
        },
        setServiceInfoTimer: function() {
            var _this = this;
            this.serviceInfoTimer = setInterval(function() {
                var urlService = "/AnyChatFaceX/web/agent/getServiceInfo";
                var urlHasLogin = "/AnyChatFaceX/loginAdmin/hasLogin";
                _this.$http.get(urlService).then(function(res) {

                }, function() {
                    // 失败处理
                })
                _this.$http.get(urlHasLogin).then(function(res) {

                }, function() {
                    // 失败处理;
                })

            }, 10 * 1000)
        },
        getCustomerInfo: function(res) {
            this.formLabelAlign.name = res.username;
            this.formLabelAlign.sex = res.usersex == 0 ? "男" : "女";
            this.formLabelAlign.nation = res.idCardNation;
            this.formLabelAlign.birthday = res.idcardbirth.substring(0, 11) || "";
            this.formLabelAlign.identity = res.idcardnum;
            this.formLabelAlign.identitydate = res.idCardInvaildTime.substring(0, 11) || "";
            this.formLabelAlign.phone = res.userphone;
            this.frontPic = res.useridcardu ?　res.useridcardu : "../../assets/img/front.jpg";
            this.backPic = res.useridcardn ?　res.useridcardn : "../../assets/img/back.jpg";
            this.applyUser = res.username;
        },
        showUserInfo: function(data) {
            // 流水指令代号,需要定义;先按照统一视频写;
            var _this = this;
            this.tradeNo = data;
            var ajaxUrlByBindAgent = "/AnyChatFaceX/web/client/trade/bindTradeAndAgent";
            var ajaxUrlByGetTrade = "/AnyChatFaceXAdmin/adminTrade/getTradeByNo";
            // 坐席绑定流水;
            this.$http({
                method: 'POST',
                url: ajaxUrlByBindAgent,
                headers: { 'Content-Type': 'application/json' },
                body: {
                    "tradeNo":this.tradeNo,
                    "status":0
                },
                emulateJSON: true
            }).then(function(res){
                console.log("success bind tradeno");
                if(res.body.errorcode==0){
                    this.$http.get(ajaxUrlByGetTrade+'?tradeno='+this.tradeNo).then(function(res){
                        var data = res.body.content;
                        _this.getCustomerInfo(data);
                        }).catch(function(e){
                            console.log(e)
                    })
                }
            })
        }
    }
}
</script>

<style scope>
.service-Wrapper{
    width: calc(100% - 5px);
    float: right;
    margin:5px 5px 0 5px;
    margin-top: 5px;
    font-size: 14px;
    color: #48576a;
    line-height: 2;
    height: 100%;
}
.service-Wrapper .el-tabs__content{
    height: calc(100% - 80px);
}
.service-Wrapper .el-tabs.el-tabs--border-card{
    height: 100%;
}
.pic-box{
    text-align: center;
}
.pic-box img{
    width: 100%
}
.service-box div{
    line-height: 2;
    font-size: 16px;
}
.apply-user > span,.service-box >span,.queue-box >span{
    color: #20a0ff;
}
.service-box >span:nth-last-child(1){
    color: red;
}
.snap-box img{
    width: 100%;
}
.snap-box{
    text-align: center;
    margin-top: 15px;
}
.el-tabs__content{
    overflow-y: scroll;
}
</style>
