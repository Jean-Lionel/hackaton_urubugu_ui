<template>
  <main>
    <Pallette :user="user" v-for="user in $store.state.abandi" :key="user.id" :showAgapata="user.id === 1" />
    <Pallette :user="$store.state.user" />
  </main>
</template>
<script>
import Pallette from '@/components/Pallette.vue'
import Agapata from '@/components/Agapata.vue'

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
  watch: {
    '$store.state.ibije'(new_val) {
      let ibije = JSON.parse(new_val)
      if (ibije.action === 'login') {
        this.$store.state.socket.send(
          JSON.stringify({
            action: 'abandi',
            abandi: [...this.$store.state.abandi, this.$store.state.user],
          })
        )
        this.$store.state.abandi.push({ name: ibije.name, cases: ibije.cases, id: ibije.id, color: ibije.color })
      }
      if (ibije.action === 'abandi') {
        if(this.$store.state.abandi.length == 0)
          this.$store.state.abandi = ibije.abandi
      }
    },
  },
}
</script>
