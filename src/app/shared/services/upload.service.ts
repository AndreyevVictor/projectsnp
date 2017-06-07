import { Injectable } from '@angular/core';
import { Locus } from '../../shared/models/locus.model';
import { Genotype } from '../../shared/models/genotype.model';

@Injectable()
export class UploadService {    
    
    parseData(result):Map<string, Genotype> {
        let genotype:Genotype;
        let locusData:Map<string, Genotype> = new Map();
        let lines:string[] = result.split(/\r?\n/);
        let locusList:Locus[] = new Array<Locus>();
        lines.shift();
        lines.forEach((item) => {
            let documentItems:string[] = item.split('\t');
            let locusItem:Locus = new Locus(documentItems);
            if(locusItem.locusID) {
                if(locusData.get(locusItem.locusID)){
                    genotype = locusData.get(locusItem.locusID);
                    this.processingGenotypeData(genotype, locusItem);
                    locusData[locusItem.locusID] = genotype;
                } else {
                    genotype = new Genotype();
                    genotype.ID = locusItem.locusID;
                    this.processingGenotypeData(genotype, locusItem);
                    locusData.set(locusItem.locusID, genotype);
                }
            }
        });

        return locusData;
    }

    private processingGenotypeData(genotype:Genotype, locus:Locus){
        genotype.sampleIDs.push(locus.sampleID);
        genotype.columnA.push(locus.propA);
        genotype.columnC.push(locus.propC);
        genotype.columnG.push(locus.propG);
        genotype.columnT.push(locus.propT);
        genotype.columnPlus.push(locus.plus);
        genotype.columnMinus.push(locus.minus);
        genotype.sumA += locus.propA;
        genotype.sumC += locus.propC;
        genotype.sumG += locus.propG;
        genotype.sumT += locus.propT;
        genotype.locusList.push(locus);
    }
}