<template>
  <section class="container">
    <div class="row">
      <div class="offset-md-1 col-md-10">
        <h2 class="title-h2">{{ content.title[0].text }}</h2>
        <template
          v-for="(event, index) in events">
          <Event
            :event="event"
            :key="index"
            :index="index"
          />
        </template>
      </div>
    </div>
    <div class="row">
      <div class="offset-md-3 col-md-6">
        <h2 class="title-h2">{{ content.title_passed[0].text }}</h2>
        <ul class="accordion">
          <template
            v-for="(item, index) in passed">
            <PassedEvents
              :key="index"
              :year="item.year"
              :events="item.events"
            />
          </template>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
  import Event from '~/components/Event';
  import PassedEvents from '~/components/PassedEvents';

  export default {
    async asyncData({ app, error, store }) {
      const locale = store.state.i18n.locale;
      let events = []
      let content = []

      await app.$prismic.api.query(
        app.$prismic.predicates.at('document.type', 'eventpage'), {
          lang: `${locale}-ca`
        }
      ).then((response) => {
         response.results.forEach(result => {
          content = result.data;
        });
      })

      await app.$prismic.api.query(
        app.$prismic.predicates.at('document.type', 'events'), {
           lang: `${locale}-ca`,
           orderings : '[my.events.start_date]',
        }
      ).then((response) => {
        response.results.forEach(result => {
          events.push(result.data);
        });
      })

      let seo = await app.$prismic.api.getByID(content.seo.id)
      seo = seo.data;

      return {
        content,
        events,
        seo
      }
    },
    data() {
      return {
        today: new Date(),
        passed: []
      }
    },
    head() {
      return {
        title: this.$prismic.asText(this.seo.title),
        link: [
        //{ rel: 'canonical', href: `https://<DOMAIN>${this.$prismic.linkResolver(this.document)}` }
        ],
        meta: [
          { hid: 'description', name: 'description', content: this.$prismic.asText(this.seo.description) }
        ]
      }
    },
    created() {
      const events = this.$t('passed_events');

      events.map((item) => {
        this.passed.push(item);
      });

      this.getDynamicPassedEvents();
    },
    methods: {
      getDynamicPassedEvents() {
        const passed = JSON.parse(JSON.stringify( this.passed ));

        this.events.map((event) => {
          if (this.today > this.$prismic.asDate(event.end_date)) {
            const eventYear = this.$prismic.asDate(event.end_date).getFullYear();

            passed.map((list, index) => {
              const currentYear = parseInt(list.year)

              if (currentYear === eventYear) {
                passed[index].events.unshift({name: event.name[0].text, city: event.city && event.city.length > 0 && event.city[0].text})
              }
            });
          }
        });

        this.passed = passed;
      }
    },
    components: {
      Event,
      PassedEvents
    },
    nuxtI18n: {
      paths: {
        fr: '/evenements',
        en: '/events'
      }
    },
  }
</script>
