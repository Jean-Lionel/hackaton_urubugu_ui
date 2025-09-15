<template>
  <main>
    <Pallette
      :user="user"
      v-for="user in $store.state.abandi"
      :key="user.id"
      :isOrtherUser="true"
    />
    <Pallette :user="$store.state.user" @case-click="handleCaseClick" />
    <button class="play-button" @click="pangaUbusoro">{{ $t('play') }}</button>
  </main>
</template>
<script>
import Pallette from '@/components/Pallette.vue'
import Agapata from '@/components/Agapata.vue'
import Urubugu from '@/model/urubugu.js'
import { getIndexPosition } from '@/localstorage/localstorage'

export default {
  name: 'JeuxView',
  components: {
    Pallette,
    Agapata,
  },
  data() {
    return {
      users: [],
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
    },
  },
}
</script>
