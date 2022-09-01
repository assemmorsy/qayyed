import { createRouter, createWebHistory } from 'vue-router'
import { projectAuth } from '@/firebase/config'

import Show from "@/views/Show.vue"
import Login from "@/views/Login.vue"
import Input from "@/views/Input.vue"

// path guards
const alreadyAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if (user) {
    next({ name: "input" })
  } else {
    next()
  }
}
const needAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if (!user) {
    next({ name: "login" })
  } else {
    next()
  }
}



const routes = [
  {
    path: "/",
    component: Show,
    name: "show"
  }
  ,
  {
    path: "/login",
    component: Login,
    name: "login",
    beforeEnter: alreadyAuth

  },
  {
    path: "/input",
    component: Input,
    name: "input",
    beforeEnter: needAuth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
