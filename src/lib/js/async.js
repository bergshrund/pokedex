function requestAPI(parent) { return this.construct(parent); }

requestAPI.prototype = {
  
 parent: null,    // from were called
 
 rid: null,       // request id
 sid: null,       // session id
 sip: null,       // session ip
 callback: null,  // call after replay
 url: null,       // api URI
 command: {},   // api command
 args: {},      // api args

 parserName: 'parseResponse',
 parserBody: function() {},

 pcontainer: null, // progress container
 clearpc: false,    // clear progress container before and after progress 
 pshowdelay: 1000, // show progress after delay (ms)
 progressId: null,   

 fatal: false,     // fatal error here 
 fatalHandler: null,
 timeout: 5000,    // call failed after   
 timeoutId:  null,
 timeoutfunc: null,
 
 construct: function(parent) {
	if(parent)
	  this.parent = parent; 
    return this;	 
  },	 
 
 
 setprogress: function(container) {
	 
	 if(container)
	   this.pcontainer = container;
	 	 	 
	 return false;
   }, 
 
 showprogress: function(doit) {
	
	var _this = this;
			
	this.progressId = setTimeout(function() {   
                     
       _this.progressId = null;    
       
       if(_this.pcontainer != null && _this.clearpc) {    
         _this.pcontainer.innerHTML = '';
         _this.pcontainer.className = '';
	    }
       
       if(doit) doit();
                    
       
       // start timeout
       _this.timeoutId = setTimeout(function() { 
		   
		   _this.clearprogress(_this);
		   if(_this.timeoutfunc)
		    _this.timeoutfunc();		   
		   
		   },_this.timeout);
       
              			
	  }, this.pshowdelay);
			   	
   },
 
 clearprogress: function(_this) {
	
	if (_this.progressId != null) {
	   clearTimeout(_this.progressId);
	   _this.progressId = null;
	  }
	
	if (_this.timeoutId != null) {
	   clearTimeout(_this.timeoutId);
	   _this.timeoutId = null;
	   
	   if(_this.pcontainer != null && _this.clearpc) {  	   
	    _this.pcontainer.innerHTML = '';
	    _this.pcontainer.className = '';
	    _this.pcontainer = null;	  
        }	   	   
	  }		 	   	 
   }, 
 
 	   
 send: function(doit) {
	
	var _this = this; 	 
		
	window[this.parserName] = this.parserBody;
			
	this.showprogress(doit?doit:null);	
	
	var script = document.createElement('script')
	script.id = this.rid;
	script.src = this.url;
	script.type = 'application/javascript';
	document.body.appendChild(script);                                         									 
	
	console.log('start load script');
	
	return true; 				   
  }
 
   
  	 
};
