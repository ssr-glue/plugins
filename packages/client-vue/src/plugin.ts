import { ClientSidePlugin } from 'ssr-glue'
import { VueAppCreatedEvent } from './events'
import { App, Component, createSSRApp } from 'vue'
import { createRouter, createWebHistory, Router, RouteRecordRaw, RouterOptions } from 'vue-router'

type Options = {
  app: Component
  routes: RouteRecordRaw[]
  routerOptions?: Omit<RouterOptions, 'routes' | 'history'>
  appCreated?(app: App<Element>): void | Promise<void>
}

export const PLUGIN_NAME = 'vueApp'

export function vueAppPlugin(options: Options): ClientSidePlugin {
  let app: App<Element>
  let router: Router

  return {
    name: PLUGIN_NAME,

    async created() {
      app = createSSRApp(options.app)

      options.appCreated && (await options.appCreated(app))
      this.eventBus.trigger(new VueAppCreatedEvent(app))

      router = createRouter({
        ...options.routerOptions,
        history: createWebHistory(),
        routes: options.routes,
      })

      app.use(router)
    },

    async boot() {
      // wait until router is ready before mounting to ensure hydration match
      await router.isReady()

      app.mount('#app')
    },
  }
}
