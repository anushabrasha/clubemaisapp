import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormater'
})
export class DateFormaterPipe implements PipeTransform {

  transform(date: any, isForAgo?, isforMission?): any {
    if (!date) {
      return '';
    } else if (isForAgo == 'true') {
      let agoFormat = moment.utc(date).local().fromNow(true);
      return 'Há ' + agoFormat;
    } else if (isforMission == 'true') {
      return moment(date).format("DD/MM/YYYY");
    } else {
      return moment(date).format("DD-MM-YYYY");
    }
  }

}
