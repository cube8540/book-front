<template>
  <v-app-bar
    app
    dark
    absolute
    color="primary"
  >
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
import { computed, ComputedRef, defineComponent, SetupContext } from '@vue/composition-api'

export default defineComponent({
  name: 'TheHeader',
  setup(props, context: SetupContext) {
    const loading: ComputedRef<boolean> = computed(() => context.root.$store.getters['LoadingStoreModule/isLoading'])

    return { loading }
  }
})
</script>

<style scoped>

</style>