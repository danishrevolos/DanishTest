import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Usersdata , User } from './usersdata'; 
import { Textfield } from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  ran:string = Util.makeid();
  validating = false;
  valid = false;
  noAuth = true;
  showtop=false;
  dealermode = false;
  salesmode = false;
  haslow = false;
  hascap = false;
  hasnum = false;
  matchp = false;
  haschr8= false;
  initload=true;
  mode = "ADD";
  modebtn = "ADD";
  useri = "";
  pswd1 = "";
  pswd2 = "";
  dlrv:any;
  editP = "Y";//Edit Password
  reqpass1 = false;
  index = 0;
  pvsprs:string ="";
  changes = false;
  reqpass2 = false;
  canedit:boolean=true;
  dlrdrp:boolean = false;
  //Input Fields
  user = new  Textfield ;
  rlno = new  Textfield ;
  cmpc = new  Textfield ;
  stat = new  Textfield ;
  fnam = new  Textfield ;
  lnam = new  Textfield ;
  mmid = new  Textfield ;
  pswdc= new  Textfield ;
  pswd = new  Textfield ;
  sprs = new  Textfield ;
  disc = new  Textfield ;
  slcd = new  Textfield ;
  dlr = new  Textfield ;
  dlrusr:String = "" ;
  dlrlist:[any];

  dispAlert = new Dispalert();
  errSet    = new Errsetter();

  pagedata = new Usersdata ;
  selectedUser: User = { 
    "mode":"",
    "smode":this.salesmode,
    "hassig":false,
    "user":"",
    "useri":"",
    "dlrc":"",
    "agrp":"",
    "stat":"",
    "rlno":"",
    "cmpc":"INT",
    "rold":"",
    "fnam":"",
    "lnam":"",
    "mmid":"",
    "sprs":"",
    "disc":"",
    "slcd":"",
    "pswd":"",
    "dlr":[{"dlri":"","desc":""}],
    "slcds":[{"code":""}]
  }; 
  selectedUserG: User = {
    "mode":"",
    "smode":this.salesmode,
    "hassig":false,
    "user":"",
    "useri":"",
    "dlrc":"",
    "agrp":"",
    "stat":"",
    "rlno":"",
    "cmpc":"INT",
    "rold":"",
    "fnam":"",
    "lnam":"",
    "mmid":"",
    "sprs":"",
    "disc":"",
    "slcd":"",
    "pswd":"",
    "dlr" :[{"dlri":"","desc":""}],
    "slcds":[{"code":""}]
  };  
  constructor(private usersService: JsonService,
    private router: Router) { 

    }
  toggleagrp(){
   if( this.selectedUser.agrp == 'Y') 
    this.selectedUser.agrp = '' ;
   else
    this.selectedUser.agrp = 'Y';

    }
salesvalid(submit){
  this.sprs.erlevel ="";
  this.sprs.message ="";
 
  this.pvsprs = this.selectedUser.sprs;
  Util.showWait();
  this.usersService
    .initService({"mode":"SPRSV","sprs":this.selectedUser.sprs,"currdlr":this.dlrusr},Util.Url("CGICUSERSS"))
    .subscribe(data => this.errSet = data,
      err => { Util.hideWait(); },
      () => {
        
        
        if(this.errSet.status == 'S'){
           if(!submit) Util.hideWait();
           
         //  this.saveData(submit);
        }else{
          this.sprs.erlevel = this.errSet.status;
          this.sprs.message = this.errSet.message;
          Util.hideWait();
        }
       }
      );
}

