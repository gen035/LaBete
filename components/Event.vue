<template>
  <div
    :class="`event ${isOdd}`">
    <div
      class="event-image"
      :style="`background-image: url('${event.image.url}')`">
      <a
        v-if="event.event_link.url"
        :href="event.event_link.url"
        :title="event.name[0].text"
        target="_blank"
      />
    </div>
    <div class="event-content d-flex align-items-center">
      <div>
        <div class="event-name">{{ event.name[0].text }}</div>
        <div class="event-city">{{ event.city[0].text }}</div>
        <div class="event-venue">{{ event.venue[0].text }}</div>
        <div class="event-desc" v-html="$prismic.asHtml(event.description)"/>
        <div class="event-links">
          <div v-if="event.google_maps_link.url" class="event-link">
            <a
              :href="event.google_maps_link.url"
              :title="event.name[0].text"
              target="_blank"
              data-track=""
              data-track-category="events"
              data-track-action="click"
              :data-track-label="`${event.name[0].text} Map`"
            >
              <i class="fas fa-map-marker-alt"></i>
               {{ $t('event.map') }}
            </a>
          </div>
          <div v-if="event.event_link.url" class="event-link">
            <a
              :href="event.event_link.url"
              :title="event.name[0].text"
              target="_blank"
              data-track=""
              data-track-category="events"
              data-track-action="click"
              :data-track-label="`${event.name[0].text} Information`"
            >
              <i class="fas fa-info"></i>
                {{ $t('event.info') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      event: {
        type: Object,
        require: true,
        default: () => ({})
      },
      index: {
        type: Number,
        require: true,
        default: 0
      }
    },
    data() {
      return {
        today: new Date()
      }
    },
    computed: {
      isOdd() {
        if (this.index % 2 === 1) {
          return 'flex-row-reverse';
        }
        return '';
      }
    }
  }
</script>
