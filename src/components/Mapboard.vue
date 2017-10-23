<template>
  <div class="mb-root row collapse"
       id="mb-root"
       :style="this.$config.rootStyle"
  >
    <map-panel>
    </map-panel>
    <cyclomedia-widget v-if="this.$config.cyclomedia.enabled"
                       slot="cycloWidget"
                       v-show="cyclomediaActive"
    />
  </div>
</template>

<script>
  import TopicPanel from './TopicPanel.vue';
  import MapPanel from './map-panel/MapPanel.vue';
  import CyclomediaWidget from '../cyclomedia/Widget.vue';

  export default {
    components: {
      TopicPanel,
      MapPanel,
      CyclomediaWidget,
    },
    computed: {
      cyclomediaActive() {
        return this.$store.state.cyclomedia.active;
      },
    },
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
