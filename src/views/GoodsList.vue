<template>
    <div>
        <nav-header></nav-header>
        <nav-bread><span>Goods</span></nav-bread>
        <div></div>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import NavHeader from './../components/NavHeader'
import NavFooter from './../components/NavFooter'
import NavBread from './../components/NavBread'
export default {
    data(){
        return{
            msg:"test"
        }
    },
    components:{
        NavHeader,
        NavFooter,
        NavBread
    }
}
</script>
<style scoped>

</style>