<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '../api/userService'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)
const email = ref('')

const handleRegister = async () => {
  // 表单验证
  if (!username.value || !password.value || !confirmPassword.value) {
    errorMessage.value = '请填写所有字段'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = '密码长度至少为6位'
    return
  }

  try {
    loading.value = true
    errorMessage.value = ''

    const { token, user } = await register({
      username: username.value,
      email: email.value,
      password: password.value
    })

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    ElMessage.success('注册成功')
    router.push('/home')
  } catch (error: any) {
    errorMessage.value = error || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleRegister()
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <h2>注册账号</h2>
      <div class="form-group">
        <input type="text" v-model="username" placeholder="用户名" class="input-field" @keypress="handleKeyPress"
          :disabled="loading">
      </div>
      <div class="form-group">
        <input type="password" v-model="password" placeholder="密码" class="input-field" @keypress="handleKeyPress"
          :disabled="loading">
      </div>
      <div class="form-group">
        <input type="password" v-model="confirmPassword" placeholder="确认密码" class="input-field"
          @keypress="handleKeyPress" :disabled="loading">
      </div>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <button @click="handleRegister" class="register-button" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>
      <div class="login-link">
        已有账号？ <router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #87CEEB;
}

.register-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.input-field {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input-field:focus {
  outline: none;
  border-color: #87CEEB;
}

.input-field:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.register-button {
  width: 100%;
  padding: 0.8rem;
  background-color: #87CEEB;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.register-button:hover:not(:disabled) {
  background-color: #75b5d0;
}

.register-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.login-link a {
  color: #87CEEB;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>