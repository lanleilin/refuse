import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/view/Dashboard'
import Login from '@/components/view/Login'
import Home from '@/components/view/Home'
import Overview from '@/components/view/Overview.vue'
import BusinessAccount from '@/components/view/BusinessAccount.vue'
Vue.use(Router)




export default new Router({
    routes: [{
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/Login',
        name: 'Login',
        meta: {
            title: 'AnyChat登录'
        },
        component: Login
    },
    {
        path: '/Home',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/Home/Overview',
                component: Overview,
                name: '总览页',
                meta: {
                    title: '坐席总览页'
                },
            },
            { 
                path: '/Home/BusinessAccount', 
                component: BusinessAccount, 
                name: '视频见证开户' ,
                meta: {
                    title: '开户见证'
                },
            },
        ]
    },
    {
        path: '*',
        redirect: '/Login/'
    }
    ]
})