validPass(){
  
  //LowerCase
  var lowerCaseLetters = /[a-z]/g;
  if(this.pswd1.match(lowerCaseLetters)) {
    this.haslow = true;
  }else{
    this.haslow = false;
  }
  //UpperCase
  var upperCaseLetters = /[A-Z]/g;
  if(this.pswd1.match(upperCaseLetters)) {
    this.hascap = true;
  }else{
    this.hascap = false;
  }
  //Number
  var numbers = /[0-9]/g;
  if(this.pswd1.match(numbers)) {
    this.hasnum = true;
  }else{
    this.hasnum = false;
  }
  //Length
  if(this.pswd1.length >=8){
    this.haschr8 = true;
  }else{
    this.haschr8 = false;
  }
  //Match
  if(this.pswd1 == this.pswd2 && this.pswd1!==''){
    this.matchp = true;
  }else{
    this.matchp = false;
  }

  if(this.haslow && this.hascap && this.hasnum && this.haschr8 && this.matchp){
    return true;
  }else{
    return false;
  }

}
getDlrGrps(){
  var self = this.pagedata.head;
  if(this.pagedata.head.loctn.length > 0){
    this.dlrlist = this.pagedata.head.loctn;
    this.dlrusr = this.pagedata.head.currdlr;
    Util.hideWait();

  }else{
  this.usersService
    .initService({"service":"LISTLOC","dlr":self.currdlr,"tabid": sessionStorage.getItem("tabid")},Util.Url("CGICSERVE"))
    .subscribe(data => this.dlrlist = data,
      err => {  Util.hideWait(); },
      () => {
        this.dlrusr = this.pagedata.head.currdlr;
        Util.hideWait();
      });
    }

}
addDealer(){
  if(this.selectedUser.agrp == 'Y') return;
  this.validating = false;
  if(this.dlr.value==""){
    this.dlr.erlevel = "D";
    this.dlr.message = "(Required)";
    return false;
  }
  Util.showWait();
  this.usersService
    .initService({"mode":"DLRV","onedlr":this.dlr.value,"currdlr":this.dlrusr},Util.Url("CGICUSERSS"))
    .subscribe(data => this.dlrv = data,
      err => {  Util.hideWait(); },
      () => {
        if(this.dlrv.dlri == this.dlr.value && this.dlrv.desc !== ""){
          var index = this.selectedUser.dlr.findIndex(obj => obj.dlri==this.dlr.value);
          if(index <0) this.selectedUser.dlr.push(this.dlrv);
          this.dlr.erlevel = "S";
          this.dlr.message = "(Dealer Added)";
          this.dlr.value = "";
        }else{
          if(this.dlrv.dlri == "N")
            this.dlr.message = "(Dealer #"+this.dlr.value+" is invalid!)";
            else
            this.dlr.message = "(Dealer is not in the same group!)";
          
          this.dlr.erlevel = "D";          
          this.dlr.value = "";
        }
        Util.hideWait();
        
       }
      );
    }
addSlcd(){
  if(this.selectedUser.agrp == 'Y') return;
  this.validating = false;
  if(this.selectedUser.slcd==""){
    this.slcd.erlevel = "D";
    this.slcd.message = "(Required)";
    return false;
  }
  this.selectedUser.slcd = this.selectedUser.slcd.toUpperCase();
  //if(this.cmpc.value == 'PIP'){
  //  if(this.selectedUser.slcds.length > 0){
  //    this.slcd.erlevel = "D";
  //        this.slcd.message = "(Only one allowed for PIP)";
  //    return false;
  //  }

  //}
  Util.showWait();
  this.usersService
    .initService({"mode":"SLCDV","cmpc":this.selectedUser.cmpc,"slcd":this.selectedUser.slcd},Util.Url("CGICUSERSS"))
    .subscribe(data => this.dlrv = data,
      err => {  Util.hideWait(); },
      () => {
        if(this.dlrv.valid){
          var index = this.selectedUser.slcds.findIndex(obj => obj.code==this.selectedUser.slcd);
          if(index <0){

            this.selectedUser.slcds.push({"code":this.selectedUser.slcd});
          } 
          this.slcd.erlevel = "S";
          this.slcd.message = "(Salesperson Added)";
          this.selectedUser.slcd = "";
        }else{

          this.slcd.erlevel = "D";
          //this.slcd.message = "(Invalid Salesperson Code)";
          this.slcd.message = this.dlrv.mesg;
        }
        
        Util.hideWait();
      }
      );
    }

