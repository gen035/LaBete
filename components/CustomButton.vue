<template>
  <button :arial-label="aria" :class="['button', {'button--disabled' : (this.disabled)}, `button--${size}`]" v-on:click="click">
    <p class="button-text">
      {{this.text}}
    </p>
    <div class="button-icon-container">
      <p :class="['button-icon fas', this.icon]"></p>
    </div>
  </button>
</template>
<script>
export default {
  props: {
    aria: {
      type: String,
      require: false
    },
    text: {
      type: String,
      require: false
    },
    url: {
      type: String,
      require: false,
    },
    target: {
      type: String,
      require: false,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      require: true,
      default: 'fa-shopping-cart'
    },
    size: {
      type: String,
      require: false,
      default: ''
    }
  },
  methods: {
    click() {
      if(!this.url)  {
        return;
      }

      window.open(this.url, this.target);
    }
  }
}
</script>
