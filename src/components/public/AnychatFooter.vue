<template>
  <div class="anychat-footer">
    <h4>{{ fline }}</h4>
    <h4>{{ sline }}</h4>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fline: '广州佰锐网络科技有限公司 2005-2017。 粤ICP备13022410号-2',
      sline: '公司地址：广州市天河区天河软件园建工路9号309-310室；咨询电话：020-85276986'
    }
  }
}
</script>

<style scoped>
h4 {
    margin: 0;
}
.anychat-footer {
    position: fixed;
    width: 100%;
    height: 60px;
    bottom: 0;
}
</style>