removeDlr(dealer){
  if(confirm("Delete this Dealer?")){
  Util.showWait();
  var index = this.selectedUser.dlr.findIndex(obj => obj.dlri==dealer.dlri);
  this.selectedUser.dlr.splice(index,1);
  this.dlr.erlevel = "S";
  this.dlr.message = "(Dealer removed)";
  this.dlr.value = "";
  Util.hideWait();
  }
}    
removeSlcd(slcd){
  if(confirm("Delete this Salesperson Code?")){
  Util.showWait();
  var index = this.selectedUser.slcds.findIndex(obj => obj.code==slcd.code);
  this.selectedUser.slcds.splice(index,1);
  this.slcd.erlevel = "S";
  this.slcd.message = "(Salesperson removed)";
  this.slcd.value = "";
  this.selectedUser.slcd = "";
  Util.hideWait();
  }
}   
clearSig(user: User){
  
  if(!confirm('Clear Signatures on file for this user?')){return false;}
  Util.showWait();
  var data ={"mode":"CLEARSIG","useri":user.useri};
  this.usersService
  .initService(data,Util.Url("CGICUSERSS")) 
  .subscribe(data => this.errSet = data,
    err => { this.dispAlert.error(); Util.hideWait(); },
    () => { 
      Util.hideWait();
      user.hassig = false;

    }

  );

}

onSelect(user: User): void {
  this.selectedUser.mode = "SAVE";
  this.validating = false;
  this.showtop = true;
  this.selectedUser.user = user.user;
  this.selectedUser.useri = user.useri;
  this.selectedUser.rlno = user.rlno;
  this.selectedUser.cmpc = user.cmpc;
  this.selectedUser.agrp = user.agrp;
  this.selectedUser.stat = user.stat;
  this.selectedUser.rold = user.rold;
  this.selectedUser.fnam = user.fnam;
  this.selectedUser.lnam = user.lnam;
  this.selectedUser.mmid = user.mmid;
  this.selectedUser.sprs = user.sprs;
  if(this.salesmode) this.selectedUser.sprs ="";
  this.selectedUser.disc = user.disc;
  this.selectedUser.slcd ="";
  this.selectedUser.dlr = JSON.parse(JSON.stringify(user.dlr));              
  this.selectedUser.slcds = JSON.parse(JSON.stringify(user.slcds));              
  this.selectedUser.pswd = "";
  this.dlr.erlevel ="";
  this.dlr.message ="";
  this.dlr.value ="";

  this.sprs.erlevel ="";
  this.sprs.message ="";
  this.sprs.value ="";
  this.slcd.erlevel ="";
  this.slcd.message ="";
  this.slcd.value ="";

  this.selectedUserG = user;
  this.pswd1 = "";
  this.pswd2 = "";
  this.useri = this.selectedUser.user.toUpperCase();
  this.mode = "SAVE";
  this.modebtn = "SAVE";
  this.editP = "N";
  Util.showWait();
  Util.showUsers();
  Util.hideWait();
  Util.scrollTop();
  this.changes = false;
  this.haslow = false;
  this.hascap = false;
  this.hasnum = false;
  this.matchp = false;
  this.haschr8= false;
  
}

