import { Injectable } from '@angular/core';
import { Locus } from '../../shared/models/locus.model';

@Injectable()
export class ScoringAlgorithmService {
    locusData:Map<string, Array<Locus>> = new Map();
    
    processData(data:Map<string, Array<Locus>>):void {      
       this.locusData = data;
    }
}