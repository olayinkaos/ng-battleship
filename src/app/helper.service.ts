import { Injectable } from '@angular/core';

@Injectable()
export class HelperService {

  constructor() { }

  getQueryParam(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  getUniqueId () {
    return 'presence-' + Math.random().toString(36).substr(2, 8);
  }
}
