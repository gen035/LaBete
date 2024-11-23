<template>
  <v-lazy-image v-if="lazy && image?.url" :src="image.url" src-placeholder="/product_placeholder.jpg" :alt="alt" :title="alt" :class="returnClasses" :aria-hidden="ariaHidden"/>
  <img
    v-else-if="!lazy && image?.url"
    :src="src"
    :alt="alt"
    :title="alt"
    :class="returnClasses"
    :aria-hidden="ariaHidden"
  />
</template>
<script>
  import VLazyImage from "v-lazy-image/v2";
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
      },
      lazy: {
        type: Boolean,
        required: false,
        default: true
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
    },
    components: {
      VLazyImage
    },
  }
</script>