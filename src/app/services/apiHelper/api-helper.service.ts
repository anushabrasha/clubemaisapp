import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  public baseUrl = environment['baseURL'];
  private aprendaURL = environment['aprendaURL'];
  

  public cepUrl = 'https://viacep.com.br/ws/';
  appVersionNumber;

  constructor(
    public http: HttpClient,
    private appVersion: AppVersion,
    private platform: Platform,
    private httpNGX: HTTP
  ) {
  }

  loadAppInfo() {
    this.appVersion.getVersionNumber().then(n => this.appVersionNumber = n);
  }

  getCepDetail(cep) {
    let url = this.cepUrl + cep + '/json/';
    return this.http.get(url);
  }

  post(endpoint, data) {
    console.log('App Info', this.appVersionNumber);
    let postUrl = this.baseUrl + endpoint;
    let token = JSON.parse(localStorage.getItem("x-auth-sb"));
    if (token) {
      let headers = new HttpHeaders().set("x-auth-sb", token);
      return this.http.post(postUrl, data, { headers: headers });
    } else {
      return this.http.post(postUrl, data);
    }
  }

  postTokenWithPlugin(endpoint, data?) {
    let header = {};
    let token = JSON.parse(localStorage.getItem("x-auth-sb"));
    let postUrl = this.baseUrl + endpoint;
    if (!data) {
      data = {};
    }
    if (token) {
      header = { "x-auth-sb": token };
    }
    console.log("headers", header);
    console.log("datas", data)
    return this.httpNGX.post(postUrl, data, header);
  }

  getWithPlugin(endpoint, data?) {
    let header = {};
    let token = JSON.parse(localStorage.getItem("x-auth-sb"));
    let postUrl = this.baseUrl + endpoint;
    if (!data) {
      data = {};
    }
    if (token) {
      header = { "x-auth-sb": token };
    }
    return this.httpNGX.get(postUrl, data, header);
  }

  postWithPlugin(endpoint, data?) {
    let header = {};
    let token = JSON.parse(localStorage.getItem("x-auth-sb"));
    let postUrl = this.baseUrl + endpoint;
    if (!data) {
      data = {};
    }
    if (token) {
      header = { "x-auth-sb": token };
    }
    return this.httpNGX.post(postUrl, data, header);
  }

  get(endpoint, data?) {
    let url = this.baseUrl + endpoint;
    let paramHolder;
    let requestOption = {};
    if (data) {
      data.appVersion = this.appVersionNumber;
      data.platform = this.platform.platforms();
      requestOption['params'] = data;
    } else {
      data = {
        appVersion: this.appVersionNumber,
        platform: this.platform.platforms()
      }
    }
    if (data.platform instanceof Array && data.platform.length > 0) {
      data.platform = data.platform[0];
    }
    requestOption['params'] = data;
    let token = JSON.parse(localStorage.getItem("x-auth-sb"));
    if (token) {
      let headers = new HttpHeaders().set("x-auth-sb", token);
      requestOption['headers'] = headers;
    }
    // if (token) {
    //   let headers = new HttpHeaders().set("x-auth-sb", token);
    //   return this.http.get(url, { headers: headers, params: paramHolder });
    // } else {
    //   return this.http.get(url);
    // }
    return this.http.get(url, requestOption);

  }

  aprendaPost(endpoint, data) {
    if (!this.aprendaURL) {
      return this.http.post('', {});
    }
    let postUrl = this.aprendaURL + endpoint;
    let token = JSON.parse(localStorage.getItem("x-auth-sb"));
    if (token) {
      let headers = new HttpHeaders().set("x-auth-sb", token);
      return this.http.post(postUrl, data, { headers: headers });
    } else {
      return this.http.post(postUrl, data);
    }
  }

  aprendaGet(endpoint, data?) {
    if (!this.aprendaURL) {
      return this.http.get('', {});
    }
    let url = this.aprendaURL + endpoint;
    let requestOption = {};
    if (data) {
      requestOption['params'] = data;
    }
    let token = JSON.parse(localStorage.getItem("x-auth-sb"));
    if (token) {
      let headers = new HttpHeaders().set("x-auth-sb", token);
      requestOption['headers'] = headers;
    }
    return this.http.get(url, requestOption);
  }

  getUsingURL(url) {
    let requestOption = {};
    let token = JSON.parse(localStorage.getItem("x-auth-sb"));
    if (token && url.includes('sky')) {
      let headers = new HttpHeaders().set("x-auth-sb", token);
      requestOption['headers'] = headers;
    }
    return this.http.get(url, requestOption);
  }

  put(endpoint, data) {
    console.log('App Info', this.appVersionNumber);
    let postUrl = this.baseUrl + endpoint;
    let token = JSON.parse(localStorage.getItem("x-auth-sb"));
    data.appVersion = this.appVersionNumber;
    data.platform = this.platform.platforms();
    if (token) {
      let headers = new HttpHeaders().set("x-auth-sb", token);
      return this.http.put(postUrl, data, { headers: headers });
    } else {
      return this.http.put(postUrl, data);
    }
  }

  delete(endpoint) {
    let postUrl = this.baseUrl + endpoint;
    let token = JSON.parse(localStorage.getItem("x-auth-sb"));
    let headers = new HttpHeaders().set("x-auth-sb", token);
    return this.http.delete(postUrl, { headers: headers });
  }
}
