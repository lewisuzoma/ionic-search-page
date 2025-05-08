import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxsModule, provideStore } from '@ngxs/store';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import {LOCAL_STORAGE_ENGINE, SESSION_STORAGE_ENGINE, withNgxsStoragePlugin} from '@ngxs/storage-plugin';
import {decrypt, encrypt} from "@app-shared/core/utils/storage.util";
import { environment } from './environments/environment.prod';
import { ProgramState } from '@app-shared/core/states/program/program.state';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(
      [
        BrowserAnimationsModule,
      ],
      NgxsModule.forRoot()
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore(
      [
        ProgramState
      ],
      withNgxsReduxDevtoolsPlugin({
        disabled: environment.production
      }),
      withNgxsStoragePlugin({
        keys: [
          {
            key: 'programState.program',
            engine: SESSION_STORAGE_ENGINE,
          },
        ],
        serialize: (value) => encrypt(value),
        deserialize: (value) => decrypt(value),
      }),
      withNgxsLoggerPlugin({
        disabled: environment.production,
      })
    ),
  ],
});
