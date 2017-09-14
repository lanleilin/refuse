<template>
    <div class="BusinessQuestion">
        <el-row class="white-bg question-list-box">
            <el-col :span="2" class="header-blank"></el-col>
            <el-col :span="4" v-for="(qtext,qid) in questions" :key="qid">
                <div class="center-align">
                    <el-button class="question-customer-btn" @click="edit_question(qtext)" :title="qtext" type="text">问题{{qid + 1}}</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row class="white-bg msg-list-box">
            <el-col :span="24">
                <div class="message-box" v-html="messages"></div>
            </el-col>
        </el-row>
        <el-row class="white-bg msg-input-box">
            <el-col :span="20">
                <el-input class="question-customer-input" v-model="msg" placeholder="请输入内容"></el-input>
            </el-col>
            <el-col :span="2">
                <el-button @click="send_question" type="primary" class="question-customer-btn send-msg-btn">发送</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        questionList: {
            type: Array,
            required: true
        },
        targetUserId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            msg: "",
            sends: [], //已发送问题
        };
    },
    computed: {
        questions: function() { //5个以内问题列表
            return this.questionList.slice(0, 5)
        },
        messages: function() {
            var li = this.sends.map(function(v) {
                var info = "<div class=\"messsage-info\"><span>" + AnyChat.userId + "</span><span>  " + new Date().toLocaleString() + "</span><div>"
                return info + "<div><span class=\"message-span\">" + v + "</span></div>"
            })
            return li.join('');
        }
    },
    methods: {
        edit_question: function(qtext) {
            this.msg = qtext;
        },
        send_question: function() {
            BRAC_TransBuffer(instance.getIntUserId(this.targetUserId), encodeURI(JSON.stringify({
                cmd: "CMD_Question_Content",
                data: {
                    content: this.msg.substr(0, 512)
                }
            })))
            // instance.TransBuffer({
            //     msg: encodeURI(JSON.stringify({
            //         cmd: "CMD_Question_Content",
            //         data: {
            //             content: this.msg.substr(0, 512)
            //         }
            //     })),
            //     targetUsers: [this.targetUserId],
            //     time: 5,
            //     done: this.onTransBufferDone
            // })
            this.sends.push(this.msg)
            this.$nextTick(() => {
                this.msg = "";
                document.querySelector(".message-box").scrollTop = 10000
            })
        },
        onTransBufferDone: function() { }
    }
}
</script>
<style>
    .BusinessQuestion .el-input__inner{
        height: 30px;
        border-radius: 0px;
        border: 1px solid #E8E8E8;
        font-size: 13px;
        line-height: 30px;
        font-family: 微软雅黑;
        margin-left: 3px;
    }
    .BusinessQuestion .el-button--primary{
        color: #fff !important;
        margin-left: 20px;
    }
</style>
<style scoped>
.header-blank {
    height: 1px;
}

.center-align {
    text-align: center;
}

.white-bg {
    background: #fff;
    margin-bottom: 5px;
    padding: 2px 0px;
}
.white-bg.msg-list-box{
    margin-bottom: 0px;
}
.white-bg.msg-input-box{
    margin-bottom: 0px;
    padding: 0px;
    padding-bottom: 7px;
}
.question-list-box {
    margin-top: 0px;
}
.question-customer-btn {
    padding: 6px 15px;
    font-family: 微软雅黑;
    color: #333;
}
.question-customer-input {
    height: 28px;
}
</style>

