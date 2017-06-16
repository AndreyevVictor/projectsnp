import { Locus } from '../../shared/models/locus.model';
import { MinEM } from "../../shared/models/minEM.model";
import { DensityTemp } from '../../shared/models/temp/temp.data';
import { Polar } from "../../shared/models/polar.model";
import { Counts } from "../../shared/models/counts.model";
import { Density } from "../../shared/models/density.model";

export class Genotype{
    ID: string;
    score: number;
    out: any; 
    sampleIDs: string[] = new Array<string>();
    columnA: number[] = new Array<number>();
    columnC: number[] = new Array<number>();
    columnG: number[] = new Array<number>();
    columnT: number[] = new Array<number>();
    columnPlus: number[] = new Array<number>();
    columnMinus: number[] = new Array<number>();
    theta: number[] = new Array<number>();
    peakIDs: number[] = new Array<number>();
    peakValues: number[] = new Array<number>();
    mu: number[] = new Array<number>();

    nmEM: MinEM = new MinEM();
    PolarData: Polar[] = new Array<Polar>();
    CountsData: Counts[] = new Array<Counts>();
    DensityData: Density[] = new Array<Density>();

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
    density: DensityTemp;
}