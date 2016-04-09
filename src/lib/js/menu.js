function Menu(parent) { return this.construct(parent); }

Menu.prototype = {

parent: null,
container: null,
itemClassName: 'mdmitem',
menuClassName: 'mdm',
multipler: 64,
itemHeight: 36,
type: null,
spec: null,
align: 'down',
handler: null, // Item selection handler (for 'list' type only)

construct: function(parent) {

  if(!parent) return false;
  
  this.parent = parent;
  this.container = document.createElement('div');
  

  return this;

 },

build: function(spec,current) {
  
  if(!this.container) return false;

  var _this = this;
  var d = true;		     	  
  var menu = this.spec = spec;      
  var container = this.container;
    
  if(this.menuClassName) addClass(this.menuClassName,container);
                         addClass('ta',container);  
                       
  switch(this.type) {
   case 'list': {	  

      if(current) this.current = current;
               
      // If elems in spec low that height of list then height = spec length      
      try {var l = Object.keys(this.spec).length;} catch(e) { var l = countKeys(this.spec) }                 
      
      if(l < this.height)  this.height = l;  
           
      this.container.className = 'white';
      this.container.style.height = this.itemHeight * this.height;
      this.container.style.overflowX = 'hidden';
      this.container.style.overflowY = 'auto';
      this.container.setAttribute('tabindex','3');

	  for (elem in menu) {
		
		if(!this.current) this.current = menu[elem];
		  
		var div = document.createElement('div');
		div.className = 'mdmitem pointer material-listitem';
		div.innerHTML = elem;
		div.id = elem;
		container.appendChild(div);
				
		if(elem == this.current) {}
		
		Event.add(div,'click',function(event){
			  _this.parent.value = this.id;
			  
			  setTimeout(function(){
		       
		       		  
				  
			  //var _popup = _this.parent.popup; _popup && _popup.hide() && _popup.destroy() && delete _popup;			
			  
			  closePopup(_this.parent.popup);
			  
			  if(_this.handler) _this.handler(_this.parent.id,_this.parent.value);			
		      },200);
			  
			});	
					  	 						
	   }  
	  
	  break; 
	}   
   default: {
	
	if(!menu.items) return false;
	
	if(menu.width) 
      container.style.minWidth = menu.width * this.multipler;
    else if (this.width)  
      container.style.minWidth = container.style.width = this.width;
	   	          
    for(var j=0 ;j < menu.items.length; j++) {
       var item = menu.items[j];
	   var div = document.createElement('div');                                              
	                        	        
	   if(item.border == 1 && d) {
	     var bdiv = document.createElement('div');
	     bdiv.className = 'menubdiv';
	     container.appendChild(bdiv);	          	            	         
	     d = false;
		}
	        	        
	   if(this.itemClassName)
	     div.className = this.itemClassName;  
      
       if(item.events)                 	       
	    for(var s=0; s<item.events.length; s++) {		          								
	     var iv = item.events[s].event; 				   			   			   
		 if(iv.type == 'build')
		  iv.body(_this.parent);				   				  
		 else if(item.disabled !== true) {  
		       iv.code && Event.add(div,iv.type,new Function('',iv.code));
			   iv.body && Event.add(div,iv.type,iv.body);
			   }			     			   			   			   			   			   			
	     }
	       
	   if(item.name)
	       div.name = item.name; 	        

       
       if(item.id) div.id = item.id; 

       if(item.class)	        	        	        	        
	     div.innerHTML = "<div class='mdmicon'><div class='"+item.class+"'></div></div><div class='mdmitem'>"+item.title+"</div>";
	   else if (item.radio) {
		 div.id = item.radio + item.id; 
	     div.innerHTML = "<div class='mdmitem label'>"+item.title+"</div>";
         div.insertBefore((new radioButton(item.id,item.radio)).add(),div.firstChild); 
	     }
       else   
	     div.innerHTML = item.title;
	     	     	            	        	        					   			 	      
	   div.mo = _this;
	        
	   if(!item.disabled)
	       addClass('mdmitemhl',div);
	   else {
		   for(var s=0; s<item.events.length; s++) {
			  var iv = item.events[s].event;										  
			  Event.removeall(div,iv.type);
			  }   	          
	       addClass('disabled',div);	          
		   }
	        	                      	        	        	       	       	      
	     container.appendChild(div);
	        	    	    
    } // for
   }  // default
  }   // switch
 
 return true;	
	
 },
 
show: function(showClass,popupId) {
  
  var _this = this;  
  
  switch(this.type) { 
   case 'list':
     var popupData = {id:(popupId?popupId:'p'+this.parent.id),width:(this.width?this.width:this.parent.clientWidth),height:this.itemHeight * this.height,class:'updown',offsetX:this.offsetX,offsetY:this.offsetY};
     var _popup = initPopup(popupData);     
     _popup.popupObj.className = 'popup tmh popup-shadow'; 
          
     var mY = this.height >2?(this.height%2 > 0?Math.floor(this.height/2):(Math.floor(this.height/2) + (this.align == 'up'?0:-1))):0;
     var wH = this.height;
     var t = countKeys(this.spec);
     var p = this.getItemPos(this.current);
     p = p?(p>=t?t:p):0;
     
     if(p-mY<0) {
		 sT = 0;
		 mY = p==0?0:mY - p;
	   }	
	 else {		
		if(t-p< wH-mY) mY = wH-t+p;
		sT = p-mY; 						 		
	   }	    		 
     
     _popup.marginY = -this.itemHeight * mY;
    
     this.parent.popup = _popup;
	 openPopup(_popup,null,this.parent,{div:this.container},popupData.id);
	 
	 
	 Event.add(this.container,'focus',function(event){this.style.backgroundColor ='#dddddd';});	 
	 //Event.add(this.container,'blur',function(event){_popup && _popup.hide() && _popup.destroy() && delete _popup;});
	 Event.add(this.container,'blur',function(event){closePopup(_popup)});
	 	 	 
	 this.container.scrollTop = sT * this.itemHeight;	 
	 this.container.focus();
	 
	 try { Waves.attach('.material-listitem',['waves-classic']); } catch(e) {}
	 	 	            
   break; 
  
   default:
  
    var popupData = {id:'p'+this.parent.id,decoration:'submenuhl'};
  
    if(this.height && this.container.childNodes.length > this.height) 
      popupData.height = this.height * this.itemHeight + 26;     
    if(this.decoration) 
      popupData.decoration = this.decoration;  
    if(showClass) 
      popupData.class = showClass;
                            		  		  		 
    var _popup = initPopup(popupData);	            	      	   	      	                                                  	          	          	 
    openPopup(_popup,null,this.parent,{div:this.container},popupData.id);
        
    this.parent.popup = _popup;
    _popup.popupObj && addClass('menu-popup',_popup.popupObj) && this.height && this.container.childNodes.length > this.height && addClass('stricted-popup',_popup.popupObj);    
    setTimeout(function(){addClass('show',_this.container) },100);
    
    try {  Waves.attach('.mdmitemhl',['waves-classic']);} catch(e) {}
             
    } 
	
  return true;	
 },
 
hide: function() {
  return true; 	
 },

getItemPos: function(index) {
	
	var i = 0;
	
	for (var ci in this.spec) {
	    if(index == ci)	return i;
	    i++;
	  }	 
	return 0;
  },	

findNode: function(path) {
	
	var p = path.split(/_/);
	
	var spec = this.spec;	
    var pnode = spec.items;
               
    for(var i = 0; i< p.length; i++) {             
       for(var e = 0; e < pnode.length; e++)
         if(pnode[e].id == p[i]) {
           spec = pnode[e];
           if(spec.items) if(spec.items.length > 0) pnode = spec.items;
           break; 
	      }           	      
      }    
	
	return spec;

  },	

 
openSubmenu:  function(path,items,showClass) {
			
	if(this.parent.popup.popupObj) {	
	 var item = byId(path,this.parent.popup.popupObj);
	 
	 if(item)	
	  var menu = new Menu(item);	 	
     }
	 
    if(!menu) return false;		   		                 
    var spec = this.findNode(path);
        
    if(spec) {	
	  if(items)	spec.items = items;		
	  if(spec.ap) menu.attachPos = spec.ap;
      if(spec.align) menu.align = spec.align;
      if(spec.decoration) menu.decoration = spec.decoration;
      menu.build(spec) && menu.show(showClass);
	 }
 }
};


function GetSelectedValue(SelectorName) {
        var elems = document.getElementsByName(SelectorName);
        if (elems) {
           for(var i=0; i<elems.length; i++) {
                  if (elems[i].checked == true) {
                         return elems[i].value; 
               }           
            }           
         }       
        
}
