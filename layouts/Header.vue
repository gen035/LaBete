<template>
  <div>
    <div class="top-bar">
      <div class="top-bar-shipping">
        {{$t('top.shipping')}}
      </div>
      <ul class="top-bar-list d-none d-md-inline-block d-lg-inline-block">
        <li>
          <NuxtLink
            :to="localePath('contact')"
          >
            <i class="fa fa-comment" aria-hidden="true" :aria-label="$t('top.contact.text')"></i>
            {{ $t('top.contact.text') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="switchLocalePath('fr')">Français</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
        </li>
      </ul>
    </div>
    <header class="header container">
      <div class="row align-items-center">
        <div class="col-6 col-md-12 col-lg-3 header-logo-wrapper">
          <a href="/" title="La Bete" data-track="" data-track-category="nav" data-track-action="click" data-track-label="Logo">
            <Media
              classes="header-logo"
              :image="mainStore.settings && mainStore.settings.header_logo"
              :lazy="false"
            />
          </a>
        </div>
        <div class="col-lg-9 col-md-12 header-nav-wrapper">
          <ul role="menubar" class="header-nav">
            <li
              role="menuitem"
              v-for="(link, index) in nav"
              :key="index"
            >
              <NuxtLink
                :to="localePath(link.name)"
                active-class="active"
                exact
              >
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
          <span :aria-label="$t('header.cart')" @click="cartStore.setCartOpened(true)" style="cursor:pointer">
            <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
            <span :class="cartStore.getCartProductsCount > 0 ? 'hasProducts' : ''"></span>
          </span>
        </div>
        <div class="col-4 header-nav-mobile-trigger d-md-none" @click="toggleMobileNav">
          <span>Menu<i class="fa fa-chevron-down"></i></span>
        </div>
        <div :aria-label="$t('header.cart')" class="col-2 header-nav-mobile-cart d-md-none" @click="cartStore.setCartOpened(true)" style="cursor:pointer">
          <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
          <span :class="cartStore.getCartProductsCount > 0 ? 'hasProducts' : ''"></span>
        </div>
      </div>
    </header>
    <div v-if="promo" class="promotion">{{promo}}</div>
  </div>
</template>
<script>
  export default {
    setup() {
      const { locale } = useI18n()
      const mainStore = useMainStore()
      const cartStore = useCartStore()
      return { locale, mainStore, cartStore }
    },
    computed: {
      promo() {
        return this.mainStore.settings && this.mainStore.settings.promo;
      },
    },
    data() {
      return {
        nav: [],
      }
    },
    created() {
      this.getNavLinks();
    },
    watch: {
      locale() {
        this.getNavLinks();
      }
    },
    methods: {
      toggleMobileNav() {
        const { body } = document;
        body.classList.toggle('is-nav-opened');
      },
      getNavLinks() {
        const links = this.$t('nav.links');
        this.nav = [];

        links.forEach((item) => {
          this.nav.push(item);
        });
      },
      openModal() {
        this.mainStore.setMessageOpened(true);
      }
    }
  }
</script>