addUserInit(){
  Util.showWait();
   this.selectedUser = {
    "mode":"ADD",
    "smode":this.salesmode,
    "hassig":false,
    "user":"",
    "useri":"",
    "dlrc":"",
    "agrp":"",
    "stat":"",
    "rlno":"",
    "cmpc":"INT",
    "rold":"",
    "fnam":"",
    "lnam":"",
    "mmid":"",
    "sprs":"",
    "disc":"",
    "slcd":"",
    "pswd":"",
    "dlr" :[{"dlri":"","desc":""}],
    "slcds":[{"code":""}]
  };  

  this.showtop = true;
  this.selectedUser.dlr.pop();
  this.selectedUser.slcds.pop();
  this.dlr.erlevel ="";
  this.dlr.message ="";
  this.dlr.value ="";
  
  this.slcd.erlevel ="";
  this.slcd.message ="";
  this.slcd.value ="";
  
  this.changes = false;
  Util.showUsers();
  Util.hideWait();
  this.validating = false;
  this.useri = "";
  this.mode = "ADD";
  this.modebtn = "ADD";
  this.editP = "Y";
  this.pswd1 = "";
  this.pswd2 = "";
  Util.scrollTop();
  this.haslow = false;
  this.hascap = false;
  this.hasnum = false;
  this.matchp = false;
  this.haschr8= false;

}
delete(){
  if(confirm("Delete this User?")){
  this.mode = "DELETE";
  Util.setfieldval("formmode","DELETE");
  Util.showWait();
  this.usersService
  .initService(Util.formdata("adduser"),Util.Url("CGICUSERSS")) 
  .subscribe(data => this.errSet = data,
    err => { this.dispAlert.error(); Util.hideWait(); },
    () => {
      this.dispAlert.setMessage(this.errSet);
      if (this.dispAlert.status === "S") {

          this.changes = false;
          this.index = this.pagedata.users.findIndex(obj => obj.user==this.selectedUser.user);
          this.pagedata.users.splice(this.index,1);
          setTimeout(() => {
            Util.showWait();   
            this.cancel();
          }, 1000);

        
      }else{
        Util.hideWait();
      }
        

    }
  );
  }
}
cancel(){

  Util.showWait();
  this.validating = false;
  this.selectedUser = {
    "mode":"",
    "smode":this.salesmode,
    "hassig":false,
    "user":"",
    "useri":"",
    "dlrc":"",
    "agrp":"",
    "stat":"",
    "rlno":"",
    "cmpc":"INT",
    "rold":"",
    "fnam":"",
    "lnam":"",
    "mmid":"",
    "sprs":"",
    "disc":"",
    "slcd":"",
    "pswd":"",
    "dlr" :[{"dlri":"","desc":""}],
    "slcds":[{"code":""}]
  };  
  this.selectedUser.dlr.pop();
  this.changes = false;
  Util.hideWait(); 
  Util.hideUsers();
  this.showtop = false;
  this.useri = "";
  this.mode = "ADD";
  this.modebtn = "ADD";
  this.editP = "Y";
  this.dispAlert.default();
  this.pswd1 = "";
  this.pswd2 = "";
  Util.scrollTop();
  
}

