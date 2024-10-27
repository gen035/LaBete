<template>
  <li
    v-if="events.length > 0"
    :class="`menu`"
    @click="toggle"
  >
    <div
      role="button"
      :aria-label="`Expand - ${year}`"
      class="link"
      data-track=""
      data-track-category="events-previous"
      data-track-action="click"
      :data-track-label="`Previous ${year}`"
    >
      {{ year }}
      <i class="fa fa-chevron-down"></i>
    </div>
    <ul class="submenu">
      <li
        v-for="(event, index) in events"
        :key="index"
      >
        {{ event.name }} <span v-if="event.city">({{event.city}})</span>
      </li>
    </ul>
  </li>
</template>
<script>
  export default {
    props: {
      year: {
        type: String,
        require: true,
        default: '0'
      },
      events: {
        type: Array,
        require: true,
        default: () => ({})
      }
    },
    methods: {
      toggle(e) {
        e.currentTarget.classList.toggle('open')
      }
    }
  }
</script>