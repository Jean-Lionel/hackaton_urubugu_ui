import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createI18n } from 'vue-i18n'
import store from './store'

// Import des traductions
import fr from './locales/fr.json'
import en from './locales/en.json'
import run from './locales/run.json'

// Création de l’instance i18n
const i18n = createI18n({
  locale: 'run', // langue par défaut
  fallbackLocale: 'fr', // langue de secours
  messages: {
    fr,
    en,
    run,
  },
})

const app = createApp(App)

app.use(i18n)
app.use(store)
app.mount('#app')
