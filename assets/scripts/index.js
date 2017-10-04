'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
let alarmTime
let d
let hours, minutes, year, day, month
let currentTime = hours + ':' + minutes + ' ' + year + '-' + month + '-' + day
// Weather API
let count = 0
let C, F
let temp
let lat
let long
let odd


// C / F Toggle
function toggleTF () {
  const temp = ['F', 'C']
  count++
  odd = count % 2
  $('#FC').html(temp[odd])
}
// Temp Check
function tempCheck () {
  console.log(odd)
  if (odd === 0) {
    console.log(F)
    $('#temp').html(F + ' F')
  } else {
    console.log(C)
    $('#temp').html(C + ' C')
  }
}
// Change Temp Types

$('#tempType').on('click', toggleTF)

const x = document.getElementById('LogLat')

function getLocation () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition)
  } else {
    x.innerHTML = 'Geolocation is not supported by this browser.'
  }
}

function tempature (temp) {
  console.log(temp)
  JSON.stringify(temp)
  console.log(temp)
  C = temp.toFixed(0)
  F = (temp * 1.8 + 32).toFixed(0)
}
// function btnClick() {}

function showPosition (position) {
  lat = position.coords.latitude
  long = position.coords.longitude
  lat = lat.toFixed(2)
  long = long.toFixed(2)
  const api = 'https://fcc-weather-api.glitch.me/api/current?lat=' + lat + '&lon=' + long
  $.ajax({
    url: api,
    type: 'GET',
    success: function (response) {
      temp = response.main.temp
      console.log(temp)
      tempature(temp)
    }
  })
}
getLocation()

$(() => {
  setAPIOrigin(location, config)
  $('#submitInput').on('click', function () {
    let time = document.getElementById('timeInput').value
    let date = document.getElementById('dateInput').value
    console.log(time + ' ' + date)
    alarmTime = time + ' ' + date
    console.log(alarmTime)
    $('#alarm').html(alarmTime)
  })
})

// Temp update
setInterval(function () {
  if (odd === 0) {
    console.log(F)
  } else {
    console.log(C)
  }
}, 5000)

// Alarm Success voiceMessage

function success () {
  let voiceMessage = 'Good  morning  Will  its' + F + '  degrees  fahrenheit'
  tempCheck()
  let msg = new SpeechSynthesisUtterance(voiceMessage)
  window.speechSynthesis.speak(msg)
}

// check every second for matching alarm time
setInterval(function checkForAlarm () {
  d = new Date()
  year = d.getFullYear().toString()
  month = d.getMonth().toString()
  day = d.getDate().toString()
  hours = d.getHours().toString()
  minutes = d.getMinutes().toString()
  if (minutes < 10) {
    minutes = '0' + minutes
  }

  if (year < 10) {
    year = '0' + year
  }

  if (day < 10) {
    day = '0' + day
  }

  if (month < 10) {
    month = '0' + month
  }

  // Update currentTime
  currentTime = hours + ':' + minutes + ' ' + year + '-' + month + '-' + day

  // check current time with alarm time
  if (currentTime === alarmTime) {
    success()
  } else {
    console.log('sorry')
  }
}, 1000)

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
