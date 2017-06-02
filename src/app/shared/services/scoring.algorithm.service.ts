import { Injectable } from '@angular/core';
import { Locus } from '../../shared/models/locus.model';

@Injectable()
export class ScoringAlgorithmService {
    locusData:Locus[] = new Array<Locus>();
    
    processData(data:Locus[]):void {      
       this.locusData = data;
       
    }
}