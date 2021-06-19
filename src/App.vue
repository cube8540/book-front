<template>
  <v-app>
    <the-header></the-header>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

import TheHeader from '@/components/headers/TheHeader.vue'

export default defineComponent({
  name: 'App',
  components: {
    TheHeader
  },
})

</script>

<style scoped>
</style>
