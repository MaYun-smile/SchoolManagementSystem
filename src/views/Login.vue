<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { login } from '../api/userService'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

// 检查是否已登录
if (sessionStorage.getItem('isLoggedIn')) {
  router.push('/home')
}

const handleLogin = async () => {
  // 表单验证
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''

    const response = await login({
      username: username.value,
      password: password.value
    })

    const { token, user } = response
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    sessionStorage.setItem('isLoggedIn', 'true')

    ElMessage.success('登录成功')
    router.push('/home')
  } catch (error: any) {
    errorMessage.value = error
    ElMessage.error(error)
  } finally {
    loading.value = false
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录</h2>
      <el-form>
        <el-form-item>
          <el-input v-model="username" placeholder="用户名" :prefix-icon="User" :disabled="loading" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="密码" :prefix-icon="Lock" :disabled="loading"
            @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" style="width: 100%">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <div class="register-link">
        没有账号？ <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('@/assets/bd.jpg') no-repeat 100% 100%;
  background-size: cover;
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 0;
}

.login-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(2px);
}

h2, .error-message, .register-link {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.error-message {
  text-align: center;
  margin-top: 1rem;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 14px;
}

.register-link a {
  color: #aad4ff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>