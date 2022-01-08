import { emitEvent, timeDiff, setProjectGlobal, setAppVisible } from '/vue/bitburner-vue/lib.js'

import EventBus from '/vue/bitburner-vue/eventBus.js'
import VueLoader from '/vue/bitburner-vue/vueLoader.js'
import Store from '/vue/bitburner-vue/store.js'
import UI from '/vue/bitburner-vue/ui.js'
import Orchestrator from '/vue/bitburner-vue/orchestrator.js'

/** @param {NS} ns **/
export async function main(ns) {
  const main = new Main(ns, ns.args[0])
  await main.init()

  // Run core loop
  while (true) {
    await main.update()
  }
}

class Main {
  #ns
  #uuid

  vueLoader
  eventBus
  store
  ui
  orchestrator

  static config = {
    tickRate: 250,
  }

  /**
   * @param {NS} ns
   */
  constructor(ns, uuid) {
    this.#ns = ns
    this.#uuid = uuid || crypto.randomUUID()
    this.eventBus = new EventBus(ns)
    this.vueLoader = new VueLoader(ns)
    this.store = new Store(ns)
    this.ui = new UI(ns)
    this.orchestrator = new Orchestrator(ns)

    setProjectGlobal('main', this)
  }

  async init() {
    setAppVisible(false)

    await this.eventBus.init()
    await this.vueLoader.init()
    await this.store.init()
    await this.ui.init()
    await this.orchestrator.init()

    emitEvent('init:main', { uuid: this.uuid })
    this.eventBus.processQueue()

    return this
  }

  async update() {
    let timeStart = Date.now()
    await this.orchestrator.update()
    let timeEnd = Date.now()

    // Only pause if updates didn't use up our time
    if (timeEnd - timeStart < Main.config.tickRate) {
      await this.#ns.asleep(Main.config.tickRate)
      timeEnd = Date.now()
    } else {
      emitEvent('main:slowUpdate', {
        tickDuration: timeDiff(timeStart, timeEnd, { verbose: true }),
      })
    }
  }

  get uuid() {
    return this.#uuid
  }
}
