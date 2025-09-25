export default class Chart {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.data = config.data;
  }
  update() {}
  destroy() {}
}
