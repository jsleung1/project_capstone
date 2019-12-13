import {Component, Injectable} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

const I18N_VALUES = {
  en: {
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  zh_Hant: {
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  },
  zh_Hans: {
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  },
};

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private translate: TranslateService) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this.translate.currentLang].weekdays[weekday - 1];
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES[this.translate.currentLang].months[month - 1];
  }

  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }

}
