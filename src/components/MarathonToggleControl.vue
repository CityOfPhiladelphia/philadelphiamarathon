<template>
  <div class="leaflet-bar easy-button-container leaflet-control">
    <button @click="handleMarathonToggleButtonClick">
      <span class="button-state state-unnamed-state unnamed-state-active">
        <img class="button-image" :src="toggleButtonImgSrc">
      </span>
    </button>
  </div>
</template>

<script>
  import Control from '../leaflet/Control.vue';

  const {props, methods} = Control;

  export default {
    props: [
      'position'
    ],
    computed: {
      toggleButtonImgSrc() {
        const shouldShowFullMarathon = this.$store.state.map.shouldShowFullMarathon;
        let src;
        if (shouldShowFullMarathon) {
          src = "../../src/assets/half.png"
        }
        else {
          src = "../../src/assets/full.png"
        }
        return src;
      },
    },
    methods: Object.assign(methods, {
      handleMarathonToggleButtonClick(e) {
        const prevShouldShowFullMarathon = this.$store.state.map.shouldShowFullMarathon;
        const nextShouldShowFullMarathon = !prevShouldShowFullMarathon;
        this.$store.commit('setShouldShowFullMarathon', nextShouldShowFullMarathon);
      },
    })
  };
</script>

<style scoped>
  .button-image {
    vertical-align: top;
  }
</style>
