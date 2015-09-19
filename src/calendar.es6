class Calendar {
  constructor({ container = '',
                activeDateClass = '',
                startDate = new Date()} = {}) {
    this.container = container
    this.$container = document.querySelector(container)
    this.activeDateClass = activeDateClass

    this.selectedDate = startDate
    this.currentMonth = startDate
    this.currentMonthDays = []

    this.monthsNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]

    this.generateInitialMarkupAndBootstrap()
  }

  buildCurrentMonthDays() {
    var curYear = this.currentMonth.getFullYear(),
        curMonth = this.currentMonth.getMonth(),
        firstMonthDay = new Date(curYear, curMonth, 1),
        lastMonthDay = new Date(curYear, curMonth + 1, 0)

    this.currentMonthDays = []

    for (let i = 1, lastDay = lastMonthDay.getDate(); i <= lastDay; i++) {
      this.currentMonthDays.push(new Date(curYear, curMonth, i))
    }

    for (let i = 0, daysBack = -firstMonthDay.getUTCDay(); i > daysBack; i--) {
      this.currentMonthDays.unshift(new Date(curYear, curMonth, i))
      console.log(`${i}   ${daysBack}`)
    }

    for (let i = 1, daysForward = 7 - lastMonthDay.getUTCDay(); i < daysForward; i++) {
      this.currentMonthDays.push(new Date(curYear, curMonth + 1, i))
    }
  }

  getDayClass(date) {
    var classes = ['wc-calendar__days-list__item']

    var curYear = this.currentMonth.getFullYear(),
        curMonth = this.currentMonth.getMonth(),
        firstMonthDay = new Date(curYear, curMonth, 1),
        lastMonthDay = new Date(curYear, curMonth + 1, 0)

    if (date.toDateString() === this.selectedDate.toDateString()) {
      classes = classes.concat(['wc-calendar__days-list__item--active', this.activeDateClass])
    }

    if (date.getMonth() < this.currentMonth.getMonth()) {
      classes.push('wc-calendar__days-list__item--prev-month')
    }

    if (date.getMonth() > this.currentMonth.getMonth()) {
      classes.push('wc-calendar__days-list__item--next-month')
    }

    return classes.join(' ')
  }

  getFormattedDate(date) {
    return `${date.getFullYear()} ${this.monthsNames[date.getMonth()]}`
  }

  generateDaysMarkup() {
    var days = []

    this.buildCurrentMonthDays()

    this.currentMonthDays.forEach(function(day, index) {
      days.push(`<li data-index="${index}" class="${this.getDayClass(day)}">${day.getDate()}</li>`)
    }.bind(this))

    return days.join('')
  }

  refreshCalendar() {
    this.$container.querySelector('.wc-calendar__days-list').innerHTML = this.generateDaysMarkup()
    this.$container.querySelector('.wc-calendar__header__date').innerHTML = this.getFormattedDate(this.currentMonth)
  }

  prevMonth() {
    var curYear = this.currentMonth.getFullYear(),
        curMonth = this.currentMonth.getMonth()

    this.currentMonth = new Date(curYear, curMonth - 1, 1)

    this.refreshCalendar()
  }

  nextMonth() {
    var curYear = this.currentMonth.getFullYear(),
        curMonth = this.currentMonth.getMonth()

    this.currentMonth = new Date(curYear, curMonth + 1, 1)

    this.refreshCalendar()
  }

  getDayIndexByDate(date) {
    for (let i = 0; i < this.currentMonthDays.length; i++) {
      if (this.currentMonthDays[i].toDateString() === date.toDateString()) {
        return i
      }
    }
    return -1
  }

  selectDay(event) {
    var $target = event.target

    if ($target.classList.contains('wc-calendar__days-list__item')) {
      let $activeItem = this.$container.querySelector('.wc-calendar__days-list__item--active')
      this.selectedDate = this.currentMonthDays[$target.dataset.index]

      if ($activeItem) {
        $activeItem.classList.remove('wc-calendar__days-list__item--active')
      }

      if ($target.classList.contains('wc-calendar__days-list__item--prev-month')
          || $target.classList.contains('wc-calendar__days-list__item--next-month')) {
        if ($target.classList.contains('wc-calendar__days-list__item--prev-month')) {
          this.prevMonth()
        }

        if ($target.classList.contains('wc-calendar__days-list__item--next-month')) {
          this.nextMonth()
        }

        $target = this.$container.querySelector(`[data-index=${this.getDayIndexByDate(this.selectedDate)}]`)
      }

      $target.classList.add('wc-calendar__days-list__item--active')
    }
  }

  generateInitialMarkupAndBootstrap() {
    this.$container.innerHTML = `
<div class="wc-calendar__header">
  <button class="wc-calendar__btn wc-calendar__btn--prev">Prev</button>
  <div class="wc-calendar__header__date">${this.getFormattedDate(this.currentMonth)}</div>
  <button class="wc-calendar__btn wc-calendar__btn--next">Next</button>
</div>
<div class="wc-calendar__body">
  <ul class="wc-calendar__days-names">
    <li class="wc-calendar__days-names__item">Mon</li>
    <li class="wc-calendar__days-names__item">Tue</li>
    <li class="wc-calendar__days-names__item">Wed</li>
    <li class="wc-calendar__days-names__item">Thu</li>
    <li class="wc-calendar__days-names__item">Fri</li>
    <li class="wc-calendar__days-names__item">Sat</li>
    <li class="wc-calendar__days-names__item">Sun</li>
  </ul>
  <ul class="wc-calendar__days-list">
    ${this.generateDaysMarkup()}
  </ul>
</div>
`
    this.$container.querySelector('.wc-calendar__btn--prev')
                .addEventListener('click', this.prevMonth.bind(this))
    this.$container.querySelector('.wc-calendar__btn--next')
                .addEventListener('click', this.nextMonth.bind(this))
    this.$container.querySelector('.wc-calendar__days-list')
                .addEventListener('click', this.selectDay.bind(this))
  }
}
