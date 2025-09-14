<template>
  <div>
    <LanguageComponent />
    <h1>{{ $t('welcome') }}</h1>
    <div>
      <input type="text" placeholder="Enter your name" v-model="name" />
    </div>

    <div>
      <!-- Affichage du nombre de pions restants -->
      <div class="pions-info">
        <span
          class="pions-restant"
          :class="{ 'pions-warning': PION_RESTANT <= 5, 'pions-error': PION_RESTANT <= 0 }"
        >
          {{ $t('pionsRestant', { count: PION_RESTANT }) || `Pions restants: ${PION_RESTANT}` }}
        </span>
        <span class="pions-total">{{
          $t('totalPions', { total: totalPions, max: MAX_PIONS }) ||
          `Total: ${totalPions}/${MAX_PIONS}`
        }}</span>
      </div>

      <Pallette :user="user" :showAgapata="false" />

      <div class="cases">
        <div v-for="(caseValue, index) in positions" :key="index" class="case-container">
          <label class="case-label">{{ caseValue }}</label>
          <input
            type="number"
            min="0"
            :max="getMaxValueForCase(index)"
            :placeholder="caseValue.toString()"
            v-model.number="cases[index]"
            class="case"
            :class="{ 'case-error': caseErrors[index], 'case-warning': cases[index] > 10 }"
            @input="validateInput(index)"
            @blur="validateInput(index)"
          />
          <span v-if="caseErrors[index]" class="error-message">
            {{ caseErrors[index] }}
          </span>
        </div>
      </div>

      <!-- Validation globale -->
      <div v-if="globalError" class="global-error">
        {{ globalError }}
      </div>

      <div class="game-controls">
        <button @click="startGame" :disabled="!isGameValid">
          {{ $t('beginGame') || 'Commencer le jeu' }}
        </button>
        <button @click="reset">{{ $t('reset') || 'Reset' }}</button>
        <button @click="distributeEvenly" :disabled="!canDistribute">
          {{ $t('distributeEvenly') || 'Répartir équitablement' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageComponent from '@/components/LanguageComponent.vue'
import Pallette from '../components/Pallette.vue'

const { t } = useI18n()

const name = ref('')
const positions = ref([15, 14, 13, 12, 11, 10, 9, 8, 0, 1, 2, 3, 4, 5, 6, 7])
const cases = ref([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
const caseErrors = ref({})
const globalError = ref('')
const MAX_PIONS = 32

// Computed properties
const totalPions = computed(() => {
  return cases.value.reduce((total, caseValue) => {
    const num = parseInt(caseValue) || 0
    return total + num
  }, 0)
})

const PION_RESTANT = computed(() => {
  const restant = MAX_PIONS - totalPions.value
  return restant < 0 ? 0 : restant
})

const isGameValid = computed(() => {
  return (
    name.value.trim() !== '' &&
    totalPions.value > 0 &&
    totalPions.value <= MAX_PIONS &&
    Object.keys(caseErrors.value).length === 0 &&
    !globalError.value
  )
})

const canDistribute = computed(() => {
  return PION_RESTANT.value > 0
})

// Méthodes
function getMaxValueForCase(index) {
  const currentValue = parseInt(cases.value[index]) || 0
  const otherCasesTotal = totalPions.value - currentValue
  return MAX_PIONS - otherCasesTotal
}

function validateInput(index) {
  const value = cases.value[index]
  const numValue = parseInt(value) || 0

  // Réinitialiser les erreurs pour cette case
  delete caseErrors.value[index]
  globalError.value = ''

  // Validation: valeur négative
  if (numValue < 0) {
    caseErrors.value[index] = t('errorNegativeValue') || 'La valeur ne peut pas être négative'
    cases.value[index] = 0
    return
  }

  // Validation: valeur trop grande pour cette case
  const maxForThisCase = getMaxValueForCase(index)
  if (numValue > maxForThisCase) {
    caseErrors.value[index] =
      t('errorTooManyPions', { max: maxForThisCase }) ||
      `Maximum ${maxForThisCase} pions pour cette case`
    cases.value[index] = maxForThisCase
    return
  }

  // Validation: total dépasse MAX_PIONS
  if (totalPions.value > MAX_PIONS) {
    globalError.value =
      t('errorTotalExceeded', { max: MAX_PIONS }) ||
      `Le total ne peut pas dépasser ${MAX_PIONS} pions`
    // Ajuster automatiquement
    const excess = totalPions.value - MAX_PIONS
    cases.value[index] = Math.max(0, numValue - excess)
    return
  }

  // Validation: valeur non numérique
  if (isNaN(value) && value !== '' && value !== null && value !== undefined) {
    caseErrors.value[index] = t('errorInvalidNumber') || 'Veuillez entrer un nombre valide'
    cases.value[index] = 0
    return
  }

  // Si la valeur est vide, on met 0
  if (value === '' || value === null || value === undefined) {
    cases.value[index] = 0
  }
}

function validateAllCases() {
  for (let i = 0; i < cases.value.length; i++) {
    validateInput(i)
  }
}

function startGame() {
  if (!isGameValid.value) {
    globalError.value =
      t('errorCannotStart') || 'Impossible de commencer le jeu. Vérifiez vos entrées.'
    return
  }

  globalError.value = ''
  console.log('Démarrage du jeu avec:', {
    name: name.value,
    cases: cases.value,
    totalPions: totalPions.value,
  })

  // Logique pour démarrer le jeu
}

function reset() {
  cases.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  caseErrors.value = {}
  globalError.value = ''
  name.value = ''
}

function distributeEvenly() {
  if (PION_RESTANT.value <= 0) return

  const pionsPerCase = Math.floor(PION_RESTANT.value / cases.value.length)
  const remainder = PION_RESTANT.value % cases.value.length

  for (let i = 0; i < cases.value.length; i++) {
    cases.value[i] = parseInt(cases.value[i]) || 0
    cases.value[i] += pionsPerCase + (i < remainder ? 1 : 0)
  }

  validateAllCases()
}

const user = computed(() => {
  return {
    id: 1,
    color: '#FF0000',
    cases: cases.value,
    name: name.value,
  }
})

// Watcher pour validation en temps réel
watch(
  cases,
  () => {
    validateAllCases()
  },
  { deep: true },
)

// Validation initiale
validateAllCases()
</script>

<style scoped>
.pions-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin: 10px 0;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.pions-restant {
  font-weight: bold;
  font-size: 1.1em;
  color: #28a745;
}

.pions-restant.pions-warning {
  color: #ffc107;
}

.pions-restant.pions-error {
  color: #dc3545;
}

.pions-total {
  color: #6c757d;
  font-size: 0.9em;
}

.cases {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
}

.case-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.case-label {
  font-size: 0.8em;
  color: #6c757d;
  margin-bottom: 5px;
  font-weight: bold;
}

.case {
  width: 140px;
  padding: 10px;
  border: 2px solid #dee2e6;
  border-radius: 5px;
  text-align: center;
  font-size: 1em;
  transition: all 0.3s ease;
}

.case:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.case-warning {
  border-color: #ffc107;
  background-color: #fff3cd;
}

.case-error {
  border-color: #dc3545;
  background-color: #f8d7da;
}

.error-message {
  color: #dc3545;
  font-size: 0.7em;
  margin-top: 3px;
  text-align: center;
  max-width: 140px;
  word-wrap: break-word;
}

.global-error {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #f5c6cb;
  margin: 10px 0;
  text-align: center;
  font-weight: bold;
}

.game-controls {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

.game-controls button {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: all 0.3s ease;
}

.game-controls button:first-child {
  background: #28a745;
  color: white;
}

.game-controls button:first-child:hover:not(:disabled) {
  background: #218838;
}

.game-controls button:nth-child(2) {
  background: #dc3545;
  color: white;
}

.game-controls button:nth-child(2):hover {
  background: #c82333;
}

.game-controls button:nth-child(3) {
  background: #17a2b8;
  color: white;
}

.game-controls button:nth-child(3):hover:not(:disabled) {
  background: #138496;
}

.game-controls button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #6c757d;
}

input[type='text'] {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid #dee2e6;
  border-radius: 5px;
  font-size: 1em;
}

input[type='text']:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}
</style>
