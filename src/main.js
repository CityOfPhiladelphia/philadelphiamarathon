import Vue from 'vue';
import createStore from './store';
import configMixin from './util/config-mixin';
import Mapboard from './components/Mapboard.vue';
import mergeDeep from './util/merge-deep';
import controllerMixin from './controller';
import generateUniqueId from './util/unique-id';

export default (clientConfig) => {
  const baseConfigUrl = clientConfig.baseConfig;

  // create a global event bus used to proxy events to the mapboard host
  const eventBus = new Vue();
  Vue.prototype.$eventBus = eventBus;

  // get base config
  return axios.get(baseConfigUrl).then(response => {
    const data = response.data;

    const baseConfig = eval(data);

    // deep merge base config and client config
    //const config = mergeDeep(clientConfig, baseConfig);
    const config = mergeDeep(baseConfig, clientConfig);

    // make config accessible from each component via this.$config
    Vue.use(configMixin, config);

    // create store
    const store = createStore(config);

    // mix in controller
    Vue.use(controllerMixin, { config, store, eventBus });

    // mount main vue
    const vm = new Vue({
      el: config.el || '#mapboard',
      render: h => h(Mapboard),
      store
    });

    // bind mapboard events to host app
    const events = config.events || {};
    for (let eventName of Object.keys(events)) {
      const callback = events[eventName];
      vm.$eventBus.$on(eventName, callback);
    }
  }).catch(err => {
    console.error('Error loading base config:', err);
  });
};

export { Mapboard };
