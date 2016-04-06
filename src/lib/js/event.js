Event = ( function(){
var guid = 0;

function fixEvent(event) {
 
  event = event || window.event;
  
  if (event.isFixed) {
   return event;
   }
  event.isFixed = true;

  // Для IE встановити заборону на обробку за замовченням 
  event.preventDefault = event.preventDefault || function () { this.returnValue = false; };  
  // Для IE встановити заборону на всплиття
  event.stopPropagation = event.stopPropagation || function () { this.calcelBubble = true; };

  if(!event.target) {
    event.target = event.srcElement;  
   }
  
  // Додати relatedTarget для IE якщо це потр╕бне
  if (!event.relatedTarget && event.fromElement && event.toElement) { 
    event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement; 
   }
   
  // Для IE знайти значення pageX та pageY      
  if (event.pageX == null && event.clientX != null) {	 
   var html = document.documentElement;
   var body = document.body;
   event.pageX = event.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
   event.pageY = event.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
   }

  //Записати натискання клав╕ши миши для IE 
  // 1 == л╕ва, 2 == середня, 3 == права
  if (!event.which && event.button) {
     event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
   }

  return event;

 }

function commonHandler(event) {
	
  event = fixEvent(event);

  if(!this.events) return false;

  var handlers = this.events[event.type];
 
  for (var g in handlers) {
   var handler = handlers[g];
   var ret = handler.call(this,event);
   if (ret === false) {
     event.preventDefault();
     event.stopPropagation();
    }
   }

 }

return {
  add: function(elem,type,handler) {
   
   // глюк з об'╓ктом window
   if (elem.setInterval && (elem != window && !elem.frameElement)) {
     elem = window;
    }
   
   if (!handler.guid) {
    handler.guid = ++guid;
    }
   
   if (!elem.events) {
    elem.events = {};
    elem.handle = function(event) { 
       if (typeof Event !== "undefined") {
          return commonHandler.call(elem, event);
        }
     }
    }

   if (!elem.events[type]) {
     elem.events[type] = {};

     if(elem.addEventListener) {
       elem.addEventListener(type,elem.handle,false);
      }
     else if (elem.attachEvent) {
       elem.attachEvent("on" + type,elem.handle);
      }
    }

   elem.events[type][handler.guid] = handler;
   
   },
  removeall:function(elem,type) {
	  
	  var handlers = elem.events && elem.events[type];
      if (!handlers) return;
                       
      for (var any in handlers) {		
		delete handlers[any];  
		if (elem.remoteEventListener)
         elem.remoteEventListener(type,elem.handle,false);
        else if (elem.detachEvent)
         elem.detachEvent("on" + type, elem.handle); 				 
	   }	  
      
      delete elem.events[type];
	
   },
  getone: function(elem,type) {
	  
	  try {var handlers = elem.events[type]} catch(e) { return true; }
      if (!handlers) return function() { return false };
                       
      for (var any in handlers) {
	    return handlers[any];
       }
	  
    },
  getoneguid: function(elem,type) {
	  
	  try {var handlers = elem.events[type]} catch(e) { return true; }
      if (!handlers) return false;
                       
      for (var any in handlers) {
	    return any;
       }
	  
    },
    
    	      
  remove: function(elem,type,handler) { 
    var handlers = elem.events && elem.events[type];
    if (!handlers) return;
    
    delete handlers[handler.guid];
    
    for (var any in handlers) return
     if (elem.remoteEventListener)
      elem.remoteEventListener(type,elem.handle,false);
     else if (elem.detachEvent)
      elem.detachEvent("on" + type, elem.handle); 

      delete elem.events[type];
   
      for (var any in elem.events) return
       try {
          delete elem.handle;
          delete elem.events;
        } catch(e) {
          elem.removeAttribute("handle");
          elem.removeAttribute("events");
        }
        

   }
 }
}())


window['Event'] = Event;
