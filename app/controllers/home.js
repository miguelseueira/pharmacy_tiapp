var args = arguments[0] || {},
    app = require("core");

function init() {
	var icons = Alloy.Globals.homeItems;
	for (var i in icons) {
		var view = getView();
		var sections = icons[i];
		var width = Math.floor(Ti.Platform.displayCaps.platformWidth / sections.length);
		for (var j in sections) {
			var image = "/images/home/".concat(sections[j].image);
			var imageView = OS_MOBILEWEB ? getMImage(image, width) : getNImage(sections[j].image, image, width);
			imageView.navigation = sections[j].navigation || {};
			imageView.addEventListener("click", didItemClick);
			view.add(imageView);
		}
		$.scrollView.add(view);
	}
	Alloy.Models.user.on("change", didChangeUser);
	Alloy.Models.user.trigger("change");
}

function didChangeUser() {
	$.signinBtn.visible = !Alloy.Models.user.get("loggedIn");
}

function getView() {
	return Ti.UI.createView({
		top : 0,
		width : "100%",
		height : Ti.UI.SIZE,
		layout : "horizontal"
	});
}

function getNImage(name, image, width) {
	var height = Ti.App.Properties.getInt(String(name).concat(width), 0),
	    blob;
	if (!height) {
		blob = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, image).read();
		height = Math.floor((blob.height / blob.width) * width);
		blob = null;
		Ti.App.Properties.setInt(String(name).concat(width), height);
	}
	if (OS_ANDROID) {
		width /= app.device.logicalDensityFactor;
		height /= app.device.logicalDensityFactor;
	}
	return Ti.UI.createView({
		left : 0,
		width : width,
		height : height,
		backgroundImage : image
	});
}

function getMImage(image, width) {
	return Ti.UI.createImageView({
		left : 0,
		width : width,
		height : "auto",
		image : image
	});
}

function didItemClick(e) {
	var navigation = e.source.navigation;
	if (!_.isEmpty(navigation)) {
		if (navigation.requiresLogin == true && Alloy.Models.user.get("loggedIn") == false) {
			app.navigator.open({
				ctrl : "login",
				titleid : "strLogin",
				ctrlArguments : {
					navigateTo : navigation
				}
			});
		} else {
			app.navigator.open(navigation);
		}
	}
}

function didClickSignin(e) {
	app.navigator.open({
		ctrl : "login",
		titleid : "strLogin",
	});
}

function terminate() {
	Alloy.Models.user.off("change", didChangeUser);
}

exports.init = init;
exports.terminate = terminate;
