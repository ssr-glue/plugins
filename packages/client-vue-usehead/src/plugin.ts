import { createHead } from '@vueuse/head'
import { ClientSidePlugin } from 'ssr-glue'

export const PLUGIN_NAME = 'vue:useHead'

export function useHeadPlugin(): ClientSidePlugin {
  return {
    name: PLUGIN_NAME,
    created() {
      this.eventBus.one(
        'plugin/vueApp/appCreated',
        (event) => {
          const head = createHead()

          event.app.use(head)
        },
        { triggerLastEvent: true }
      )
    },
  }
}
