import { Locus } from '../../shared/models/locus.model';
import { Density } from '../../shared/interfaces/density.data';

export class Genotype{
    ID: string;
    sampleIDs: string[] = new Array<string>();
    columnA: number[] = new Array<number>();
    columnC: number[] = new Array<number>();
    columnG: number[] = new Array<number>();
    columnT: number[] = new Array<number>();
    columnPlus: number[] = new Array<number>();
    columnMinus: number[] = new Array<number>();
    theta: number[] = new Array<number>();
    peaks: number[] = new Array<number>();

    sumA: number = 0;
    sumC: number = 0;
    sumG: number = 0;
    sumT: number = 0;
    maxRowSum: number = 0;
    keepCount: number = 0;

    uCount: number = 0;
    uData: Locus[] = new Array<Locus>();
    uDataID: string[] = new Array<string>();

    locusList: Locus[] = new Array<Locus>();
    density: Density;
}