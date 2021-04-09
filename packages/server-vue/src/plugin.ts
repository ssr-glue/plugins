import { IncomingMessage } from 'http'
import { ServerSidePlugin } from 'ssr-glue'
import { VueAppCreatedEvent } from './events'
import { createSSRApp, App, Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createRouter, createMemoryHistory, RouteRecordRaw, RouterOptions } from 'vue-router'

export const PLUGIN_NAME = 'vueApp'

export type Options = {
  app: Component
  routes: RouteRecordRaw[]
  routerOptions?: Omit<RouterOptions, 'routes' | 'history'>
  onAppCreated?(app: App<Element>): void | Promise<void>
}

export function vueAppPlugin(options: Options): ServerSidePlugin {
  let app: App<Element>

  return {
    name: PLUGIN_NAME,

    async onRequest(request: IncomingMessage) {
      app = createSSRApp(options.app)

      options.onAppCreated && (await options.onAppCreated(app))
      this.eventBus.trigger(new VueAppCreatedEvent(app))

      const router = createRouter({
        ...options.routerOptions,
        history: createMemoryHistory(),
        routes: options.routes,
      })

      app.use(router)

      const url = request.url!.replace('/index.html', '/')
      // set the router to the desired URL before rendering
      router.push(url)
      await router.isReady()
    },

    async transformHtml(html: string) {
      const ctx = {}
      const appHtml = await renderToString(app, ctx)

      return html.replace(`<!--app-html-->`, appHtml)
    },
  }
}
