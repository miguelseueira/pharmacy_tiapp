var args = arguments[0] || {},
    currentView;

function didPostlayout(e) {
	/**
	 * we need height of
	 * $.refillLbl so waiting for postlayout
	 * Note: event listener should be removed
	 * to avoid redundant event calls
	 */
	$.refillLbl.removeEventListener("postlayout", didPostlayout);
	/**
	 * tool tip will be shown
	 * only for the first time
	 */
	if (!$.utilities.getProperty(Alloy.CFG.first_launch_reminders, true, "bool", false)) {
		return false;
	}
	$.utilities.setProperty(Alloy.CFG.first_launch_reminders, false, "bool", false);
	/**
	 * set first tool tip is for
	 * refill
	 */
	currentView = $.refillView;
	$.tooltip = Alloy.createWidget("ti.tooltip", "widget", $.createStyle({
		classes : ["margin-right", "width-50", "direction-up", "bg-color", "primary-border", "show"],
		arrowDict : $.createStyle({
			classes : ["bg-color", "i5", "primary-fg-color", "icon-tooltip-arrow-up"]
		}),
		arrowPadding : 6.5,
		top : getPosition(currentView)
	}));
	$.contentView = $.UI.create("View", {
		classes : ["auto-height", "vgroup"]
	});
	$.tooltipLbl = $.UI.create("Label", {
		apiName : "Label",
		classes : ["margin-top", "margin-left", "margin-right"],
		text : $.strings.remindersTooltipLblRefill
	});
	$.contentView.add($.tooltipLbl);
	$.tooltipHideBtn = $.UI.create("Button", {
		apiName : "Button",
		classes : ["margin-top-medium", "margin-bottom", "margin-left-extra-large", "margin-right-extra-large", "min-height", "primary-bg-color", "h5", "primary-light-fg-color", "primary-border"],
		title : $.strings.remindersTooltipBtnHide
	});
	$.tooltipHideBtn.addEventListener("click", didClickHide);
	$.contentView.add($.tooltipHideBtn);
	$.tooltip.setContentView($.contentView);
	$.scrollView.add($.tooltip.getView());
}

function getPosition(view) {
	var lbl = view.children[1];
	return view.rect.y + lbl.rect.y + lbl.rect.height;
}

function didClickHide(e) {
	$.tooltip.hide(didHide);
}

function didHide() {
	if (currentView != $.settingsView) {
		if (currentView == $.refillView) {
			currentView = $.medView;
			$.tooltipLbl.text = $.strings.remindersTooltipLblMed;
		} else {
			currentView = $.settingsView;
			$.tooltipLbl.text = $.strings.remindersTooltipLblSettings;
		}
		$.tooltip.applyProperties({
			top : getPosition(currentView)
		});
		$.tooltip.show();
	}
}

function didClickRefill(e) {
	$.app.navigator.open({
		titleid : "titleRemindersRefill",
		ctrl : "remindersRefill",
		stack : true
	});
}

function didClickMed(e) {
	$.app.navigator.open({
		titleid : "titleRemindersMed",
		ctrl : "remindersMed",
		stack : true
	});
}

function didClickSettings(e) {
	$.app.navigator.open({
		titleid : "titleRemindersSettings",
		ctrl : "remindersSettings",
		stack : true
	});
}
