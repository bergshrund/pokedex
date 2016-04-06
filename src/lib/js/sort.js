function Sort(o) { return this.construct(o); }

Sort.prototype = {

  obj: null,
  col: null,
  desc: false,
  sortype: 'bubble',
  	
  construct: function(o) {	
	if(typeof o == 'object')
	  this.obj = o; 
		
	return this;
   },
   
  compare: function (val1, val2) {
	
	if (val1 == undefined) val1 = '';
	if (val2 == undefined) val2 = '';
	  
    return (this.desc) ? val1 > val2 : val1 < val2;
  },
  
  sort: function(col,desc) {  
   if(col != undefined)
     this.col = col;
  
   if(desc != undefined)
     this.desc = desc;
  
   if(this.sortype == 'bubble')
     this.bubble();    
  },
  
  bubble: function() {    
    var n = this.obj.length; 
    if (n == undefined) return false;
 
    for(var j=n-1; j > 0; j--) {
      for(var i=0; i < j; i++) {
        if(this.compare(this.get(i+1), this.get(i), this.desc)) this.exchange(i+1, i);
      }
    }
  },
   
  get: function(i) {	 
	 return this.obj[i][this.col];	  
	},   

  // set i before j
  exchange: function(i, j){	
	var a = this.obj[i];
	var b = this.obj[j];	 
	this.obj.splice(j,2,a,b);       
  }

};	
