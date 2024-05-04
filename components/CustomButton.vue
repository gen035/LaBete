<template>
  <button :class="['button', {'button--disabled' : (this.disabled)}]">
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
    text: {
      type: String,
      require: false
    },
    url: {
      type: String,
      require: false,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      default: '_self',
    },
    icon: {
      type: String,
      require: true,
      default: 'fa-shopping-cart'
    }
  }
}
</script>
