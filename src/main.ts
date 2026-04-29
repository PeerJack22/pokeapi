import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SplashScreen } from '@capacitor/splash-screen';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => SplashScreen.hide().catch(() => undefined))
  .catch(err => console.log(err));
