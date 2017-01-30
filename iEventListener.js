

/******************************************************************************
 * eventListener interface for objects:
 * Whit this snippet you can emulate the eventListener interface in objects that don't support it natively
 * you can also emulate the ie<9 non standard interface
 * or add the corresponding one if needed;
 *
 * usage:
 * copy the function in a way like this:
 *
 * var iEvtListener = (function(w){ 
 *    ...
 * })(this || window);                                         // incapsulated implementation
 *
 * var myObject = {};
 * iEvtListener.call(myObject, true);                          // add the Event interface in myObject with the ie like method too;
 *
 * var removableHandler = function(){ ... }                    // this function will be removed
 *
 * myObject.addEventListener('myevent', function(e){ ... });   // do something when the dispatchEvent is called
 * myObject.attachEvent('onmyevent', function(e){ ... });      // ie like method are supported if needed
 *
 * myObject.addEventListener('myevent', removableHandler);
 *
 * myObject.onmyevent = function(e){ ... };	                   // do something before fire event listener handlers;
 * 
 * ...
 * 
 * myObject.removeEventListener('myevent', removableHandler);  // of course you can remove event listeners
 * 
 * myObject.dispatchEvent(new Event('myevent'), 'you can add additional arguments');
 ******************************************************************************
 * Autor: Antonio
 * Licence: gpl or something like that;
 ******************************************************************************/


(function(w){
	"use strict"
	var names = [
			['addEventListener','removeEventListener','dispatchEvent'],
			['attachEvent','detachEvent','fireEvent']
		];
		
	/* polyfil, comment to prevent */
	iEvent.call(w, true);
	iEvent.call(w.document, true);
	iEvent.call(w.Element.prototype, true);
	w.iEvent = iEvent
	/* addEventListener on ie8? attachEvent on chrome?? why not? */
	

	function iEvent(ieSupport, registeredEventSupport, fallbacks, allEvents){
		allEvents = allEvents || {};
		do{
			ieSupport = !!ieSupport<<0;
			for (var apiset = names[ieSupport], i = apiset.length - 1; i >= 0; i--) {
				this[apiset[i]] = this[apiset[i]] || evtFallwrap.call(this, names[!ieSupport<<0], i, ieSupport)
			}
		}while( (ieSupport = !ieSupport) === false);
		if(registeredEventSupport){
			this.registerEvent = function(event){
				allEvents[event] = allEvents[event] || [];
				return ((!allEvents[event].eventSignature) ? (allEvents[event].eventSignature = new EventSignature()) : undefined);
			}
		}
		return this;
			
		/*
		 * the evtFallwrap function, when invoked, return the corresponding functions in the in the native interface or make an emulation
		 */
		function evtFallwrap(whoe, index, nie , fallbacks){
			fallbacks = fallbacks || [add,remove,dispatch];
			return this[whoe[index]] ? evtSelector : fallbacks[index];
			function evtSelector(evnt,func,capt){
				if(index == 2){
					arguments[0] = nie ? new Event(arguments[0].replace(/^on/, '')) : "on"+evnt.type
				}else{
					arguments[0] = nie? evnt.split("on")[1] : "on"+evnt;
					arguments[2] = (!nie) && capt? (whoe[index].indexOf("detach") < 0 ? this.setCapture() : this.removeCapture() ) : capt;
				}
				return this[whoe[index]].apply(this, arguments)
			}
					
			function add(event, handler) {
				event = nie? event.split(/^on/)[1]: event;
				allEvents[event] = allEvents[event] || [];
				allEvents[event].push(handler);
			}
			
			function remove(event, handler) {
				event = whoe == names[1]? event.replace(/^on/, '') : event;
				for (var i in allEvents[event]) {
					if(allEvents[event][i] === handler){
						allEvents[event][i] = void(0);
					}
				}
			}
			
			function dispatch() {
				arguments[0] = nie ? new Event(arguments[0].replace(/^on/, '')) : arguments[0]
				var onevt = this['on'+arguments[0].type];
				w.event = arguments[0];
				if(onevt instanceof Function){
					onevt.apply(this, arguments );
				}
				var eventList = allEvents[arguments[0].type || arguments[0].replace(/^on/, '')];
				if((!eventList) || (eventList.eventSignature && eventList.eventSignature != arguments[1])){
					return;
				}
				for (var i in eventList){
					if(eventList[i] instanceof Function){
						eventList[i].apply(this, arguments);
					}
				}
				w.event = void(0);
				return true;
			}
		}
		
		function EventSignature(argument) {
			this.timestamp = new Date()*1
		}
	}
})(this || window);
