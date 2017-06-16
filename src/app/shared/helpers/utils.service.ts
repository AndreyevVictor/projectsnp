import { Injectable } from '@angular/core';


@Injectable()
export class UtilsService {
    
    isNotNullAndUndefined(val) {
        return val !== null && val !== 'undefined';
    }
}