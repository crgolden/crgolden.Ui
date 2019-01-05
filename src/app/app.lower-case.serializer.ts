import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class LowerCaseUrlSerializer extends DefaultUrlSerializer {

  parse(url: string): UrlTree {
    const fragmentStart = url.indexOf('#');
    const queryStart = url.indexOf('?');
    let leftPart: string;
    if (fragmentStart >= 0) {
      leftPart = url.substring(0, fragmentStart);
    } else if (queryStart >= 0) {
      leftPart = url.substring(0, queryStart);
    } else {
      return super.parse(url.toLowerCase());
    }
    if (typeof leftPart === 'string') {
      url.replace(leftPart, leftPart.toLowerCase());
    }
    return super.parse(url);
  }
}
