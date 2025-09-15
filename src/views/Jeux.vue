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
    handleCaseClick(index, caseValue, user) {
      console.log('POSITION', index, 'value', caseValue)

      if (caseValue == 0 && this.$store.state?.currentPlayer?.selecedPions[index]) {
        this.$store.state.user.cases[index] = this.$store.state?.currentPlayer?.selecedPions[index]
        this.$store.state.currentPlayer.selecedPions[index] = null
      } else {
        this.$store.state.currentPlayer.selecedPions = this.$store.state.user.cases[index]
        this.$store.state.currentPlayer.lastIndex = index
        this.$store.state.user.cases[index] = 0
      }

      // this.$store.state.socket.send(JSON.stringify({ action: 'case-click', index, caseValue }))
    },
    pangaUbusoro() {
      const nbrPions = this.$store.state.currentPlayer.selecedPions
      const currentPosition = this.$store.state.currentPlayer
      const urubugu = Urubugu(this.$store.state.user.cases)
      urubugu.placePion(currentPosition.lastIndex, nbrPions)
      this.$store.state.currentPlayer.selecedPions = {}
      this.$store.state.currentPlayer.lastIndex = null
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
