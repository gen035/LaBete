<template>
  <div :class="$route.name">
    <Header />
    <Cart />
    <Notification />
    <nuxt />
    <MobileNav />
    <NewsletterModal />
    <CookieModal />
    <CookiePreferencesModal />
    <MessageModal />
    <Footer />
  </div>
</template>
<script>
  import Cart from './../components/Cart';
  import CookieModal from './../components/CookieModal';
  import CookiePreferencesModal from './../components/CookiePreferencesModal';
  import Footer from './Footer';
  import Header from './Header';
  import MobileNav from './MobileNav';
  import NewsletterModal from './../components/NewsletterModal';
  import Notification from './Notification';
  import MessageModal from './../components/MessageModal';
  export default {
    middleware: ['attributes', 'categories', 'settings', 'newsletter', 'message'],
    components: {
      Cart,
      CookieModal,
      CookiePreferencesModal,
      Footer,
      Header,
      MobileNav,
      NewsletterModal,
      Notification,
      MessageModal
    }
  }
</script>
