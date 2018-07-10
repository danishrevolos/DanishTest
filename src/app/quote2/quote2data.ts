import { Headerdata } from "../header/headerdata";

export class Quote2data{
     head = new Headerdata ;
     body = new bodyData;
}

export class bodyData{

    mode : string = "SAVE";
    data : [Data];
contracts: [Cont];
    srchg: [Srchg];
    chkdf:[any];
    veh  = new Vehicle;
}

export class Data{
    prg  :string ="";
    ratc :string ="";
    desc :string ="";
    showct: boolean = false;
    ctrct :string ="";
    open :boolean =false;
    mesg :string = "";
    cov  = new Coverages;
    trm  = new Terms ;  
    ded  = new Deductibles;
}
export class Coverages{
    operation :string="";
    coverages :[any]; 
}

export class Terms{
    operation :string="";
    terms :[any];
}

export class Deductibles{
    operation :string="";
    deductibles :[any];
}
export class Cont{
    code :string="";
    valu :string="";
    prgm :string="";
    desc :string="";
}
export class Srchg{
    type :string="";
    code :string="";
    cost :string="";
    desc :string="";
    chek :boolean =false;
}
export class Vehicle{
    year  : string="";
    make  : string="";
    model : string="";
    miles : string="";
    insrvc: string="";
    price : string="";
    vin   : string="";

}