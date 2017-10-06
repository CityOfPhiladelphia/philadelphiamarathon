<template>
  <div id="map-container" class="large-12 columns mb-panel mb-panel-map">
    <map_
          :center="this.$store.state.map.center"
          :zoom="this.$store.state.map.zoom"
          @l-moveend="handleMapMove"
          zoom-control-position="bottomright"
          :min-zoom="this.$config.map.minZoom"
          :max-zoom="this.$config.map.maxZoom"
    >

      <!-- webmap -->
      <!-- <esri-web-map>
        <esri-web-map-layer v-for="(layer, key) in this.wmLayers"
                            v-if="shouldShowFeatureLayer(layer)"
                            :key="key"
                            :layer="layer.layer"
                            :layerName="layer.title"
                            :layerDefinition="layer.rest.layerDefinition"
                            :opacity="layer.opacity"
                            :type="layer.type2"
        />
      </esri-web-map> -->

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

      <!-- <esri-dynamic-map-layer v-for="(dynamicLayer, key) in this.$config.map.dynamicMapLayers"
                              v-if="activeDynamicMaps.includes(key)"
                              :key="key"
                              :url="dynamicLayer.url"
                              :attribution="dynamicLayer.attribution"
                              :transparent="true"
                              :opacity="dynamicLayer.opacity"
      /> -->

      <!-- dorParcels, pwdParcels, vacantLand, vacantBuilding -->
      <!-- v-if="shouldShowFeatureLayer(key, featureLayer.minZoom)" -->
      <esri-feature-layer v-for="(featureLayer, key) in this.$config.map.featureLayers"
                          :key="key"
                          :layerName="key"
                          :url="featureLayer.url"
                          :color="featureLayer.color"
                          :fillColor="featureLayer.color"
                          :fillOpacity="featureLayer.fillOpacity"
                          :weight="featureLayer.weight"
                          :pointLayer="featureLayer.pointLayer"
                          :minZoom="featureLayer.minZoom"
                          :maxZoom="featureLayer.maxZoom"
                          :opacity="featureLayer.opacity"
      />

      <!-- regmaps -->
      <!-- <esri-dynamic-map-layer v-for="(item, key) in this.imageOverlayItems"
                              v-if="shouldShowImageOverlay(item.properties.RECMAP)"
                              :key="key"
                              :url="'//gis.phila.gov/arcgis/rest/services/DOR_ParcelExplorer/rtt_basemap/MapServer/'"
                              :layers="[29]"
                              :layerDefs="'29:NAME=\'g' + item.properties.RECMAP.toLowerCase() + '.tif\''"
                              :transparent="true"
                              :opacity="0.5"
      /> -->
      <!-- :url="this.imageOverlayInfo.url"
      :opacity="this.imageOverlayInfo.opacity" -->

      <!-- address marker -->
      <!-- REVIEW why does this need a key? it's not a list... -->
      <!-- <vector-marker v-if="identifyFeature === 'address-marker' && geocodeGeom"
                    :latlng="[...geocodeGeom.coordinates].reverse()"
                    :key="streetAddress"
      /> -->

      <!-- NEW METHOD: try rendering markers generically based on marker type -->
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

      <!-- geojson features -->
      <!-- <geojson v-for="geojsonFeature in geojsonFeatures"
               v-if="shouldShowGeojson(geojsonFeature.key)"
               :geojson="geojsonFeature.geojson"
               :color="geojsonFeature.color"
               :weight="2"
               :key="geojsonFeature.key"
       /> -->

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

      <!-- <div v-once>
        <pictometry-button v-if="this.$config.pictometry.enabled"
                           v-once
                           :position="'topright'"
                           :link="'pictometry'"
                           :imgSrc="'../../src/assets/pictometry.png'"
        />
      </div> -->

      <!-- <div v-once>
        <cyclomedia-button v-if="this.$config.cyclomedia.enabled"
                           v-once
                           :position="'topright'"
                           :link="'cyclomedia'"
                           :imgSrc="'../../src/assets/cyclomedia.png'"
                           @click="handleCyclomediaButtonClick"
        />
      </div> -->

      <!-- search control -->
      <!-- custom components seem to have to be wrapped like this to work
           with v-once
      -->
      <div v-once>
        <control position="topleft">
          <div class="mb-search-control-container">
            <form @submit.prevent="handleSearchFormSubmit">
                <input class="mb-search-control-input"
                       placeholder="Search the map"
                       :value="this.$config.defaultAddress"
                />
                <!-- :style="{ background: !!this.$store.state.error ? '#ffcece' : '#fff'}" -->
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
    <!-- <slot class='widget-slot' name="pictWidget" /> -->
  </div>
