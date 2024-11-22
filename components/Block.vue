<template>
  <section
    :class="`block block-${size} container-fluid`"
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
        <div>
          <div v-html="$prismic.asHtml(block.description)" />
          <a class="button-simple" v-if="block.button?.data?.url" :href="block.button.data.url.url">{{block.button?.data?.text}}</a>
        </div>
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
        required: true,
        default: () => ({})
      },
      size: {
        type: String,
        required: false,
        default: "standard"
      },
      imageType: {
        type: String,
        required: false,
        default: "background"
      },
      index: {
        type: Number,
        required: true,
        default: "0"
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
