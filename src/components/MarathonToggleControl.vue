<template>
  <div>
    <div class="leaflet-bar easy-button-container twin-button">
      <button @click="handleHalfButtonClick"
              :class="this.ifHalfActive"
      >
        <span class="button-state state-unnamed-state unnamed-state-active">
          <img class="button-image" :src="'../../src/assets/half.png'">
        </span>
      </button>
    </div>
    <div class="leaflet-bar easy-button-container twin-button">
      <button @click="handleFullButtonClick"
              :class="this.ifFullActive"
      >
        <span class="button-state state-unnamed-state unnamed-state-active">
          <img class="button-image" :src="'../../src/assets/full.png'">
        </span>
      </button>
    </div>
  </div>
</template>

<script>
  import Control from '../leaflet/Control.vue';


  const {props, methods} = Control;

  export default {
    props: [
      'position',
    ],
    computed: {
      activeVersion() {
        return this.$store.state.marathonVersion;
      },
      ifHalfActive() {
        let isActive;
        if (this.activeVersion === 'half') {
          isActive = 'active'
        } else {
          isActive = 'inactive'
        }
        return isActive;
      },
      ifFullActive() {
        let isActive;
        if (this.activeVersion === 'full') {
          isActive = 'active'
        } else {
          isActive = 'inactive'
        }
        return isActive;
      },
    },
    methods: Object.assign(methods, {
      handleHalfButtonClick(e) {
        this.$controller.handleHalfButtonClick();
        // if (this.isActive) {
        //   return;
        // } else {
        //   this.$store.commit('setMarathonVersion', 'half');
        // }
      },
      handleFullButtonClick(e) {
        this.$controller.handleFullButtonClick();
        // if (this.isActive) {
        //   return;
        // } else {
        //   this.$store.commit('setMarathonVersion', 'full');
        // }
      },
    })
  };
</script>

<style scoped>

  .button-image {
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
  .twin-button {
    display: inline-block;
  }

</style>
