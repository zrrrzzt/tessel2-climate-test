'use strict'

var Firebase = require('firebase')
var tessel = require('tessel')
var climatelib = require('climate-si7020')
var climate = climatelib.use(tessel.port['A'])
var config = require('./config')

function logDataToFirebase (data) {
  var database = new Firebase(config.FIREBASE_URL + '/data')
  database.push(data)
}

function logErrorToFirebase (error) {
  var database = new Firebase(config.FIREBASE_URL + '/error')
  database.push(error)
}

function handleTemperature (error, temperature) {
  if (error) {
    logErrorToFirebase(error)
  } else {
    climate.readHumidity(function (err, humidity) {
      if (err) {
        logErrorToFirebase(err)
      } else {
        logDataToFirebase({
          temperature: temperature.toFixed(2),
          humidity: humidity.toFixed(2)
        })
      }
      setTimeout(loop, parseInt(config.LOOP_TIMEOUT, 10))
    })
  }
}

function loop () {
  climate.readTemperature(config.TEMPERATURE_FORMAT, handleTemperature)
}

climate.on('ready', function () {
  console.log('Connected to climate module')

  // Loop forever
  setImmediate(loop)
})

climate.on('error', function (err) {
  console.log('error connecting module', err)
})
