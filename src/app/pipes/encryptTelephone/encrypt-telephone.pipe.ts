import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encryptTelephone'
})
export class EncryptTelephonePipe implements PipeTransform {

  transform(user_Telephone: any): any {
    if (!user_Telephone) {
      return '';
    }
    let avg, toReplaceString, encriptedValue;
    avg = (user_Telephone.length / 2) + 5;
    toReplaceString = user_Telephone.slice(4, avg);
    encriptedValue = user_Telephone.replace(toReplaceString, '*****');
    return encriptedValue;
  }

}
