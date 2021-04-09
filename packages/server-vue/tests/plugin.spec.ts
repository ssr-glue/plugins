import { vueAppPlugin } from '../src'
import { defineComponent } from 'vue'
import { IncomingMessage } from 'http'
import { RouteRecordRaw } from 'vue-router'
import { ServerSideApplication } from '@ssr-glue/server-libs'

it('should transform html', async () => {
  const app = defineComponent({
    name: 'app',
    template: `<div>hi<router-view></router-view></div>`,
  })

  const home = defineComponent({
    name: 'home',
    template: `<main>world</main>`,
  })

  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: home,
    },
  ]

  const ssrApp = new ServerSideApplication({
    plugins: [vueAppPlugin({ app, routes })],
  })

  const html = `<div id='app'><!--app-html--></div>`
  const request = { url: 'https://example.com/index.html' } as IncomingMessage
  const result = await ssrApp.render(html, request)

  expect(result).toEqual(`<div id='app'><div>hi<main>world</main></div></div>`)
})
