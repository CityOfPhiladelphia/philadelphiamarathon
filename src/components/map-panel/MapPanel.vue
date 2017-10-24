<template>
  <div id="map-container" :class="'large-'+this.columns+' columns mb-panel mb-panel-map'">
    <map_
          :center="this.$store.state.map.center"
          :zoom="this.$store.state.map.zoom"
          @l-moveend="handleMapMove"
          zoom-control-position="bottomright"
          :min-zoom="this.$config.map.minZoom"
          :max-zoom="this.$config.map.maxZoom"
    >

      <!-- basemaps -->
      <esri-tiled-map-layer v-for="(basemap, key) in this.$config.map.basemaps"
                            v-if="activeBasemap === key"
                            :key="key"
                            :url="basemap.url"
                            :max-zoom="basemap.maxZoom"
                            :attribution="basemap.attribution"
      />

      <!-- basemap labels and parcels outlines -->
      <esri-tiled-map-layer v-for="(tiledLayer, key) in this.$config.map.tiledLayers"
                            v-if="tiledLayers.includes(key)"
                            :key="key"
                            :url="tiledLayer.url"
                            :zIndex="tiledLayer.zIndex"
                            :attribution="tiledLayer.attribution"
      />

      <!-- vector markers -->
      <vector-marker v-for="(marker, index) in markers"
                     :latlng="marker.latlng"
                     :key="marker.key"
      />

      <!-- marker using a png and ablility to rotate it -->
      <png-marker v-if="this.cyclomediaActive"
                  :icon="'../../src/assets/camera.png'"
      />

      <!-- marker using custom code extending icons - https://github.com/iatkin/leaflet-svgicon -->
      <svg-marker v-if="this.cyclomediaActive" />

       <!-- location marker -->
       <circle-marker v-if="this.$store.state.map.location.lat != null"
                      :latlng="this.locationMarker.latlng"
                      :radius="this.locationMarker.radius"
                      :fillColor="this.locationMarker.fillColor"
                      :color="this.locationMarker.color"
                      :weight="this.locationMarker.weight"
                      :opacity="this.locationMarker.opacity"
                      :fillOpacity="this.locationMarker.fillOpacity"
                      :key="Math.random()"
       />

      <!-- CONTROLS: -->
      <div v-once>
        <marathon-toggle-control v-once
                                 :position="'topright'"
        />
      </div>

      <div v-once>
        <basemap-toggle-control v-if="shouldShowImageryToggle"
                                v-once
                                :position="'topright'"
        />
      </div>

      <div v-once>
        <location-control v-once
                          v-if="this.geolocationEnabled"
                          :position="'bottomright'"
        />
      </div>

      <!-- <div v-once> -->
        <!-- <cyclomedia-button v-if="this.$config.cyclomedia.enabled" -->
        <!-- <cyclomedia-button v-if="this.cyclomediaEnabled" -->
      <cyclomedia-button v-show="this.cyclomediaEnabled"
                         :position="'topright'"
                         :link="'cyclomedia'"
                         :imgSrc="'../../src/assets/cyclomedia.png'"
                         @click="handleCyclomediaButtonClick"
      />
        <!-- v-once -->
      <!-- </div> -->


      <!-- search control -->
      <div v-once>
        <control position="topleft">
          <div class="mb-search-control-container">
            <form @submit.prevent="handleSearchFormSubmit">
                <input class="mb-search-control-input"
                       placeholder="Search the map"
                       :value="this.$config.defaultAddress"
                />
                <button class="mb-search-control-button">
                  <i class="fa fa-search fa-lg"></i>
                </button>
            </form>
          </div>
        </control>
      </div>

      <cyclomedia-recording-circle v-for="recording in cyclomediaRecordings"
                                   v-if="cyclomediaActive"
                                   :key="recording.imageId"
                                   :imageId="recording.imageId"
                                   :latlng="[recording.lat, recording.lng]"
                                   :size="1.2"
                                   :color="'#3388ff'"
                                   :weight="1"
                                   @l-click="handleCyclomediaRecordingClick"
      />

    </map_>
    <slot class='widget-slot' name="cycloWidget" />
  </div>
</template>

