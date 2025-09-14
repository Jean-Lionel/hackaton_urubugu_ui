<template>
  <div>
    <LanguageComponent />
    <h1>{{ $t('welcome') }}</h1>
    <div>
      <input type="text " placeholder="Enter your name" v-model="name" />
    </div>

    <div>
      {{ cases }}
      <Pallette :user="user" :showAgapata="false" />
      <div class="cases">
        <div v-for="(caseValue, index) in positions" :key="index">
          <input
            type="text"
            :placeholder="caseValue"
            v-model="cases[index]"
            class="case"
            @change="validateInput(caseValue)"
          />
        </div>
      </div>
      <div>
        <button @click="startGame">{{ $t('beginGame') }}</button>
        <button @click="reset">{{ $t('reset') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LanguageComponent from '@/components/LanguageComponent.vue'
import Pallette from '../components/Pallette.vue'

const name = ref('')
const positions = ref([15, 14, 13, 12, 11, 10, 9, 8, 0, 1, 2, 3, 4, 5, 6, 7])
const cases = ref([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

function startGame() {}

function reset() {
  cases.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

function validateInput(index) {
  if (
    isNaN(cases.value[index]) ||
    cases.value[index] === null ||
    cases.value[index] === undefined ||
    cases.value[index] === '' ||
    cases.value[index] === '0' ||
    cases.value[index] > 32
  ) {
    cases.value[index] = 0
  }
}

const user = computed(() => {
  return {
    id: 1,
    color: '#FF0000',
    cases: cases.value,
    name: name.value,
  }
})
</script>

<style scoped>
.cases {
  display: grid;
  grid-template-columns: repeat(8, 0fr);
  gap: 2px;
  padding: 0;
}

.cases input {
  width: 140px;
  padding: 10px;
}
</style>
