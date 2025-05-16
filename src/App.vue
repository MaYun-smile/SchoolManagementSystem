<script setup lang="ts">
// 移除默认导入
</script>

<template>
  <router-view></router-view>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>

<style scoped>
.sunrise-container {
  width: 100%;
  height: 100%;
  background-color: #87CEEB;  /* 天空浅蓝色 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sunrise-content {
  text-align: center;
  color: white;
  z-index: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.sunrise-content h1 {
  font-size: 3em;
  margin-bottom: 0.5em;
}

.sunrise-content p {
  font-size: 1.5em;
  opacity: 0.9;
}
</style>
