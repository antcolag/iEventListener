#iEventListenr
emulates the eventListener interface in objects that don't support it natively

###well not very well...
given an object like

```javascript
var obj = {}
(function(){
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
obj.addEventListener('ongoofy', function(e){console.log('addEventListener',arguments)}); //??????
obj.attachEvent('goofy', function(e){console.log('attachEvent',arguments)});             //??????
obj.dispatchEvent('ongoofy');                 // you can do also this obj.dispatchEvent('goofy');
obj.dispatchEvent(new Event('goofy'));
```
and the output will be the same
but you can't do this (becouse the 'on' at the begin that will be replaced whit '')
```
obj.addEventListener('onion', function(e){console.log('addEventListener',arguments)})
obj.addEventListener('ion', function(e){console.log('addEventListener',arguments)})
obj.attachEvent('ion', function(e){console.log('addEventListener',arguments)})
obj.attachEvent('onion', function(e){console.log('addEventListener',arguments)})
// all the methods have the same semantic: add a listener for the 'ion' event
obj.ononion = function(e){console.log('ononion',arguments)};                        //this will never be fired!!!!
obj.onion = function(e){console.log('onion',arguments)};
obj.dispatchEvent('onion');
obj.dispatchEvent('ion');
obj.dispatchEvent(new Event('ion'));
obj.fireEvent('ion');
obj.fireEvent('onion');
obj.fireEvent(new Event('ion'));
```
