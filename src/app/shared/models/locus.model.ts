export class Locus{
    locusID:string;
    sampleID:string;
    propA:number;
    propC:number;
    propG:number;
    propT:number;
    plus:number;
    minus:number;
    theta: number;
    rowSum: number;
    rho: number;

    constructor(arr){
        if (arr.length !== 8){
            return;
        }

        this.locusID = arr[0];
        this.sampleID = arr[1];
        this.propA = parseInt(arr[2]);
        this.propC = parseInt(arr[3]);
        this.propG = parseInt(arr[4]);
        this.propT = parseInt(arr[5]);
        this.plus = parseInt(arr[6]);
        this.minus = parseInt(arr[7]);
    }
}