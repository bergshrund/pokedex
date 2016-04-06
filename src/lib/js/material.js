function snack(message,action) { return this.construct(message,action); }

snack.prototype = {

  container: null,	
  showTimeout: 3000,
  transitionTimeout: 500,
  progress: false,
  action: null, 
   
  construct: function(message,action) {
	  var _this = this; 
	  if(action) this.action = action;	
		  	
	  var snackdiv = document.createElement('div');
	  snackdiv.id = 'errorSnack';
	  snackdiv.className = 'snack';	  
	  this.container = snackdiv;
      
      var snackspan = document.createElement('span'); 	  
	  snackspan.innerHTML = message == undefined?'Unknown error':message;
	  	  	 
	  this.container.appendChild(snackspan);
	  
	  try {
	    var snackact = document.createElement('div');
	    snackact.className = 'snack-action';
	    snackact.innerHTML = action.text;
	    action.handler && Event.add(snackact,'click',function(event){fixup(event); _this.hide(); action.handler(); });
	    this.container.appendChild(snackact);
	    } catch(e) {}
	  	  
	  document.body.appendChild(this.container);
	  	  		  
      return this;	 
    },
  
  show: function() {
	  var _this = this;		  
	  this.progress && this.container && this.container.appendChild(this.progress) && addClass('snack-span',this.container.firstChild);	  
	  this.container.style.marginLeft = this.container.clientWidth?-this.container.clientWidth/2:-284;	  
	  addClass('showsnack',this.container);	  
	  setTimeout(function(){_this.hide();},_this.showTimeout);
	},    
  
  hide: function() {
	   var _this = this;
	   removeClass('showsnack',_this.container);		  		  
	   setTimeout(function(){_this.destroy();},_this.transitionTimeout);		  	  
   },	  

  destroy: function() {
	
	this.container && this.container.parentNode.removeChild(this.container);  
	this.container = null;
	
    }  			
	
 };
 
 
 /**
 * 
 * new floatButton(%id%,%container%).build(%imageClass%).attach(%positionClass%).show();
 * 
 */  
 
 
function floatButton(id,container) { return this.construct(id,container); }

floatButton.prototype = {

  id: 'fb',
  domObject: null,
  className: '',   
  iconClassName: '',
  secondaryIconClassName: null,
  secondaryFb:[],
  withProgress: false,
  progressObj: null,
  container: null,
  handler: null,	  
  construct: function(id,container) {
	  
	if(id) this.id = id;	  	        
    if(container) this.container = container;
    this.id = id;
    
    },
  
  build: function(imageClass) {
	 
	  var floatButtonDiv = document.createElement('div');
      floatButtonDiv.name = 'submit';
      
      floatButtonDiv.id = this.id;
      floatButtonDiv.obj = this;
      floatButtonDiv.className = this.className + ' ' + imageClass;
      
      if(this.secondaryIconClassName) {				
		var sfbicon = document.createElement('div');
		sfbicon.className = this.secondaryIconClassName;
		floatButtonDiv.appendChild(sfbicon);
       }
                                          
      if(this.withProgress) {
		var st = {ok:' web1x-done_white_24dp',error:' web1x-cloud_error_24dp',timeout:' web1x-cloud_outline_24dp'};
		for (l in st) {
		  var s = document.createElement('div');
		  s.setAttribute('name','icon-'+l);
		  s.className = 'web1x-24dp transitionall icon-'+l+st[l];
		  floatButtonDiv.appendChild(s);	    
	      }
	   }			                 
      var fbicon = document.createElement('div');
      fbicon.className = this.iconClassName;            
      floatButtonDiv.appendChild(fbicon); 
                         	 
                        	                                    
      for (var i=0; i<this.secondaryFb.length; i++) {		  
              
        var sfbData = this.secondaryFb[i];
        var sfb = document.createElement('div');
        sfb.className = 'secondary sfb' + (i+1);
        
        var sfbi = document.createElement('div');
        sfbi.style.backgroundColor = sfbData.color;        
        sfbi.innerHTML = sfbData.name;
        sfbi.className = 'secondary-fb';
        sfb.appendChild(sfbi);        
                               
        sfb.style.marginTop = -(i*56) - 28;           
        floatButtonDiv.appendChild(sfb);
      
        sfbi.longdesc = sfbData.tooltip;                     
        data1_sethelper(sfbi,'right',-32,-56);
                      
        if(sfbData.action)
          Event.add(sfb,'click',sfbData.action);              
                      
       }
      
      this.domObject = floatButtonDiv;      
      this.container && this.container.appendChild(this.domObject);
      
      if(this.withProgress) {		 
		this.progressObj = document.createElement('div');
		this.progressObj.className = 'floatbutton-position progress transitionall';		  
		this.container && this.container.appendChild(this.progressObj);
	   }
      
      
      return this;
   	   				  		  	  	  		 	  	 
	},  
  
  attach: function(attachStyle) {		  	 	
	  return this.domObject && attachStyle && addClass(attachStyle,this.domObject)?this:false;	   	  	  
	},  
  
  show: function(hideClass) {
	  
	  var _this = this;
	  
	  setTimeout(function() {	  	  	  	
	      _this.domObject && removeClass(hideClass,_this.domObject);		    
	    },100);
	  
	  return this;  	
	  
	  
	},    

  hide: function(hideClass) {
	  this.domObject && addClass(hideClass,this.domObject);	 		
    }  			
	
 };

function radioButton(id,group) { return this.construct(id,group); }

radioButton.prototype = {
   
   b: null,   
   construct: function(id,group) {
	
	var bid = 'radio'+group+id;
	this.b = document.createElement('div');
	this.b.className = 'material-radio-button';
	this.b.innerHTML = "<input id='"+bid+"' type='radio' name='"+group+"' value='"+id+"'>\
	              <label for='"+bid+"'>\
	              <div class='web1x-24dp web1x-radio_button_off_black_24dp off'></div>\
	              <div class='web1x-24dp web1x-radio_button_on_black_24dp on'></div>\
	              </label>";
	                
	return this;
    
    },
   
   add: function() {
	  return this.b; 
	}    
	
 };	
 

function chip(context,value) { return this.construct(context,value); } 

chip.prototype = {
	context: null,
	c: null,
	value: null,	
	construct: function(context,value) {	 
	  this.context = context;	
	  this.value = value;
	  this.c = document.createElement('div');
	  this.c.className = 'material-chip';
	  this.c.innerHTML = value + "<div class='web1x-24dp web1x-close_circle_24dp off'></div>";	  
	  return this;
	 
     },
    add: function(delCallback) {
	   var _this = this;	
	   Event.add(this.c.lastChild,'click',function(event){ fixup(event); delCallback.apply(_this.context,[_this]); });	
	   return this.c;	
	 }	 
 };	
