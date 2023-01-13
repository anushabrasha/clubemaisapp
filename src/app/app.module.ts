import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { AlertPopupComponent } from './components/alert-popup/alert-popup.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ReactiveFormsModule } from '@angular/forms';
import { BrMaskerModule } from 'br-mask';
import { Camera } from '@ionic-native/camera/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Network } from '@ionic-native/network/ngx';
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import { AppRate } from '@ionic-native/app-rate/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { PinchZoomModule } from 'ngx-pinch-zoom';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [AlertPopupComponent],
  imports: [
    BrowserModule,
    ComponentsModule,
    HttpClientModule,
    BrMaskerModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    PinchZoomModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    Camera,
    Deeplinks,
    OneSignal,
    BarcodeScanner,
    InAppBrowser,
    SplashScreen,
    WebView,
    AppVersion,
    Network,
    File,
    FileOpener,
    FileTransfer,
    AppRate,
    Base64,
    HTTP,
    DocumentViewer,
    GoogleAnalytics,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ScreenOrientation
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
