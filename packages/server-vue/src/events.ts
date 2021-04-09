import { App } from 'vue'
import { Event } from 'EventDispatcher'

export class VueAppCreatedEvent extends Event {
  static EventName = `plugin/vueApp/appCreated`
  app: App<Element>

  constructor(app: App<Element>) {
    super(VueAppCreatedEvent.EventName)

    this.app = app
  }
}