checkUser(){
  if(this.dealermode){this.addDealer();return false;}
    this.validating = true;
    this.valid = true;
    //Reset Error Messages
    this.user.message  = "";
    this.rlno.message  = "";
    this.cmpc.message  = "";
    this.stat.message  = "";
    this.fnam.message  = "";
    this.lnam.message  = "";
    this.mmid.message  = "";
    this.sprs.message  = "";
    this.disc.message  = "";
    this.slcd.message  = "";
    this.pswdc.message = "";
    this.pswd.message  = "";
    this.dispAlert.default();
    this.reqpass1 = false;
    this.reqpass2 = false;
    //Trim Field values
    //switch valid 
    this.user.value  = this.selectedUser.user.trim();
    this.stat.value  = this.selectedUser.stat.trim();
    this.rlno.value  = this.selectedUser.rlno.trim();
    this.cmpc.value  = this.selectedUser.cmpc.trim();
    this.fnam.value  = this.selectedUser.fnam.trim();
    this.lnam.value  = this.selectedUser.lnam.trim();
    this.mmid.value  = this.selectedUser.mmid.trim();
    this.sprs.value  = this.selectedUser.sprs.trim();
    this.disc.value  = this.selectedUser.disc.trim();
    this.slcd.value  = this.selectedUser.slcd.trim();
    this.pswdc.value = this.pswd2.trim();
    this.pswd.value  = this.pswd1.trim();

    if (this.user.value == "") { this.user.message = "(required)"; this.user.erlevel = "D"; this.valid = false; }
    if (this.user.value !== "" && !Util.validemail(this.user.value)) { this.user.message = "(invalid email!)"; this.user.erlevel = "D"; this.valid = false; }
    if (this.fnam.value == "") { this.fnam.message = "(required)"; this.fnam.erlevel = "D"; this.valid = false; }
    if (this.lnam.value == "") { this.lnam.message = "(required)"; this.lnam.erlevel = "D"; this.valid = false; }
    if (this.rlno.value == "") { this.rlno.message = "(required)"; this.rlno.erlevel = "D"; this.valid = false; }
    if (this.cmpc.value == "") { this.cmpc.message = "(required)"; this.cmpc.erlevel = "D"; this.valid = false; }
    if (this.salesmode && this.disc.value!=="" && this.selectedUser.slcds.length<0) { this.disc.message = "(Agent - OR - Salesperson Code Allowed)"; this.disc.erlevel = "D"; this.valid = false; }
    if (this.salesmode && this.disc.value =="" && this.selectedUser.slcds.length < 1) { this.disc.message = "(Agent - OR - Salesperson Code Required)"; this.disc.erlevel = "D"; this.valid = false; }
    //if(this.cmpc.value == 'PIP'){
    //  if(this.selectedUser.slcds.length > 1){
    //    this.slcd.erlevel = "D";
    //      this.slcd.message = "(Only one allowed for PIP)";
    //      this.valid = false;
    //  }
    //}
    //if (this.sprs.value == "" &&  !this.salesmode) { this.sprs.message = "(required)"; this.sprs.erlevel = "D"; this.valid = false; }
    if (this.pswd1 == "" && this.editP == "Y") { this.pswd.message = "(required)"; this.pswd.erlevel = "D"; this.valid = false; this.reqpass1=true;}
    if (this.pswd1 !== this.pswd2 && this.editP == "Y") { this.pswd.message = "(Passwords don't match)"; this.pswd.erlevel = "D"; this.valid = false; this.reqpass1=true;}
    if (this.pswd2 == "" && this.editP == "Y") { this.pswdc.message = "(required)"; this.pswdc.erlevel = "D"; this.valid = false;this.reqpass2=true; }
    if (this.pswd1 === this.pswd2 && this.pswd1 !=='' && this.editP == "Y" && !this.validPass()){ this.pswd.message = "(Password not valid)"; this.pswd.erlevel = "D"; this.valid = false; this.reqpass1=true;} 
   if (this.valid){//Serve Action

    this.saveData();


   }

    
}

