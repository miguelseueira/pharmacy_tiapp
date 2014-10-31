var args = arguments[0] || {},
    app = require("core"),
    dialog = require("dialog"),
    http = require("httpwrapper"),
    keychainAccount,
    stringCrypto;

if (OS_IOS || OS_ANDROID) {
	stringCrypto = require("bencoding.securely").createStringCrypto();
	keychainAccount = require("com.obscure.keychain").createKeychainItem("account");
	if (keychainAccount.account) {
		$.unameTxt.setValue(keychainAccount.account);
		$.passwordTxt.setValue(stringCrypto.AESDecrypt(Alloy.CFG.secret, keychainAccount.valueData));
		$.keepMeSwt.setValue(true);
	}
}

function didRightclickPwd(e) {
	app.navigator.open({
		ctrl : "loginRecovery",
		titleid : "titleLoginRecovery",
		stack : true
	});
}

function moveToNext(e) {
	var nextItem = e.nextItem || "";
	$[nextItem] && $[nextItem].focus();
}

function didClickLogin(e) {

	var uname = $.unameTxt.getValue();
	var password = $.passwordTxt.getValue();

	if (uname != "" && password != "") {

		if (OS_IOS || OS_ANDROID) {
			if ($.keepMeSwt.getValue() == true) {
				keychainAccount.account = uname;
				keychainAccount.valueData = stringCrypto.AESEncrypt(Alloy.CFG.secret, password);
			} else {
				keychainAccount.reset();
			}
		}

		http.request({
			method : "authenticate",
			data : {
				request : {
					authenticate : {
						username : uname,
						password : password,
						clientname : Alloy.CFG.clientname,
						emailpin : Alloy.CFG.emailpin,
						featurecode : "TH053",
						language : ""
					}
				}
			},
			success : didAuthenticate
		});

	} else {
		dialog.show({
			message : Alloy.Globals.Strings.valLoginRequiredFileds
		});
	}
}

function didAuthenticate(result) {
	Alloy.Models.user.set({
		loggedIn : true,
		sessionId : result.authenticate.sessionid
	});
	Alloy.Collections.menuItems.add({
		titleid : "strSignout",
		action : "signout"
	});
	if (app.navigator.name === Alloy.CFG.navigator) {
		if (_.has(args, "navigateTo")) {
			app.navigator.open(args.navigateTo);
		} else {
			app.navigator.close();
		}
	} else {
		Alloy.createController(Alloy.CFG.navigator + "/master");
	}
}

function handleScroll(e) {
	$.scrollView.canCancelEvents = e.value;
}

function didClickSignup(e) {
	app.navigator.open({
		ctrl : "termsAndConditions",
		titleid : "titleTermsAndConditions",
		stack : true
	});
}
