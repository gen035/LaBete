<template>
  <div class="col-md-4 my-2">
    <div class="glossary-card py-2 px-3">
      <figure>
        <img src="https://placehold.co/600x400/EEE/31343C" />
      </figure>
      <div class="glossary-card-body">
        <h2>Title</h2>
        <p>
          Bacon ipsum dolor amet landjaeger venison flank andouille cupim chislic meatball fatback shankle tongue buffalo ham leberkas jowl. Chicken burgdoggen cow porchetta short ribs short loin tenderloin turkey pastrami. 
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  import Media from '~/components/Media';
  export default {
    props: {
      data: {
        type: Object,
        required: true,
        default: () => ({})
      }
    },
    components: {
      Media
    }
  }
</script>
