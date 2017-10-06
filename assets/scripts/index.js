'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
let alarmTime
let d
let hours, minutes, year, day, month
let currentTime = hours + ':' + minutes + ' ' + year + '-' + month + '-' + day
// Weather API
let count = 1
let C, F, CF
let temp
let lat
let long
let odd
let date
let time
let celOrFer
let weather
let alarmArr = []

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
      weather = response.weather[0].description
      $('#weatherType').html(weather)
      console.log(weather)
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
    // alarmArr.push(
    //   {
    //     alarmTime: time,
    //     alarmDate: date
    //   }
    // )
    // alarmArr.sort()
    let arrTime = hours + ':' + minutes
    let arrDate = year + '-' + month + '-' + day
    // for (let i = 0; i < alarmArr.length; i++) {
    //   if (alarmArr[i].alarmTime < arrTime && alarmArr[i].alarmDate < arrDate) {
    //     alarmArr.shift()
    //     console.log(alarmArr)
    //   }
    // }
    // console.log(alarmTime)
    tempCheck()
    $('#alarm').append('<li>' + date + ' ' + time + '&nbsp;&nbsp;<button>Delete</button>&nbsp;&nbsp;<button>Edit</button></li><br>')
  })
})

// Temp update
setInterval(function () {
  if (odd === 0) {
    tempCheck()
    $('#weatherType').html(weather)
    CF = F
    celOrFer = 'Fahrenheit'
    console.log(F)
  } else {
    tempCheck()
    $('#weatherType').html(weather)
    CF = C
    celOrFer = 'Celsius'
    console.log(C)
  }
}, 1000)

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
  if (hours < 10) {
    hours = '0' + hours
  }

  // Update currentTime
  currentTime = hours + ':' + minutes + ' ' + year + '-' + month + '-' + day
  date = day + '/' + month + '/' + year
  time = hours + ':' + minutes
  console.log(currentTime + ' | ' + alarmTime)
  // check current time with alarm time
  if (currentTime === alarmTime) {
    success()
  } else {
    console.log('sorry')
  }
  // show lat long
  $('#LogLat').html('Latitude ' + lat + ' ' + 'Longitude ' + long)
  console.log(weather)
}, 1000)

// Alarm Success voiceMessage

function success () {
  let voiceMessage = 'Good  morning  Will  it is ' + time + ' todays date is' + date + ' and its ' + CF + '  degrees' + celOrFer + 'outside,  Have a great Day'
  let msg = new SpeechSynthesisUtterance(voiceMessage)
  window.speechSynthesis.speak(msg)
  setTimeout(function () {
    window.speechSynthesis.cancel(msg)
  }, 40000)
}

// console.log(currentTime.split(':'))

// 18:53 2017-09-04

//

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
