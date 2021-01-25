import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NBodyMainComponent } from './nbody-main/nbody-main.component';

@NgModule({
  declarations: [
    AppComponent,
    NBodyMainComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