</template>

<script>
  // mixins
  import markersMixin from './markers-mixin';
  import cyclomediaMixin from '../../cyclomedia/map-panel-mixin';
  import pictometryMixin from '../../pictometry/map-panel-mixin';
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
  import CyclomediaRecordingCircle from '../../cyclomedia/RecordingCircle.vue';
  import CyclomediaRecordingsClient from '../../cyclomedia/recordings-client';
  import LocationControl from '../LocationControl.vue';

  export default {
    mixins: [
      markersMixin,
      cyclomediaMixin,
      // pictometryMixin,
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
      // PictometryButton,
      // CyclomediaButton,
      CyclomediaRecordingCircle,
      LocationControl,
    },
    created() {
      // if there's a default address, navigate to it
      const defaultAddress = this.$config.defaultAddress;
      if (defaultAddress) {
        this.$controller.goToDefaultAddress(defaultAddress);
      }

      // create cyclomedia recordings client
      this.$cyclomediaRecordingsClient = new CyclomediaRecordingsClient(
        this.$config.cyclomedia.recordingsUrl,
        this.$config.cyclomedia.username,
        this.$config.cyclomedia.password,
        4326
      );
    },
    computed: {
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
        const activeBasemap = this.activeBasemap;
        const activeBasemapConfig = this.configForBasemap(activeBasemap)

        return activeBasemapConfig.tiledLayers || [];
      },
      activeDynamicMaps() {
        if (!this.activeTopicConfig || !this.activeTopicConfig.dynamicMapLayers) {
          return [];
        } else {
          return this.activeTopicConfig.dynamicMapLayers;
        }
      },
      activeFeatureLayers() {
        if (!this.activeTopicConfig || !this.activeTopicConfig.featureLayers) {
          return [];
        } else {
          return this.activeTopicConfig.featureLayers;
        }
      },
      activeFeature() {
        return this.$store.state.activeFeature;
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
      // picOrCycloActive() {
      //   if (this.cyclomediaActive || this.pictometryActive) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // },
      isGeocoding() {
        return this.$store.state.geocode.status === 'waiting';
      }
    },
    // watch: {
    //   picOrCycloActive(value) {
    //     this.$nextTick(() => {
    //       this.$store.state.map.map.invalidateSize();
    //     })
    //   }
    // },
    methods: {
      configForBasemap(basemap) {
        return this.$config.map.basemaps[basemap] || {};
      },
      shouldShowGeojson(key) {
        if (this.activeTopicConfig.basemap === 'pwd') {
          return true;
        } else {
          return key === this.activeDorParcel;
        }
      },
      // shouldShowFeatureLayer(key, minZoom) {
      //   return true;
      // },
      // handleMapClick(e) {
      //   this.$controller.handleMapClick(e);
      // },

      handleMapMove(e) {
        const map = this.$store.state.map.map;

        const pictometryConfig = this.$config.pictometry || {};

        // if (pictometryConfig.enabled) {
        //   // update state for pictometry
        //   const center = map.getCenter();
        //   const { lat, lng } = center;
        //   const coords = [lng, lat];
        //   this.$store.commit('setPictometryMapCenter', coords);
        //
        //   const zoom = map.getZoom();
        //   this.$store.commit('setPictometryMapZoom', zoom);
        // }

        const cyclomediaConfig = this.$config.cyclomedia || {};

        if (cyclomediaConfig.enabled) {
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

  @media (max-width: 1024px) {
    .mb-panel-map {
      height: 600px;
    }
  }

  .mb-search-control-container {
    height: 48px;
    border-radius: 2px;
    box-shadow:0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02);
  }

  .mb-search-control-button {
    width: 50px;
    background: #ccc;
    line-height: 48px;
  }

  .mb-search-control-input {
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
</style>
