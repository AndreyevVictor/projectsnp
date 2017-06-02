export class Locus{
    locusID:string;
    sampleID:string;
    propA:string;
    propC:string;
    propG:string;
    propT:string;
    plus:string;
    minus:string;

    constructor(arr:string[]){
        if (arr.length !== 8){
            return;
        }

        this.locusID = arr[0];
        this.sampleID = arr[1];
        this.propA = arr[2];
        this.propC = arr[3];
        this.propG = arr[4];
        this.propT = arr[5];
        this.plus = arr[6];
        this.minus = arr[7];
    }
}