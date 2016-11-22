module.exports = (Schema) =>
{
  return {
    title: String,
    body: String,
    body_short: String,
    author: Schema.ObjectId,
    seo_name: String,
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    category: [Schema.ObjectId],
    tag: [Schema.ObjectId],
  }
}
