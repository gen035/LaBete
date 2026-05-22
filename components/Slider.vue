<template>
  <Carousel
    :wrap-around="data.infinite"
    :autoplay="data.autoplay ? data.autoplay_speed : 0"
    :pause-autoplay-on-hover="data.pause_on_hover"
    :items-to-show="data.slides_to_show || 1"
  >
    <Slide v-for="(item, index) in data.slides" :key="index">
      <Media :image="item.slide" :altProp="item.slide.alt" :ariaHidden="true" />
    </Slide>
    <template #addons>
      <Pagination v-if="data.dots" />
      <Navigation v-if="data.arrows" />
    </template>
  </Carousel>
</template>
<script>
  import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
  import 'vue3-carousel/dist/carousel.css';
  export default {
    props: {
      data: {
        type: Object,
        required: true,
        default: () => ({})
      }
    },
    components: {
      Carousel,
      Slide,
      Pagination,
      Navigation
    }
  }
</script>
