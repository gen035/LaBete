<template>
  <section class="container events">
    <div class="row">
      <div class="offset-md-2 col-md-8">
        <h1>{{ content.title[0].text }}</h1>
        <p
            v-html="asHTML(content.content)"
            class="col-md-12 events-content"
        />
        <h2 class="title-h1">{{ content.title_upcoming[0].text }}</h2>
        <div v-if="upcomingEvents.length === 0" class="events-empty text-center">{{ $t('events.empty') }}</div>
        <template
            v-if="upcomingEvents.length > 0"
            v-for="(event, index) in upcomingEvents"
          >
          <Event
            :event="event"
            :index="index"
          />
        </template>
      </div>
    </div>
    <div class="row">
      <div class="offset-md-3 col-md-6">
        <h2 class="title-h1">{{ content.title_passed[0].text }}</h2>
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
import { asText, asHTML } from '@prismicio/client'

definePageMeta({
  i18n: {
    paths: {
      fr: '/evenements',
      en: '/events'
    }
  }
})

export default {
  setup() {
    const { $prismic } = useNuxtApp()
    const { locale, t } = useI18n()

    const { data } = useAsyncData('events', async () => {
      const contentDocs = await $prismic.client.getAllByType('eventpage', { lang: `${locale.value}-ca` })
      const content = contentDocs.length > 0 ? contentDocs[0].data : null

      const eventDocs = await $prismic.client.getAllByType('events', {
        lang: `${locale.value}-ca`,
        orderings: [{ field: 'my.events.start_date' }],
        pageSize: 100
      })
      const events = eventDocs.map(doc => doc.data)

      let seo = null
      if (content && content.seo && content.seo.id) {
        const seoDoc = await $prismic.client.getByID(content.seo.id)
        seo = seoDoc.data
      }

      return { content, events, seo }
    })

    const content = computed(() => data.value?.content ?? null)
    const seo = computed(() => data.value?.seo ?? null)

    // Reactive state for events processing
    const upcomingEvents = ref([])
    const passed = ref([])

    // Process events when data is available (replaces created() + getDynamicPassedEvents)
    watch(data, (val) => {
      if (!val) return
      const today = new Date().setHours(0, 0, 0, 0)
      const allEvents = val.events || []

      // Start with i18n-defined past events
      const passedList = JSON.parse(JSON.stringify(t('passed_events')))

      allEvents.forEach((event) => {
        const endDate = new Date(event.end_date).setHours(23, 59, 59, 999)
        if (today > endDate) {
          const eventYear = new Date(event.end_date).getFullYear()
          passedList.forEach((list, index) => {
            if (parseInt(list.year) === eventYear) {
              passedList[index].events.unshift({
                name: event.name[0].text,
                city: event.city && event.city.length > 0 && event.city[0].text
              })
            }
          })
        }
      })

      // Filter upcoming: show if end_date >= today OR show_permanently === true
      upcomingEvents.value = allEvents.filter(event => {
        const eventEndDate = new Date(event.end_date + 'T23:59:59.999')
        return today <= eventEndDate || event.show_permanently === true
      })

      passed.value = passedList
    }, { immediate: true })

    useHead(computed(() => ({
      title: seo.value?.title ? asText(seo.value.title) : 'La Bête',
      meta: [
        { name: 'description', content: seo.value?.description ? asText(seo.value.description) : '' }
      ]
    })))

    return { content, upcomingEvents, passed, asHTML }
  }
}
</script>
