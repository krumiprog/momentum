const time = document.querySelector('.time')
const date = document.querySelector('.date')
const greeting = document.querySelector('.greeting')
const name = document.querySelector('.name')
const focus = document.querySelector('.focus')
const changeBlock = document.querySelector('.bg-change')
const changeTitle = document.querySelector('.bg-change__title')
const nextBtn = document.querySelector('.btn-next')

const place = document.querySelector('.weather__place')
const weatherIcon = document.querySelector('.weather__icon')
const description = document.querySelector('.weather__description')
const temperature = document.querySelector('.weather__temperature')
const pressure = document.querySelector('.weather__pressure span')
const humidity = document.querySelector('.weather__humidity span')
const wind = document.querySelector('.weather__wind span')

const quote = document.querySelector('.rand-quote__text')
const author = document.querySelector('.rand-quote__author')
const quoteBtn = document.querySelector('.rand-quote__update')

const TOTAL_IMG = 24
const QUOTE_MAX_LEN = 150
const WEATHER_KEY = '97dc090125121c8ff79511a40f0815dd'
const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December']
let bgImages = []
let indexCurImg = -1
let prevHour = 0

function init() {
  prevHour = indexCurImg = (new Date()).getHours()
  randBgImages()
  setGreet()
  getImage()
  initWeather()
  getName()
  getFocus()
  getQuote()
  showTime()
}

function randBgImages() {
  bgImages = []
  for (let i = 0; i < 4; i++) {
    let partArr = []
    for (let j = 0; j < 6; j++) {
      let index = 0
      do {
        index = Math.floor(Math.random() * 20 + 1)
      } while (partArr.indexOf(index) !== -1)
      partArr.push(index)
    }
    bgImages = [...bgImages, ...partArr]
  }
}

function getImage() {
  let imgSrc = `assets/images/`
  let i = bgImages[indexCurImg]
  let nameImg = i < 10 ? '0' + i : '' + i

  if (indexCurImg >= 0 && indexCurImg < 6) {
    imgSrc += `night/${nameImg}.jpg`
  } else if (indexCurImg >= 6 && indexCurImg < 12) {
    imgSrc += `morning/${nameImg}.jpg`
  } else if (indexCurImg >= 12 && indexCurImg < 18) {
    imgSrc += `day/${nameImg}.jpg`
  } else {
    imgSrc += `evening/${nameImg}.jpg`
  }
  viewBgImage(imgSrc)
} 

function viewBgImage(data) {
  let body = document.querySelector('body')
  let src = data
  let img = document.createElement('img')
  img.src = src
  img.onload = () => {      
    body.style.backgroundImage = `url(${src})`
  }
}

