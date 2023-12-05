/* eslint-disable import/order */
// import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import 'v-calendar/dist/style.css'
import axios from 'axios'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VCalendar from 'v-calendar'

loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(VCalendar, {})
// app.use(store);

app.config.globalProperties.$axios = axios

// Mount vue app
app.mount('#app')
