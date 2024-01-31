import { createRouter, createWebHashHistory } from 'vue-router'
import contact from "../views/contacts/contact.vue";
import tabNavView from '../views/LeftNav/LeftNavVue.vue'
import profile from '../views/Profile/userProfile.vue'
const routes = [
  {
    path: '/',
    name: 'LeftNav',
    component: tabNavView,
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: profile
      },
      {
        path: 'contacts',
        name: 'contact',
        component: contact
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router