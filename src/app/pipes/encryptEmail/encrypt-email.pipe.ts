import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encryptEmail'
})
export class EncryptEmailPipe implements PipeTransform {

  transform(user_email: any): any {
    if (!user_email) {
      return '---';
    }
    let avg, splitted, part1, part2;
    splitted = user_email.split("@");
    part1 = splitted[0];
    avg = part1.length / 2;
    part1 = part1.substring(0, (part1.length - avg));
    part2 = splitted[1];
    return part1 + "****@" + part2;
  }

}
