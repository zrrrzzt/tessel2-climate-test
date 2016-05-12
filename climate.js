'use strict'

var Firebase = require('firebase')
var tessel = require('tessel')
var climatelib = require('climate-si7020')
var climate = climatelib.use(tessel.port['A'])
var config = require('./config')

function logToFirebase (data) {
  var database = new Firebase(config.FIREBASE_URL + '/data/' + data.type)
  database.push(data)
}

function handleTemperature (error, temperature) {
  if (error) {
    logToFirebase({
      type: 'error',
      reading: 'temperature',
      timestamp: new Date().getTime(),
      error: JSON.stringify(error)
    })
  } else {
    logToFirebase({
      type: 'temperature',
      timestamp: new Date().getTime(),
      temperature: temperature
    })
  }
}

function handleHumidity (error, humitidy) {
  if (error) {
    logToFirebase({
      type: 'error',
      reading: 'humidity',
      timestamp: new Date().getTime(),
      error: JSON.stringify(error)
    })
  } else {
    logToFirebase({
      type: 'humidity',
      timestamp: new Date().getTime(),
      humidity: humitidy
    })
  }
}

function loop () {
  console.log('Logging temperature and humidity')
  climate.readTemperature(handleTemperature)
  climate.readHumidity(handleHumidity)
  setTimeout(loop, parseInt(config.LOOP_TIMEOUT, 10))
}

climate.on('ready', function () {
  console.log('Connected to climate module')

  // Loop forever
  setImmediate(loop)
})

climate.on('error', function (err) {
  console.log('error connecting module', err)
})
