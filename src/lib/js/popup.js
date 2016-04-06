function closeAllPopup(type) {

   var pops = getElementsByClassName('popup');
   var length = pops.length;
   
   for (_p in pops) {    
     var p = pops[_p];
     if(p.popup) {		
	   if(p.popup.noclose === true) continue;
	 	  
       if(type != undefined) {
         if(p.popup.type == type)
          p.popup.hide() && p.popup.destroy();
         }
       else
         p.popup.hide() && p.popup.destroy();
       }      
    }
        
  }

function closePopup(popup,delay) {
	
	if(delay > 0)
	 setTimeout(function(){ popup && popup.hide() && popup.destroy() && delete popup; },delay);
	else
	 popup && popup.hide() && popup.destroy() && delete popup;
	
  }	


function initPopup(popupData) {				
	var _popup = new popup(popupData.id);
	_popup.width = popupData.width?popupData.width:null;
	_popup.height = popupData.height?popupData.height:null;
	_popup.style = popupData.decoration?popupData.decoration:null;	    		   
    _popup.offsetX = popupData.offsetX?popupData.offsetX:0;
    _popup.offsetY = popupData.offsetY?popupData.offsetY:0;
    _popup.class = popupData.class?popupData.class:'left-bottom-down';                	
	return _popup;
  }
  	 	
function openPopup(_popup,event,attachedTo,contentObj,popupID) {	 	
	 	 	 			 
     if(!byId(popupID)) {
		     		      		      
	    if(contentObj) { 		  
		 _popup.content = contentObj.div;		 
	     contentObj.popup = _popup;         
         _popup.popupInit(popupID,attachedTo);        
	     }	     
	     return _popup;	    
	    }
	  else {             
			if(attachedTo.popup) attachedTo.popup.hide() && attachedTo.popup.destroy() && delete attachedTo.popup;
			return true;
		   }	 	 	
   }

function popup(popupID) { return this.construct(popupID); }

popup.prototype = {	
    
    id: null,       // ідентифікатор головного div’а    
	popupObj: null, // DOM - об’єкт головного diva
	
	height: null,
	width: null,	
	zIndex: 10,	
					
	attachObj: null, // DOM - об’єкт до якого буде прикріплено popup	
	style: null,
		
	class: 'right-bottom-down',
					
	offsetX: 0,
	offsetY: 0,
	
	handler: null, // close handler	
	content: null,	
	
	noclose: false, // never closed by document's event handler
	opened: false,					
						
construct: function(popupID) {
	if (popupID == null) return false;				
	this.id = popupID;
	
	this.popupObj = document.createElement('div');
    this.popupObj.id = this.id;				  
	
	this.popupObj.className = 'popup ta';	
	return this;			
  },	

popupInit: function(id,eventer){
	var c = {X:null,Y:null}; 		    			  	  	    		     		     		
    if(this.attachObj == null || eventer.id != this.attachObj.id)            	  	  		          
      this.build(id) && this.attach(eventer,c) && this.show(c);           	 
  },

build: function(popupID) {
		
	this.popupObj.popup = this;				
    Event.add(this.popupObj,'mousedown',function(event) { fixup(event) }); 
									 
	if(this.content != null)    
	  this.popupObj.appendChild(this.content);

    // INSERT POPUP TO DOM HERE 	  	  	  
    if(this.class != 'wrapped')
	  document.body.appendChild(this.popupObj);
		  
	return true;
  },	
	
attach: function(attachtoObj,c) {
	
	if (!attachtoObj || !this.popupObj) return false;
	
	this.attachObj = attachtoObj;
    if(this.style && this.attachObj) 
     addClass(this.style,this.attachObj);
    
    !this.noclose && this.addCloseEvent();  
            
    var b = document.body.getBoundingClientRect();
    var ac = getXY(attachtoObj);
         
    var html = document.documentElement;
    var r = html.scrollTop?html.scrollTop:window.scrollY;   
    var t = ac.top + b.top;
    
    var content = this.popupObj.firstChild;
    
    switch(this.class) {
	 
	 case 'right-bottom-down':
	      var X = ac.left + this.attachObj.clientWidth + this.offsetX;
	      c.X = X - content.clientWidth; 	      
	      var Y = t + this.attachObj.clientHeight + this.offsetY;
	      break;	 
	 
	 case 'updown':
	      
	      this.popupObj.style.width = this.attachObj.clientWidth;
	      this.popupObj.style.height = 0;	      
	      var X = ac.left + this.offsetX;
	      var Y = t + this.offsetY;	      
	      c.X = 0;	      
	      c.Y = 0;
	      if(this.marginY) c.mY = this.marginY; 	      	 
	      break;
	      	      	      	 
	 case 'wrapped':
	      break;     
	 	 	     
     }
      
    if(Y) this.popupObj.style.top = Y;
    if(X) this.popupObj.style.left = X;	      	      	      
    
    return true;
        
 }, 
  			
show: function(c) {
	var _this = this;					  
	
	this.popupObj.style.zIndex=this.zIndex;
							
	if(this.class == 'wrapped') {
	   var w = byId('wrapper');
	   w.appendChild(this.popupObj);		   
	   addClass('display',w);
	   
	   w && setTimeout(function(){		   
		addClass('show',w);
		_this.popupObj.style.width=_this.width;	       		   
		},50);
	  }
	else {	  
	  this.popupObj.style.width=this.width != null?this.width:this.popupObj.firstChild.clientWidth;	
	  this.popupObj.style.height=this.height != null?this.height:this.popupObj.firstChild.clientHeight;	
     }	  	 
	
	if(c.X != null) this.popupObj.style.left = c.X;
	if(c.Y != null) this.popupObj.style.top = c.Y;	
	if(c.mY != null) this.popupObj.style.marginTop = c.mY;
		  	  	  	  
    this.opened = true;
            	  	
 },	
	
hide: function() {					
	if(this.popupObj) this.popupObj.style.visibility = 'hidden';
	return true;				  	
},		
	    			
destroy: function() {
            
   if(this.style && this.attachObj) removeClass(this.style,this.attachObj);    
                
   this.attachObj = null;        
   this.width = null;
   
   this.opened = false;
          
   try {this.popupObj.parentNode.removeChild(this.popupObj);} catch(e) {}
     
   this.popupObj = null;                
   if (this.handler != null) {		
	    Event.remove(document,'mousedown',this.handler);
	    this.handler = null;
      }	 
   return true;	  	                       
 },

addCloseEvent: function() {
   var _this = this;
   var handler = function(event) {		 	 	 	
     if(!_this.attachObj || _this.attachObj.id != event.target.id)
	  	  _this.hide() && _this.destroy() && delete _this;	  		  
     }   
   Event.add(document,'mousedown',handler);           
   this.handler = handler;     
 }
 
};
