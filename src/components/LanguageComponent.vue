<template>
  <div class="language-component">
    <!-- Boutons pour changer de langue -->
    <button @click="changeLang('fr')"><img src="/src/assets/flags/fr.png" alt="" />FR</button>
    <button @click="changeLang('en')"><img src="/src/assets/flags/en.png" alt="" />EN</button>
    <button @click="changeLang('run')"><img src="/src/assets/flags/bdi.png" alt="" />RUN</button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function changeLang(lang) {
  locale.value = lang
}
</script>

<style scoped>
button {
  margin-left: 10px;
}
img {
  width: 40px;
}
.language-component {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
</style>
