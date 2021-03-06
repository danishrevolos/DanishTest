import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { JsonService } from '../utilities/json.service'; 
import { Util } from '../utilities/util';
import { Overridedata, Ovrd } from './overridedata';
import { Textfield} from '../utilities/textfield';
import { Dispalert , Errsetter } from '../utilities/dispalert';

@Component({
  selector: 'app-descoverride',
  templateUrl: './descoverride.component.html'
})
export class DescoverrideComponent implements OnInit {

	pagedata = new Overridedata;
	validating = false;
	valid = false;
	changes = false;
	modebtn = "ADD";
	//Input Fields
	srky = new Textfield;
	srky2= new Textfield;
	form= new Textfield;
	desc = new Textfield;
	dsc3 = new Textfield;
	descq = new Textfield;
	qdsc = new Textfield;
	dlr  = new Textfield;
	prg  = new Textfield;
	lob	 = new Textfield;
	letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	seq:String = "A";
	initload = true;
	cmpc:string = "INT";
	//Alerts
  dispAlert = new Dispalert();
  errSet    = new Errsetter();
  //Top Section
  selectedRec = new Ovrd;
  //New Rec Skeleton
  newRec = new Ovrd;	
  index : number;
  PMTYPE : string;
  dispType : string;
  qdscel:any;

  constructor(private jsonService: JsonService,private router: Router, private route: ActivatedRoute) { 
  	this.router.routeReuseStrategy.shouldReuseRoute = function(){
	    return false;
		};

		this.router.events.subscribe((evt) => {
	    if (evt instanceof NavigationEnd) {
	      this.router.navigated = false;
	      window.scrollTo(0, 0);
	    }
		});
  }

  remove(inobj){
	if(confirm("Delete this Component?")){
	var indx = this.selectedRec.bullets.findIndex(obj => obj.dscx==inobj.dscx);  
	if(indx > -1) this.selectedRec.bullets.splice(indx,1);
	}
  }
  addcomponent(){

	if(this.descq.value ==""){
		this.descq.message = '(required)'
		return false;	
	}

	var indx = this.selectedRec.bullets.findIndex(obj => obj.dscx==this.descq.value.toUpperCase());
	if(indx > -1){
		this.descq.message = '(Already exists!)'
		return false;
	}
	this.onChange();
	var jsobj ={desc:this.descq.value,seq:this.seq,dscx:this.descq.value.toUpperCase()};
	this.selectedRec.bullets.push(jsobj);
	//this.selectedRec.bullets = Util.sortByKey(this.selectedRec.bullets,"seq","A");
	this.descq.value ="";
	Util.showWait();
	Util.hideWait();
	//Util.modalid("hide","addnew");
  }
  showParag(el){
	  var htm = el.qdsc.toString();
	  htm = htm + '<ul style="list-style-type: square;margin: 20px;color: black;font-weight: bold;font-size: 16px;">';
	  el.bullets.forEach(element => {
		htm = htm + '<li style="display:inline;margin-left:30px;padding-top:5px;"><i class="fa fa-angle-double-right" style="font-size:20px;color:#53afff"></i>'+element.desc +'</li>';
	  });
	  htm = htm + "</ul>"; 
	  Util.showParag(htm);
	  this.qdscel = el;

  }
  editfrommodal(){
	this.closemodal();  
	this.onSelect(this.qdscel);
  }
  closemodal(){
	  Util.modalid("hide","modalqdsc");
  }
  closemodal2(){
	  Util.modalid("hide","addnew");
  }
  toglelg(flag){
	  flag.belg = !flag.belg;
  }
  onChange(){
  	this.changes = true;
  	this.validating = false;
  }

  cmpcChng(){
	  this.cancel('R');
	  this.ngOnInit();
  }

  newcomp(){
	this.seq = 'A';
	this.descq.value ='';
	this.descq.message ='';
	Util.modalid("show","addnew"); 
  }

