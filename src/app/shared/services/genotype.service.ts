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
        let peakIDs:number[] = new Array<number>(); 
        let previousSign: string;
        let density = this.genotype.density.y;
       
        density.forEach((item, $index) => {
            let currentSign: string =  density[$index + 1] - item > 0 ? '+' : '-';
            if (!previousSign) {
                previousSign = currentSign;
            } else if (currentSign !== previousSign){
                peakIDs.push($index);
                previousSign = currentSign;
            }
        });

        peakIDs = peakIDs.filter(peak => {
            let hightPoint: number = peak - range + 1;
            hightPoint = hightPoint > 0 ? hightPoint : 1;
            let lowPoint: number = peak + range + 1;
            lowPoint = lowPoint < density.length ? lowPoint : density.length;
            let subDensity: number[] = density.slice(hightPoint, lowPoint); 
            return subDensity.every(item => {
               return density[peak] >= item;
            });
        });

        this.genotype.peakIDs = peakIDs;
      
    }

    calculateNmEM() {
        this.genotype.peakIDs.forEach(id => {
            this.genotype.mu.push(this.genotype.density.x[id]);
        });
        
        if (this.genotype.mu.length > 3) {
            let maxID: number;
            let maxVal: number = 0;
            this.genotype.mu.sort();
            this.genotype.peakValues.push(this.genotype.mu.shift());
            this.genotype.peakValues[2] = this.genotype.mu.pop();
            this.genotype.peakIDs.pop();
            this.genotype.peakIDs.shift();

            this.genotype.peakIDs.forEach((id, $index) => {
                if (maxVal < this.genotype.density.y[id]) {
                     maxID = $index;
                }
            });

            this.genotype.peakValues[1] = this.genotype.mu[maxID];
            this.getMinEM();

            if (Math.min.apply(Math, this.genotype.nmEM.mu) < 0.05){
                 this.getMinEM();
            }                    
        } else  if (this.genotype.mu.length > 1) {
             this.getMinEM();
        } else {
            this.genotype.nmEM.mu = this.genotype.mu;
            this.genotype.nmEM.sigma.push(this.standardDeviation(this.genotype.theta));
        }
    }

    calculateScore() {
        if(!this.genotype.nmEM) {
            this.genotype.score = 2;
            //TODO: Display message and build chart
            // Is it correct case?
            console.log('Building chart');
        } else {
            let sigmaEst = this.genotype.nmEM.mu.sort();
            // sigma_est <- nmEM$sigma[order(nmEM$mu)] ???
            if (this.genotype.mu.length > 1){
                 
            } else {
                this.genotype.score = 3;
                this.genotype.out = [3, 0, this.genotype.theta.length];
            }
        }
    }

    private getMinEM() {
        //TODO: rework with formula
        this.genotype.nmEM.loglik = 358;
        this.genotype.nmEM.mu = [0.0232, 0.4046, 0.9919];
        this.genotype.nmEM.sigma = [0.01871, 0.29015, 0.00949];
    }
    
    private standardDeviation(values: number[]): number{
        let avg: number = this.average(values);
      
        let squareDiffs = values.map(function(value){
            return Math.pow(value - avg, 2);
        });
  
        return Math.sqrt(this.average(squareDiffs));
    }

    private average(data: number[]): number{
        let sum: number = data.reduce(function(sum: number, value: number){
            return sum + value;
        }, 0);
    
        return sum / data.length;
    }
}