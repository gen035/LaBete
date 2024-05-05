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
            <i class="fa fa-comment" aria-hidden="true"></i>
            {{ $t('top.contact.text') }}
          </NuxtLink>
        </li>
        <li>
          <Nuxt-link :to="switchLocalePath('fr')">Français</Nuxt-link>
        </li>
        <li>
          <Nuxt-link :to="switchLocalePath('en')">English</Nuxt-link>
        </li>
      </ul>
    </div>
    <header class="header container">
      <div class="row align-items-center">
        <div class="col-6 col-md-12 col-lg-3 header-logo-wrapper">
          <a href="/" title="La Bete" data-track="" data-track-category="nav" data-track-action="click" data-track-label="Logo">
            <Media
              classes="header-logo"
              :image="this.$store.state.settings.header_logo"
            />
          </a>
        </div>
        <div class="col-lg-9 col-md-12 header-nav-wrapper">
          <ul class="header-nav">
             <li
                v-for="(link, index) in  nav"
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
              <li v-b-toggle.sidebar-cart><i class="fa fa-shopping-bag" aria-hidden="true"></i><span :class="this.cartHasItems ? 'hasProducts' : ''"></span></li>
          </ul>
        </div>
        <div class="col-4 header-nav-mobile-trigger d-md-none" @click="toggleMobileNav">
          <span>Menu<i class="fa fa-chevron-down"></i></span>
        </div>
        <div class="col-2 header-nav-mobile-cart d-md-none" v-b-toggle.sidebar-cart>
          <i class="fa fa-shopping-bag" aria-hidden="true"></i>
          <span :class="this.cartHasItems ? 'hasProducts' : ''"></span>
        </div>
      </div>
    </header>
    <div v-if="promo" class="promotion">{{promo}}</div>
  </div>
</template>
<script>
  import Media from '~/components/Media';
  import { mapGetters } from 'vuex';

  export default {
    computed: {
      locale() {
        return this.$store.state.i18n.locale;
      },
      cartHasItems() {
        return this.$store.state.cart && this.$store.state.cart.items && this.$store.state.cart.items.length > 0;
      },
      promo() {
        return this.$store.state.settings.promo;
      }
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

        links.map((item) => {
          this.nav.push(item);
        });
      },
      openModal() {
        this.$store.commit('SET_MESSAGE', true);
      }
    },
    components: {
      Media
    }
  }
</script>
