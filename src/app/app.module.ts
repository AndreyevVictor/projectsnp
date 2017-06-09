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
import { GenotypeService } from './shared/services/genotype.service';

import { PolarComponent } from './plots/polar/polar.component';
import { CountsComponent } from './plots/counts/counts.component';
import { DensityComponent } from './plots/density/density.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    UploadDataComponent,
    PolarComponent,
    CountsComponent,
    DensityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    ElectronService,
    UploadService,
    ScoringAlgorithmService,
    GenotypeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
