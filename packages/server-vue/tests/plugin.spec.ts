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

  const about = defineComponent({
    name: 'about',
    template: `<main>about me</main>`,
  })

  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      component: home,
    },
    {
      path: '/about',
      component: about,
    },
  ]

  const ssrApp = new ServerSideApplication({
    plugins: [vueAppPlugin({ app, routes })],
  })

  await ssrApp.boot()

  const html = `<div id='app'><!--app-html--></div>`
  const homepageRequest = { url: 'https://example.com/index.html' } as IncomingMessage
  const homePageHtml = await ssrApp.render(html, homepageRequest)

  expect(homePageHtml).toEqual(`<div id='app'><div>hi<main>world</main></div></div>`)

  const aboutPageRequest = { url: 'https://example.com/about' } as IncomingMessage
  const aboutPageHtml = await ssrApp.render(html, aboutPageRequest)

  expect(aboutPageHtml).toEqual(`<div id='app'><div>hi<main>about me</main></div></div>`)
})
