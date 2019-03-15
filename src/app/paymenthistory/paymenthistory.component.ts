import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { PaymentHistorydata, Readnextdata ,Lginv } from './paymenthistorydata'; 
import { Dispalert , Errsetter } from '../utilities/dispalert';
import { PagerService } from '../_services'


@Component({
  selector: 'app-paymenthistory',
  templateUrl: './paymenthistory.component.html'
})


export class PaymentHistoryComponent implements OnInit {

	pagedata = new PaymentHistorydata;
  readdata = new Readnextdata;
  selecrec = new Lginv;
  ran:string = Util.makeid();

	validating = false;
	valid = false;
	changes = false;
	//Input Fields
	frdt : string="";
	todt : string="";
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  pagemode:string = "L";

  //Paging
  pager: any = {}; // pager object
  pagedItems: any[]=[""]; // paged items
  dispItems: any[]; // paged items
  applyFiltBtn : boolean = false;
  //two values, one for filtering and the other keeps track of deletes
  pageCount : number=0;
  masterPgCnt : number=0;
  //navigate away from page stop the recursive calls to build invoices
  killRecur : boolean = false;
  

  constructor(private jsonService: JsonService,private router: Router, private pagerService: PagerService) { }

  onChange(){
  	this.changes = true;
  	this.validating = false;
  }
  resetf(){
    this.frdt = "";
    this.todt = "";
    this.dateFilter();

  }
  viewInv(ivno){
    Util.showWait();
    var pdf = window.open(Util.Url("output/IV"+ivno+".pdf"),'_blank', 'toolbar=0,scrollbars=-1,resizable=-1');
    if (pdf == null || typeof(pdf)=='undefined') { 	
      alert('Please disable your pop-up blocker and click the link again.'); 
    } 
    else { 	
      pdf.focus();
    }
    Util.hideWait();

  }

  viewdetails(phno){
    Util.showWait();
    this.selecrec = phno;
    this.pagemode = "V";
    Util.hideWait();
  }
  listmode(){
    Util.showWait();
    this.pagemode = "L";
    Util.hideWait();
  }
  dateFilter(){
    Util.showWait();
    this.pageCount = this.masterPgCnt;
  	if(this.frdt === "" || !this.isValidDate(this.frdt)){
      this.frdt = "0";
    }
    if(this.todt === "" || !this.isValidDate(this.todt)){
      this.todt = "99999999";      
  	} 
		var filtfrdt = this.frdt.replace(/-/g,"");
		var filttodt = this.todt.replace(/-/g,"");
  for(var i=0; i< this.pagedata.payments.length;i++){
      this.pagedata.payments[i].show = true;
			var temp = (this.pagedata.payments[i].dati);
			if(parseInt(temp,10) < parseInt(filtfrdt,10) || parseInt(temp,10) > parseInt(filttodt,10)){
				this.pagedata.payments[i].show = false;
			}
      
      if(this.pagedata.payments[i].show === false){
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


  cancel(){
    Util.showWait();
    this.validating = false;
    Util.hideWait();
    Util.scrollTop();
    this.changes = false;
    this.dispAlert.default(); 
  }



  ngOnInit() {
    this.pagedata.head.status = "I";
    Util.showWait();
    this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT"},Util.Url("CGICPMHIST"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.hideWait(); },
  		() => {
        Util.setHead(this.pagedata.head);
  			Util.responsiveMenu();
  			if (this.pagedata.head.status === "O" || Util.noAuth(this.pagedata.head.menuOp,'PAYMHISTR')) {
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
    this.pagedata.payments.forEach(sq =>{ if(sq.show) this.dispItems.push(sq)});
    // get current page of items
    this.pagedItems = this.dispItems.slice(this.pager.startIndex, this.pager.endIndex + 1);    
  }

  readNext(anchor){
    if(this.killRecur){
      return;
    }
    this.jsonService
    .initService({"mode":"READNEXT", "phno":anchor},Util.Url("CGICPMHIST"))
    .subscribe(data => this.readdata = data,
      err => { Util.hideWait(); },
      () => {
        Array.prototype.push.apply(this.pagedata.payments,this.readdata.payments);
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
    return true;
  }
}
