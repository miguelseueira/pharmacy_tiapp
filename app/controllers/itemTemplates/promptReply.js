var args = arguments[0] || {};

(function() {
	if (args.filterText) {
		$.row[Alloy.Globals.filterAttribute] = args.filterText;
	}
	var pDict = $.createStyle({
		classes : args.promptClasses || ["left", "width-40", "inactive-fg-color"],
		text : args.prompt || (args.data ? args.data[args.promptProperty] : "")
	}),
	    rDict = $.createStyle({
		classes : args.replyClasses || ["margin-left-medium", "width-60"],
		text : args.reply || (args.data ? args.data[args.replyProperty] : "")
	});
	$.row.className = "promptReply" + parseInt(pDict.width) + parseInt(rDict.height) + (args.hasChild && "WithChild" || "");
	$.promptLbl.applyProperties(pDict);
	$.replyLbl.applyProperties(rDict);
})();

function getParams() {
	return args;
}

exports.getParams = getParams;
