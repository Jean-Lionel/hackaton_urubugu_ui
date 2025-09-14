<script setup>
import Pallette from '@/components/Pallette.vue'
import { ref } from 'vue'

const user = ref({
  color: '#FF0000',
  cases: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  name: 'John Doe',
})
</script>

<template>
  <main>
    <Pallette :user="user" />
  </main>
</template>
