<template>
  <v-app v-scroll="onScrolling">
    <the-header></the-header>
    <v-main>
      <v-layout align-center justify-center>
        <router-view></router-view>
      </v-layout>
      <v-scale-transition
        origin="center center 0"
      >
        <v-btn
          v-show="showScrollButton"
          fab
          bottom
          right
          fixed
          color="primary"
          @click="onScrollTop"
        >
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
      </v-scale-transition>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext } from '@vue/composition-api'

import TheHeader from '@/components/headers/TheHeader.vue'

export default defineComponent({
  name: 'App',
  components: {
    TheHeader
  },
  setup(props, context: SetupContext) {
    const showScrollButton: Ref<boolean> = ref(false)

    const onScrolling = () => {
      const top = window.pageYOffset
      showScrollButton.value = top > 20
    }
    const onScrollTop = () => context.root.$vuetify.goTo(0)

    return {
      showScrollButton,
      onScrolling,
      onScrollTop
    }
  }
})

</script>

<style scoped>
</style>
