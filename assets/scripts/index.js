'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
let alarmTime
let d
let hours, minutes, year, day, month
let currentTime = hours + ':' + minutes + ' ' + year + '-' + month + '-' + day
// On Load set click handler for alarm input
$(() => {
  setAPIOrigin(location, config)
  $('#submitInput').on('click', function () {
    let time = document.getElementById('timeInput').value
    let date = document.getElementById('dateInput').value
    alarmTime = time + ' ' + date
    console.log(alarmTime)
    $('#alarm').html(alarmTime)
  })
})

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

function success () {
  // const audio = new Audio('audio_file.mp3')
  // audio.play()
  console.log('Alert')
  alert('Wake Up')
}

$('#test').on('click', success)
// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
