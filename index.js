var _ = require("underscore");
var exec = require("child_process").exec;
var Events = require("./lib/Events");

// Drbd #############################
var InternalEvents;

function Drbd(showlogs){	
	this.showlogs = (showlogs != null) ? showlogs : false;
	this.nodes = [];
	this.events = new Events();
		
	InternalEvents = new Events();
		
	var me = this;
	InternalEvents.OnBeforeOpen = function(){
		if (me.events.OnBeforeOpen) me.events.OnBeforeOpen();
	};
	InternalEvents.OnAfterOpen = function(){
		if (me.events.OnAfterOpen) me.events.OnAfterOpen();
	};
	InternalEvents.OnBeforeParseData = function(datas){
		if (me.events.OnBeforeParseData) me.events.OnBeforeParseData(datas);
	};
	InternalEvents.OnAfterParseData = function(datas){
		if (me.events.OnAfterParseData) me.events.OnAfterParseData(datas);
	};
};

Drbd.prototype = {
	Open: function(){
		var me = this;
		
		if (InternalEvents.OnBeforeOpen) InternalEvents.OnBeforeOpen();
		
		if (me.showlogs) console.log("Calling Open");
		
		try{
			exec("cat /proc/drbd", function (error, stdout, stderr) {
				if (me.showlogs) console.log("exec cat /proc/drbd");
		        	
				if (error){
					if (me.showlogs){
						console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
			        		console.log('exec error: ' + error);	
			        		console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");	
					}
		        		me.nodes.push({"error": error, type: "error"});
		        	}
		        	else if(stderr){
					if (me.showlogs){
			        		console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
			        		console.log('stderr: ' + stderr);	
			        		console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
					}
		                        me.nodes.push({"error": stderr, type: "stderr"});
		        	}
		        	else{
		        		me.nodes = _.map(me.parseData(stdout),function(element, idx, list){		
		        			return JSON.parse("{" + element + "}");
		        		});
					
					if (me.showlogs) console.log(JSON.stringify(me.nodes,null,4));
		        	}
				
				if (InternalEvents.OnAfterOpen) InternalEvents.OnAfterOpen();
		        }); 
		} catch (err) {
			me.nodes.push({"error": err, type: "exception"});
			if (InternalEvents.OnAfterOpen) InternalEvents.OnAfterOpen();
		} 
	},
	parseData: function(pdrbd) {
		var me = this;
		
		if (InternalEvents.OnBeforeParseData) InternalEvents.OnBeforeParseData(pdrbd);
		
		pdrbd = pdrbd.replace(/(\[\>\.+\]).+\n/, '');
		pdrbd = pdrbd.replace(/(\[\=+\>\.+\]).+\n/, '');
		pdrbd = pdrbd.replace(/finish.+\n/, '');
		pdrbd = pdrbd.replace(/\d+\% sector.+\n/, '');
		pdrbd = pdrbd.replace(/(\.+\n){1,2}/, '');
		pdrbd = pdrbd.replace(/(\r\n|\n|\r)/gm, ' ');
		pdrbd = pdrbd.replace(/\s+/g, ' ');
		var pdrbdsplit = pdrbd.split(/(\d+:\scs:)/), pdrbdarray = [], i = 1, pregex;
		while (i < pdrbdsplit.length) {
		pregex = pdrbdsplit[i].concat(pdrbdsplit[i + 1]);
		pregex = pregex.replace(/([rs])([a\-])([p\-])([u\-])([abdn\-])([s\-])/, 'io_suspension: $1, serial_resynchronization: $2, peer_initiated_sync: $3, locally_initiated_sync: $4, locally_blocked_io: $5, activity_log_update_suspension: $6');
		pregex = pregex.replace(/-/gm, 'null');
		pregex = pregex.replace(/(\b)/gm, '\"');
		pregex = pregex.replace(/(\"\/\")/gm, '\/');
		pregex = pregex.replace(/\"cs/, '{ \"state\": {\"cs');
		pregex = pregex.replace(/\s\"ro/, ', \"ro');
		pregex = pregex.replace(/\s\"ds/, ', \"ds');
		pregex = pregex.replace(/\"ns/, '}, \"performance\": {\"ns');
		pregex = pregex.replace(/\s\"nr/, ', \"nr');
		pregex = pregex.replace(/\s\"dw/, ', \"dw');
		pregex = pregex.replace(/\s\"dr/, ', \"dr');
		pregex = pregex.replace(/\s\"al/, ', \"al');
		pregex = pregex.replace(/\s\"bm/, ', \"bm');
		pregex = pregex.replace(/\s\"lo\"/, ', \"lo\"');
		pregex = pregex.replace(/\s\"pe\"/, ', \"pe\"');
		pregex = pregex.replace(/\s\"ua/, ', \"ua');
		pregex = pregex.replace(/\s\"ap/, ', \"ap');
		pregex = pregex.replace(/\s\"ep/, ', \"ep');
		pregex = pregex.replace(/\s\"wo/, ', \"wo');
		pregex = pregex.replace(/\s\"oos\"/, ', \"oos\"');
		pregex = pregex.replace(/\"resync\"\:/, '}, \"resync\": {');
		pregex = pregex.replace(/\s\"hits/gm, ', \"hits');
		pregex = pregex.replace(/\s\"misses\"/gm, ', \"misses\"');
		pregex = pregex.replace(/\s\"starving/gm, ', \"starving');
		pregex = pregex.replace(/\s\"locked/gm, ', \"locked');
		pregex = pregex.replace(/\s\"changed/gm, ', \"changed');
		pregex = pregex.replace(/\"act\_log\"\:/, '}, \"act_log\": {');
		pregex = pregex.replace(/^\"/, '\"drbd');
		pregex = pregex.replace(/$/, '}}');
		pregex = pregex.replace(/\"([ABC]\")/, ',\"mode\": \"$1}, \"IO\": {');
		pregex = pregex.replace(/\s/gm, '');
		pdrbdarray.push(pregex);
		i = i + 2;
		}
		
		if (InternalEvents.OnAfterParseData) InternalEvents.OnAfterParseData(pdrbdarray);
		
		return pdrbdarray;
	}
}
// Drbd #############################

module.exports = Drbd;