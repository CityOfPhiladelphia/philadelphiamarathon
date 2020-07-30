<template>
  <div>
    <div v-if="mapType === 'leaflet'">
      <div class="leaflet-bar easy-button-container twin-button">
        <button @click="handleHalfButtonClick"
                :class="ifHalfActive"
        >
          <span class="button-state state-unnamed-state unnamed-state-active">
            <img class="button-image" :src="'./images/half.png'">
            <!-- <img class="button-image" :src="'../src/assets/half.png'"> -->
          </span>
        </button>
      </div>
      <div class="leaflet-bar easy-button-container twin-button">
        <button @click="handleFullButtonClick"
                :class="ifFullActive"
        >
          <span class="button-state state-unnamed-state unnamed-state-active">
            <img class="button-image" :src="'./images/full.png'">
          </span>
        </button>
      </div>
    </div>

    <div v-if="mapType === 'mapbox'">
        <MglButtonControl
          :buttonId="'buttonId-03'"
          :buttonText="'HALF'"
          :buttonClass="'twin-button ' + ifHalfActive"
          @click="handleHalfButtonClick"
        />
        <MglButtonControl
          :buttonId="'buttonId-04'"
          :buttonText="'FULL'"
          :buttonClass="'twin-button ' + ifFullActive"
          @click="handleFullButtonClick"
        />

    </div>
  </div>
</template>

<script>

  import Control from '@phila/vue-mapping/src/leaflet/Control.vue';
  import MglButtonControl from '@phila/vue-mapping/src/mapbox/UI/controls/ButtonControl.vue';
  import MglControlContainer from '@phila/vue-mapping/src/mapbox/UI/controls/ControlContainer.vue';

  const {props, methods} = Control;
  export default {
    components: {
      MglButtonControl,
      MglControlContainer,
    },
    props: [
      'position',
    ],
    data() {
      const data = {
        // this will only affect the app size if the app is set to "plugin" mode
        // mbRootStyle: {
        //   'height': '100px',
        // },
        // mapToggleInitialActivation: null,
        // imageryToggleInitialActivation: null,
        activeVersion: 'full',
        // activeTiledOverlays: [],
      };
      return data;
    },
    computed: {
      mapType() {
        return this.$store.state.map.type;
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
      handleHalfButtonClick() {
        // console.log('handleHalfButtonClick is running, this:', this);
        this.activeVersion = 'half';
        this.$emit('active-overlay-change', 'halfMarathon');
      },
      handleFullButtonClick() {
        // console.log('handleFullButtonClick is running, this:', this);
        this.activeVersion = 'full';
        this.$emit('active-overlay-change', 'fullMarathon');
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
