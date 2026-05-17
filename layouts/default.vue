<template>
  <div :class="$route.name">
    <Header />
    <Cart />
    <Notification />
    <slot />
    <MobileNav />
    <NewsletterModal />
    <CookieModal />
    <CookiePreferencesModal />
    <MessageModal />
    <Footer />
  </div>
</template>
<script>
  export default {}
</script>
