<template>
  <div id="newsletter">
    <div class="newsletter-title">{{ $t('newsletter.title') }}</div>
    <form action="https://app.cyberimpact.com/optin" method="post" accept-charset="utf-8" target="_blank">
      <fieldset>
        <legend></legend>
          <div class="newsletter-wrapper">
            <label for="ci_email" class="sr-only">Email</label>
            <input type="text" id="ci_email" name="ci_email" class="ci_email_footer" :placeholder="$t('newsletter.placeholder')" maxlength="255" v-model="email" />
            <button type="submit" :aria-label="$t('newsletter.submit')" value="Send" id="ci_submit" :class="{isDisabled : disabled}"><i class="fa fa-arrow-right"></i></button>
        </div>
        <div style="display:block; visibility:hidden; height:1px;">
        <input style="display:none;" type="text" id="ci_verification" name="ci_verification" />
        <input type="hidden" id="ci_groups" name="ci_groups" value="6" />
        <input type="hidden" id="ci_account" name="ci_account" value="910db7f6-7751-4942-41d3-c59a8ef52f8f" />
        <input type="hidden" id="ci_language" name="ci_language" :value="`${locale}_ca`" />
        <input type="hidden" id="ci_sent_url" name="ci_sent_url" value="" />
        <input type="hidden" id="ci_error_url" name="ci_error_url" value="" />
        <input type="hidden" id="ci_confirm_url" name="ci_confirm_url" value="" />
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
  export default {
    props: {
      isModal: {
        type: Boolean,
        require: false,
        default: false
      }
    },
    computed: {
      locale() {
        return this.$store.state.i18n.locale;
      }
    },
    data() {
      return {
        disabled: true,
        email: ''
      };
    },
    methods: {
      closeModal() {
        this.$store.commit('SET_NEWSLETTER', false);

        if(this.isModal) {
          this.$cookies.set(
            'labete_newsletter',
            true,
            {
              maxAge: 365 * 24 * 60 * 60
            }
          );
        }
      }
    },
    watch: {
      email: {
        handler: function(newValue, oldValue) {
          const exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          this.disabled = !exp.test(newValue);
        }
      }
    }
  }
</script>