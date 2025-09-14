<template>
  <div>
    <p>{{ $t('hello') }}</p>
    <p>{{ $t('welcome') }}</p>

    <!-- Boutons pour changer de langue -->
    <button @click="changeLang('fr')">Français</button>
    <button @click="changeLang('en')">English</button>
    <button @click="changeLang('run')">KIRUNDI</button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function changeLang(lang) {
  locale.value = lang
}
</script>
