var Alloy = require("alloy"),
    utilities = require("utilities"),
    resources = require("resources"),
    localization = require("localization");

var Config = {

	init : function(_config, _callback) {

		/**
		 * initialization
		 */
		//for debugging purpose only, should be false on test / production
		if (Alloy.CFG.overrideRemoteResources === true) {
			return 0;
		}

		var items = {
			"theme" : {
				"key" : "themes",
				"extend" : {
					"selected" : true
				}
			},
			"template" : {
				"key" : "templates",
				"extend" : {
					"selected" : true
				}
			},
			"menu" : {
				"key" : "menus",
				"extend" : {
					"selected" : true
				}
			},
			"language" : {
				"key" : "languages",
				"extend" : {
					"selected" : true
				}
			},
			"fonts" : {
				"key" : "fonts"
			},
			"images" : {
				"key" : "images"
			}
		};
		for (var i in items) {
			var item = items[i];
			if (_.has(_config, i)) {
				var obj = _config[i];
				if (_.has(item, "extend")) {
					_.extend(obj, item.extend);
				}
				resources.set(item.key, _.isArray(obj) ? obj : [obj]);
			}
		}

		/***
		 * no. of items to be updated
		 */
		return resources.checkForUpdates();
	},

	load : function(_callback) {

		/**
		 * load into memory
		 */
		var theme = resources.get("themes", {selected : true})[0],
		    template = resources.get("templates", {selected : true})[0],
		    menu = resources.get("menus", {selected : true})[0],
		    fonts = resources.get("fonts", {
			file : {
				$exists : true
			}
		}),
		    images = resources.get("images", {
			file : {
				$exists : true
			}
		});

		//menu
		Alloy.Collections.menuItems.reset(utilities.clone(menu.items));

		//template
		Alloy.Models.template.set(utilities.clone(template));

		//language
		localization.init();

		//fonts
		Alloy.Fonts = {};
		if (!_.has(Alloy, "RegFonts")) {
			Alloy.RegFonts = [];
		}
		/**
		 * Ti.App.registerFont - is a method available only with custom SDK build 3.4.1.mscripts and later
		 * Ti.App.unregisterFont - is a method available only with custom SDK build 3.5.0.mscripts and later
		 */
		var lastUpdate = require("alloy/moment")().unix();
		for (var i in fonts) {
			var font = fonts[i];
			if (OS_IOS || OS_ANDROID) {
				var fontExists = _.findWhere(Alloy.RegFonts, {
					id : font.id
				});
				if (_.isUndefined(fontExists)) {
					Ti.App.registerFont(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, resources.directoryFonts + "/" + font.file), font.id);
					Alloy.RegFonts.push(_.extend(utilities.clone(font), {
						lastUpdate : lastUpdate
					}));
				} else {
					if (fontExists.file != font.file) {
						if (OS_IOS) {
							//ios will not allow to update a font, has to be unregistered and registered back
							Ti.App.unregisterFont(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, resources.directoryFonts + "/" + fontExists.file), fontExists.id);
						}
						//on android, registered font can be just replaced with new value
						Ti.App.registerFont(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, resources.directoryFonts + "/" + font.file), font.id);
					}
					_.extend(fontExists, {
						lastUpdate : lastUpdate
					});
				}
			}
			Alloy.Fonts[font.code] = font.id;
		}
		//remove unwanted fonts from memory
		Alloy.RegFonts = _.reject(Alloy.RegFonts, function(font) {
			var flag = lastUpdate !== font.lastUpdate;
			if (flag && (OS_IOS || OS_ANDROID)) {
				Ti.App.unregisterFont(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, resources.directoryFonts + "/" + font.file), font.id);
			}
			return flag;
		});

		//images
		Alloy.Images = {};
		for (var i in images) {
			var code = images[i].code,
			    orientations = images[i].orientation;
			if (!_.has(Alloy.Images, code)) {
				Alloy.Images[code] = {};
			}
			var baseDirectory = OS_MOBILEWEB ? Ti.Filesystem.resourcesDirectory : Ti.Filesystem.applicationDataDirectory;
			for (var orientation in orientations) {
				Alloy.Images[code][orientation] = {
					path : Ti.Filesystem.getFile(baseDirectory, resources.directoryImages + "/" + images[i].file).nativePath
				};
				_.extend(Alloy.Images[code][orientation], _.isObject(images[i].properties) && _.isObject(images[i].properties[orientation]) ? images[i].properties[orientation] : orientations[orientation]);
			}
		}

		//theme
		_.extend(Alloy.CFG, theme.styles.config);
		Alloy.TSS = {
			Theme : {
				id : theme.id,
				version : theme.version
			}
		};
		var tss = utilities.clone(theme.styles.tss);
		for (var ts in tss) {
			if (_.has(tss[ts], "font")) {
				tss[ts].font.fontFamily = Alloy.Fonts[tss[ts].font.fontFamily];
			}
			if (_.has(tss[ts], "iconFont")) {
				tss[ts].iconFont.fontFamily = Alloy.Fonts[tss[ts].iconFont.fontFamily];
			}
			if (_.has(tss[ts], "boldFontFamily")) {
				tss[ts].boldFontFamily = Alloy.Fonts[tss[ts].boldFontFamily];
			}
			Alloy.TSS[ts] = tss[ts];
		}

		/**
		 * delete unused resources
		 */
		if (Alloy.CFG.deleteUnusedResoruces) {
			resources.deleteUnusedResoruces();
		}

		if (_callback) {
			_callback();
		}
	},

	updateImageProperties : function(_item) {
		_.extend(Alloy.Images[_item.code][_item.orientation], resources.updateImageProperties(_item));
	},

	updateResources : function(_callback) {
		resources.update(_callback);
	},

	/**
	 * https://appcelerator.force.com/portal/500F000000VToZE
	 * https://jira.appcelerator.org/browse/ALOY-755
	 * @param {String} name
	 */
	updateTSS : function(name) {
		var dicts = require("alloy/styles/" + name),
		    theme = dicts[0];
		if (theme.style.id != Alloy.TSS.Theme.id || theme.style.version != Alloy.TSS.Theme.version) {
			for (var i in dicts) {
				var dict = dicts[i],
				    key = dict.key.replace(/-/g, "_").replace("Ti.UI.", "");
				if (_.has(Alloy.TSS, key)) {
					var style = dict.style;
					for (var prop in style) {
						if (_.has(Alloy.TSS[key], prop)) {
							style[prop] = Alloy.TSS[key][prop];
						}
					}
				}
			}
		}
	}
};

module.exports = Config;
