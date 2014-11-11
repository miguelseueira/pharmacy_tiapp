var args = arguments[0] || {},
    app = require("core"),
    controller;

(function() {

	if (args.titleImage) {
		$.titleImg = $.UI.create("ImageView", {
			apiName : "ImageView",
			id : "nav-bar-title-img"
		});
		$.titleImg.image = args.titleImage;
		$.navBarView.add($.titleImg);
	} else {
		$.titleLbl.text = args.title || Alloy.Globals.Strings[args.titleid || ""];
	}

	if (args.navBarHidden === true) {
		hideNavBar(false);
	}

	if (args.stack) {
		$.addClass($.leftImg, "back");
		$.template.applyProperties({
			opacity : 0,
			left : app.device.width
		});
	}

	controller = Alloy.createController(args.ctrl, args.ctrlArguments || {});
	var children = controller.getTopLevelViews();
	for (var i in children) {
		var view = children[i].__controllerPath ? children[i].getView() : children[i];
		if (children[i].role === "navBar") {
			$.navBarView.add(view);
		} else if (children[i].role == "overlay") {
			$.template.add(view);
		} else {
			view && $.contentView.add(view);
		}
	}

})();

function didTap(e) {
	if (args.stack) {
		app.navigator.close();
	}
}

function showNavBar(_animated, _callback) {
	if ($.navBar.top != 0) {
		if (_animated !== false) {
			var contentAnimation = Ti.UI.createAnimation({
				top : Alloy.CFG.navBarHeight,
				duration : Alloy.CFG.ANIMATION_DURATION
			});
			$.contentView.animate(contentAnimation);
			var navBarAnimation = Ti.UI.createAnimation({
				top : 0,
				duration : Alloy.CFG.ANIMATION_DURATION,
				delay : 100
			});
			navBarAnimation.addEventListener("complete", function onComplete() {
				navBarAnimation.removeEventListener("complete", onComplete);
				$.contentView.top = Alloy.CFG.navBarHeight;
				$.navBar.top = 0;
				if (_callback) {
					_callback();
				}
			});
			$.navBar.animate(navBarAnimation);
		} else {
			$.contentView.top = Alloy.CFG.navBarHeight;
			$.navBar.top = 0;
			if (_callback) {
				_callback();
			}
		}
	} else {
		if (_callback) {
			_callback();
		}
	}
}

function hideNavBar(_animated, _callback) {
	if ($.navBar.top == 0) {
		if (_animated !== false) {
			var navBarAnimation = Ti.UI.createAnimation({
				top : -Alloy.CFG.navBarHeight,
				duration : Alloy.CFG.ANIMATION_DURATION
			});
			$.navBar.animate(navBarAnimation);
			var contentAnimation = Ti.UI.createAnimation({
				top : 0,
				duration : Alloy.CFG.ANIMATION_DURATION,
				delay : 100
			});
			contentAnimation.addEventListener("complete", function onComplete() {
				contentAnimation.removeEventListener("complete", onComplete);
				$.navBar.top = -Alloy.CFG.navBarHeight;
				$.contentView.top = 0;
				if (_callback) {
					_callback();
				}
			});
			$.contentView.animate(contentAnimation);
		} else {
			$.navBar.top = -Alloy.CFG.navBarHeight;
			$.contentView.top = 0;
			if (_callback) {
				_callback();
			}
		}
	} else {
		if (_callback) {
			_callback();
		}
	}
}

exports.child = controller;
exports.showNavBar = showNavBar;
exports.hideNavBar = hideNavBar;
