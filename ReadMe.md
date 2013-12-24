# DRBD (http://www.drbd.org/) 

This is a module to connect, load and use zipabox.

## License

```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 0.1, December 2013

 Copyright (C) 2013 DRBD Interface <jchenavas@gmail.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```

```
 This program is free software. It comes without any warranty, to
 the extent permitted by applicable law. You can redistribute it
 and/or modify it under the terms of the Do What The Fuck You Want
 To Public License, See http://www.wtfpl.net/ for more details.
```

## Description

Get DRBD Proc

## Installation
```
npm install drbd
```

## Example
```js
var Drbd = require("drbd");
var drbd = new Drbd([true/false for showing logs]);

drbd.events.OnAfterOpen = function(){	
	console.log("#######################################################");
	console.log(JSON.stringify(drbd.nodes,null,4));
	console.log("#######################################################");
}

drbd.Open();
```