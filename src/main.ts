import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

// 添加全局错误处理
app.config.errorHandler = (err) => {
  console.error('Vue全局错误:', err)
  if (err.message.includes('Network Error')) {
    alert('后端服务连接失败，请检查服务是否运行')
  }
}

app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')