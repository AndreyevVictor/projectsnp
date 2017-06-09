import { Injectable } from '@angular/core';
import { Locus } from '../../shared/models/locus.model';
import { Genotype } from '../../shared/models/genotype.model';
import { Constants } from '../../shared/models/app.constants';
import { DensityData } from '../../shared/interfaces/density.data';

@Injectable()
export class GenotypeService {
    genotype: Genotype;

    processingSNPColumns() {
        this.genotype.locusList.forEach((locus, $index) => {
            let sum: number = 0;
            let arr: number[] = new Array<number>();
            
            if (this.genotype.sumA > 0){
                arr.push(locus.propA);
                sum += locus.propA;
            }
            if (this.genotype.sumC > 0){
                arr.push(locus.propC);
                sum += locus.propC;
            }
            if (this.genotype.sumG > 0){
                arr.push(locus.propG);
                sum += locus.propG;
            }
            if (this.genotype.sumT > 0){
                arr.push(locus.propT);
                sum += locus.propT;
            }

            this.genotype.maxRowSum = sum > this.genotype.maxRowSum ? sum : this.genotype.maxRowSum;
            
            if (sum > Constants.minCount){
                locus.rowSum = sum ;
                locus.theta = 2/Math.PI*Math.atan(arr[0]/arr[1]);
                this.genotype.theta.push(Math.round(2/Math.PI*Math.atan(arr[0]/arr[1])* 10000) / 10000 );
                this.genotype.keepCount += 1;
            } else {
                //genotype.uCount += 1;
                //genotype.uData.push(locus);
                //genotype.uDataID.push(locus.sampleID);
                this.genotype.locusList.splice($index, 1); 
                this.genotype.sampleIDs.splice($index, 1);               
            }
        });
    }

    calculateLocusRHO() {
        this.genotype.locusList.forEach((locus) => {
            locus.rho = locus.rowSum/this.genotype.maxRowSum;
        });
    }

    calculateDensityData () {
        this.genotype.density = DensityData; //rework with algorithm
    }

    findPeaks(range: number) {
        let peaks:number[] = new Array<number>(); 
        let previousSign: string;
        let density = this.genotype.density.y;
       
        density.forEach((item, $index) => {
            let currentSign: string =  density[$index + 1] - item > 0 ? '+' : '-';
            if (!previousSign) {
                previousSign = currentSign;
            } else if (currentSign !== previousSign){
                peaks.push($index);
                previousSign = currentSign;
            }
        });

        peaks = peaks.filter(peak => {
            let hightPoint: number = peak - range + 1;
            hightPoint = hightPoint > 0 ? hightPoint : 1;
            let lowPoint: number = peak + range + 1;
            lowPoint = lowPoint < density.length ? lowPoint : density.length;
            let subDensity: number[] = density.slice(hightPoint, lowPoint); 
            return subDensity.every(item => {
               return density[peak] >= item;
            });
        });

        this.genotype.peaks = peaks;
    }
}