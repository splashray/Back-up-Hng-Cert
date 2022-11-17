const jwt = require('jsonwebtoken')

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

module.exports = generateToken
