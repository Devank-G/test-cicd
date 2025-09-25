export default class Chart {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.data = config.data;
  }

  update() {
    // Mock chart update - no operation needed for tests
    return this;
  }

  destroy() {
    // Mock chart cleanup - no operation needed for tests
    this.ctx = null;
    this.config = null;
    this.data = null;
  }
}
