<template>
  <VueSlickCarousel v-bind="settings">
    <template v-for="(item, index) in data.slides">
      <Media :key="index" :image="item.slide" :altProp="item.slide.alt" />
    </template>
  </VueSlickCarousel>
</template>
<script>
  import VueSlickCarousel from 'vue-slick-carousel';
  import Media from '~/components/Media';
  export default {
    props: {
      data: {
        type: Object,
        require: true,
        default: () => ({})
      }
    },
    data(){
      return {
        settings: {
          arrows: this.data.arrows,
          autoplay: this.data.autoplay,
          autoplaySpeed: this.data.autoplay_speed,
          dots: this.data.dots,
          fade: this.data.fade,
          infinite: this.data.infinite,
          pauseOnHover: this.data.pause_on_hover,
          slidesToShow: this.data.slides_to_show,
          speed: this.data.speed,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                dots: this.data.dots
              }
            }
          ]
        }
      }
    },
    computed: {
      linkTarget() {
        if (this.card.link.url.indexOf('etsy') === -1) {
          return "_self"
        } else {
          return "_blank"
        }
      }
    },
    components: {
      Media,
      VueSlickCarousel
    }
  }
</script>
