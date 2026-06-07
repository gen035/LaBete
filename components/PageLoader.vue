<template>
  <Transition name="page-loader">
    <div v-if="isLoading" class="page-loader">
      <div class="page-loader__diamond" />
    </div>
  </Transition>
</template>

<script setup>
const isLoading = ref(false)
let hideTimer = null

const router = useRouter()

router.beforeEach(() => {
  clearTimeout(hideTimer)
  isLoading.value = true
})

router.afterEach(() => {
  hideTimer = setTimeout(() => {
    isLoading.value = false
  }, 400)
})
</script>
