import { Injectable } from '@angular/core';
import { Locus } from '../../shared/models/locus.model';
import { Genotype } from '../../shared/models/genotype.model';
import { Constants } from '../../shared/models/app.constants';

@Injectable()
export class ScoringAlgorithmService {
    locusData:Map<string, Genotype> = new Map();
    
    processData(data:Map<string, Genotype>):void {      
        data.forEach((genotype: Genotype) => {
            this.processingSNPColumns(genotype);
            if (genotype.keepCount > Constants.minSamples){
                if(genotype.uCount > 0) {
                    //this.processingUData(genotype);
                    //TODO: ask if we need this block
                    //otherwise remove all data
                }
                genotype.locusList.forEach((locus) => {
                    locus.rho = locus.rowSum/genotype.maxRowSum;
                });
            } else {
                //TODO: dispay incorect message
            }
        });
    }

    private processingUData(genotype){
        genotype.uData.forEach((locus: Locus[]) => {

        });
    }

    private processingSNPColumns(genotype: Genotype){
        genotype.locusList.forEach((locus, $index) => {
            let sum: number = 0;
            let arr: number[] = new Array<number>();
            
            if (genotype.sumA > 0){
                arr.push(locus.propA);
                sum += locus.propA;
            }
            if (genotype.sumC > 0){
                arr.push(locus.propC);
                sum += locus.propC;
            }
            if (genotype.sumG > 0){
                arr.push(locus.propG);
                sum += locus.propG;
            }
            if (genotype.sumT > 0){
                arr.push(locus.propT);
                sum += locus.propT;
            }

            genotype.maxRowSum = sum > genotype.maxRowSum ? sum : genotype.maxRowSum;
            
            if (sum > Constants.minCount){
                locus.rowSum = sum ;
                locus.theta = 2/Math.PI*Math.atan(arr[0]/arr[1]);
                genotype.keepCount += 1;
            } else {
                //genotype.uCount += 1;
                //genotype.uData.push(locus);
                //genotype.uDataID.push(locus.sampleID);
                genotype.locusList.splice($index, 1); 
                genotype.sampleIDs.splice($index, 1);               
            }
        });
    }
}