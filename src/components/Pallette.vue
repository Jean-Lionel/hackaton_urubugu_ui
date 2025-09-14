<template>
  <div>
    <div
      :style="{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        padding: 0,
        width: '100%',
        maxWidth: '100%',
      }"
      class="grid-container"
    >
      <img
        v-for="(caseValue, index) in cases"
        :key="index"
        :style="{
          filter: `opacity(0.80) drop-shadow(0 0 0 ${user.color})`,
          cursor: 'pointer',
        }"
        class="cart"
        :src="`/src/assets/images/${caseValue}.png`"
        alt="Cart"
      />
    </div>
    <Agapata v-if="showAgapata" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ref } from 'vue'
import Agapata from './Agapata.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  showAgapata: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const cases = computed(() => {
  return props.user.cases.map((e) =>
    isNaN(e) || e === null || e === undefined || e === '' || e === '0' || e > 32
      ? 0
      : parseInt(e) > 15
        ? 15
        : parseInt(e),
  )
})
</script>

<style scoped>
.grid-container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.cart {
  width: 100%;
  height: auto;
  max-width: 100%;
  aspect-ratio: 1 / 1; /* Garde un ratio carré pour les images */
  object-fit: cover; /* S'assure que l'image couvre tout l'espace disponible */
  display: block;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
}

.cart:hover {
  filter: opacity(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

/* Responsive design pour différentes tailles d'écran */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(8, 1fr);
  }
}
</style>
