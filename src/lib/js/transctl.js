function transcontrol(containerID) { return this.construct(containerID); }

transcontrol.prototype = {
		
	parent: null,
	result: null,
	control: null,	
	rObj: null,
	showOkTimeout: 2000,    // 2s
	showErrTimeout: 2000,   // 2s	
	responseTimeout: 5000,  // 5s
	transitionTimeout: 500, // .5s
	trIn:null,
	trOut:null,
	callbackOk: null,
	callbackErr: null,
	afterAll: null,
	progressContainer: null,
	progressContainerClassName: 'progresscontainer',
	progressSvgClass: 'circular',
	progressClass: 'curform',	
	progressID: 'progbar',
	progressColor: '#4285f4',
	progressType: null,
	progresser: null,
	showErrorTimeoutID: null,	
	code: false, // call return value without envelope (usually html code). This flag usually used together with rObj.eval = false 
    fatalHandler: null,
    tryagainHandler: null,
    tryagainId:'tryagain',
    snackProgress: false,
    snackOnError: true,    
    snackOnTimeout: true,
    snackOnSuccess: false,
    snackOnFatal: false,
	construct: function(container) {
	  
	  var _this = this;
	
	  if(container)	   
	   this.parent = byId(container);
    
      this.progressContainer = null;
       	  	  
	  this.rObj = new requestAPI();
	  
	  this.fatalHandler = this.rObj.fatalHandler = function() { 
		  _this.showresult({retcode:1}); 
		  };
	  	  	  	     
      return this;	 
    },
            
    start: function(args) {
		
		if(!this.rObj) return;
		
		var _this = this;
		
		// 0 -> 1 (out)
		this.transition(0,'out');
		
		// Set OK callback function 
		this.rObj.callback = function(res) {
		
		  if (res.retcode === 1 && _this.rObj.timeoutfunc) {
		    _this.rObj.timeoutfunc(res);
		    return;
	       }	
													         				
		  _this.transition(4,'out');				
		  
		  if(_this.transitionTimeout > 0)		  
		    var intId = setTimeout(function() {_this.showresult(res);},_this.transitionTimeout);
		  else   
		    _this.showresult(res);
		
		};
		
						
		if(args)		 		  
		  this.rObj.args = args;
		
		this.rObj.rid = randomByLength(2,10); 
	     		
		// Set error callback function		
		this.rObj.timeoutfunc = function(res) {
		
		   if(res === undefined)	
			 res = {retcode:1,timeout:1};
			 
		   if (!_this.rObj.rid) _this.rObj.rid = 1;
			
		   // 4 -> 3 (out)
		   _this.transition(4,'out');
		  
		   if(_this.transitionTimeout > 0)
		    var intId = setTimeout(function() {_this.showresult(res);},_this.transitionTimeout);
		   else   
		    _this.showresult(res);
		};    
    
        this.rObj.setprogress(this.parent);
		
		
		// This is response timeout  		
		if(this.responseTimeout)
		  this.rObj.timeout = this.responseTimeout;
						 
		this.rObj.send(function() {		  
		  // 1 -> 4 (in)				
		  // Show progressbar
		  _this.transition(4,'in');
		  _this.rObj.pcontainer = null;
		  });
		
								
	 },
	 
	showresult: function(res) {

        var _this = this;
        _this.result = res;        
                
        var result = res.timeout == 1 || res.retcode == 1?'err':'ok';
                                        
	    if(result == 'ok' && this.doImmediately) this.doImmediately(res);
	
	    // 4 -> 3 (in) 
	    // 4 -> 2 (in)
	    // 1 -> 3 (in)
	    // 1 -> 2 (in)
	    
	    if(res.timeout == 1) {
		  var script = byId(_this.rObj.rid.toString());
	      if (script) var id = script.id;
		  script && script.parentNode.removeChild(script);	
			
	      this.transition(5,'in','Connection timeout');
	      _this.skip = true; 
	      }	    
	    else { 		  
		  if (res.err) var errmsg = (res.retcode == 1 && res.err.button?res.err.button:null);
	      this.transition(result == 'ok'?2:3,'in',errmsg);	      
	      }
        
        // tId
	    	   
	    this.showErrorTimeoutID = setTimeout(function() {
			
			_this.showErrorTimeoutID = null;
			
			if (result == 'ok') {				
				if (_this.callbackOk)
					_this.callbackOk(res);				  								
			  }	
			else if (_this.callbackErr)
					_this.callbackErr(res);
						  			 
			// 2 -> 0 (out)  
			// 3 -> 0 (out)  
			_this.transition(result == 'ok'?2:(res.timeout == 1?5:3),'out');					    
		    var ttId = setTimeout(function() {
			
			   if(_this.control)			
			      _this.parent.innerHTML = _this.control;
			                           			   			  
			   // 2 -> 0 (in)  
			   // 3 -> 0 (in)  								   			   
			   _this.transition(0,'in');
			   
			   var script = byId(_this.rObj.rid.toString());
			   if (script) var id = script.id;
			   script && script.parentNode.removeChild(script);
			   
			   
			   if(_this.afterAll)
			     _this.afterAll(res);
			   			   			                         
			   },_this.transitionTimeout);	
			  			  
		   },result == 'ok'?this.showOkTimeout:this.showErrTimeout);
						
	 },
	 
	transition: function(state,direction,text) {
		var _this = this;
		var currstate = state;
		if(direction == 'in')
			var stack = this.trIn[state];	
		else if (direction == 'out')			
		   var stack = this.trOut[state];


          					
       for (var pr in stack) {						 
			  if (pr == 'text')
			    this.parent.innerHTML = '<span>' + (text?text:stack[pr]) + '</span>';
			  else if (pr == 'merr') {			  				
				var errc = document.createElement('div');
				errc.id = 'error';
				errc.className = 'error-container';
			    errc.innerHTML = "<span>" + (stack[pr]?stack[pr]:text) + "</span><div class='button-container'></div>";			    			    
			    errc.lastChild.appendChild((new flatButton(this.tryagainId,'TRY AGAIN')).add());			    			    
			    this.parent.appendChild(errc);
			    		    
			    }
			    //this.parent.innerHTML = "<div class='mderricon web1x-96dp web1x-cloud_off_black_96dp'></div><div class='mderrmsg'>" + (text?text:stack[pr]) + "</div><div class='empty-content-retry-button-container'><div class='material-flat-button' id='tryagain'><span class='material-flat-button-text color-main'>ПОПРОБОВАТЬ СНОВА</span><div class='material-flat-button-bg transitionall'></div></div></div></div>";
			  else if (pr == 'style') {			   
			    var ns = stack[pr].length;			    
			    for (var i=0; i<ns; i++)
			      for (var op in stack[pr][i])			        
			        ((op == 'add') && addClass(stack[pr][i][op],this.parent)) || 
			        ((op == 'rm') && removeClass(stack[pr][i][op],this.parent));
			   }			
		  }
		
		var ta = byId(this.tryagainId,this.parent);
		if(ta) {
		 if(this.tryagainHandler) {		   
		   Event.removeall(ta,'click');
		   Event.add(ta,'click',function(event) {fixup(event);_this.tryagainHandler()});
	       }
		   
		 else addClass('notdisplay',ta);
	     }
		     
		if(state == 4 && this.progressContainer)
		  switch(direction) { 
			
			case 'in': {  
			 			 
			   if(this.snackProgress) {					
				var prog = new snack(stack['snackText']?stack['snackText']:'Loading ...');		       		       
		        this.progressColor = 'white';
		        this.progressContainerClassName = 'snacks-progressbar';
		        prog.showTimeout = 4000;
		        prog.progress = this.progress();		       		       
		        setTimeout(function(){
					prog && prog.show();
					},100);                
			    }
               else {                 																				 
			     var progbar = this.progress(this.progressType); 				     
		         progbar && this.progressContainer.appendChild(progbar);
			     }
			     
		       break;
		      }
		    case 'out': {				
			  if(!this.snackProgress) {					 
			   var progress = byId(this.progressID);				   
			   progress && progress.parentNode.removeChild(progress);
		       }
			   break;	
		      }		     
		    }
		
		if(state == 5 && direction == 'in' && this.snackOnTimeout){		  
		  var err = new snack(stack.snackText?stack.snackText:text,stack.snackAction?stack.snackAction:null);		  		  		  
		  if(this.showSnackTimeout) err.showTimeout = this.showSnackTimeout;
          setTimeout(function(){err && err.show();},100);
		  }
		
		if(state == 3 && direction == 'in' && this.snackOnError){
		  var err = new snack(text);		  		  		  
          setTimeout(function(){err && err.show();},100);
		  }
		
		
		if(state == 2 && direction == 'in' && this.snackOnSuccess){
		  var success = new snack(stack.snackText);
		  if(this.showOkTimeout > 0) success.showTimeout = this.showOkTimeout;
          setTimeout(function(){success && success.show();},100);
		  }
		
		
		 
		   		     		        		    		     		     					  	
	  },
	 
	 progress: function(type) {
		 
		 var container = document.createElement('div');
		 container.className = this.progressContainerClassName;
		 container.setAttribute('id',this.progressID);
		 
		 if(this.progresser) {
		  var roundiv = document.createElement('div');		 
		  roundiv.className = this.progresser;
	      }
		 
		 var pb = byId(this.progressID);
	     pb && pb.parentNode.removeChild(pb);
	
	     var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');	     
	     svg.setAttribute('width','24px');
	     svg.setAttribute('height','24px');
	     svg.setAttribute('viewBox','0 0 24 24');
	     svg.setAttribute('xmlns',"http://www.w3.org/2000/svg");
	     svg.setAttribute('class',this.progressSvgClass);
	
	
	     var circle = document.createElementNS("http://www.w3.org/2000/svg",'circle');
	     circle.setAttribute('cx','12px');
	     circle.setAttribute('cy','12px');
	     circle.setAttribute('r','10px');
	     circle.setAttribute('stroke',this.progressColor);
	     circle.setAttribute('stroke-width','2px');
	     circle.setAttribute('stroke-linecap','round');
	     circle.setAttribute('fill','none');
	     circle.setAttribute('class',this.progressClass);
	     svg.appendChild(circle);
	      
	     		 	   
	     if(this.progresser) {
	      roundiv.appendChild(svg);
	      container.appendChild(roundiv);
	      }
	     else  
	       container.appendChild(svg);
	
	     return container;
		 
	   }   	 
	  	    	  	  	 	 	   
};
 
 


 
