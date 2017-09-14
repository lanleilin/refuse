<template>
    <div id="anychat-autograph"> 
        <el-button type="text" @click="dialogVisible = true">显示签名</el-button>
        <el-dialog title="签名" :visible.sync="dialogVisible" size="tiny">
        <div class="imageCanvas"><img :src="imgurl"/></div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="mySave">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        imgurl:'../../assets/img/logo.png'
      };
    },
    methods:{
        mySave: function(){
            console.log('true');
            this.dialogVisible = false;
        }
    }
  };
</script>

<style scoped>
    .imageCanvas{
        width:360px; 
        height:200px; 
        border:1px solid #d9d9d9;
        text-align: center;
    }
    .imageCanvas img{
        width: 100%;
        height: 200px;
    }
</style>