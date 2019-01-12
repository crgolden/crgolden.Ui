// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import {
  faHome,
  faSignIn,
  faSignOut,
  faUser,
  faUserPlus,
  faUserLock,
  faAt,
  faEdit,
  faKey,
  faLock,
  faCheck,
  faBox,
  faList,
  faInfoSquare,
  faTrash,
  faPlus,
  faBan,
  faShoppingCart,
  faCartPlus,
  faCashRegister,
  faShoppingBag,
  faDollarSign,
  faExclamation
} from '@fortawesome/pro-light-svg-icons';
import {
  faFacebook,
  faCcVisa,
  faCcAmex,
  faCcMastercard,
  faCcDiscover,
  faCcJcb,
  faCcDinersClub,
  faCcStripe
} from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(
  faHome,
  faSignIn,
  faSignOut,
  faUser,
  faUserPlus,
  faUserLock,
  faAt,
  faEdit,
  faKey,
  faFacebook,
  faLock,
  faCheck,
  faBox,
  faList,
  faInfoSquare,
  faTrash,
  faPlus,
  faBan,
  faShoppingCart,
  faCartPlus,
  faCashRegister,
  faCcVisa,
  faCcAmex,
  faCcMastercard,
  faCcDiscover,
  faCcJcb,
  faCcDinersClub,
  faCcStripe,
  faShoppingBag,
  faDollarSign,
  faExclamation
);

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
