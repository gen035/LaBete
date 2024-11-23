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
      required: false
    },
    text: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false,
    },
    target: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      required: true,
      default: 'fa-shopping-cart'
    },
    size: {
      type: String,
      required: false,
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
