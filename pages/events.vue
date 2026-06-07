<template>
  <section class="container events">
    <div v-if="content" class="row">
      <div class="offset-md-2 col-md-8">
        <h1>{{ content.title?.[0]?.text }}</h1>
        <p
            v-html="asHTML(content.content)"
            class="col-md-12 events-content"
        />
        <h2 class="title-h1">{{ content.title_upcoming?.[0]?.text }}</h2>
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
    <div v-if="content" class="row">
      <div class="offset-md-3 col-md-6">
        <h2 class="title-h1">{{ content.title_passed?.[0]?.text }}</h2>
        <ul class="accordion">
          <template
            v-for="(item, index) in passed"
            :key="index">
            <PassedEvents
              :year="item.year"
              :events="item.events"
            />
          </template>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { asText, asHTML } from '@prismicio/client'

defineI18nRoute({
  paths: {
    fr: '/evenements',
    en: '/events'
  }
})

const { $prismic } = useNuxtApp()
const { locale, tm, rt } = useI18n()

const { data } = useAsyncData('events', async () => {
  try {
    const contentDocs = await $prismic.client.getAllByType('eventpage', { lang: `${locale.value}-ca` })
    const content = contentDocs.length > 0 ? contentDocs[0].data : null

    const eventDocs = await $prismic.client.getAllByType('events', {
      lang: `${locale.value}-ca`,
      orderings: [{ field: 'my.events.start_date' }],
      pageSize: 100
    })
    const events = eventDocs.map(doc => doc.data)

    let seo = null
    if (content?.seo?.id) {
      const seoDoc = await $prismic.client.getByID(content.seo.id).catch(() => null)
      seo = seoDoc?.data ?? null
    }

    return { content, events, seo }
  } catch (err) {
    console.error('[events] Failed to fetch Prismic data:', err?.message || String(err))
    return { content: null, events: [], seo: null }
  }
})

const content = computed(() => data.value?.content ?? null)
const seo = computed(() => data.value?.seo ?? null)

const upcomingEvents = ref([])
const passed = ref([])

watch(data, (val) => {
  if (!val) return
  const today = new Date().setHours(0, 0, 0, 0)
  const allEvents = val.events || []

  const passedList = tm('passed_events').map(item => ({
    year: rt(item.year),
    events: Array.isArray(item.events) ? item.events.map(e => ({ name: rt(e.name) })) : [],
  }))

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
</script>
