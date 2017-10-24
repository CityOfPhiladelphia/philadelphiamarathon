export default {
  computed: {
    cyclomediaActive() {
      // return true;
      return this.$store.state.cyclomedia.active;
    },
    cyclomediaRecordings() {
      return this.$store.state.cyclomedia.recordings;
    },
  },
  methods: {
    handleCyclomediaButtonClick() {
      this.updateCyclomediaRecordings();

    },
    handleCyclomediaRecordingClick(e) {
      const latlng = e.latlng;
      const viewer = this.$store.state.cyclomedia.viewer;
      viewer.openByCoordinate([latlng.lng, latlng.lat]);
    },
    updateCyclomediaRecordings() {
      // console.log('updateCyclomediaRecordings is running');
      const map = this.$store.state.map.map;
      const zoom = map.getZoom();
      if (!this.$store.state.cyclomedia.active || zoom <= 18) {
        this.$store.commit('setCyclomediaRecordings', [])
        return;
      }
      const bounds = map.getBounds();
      this.$cyclomediaRecordingsClient.getRecordings(
        bounds,
        recordings => {
          this.$store.commit('setCyclomediaRecordings', recordings);
        }
      );
    },
  }
};
