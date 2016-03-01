var args = $.args,
    uihelper = require("uihelper");

(function() {
	if (args.filterText) {
		$.row[Alloy.Globals.filterAttribute] = args.filterText;
	}
	var title = args.title || (args.data ? args.data[args.titleProperty] : ""),
	    right = $.colorBoxView.right + $.colorBoxView.width + $.createStyle({
		classes : ["margin-right-medium"]
	}).right;
	if (args.lblClasses) {
		$.resetClass($.lbl, args.lblClasses, {
			right : right,
			text : title
		});
	} else {
		$.lbl.applyProperties({
			right : right,
			text : title
		});
	}
	uihelper.wrapText($.lbl);
	var color = args.color || "transparent";
	$.colorBoxView.applyProperties({
		backgroundColor : color,
		borderColor : color
	});
})();

function getParams() {
	return args;
}

exports.getParams = getParams;
