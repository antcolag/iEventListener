/******************************************************************************
 * eventListener interface for objects:
 * Whit this snippet you can emulate the eventListener interface in objects that don't support it natively
 * you can also emulate the ie<9 non standard interface
 * or add the corresponding one if needed.
 * The snippet automatically add the missing methods in the browser:
 * in ie<9 add the standard interface and in the other browsers add the ie<9 interface
 * if you want to block this behaviour read line 45.
 *
 * Autor: Antonio
 * Licence: mit;
 * Usage: copy the snippet in a way like this
 *
 * var iEvtListener = (function(w){ 
 *    ...
 * })(this || window);                                         // copy the incapsulated implementation that i wrote
 *
 * var myObject = {};
 * iEvtListener.call(myObject, true);                          // add the Event interface your object (the boolean value is for ie like methods);
 *
 * var removableHandler = function(){ ... }                    // this function could be removed
 *
 * myObject.addEventListener('myevent', function(e){ ... });   // do something when the dispatchEvent is called
 * myObject.attachEvent('onmyevent', function(e){ ... });      // ie like method are supported if needed
 *
 * myObject.addEventListener('myevent', removableHandler);
 *
 * myObject.onmyevent = function(e){ ... };	                // do something before fire event listener handlers;
 * 
 * ...
 * 
 * myObject.removeEventListener('myevent', removableHandler);  // of course you can remove event listeners
 * 
 * myObject.dispatchEvent(new Event('myevent'), 'you can add additional arguments');
 ******************************************************************************/

(function(w){
	
	"use strict"
	
	var namesStandard = ['addEventListener','removeEventListener','dispatchEvent'],
		namesIe = ['attachEvent','detachEvent','fireEvent'],
		EvtLstnrSupport = "addEventListener" in w;
	
	/* delete the / at the and of this line for disabling browser polyfil */
	iEventListener.call(w, true);
	iEventListener.call(w.document, true);
	iEventListener.call(w.Element.prototype, true);
	/* addEventListener on ie8? attachEvent on chrome?? why not? */
	
	
	return iEventListener;
	
	
	/* iEventListener is the 'consructor' of the interface
	 * if this already implements the interface skip
	 * if this already implement the corresponding interface (standard or ie)
	 *   reuse the other one (on ie<9 addEventListener become a wrapper for attachEvent)
	 *
	 * @ieInterface: 
	 *        -if true implement standard and ie interface
	 *        -if undefined implement only standard interface
	 *        -if false implement only ie interface
	 */
	
	
	function iEventListener(ieInterface){
		
		var allEvents = {}, functions = [add,remove,dispatch],
			cases = [ieInterface !== false && namesStandard, ieInterface !== undefined && namesIe],
			func, methodName;
		for(var j in cases){
			j = Number(j);
			if(!cases[j]){
				continue;
			}
			for(var i in cases[j] ){
				if(this[cases[j][i]]){
					continue;
				}
				methodName = cases[j][i];
				func = this[cases[(j+1)%2][i]] ? reuseEvent.call(this, cases[(j+1)%2][i]) : functions[i];
				this[methodName] = this[methodName] || func;
			}
		}
			
		function add(event, handler) {
			event = /^on/.test(event)? event.split(/^on/)[1]: event;
			allEvents[event] = allEvents[event] || [];
			allEvents[event].push(handler);
		}
		
		function dispatch(event) {
			event = typeof event === 'string' ? new Event(event.replace(/^on/, '')) : event
			var onevt = this['on'+event.type];
			w.event = event;
			if(onevt instanceof Function){
				onevt.apply(this, arguments );
			}			
			var eventList = allEvents[event.type];
			for (var i in eventList){
				if(eventList[i] instanceof Function){
					eventList[i].apply(this, arguments);
				}
			}
			w.event = void(0);
			return true;
		}	
		
		function remove(event, handler) {
			event = /^on/.test(event)? event.split(/^on/)[1]: event;
			for (var i in allEvents[event]) {
				if(allEvents[event][i] === handler){
					allEvents[event][i] = void(0);
				}
			}
		}
		
		function reuseEvent(whoe){
			return function(){
				var argv = Array.apply([], arguments);
				if( (EvtLstnrSupport) && (/dispatch/.test(whoe)) ){
					argv[0] = new Event(argv[0].replace(/^on/, ''));
				} else {
					argv[0] = EvtLstnrSupport? argv[0].replace(/^on/, '') : "on"+argv[0]
					argv[2] = !EvtLstnrSupport && argv[2]?(/detach/.test(whoe)<0?this.setCapture():this.removeCapture()):argv[2];
				}
				return (this || w)[whoe].apply(this, argv);
			}
		}
	}
})(this || window);
