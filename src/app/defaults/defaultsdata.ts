import {Headerdata} from "../header/headerdata";

export class Defaultsdata{
          head = new Headerdata ;
          body = new bodyData;
}
export class bodyData{
            mode: string ;
            perc: string;
            ancl: string;
            rvtp: string;
            plnk: string;
            mnth: string; 
            lntp: string; 

            lntpdrp:[Drp];
            plnkon: boolean;
            haslntp: boolean;
            pln:plans;
            
            xptf: boolean;
            xptm: boolean;
            xpta: boolean; 
            xptc: boolean; 
            xpc5: boolean; 
            xpc1: boolean; 
            xpc2: boolean; 
            xpc3: boolean; 
            xpc4: boolean; 
            xm12: boolean; 
            xm15: boolean; 
            xm18: boolean; 
            xm24: boolean; 
            xrvm: boolean; 
            xrvt: boolean; 
            xrvp: boolean;
}

export class Drp{

    key:string;
    val:string;
}

export class plans{
    operation  : string;
    plans  : [any] ;
}