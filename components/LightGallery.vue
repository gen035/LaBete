<template></template>

<script setup>
const props = defineProps({
  images: { type: Array, required: true },
  index: { type: Number, default: null },
})

const emit = defineEmits(['close'])

let lightbox = null

const openAt = async (idx) => {
  const { default: GLightbox } = await import('glightbox')
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

watch(() => props.index, async (idx) => {
  if (idx !== null && idx !== undefined) {
    openAt(idx)
  }
})

onUnmounted(() => {
  if (lightbox) lightbox.destroy()
})
</script>
