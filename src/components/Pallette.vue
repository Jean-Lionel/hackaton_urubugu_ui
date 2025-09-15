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
      class="grid-container urubugu"
    >
      <div v-for="(caseValue, caseI) in cases" :key="caseI">
        <!-- {{ caseValue.position }} -->
        <img
          :style="{
            filter: `opacity(0.80) drop-shadow(0 0 0 ${user.color})`,
            cursor: 'pointer',
          }"
          class="cart"
          :src="`/src/assets/images/${getImageId(caseValue.value)}.png`"
          alt="Cart"
          @dblclick="handleCaseClick(caseValue.position, caseValue.value)"
        />
      </div>
    </div>
    <Agapata v-if="isOrtherUser" />
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
  isOrtherUser: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const getImageId = (value) => {
  return value < 15 ? value : 15
}

const emit = defineEmits(['case-click'])

const handleCaseClick = (position, caseValue) => {
  emit('case-click', position, caseValue, props.user)
}

const positions = ref([15, 14, 13, 12, 11, 10, 9, 8, 0, 1, 2, 3, 4, 5, 6, 7])

const cases = computed(() => {
  const currentCases = props.user.cases.map((e, i) => {
    return { position: positions.value[i], value: e }
  })

  return props.isOrtherUser ? currentCases.reverse() : currentCases
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
