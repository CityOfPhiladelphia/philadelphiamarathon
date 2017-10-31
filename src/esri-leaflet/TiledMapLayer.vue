<script>
  import L from 'leaflet';
  // TODO look into a cleaner way of importing from esri-leaflet
  const EsriTiledMapLayer = L.esri.tiledMapLayer;

  export default {
    props: [
      'url',
      'minZoom',
      'maxZoom',
      'zIndex',
      'attribution',
      'pane'
    ],
    mounted() {
      console.log('mounted is running')
      const map = this.$store.state.map.map;
      const leafletElement = this.$leafletElement = this.createLeafletElement();
      if (map) {
        console.log('mounted, there is a map');
        const panes = map.getPanes();
        // console.log('panes', Object.keys(panes));
        if (!Object.keys(panes).includes(this.$props.pane)) {
          map.createPane(this.$props.pane);
          // this.$leafletElement.options.pane = this.$props.pane;
        }
        this.$nextTick(() => {
          leafletElement.addTo(map);
        });
        map.attributionControl.removeAttribution('overwrite');
      } else {
        console.log('mounted, no map');
      }
    },
    destroyed() {
      this.$leafletElement._map.removeLayer(this.$leafletElement);
    },
    // we don't actually render anything, but need to define either a template
    // or a render function
    render(h) {
      return;
    },
    methods: {
      createLeafletElement() {
        // const props = Object.assign({}, this.$props);
        const mapLayer = new EsriTiledMapLayer({
            url: this.$props.url,
            minZoom: this.$props.minZoom,
            maxZoom: this.$props.maxZoom,
            zIndex: this.$props.zIndex,
            attribution: this.$props.attribution,
          });
        return mapLayer;
      },
      parentMounted(parent) {
        console.log('parentMounted is running');
        const map = parent.$leafletElement;
        // const panes = map.getPanes();
        // console.log('panes', Object.keys(panes));
        // if (this.$props.pane) { // && !Object.keys(panes).includes(this.$props.pane)) {
        //   console.log('parentMounted, pane:', this.$props.pane, 'map does not have it')
        //   // let leafletElement = this.$leafletElement;
        //
        //   map.createPane(this.$props.pane);
        //   // map.whenReady(function(leafletElement) {
        //   this.$leafletElement.options.pane = this.$props.pane;
        map.addLayer(this.$leafletElement)
          // this.$nextTick(() => {
          //   this.$leafletElement.redraw();
          //   map.invalidateSize();
          // });
          // }, null);
          // map.addLayer(this.$leafletElement);
          // this.$leafletElement.redraw();
        // } else {
        //   console.log('parentMounted no this.$props.pane:', this.$props.pane);
        // // this.$nextTick(() => {
        //   this.$leafletElement.addTo(map);
        // // });
        // }
        map.attributionControl.removeAttribution('overwrite');
      }
    }
  };
</script>