  addRecInit(){
  	//delete this.selectedRecG;
	this.selectedRec.default("ADD");
	this.selectedRec.bullets.pop();
  	this.dispAlert.default();
  	Util.showWait();
  	Util.showTopForm();
  	Util.hideWait();
  	this.validating = false;
  	this.changes = false;
  	this.selectedRec.type = this.PMTYPE.toUpperCase();
  	this.modebtn = "ADD";
  	Util.scrollTop();
  	Util.focusById("srky");
  }

  cancel(mode){
    if(mode=="") Util.showWait();
    this.validating = false;
	this.selectedRec.default("ADD"); 
	this.selectedRec.bullets.pop();
    if(mode=="")Util.hideWait(); 
    Util.hideTopForm();
    this.modebtn = "ADD";
    this.dispAlert.default();
    Util.scrollTop();
    this.changes = false;  	
  }

  onSelect(record) {
  	this.dispAlert.default();
  	//delete this.selectedRecG;
	this.selectedRec.srky = record.srky;
	this.selectedRec.srky2 = record.srky2;
	this.selectedRec.form = record.form;
	this.selectedRec.prg  = record.prg;
  	this.selectedRec.srkyi= record.srkyi;
  	this.selectedRec.desc = record.desc;
  	this.selectedRec.dsc3 = record.dsc3;
  	this.selectedRec.qdsc = record.qdsc;
  	this.selectedRec.dlr  = record.dlr;
  	this.selectedRec.dlri = record.dlri;
  	this.selectedRec.type = record.type;
  	this.selectedRec.lob = record.lob;
  	this.selectedRec.cmpc = this.cmpc;
	this.selectedRec.belg = record.belg; 
	this.selectedRec.bullets = JSON.parse(JSON.stringify(record.bullets));  
	//this.selectedRec.bullets = Util.sortByKey(this.selectedRec.bullets,"seq","A");

  	//this.selectedRecG = record;
  	this.selectedRec.mode = "SAVE";
  	this.modebtn = "SAVE";

    Util.showWait();
    Util.showTopForm();
    Util.hideWait();
    Util.scrollTop();
    this.changes = false;
  }

  delete(){
  	if(confirm("Delete this Override?")){
  		this.selectedRec.mode = "DELETE";
  		Util.showWait();
  		this.jsonService
  		.initService(this.selectedRec,Util.Url("CGICDESOVR"))
  		.subscribe(data => this.errSet = data,
  			err => { this.dispAlert.error(); Util.hideWait(); },
  			() => {
  				this.dispAlert.setMessage(this.errSet);
  				if(this.dispAlert.status === "S"){
  					this.pagedata.overrides.splice(this.pagedata.overrides.findIndex(obj => obj.srkyi==this.selectedRec.srkyi && obj.dlri==this.selectedRec.dlri),1);
  					setTimeout(() => {
  						Util.showWait();
  						this.cancel('');
  					}, 500);
  				} else {
  					Util.hideWait();
  				}
  			})
  	}
  }

