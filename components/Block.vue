<template>
  <section
    class="block container-fluid"
    :id="`block${index}`">
    <div
      :class="`row ${isOdd}`"
    >
      <div :class="[
        block.image.url ? 'col-md-6' : 'col-md-12',
        'd-flex',
        'align-items-center',
        'block-text'
      ]">
        <div v-html="$prismic.asHtml(block.description)" />
      </div>
      <div v-if="block.image.url && imageType === 'background'" class="col-md-6 block-img" :style="{backgroundImage: `url(${block.image.url})`}" />
      <div v-if="block.image.url && imageType === 'img'" class="col-md-6 block-img"><img :src="block.image.url" /></div>
    </div>
  </section>
</template>
<script>
  import Media from '~/components/Media';

  export default {
    props: {
      block: {
        type: Object,
        require: true,
        default: () => ({})
      },
      imageType: {
        type: String,
        require: false,
        default: "background"
      },
      index: {
        type: Number,
        require: true,
        default: 0
      }
    },
    computed: {
      isOdd() {
        if (this.index % 2 === 1) {
          return 'flex-row-reverse';
        }
        return ''
      },
    },
    components: {
      Media
    }
  }
</script>
