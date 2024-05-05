<template>
  <ul class="mobile-nav d-md-none">
    <li
      v-for="(link, index) in  nav"
      :key="index"
    >
      <NuxtLink
        @click.native="toggleMobileNav"
        :to="localePath(link.name)"
        exact
      >
        {{ link.text }}
      </NuxtLink>
    </li>
    <li>
      <NuxtLink
        @click.native="toggleMobileNav"
        :to="localePath('contact')"
        exact
      >
        Contact
      </NuxtLink>
    </li>
    <li>
      <Nuxt-link :to="switchLocalePath('fr')">Français</Nuxt-link>
    </li>
    <li>
      <Nuxt-link :to="switchLocalePath('en')">English</Nuxt-link>
    </li>
  </ul>
</template>
<script>
  export default {
    data() {
      return {
        nav: []
      }
    },
    created() {
      const links = this.$t('nav.links');

      links.map((item) => {
        this.nav.push(item);
      });
    },
    mounted() {
      window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      toggleMobileNav() {
        const { body } = document;
        body.classList.toggle('is-nav-opened');
      },
      handleResize() {
        const { body } = document;
        if (window.innerWidth > 768) {
          body.classList.remove('is-nav-opened');
        }
      }
    }
  }
</script>
