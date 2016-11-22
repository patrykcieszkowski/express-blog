module.exports = (Schema) =>
{
  return {
    name: String,
    hidden: Boolean,
    createdAt: { type: Date, default: Date.now },
  }
}
