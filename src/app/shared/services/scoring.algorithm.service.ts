import { Injectable } from '@angular/core';
import { Locus } from '../../shared/models/locus.model';
import { Genotype } from '../../shared/models/genotype.model';
import { Constants } from '../../shared/models/app.constants';
import { DensityData } from '../../shared/models/temp/temp.data';
import { GenotypeService } from "./genotype.service";

@Injectable()
export class ScoringAlgorithmService {
    locusData:Map<string, Genotype> = new Map();

    constructor(private genotypeService: GenotypeService){};
    
    processingData(data:Map<string, Genotype>):void {      
        data.forEach((genotype: Genotype) => {
            this.genotypeService.genotype = genotype;
            this.genotypeService.processingSNPColumns();
            if (genotype.keepCount > Constants.minSamples){
                if(genotype.uCount > 0) {
                    //this.processingUData(genotype);
                    //TODO: ask if we need this block
                    //otherwise remove all data
                }
                
                this.genotypeService.calculateLocusRHO();
                this.genotypeService.calculateDensityData();
                this.genotypeService.findPeaks(Math.floor(0.05 * genotype.density.x.length));
                this.genotypeService.calculateNmEM();
                this.genotypeService.calculateScore();               
            } else {
                //TODO: dispay incorect message
            }

            this.locusData.set(genotype.ID, this.genotypeService.genotype);
        });
    }

    private processingUData(genotype){
        genotype.uData.forEach((locus: Locus[]) => {

        });
    }   
}