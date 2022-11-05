import { createRouter, createWebHashHistory } from 'vue-router'
import tabNav from '../views/LeftNav/LeftNavVue.vue'
import profile from '../views/Profile/userProfile.vue'
const routes = [
  {
    path: '/',
    name: 'LeftNav',
    component: tabNav,
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: profile
      },
      {
        path: 'contacts',
        name: 'contacts'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router