  checkData(){
  	this.validating = true;
  	this.valid = true;
  	//Reset Error Messages
	this.srky.message = "";
	this.srky2.message = "";
	this.form.message = "";
	this.prg.message = "";  
	this.lob.message = "";  
  	this.desc.message = "";
  	this.dsc3.message = "";
  	this.descq.message = "";
  	this.descq.value = "";
  	this.qdsc.message = "";
  	this.dlr.message  = "";
  	this.dispAlert.default();
  	//Trim Field Values
  	this.srky.value = this.selectedRec.srky.trim().toUpperCase();
  	this.form.value = this.selectedRec.form.trim().toUpperCase();
  	this.srky2.value = this.selectedRec.srky2.trim().toUpperCase();
  	this.prg.value  = this.selectedRec.prg.trim().toUpperCase();
  	this.lob.value  = this.selectedRec.lob.trim().toUpperCase();
  	this.dlr.value  = this.selectedRec.dlr.trim().toUpperCase();

  	this.selectedRec.srky = this.selectedRec.srky.trim().toUpperCase();
  	this.selectedRec.form = this.selectedRec.form.trim().toUpperCase();
  	this.selectedRec.srky2 = this.selectedRec.srky2.trim().toUpperCase();
  	this.selectedRec.dlr  = this.selectedRec.dlr.trim().toUpperCase();
  	this.selectedRec.prg  = this.selectedRec.prg.trim().toUpperCase();
  	this.selectedRec.lob  = this.selectedRec.lob.trim().toUpperCase();
  	this.selectedRec.cmpc  = this.cmpc;

  	this.desc.value = this.selectedRec.desc.trim();
  	this.dsc3.value = this.selectedRec.dsc3.trim();
  	this.qdsc.value = this.selectedRec.qdsc.trim();

		if(this.srky.value == "" && (this.PMTYPE !== 'Coverage' || this.cmpc!=="PIP") ){ this.srky.message = "(required)"; this.srky.erlevel = 'D'; this.valid = false;}
		if(this.srky.value == "" && this.PMTYPE == 'Coverage' &&
		this.cmpc=='PIP' && this.selectedRec.prg.charAt(0).toUpperCase() !== 'M' ){ 
			this.srky.message = "(required)"; this.srky.erlevel = 'D'; this.valid = false;}
	//	if(this.form.value =="" && this.cmpc =='PIP' && this.selectedRec.srky && this.PMTYPE=='Program' && this.selectedRec.srky!=='' && this.selectedRec.srky.charAt(0).toUpperCase() == 'M'){
		//	this.form.message = "(required)"; this.form.erlevel = 'D'; this.valid = false;
		//}
  	if(this.desc.value == ""){ this.desc.message = "(required)"; this.desc.erlevel = 'D'; this.valid = false;}
  	if(this.PMTYPE == 'Program' && this.lob.value == ""){ this.lob.message = "(required)"; this.lob.erlevel = 'D'; this.valid = false;}

  	this.loadDb();
  }

