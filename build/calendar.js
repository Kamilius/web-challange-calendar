'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Calendar = (function () {
  function Calendar() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$container = _ref.container;
    var container = _ref$container === undefined ? '' : _ref$container;
    var _ref$activeDateClass = _ref.activeDateClass;
    var activeDateClass = _ref$activeDateClass === undefined ? '' : _ref$activeDateClass;
    var _ref$startDate = _ref.startDate;
    var startDate = _ref$startDate === undefined ? new Date() : _ref$startDate;

    _classCallCheck(this, Calendar);

    this.container = container;
    this.$container = document.querySelector(container);
    this.activeDateClass = activeDateClass;

    this.selectedDate = startDate;
    this.currentMonth = startDate;
    this.currentMonthDays = [];

    this.monthsNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    this.generateInitialMarkupAndBootstrap();
  }

  _createClass(Calendar, [{
    key: 'buildCurrentMonthDays',
    value: function buildCurrentMonthDays() {
      var curYear = this.currentMonth.getFullYear(),
          curMonth = this.currentMonth.getMonth(),
          firstMonthDay = new Date(curYear, curMonth, 1),
          lastMonthDay = new Date(curYear, curMonth + 1, 0);

      this.currentMonthDays = [];

      for (var i = 1, lastDay = lastMonthDay.getDate(); i <= lastDay; i++) {
        this.currentMonthDays.push(new Date(curYear, curMonth, i));
      }

      for (var i = 0, daysBack = -firstMonthDay.getUTCDay(); i > daysBack; i--) {
        this.currentMonthDays.unshift(new Date(curYear, curMonth, i));
        console.log(i + '   ' + daysBack);
      }

      for (var i = 1, daysForward = 7 - lastMonthDay.getUTCDay(); i < daysForward; i++) {
        this.currentMonthDays.push(new Date(curYear, curMonth + 1, i));
      }
    }
  }, {
    key: 'getDayClass',
    value: function getDayClass(date) {
      var classes = ['wc-calendar__days-list__item'];

      var curYear = this.currentMonth.getFullYear(),
          curMonth = this.currentMonth.getMonth(),
          firstMonthDay = new Date(curYear, curMonth, 1),
          lastMonthDay = new Date(curYear, curMonth + 1, 0);

      if (date.toDateString() === this.selectedDate.toDateString()) {
        classes = classes.concat(['wc-calendar__days-list__item--active', this.activeDateClass]);
      }

      if (date.getMonth() < this.currentMonth.getMonth()) {
        classes.push('wc-calendar__days-list__item--prev-month');
      }

      if (date.getMonth() > this.currentMonth.getMonth()) {
        classes.push('wc-calendar__days-list__item--next-month');
      }

      return classes.join(' ');
    }
  }, {
    key: 'getFormattedDate',
    value: function getFormattedDate(date) {
      return date.getFullYear() + ' ' + this.monthsNames[date.getMonth()];
    }
  }, {
    key: 'generateDaysMarkup',
    value: function generateDaysMarkup() {
      var days = [];

      this.buildCurrentMonthDays();

      this.currentMonthDays.forEach((function (day, index) {
        days.push('<li data-index="' + index + '" class="' + this.getDayClass(day) + '">' + day.getDate() + '</li>');
      }).bind(this));

      return days.join('');
    }
  }, {
    key: 'refreshCalendar',
    value: function refreshCalendar() {
      this.$container.querySelector('.wc-calendar__days-list').innerHTML = this.generateDaysMarkup();
      this.$container.querySelector('.wc-calendar__header__date').innerHTML = this.getFormattedDate(this.currentMonth);
    }
  }, {
    key: 'prevMonth',
    value: function prevMonth() {
      var curYear = this.currentMonth.getFullYear(),
          curMonth = this.currentMonth.getMonth();

      this.currentMonth = new Date(curYear, curMonth - 1, 1);

      this.refreshCalendar();
    }
  }, {
    key: 'nextMonth',
    value: function nextMonth() {
      var curYear = this.currentMonth.getFullYear(),
          curMonth = this.currentMonth.getMonth();

      this.currentMonth = new Date(curYear, curMonth + 1, 1);

      this.refreshCalendar();
    }
  }, {
    key: 'getDayIndexByDate',
    value: function getDayIndexByDate(date) {
      for (var i = 0; i < this.currentMonthDays.length; i++) {
        if (this.currentMonthDays[i].toDateString() === date.toDateString()) {
          return i;
        }
      }
      return -1;
    }
  }, {
    key: 'selectDay',
    value: function selectDay(event) {
      var $target = event.target;

      if ($target.classList.contains('wc-calendar__days-list__item')) {
        var $activeItem = this.$container.querySelector('.wc-calendar__days-list__item--active');
        this.selectedDate = this.currentMonthDays[$target.dataset.index];

        if ($activeItem) {
          $activeItem.classList.remove('wc-calendar__days-list__item--active');
        }

        if ($target.classList.contains('wc-calendar__days-list__item--prev-month') || $target.classList.contains('wc-calendar__days-list__item--next-month')) {
          if ($target.classList.contains('wc-calendar__days-list__item--prev-month')) {
            this.prevMonth();
          }

          if ($target.classList.contains('wc-calendar__days-list__item--next-month')) {
            this.nextMonth();
          }

          $target = this.$container.querySelector('[data-index=' + this.getDayIndexByDate(this.selectedDate) + ']');
        }

        $target.classList.add('wc-calendar__days-list__item--active');
      }
    }
  }, {
    key: 'generateInitialMarkupAndBootstrap',
    value: function generateInitialMarkupAndBootstrap() {
      this.$container.innerHTML = '\n<div class="wc-calendar__header">\n  <button class="wc-calendar__btn wc-calendar__btn--prev">Prev</button>\n  <div class="wc-calendar__header__date">' + this.getFormattedDate(this.currentMonth) + '</div>\n  <button class="wc-calendar__btn wc-calendar__btn--next">Next</button>\n</div>\n<div class="wc-calendar__body">\n  <ul class="wc-calendar__days-names">\n    <li class="wc-calendar__days-names__item">Mon</li>\n    <li class="wc-calendar__days-names__item">Tue</li>\n    <li class="wc-calendar__days-names__item">Wed</li>\n    <li class="wc-calendar__days-names__item">Thu</li>\n    <li class="wc-calendar__days-names__item">Fri</li>\n    <li class="wc-calendar__days-names__item">Sat</li>\n    <li class="wc-calendar__days-names__item">Sun</li>\n  </ul>\n  <ul class="wc-calendar__days-list">\n    ' + this.generateDaysMarkup() + '\n  </ul>\n</div>\n';
      this.$container.querySelector('.wc-calendar__btn--prev').addEventListener('click', this.prevMonth.bind(this));
      this.$container.querySelector('.wc-calendar__btn--next').addEventListener('click', this.nextMonth.bind(this));
      this.$container.querySelector('.wc-calendar__days-list').addEventListener('click', this.selectDay.bind(this));
    }
  }]);

  return Calendar;
})();