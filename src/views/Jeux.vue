<template>
  <div class="jeux">
    <main>
      <div>
        <h4>{{ $t('hakaton') }}</h4>
      </div>
      <Pallette
        :user="user"
        v-for="user in $store.state.abandi"
        :key="user.id"
        :isOrtherUser="true"
      />
      <Pallette :user="$store.state.user" @case-click="handleCaseClick" />
      <button class="play-button" @click="pangaUbusoro">
        {{ $t('play') }}
      </button>
    </main>
  </div>
</template>
<script>
import Pallette from '@/components/Pallette.vue'
import Agapata from '@/components/Agapata.vue'
import Urubugu from '@/model/urubugu.js'
import { getIndexPosition } from '@/localstorage/localstorage'
import bip from '@/assets/audio/bip.mp3'

export default {
  name: 'JeuxView',
  components: {
    Pallette,
    Agapata,
  },
  data() {
    return {
      users: [],
      bip: bip,
    }
  },
  methods: {
    handleCaseClick(position, caseValue, user) {
      // this.$store.state.socket.send(JSON.stringify({ action: 'case-click', index, caseValue }))
      // Coservation de la position choisir
      this.$store.state.user.currentPosition = position
      this.$store.state.user.currentValue = caseValue
      // MOdifier le nombre de pions
      const index = getIndexPosition(position)
      this.$store.state.user.cases[index] = 0
    },
    subizaUbusoro() {},
    pangaUbusoro() {
      const cases = this.$store.state.user.cases
      const urubugu = Urubugu(cases)
      urubugu.positionnerPion(
        this.$store.state.user.currentPosition,
        this.$store.state.user.currentValue,
      )
      this.$store.state.user.cases = urubugu.casesValues()
      this.$store.state.user.currentPosition = null
      this.$store.state.user.currentValue = null
      this.$store.state.socket.send(
        JSON.stringify({
          action: 'placement_pions',
          user: {
            ...this.$store.state.user,
            cases: this.$store.state.user.cases,
          },
        }),
      )
    },
  },
  watch: {
    '$store.state.ibije'(new_val) {
      let ibije = JSON.parse(new_val)
      if (ibije.action === 'login') {
        this.$store.state.socket.send(
          JSON.stringify({
            action: 'abandi',
            abandi: [...this.$store.state.abandi, this.$store.state.user],
          }),
        )
        this.$store.state.abandi.push({
          name: ibije.name,
          cases: ibije.cases,
          id: ibije.id,
          color: ibije.color,
        })
      }
      if (ibije.action === 'abandi') {
        if (this.$store.state.abandi.length == 0) this.$store.state.abandi = ibije.abandi
      }
      if (ibije.action === 'placement_pions') {
        console.log('placement_pions', ibije)
        this.$store.state.abandi.find((e) => e.id === ibije.user.id).cases = ibije.user.cases
        this.$store.state.socket.send(JSON.stringify({ action: 'bip' }))
      }
      if (ibije.action === 'bip') {
        const audio = new Audio(this.bip)
        audio.play()
        //  this.finishToPlay = !this.finishToPlay
      }
    },
  },
}
</script>

<style scoped>
.play-button {
  margin-top: 20px;
  padding: 10px 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  background: linear-gradient(135deg, #4cafef, #007bff); /* joli dégradé */
  color: #fff; /* texte blanc */
  transition: all 0.3s ease; /* animation douce */
}

.play-button:hover {
  background: linear-gradient(13deg, #007bff, #0056b3); /* survol */
}

.play-button:active {
  transform: scale(0.95); /* effet clic */
}
main {
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 1025px;
  height: 100vh;
  justify-content: center;
}
.jeux {
  width: 1025px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

@media (max-width: 768px) {
  main {
    width: 60%;
  }
}
</style>
