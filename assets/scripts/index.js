'use strict'
// TODOS

// Delete Alarms Manually from Arr and UI
// Delete Expired Alarms from Arr and UI
// POST Alarms AJAX
// DELETE Alarms AJAX
// GET Alarms AJAX
// USER CRUD AJAX
// USER UI CRUD
// Sort Array by date then time

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')

// Alarm Time
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
let timeForm
let amPm
let countAlarms = 0
let alarmArr0Time
let alarmArr0Date

// C / F Toggle
function toggleTF () {
  const temp = ['F', 'C']
  count++
  odd = count % 2
  $('#FC').html(temp[odd])
}

// Temp Check
function tempCheck () {
  // console.log(odd)
  if (odd === 0) {
    // console.log(F)
    $('#temp').html(F + ' F')
  } else {
    // console.log(C)
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
// Temp convertion
function tempature (temp) {
  // console.log(temp)
  JSON.stringify(temp)
  C = temp.toFixed(0)
  F = (temp * 1.8 + 32).toFixed(0)
}

// Get Long Lat and send AJAX get to weather API
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
      // console.log(weather)
      tempature(temp)
    }
  })
}
getLocation()

$(() => {
  setAPIOrigin(location, config)
  $('#submitInput').on('click', function () {
    countAlarms++
    let time = document.getElementById('timeInput').value
    let date = document.getElementById('dateInput').value
    $('#timeInput').val('')
    $('#dateInput').val('')
    timeForm = time
    timeForm = timeForm.split(':')
    // console.log('SPLIT ' + timeForm[0] + ' ' + timeForm)
    let timeForm1 = parseInt(timeForm[0])
    // console.log(timeForm1 + ' | ' + typeof timeForm1)
    if (timeForm1 > 12) {
      amPm = 'PM'
      timeForm1 = timeForm1 - 12
      // console.log('successful convertion ' + timeForm1)
    } else {
      amPm = 'AM'
    }
    timeForm = timeForm.join(':')
    alarmTime = time + ' ' + date
    alarmArr.push(
      {
        alarmTime: time,
        alarmDate: date,
        alarmNumber: countAlarms
      }
    )
    // console.log(alarmArr)
    let arrTime = hours + ':' + minutes
    let arrDate = year + '-' + month + '-' + day
    alarmArr0Time = alarmArr[0].alarmTime
    alarmArr0Date = alarmArr[0].alarmDate
    tempCheck()
    $('#alarm').append('<li id="' + countAlarms + '">' + date + ' ' + timeForm + '  ' + amPm + '&nbsp;&nbsp;<button id="deleteAlarm' + countAlarms + '">Delete</button>&nbsp;&nbsp;<button id="editAlarm' + countAlarms + '">Edit</button></li>')
    $('#deleteAlarm' + countAlarms).bind('click', function () {
      let li = $(this).parent()
      li.remove()
      console.log(alarmArr[0])
      for (let i = 0; i < alarmArr.length; i++) {
        let index = alarmArr[i].alarmNumber.toString()
        let target = li[0].id
        if (index === target) {
          alarmArr.splice(i, 1)
          console.log('sliced ' + alarmArr)
        }
      }
    })
  })
})

// Temp update
setInterval(function () {
  if (odd === 0) {
    tempCheck()
    $('#weatherType').html(weather)
    CF = F
    celOrFer = 'Fahrenheit'
    // console.log(F)
  } else {
    tempCheck()
    $('#weatherType').html(weather)
    CF = C
    celOrFer = 'Celsius'
    // console.log(C)
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
  console.log(currentTime + ' | ' + alarmArr0Time + ' ' + alarmArr0Date)
  // check current time with alarm time
  if (alarmArr.length > 0) {
    alarmArr0Time = alarmArr[0].alarmTime
    alarmArr0Date = alarmArr[0].alarmDate
    console.log('TRUE' + ' T ' + alarmArr0Time + ' D ' + alarmArr0Date)
  }

  alarmArr.sort(function (a, b) {
    const dateA = new Date(a.alarmDate)
    const dateB = new Date(b.alarmDate)
    const date = dateA - dateB
    if (date !== 0) {
      return date
    }
    alarmArr.sort(function (a, b) {
      return b.alarmTime < a.alarmTime
    })
  })
  // if (alarmArr.length > 1) {
  //   for (let i = 0; i < alarmArr.length; i++) {
  //     let j = 0
  //     if ((i + 1) < alarmArr.length) {
  //       j = i + 1
  //     }
  //   }
  // }

  console.log('Sort ' + JSON.stringify(alarmArr))
  let alaramArr0 = alarmArr0Time + ' ' + alarmArr0Date
  if (currentTime === alaramArr0) {
    success()
  } else {
    // console.log('sorry')
  }
  // show lat long
  $('#LogLat').html('Latitude ' + lat + ' ' + 'Longitude ' + long)
  // console.log(weather)
}, 1000)

// Alarm Success voiceMessage

function success () {
  let voiceMessage = 'Good  morning  Will  it is ' + timeForm + ' ' + amPm + ' todays date is' + date + ' and its ' + CF + '  degrees' + celOrFer + 'and' + weather + 'outside,  Have a great Day'
  let msg = new SpeechSynthesisUtterance(voiceMessage)
  window.speechSynthesis.speak(msg)
  // console.log(alarmArr)
  setTimeout(function () {
    window.speechSynthesis.cancel(msg)
  }, 30000)
}

$('#test').on('click', success)

// console.log(currentTime.split(':'))

// 18:53 2017-09-04

//

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
