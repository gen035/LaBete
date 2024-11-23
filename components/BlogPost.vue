<template>
  <div class="blog-post-item col-md-8 offset-md-2 col-12">
    <div class="row">
      <div class="blog-post-item-img col-lg-6 col-12">
        <Media :image="data.image" placeholder="horizontal" />
      </div>
      <div class="blog-post-item-body col-lg-6 col-12">
        <div v-html="$prismic.asHtml(data.title)" />
        <div>
          <p>{{createExcerpt}}</p>
          <ul class="blog-post-tags" v-if="data.tags?.length > 0">
            <li v-for="tag in data.tags">{{tag.tag}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Media from '~/components/Media';
  export default {
    props: {
      data: {
        type: Object,
        required: true,
        default: () => ({})
      }
    },
    computed: {
      createExcerpt() {
        const words = this.data.content[0].text.split(' ').slice(0, 50).join(' ');
        return `${words}...`; // Add ellipsis to indicate an excerpt
      }
    },
    components: {
      Media
    }
  }
</script>
