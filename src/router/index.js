import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


const routes = [
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('@/components/calendar/Calendar')
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: () => import('@/components/catalog/catalog')
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/catalog/category')
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/Demo')
  },
  {
    path: '/fields',
    name: 'CustomFields',
    component: () => import('@/components/catalog/customFields/customFields')
  },
  // {
  //   path: '/help',
  //   name: 'Help',
  //   component: () => import('@/components/help/help')
  // },
  {
    path: '/images',
    name: 'Images',
    component: () => import('@/components/images/images')
  },
  {
    path: '/patrons',
    name: 'Patrons',
    component: () => import('@/components/patron/patronList')
  },
  {
    path: '/public',
    name: 'Public',
    component: () => import('@/components/publicDemo/Public')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings')
  },

  { path: '/', 
    beforeEnter(to, from, next) {
      const loadView = localStorage.getItem('lastRoute') || 'Calendar'
      next({name: loadView})
    }
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const firstLoad = localStorage.getItem('firstLoad') !== 'false'
  if (firstLoad && to.name !== 'Demo')  next({name: 'Demo'})
  if (!from.name) next()
  const routeName = to.name || ''
  localStorage.setItem('lastRoute', routeName)
  next()
})

export default router
