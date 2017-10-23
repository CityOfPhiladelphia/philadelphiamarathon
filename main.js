var GATEKEEPER_KEY = '60a96cf015063fa0f0e2708bc3c61775';
var BASE_CONFIG_URL = '//rawgit.com/ajrothwell/philadelphiamarathon-base-config/38ecf77f75ac3524b05c0865173a3657d8b25671/config.js';

Mapboard.default({
  geolocation: {
    enabled: true
  },
  rootStyle: {
    position: 'absolute',
    bottom: 0,
    top: '78px',
    left: 0,
    right: 0,
  },
  map: {
    defaultBasemap: 'pwd',
    defaultIdentifyFeature: 'address-marker',
    imagery: {
      enabled: true
    },
    center: [39.982649, -75.188560],
    minZoom: 11,
    maxZoom: 25,
    zoom: 13,
  },
  baseConfig: BASE_CONFIG_URL,
  cyclomedia: {
    enabled: true
  }
});
