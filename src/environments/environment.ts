// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/v1',
  identityUrl: 'https://localhost:6001',
  cookieDomain: 'localhost',
  identityClientId: '6294e6f0-826e-40f3-9937-8907fa7ed376',
  stripePublishableKey: 'pk_test_sZ7XHwwRP724lAqMVd00SccX'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
