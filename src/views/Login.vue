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
          {{ $t('pionsRestant') || `Pions restants: ${PION_RESTANT}` }}
          {{ PION_RESTANT }}
        </span>
        <span class="pions-total"
          >{{ $t('totalPions') || `Total: ${totalPions}/${MAX_PIONS}` }}
          {{ `Total: ${totalPions}/${MAX_PIONS}` }}
        </span>
      </div>

      <Pallette :user="user" :showAgapata="false" />

      <div class="cases">
        <div v-for="(caseValue, index) in positions" :key="index" class="case-container">
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
import { useStore } from 'vuex'

const { t } = useI18n()
const store = useStore()

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
  let nom = name.value.trim()
  let amacase = cases.value.map((c) => (isNaN(c) ? 0 : parseInt(c)))
  let color = '#FF0000' // Couleur par défaut pour le joueur principal

  store.state.socket = new WebSocket(store.state.wsUrl)
  store.state.socket.onopen = function (e) {
    console.log('[open] Connection established')
    store.state.socket.send(JSON.stringify({ action: 'login', name: nom, cases: amacase }))
  }
  store.state.socket.onmessage = function (event) {
    console.log(event)
    let ibije = JSON.parse(event.data)
    if (ibije.action === 'login') {
      if (ibije.name === nom) {
        store.state.user = { name: nom, cases: amacase, color: color }
      } else {
        store.state.ibije = event.data
      }
    } else {
      store.state.ibije = event.data
    }
    return
  }
  store.state.socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
    } else {
      console.log('[close] Connection died')
      console.log(`[close] ${JSON.stringify(event)}`)
    }
  }
  store.state.socket.onerror = function (error) {
    console.log(`[error] ${JSON.stringify(error)}`)
  }
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

<style scoped></style>
