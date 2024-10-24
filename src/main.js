
let pictApiKey, pictSecretKey;
const host = window.location.hostname;
if (host === 'atlas-dev.phila.gov.s3-website-us-east-1.amazonaws.com') {
  pictApiKey = process.env.VUE_APP_ATLASDEV_PICTOMETRY_API_KEY;
  pictSecretKey = process.env.VUE_APP_ATLASDEV_PICTOMETRY_SECRET_KEY;
} else {
  pictApiKey = process.env.VUE_APP_PICTOMETRY_API_KEY;
  pictSecretKey = process.env.VUE_APP_PICTOMETRY_SECRET_KEY;
}

import viewerboard from '@phila/viewerboard/src/main.js';

import MarathonToggleControl from './components/MarathonToggleControl.vue';

const customComps = {
  'marathonToggleControl': MarathonToggleControl,
};

viewerboard({
  customComps,
  initialTiledOverlays: ['fullMarathon'],
  app: {
    title: 'Philadelphia Marathon',
    tagLine: '',
  },
  // baseConfig: BASE_CONFIG_URL,
  cyclomedia: {
    enabled: true,
    // orientation: 'horizontal',
    measurementAllowed: false,
    popoutAble: true,
    recordingsUrl: 'https://atlas.cyclomedia.com/Recordings/wfs',
    username: process.env.VUE_APP_CYCLOMEDIA_USERNAME,
    password: process.env.VUE_APP_CYCLOMEDIA_PASSWORD,
    apiKey: process.env.VUE_APP_CYCLOMEDIA_API_KEY,
  },
  pictometry: {
    enabled: false,
    // orientation: 'horizontal',
    iframeId: 'pictometry-ipa',
    apiKey: pictApiKey,
    secretKey: pictSecretKey,
  },
  initialView: ['map'],
  geocoder: {
    url: function (input) {
      var inputEncoded = encodeURIComponent(input);
      return 'https://api.phila.gov/ais/v1/search/' + inputEncoded;
    },
    params: {
      gatekeeperKey: process.env.VUE_APP_GATEKEEPER_KEY,
      include_units: true,
      opa_only: true,
    },
  },
  geolocation: {
    enabled: true,
    icon: [ 'far', 'dot-circle' ],
  },
  router: {
    enabled: true,
    type: 'vue'
  },

  // addressInput: {
  //   width: 350,
  //   mapWidth: 300,
  //   // position: 'right',
  //   autocompleteEnabled: false,
  //   autocompleteMax: 15,
  //   placeholder: 'Search for an address',
  // },
  map: {
    type: 'mapbox',
    containerClass: 'map-container',
    containerClassWCyclo: 'map-container',
    center: [-75.174820, 39.961120],
    minZoom: 11,
    maxZoom: 25,
    shouldInitialize: true,
    zoom: 13,
    marathonToggle: true,
    basemapToggle: true,
  },
  mbStyle: {
    version: 8,
    glyphs: '//fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      pwd: {
        tiles: [
          'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer/tile/{z}/{y}/{x}',
        ],
        type: 'raster',
        tileSize: 256,
      },
    },
    layers: [
      {
        id: 'pwd',
        type: 'raster',
        source: 'pwd',
      },
    ]
  },
  basemapSources: {
    pwd: {
      source: {
        tiles: [
          'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer/tile/{z}/{y}/{x}',
          // '//tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer/tile/{z}/{y}/{x}'
        ],
        type: 'raster',
        tileSize: 256,
      },
      layer: {
        id: 'pwd',
        type: 'raster',
      },
    },
    imagery2022: {
      source: {
        tiles: [
          'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityImagery_2022_2in/MapServer/tile/{z}/{y}/{x}',
        ],
        type: 'raster',
        tileSize: 256,
      },
      layer: {
        id: 'imagery2022',
        type: 'raster',
      },
    },
    // imagery2019: {
    //   source: {
    //     tiles: [
    //       'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityImagery_2019_3in/MapServer/tile/{z}/{y}/{x}',
    //       // '//tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer/tile/{z}/{y}/{x}'
    //     ],
    //     type: 'raster',
    //     tileSize: 256,
    //   },
    //   layer: {
    //     id: 'imagery2019',
    //     type: 'raster',
    //   },
    // },
  },
  basemapLabelSources:{
    cityBasemapLabels: {
      source: {
        tiles: ['https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer/tile/{z}/{y}/{x}'],
        type: 'raster',
        tileSize: 256,
      },
      layer: {
        id: 'cityBasemapLabels',
        type: 'raster',
      },
    },
    imageryBasemapLabels: {
      source: {
        tiles: ['https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityImagery_Labels/MapServer/tile/{z}/{y}/{x}'],
        type: 'raster',
        tileSize: 256,
      },
      layer: {
        id: 'imageryBasemapLabels',
        type: 'raster',
      },
    },
  },
  overlaySources: {
    fullMarathon: {
      source: {
        tiles: ['https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/2024_FullMarathon/MapServer/tile/{z}/{y}/{x}'],
        // tiles: ['https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/2021_Full_Marathon/MapServer/tile/{z}/{y}/{x}'],
        // type: 'raster',
        tileSize: 256,
      },
      layer: {
        id: 'fullMarathon',
        type: 'raster',
      },
    },
    halfMarathon: {
      source: {
        tiles: ['https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/2024_HalfMarathon/MapServer/tile/{z}/{y}/{x}'],
        // tiles: ['https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/2021_Half_Marathon/MapServer/tile/{z}/{y}/{x}'],
        // type: 'raster',
        tileSize: 256,
      },
      layer: {
        id: 'halfMarathon',
        type: 'raster',
      },
    },
  }
});