  loadDb(){
	  if(!this.valid) return false;
	  var fill = false;
	Util.showWait();
	if(this.srky.value == ""){ this.selectedRec.srky = '!'; fill =true;}
  	this.jsonService
  	.initService(this.selectedRec,Util.Url("CGICDESOVR"))
  	.subscribe(data => this.errSet = data,
  		err => {this.dispAlert.error(); Util.hideWait();},
  		() => {
			  this.changes = false;
			  
  			this.dispAlert.setMessage(this.errSet);
  			if(this.dispAlert.status === "S"){
  				if(this.selectedRec.mode == "ADD"){
  					this.newRec.srky = this.selectedRec.srky;
					  this.newRec.srky2 = this.selectedRec.srky2;
					  this.newRec.form = this.selectedRec.form;
					  if(this.PMTYPE == 'Program')
					  this.newRec.srkyi= this.selectedRec.srky.toUpperCase().padEnd(10) +
					  					 this.selectedRec.srky2.toUpperCase().padEnd(10)+
										   this.selectedRec.prg.toUpperCase();
						else
						this.newRec.srkyi= this.selectedRec.srky.toUpperCase().padEnd(10) +
										   this.selectedRec.prg.toUpperCase();
					if(fill){this.selectedRec.srky ="";this.newRec.srky ="";}
  					this.newRec.prg = this.selectedRec.prg;
  					this.newRec.desc = this.selectedRec.desc;
  					this.newRec.dsc3 = this.selectedRec.dsc3;
  					this.newRec.qdsc = this.selectedRec.qdsc;
  					this.newRec.dlr  = this.selectedRec.dlr;
  					this.newRec.dlri = this.selectedRec.dlr.toUpperCase();
  					this.newRec.type = this.selectedRec.type.toUpperCase();
  					this.newRec.lob = this.selectedRec.lob.toUpperCase();
  					this.newRec.cmpc = this.cmpc;
					this.newRec.belg = this.selectedRec.belg;
					this.newRec.bullets = this.selectedRec.bullets;
					  

					  this.pagedata.overrides.push(JSON.parse(JSON.stringify(this.newRec)));
					  this.pagedata.overrides = Util.sortByKey(this.pagedata.overrides,"srky","A");

  					setTimeout(() => {
  						Util.showWait();
  						this.cancel('');
  					}, 500);
  				}
  				if(this.selectedRec.mode == "SAVE"){
  					this.index = this.pagedata.overrides.findIndex(obj => obj.srkyi==this.selectedRec.srkyi && obj.dlri==this.selectedRec.dlri);
  					this.pagedata.overrides[this.index].srky = this.selectedRec.srky;
					  this.pagedata.overrides[this.index].srky2 = this.selectedRec.srky2;
					  this.pagedata.overrides[this.index].form = this.selectedRec.form;
					  if(this.PMTYPE == 'Program')
					  this.pagedata.overrides[this.index].srkyi = this.selectedRec.srky.padEnd(10)+
					  											  this.selectedRec.srky2.padEnd(10)+
																	this.selectedRec.prg; 
					  else
					  this.pagedata.overrides[this.index].srkyi = this.selectedRec.srky.padEnd(10)+
																	this.selectedRec.prg;
					if(fill){this.selectedRec.srky ="";this.pagedata.overrides[this.index].srky="";}
  					this.pagedata.overrides[this.index].prg = this.selectedRec.prg; 
  					this.pagedata.overrides[this.index].desc = this.selectedRec.desc; 
  					this.pagedata.overrides[this.index].dsc3 = this.selectedRec.dsc3; 
  					this.pagedata.overrides[this.index].qdsc = this.selectedRec.qdsc; 
  					this.pagedata.overrides[this.index].dlr = this.selectedRec.dlr; 
  					this.pagedata.overrides[this.index].dlri = this.selectedRec.dlr;
  					this.pagedata.overrides[this.index].type = this.selectedRec.type; 
  					this.pagedata.overrides[this.index].lob = this.selectedRec.lob; 
  					this.pagedata.overrides[this.index].cmpc = this.cmpc; 
  					this.pagedata.overrides[this.index].belg = this.selectedRec.belg; 
					this.pagedata.overrides[this.index].bullets = this.selectedRec.bullets; 
					this.pagedata.overrides = Util.sortByKey(this.pagedata.overrides,"srky","A");
  					setTimeout(() => {
  						Util.showWait();
  						this.cancel('');
  					}, 500);
  				}
  				
  			} else{
  				Util.hideWait();
  			}
  		}
  		)
  }



  ngOnInit() {
	//  this.PMTYPE = this.route.snapshot.paramMap.get('PMTYPE');
	this.PMTYPE = 'Program';
	if(window.location.href.indexOf("Coverage")>-1) this.PMTYPE = 'Coverage'; 
	Util.showWait();
	this.pagedata.head = Util.getHead(this.pagedata.head);
  	this.jsonService
  	.initService({"mode":"INIT", "type":this.PMTYPE,"cmpc":this.cmpc},Util.Url("CGICDESOVR"))
  	.subscribe(data => this.pagedata = data,
  		err => {Util.hideWait(); },
  		() => {
			Util.setHead(this.pagedata.head);
			  if(this.initload)
					  Util.responsiveMenu();
			  else
					  Util.resetMenu();
			this.initload = false;		  
  			if (this.pagedata.head.status === "O" || !this.pagedata.head.as400) {
  				Util.showWait();
  				setTimeout(() => {
  					Util.hideWait();
  					this.router.navigate(['/app']);
  				}, 100);
  			} else {
				this.pagedata.overrides = Util.sortByKey(this.pagedata.overrides,"srky","A");
  				Util.hideWait();
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
