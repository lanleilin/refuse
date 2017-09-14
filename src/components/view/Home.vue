<template>
    <div class="anychat-hall" v-loading.body="loading" element-loading-text="正在加载坐席信息">
        <anychat-header :queueChild="queuesParent" :userIdChild="userId" :statusChild="status" :strStatusChild="strStatus" @child-status="statusFun"></anychat-header>

        <router-view
            :busyAgentCount="busyAgentCount"
            :queningUserCount="queningUserCount"
            :idleAgentCount="idleAgentCount"
            @video-reject="videoReject"
            @leave-room="leaveRoomFun"></router-view>

<!-- <home-box :busyAgentCount="busyAgentCount" :queningUserCount="queningUserCount" :idleAgentCount="idleAgentCount"></home-box> -->

    </div>
    </template>

    <script>
import AnychatHeader from '@/components/public/AnychatHeader'

export default {
    data() {
        return {
            loading: true,
            initOpt: {
                isCluster: 1,
                strUserId: 'WANGHT',
                password: "",
                serverIp: "120.76.248.33",
                serverPort: 8906,
                appId: "7EE5FF97-77DB-AF41-80B8-212E97A68C92",
                onLogin: this.onLogin,
                onDisConnect: this.onDisConnect,
                queueOpt: {
                    role: 2, //0--客户， 2--坐席
                    priority: 15, //优先级，值为1-15，值越大，优先级越高
                    isAutoMode: 1, //路由模式，0为手动路由，1为自动路由（默认）
                    attribute: "", //业务属性，可以根据业务需求传入JSON对象
                    //营业厅状态变化通知事件(客户/坐席进入或离开营业厅)
                    onAreaChanged: this.onAreaChanged,
                    //队列状态变化通知事件(客户进入或离开队列)
                    onQueueChanged: this.onQueueChanged,
                    //用户出队列开始服务通知事件
                    onServiceNotify: this.onServiceNotify
                },
                bufferOpt: {
                    onReceiveBuffer: this.onReceiveBuffer
                }
            },
            agentServiceInfo: {
                serviceBeginTime: 0,
                serviceTotalTime: 0,
                serviceUserCount: 0
            },
            userId: '', //用户名
            areaId: '',  //营业厅id
            businessnallname: '',//营业厅名称
            queuesParent: [],  //队列信息
            strStatus: [
                { id: 1, label: "签入" }
            ], //切换状态
            status: '状态：未签入', //状态
            agentCount: '',  //总坐席数
            idleAgentCount: '', //示闲人数
            queningUserCount: '',//排队人数
            busyAgentCount: '',//示忙人数
        };
    },
    computed: {

    },
    created: function() {
        if (sessionStorage.content) {
            this.initOpt.strUserId = JSON.parse(sessionStorage.content)[1].accountid;
            if (instance == null) instance = AnyChatWebSDK.sdkInit(this.initOpt);
            AnyChat.instance = instance
            console.log("初始化anychat");
        }

    },
    methods: {
        strStatusFun: function(event) {
            var mapping = {
                "-1": "初始化",
                "0": "未签入",
                "1": "空闲",
                "2": "通话中",
                "3": "暂停服务",
                "10": "离线",
            }
            this.status = "状态：" + mapping[event]
            if (event == 1) {
                this.strStatus = [
                    { id: 2, label: "暂停服务" },
                    { id: 3, label: "签出" }
                ]
            } else if (event == 3) {
                this.strStatus = [
                    { id: 4, label: "继续服务" },
                    { id: 3, label: "签出" }
                ]
            } else if (event == 0) {
                this.strStatus = [
                    { id: 1, label: "签入" }
                ]
            }else if (event == 2) {
                this.strStatus = []
            }
        },
        statusFun: function(event) {
            console.info("头部改变状态：" + event)
            if (event == '签入') {
                //改变坐席状态
                instance.agentServiceCtrl({
                    ctrlCode: 0,
                    done: this.onServiceCtrlDone,
                    onAgentStatusChanged: this.onAgentStatusChanged,
                    onAgentServiceInfoNotify: this.onAgentServiceInfoNotify
                });
                this.$http({
                    method: 'POST',
                    url: '/AnyChatFaceX/web/client/login/agentSigned',
                    body: JSON.stringify({
                        "businesshallid": this.areaId,
                        "businessnallname": this.businessnallname,
                        "type": 2
                    }),
                    emulateJSON: true
                }
                ).then(function(data) {

                    if (data.body.errorcode == 1) {

                    } else if (data.body.errorcode == 0) {

                    }
                }, function(error) {

                })
            } else if (event == '暂停服务') {
                instance.agentServiceCtrl({
                    ctrlCode: 2,
                });
            } else if (event == '签出') {
                instance.agentServiceCtrl({
                    ctrlCode: 1,
                });
            } else if (event == '继续服务') {
                instance.agentServiceCtrl({
                    ctrlCode: 0,
                });
            }
        },
        onLogin: function(data) {
            console.log("登录成功");
            this.userId = AnyChat.userId = data.userId;
            //获取营业厅列表
            instance.getAreas({
                done: this.onSyncAreasDone
            });
            instance.setSDKOption({enableWebService: 1});
        },
        onDisConnect: function(result) {
            if(result.code==0){
                console.log("主动退出");
            }else {
                console.log("登录出错");
                this.loading = false;
                this.$message.error(result.msg);
                instance.logout();
                instance = null;
                var that = this;
                setTimeout(that.$router.push({ path: '/Login' }), 2000)
            }

        },
        onSyncAreasDone: function(result, data) {
            //进入营业厅
            if (result.code == 0) {
                this.areaId = data.areas[0].areaId;
                console.log("当前坐席营业厅id" + this.areaId);

                instance.enterArea({
                    areaId: this.areaId,
                    done: this.onEnterAreaDone
                });
            }

        },
        onEnterAreaDone: function(result, data) {
            if (result.code == 0) {
                Object.assign(AnyChat, {
                    areaData: data
                })
                var obj = data.queues;
                console.info("当前营业厅下的队列及排队人数");
                for (var i = 0; i < obj.length; i++) {
                    var num = this.getQueueLength(obj[i].id);
                    obj[i].num = num;
                    obj[i].disabled = true;
                    obj[i].name = obj[i].name + "(" + num + ")";
                    console.info(obj[i]);
                }
                this.loading = false;
                this.queuesParent = obj;
                this.businessnallname = data.areaName;//营业厅名称
                console.log('进入的营业厅名称：' + data.areaName)
                this.agentCount = data.agentCount;
                this.idleAgentCount = data.idleAgentCount;
                this.queningUserCount = data.queningUserCount;
                this.busyAgentCount = parseInt(data.agentCount) - parseInt(data.idleAgentCount);
            }
        },
        onServiceCtrlDone: function(result) {
        },
        onAgentStatusChanged: function(event) {
            //坐席状态变化通知回调
            console.log("座席状态改变");
            this.strStatusFun(event.status);
            if (event.status == 1) {

            }
            console.info("坐席变化，示闲示忙人数变化");
            var agentcount = instance.getAgentCount({areaId:this.areaId});
            console.info(agentcount.allAgentCount);
            console.info(agentcount.idleAgentCount);
            this.agentCount = agentcount.allAgentCount;  //营业厅内的坐席总数
            this.idleAgentCount = agentcount.idleAgentCount; //营业厅内的空闲坐席数
            this.busyAgentCount = parseInt(agentcount.allAgentCount) - parseInt(agentcount.idleAgentCount);
        },
        onAgentServiceInfoNotify: function(data) {
            // 坐席服务信息变化通知回调  主动查询当前示忙示闲人数
            this.agentServiceInfo.serviceBeginTime = data.serviceBeginTime;
            this.agentServiceInfo.serviceTotalTime = data.serviceTotalTime;
            this.agentServiceInfo.serviceUserCount = data.serviceUserCount;

        },
        onAreaChanged: function(data) {
            //营业厅状态变化通知事件

        },
        onQueueChanged: function(data) {
            //队列状态发生改变  主动查询排队人数和每个队列排队人数
            this.queningUserCount = instance.getAreaQueueUserCount({
                areaId: this.areaId
            });

        },
        onServiceCtrlDone: function(result) {
        },
        onAgentStatusChanged: function(event) {
            //坐席状态变化通知回调
            console.log("座席状态改变");
            this.strStatusFun(event.status);
        },
        onAgentServiceInfoNotify: function(data) {
            // 坐席服务信息变化通知回调
            this.agentServiceInfo.serviceBeginTime = data.serviceBeginTime
            this.agentServiceInfo.serviceTotalTime = data.serviceTotalTime
            this.agentServiceInfo.serviceUserCount = data.serviceUserCount
        },
        onAreaChanged: function(data) {
            //营业厅状态变化通知事件  主动查询当前示忙示闲人数
        },
        onQueueChanged: function(data) {
            //队列状态发生改变  主动查询排队人数和每个队列排队人数
            this.queningUserCount = instance.getAreaQueueUserCount({
                areaId: this.areaId
            });

            this.queuesParent.forEach(function(item, index) {
                if (item.id == data.queueId) {
                    item.name = (item.name).replace(/\(.*?\)/g, '') + "(" + data.userCount + ")";
                }
            });

        },
        onServiceNotify: function() { },
        getQueueLength: function(event) {
            //查询队列人数
            return instance.getQueueLength({
                queueId: event
            });
        },
        onReceiveBuffer: function(data) {
            console.log('透明通道回调：' + data.msg);
            var jsonObj = JSON.parse(decodeURI(data.msg));
            if (jsonObj.cmd == "CMD_Trade_No") {
                AnyChat.clientData = jsonObj.data
                AnyChat.clientData.userId = data.userId
            }
        },
        videoReject:function (msg) {
            console.info("拒绝"+msg);
            instance.agentServiceCtrl({
                ctrlCode: 1,
            });
            instance.agentServiceCtrl({
                ctrlCode: 0,
            });
        },
        leaveRoomFun:function (msg) {
            console.info("离开房间"+msg);
            instance.agentServiceCtrl({
                ctrlCode: 1,
            });
            instance.agentServiceCtrl({
                ctrlCode: 0,
            });

        }
    },
    components: {
        AnychatHeader
    }
}

</script>

<style>

    body{
        overflow-x: hidden;
        font-family: 微软雅黑 !important;
        background: #eee;
    }
    .el-loading-mask{
        background-color: rgba(0, 0, 0, 0.5);
    }
    #AnyChatSDKPluginDiv{
        height: 0px;
    }
</style>
<style scoped>
    *{
        font-family: 微软雅黑 !important;
    }

    ul, li, ol {
        list-style: none;
    }
    .anychat-hall{
        background: #eee;
        height: 100%;
    }

</style>


