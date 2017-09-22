<!-- <template>
  <opacity-slider :layer="this.$leafletElement"
                  :position="'topleft'"
  />
</template> -->
<script>
  import L from 'leaflet';
  // import OpacitySlider from '../leaflet/OpacitySlider';
  // TODO look into a cleaner way of importing from esri-leaflet
  const EsriFeatureLayer = L.esri.featureLayer;

  // min and max zooms are not handled by esri leaflet, but are handled by vue
  export default {
    props: [
      'url',
      'minZoom',
      'maxZoom',
      'zIndex',
      'layerName',
      'color',
      'fillColor',
      'fillOpacity',
      'weight',
      'pointLayer',
      'opacity'
    ],
    created() {
      const leafletElement = this.$leafletElement = this.createLeafletElement();
      const map = this.$store.state.map.map;
      // REVIEW kind of hacky/not reactive?
      if (map) {
        leafletElement.addTo(map);
      }
    },
    destroyed() {
      this.$leafletElement._map.removeLayer(this.$leafletElement);
    },
    // computed: {
    //   pointToLayer() {
    //     if (this.$props.pointLayer) {
    //
    //     }
    //   }
    // },
    // we don't actually render anything, but need to define either a template
    // or a render function
    render(h) {
      return;
    },
    methods: {
      createLeafletElement() {
        const props = Object.assign({}, this.$props);
        if (props.pointLayer) {

          let points = []

          // const pointToLayer = function(geojson, latlng) {
          //   // console.log('pointToLayer geojson', geojson, 'latlng', latlng);
          //   points.push(latlng)
          //   return L.circleMarker(latlng, {
          //     // pane: 'blockpoints',
          //     // color: 'green'
          //   });
          // }
          // props.pointToLayer = pointToLayer;

          const onEachFeature = function(geojson) {
            console.log('on each feature geojson', geojson);
            points.push(geojson)
          }
          props.onEachFeature = onEachFeature;

          const featureLayer = new EsriFeatureLayer(props);
          console.log('points', points);
          return featureLayer;
        } else {
          return new EsriFeatureLayer(props);
        }
      },
      parentMounted(parent) {
        const map = parent.$leafletElement;
        this.$leafletElement.addTo(map);
      }
    }
  };
</script>

<style>


</style>
