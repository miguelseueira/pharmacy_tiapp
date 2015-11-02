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

	$.actionBar = $.window.getActivity().actionBar;

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

	$.ctrlPath = controller.__controllerPath;

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

	logger.debug(TAG, "init", ctrlShortCode[$.ctrlPath]);

	controller.init && controller.init();

	controller.setParentView && controller.setParentView($.contentView);
}

function focus(e) {
	logger.debug(TAG, "focus", ctrlShortCode[$.ctrlPath]);
	controller.focus && controller.focus();
}

function blur(e) {
	logger.debug(TAG, "blur", ctrlShortCode[$.ctrlPath]);
	controller.blur && controller.blur();
}

function terminate(e) {
	logger.debug(TAG, "terminate", ctrlShortCode[$.ctrlPath]);
	controller.terminate && controller.terminate();
}

function backButtonHandler(e) {
	logger.debug(TAG, "backButtonHandler", ctrlShortCode[$.ctrlPath]);
	return controller.backButtonHandler && controller.backButtonHandler();
}

function setTitle(title) {
	$.window.title = title;
	$.actionBar.setTitleAttributes(_.extend({
		title : title
	}, Alloy.TSS.Window.titleAttributes));
}

function showNavBar() {
	$.actionBar.show();
	app.navigator.rootNavBarHidden = false;
}

function hideNavBar() {
	$.actionBar.hide();
	app.navigator.rootNavBarHidden = true;
}

function setRightNavButton(view) {
	var activity = $.window.getActivity();
	activity.onCreateOptionsMenu = function(e) {
		var menu = e.menu;
		menu.clear();
		if (view) {
			view.addEventListener("click", handleEvent);
			$.menuItem = menu.add({
				actionView : view,
				visible : false,
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
			});
			setTimeout(function() {
				$.menuItem.setVisible(true);
			}, 150);
		}
	};
	activity.invalidateOptionsMenu();
}

function handleEvent(e) {
	analytics.handleEvent(e);
}

_.extend($, {
	init : init,
	blur : blur,
	focus : focus,
	terminate : terminate,
	backButtonHandler : backButtonHandler
});
