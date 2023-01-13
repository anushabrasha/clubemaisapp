import { NgModule } from '@angular/core';
import { EncryptEmailPipe } from './encryptEmail/encrypt-email.pipe';
import { EncryptTelephonePipe } from './encryptTelephone/encrypt-telephone.pipe';
import { PtQrFormatPipe } from './ptQrFormat/pt-qr-format.pipe';
import { DateFormaterPipe } from './dateFormater/date-formater.pipe';

@NgModule({
	providers: [
	],
	declarations: [EncryptEmailPipe, EncryptTelephonePipe, PtQrFormatPipe, DateFormaterPipe],
	imports: [],
	exports: [EncryptEmailPipe, EncryptTelephonePipe, PtQrFormatPipe, DateFormaterPipe]
})
export class PipesModule { }
