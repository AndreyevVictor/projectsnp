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
import { UtilsService } from "./shared/helpers/utils.service";

import { StylePipe } from './shared/pipes/style.pipe';


import { PolarComponent } from './plots/polar/polar.component';
import { CountsComponent } from './plots/counts/counts.component';
import { DensityComponent } from './plots/density/density.component';

import {TableComponent} from './table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    UploadDataComponent,
    PolarComponent,
    CountsComponent,
    DensityComponent,
    TableComponent,
    StylePipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    ElectronService,
    UploadService,
    ScoringAlgorithmService,
    GenotypeService,
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
