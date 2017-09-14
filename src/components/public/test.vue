<template>
   <div>
     123123123213
   </div>
</template>

<script>

export default {
  data() {
    return {
      "abcd":this.alert_
    }
  },
  props:['abc'],
  computed:{
	 
  },
  methods: {
    alert_:function(){
      alert(1);
    },
    abc:function(){
      alert(2)
    }
  
	
  }  
}
</script>

<style>

</style>
