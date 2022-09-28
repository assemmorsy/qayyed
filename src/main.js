import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.rtl.min.css"
import "@/assets/css/fonts.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import { projectAuth } from '@/firebase/config'

let app
projectAuth.onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App).use(router).mount('#app')
        
    }
})
