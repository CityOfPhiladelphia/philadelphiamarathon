<template>
  <div id="cyclo-container"
       class="large-12 columns mb-panel"
  >
  <!-- v-once -->
    <!-- <a id="inCycloDiv"
         @click="this.popoutClicked"
    >
      <i class="fa fa-external-link fa popout-icon"></i>
    </a> -->
    <div id="cycloviewer" ref="cycloviewer" class="panoramaViewerWindow" />
  </div>
</template>

<script>
  export default {
    computed: {
      // pictometryActive() {
      //   return this.$store.state.pictometry.active
      // },
      // cycloContainerClass() {
      //   if (this.pictometryActive) {
      //     return 'large-16 columns mb-panel'
      //   } else {
      //     return 'large-24 columns mb-panel'
      //   }
      // },
      locForCyclo() {
        // console.log('computing locForCyclo');
        const geocodeData = this.$store.state.geocode.data;
        const map = this.$store.state.map.map;
        if (geocodeData) {
          return geocodeData.geometry.coordinates;
        }
      }
    },
    watch: {
      locForCyclo(coords){
        // console.log(coords);
        this.setNewLocation(coords);
      }
    },
    mounted() {
      StreetSmartApi.init({
        username: this.$config.cyclomedia.username,
        password: this.$config.cyclomedia.password,
        apiKey: this.$config.cyclomedia.apiKey,
        srs: 'EPSG:4326',
        locale: 'en-us',
        addressSettings: {
          locale: 'en-us',
          database: 'CMDatabase'
        }
      }).then(
        () => {
          const cycloDiv = this.$refs.cycloviewer;
          const viewer = StreetSmartApi.addPanoramaViewer(cycloDiv, {recordingsVisible: true, timeTravelVisible: true});
          this.$store.commit('setCyclomediaViewer', viewer);
          this.$store.commit('setCyclomediaActive', true);

          // get map center and set location
          const map = this.$store.state.map.map;
          // const center = map.getCenter();
          // this.setNewLocation([center.lng, center.lat]);
          // this.setNewLocation([-75.17506091, 39.96125317]);
          // const orientation = {
          //   yaw: 2.3719500682547627,
          //   pitch: 0.05236673237908718,
          //   hFov: 1.082104136236485
          // }
          const orientation = {
            yaw: 137.5,
            pitch: 0,
            hFov: 50
          }
          console.log(orientation);

          console.log('open')
          // viewer.openByCoordinate([-75.17506091, 39.96125317]).then(viewer.setOrientation(orientation))//.then(viewer.rotateRight(50))//.then(viewer.lookAtCoordinate([-75.175058, 39.961230]));
          viewer.openByImageId('5D5B9C93').then(viewer.setOrientation(orientation))//.then(viewer.rotateRight(50))//.then(viewer.lookAtCoordinate([-75.175058, 39.961230]));
          // console.log('opened, now setting orientation')
          // viewer.rotateRight(0.01);
          // console.log('start time out')
          // setTimeout(viewer.rotateRight(160), 10000);
          // console.log('end time out')


          // console.log('set orientation');

          // TODO bind CN events to vue
          // viewer.on(StreetSmartApi.Events.panoramaViewer.VIEW_CHANGE, e => {
          //
          // });
          // viewer.on(StreetSmartApi.Events.panoramaViewer.VIEW_LOAD_END, e => {
          //   const recording = viewer.getRecording();
          //   const xyz = recording.xyz;
          //   const xy = xyz.slice(0, 2);
          //   const xyFloat = xy.map(parseFloat);
          //   const xyArray = [].slice.call(xyFloat);
          // });
        },
        err => {
          console.log('Api: init: failed. Error: ', err);
        }
      );
    },
    updated() {
      // TODO find a better way to get the image to update and not be stretched
      const viewer = this.$store.state.cyclomedia.viewer;
      viewer.rotateRight(0.0000001);
    },
    methods: {
      setNewLocation(coords) {
        // console.log('setNewLocation is running using', coords);
        const viewer = this.$store.state.cyclomedia.viewer;
        viewer.openByCoordinate(coords);
      },
      popoutClicked() {
        // console.log('popoutClicked');
        window.open('http://localhost:8082/examples/cyclomedia/', '_blank');
      }
    }
  };
</script>

<style>

#cyclo-container {
  padding: 0px;
  height: 100%;
}

#inCycloDiv {
  background-color: white;
  border: 0px solid;
  width: 30px;
  height: 30px;
  /*display:none;*/
  cursor:pointer;
  z-index: 10;
  position:relative;
  float: right;
}

.popout-icon {
  margin-top: 8.5px;
  font-size: 15px;
  margin-left: 8.5px;
}

.panoramaViewerWindow {
  /*display: inline-block;*/
  display: block;
  width: 100%;
  height:100%;
}
</style>
