<template>
  <img
    v-if="image.url"
    :src="src"
    :alt="alt"
    :title="alt"
    :class="returnClasses"
    :aria-hidden="ariaHidden"
  />
</template>
<script>
  export default {
    props: {
      altProp: {
        type: String,
        required: false
      },
      ariaHidden: {
        type: Boolean,
        required: false,
        default: false
      },
      image: {
        type: Object,
        required: true,
        default: () => ({})
      },
      classes: {
        type: String,
        required: false
      }
    },
    computed: {
      alt() {
        if (this.image.alt) {
          return this.image.alt;
        }else if (this.altProp){
          return this.altProp;
          
        } else {
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