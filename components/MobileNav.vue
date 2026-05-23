<template>
  <ul role="menu" class="mobile-nav d-md-none">
    <li
      role="menuitem"
      v-for="(link, index) in nav"
      :key="index"
    >
      <NuxtLink
        @click="toggleMobileNav"
        :to="localePath(link.name)"
        exact
      >
        {{ link.text }}
      </NuxtLink>
    </li>
    <li role="menuitem">
      <NuxtLink
        @click="toggleMobileNav"
        :to="localePath('contact')"
        exact
      >
        Contact
      </NuxtLink>
    </li>
    <li role="menuitem">
      <NuxtLink :to="switchLocalePath('fr')">Français</NuxtLink>
    </li>
    <li role="menuitem">
      <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
    </li>
  </ul>
</template>
<script>
  export default {
    setup() {
      const localePath = useLocalePath()
      const switchLocalePath = useSwitchLocalePath()
      return { localePath, switchLocalePath }
    },
    computed: {
      nav() {
        const links = this.$tm('nav.links');
        if (!Array.isArray(links)) return [];
        return links.map(link => ({
          name: this.$rt(link.name),
          text: this.$rt(link.text),
          path: this.$rt(link.path),
        }));
      },
    },
    mounted() {
      window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
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
