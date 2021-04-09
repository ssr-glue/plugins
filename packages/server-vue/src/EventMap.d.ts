import { VueAppCreatedEvent } from './events'

declare module 'ssr-glue' {
  interface ServerSideEventMap {
    'plugin/vueApp/appCreated': (event: VueAppCreatedEvent) => void
  }
}
