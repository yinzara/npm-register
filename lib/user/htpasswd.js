'use strict'
const htpasswd = require('htpasswd-auth')
const uuidv4 = require('uuid/v4')
const config = require('../config')
const crypto = require('crypto')

const cipherOutputEncoding = 'hex'
const cipherInputEncoding = 'utf8'

async function getCreds () {
  return (await config.storage.getJSON('auth_tokens')) || {}
}

async function createAuthToken (username) {
  let creds = await getCreds()
  let token = uuidv4()
  creds[token] = {
    username,
    timestamp: new Date()
  }
  await config.storage.put('auth_tokens', creds, {
    'Content-Type': 'application/json'
  })
  return token
}

async function findTokenInCreds (token) {
  let creds = await getCreds()
  if (creds[token]) return creds[token].username
}

async function encryptUserToToken (user) {
  // like JWT format
  let data = {
    sub: user.name,
    iat: (new Date().getDate() / 1000)
  }
  let iv = crypto.randomBytes(config.auth.ivLength)
  let key = Buffer.from(config.auth.key, config.auth.keyEncoding)
  let cipher = crypto.createCipheriv(config.auth.algo, key, iv)
  let ciphered = cipher.update(JSON.stringify(data), cipherInputEncoding, cipherOutputEncoding)
  ciphered += cipher.final(cipherOutputEncoding)
  ciphered += '|' + iv.toString('hex')
  return ciphered
}

async function decryptUserFromToken (token) {
  let splitStr = token.split('|')
  let encrypted = splitStr[0]
  let iv = Buffer.from(splitStr[1], 'hex')
  let key = Buffer.from(config.auth.key, config.auth.keyEncoding)
  let decrypt = crypto.createDecipheriv(config.auth.algo, key, iv)
  let decrypted = decrypt.update(encrypted, cipherOutputEncoding, cipherInputEncoding)
  decrypted += decrypt.final()
  return JSON.parse(decrypted)
}

class Auth {
  async authenticate (user) {
    let htpasswdFile = (await config.storage.get('htpasswd')) || ''
    let auth = await htpasswd.authenticate(user.name, user.password, htpasswdFile.toString())
    if (!auth) return false
    if (config.auth.key) {
      return encryptUserToToken(user)
    } else {
      return createAuthToken(user.name)
    }
  }

  async findByToken (token) {
    if (config.auth.key) {
      return decryptUserFromToken(token)
    } else {
      return findTokenInCreds(token)
    }
  }
}
module.exports = Auth
