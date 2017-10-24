<template>
  <div class="mb-root row collapse"
       id="mb-root"
       :style="this.$config.rootStyle"
  >
    <map-panel>
    </map-panel>
    <!-- <cyclomedia-widget v-if="this.$config.cyclomedia.enabled" -->
    <cyclomedia-widget v-if="this.cyclomediaEnabled"
                       slot="cycloWidget"
                       v-show="cyclomediaActive"
    />
  </div>
</template>

<script>
  // import TopicPanel from './TopicPanel.vue';
  import MapPanel from './map-panel/MapPanel.vue';
  import CyclomediaWidget from '../cyclomedia/Widget.vue';

  export default {
    components: {
      // TopicPanel,
      MapPanel,
      CyclomediaWidget,
    },
    mounted() {
      this.$store.commit('setCyclomediaEnabled', this.$config.cyclomedia.enabled);
      window.addEventListener('resize', this.handleWindowResize);
    },
    computed: {
      cyclomediaEnabled() {
        return this.$store.state.cyclomedia.enabled;
      },
      cyclomediaActive() {
        return this.$store.state.cyclomedia.active;
      },
    },
    methods: {
      handleWindowResize() {
        const width = $(window).width()
        alert('handleWindowResize is running, width:', $(window).width());
        if (!this.cyclomediaEnabled) {
          if (width > 640) {
            this.$store.commit('setCyclomediaEnabled', true);
          }
        }
      },
    }
  };
</script>

<style>
  /*don't highlight any form elements*/
  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  .mb-panel {
    height: 100%;
  }

</style>
