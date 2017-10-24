import Vue from 'vue';
import Vuex from 'vuex';

// when you load vuex from a script tag this seems to happen automatically
// Vue.use(Vuex);

function createStore(config) {
  const initialState = {
    clickCoords: null,
    geocode: {
      status: null,
      data: null,
      input: null,
      related: null,
    },
    lastSearchMethod: null,
    // the leaflet map object
    map: {
      location: {
        lat: null,
        lng: null
      },
      center: config.map.center,
      zoom: config.map.zoom,
      map: null,
      basemap: 'pwd',
      imagery: 'imagery2017',
      shouldShowImagery: false,
      watchPositionOn: false,
    },
    marathonVersion: 'full',
    cyclomedia: {
      enabled: null,
      active: false,
      viewer: null,
      recordings: [],
      locFromApp: null,
      locFromViewer: null,
    },
    windowSize: {
      height: 0,
      width: 0,
    }
  };

  // TODO standardize how payloads are passed around/handled
  return new Vuex.Store({
    state: initialState,
    mutations: {
      setLocation(state, payload) {
        state.map.location.lat = payload.lat;
        state.map.location.lng = payload.lng;
      },
      setWatchPositionOn(state, payload) {
        state.map.watchPositionOn = payload;
      },
      setClickCoords(state, payload) {
        state.clickCoords = payload;
      },
      setTables(state, payload) {
        state.tables = payload;
      },
      setTableGroupActiveTable(state, payload) {
        state.tableGroups[payload.tableGroupId].activeTableId = payload.activeTableId;
        state.tableGroups[payload.tableGroupId].activeTable = payload.activeTable;
      },
      setTableFilteredData(state, payload) {
        const { tableId, data } = payload;

        // check for not-null table id
        if (!tableId) return;

        state.tables.filteredData[tableId] = data;
      },
      setMapFilters(state, payload) {
        state.map.filters = payload;
      },
      setMap(state, payload) {
        state.map.map = payload.map;
      },
      // this is the map center as an xy coordinate array (not latlng)
      setMapCenter(state, payload) {
        state.map.center = payload;
      },
      setMapZoom(state, payload) {
        state.map.zoom = payload
      },
      setGeocodeStatus(state, payload) {
        state.geocode.status = payload;
      },
      setGeocodeData(state, payload) {
        state.geocode.data = payload;
      },
      setGeocodeRelated(state, payload) {
        state.geocode.related = payload;
      },
      setGeocodeInput(state, payload) {
        state.geocode.input = payload;
      },
      setBasemap(state, payload) {
        state.map.basemap = payload;
      },
      setImagery(state, payload) {
        state.map.imagery = payload;
      },
      setShouldShowImagery(state, payload) {
        state.map.shouldShowImagery = payload;
      },
      setMarathonVersion(state, payload) {
        state.marathonVersion = payload;
      },
      setCyclomediaEnabled(state, payload) {
        state.cyclomedia.enabled = payload;
      },
      setCyclomediaActive(state, payload) {
        if (!state.cyclomedia.enabled) {
          return;
        }
        state.cyclomedia.active = payload;
      },
      setCyclomediaViewer(state, payload) {
        state.cyclomedia.viewer = payload;
      },
      setCyclomediaRecordings(state, payload) {
        state.cyclomedia.recordings = payload;
      },
      setCyclomediaLocFromApp(state, payload) {
        state.cyclomedia.locFromApp = payload;
      },
      setCyclomediaLocFromViewer(state, payload) {
        state.cyclomedia.locFromViewer = payload;
      },
      setWindowSize(state, payload) {
        state.windowSize = payload;
      }
    }
  });
}

export default createStore;
