<template>
  <div
    :style="{
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 0fr)',
      gap: 0,
      padding: 0,
    }"
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
</template>

<script setup>
import { computed } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
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
.cart {
  /* Add any additional styling for the cart class here if needed */
}
</style>
