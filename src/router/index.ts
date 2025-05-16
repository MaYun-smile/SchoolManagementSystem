import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/home/courses'
      },
      {
        path: 'courses',
        name: 'courses',
        component: () => import('../views/CourseList.vue')
      },
      {
        path: 'my-courses',
        name: 'my-courses',
        component: () => import('../views/MyCourses.vue')
      },
      {
        path: 'schedule',
        name: 'schedule',
        component: () => import('../views/CourseSchedule.vue')
      },
      {
        path: 'grades',
        name: 'grades',
        component: () => import('../views/Grades.vue')
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user')
  const isLoggedIn = sessionStorage.getItem('isLoggedIn')

  if (to.meta.requiresAuth) {
    if (!isAuthenticated || !isLoggedIn) {
      next('/login')
    } else {
      next()
    }
  } else if (to.path === '/login' && isAuthenticated && isLoggedIn) {
    next('/home')
  } else {
    next()
  }
})

export default router 