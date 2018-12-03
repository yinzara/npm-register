const config = require('../config')

class User {
  static async authenticate (user) {
    return config.user.authenticate(user)
  }

  static async findByToken (token) {
    return config.user.findByToken(token)
  }
}
module.exports = User
