import { Injectable } from '@angular/core';
import { Polar } from '../../shared/models/polar.model';
import { Counts } from '../../shared/models/counts.model';
import { Density } from '../../shared/models/density.model';
import { Locus } from '../../shared/models/locus.model';
import { Genotype } from '../../shared/models/genotype.model';
import { Constants } from '../../shared/models/app.constants';
import { DensityData } from '../../shared/models/temp/temp.data';
import {NormalDistributionService} from './normal.distribution.service'
import { UtilsService } from "../../shared/helpers/utils.service";

@Injectable()
export class GenotypeService {
    genotype: Genotype;

    constructor(private utils: UtilsService){}

    processingSNPColumns() {
        let filteredList: Locus[] = new Array<Locus>();
        this.genotype.locusList.forEach((locus, $index) => {
            let sum: number = 0;
            let arr: number[] = new Array<number>();
            let polar: Polar = new Polar();
            let counts: Counts = new Counts();
            let density: Density = new Density();
            
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
                
                polar.x = arr[0];
                polar.y = arr[1];
                polar.color = "#ff0000"; 
                polar.tooltipData = {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'};
                this.genotype.PolarData.push(polar);

                counts.x = arr[0];
                counts.y = arr[1];
                counts.color = "#ff0000"; 
                counts.tooltipData = {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'};
                this.genotype.CountsData.push(counts);

                density.x = locus.theta;
                density.y = sum;
                density.color = "#ff0000"; 
                density.tooltipData = {data: '[200;300]', sample: 'MA101010', a: '3(A)', g: '10(B)'};
                this.genotype.DensityData.push(density);

                filteredList.push(locus);
            } else {
                //Do we need to anything here??
                //genotype.uCount += 1;
                //genotype.uData.push(locus);
                //genotype.uDataID.push(locus.sampleID);          
            }
        });

        this.genotype.locusList = filteredList;
    }

    calculateLocusRHO() {
        this.genotype.locusList.forEach((locus, $index) => {
            locus.rho = locus.rowSum/this.genotype.maxRowSum;

            this.genotype.DensityData[$index].y = this.genotype.DensityData[$index].y/this.genotype.maxRowSum;
            this.performPolarGenotyping(locus, $index);
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
                 let norm: NormalDistributionService = new NormalDistributionService(1, 1);
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

    private performPolarGenotyping(locus: Locus, index: number) {
        let x: number = this.genotype.PolarData[index].x/this.genotype.maxRowSum;
        let y: number = this.genotype.PolarData[index].y/this.genotype.maxRowSum;
        if(this.utils.isNotNullAndUndefined(x) && this.utils.isNotNullAndUndefined(y)){
            let angle: number = Math.PI / 4;
            if (x !== 0 || y !== 0){
                angle = Math.atan(y/x);
            }

            this.genotype.PolarData[index].x = 1 - (Math.log( Constants.logOffset + (1 - Constants.logOffset) * Math.sqrt(x*x + y*y)) / Math.log(Constants.logOffset));
            this.genotype.PolarData[index].y = angle;
                
        }
    }
}