import { VueAppCreatedEvent } from './events'

declare module 'ssr-glue' {
  interface ClientSideEventMap {
    'plugin/vueApp/appCreated': (event: VueAppCreatedEvent) => void
  }
}
