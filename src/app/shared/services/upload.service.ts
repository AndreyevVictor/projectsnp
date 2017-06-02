import { Injectable } from '@angular/core';
import { Locus } from '../../shared/models/locus.model';

@Injectable()
export class UploadService {    
    
    parseData(result):Locus[] {      
        let locusData:Locus[] = new Array<Locus>();
        let documentLines:string[] = result.split(/\r?\n/);
        let locusList:Locus[] = new Array<Locus>();
        documentLines.shift();
        documentLines.forEach((item) => {
            let documentItems:string[] = item.split('\t');
            let locusItem:Locus = new Locus(documentItems);
            locusData.push(locusItem);
        });

        return locusData;
    }
}