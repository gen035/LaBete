<template>
  <section class="content videos">
    <section class="container">
      <div class="row">
        <div v-html="$prismic.asHtml(content.title)" class="col-md-12" />
        <div
          v-html="$prismic.asHtml(content.content)"
          class="col-md-8 offset-md-2 text-center mb-5"
        />
      </div>

      <div class="row">
        <div
          v-for="(video, index) in content.videos"
          :key="video.video_link?.embed_url || index"
          class="col-md-6 offset-md-3 video"
        >
          <h2>{{ $prismic.asText(video.video_title) }}</h2>
          <time v-if="video.date">
            {{ formatDate(video.date) }}
          </time>

          <div class="video-wrapper" v-if="video.video_link?.html">
            <div
              class="video-embed"
              v-html="responsiveEmbed(video.video_link.html)"
            />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import Media from '~/components/Media'

export default {
  async asyncData({ app, error, store }) {
    const locale = store.state.i18n.locale
    let content = null

    await app.$prismic.api
      .query(app.$prismic.predicates.at('document.type', 'videos_page'), {
        lang: `${locale}-ca`,
      })
      .then((response) => {
        const doc = response.results?.[0]
        if (doc) content = doc.data
      })

    if (!content) {
      error({ statusCode: 404, message: 'Page not found' })
      return
    }

    let seo = await app.$prismic.api.getByID(content.seo.id)
    seo = seo.data

    return { content, seo }
  },

  head() {
    return {
      title: this.$prismic.asText(this.seo.title),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$prismic.asText(this.seo.description),
        },
      ],
    }
  },

  methods: {
    responsiveEmbed(html) {
      // Make Prismic oEmbed iframe responsive by removing fixed w/h
      return (html || '')
        .replace(/width="[^"]*"/i, 'width="100%"')
        .replace(/height="[^"]*"/i, 'height="100%"')
    },

    formatDate(dateStr) {
      try {
        return new Date(dateStr).toLocaleDateString('fr-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch (e) {
        return dateStr
      }
    },
  },

  computed: {
    hasMobileImage() {
      return this.content.mobile_image
    },
  },

  components: {
    Media,
  },

  nuxtI18n: {
    paths: {
      fr: '/videos',
      en: '/videos',
    },
  },
}
</script>
