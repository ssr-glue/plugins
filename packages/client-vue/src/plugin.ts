import { VueAppCreatedEvent } from './events'
import { App, Component, createSSRApp } from 'vue'
import { ClientSidePlugin } from 'ssr-glue'
import { createRouter, createWebHistory, RouteRecordRaw, RouterOptions } from 'vue-router'

type Options = {
  app: Component
  routes: RouteRecordRaw[]
  routerOptions?: Omit<RouterOptions, 'routes' | 'history'>
  onAppCreated?(app: App<Element>): void | Promise<void>
}

export const PLUGIN_NAME = 'vueApp'

export function vueAppPlugin(options: Options): ClientSidePlugin {
  return {
    name: PLUGIN_NAME,

    async onCreated() {
      const app = createSSRApp(options.app)

      options.onAppCreated && (await options.onAppCreated(app))
      this.eventBus.trigger(new VueAppCreatedEvent(app))

      const router = createRouter({
        ...options.routerOptions,
        history: createWebHistory(),
        routes: options.routes,
      })

      app.use(router)

      // wait until router is ready before mounting to ensure hydration match
      await router.isReady()

      app.mount('#app')
    },
  }
}
