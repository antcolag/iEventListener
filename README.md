#iEventListenr
emulates the eventListener interface in objects that don't support it natively

###well not very well...
given an object like

```javascript
var obj = {}
(function(){
// my iEventListenr implementation
 ...
})(this || window).call(obj, true);
```
you can do this:<br>
```javascript
obj.addEventListener('goofy', function(e){console.log('addEventListener',arguments)});
obj.attachEvent('ongoofy', function(e){console.log('attachEvent',arguments)});
obj.ongoofy = function(e){console.log('ongoofy',arguments)};
...
obj.dispatchEvent(new Event('goofy'));
obj.fireEvent('ongoofy');
```
and will dispaly
```
ongoofy [Event]
addEventListener [Event]
attachEvent [Event]
ongoofy [Event]
addEventListener [Event]
attachEvent [Event]
```
but you can also do this
```javascript
obj.addEventListener('oncabbage', function(e){console.log('addEventListener',arguments)}); //??????
obj.attachEvent('cabbage', function(e){console.log('attachEvent',arguments)});             //??????
obj.dispatchEvent('oncabbage');                 // you can do also this obj.dispatchEvent('cabbage');
obj.fireEvent(new Event('cabbage'));                                                       // ????
```
and the output will be the same<br>
but you can't do this (becouse the 'on' at the begin that will be replaced whit '')
```javascript
obj.addEventListener('onion', function(e){console.log('addEventListener',arguments)})
obj.addEventListener('ion', function(e){console.log('addEventListener',arguments)})
obj.attachEvent('ion', function(e){console.log('addEventListener',arguments)})
obj.attachEvent('onion', function(e){console.log('addEventListener',arguments)})
// all the above methods have the same semantic: add a listener for the 'ion' event
obj.ononion = function(e){console.log('ononion',arguments)};         // this will never be fired!!!!
obj.onion = function(){console.log('onion',arguments)};  // this will be called on ion event and on onion event!!
obj.dispatchEvent('onion');
obj.dispatchEvent('ion');
obj.dispatchEvent(new Event('ion'));
obj.fireEvent('ion');
obj.fireEvent('onion');
obj.fireEvent(new Event('ion'));
```
if you care about this behavior let me know that and (maybe) i can try to fix it..... or you can fix it and let me know your ideas.
Bye