function showTime() {
  let today = new Date()
  let month = today.getMonth()
  let monthDay = today.getDate()
  let weekDay = today.getDay()
  let hour = today.getHours()
  let min = today.getMinutes()
  let sec = today.getSeconds()

  if (prevHour !== hour) {
    if (hour === 0) {
      randBgImages()
    }
    indexCurImg = hour
    setGreet()
    getImage()
    prevHour = hour
  }

  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`
  date.innerHTML = `${WEEK_DAYS[weekDay]}, ${MONTHS[month]} ${monthDay}`
  setTimeout(showTime, 1000);
}

function setGreet() {
  if (indexCurImg >= 0 && indexCurImg < 6) {
    greeting.textContent = 'Good Night, '
  } else if (indexCurImg >= 6 && indexCurImg < 12) {
    greeting.textContent = 'Good Morning, '
  } else if (indexCurImg >= 12 && indexCurImg < 18) {
    greeting.textContent = 'Good Afternoon, '
  } else {
    greeting.textContent = 'Good Evening, '
  }
}

function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n
}

function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
  } else {
    name.textContent = localStorage.getItem('name')
  }
}

function setName(e) {
  if (e.type === 'keypress') {
    if (e.which == 13 || e.keyCode == 13) {
      if (e.target.innerText.trim().length === 0) {
        name.blur()
        getName()
        return
      }
      localStorage.setItem('name', e.target.innerText)
      name.blur()
    }
  } else {
    getName()
  }
}

function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Enter Focus]'
  } else {
    focus.textContent = localStorage.getItem('focus')
  }
}

function setFocus(e) {
  if (e.type === 'keypress') {
    if (e.which == 13 || e.keyCode == 13) {
      if (e.target.innerText.trim().length === 0) {
        focus.blur()
        getFocus()
        return
      }
      localStorage.setItem('focus', e.target.innerText)
      focus.blur()
    }
  } else {
    getFocus()
  }
}

function initWeather() {
  if (localStorage.getItem('place') === null) {
    setEmptyFields()
    place.textContent = '[Enter Location]'
  } else {
    place.textContent = localStorage.getItem('place')
    getWeather(place.textContent)
  }
}

function setEmptyFields() {
  weatherIcon.className = 'weather__icon owf'
  description.textContent = ''
  temperature.textContent = `[empty]`
  pressure.textContent = `[empty]`
  humidity.textContent = `[empty]`
  wind.textContent = `[empty]`
}

function getPlace() {
  if (localStorage.getItem('place') === null) {
    setEmptyFields()
    place.textContent = '[Enter Location]'
  } else {
    getWeather(localStorage.getItem('place'))
  }
}

function setPlace(e) {
  if (e.type === 'keypress') {
    if (e.which == 13 || e.keyCode == 13) {
      if (e.target.innerText.trim().length === 0) {
        place.blur()
        getPlace()
        return
      }
      let namePlace  = e.target.innerText
      place.blur()
      getWeather(namePlace)
    }
  } else {
    getPlace()
  }
}

function setPlaceBlur() {
  if (localStorage.getItem('place') === null) {
    setEmptyFields()
    place.textContent = '[Enter Location]'
  } else if (localStorage.getItem('place' === place.textContent)) {
    return
  } else {
    getWeather(localStorage.getItem('place'))
  }
}

async function getWeather(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`
  await fetch(url)
    .then(response => response.json())
    .then(json => {
      weatherIcon.className = 'weather__icon owf'
      weatherIcon.classList.add(`owf-${json.weather[0].id}`)
      description.textContent = json.weather[0].description
      temperature.textContent = `${json.main.temp.toFixed(0)}°C`
      pressure.textContent = `${json.main.pressure}hPa`
      humidity.textContent = `${json.main.humidity}%`
      wind.textContent = `${json.wind.speed}m/s`

      localStorage.setItem('place', city)
      place.textContent = city
    })
    .catch(error => {
      setEmptyFields()
      place.textContent = '[Location not found]'
    })
}

async function getQuote() {
  quoteBtn.classList.add('rotating')
  let quoteText = ''
  let quoteAuthor = ''
  do {
    await fetch('https://quote-garden.herokuapp.com/api/v2/quotes/random')
      .then(response => response.json())
      .then(json => {
        quoteText = json.quote.quoteText
        quoteAuthor = json.quote.quoteAuthor
      })
  } while (quoteText.length > QUOTE_MAX_LEN)
  quote.innerText = `“${quoteText}”`
  author.innerText = quoteAuthor
  quoteBtn.classList.remove('rotating')
}

changeBlock.addEventListener('mouseover', () => {
  changeTitle.style.display = 'block'
})

changeBlock.addEventListener('mouseout', () => {
  changeTitle.style.display = 'none'
})

nextBtn.addEventListener('click', () => {
  nextBtn.classList.add('rotating')
  indexCurImg = ++indexCurImg % bgImages.length
  nextBtn.disabled = true
  getImage()
  setTimeout(() => {
    nextBtn.disabled = false
    nextBtn.classList.remove('rotating')
  }, 1000)
})

quoteBtn.addEventListener('click', () => {
  getQuote()
})

place.addEventListener('keypress', setPlace)
place.addEventListener('blur', setPlace)
place.addEventListener('click', () => {
  place.textContent = ''
})

name.addEventListener('keypress', setName)
name.addEventListener('blur', setName)
name.addEventListener('click', () => {
  name.textContent = ''
})

focus.addEventListener('keypress', setFocus)
focus.addEventListener('blur', setFocus)
focus.addEventListener('click', () => {
  focus.textContent = ''
})

init()