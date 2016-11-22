module.exports = (Schema) =>
{
  return {
    login: String,
    password: String,
    username: String,
    first_name: String,
    last_name: String,
    about: String,
    group: Schema.ObjectId,
    createdAt: {type: Date, default: Date.now},
  }
}