<script>
  // mixins
  import markersMixin from './markers-mixin';
  import cyclomediaMixin from '../../cyclomedia/map-panel-mixin';
  // vue doesn't like it when you import this as Map (reserved-ish word)
  import Map_ from '../../leaflet/Map.vue';
  import Control from '../../leaflet/Control.vue';
  import EsriWebMap from '../../esri-leaflet/WebMap.vue';
  import EsriWebMapLayer from '../../esri-leaflet/WebMapLayer.vue';
  import EsriTiledMapLayer from '../../esri-leaflet/TiledMapLayer.vue';
  import EsriDynamicMapLayer from '../../esri-leaflet/DynamicMapLayer.vue';
  import EsriFeatureLayer from '../../esri-leaflet/FeatureLayer.vue';
  import Geojson from '../../leaflet/Geojson.vue';
  import CircleMarker from '../../leaflet/CircleMarker.vue';
  import VectorMarker from '../VectorMarker.vue';
  import PngMarker from '../PngMarker.vue';
  import SvgMarker from '../SvgMarker.vue';
  import BasemapToggleControl from '../BasemapToggleControl.vue';
  import MarathonToggleControl from '../MarathonToggleControl.vue';
  import CyclomediaButton from '../../cyclomedia/Button.vue';
  import CyclomediaRecordingCircle from '../../cyclomedia/RecordingCircle.vue';
  import CyclomediaRecordingsClient from '../../cyclomedia/recordings-client';
  import LocationControl from '../LocationControl.vue';
  import ControlCorner from '../../leaflet/ControlCorner.vue';

  export default {
    mixins: [
      markersMixin,
      cyclomediaMixin,
    ],
    components: {
      Map_,
      Control,
      EsriWebMap,
      EsriWebMapLayer,
      EsriTiledMapLayer,
      EsriDynamicMapLayer,
      EsriFeatureLayer,
      Geojson,
      CircleMarker,
      VectorMarker,
      PngMarker,
      SvgMarker,
      BasemapToggleControl,
      MarathonToggleControl,
      CyclomediaButton,
      CyclomediaRecordingCircle,
      LocationControl,
      ControlCorner,
    },
    created() {
      // create cyclomedia recordings client
      this.$cyclomediaRecordingsClient = new CyclomediaRecordingsClient(
        this.$config.cyclomedia.recordingsUrl,
        this.$config.cyclomedia.username,
        this.$config.cyclomedia.password,
        4326
      );
    },
    computed: {
      columns() {
        if (this.cyclomediaActive) {
          return 12;
        } else {
          return 24;
        }
      },
      geolocationEnabled() {
        return this.$config.geolocation.enabled;
      },
      activeBasemap() {
        const shouldShowImagery = this.$store.state.map.shouldShowImagery;
        if (shouldShowImagery) {
          return this.$store.state.map.imagery;
        }
        const defaultBasemap = this.$config.map.defaultBasemap;
        const basemap = this.$store.state.map.basemap || defaultBasemap;
        return basemap;
      },
      tiledLayers() {
        let layers = []
        const activeBasemap = this.activeBasemap;
        const activeBasemapConfig = this.configForBasemap(activeBasemap)
        // console.log('activeBasemapConfig', activeBasemapConfig);
        const basemapTiledLayers = activeBasemapConfig.tiledLayers;
        for (let basemapTiledLayer of basemapTiledLayers) {
          layers.push(basemapTiledLayer);
        };
        const marathonVersion = this.$store.state.marathonVersion;
        if (marathonVersion === 'full') {
          layers.push('fullMarathon');
        } else {
          layers.push('halfMarathon');
        }
        return layers;
      },
      basemaps() {
        return Object.values(this.$config.map.basemaps);
      },
      imageryBasemaps() {
        return this.basemaps.filter(basemap => basemap.type === 'imagery');
      },
      hasImageryBasemaps() {
        return this.imageryBasemaps.length > 0;
      },
      shouldShowImageryToggle() {
        return this.hasImageryBasemaps && this.$config.map.imagery.enabled;
      },
      geocodeResult() {
        return this.$store.state.geocode.data || {};
      },
      geocodeGeom() {
        return this.geocodeResult.geometry;
      },
      streetAddress() {
        return this.geocodeResult.properties.street_address;
      },
      cyclomediaEnabled() {
        return this.$store.state.cyclomedia.enabled;
      },
      // cyclomediaActive() {
      //   return this.$store.state.cyclomedia.active;
      // },
      isGeocoding() {
        return this.$store.state.geocode.status === 'waiting';
      }
    },
    watch: {
      cyclomediaActive(value) {
        this.$nextTick(() => {
          this.$store.state.map.map.invalidateSize();
        })
      }
    },
    methods: {
      configForBasemap(basemap) {
        return this.$config.map.basemaps[basemap] || {};
      },
      handleMapMove(e) {
        const map = this.$store.state.map.map;

        // const cyclomediaConfig = this.$config.cyclomedia || {};

        // if (cyclomediaConfig.enabled) {
        if (this.cyclomediaEnabled) {
          // update cyclo recordings
          this.updateCyclomediaRecordings();
        }
      },
      handleSearchFormSubmit(e) {
        this.$controller.handleSearchFormSubmit(e);
      },
    }, // end of methods
  }; //end of export
</script>

<style scoped>
  .mb-panel-map {
    /*this allows the loading mask to fill the div*/
    position: relative;
  }

  .mb-search-control-container {
    height: 48px;
    border-radius: 2px;
  }

  .mb-search-control-button {
    width: 50px;
    background: #ccc;
    line-height: 48px;
  }

  .mb-search-control-input {
    box-shadow:0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02);
    border: 0;
    height: 48px !important;
    line-height: 48px;
    padding: 10px;
    padding-left: 15px;
    padding-right: 15px;
    font-family: 'Montserrat', 'Tahoma', sans-serif;
    font-size: 16px;
    width: 400px;
  }

  .mb-map-with-widget {
    height: 50%;
  }

  .widget-slot {
    display: inline-block;
    float: left;
  }

  .mb-map-loading-mask {
    /*display: inline;*/
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0 ,0 , 0.25);
    z-index: 1000;
    text-align: center;
    vertical-align: middle;
  }

  .mb-map-loading-mask-inner {
    position: absolute;
    top: 40%;
    left: 40%;
  }

  /*make search box smaller for tablets*/
  @media screen and (max-width: 640px) {
    .mb-search-control-input {
      width: 200px;
    }
  }
</style>
