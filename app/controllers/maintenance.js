var args = arguments[0] || {},
    uihelper = require("uihelper");

function didOpen(e) {
	$.trigger("init");
}

function didClickSubmit(e) {
	var ctrl = Alloy.createController("appload");
	ctrl.on("init", didInitWin);
	ctrl.init();
}

function didInitWin(e) {
	if (OS_ANDROID) {
		$.window.setExitOnClose(false);
	}
	$.window.close();
}

function didAndroidback(e) {
	$.window.close();
}

function init() {
	uihelper.getImage("logo", $.logoImg);
	$.lbl.text = Alloy.Models.appconfig.get("inlinemessage");
	$.window.open();
}

exports.init = init;