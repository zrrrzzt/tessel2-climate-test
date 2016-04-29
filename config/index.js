'use strict'

var config = {
  FIREBASE_URL: process.env.FIREBASE_URL || 'tessel2climate.firebaseio-demo.com',
  LOOP_TIMEOUT: process.env.LOOP_TIMEOUT || 60000,
  TEMPERATURE_FORMAT: process.env.TEMPERATURE_FORMAT || 'c'
}

module.exports = config
