<script>
import Vuetable from '../src/components/Vuetable.vue'

export default {
  components: {
    Vuetable
  },

  data() {
    return {
      data: [],
      fields: []
    }
  },

  mounted() {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => {
        this.data = data
        this.fields = Object.keys(data[0])
      })
  }
}
</script>

<template>
  <div id="app">
    <Vuetable :api-mode="false" :fields="fields" :data="data" />
  </div>
</template>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css';
</style>
