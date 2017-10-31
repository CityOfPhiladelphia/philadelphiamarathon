import { parse as parseUrl } from 'url';

class Router {
  constructor(opts) {
    const config = this.config = opts.config;
    this.store = opts.store;
    this.controller = opts.controller;
    this.eventBus = opts.eventBus;
    this.dataManager = opts.dataManager;
    this.history = window.history;

    // check if the router should be silent (i.e. not update the url or listen
    // for hash changes)
    const silent = this.silent = !config.router || !config.router.enabled;

    // only listen for route changes if routing is enabled
    if (!silent) {
      console.log('routing is enabled, this', this);
      window.onhashchange = this.hashChanged.bind(this);
    }
  }

  makeHash(route) {
    console.log('make hash', route);
    // must have a route
    if (!route || route.length === 0) {
      return null;
    }
    // let hash = `#/${route)}`;
    let hash = `#/${encodeURIComponent(route)}`;
    return hash;
  }

  hashChanged() {
    const location = window.location;
    const hash = location.hash;

    console.log('hash changed =>', hash);
    // parse path
    const pathComps = hash.split('/').splice(1);
    const routeComp = pathComps[0];

    // if there's no route, don't do anything
    if (!routeComp) {
      return;
    }
    this.store.commit('setMarathonVersion', routeComp);
  }

  routeToRoute(nextRoute) {
    // console.log('Router.routeToRoute', nextRoute);
    if (nextRoute) {
      // check against current marathon route
      const prevRoute = this.store.state.marathonVersion;
      // if the hash address is different
      if (!prevRoute || nextRoute !== prevRoute) {
        // console.log('routes not the same');
        if (!this.silent) {
          const nextHash = this.makeHash(nextRoute);
          // console.log('nextHash', nextHash);
          window.location.hash = nextHash;
        }
      }
    }
  }
}

export default Router;
