import { Injectable } from '@angular/core';
import { Locus } from '../../shared/models/locus.model';

@Injectable()
export class UploadService {    
    
    parseData(result):Map<string, Array<Locus>> {      
        let locusData:Map<string, Array<Locus>> = new Map();
        let documentLines:string[] = result.split(/\r?\n/);
        let locusList:Locus[] = new Array<Locus>();
        documentLines.shift();
        documentLines.forEach((item) => {
            let documentItems:string[] = item.split('\t');
            let locusItem:Locus = new Locus(documentItems);
            if(locusItem.locusID) {
                if(locusData.get(locusItem.locusID)){
                    locusData.get(locusItem.locusID).push(locusItem)
                } else {
                    locusData.set(locusItem.locusID, [locusItem]);
                }
            }
        });

        return locusData;
    }
}