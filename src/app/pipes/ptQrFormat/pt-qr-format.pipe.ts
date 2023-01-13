import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ptQrFormat'
})
export class PtQrFormatPipe implements PipeTransform {

  transform(value: any, isDecimal): any {

    if (!value) {
      return ''
    }
    if (isDecimal == 'true') {
      return parseFloat(value).toLocaleString('pt-br', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    } else {
      return Number(value).toLocaleString('pt-br', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
    }
  }

}
