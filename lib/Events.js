// Events #############################
function Events(){}

Events.prototype = {
	OnBeforeOpen: null,
	OnAfterOpen: null,
	OnBeforeParseData: null,
	OnAfterParseData: null
}
// Events #############################

module.exports = Events;