<template>
  <div :class="$route.name">
    <Header />
    <nuxt />
    <MobileNav />
    <NewsletterModal />
    <MessageModal />
    <Footer />
  </div>
</template>
<script>
  import Footer from './Footer';
  import Header from './Header';
  import MobileNav from './MobileNav';
  import NewsletterModal from './../components/NewsletterModal';
  import MessageModal from './../components/MessageModal';
  export default {
    middleware: ['settings', 'newsletter', 'message'],
    components: {
      Footer,
      Header,
      MobileNav,
      NewsletterModal,
      MessageModal
    }
  }
</script>
