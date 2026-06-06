<template></template>

<script setup>
import GLightbox from 'glightbox'

const props = defineProps({
  images: { type: Array, required: true },
  index: { type: Number, default: null },
})

const emit = defineEmits(['close'])

let lightbox = null

const openAt = (idx) => {
  if (lightbox) lightbox.destroy()
  lightbox = GLightbox({
    elements: props.images.map(img => ({
      href: img.url,
      type: 'image',
      title: img.title || '',
    })),
    startAt: idx,
    loop: true,
  })
  lightbox.on('close', () => emit('close'))
  lightbox.open()
}

watch(() => props.index, (idx) => {
  if (idx !== null && idx !== undefined) {
    openAt(idx)
  }
})

onUnmounted(() => {
  if (lightbox) lightbox.destroy()
})
</script>
