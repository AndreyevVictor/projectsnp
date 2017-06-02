import 'zone.js';
import 'reflect-metadata';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './root/app.component';
import { MenuComponent } from './menu/menu.component';
import { UploadDataComponent } from './upload/data/upload.data.component';

import { ElectronService } from './providers/electron.service';
import { UploadService } from './shared/services/upload.service';
import { ScoringAlgorithmService } from './shared/services/scoring.algorithm.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    UploadDataComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    ElectronService,
    UploadService,
    ScoringAlgorithmService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
