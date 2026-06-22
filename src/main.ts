import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEnIn from '@angular/common/locales/en-IN';

import { App } from './app/app';
import { routes } from './app/app.routes';

registerLocaleData(localeEnIn);

const savedTheme = localStorage.getItem('marketcart-theme');

if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark-mode');
} else {
  document.documentElement.classList.remove('dark-mode');
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
