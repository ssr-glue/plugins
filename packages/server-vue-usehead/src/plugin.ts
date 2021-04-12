import { ServerSidePlugin } from 'ssr-glue'
import { renderHeadToString, createHead, HeadClient } from '@vueuse/head'

const PLUGIN_NAME = 'vue:useHead'

export function useHeadPlugin(): ServerSidePlugin {
  let head: HeadClient | undefined

  return {
    name: PLUGIN_NAME,

    created() {
      this.eventBus.on('plugin/vueApp/appCreated', (event) => {
        head = createHead()

        event.app.use(head)
      })
    },

    async transformHtml(html: string) {
      if (!head) {
        return html
      }

      const { headTags, htmlAttrs, bodyAttrs } = renderHeadToString(head)

      return html
        .replace(`<!--head-tags-->`, headTags)
        .replace(`<html>`, `<html${htmlAttrs}>`)
        .replace(`<body>`, `<body${bodyAttrs}>`)
    },
  }
}
