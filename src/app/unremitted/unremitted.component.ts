import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Unremitteddata, Cont, Readnextdata } from './unremitteddata'; 
import { Textfield , Numfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';
import { PagerService } from '../_services/index'


@Component({
  selector: 'app-unremitted',
  templateUrl: './unremitted.component.html',
  styleUrls: ['./unremitted.component.css']
})

export class UnremittedComponent implements OnInit {

	pagedata = new Unremitteddata;
  readdata = new Readnextdata;
  ran:string = Util.makeid();
  validating = false;
	valid = false;
	changes = false;
	//Input Fields
	frdt  : string="";
	todt  : string="";
	stock : string="";
  lname : string="";
  salep : string="";
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
	//Delete array
	remtarr = [];
	showDelete : boolean = false;
  //Paging
  pager: any = {}; // pager object
  pagedItems: any[]=[""]; // paged items
  dispItems: any[]; // paged items
  applyFiltBtn : boolean = false;
  //two values, one for filtering and the other keeps track of deletes
  pageCount : number=0;
  masterPgCnt : number=0;
  //navigate away from page stop the recursive calls to build quotes
  killRecur : boolean = false;

  constructor(private jsonService: JsonService,private router: Router, private pagerService: PagerService) { }

  onChange(){
  	//this.changes = true;
    this.validating = false;
    this.dispAlert.default();
  }

  remitt(){
  	if(this.remtarr.length === 0){
  		return false;
  	}
  	if(confirm("Remitt Selected Contracts?")){
  		Util.showWait();
  		var delArr = [];
  		for(var i=0;i<this.remtarr.length;i++){
  			if(this.remtarr[i] !== undefined){
  				delArr[i]= {"value":this.remtarr[i]};
  				this.pagedata.contracts.splice(this.pagedata.contracts.findIndex(obj => obj.ecno==this.remtarr[i]),1);
          this.pageCount -= 1;
          this.masterPgCnt -= 1;
  			}
  		}
  		this.jsonService
  		.initService({"mode":"REMITT","remtarr":delArr}, Util.Url("CGICUNRMCT"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error(), Util.hideWait();},
  			()=>{
          Util.hideWait();
          this.showDelete = false;
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
            this.setPage(this.pager.currentPage);
            this.remtarr = [];
  					
  				} else {
  					
            this.remtarr = [];
            this.setPage(this.pager.currentPage);
  				}
  			})
  	}
  }
  void(){
  	if(this.remtarr.length === 0){
  		return false;
  	}
  	if(confirm("Void Selected Contracts?")){
  		Util.showWait();
  		var delArr = [];
  		for(var i=0;i<this.remtarr.length;i++){
  			if(this.remtarr[i] !== undefined){
  				delArr[i]= {"value":this.remtarr[i]};
  				this.pagedata.contracts.splice(this.pagedata.contracts.findIndex(obj => obj.ecno==this.remtarr[i]),1);
          this.pageCount -= 1;
          this.masterPgCnt -= 1;
  			}
  		}
  		this.jsonService
  		.initService({"mode":"VOID","remtarr":delArr}, Util.Url("CGICUNRMCT"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error(), Util.hideWait();},
  			()=>{
          Util.hideWait();
          this.showDelete = false;
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
            this.setPage(this.pager.currentPage);
            this.remtarr = [];
  					
  				} else {
  					
            this.remtarr = [];
            this.setPage(this.pager.currentPage);
  				}
  			})
  	}
  }

  dateFilter(){
    Util.showWait();
    this.stock = this.stock.trim();
    this.lname = this.lname.trim();
    this.salep = this.salep.trim();
    this.pageCount = this.masterPgCnt;
  	if(this.frdt === "" || !this.isValidDate(this.frdt)){
      this.frdt = "0";
    }
    if(this.todt === "" || !this.isValidDate(this.todt)){
      this.todt = "99999999";      
  	} 
		var filtfrdt = this.frdt.replace(/-/g,"");
		var filttodt = this.todt.replace(/-/g,"");
		for(var i=0; i< this.pagedata.contracts.length;i++){
      this.pagedata.contracts[i].show = true;
			var temp = (this.pagedata.contracts[i].ctdti);
			if(parseInt(temp,10) < parseInt(filtfrdt,10) || parseInt(temp,10) > parseInt(filttodt,10)){
				this.pagedata.contracts[i].show = false;
			}
      if(this.stock !== "" && this.pagedata.contracts[i].stck.toUpperCase().indexOf(this.stock.toUpperCase()) === -1){
        this.pagedata.contracts[i].show = false;
      }
      if(this.lname !== "" && this.pagedata.contracts[i].lnam.toUpperCase().indexOf(this.lname.toUpperCase()) === -1){
        this.pagedata.contracts[i].show = false;
      }
      if(this.salep !== "" && this.pagedata.contracts[i].sprs.toUpperCase().indexOf(this.salep.toUpperCase()) === -1){
        this.pagedata.contracts[i].show = false;
      }
      
      if(this.pagedata.contracts[i].show === false){
        this.pageCount -= 1;
      }
		}
    this.pager.totalPages = Math.ceil(this.pageCount / 25);
    if(this.pager.totalPages>0){
      this.setPage(1);
    }else{
      this.pager = {};
    }
  	Util.hideWait();
  }

  isValidDate(dateString){
	  var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/; //check pattern is yyyy-mm-dd
	  if(!regex_date.test(dateString)){
	    return false;
	  }
    var parts   = dateString.split("-"); //parts is an array after split ['y','m','d']
    var day     = parseInt(parts[2], 10);
    var month   = parseInt(parts[1], 10);
    var year    = parseInt(parts[0], 10);
    if(year < 1000 || year > 5000 || month == 0 || month > 12){
    	return false;
    }
    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)){
      monthLength[1] = 29; //leap year
    }
  	return day > 0 && day <= monthLength[month - 1];
	}

	chkContr(contract){
    contract.selected = !contract.selected;
    
		if(contract.selected){
			this.remtarr.push(contract.ecno);
			this.showDelete = true;
      this.changes = true;

		} else {
			this.remtarr.splice(this.remtarr.indexOf(contract.ecno),1);
			if(this.remtarr.length === 0){
				this.showDelete = false;
        this.changes = false;
			}
		}
		
	}




	cancel(){
    Util.showWait();
    this.validating = false;
    Util.hideWait();
    Util.scrollTop();
    this.changes = false;
    this.showDelete = false;
    this.dispAlert.default(); 
  }

  viewCont(contractID){
    Util.showWait();
    var pdf = window.open(Util.Url("cgi/CGGLSRIOV2?PMIONO="+contractID),'_blank', 'toolbar=0,scrollbars=-1,resizable=-1');
    if (pdf == null || typeof(pdf)=='undefined') { 	
      alert('Please disable your pop-up blocker and click the link again.'); 
    } 
    else { 	
      pdf.focus();
    }
    Util.hideWait();

  }

  ngOnInit() {
    this.pagedata.head.status = "I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICUNRMCT"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.responsiveMenu(); },
  		() => {
        Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" ||  Util.noAuth(this.pagedata.head.menuOp,'WUNREMITT')) {
  				Util.showWait();
  				setTimeout(() => {
  					Util.hideWait();
  					this.router.navigate(['/app']);
  				}, 100);
  			} else {
          this.pageCount = parseInt(this.pagedata.ttlpgs.cnt,10);
          this.masterPgCnt = this.pageCount;
          this.setPage(1); 
  				Util.hideWait();
          if(this.pagedata.ttlpgs.lstrec !== 'EOF'){
            this.readNext(this.pagedata.ttlpgs.lstrec);
          } else {
            this.applyFiltBtn = true;
          }
  			}
  		}
  	);
  }

  setPage(page: number){
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    Util.showWait();
    Util.hideWait();
    // get pager object from service
    this.pager = this.pagerService.getPager(this.pageCount, page, 25);
    this.dispItems =[ ];
    this.pagedata.contracts.forEach(sq =>{ if(sq.show) this.dispItems.push(sq)});
    // get current page of items
    this.pagedItems = this.dispItems.slice(this.pager.startIndex, this.pager.endIndex + 1);    
  }

  readNext(anchor){
    if(this.killRecur){
      return;
    }
    this.jsonService
    .initService({"mode":"READNEXT", "ecno":anchor},Util.Url("CGICUNRMCT"))
    .subscribe(data => this.readdata = data,
      err => {Util.responsiveMenu(); },
      () => {
        Util.responsiveMenu();
        Array.prototype.push.apply(this.pagedata.contracts,this.readdata.contracts);
        if (this.readdata.ttlpgs.lstrec === "EOF") {
          this.applyFiltBtn = true;
          return;
        } else {
          this.readNext(this.readdata.ttlpgs.lstrec);
        }
      }
    );
  }

  canDeactivate() {
    var result = true;
    if(this.changes){
      result = window.confirm('Changes not saved! Discard changes?');
    }
    if(result){
      this.killRecur = true;
      return true;
    }
  }



}
