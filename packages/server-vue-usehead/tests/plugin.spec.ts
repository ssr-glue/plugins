import { defineComponent } from 'vue'
import { IncomingMessage } from 'http'
import { useHeadPlugin } from '../src'
import { useHead } from '@vueuse/head'
import { RouteRecordRaw } from 'vue-router'
import { vueAppPlugin } from '../../server-vue/src'
import { ServerSideApplication } from '@ssr-glue/server-libs'

it('should transform html', async () => {
  const app = defineComponent({
    name: 'app',
    template: `<div>hi<router-view></router-view></div>`,
  })

  const home = defineComponent({
    name: 'home',
    template: `<main>world</main>`,
    setup() {
      useHead({
        title: 'home page',
        htmlAttrs: {
          class: 'home-page',
        },
        bodyAttrs: {
          class: 'home-page-body',
        },
      })
    },
  })

  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: home,
    },
  ]

  const ssrApp = new ServerSideApplication({
    plugins: [vueAppPlugin({ app, routes }), useHeadPlugin()],
  })

  const html = `<html>
<head><!--head-tags--></head>
<body>
  <div id='app'><!--app-html--></div>
</body>
</html>`

  const request = { url: 'https://example.com/index.html' } as IncomingMessage
  const result = await ssrApp.render(html, request)

  expect(result).toMatch(`class="home-page-body"`)
})
