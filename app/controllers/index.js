var http = require("httpwrapper");

function didOpen(e) {
	http.request({
		method : "appload",
		data : {
			request : {
				appload : {
					phonemodel : Ti.Platform.model,
					phoneos : Ti.Platform.osname,
					deviceid : Ti.Platform.id,
					networkcarrier : OS_IOS ? require("bencoding.network").createCarrier().findInfo().carrierName : OS_ANDROID ? "" : "",
					phoneplatform : "IP",
					appversion : Ti.App.version,
					clientname : Alloy.CFG.clientname,
					featurecode : "TH610"
				}
			}
		},
		success : didAppLoad,
		done : didFinish
	});
}

function didFinish() {
	$.index.remove($.loading.getView());
}

function didAppLoad(result) {
	Alloy.Models.user.set({
		appLoad: result.appload
	},{
		silent: true
	}); 
	if (Ti.App.Properties.getBool("firstLoad", true)) {
		Alloy.createController("stack/master", {
			ctrl : "carousel",
			titleImage : "/images/login/pharmacy.png"
		});
	} else {
		Alloy.createController(Alloy.CFG.navigator + "/master");
	}
}

$.index.open();
