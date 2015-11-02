var args = arguments[0] || {},
    TAG = "DRVC",
    app = require("core"),
    analytics = require("analytics"),
    ctrlShortCode = require("ctrlShortCode"),
    logger = require("logger"),
    controller;

function init() {

	var strings = Alloy.Globals.strings;

	$.window = app.navigator.rootWindow;

	setTitle(args.title || strings[args.titleid || ""] || "");

	if (args.navBarHidden) {
		hideNavBar();
	} else if (app.navigator.rootNavBarHidden) {
		showNavBar();
	}

	/**
	 *  let the new controller know where it is coming from
	 *  through the origin parameter
	 */
	var hasRightNavButton = false,
	    ctrlArguments = args.ctrlArguments || {};
	ctrlArguments.origin = app.navigator.currentController.ctrlPath;
	controller = Alloy.createController(args.ctrl, ctrlArguments);

	_.extend($, {
		ctrlPath : args.ctrl,
		shortCode : ctrlShortCode[args.ctrl]
	});

	_.each(controller.getTopLevelViews(), function(child) {
		if (child.__iamalloy) {
			child = child.getView();
		}
		if (!child) {
			return;
		}
		switch(child.role) {
		case "ignore":
			//just ignore
			break;
		case "rightNavButton":
			hasRightNavButton = true;
			setRightNavButton(child);
			break;
		case "contentView":
			$.contentView = child;
			break;
		default:
			if (!$.contentView) {
				$.contentView = $.UI.create("View", {
					id : "contentView"
				});
			}
			$.contentView.add(child);
		}
	});

	$.contentView.addEventListener("click", handleEvent);
	$.contentView.addEventListener("change", handleEvent);

	$.addTopLevelView($.contentView);

	if (!hasRightNavButton) {
		setRightNavButton();
	}

	_.extend(controller, {
		app : app,
		strings : strings,
		logger : logger,
		http : require("requestwrapper"),
		httpClient : require("http"),
		utilities : require("utilities"),
		uihelper : require("uihelper"),
		analytics : analytics,
		crashreporter : require("crashreporter"),
		window : $.window,
		setTitle : setTitle,
		showNavBar : showNavBar,
		hideNavBar : hideNavBar,
		setRightNavButton : setRightNavButton
	});

	logger.debug(TAG, "init", $.shortCode);

	controller.init && controller.init();

	controller.setParentView && controller.setParentView($.contentView);
}

function focus(e) {
	logger.debug(TAG, "focus", $.shortCode);
	controller.focus && controller.focus();
}

function blur(e) {
	logger.debug(TAG, "blur", $.shortCode);
	controller.blur && controller.blur();
}

function terminate(e) {
	logger.debug(TAG, "terminate", $.shortCode);
	controller.terminate && controller.terminate();
}

function setTitle(title) {
	$.window.title = title;
}

function showNavBar(animated) {
	$.window.showNavBar({
		animated : _.isUndefined(animated) ? true : false
	});
	app.navigator.rootNavBarHidden = false;
}

function hideNavBar(animated) {
	$.window.hideNavBar({
		animated : _.isUndefined(animated) ? true : false
	});
	app.navigator.rootNavBarHidden = true;
}

function setRightNavButton(view) {
	if (view) {
		view.addEventListener("click", handleEvent);
	} else {
		view = Ti.UI.createView();
	}
	$.window.setRightNavButton(view);
}

function handleEvent(e) {
	var view = e.source,
	    type = e.type;
	switch(view.apiName) {
	case "Ti.UI.Button":
		console.log(view.id);
		break;
	case "Ti.UI.View":
		break;
	case "Ti.UI.TableViewRow":
		break;
	case "Ti.UI.Switch":
		console.log(view.value);
		break;
	}
}

_.extend($, {
	init : init,
	blur : blur,
	focus : focus,
	terminate : terminate
});
