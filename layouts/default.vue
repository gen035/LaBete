<template>
  <div :class="$route.name">
    <Header />
    <Cart />
    <Notification />
    <nuxt />
    <MobileNav />
    <NewsletterModal />
    <MessageModal />
    <Footer />
  </div>
</template>
<script>
  import Cart from './../components/Cart';
  import Footer from './Footer';
  import Header from './Header';
  import MobileNav from './MobileNav';
  import NewsletterModal from './../components/NewsletterModal';
  import Notification from './Notification';
  import MessageModal from './../components/MessageModal';
  export default {
    middleware: ['settings', 'newsletter', 'message'],
    components: {
      Cart,
      Footer,
      Header,
      MobileNav,
      NewsletterModal,
      Notification,
      MessageModal
    }
  }
</script>