saveData(){
  
  Util.showWait();
  this.selectedUser.mode = this.mode;
  this.selectedUser.pswd = this.pswd1;
  this.selectedUser.dlrc = this.dlrusr.toString();
  if(this.selectedUser.agrp == 'Y'){ this.selectedUser.dlr = [{"dlri":"","desc":""}]; this.selectedUser.dlr.pop();}
  this.usersService
  
  .initService(this.selectedUser,Util.Url("CGICUSERSS"))
  .subscribe(data => this.errSet = data,
    err => { this.dispAlert.error(); Util.hideWait(); },
    () => {
      this.dispAlert.setMessage(this.errSet);
      if (this.dispAlert.status === "S") {

        if(this.mode=="ADD"){
          this.pagedata.users.push({
            "mode":this.selectedUser.mode,
            "smode":this.salesmode,
            "hassig":this.selectedUser.hassig,
            "user":this.selectedUser.user,
            "useri":this.selectedUser.user,
            "dlrc":this.selectedUser.dlrc,
            "agrp":this.selectedUser.agrp,
            "stat":this.selectedUser.stat,
            "rlno":this.selectedUser.rlno,
            "cmpc":this.selectedUser.cmpc,
            "rold":Util.getSelText(this.selectedUser.rlno,this.pagedata.roles),
            "fnam":this.selectedUser.fnam,
            "lnam":this.selectedUser.lnam,
            "mmid":this.selectedUser.mmid,
            "sprs":this.selectedUser.sprs,
            "disc":this.selectedUser.disc,
            "slcd":this.selectedUser.slcd,
            "pswd":"",
            "dlr": this.selectedUser.dlr,
            "slcds":this.selectedUser.slcds
          });

          setTimeout(() => {
            Util.showWait();   
            this.cancel();
          }, 300);


        }
        if(this.mode=="SAVE"){
          //this.index = this.pagedata.users.findIndex(obj => obj.user==this.selectedUser.user);
          //alert(this.index);
          this.selectedUserG.user = this.selectedUser.user;
          this.selectedUserG.rlno = this.selectedUser.rlno;
          this.selectedUserG.dlrc = this.selectedUser.dlrc;
          this.selectedUserG.agrp = this.selectedUser.agrp;
          this.selectedUserG.stat = this.selectedUser.stat;
          this.selectedUserG.rold = Util.getSelText(this.selectedUser.rlno,this.pagedata.roles);
          this.selectedUserG.fnam = this.selectedUser.fnam;
          this.selectedUserG.lnam = this.selectedUser.lnam;
          this.selectedUserG.mmid = this.selectedUser.mmid;
          this.selectedUserG.sprs = this.selectedUser.sprs;
          this.selectedUserG.disc = this.selectedUser.disc;
          this.selectedUserG.slcd = this.selectedUser.slcd;
          this.selectedUserG.pswd = "";
          this.selectedUserG.dlr = this.selectedUser.dlr;
          this.selectedUserG.slcds = this.selectedUser.slcds;
          setTimeout(() => {
            Util.showWait();   
            this.cancel();
          }, 300);
        }
        this.changes = false;
        
      }else{
        Util.hideWait();
      }
        

    }
  );

}

onChange() {

  this.validating = false;
  this.changes= true;
}

changePass(){
  this.validating = false;
  if(this.editP ==="Y")
    this.editP="N";
  else
    this.editP = "Y";
}

  ngOnInit() {
    Util.showWait();
    
    this.pagedata.head = Util.getHead(this.pagedata.head);
    var xmode ="INIT";
    if (window.location.href.indexOf("SalesPerson") > -1){this.salesmode = true;xmode='INITS';}
    this.usersService
    .initService({"mode":xmode,"currdlr":this.dlrusr},Util.Url("CGICUSERSS"))
    .subscribe(data => this.pagedata = data,
      err => { Util.responsiveMenu();Util.hideWait(); },
      () => { if(this.initload)
                Util.responsiveMenu(); 
              else
                Util.resetMenu();
        Util.setHead(this.pagedata.head);
       this.initload = false;
      //Sort By User Ascending
        this.pagedata.users =  Util.sortByKey(this.pagedata.users, "user","A");

        if(this.salesmode)
          this.noAuth = !this.pagedata.head.as400;
        else
          this.noAuth = Util.noAuth(this.pagedata.head.menuOp,'CEUSERS');
        if (this.pagedata.head.status === "O" || this.noAuth) {
          
          Util.showWait();
          setTimeout(() => {
            Util.hideWait();   
            this.router.navigate(['/app/']);
          }, 100);
        }else{
          if(this.dlrusr == "")
           this.getDlrGrps();
          else{
          
          Util.hideWait();
          }
          this.dlrdrp = !Util.noAuth(this.pagedata.head.menuOp,'XLOCEDIT');
          this.canedit = (this.dlrusr == this.pagedata.head.orgdlr || !Util.noAuth(this.pagedata.head.menuOp,'XLOCEDIT') || this.pagedata.head.as400);  
        }

       }
    );
  }
  canDeactivate() {

    if(this.changes)
      return window.confirm('Changes not saved! Discard changes?');
    return true;

}


}