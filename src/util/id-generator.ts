export const schemaIdGenerator = {
  increment: 0,
  generateId() {
    return ['csid', ++this.increment].filter((item) => !!item).join('-');
  },
  reset() {
    this.increment = 0;
  },
};
