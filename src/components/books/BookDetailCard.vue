<template>
  <v-card elevation="2" outlined>
    <div class="d-flex align-center">
      <div class="pa-2">
        <v-img
          :width="thumbnailWidth"
          :height="thumbnailHeight"
          :src="thumbnail"
          :lazy-src="thumbnail"
        >
          <template #placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              >
              </v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
      <div class="align-self-stretch">
        <v-card-title>{{ title }}</v-card-title>
        <v-card-subtitle class="d-flex">
          <span class="d-inline-block text-no-wrap">
            {{ publisher }}
          </span>
          <v-divider class="mx-2" vertical></v-divider>
          <span class="d-inline-block text-no-wrap">
            {{ publishDate }}
          </span>
          <v-divider class="mx-2" vertical></v-divider>
          <template v-for="(author, index) in authors">
            <span class="d-inline-block text-no-wrap" :key="index">
              {{ author }}
            </span>
            <v-divider class="mx-2" vertical v-if="index < (authors.length - 1)" :key="index"></v-divider>
          </template>
        </v-card-subtitle>
        <v-card-text>
          {{ displayDescription }}
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'BookDetailCard',
  props: {
    isbn: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    publisher: {
      type: String,
      required: true
    },
    publishDate: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    authors: {
      type: Array,
      default: [],
      required: false
    },
    maxDescriptionLength: {
      type: Number,
      default: 100,
      required: false
    },
    thumbnailWidth: {
      type: String,
      default: '150px',
      required: false
    },
    thumbnailHeight: {
      type: String,
      default: '220px',
      required: false
    }
  },
  setup(props) {
    const displayDescription = ref(props.description)

    if (displayDescription.value && displayDescription.value.length > props.maxDescriptionLength) {
      displayDescription.value = displayDescription.value.substring(0, props.maxDescriptionLength) + '...'
    }

    return { displayDescription }
  }
})
</script>

<style scoped>
</style>