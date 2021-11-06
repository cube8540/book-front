<template>
  <v-app-bar
    app
    absolute
    fixed
    color="primary"
  >
    <v-btn icon color="white" @click="goHome">
      <v-icon>mdi-home-outline</v-icon>
    </v-btn>
    <v-progress-linear
      v-if="loading"
      active
      indeterminate
      absolute
      bottom
      color="amber"
    >
    </v-progress-linear>
  </v-app-bar>
</template>

<script lang="ts">
import {computed, ComputedRef, defineComponent, SetupContext} from '@vue/composition-api'

export default defineComponent({
  name: 'TheHeader',
  setup(props, context: SetupContext) {
    const loading: ComputedRef<boolean> = computed(() => context.root.$store.getters['LoadingStoreModule/isLoading'])

    function goHome() {
      context.root.$router.push({ name: 'home' })
    }

    return {
      loading,
      goHome
    }
  }
})
</script>

<style scoped>

</style>