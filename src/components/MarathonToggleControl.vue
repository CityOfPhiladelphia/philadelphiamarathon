<template>
  <div class="leaflet-bar easy-button-container leaflet-control">
    <button @click="handleButtonClick"
            :class="this.ifActive"
    >
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
      'position',
      'fullOrHalf'
    ],
    computed: {
      isActive() {
        const currentVersion = this.$store.state.marathonVersion;
        const buttonVersion = this.$props.fullOrHalf;
        return currentVersion === buttonVersion;
      },
      ifActive() {
        if (this.isActive) {
          return 'active';
        }
      },
      toggleButtonImgSrc() {
        let src;
        if (this.$props.fullOrHalf === 'half') {
          src = "../../src/assets/half.png"
        } else {
          src = "../../src/assets/full.png"
        }
        return src;
      },

    },
    methods: Object.assign(methods, {
      handleButtonClick(e) {
        if (this.isActive) {
          return;
        } else {
          this.$store.commit('setMarathonVersion', this.$props.fullOrHalf);
        }
        // const currentVersion = this.currentVersion
        // const prevShouldShowFullMarathon = this.$store.state.map.shouldShowFullMarathon;
        // const nextShouldShowFullMarathon = !prevShouldShowFullMarathon;
      },
    })
  };
</script>

<style scoped>

  .button-image {
    vertical-align: top;
  }

  .inactive {
    background-color: #ffffff;
  }
  .inactive:hover {
    background-color: #ffffff;
  }
  .active {
    background-color: rgb(243, 198, 19);
  }
  .active:hover {
    background-color: rgb(243, 198, 19);
  }

</style>
