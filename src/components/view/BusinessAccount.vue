<template>
    <div class="MainWrapper" :style="styleObject">
        <el-col class="height100" :span="11">
            <div class="videoArea">
                <anychat-videoshow
                    @videorecord-finish="videorecordFinish"
                    @snapShot-finish="snapShotFinish"
                    :passSuccess="passSuccessParent"
                    :visibility="visibilityParent"></anychat-videoshow>
            </div>
            <div class="questionArea">
                <business-question
                    :question-list="question"
                    :target-user-id="targetId"></business-question>
            </div>
            <div class="btnArea">
                <div class="videoPlay">
                    <div class="item"></div>
                    <el-button id="back" type="primary" class='result-customer-btn item' @click="filePathUrlFun">回放</el-button>
                </div>
                <div class="acceptRefuse">
                    <accept-refuse
                        :snapPicParentFinish="snapPicParentLocal"
                        :filePathUrlFinish="filePathUrlLocal"
                        @visibility-hidden="visibilityFun"
                        @pass-success="passSuccessFun"
                        @after-close="afterCloseFun"></accept-refuse>
                </div>

            </div>
        </el-col>
        <el-col class="height100" :span="13">
            <div class="messageArea">
                <service-info
                    :snapPicStr="snapPicParent"
                    :tradeData="tradeDataParent"></service-info>
            </div>
        </el-col>
        <anychat-playback
            :videoFilePath="filePathUrl"
            :dialogSeen="dialogSeenParent"
            @before-close="beforeCloseFun"></anychat-playback>
    </div>
</template>



<script>
import ServiceInfo from '@/components/public/ServiceInfo'
import BusinessQuestion from '@/components/public/BusinessQuestion'
import AcceptRefuse from '@/components/public/AcceptAndRefuse'
import AnychatPlayback from '@/components/public/AnychatPlayback'
import AnychatVideoshow from '@/components/public/AnychatVideoshow'




export default {
    data() {
        return {
            styleObject: {
                height: (document.body.clientHeight - 70) + 'px',
            },
            question: AnyChat.clientData.questions,
            targetId: AnyChat.clientData.userId,
            tradeDataParent: AnyChat.clientData.tradeNo,
            snapPicParent: '',
            snapPicParentLocal: '',
            filePathUrl: '',
            filePathUrlLocal: '',
            dialogSeenParent: false,
            filePath: "",
            visibilityParent:'visible',
            passSuccessParent:false,
        }
    },
    props: [],
    computed: {

    },
    methods: {
        videorecordFinish: function(data) {
            console.log("videorecordFinish")
            console.info(data);
            this.filePath = data.szUrl
            this.filePathUrlLocal = data.filePath;
            console.info("-----------"+this.filePathUrlLocal);
        },
        snapShotFinish: function(data) {
            //拍照完成
            this.snapPicParent = data.szUrl;
            this.snapPicParentLocal = data.filePath;
            console.log(data);
        },
        filePathUrlFun: function() {
            //录像完成
            this.dialogSeenParent = true;
            this.filePathUrl = this.filePath;
            this.visibilityParent='hidden';
        },
        beforeCloseFun: function(is) {
            //关闭回放
            this.filePathUrl = '';
            this.dialogSeenParent = false;
            this.visibilityParent='visible';
        },
        afterCloseFun:function(){
            //显示视频
            this.visibilityParent='visible';
        },
        visibilityFun:function (is) {
            //隐藏视频
            this.visibilityParent='hidden';
        },
        passSuccessFun:function (is) {
            //成功
            this.passSuccessParent=true;
            instance.leaveRoom();
            this.$emit('leave-room', true);
            AnyChat.bus.$emit('leaveRoom', true)
            this.snapPicParent='';
            this.snapPicParentFinish="";
            this.filePathUrlFinish='';
            this.$router.push({ path: 'Overview' });

        }
    },
    components: {
        ServiceInfo,
        BusinessQuestion,
        AcceptRefuse,
        AnychatPlayback,
        AnychatVideoshow
    },
}
</script>

<style>
.MainWrapper .height100 {
    height: 100%;
}
</style>
<style scoped>
.videoArea {
    width: 100%;
    height: 60%;
}

.questionArea {
    width: 100%;
    height: 32%;
}

.btnArea {
    width: 100%;
    height: 8%;
    padding-top: 2%;
}

.messageArea {
    width: 100%;
    height: 100%;
}

.videoPlay {
    display: flex;
    width: 33%;
    text-align: right;
    float: left;
}

.item {
    flex: 1;
}

#back {
    background: #007ECE;
    padding: 6px 15px;
}

.acceptRefuse {
    display: inline-block;
    width: 62%;
    float: left;
    text-align: left;
    padding-left: 15px;
}
</style>
