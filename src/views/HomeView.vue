<script setup>
import Pallette from '@/components/Pallette.vue'
import { ref } from 'vue'
import Agapata from '@/components/Agapata.vue'

const users = ref([
  {
    id: 1,
    color: '#FF0000',
    cases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    name: 'John Doe',
  },
  {
    id: 2,
    color: '#FF0000',
    cases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    name: 'LIONEL',
  },
])
</script>

<template>
  <main>
    <Pallette :user="user" v-for="user in users" :key="user.id" :showAgapata="user.id === 1" />
  </main>
</template>
