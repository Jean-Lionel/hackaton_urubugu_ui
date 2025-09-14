<template>
  <div class="agapata-container">
    <img :src="agapata" alt="Agapata" class="agapata" />
    <img :src="agapata" alt="Agapata" class="agapata" />
  </div>
</template>

<script setup>
import agapata from '../assets/images/agapata1.jpeg'
</script>

<style scoped>
.agapata-container {
  display: flex;
  justify-content: space-between;
}

.agapata {
  width: 20%;
}
</style>
