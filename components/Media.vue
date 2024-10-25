<template>
  <img
    v-if="image.url"
    :src="src"
    :alt="alt"
    :title="alt"
    :class="returnClasses"
  />
</template>
<script>
  export default {
    props: {
      image: {
        type: Object,
        require: true,
        default: () => ({})
      },
      classes: {
        type: String,
        require: false
      }
    },
    computed: {
      alt() {
        if (this.image.alt) {
          return this.image.alt;
        }else{
          return 'labete';
        }
      },
      src() {
        if (this.image.url) {
          return this.image.url;
        }
      },
      returnClasses() {
        return this.classes;
      }
    }
  }
</script>