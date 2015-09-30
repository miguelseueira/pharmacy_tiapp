var log4js = require("log4js"),
    logger = log4js.getLogger("Builder"),
    program = require("commander"),
    path = require("path"),
    fs = require("fs-extra"),
    util = require("util"),
    cp = require("child_process"),
    exec = require("sync-exec"),
    _u = require("underscore"),
    spawn = cp.spawn,
    ROOT_DIR = path.normalize(__dirname + "/..") + "/",
    DEFAULT_USERNAME = "mkumar@mscripts.com",
    DEFAULT_USER_PASSWORD = "mscripts08*",
    DEFAULT_ORGANIZATION_ID = "100000377",
    DEFAULT_CLIENT_IDENTIFIER = "1",
    DEFAULT_ENVIRONMENT = "dev",
    DEFAULT_SDK_VERSION = "4.1.0.GA",
    DEFAULT_APP_VERSION = "7.0.0",
    DEFAULT_APP_VERSION_CODE = 1,
    DEFAULT_PLATFORM = "ios",
    DEFAULT_TARGET = "dist-adhoc",
    DEFAULT_OUTPUT_DIR = ROOT_DIR + "dist",
    APP_TSS = ROOT_DIR + "app/styles/app.tss",
    APP_ASSETS_IPHONE_DIR = ROOT_DIR + "app/assets/iphone",
    APP_ASSETS_ANDROID_DIR = ROOT_DIR + "app/assets/android",
    APP_ASSETS_DATA_DIR = ROOT_DIR + "app/assets/data",
    APP_ASSETS_IMAGES_DIR = ROOT_DIR + "app/assets/images",
    APP_DEFAULT_ICON = ROOT_DIR + "DefaultIcon.png",
    APP_ITUNES_ICON = ROOT_DIR + "iTunesConnect.png",
    APP_MARKETPLACE_ICON = ROOT_DIR + "MarketplaceArtwork.png",
    APP_CONFIG_JSON = ROOT_DIR + "app/config.json",
    APP_TIAPP_XML = ROOT_DIR + "tiapp.xml",
    TOOLS_DIR = ROOT_DIR + "tools/",
    CLIENT_JSON = TOOLS_DIR + "client.json",
    BASE_CONFIG_JSON = TOOLS_DIR + "base_config.json",
    BASE_TIAPP_XML = TOOLS_DIR + "base_tiapp.xml",
    CLEINT_RESOURCE_BASE_DIR,
    CLEINT_KEYS_BASE_DIR,
    CLIENT_ENV_JSON,
    CLIENT_BASE_THEME;

/**
 * build program
 * interface
 */
program.option("-c, --client-identifier <client-identifier>", "Client identifier to build with; should match with any one defined in client.json", DEFAULT_CLIENT_IDENTIFIER);
program.option("-e, --environment <environment>", "Environment to build with; should match with any one defined in env.json", toLowerCase, DEFAULT_ENVIRONMENT);
program.option("--sdk-version <version>", "SDK version", DEFAULT_SDK_VERSION);
program.option("-u --username <USERNAME>", "Username for authentication.", DEFAULT_USERNAME);
program.option("-P --password <USER_PASSWORD>", "Password for authentication.", DEFAULT_USER_PASSWORD);
program.option("--org-id <ORGANIZATION_ID>", "Specify the organization.", DEFAULT_ORGANIZATION_ID);
program.option("-v, --version <value>", "App version", DEFAULT_APP_VERSION);
program.option("-i, --version-code <value>", "Version code (android only).", parseInt, DEFAULT_APP_VERSION_CODE);
program.option("-p, --platform <platform>", "Target build platform: Supported values are ios or android.", toLowerCase, DEFAULT_PLATFORM);
program.option("-T, --target <value>", "Target to build for: dist-playstore, dist-appstore or dist-adhoc.", toLowerCase, DEFAULT_TARGET);
program.option("-O, --output-dir <dir>", "Output directory.", DEFAULT_OUTPUT_DIR);
program.option("-f, --force", "Force a full rebuild.");
program.option("-b, --build-only", "Only brand the project; when specified, does not trigger a release.");
program.option("--clean-only", "Clean the project by removing all branding information; when specified, does not trigger a build.");
program.option("-l, --log-level <level>", "Minimum logging level. Supported options are trace, debug, info, warn, and error", "debug");
program.parse(process.argv);

/**
 * log level
 */
logger.setLevel(program.logLevel);

/**
 * client info
 */
var client = _u.findWhere(JSON.parse(fs.readFileSync(CLIENT_JSON, "utf-8")), {
	client_identifier : program.clientIdentifier
});

/**
 * exit if client is invalid
 * if cleanOnly is true then
 * allow process to clean project
 */
if (client) {

	//update client resource path
	CLEINT_RESOURCE_BASE_DIR = TOOLS_DIR + client.client_identifier + "/";
	CLEINT_KEYS_BASE_DIR = CLEINT_RESOURCE_BASE_DIR + "keys/";
	CLIENT_ENV_JSON = CLEINT_RESOURCE_BASE_DIR + "env.json";
	CLIENT_BASE_THEME = CLEINT_RESOURCE_BASE_DIR + "base_theme.js";

} else if (!program.cleanOnly) {

	logger.error("invalid client-identifier: " + program.clientIdentifier);
	process.exit(1);

}

/**
 * cleanup existing resources
 * and copy new resources
 * only when
 * 1. if the client identifier is different from old one
 * 2. or force is true
 * 3. or clean-only is true
 */
var build = program.cleanOnly || program.force || (fs.existsSync(APP_CONFIG_JSON) ? JSON.parse(fs.readFileSync(APP_CONFIG_JSON, "utf-8")).global.client_identifier !== client.client_identifier : true);
if (build) {

	/**
	 * if cleanOnly is true we won't build it
	 * just clean it
	 */
	if (!program.cleanOnly) {
		logger.info("Full rebuild has been initiated");
	}

	logger.info("Initated cleanup");

	//delete all resources
	_u.each([APP_TSS, APP_ASSETS_IPHONE_DIR, APP_ASSETS_ANDROID_DIR, APP_ASSETS_DATA_DIR, APP_ASSETS_IMAGES_DIR, APP_DEFAULT_ICON, APP_ITUNES_ICON, APP_MARKETPLACE_ICON, APP_CONFIG_JSON, APP_TIAPP_XML], function(path) {
		if (fs.existsSync(path)) {
			fs.removeSync(path);
			logger.debug("Unlinked => " + path);
		}
	});

	logger.info("Finished cleanup");

	//exit if clean only is true
	if (program.cleanOnly) {
		process.exit(0);
	} else {

		logger.info("Project is being branded for " + client.client_name);

		//copy client resources
		var CLIENT_ASSETS_IPHONE_DIR = CLEINT_RESOURCE_BASE_DIR + "assets/iphone",
		    CLIENT_ASSETS_ANDROID_DIR = CLEINT_RESOURCE_BASE_DIR + "assets/android",
		    CLIENT_ASSETS_DATA_DIR = CLEINT_RESOURCE_BASE_DIR + "assets/data",
		    CLIENT_ASSETS_IMAGES_DIR = CLEINT_RESOURCE_BASE_DIR + "assets/images",
		    CLIENT_DEFAULT_ICON = CLEINT_RESOURCE_BASE_DIR + "icons/DefaultIcon.png",
		    CLIENT_ITUNES_ICON = CLEINT_RESOURCE_BASE_DIR + "icons/iTunesConnect.png",
		    CLIENT_MARKETPLACE_ICON = CLEINT_RESOURCE_BASE_DIR + "icons/MarketplaceArtwork.png";

		//iphone
		fs.copySync(CLIENT_ASSETS_IPHONE_DIR, APP_ASSETS_IPHONE_DIR);
		logger.debug("Linked " + CLIENT_ASSETS_IPHONE_DIR + " => " + APP_ASSETS_IPHONE_DIR);

		//android
		fs.copySync(CLIENT_ASSETS_ANDROID_DIR, APP_ASSETS_ANDROID_DIR);
		logger.debug("Linked " + CLIENT_ASSETS_ANDROID_DIR + " => " + APP_ASSETS_ANDROID_DIR);

		//data
		fs.copySync(CLIENT_ASSETS_DATA_DIR, APP_ASSETS_DATA_DIR);
		logger.debug("Linked " + CLIENT_ASSETS_DATA_DIR + " => " + APP_ASSETS_DATA_DIR);

		//images
		fs.copySync(CLIENT_ASSETS_IMAGES_DIR, APP_ASSETS_IMAGES_DIR);
		logger.debug("Linked " + CLIENT_ASSETS_IMAGES_DIR + " => " + APP_ASSETS_IMAGES_DIR);

		//default icon
		fs.copySync(CLIENT_DEFAULT_ICON, APP_DEFAULT_ICON);
		logger.debug("Linked " + CLIENT_ASSETS_IPHONE_DIR + " => " + APP_ASSETS_IPHONE_DIR);

		//itunes icon
		fs.copySync(CLIENT_ITUNES_ICON, APP_ITUNES_ICON);
		logger.debug("Linked " + CLIENT_ITUNES_ICON + " => " + APP_ITUNES_ICON);

		//market place icon
		fs.copySync(CLIENT_MARKETPLACE_ICON, APP_MARKETPLACE_ICON);
		logger.debug("Linked " + CLIENT_MARKETPLACE_ICON + " => " + APP_MARKETPLACE_ICON);

		//config.json
		var configData = JSON.parse(fs.readFileSync(BASE_CONFIG_JSON, "utf-8")),
		    envData = JSON.parse(fs.readFileSync(CLIENT_ENV_JSON, "utf-8"))[program.environment];

		//extend global properties
		_u.extend(configData.global, envData.config);

		//write config
		fs.writeFileSync(APP_CONFIG_JSON, JSON.stringify(configData, null, 4));

		logger.debug("Created " + APP_CONFIG_JSON);

		//tiapp.xml
		var tiappData = fs.readFileSync(BASE_TIAPP_XML, "utf-8");
		_u.each(envData.tiapp, function(val, key) {
			tiappData = tiappData.replace(new RegExp(key, "g"), val);
		});
		tiappData = tiappData.replace(new RegExp("VERSION_CODE", "g"), program.versionCode);
		fs.writeFileSync(APP_TIAPP_XML, tiappData);

		/**
		 * update tiapp.xml further using tiapp.xml module
		 * this is used just to keep the xml file formatted properly
		 */
		var tiapp = require("tiapp.xml").load(APP_TIAPP_XML);
		tiapp.sdkVersion = program.sdkVersion;
		tiapp.version = program.version;

		//android launcher acitivty name
		var names = (tiapp.name + " Activity").split(" ");
		for (var i in names) {
			var name = names[i].toLowerCase();
			name = (name + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
				return $1.toUpperCase();
			});
			names[i] = name;
		}
		tiapp.doc.documentElement.getElementsByTagName("activity")[0].setAttribute("android:name", "." + names.join(""));

		//finished tiapp.xml updates
		tiapp.write();

		logger.debug("Created " + APP_TIAPP_XML);

		logger.info("Finished branding for " + client.client_name);

		/**
		 * initate tss maker
		 */
		logger = log4js.getLogger("TSSMaker");

		logger.info("Initated building app.tss");

		//idenify the version
		var SELECTED_THEME_VERSION = "1",
		    SELECTED_LANGUAGE_VERSION = "1",
		    SELECTED_LANG = "en";

		try {
			var resources = require("./../app/assets/data/resources"),
			    data = (resources || {}).data || [];
			SELECTED_THEME_VERSION = _u.findWhere(data, {
				type : "theme",
				selected : true
			}).version;
			SELECTED_THEME_VERSION = _u.findWhere(data, {
				type : "language",
				selected : true
			}).version;
		} catch(e) {
			logger.error(e);
			return;
		}

		var CURRENT_TIME = new Date().getTime(),
		    TEMP_THEME_NAME = "theme_" + CURRENT_TIME,
		    TEMP_LANGUAGE_NAME = "language_" + CURRENT_TIME,
		    APP_THEME_JS = ROOT_DIR + "app/assets/data/theme_" + SELECTED_THEME_VERSION + ".js",
		    LANGUAGE_JS = ROOT_DIR + "app/assets/data/language_" + SELECTED_LANG + "_" + SELECTED_THEME_VERSION + ".js",
		    TEMP_THEME_JS = ROOT_DIR + "tools/" + TEMP_THEME_NAME + ".js",
		    TEMP_LANGUAGE_JS = ROOT_DIR + "tools/" + TEMP_LANGUAGE_NAME + ".js";

		logger.debug("Building app.tss based on => " + APP_THEME_JS);
		logger.debug("Using language file => " + LANGUAGE_JS);

		//temp theme js
		fs.copySync(APP_THEME_JS, TEMP_THEME_JS);
		logger.debug("Linked " + APP_THEME_JS + " => " + TEMP_THEME_JS);

		//temp language js
		fs.copySync(LANGUAGE_JS, TEMP_LANGUAGE_JS);
		logger.debug("Linked " + LANGUAGE_JS + " => " + TEMP_LANGUAGE_JS);

		var themeData = require("./" + TEMP_THEME_NAME).data,
		    languageData = require("./" + TEMP_LANGUAGE_NAME).data,
		    atss = require(CLIENT_BASE_THEME),
		    tss = {};

		//add classes for icons
		processIcons(atss, themeData.config.icons, languageData);
		processIcons(atss, themeData.config.iconNotations, languageData);

		//process the acutal classes in themes
		tss = themeData.tss;
		for (var ts in tss) {

			if (!atss[ts]) {
				atss[ts] = {
				};
			}

			/**
			 * remove any '#' or '.' character in first place and repalce '-' with '_'
			 * and transform classifiers
			 * Example
			 * input: ".some-classname[platform=ios formFactor=handheld]"
			 * output: "some_classname_platform_ios_formFacoor_handheld"
			 * Note: Will support only one platform and one formFactor query, multiple combination should not be used
			 */
			var identifier = "Alloy.TSS." + ts.replace(/^#/g, "").replace(/^\./, "").replace(/-+/g, "_").replace(/\[.*$/g, ""),
			    matches = ts.match(/\[.*$/g);
			if (matches && matches.length) {
				var classifiers = (matches[0] || "").replace(/\[|\]/g, "").split(" ");
				for (var i in classifiers) {
					identifier += "_" + classifiers[i].split("=").join("_");
				}
			}

			var dict = tss[ts];
			for (var key in dict) {
				atss[ts][key] = identifier + "." + key;
			}

		}

		//convert to string and trim double quotes
		var appStr = JSON.stringify(atss);
		appStr = trimDoubleQuotes(appStr, /"Alloy\.+/g);
		appStr = trimDoubleQuotes(appStr, /"Ti\.+/g);
		appStr = trimDoubleQuotes(appStr, /"Titanium\.+/g);
		appStr = appStr.substring(1, appStr.length - 1);

		logger.debug("processed data for app.tss: " + appStr);

		//write app.tss
		fs.writeFileSync(APP_TSS, appStr);

		logger.info("Created " + APP_TSS);

		//delete all temporary theme and language files
		var TOOLS_DIR = ROOT_DIR + "tools",
		    files = fs.readdirSync(TOOLS_DIR);
		_u.each(files, function(file) {
			if (file.indexOf("theme_") != -1 || file.indexOf("language_") != -1) {
				file = TOOLS_DIR + "/" + file;
				fs.removeSync(file);
				logger.debug("Unlinked => " + file);
			}
		});

		logger.info("Finsied building app.tss");
	}

} else {

	logger.info("No changce found, set up already done for " + client.client_name);
}

/**
 * exit if buildOnly is true
 */
if (program.buildOnly) {
	logger.info("Release ignored");
	process.exit(0);
} else {

	/**
	 * initate a release
	 */
	logger = log4js.getLogger("TiRelease");

	/**
	 * update build date
	 * so even if there is no
	 * change in branding
	 * the release time gets
	 * updated
	 */
	var appConfigData = JSON.parse(fs.readFileSync(APP_CONFIG_JSON, "utf-8"));
	appConfigData.global.buildDate = new Date().toString();

	//write config
	fs.writeFileSync(APP_CONFIG_JSON, JSON.stringify(appConfigData, null, 4));

	logger.info("Release iniated for " + program.platform + " at " + appConfigData.global.buildDate);

	//appc clean
	exec("appc ti clean --project-dir  " + ROOT_DIR);

	//prepare build params
	var appcParams = ["run"];

	//platform
	appcParams.push("--platform");
	appcParams.push(program.platform);

	//deploy-type
	appcParams.push("--deploy-type");
	appcParams.push("production");

	/**
	 * read client config
	 * for build keys
	 */
	var buildKeys = JSON.parse(fs.readFileSync(CLIENT_ENV_JSON, "utf-8"))[program.environment].keys;

	if (program.platform === "ios") {

		/**
		 * build params for ios
		 */

		//target
		/**
		 * for ios there are
		 * multiple targets
		 */
		appcParams.push("--target");
		appcParams.push(program.target);

		//distribution certificate
		logger.debug("Searching for distribution certificate " + buildKeys.certificate_name);
		if (program.force || exec("security find-certificate -c \"" + buildKeys.certificate_name + "\"").stderr) {
			if (program.force) {
				logger.info("Updating distribution certificate " + buildKeys.certificate_name);
			} else {
				logger.warn("Distribution certificate " + buildKeys.certificate_name + " not found!");
			}
			if (exec("security import " + CLEINT_KEYS_BASE_DIR + buildKeys.certificate + " -A -k " + process.env.HOME + "/Library/Keychains/login.keychain -P " + buildKeys.certificate_password).stderr) {
				logger.error("Unable to import distribution certificate " + buildKeys.certificate_name);
				process.exit(1);
			}
			logger.info("Imported distribution certificate " + buildKeys.certificate_name);
		}
		appcParams.push("--distribution-name");
		appcParams.push(buildKeys.certificate_name);

		//provisioning profile
		var XCODE_PROVISON_PROFILE = process.env.HOME + "/Library/MobileDevice/Provisioning Profiles/" + buildKeys.provisioning_profile + ".mobileprovision";
		logger.debug("Searching for provisioning profile " + buildKeys.provisioning_profile);
		if (program.force || !fs.existsSync(XCODE_PROVISON_PROFILE)) {
			if (program.force) {
				logger.info("Updating provisioning profile " + buildKeys.provisioning_profile);
			} else {
				logger.warn("Provisioning profile " + buildKeys.provisioning_profile + " not found!");
			}
			fs.copySync(CLEINT_KEYS_BASE_DIR + buildKeys.provisioning_profile + ".mobileprovision", XCODE_PROVISON_PROFILE);
			logger.info("Imported Provisioning profile " + buildKeys.provisioning_profile);
		}
		appcParams.push("--pp-uuid");
		appcParams.push(buildKeys.provisioning_profile);

	} else if (program.platform === "android") {

		/**
		 * build params for android
		 */

		//target
		/**
		 * for andorid there is only
		 * one target
		 */
		appcParams.push("--target");
		appcParams.push("dist-playstore");

		//keystore
		appcParams.push("--keystore");
		appcParams.push(CLEINT_KEYS_BASE_DIR + buildKeys.keystore);

		//keystore password
		appcParams.push("--store-password");
		appcParams.push(buildKeys.keystore_password);

	} else {
		/**
		 * exit if paltform is invalid
		 */
		logger.error("Invalid platform: " + program.platform);
		process.exit(1);
	}

	//project dir
	appcParams.push("--project-dir");
	appcParams.push(ROOT_DIR);

	//output dir
	appcParams.push("--output-dir");
	appcParams.push(program.outputDir);

	//sdk version
	appcParams.push("--sdk");
	appcParams.push(program.sdkVersion);

	//auth info
	appcParams.push("--username");
	appcParams.push(program.username);
	appcParams.push("--password");
	appcParams.push(program.password);
	appcParams.push("--org-id");
	appcParams.push(program.orgId);

	//run app using spwan
	var appc = spawn("appc", appcParams);

	appc.stdout.on("data", function(data) {
		console.log(data.toString());
	});

	appc.stderr.on("data", function(data) {
		console.log(data.toString());
	});

	appc.on("exit", function(code) {
		if (code != 0) {
			logger.error("appc exited with " + code);
		}
		process.exit(code);
	});
}

/********************************
 * Helper functions for Builder
 ********************************/

function toLowerCase(val) {
	return val.toString().toLowerCase();
}

/********************************
 * Helper functions for TSSMaker
 ********************************/

/**
 *  create classes for each icon from it's name
 *  append all available accessibility labels with icon class
 *  the name convention should followed as below
 * 	examples
 * 	  icon name - thick_doctor
 *    	class name will be - .icon-thick-doctor
 *    	accessibility key in language string should be - iconAccessibilityLblThickDoctor or iconAccessibilityLblDoctor (considered only if iconAccessibilityLblThickDoctor is not found)
 * 	  icon name - thin_unfilled_success
 *    	class name will be - .icon-thin-unfilled-success
 *    	accessibility key in language string should be - iconAccessibilityLblThinUnfilledSuccess or iconAccessibilityLblUnfilledSuccess or iconAccessibilityLblSuccess
 */
function processIcons(desObj, icons, strings) {
	for (var icn in icons) {
		var icnVal = "Alloy.CFG.icons." + icn,
		    className = ".icon-" + icn.replace(/_+/g, "-");
		desObj[className] = {
			title : icnVal,
			text : icnVal
		};
		var name = icn.replace(/_+/g, " ").replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
			return $1.toUpperCase();
		}),
		    prefix = "Alloy.Globals.strings.",
		    accessiblityKey = "iconAccessibilityLbl" + name;
		if (strings[accessiblityKey]) {
			desObj[className].accessibilityLabel = prefix + accessiblityKey;
		} else {
			accessiblityKey = accessiblityKey.replace(/Thin+/g, "").replace(/Thick+/g, "");
			if (strings[accessiblityKey]) {
				desObj[className].accessibilityLabel = prefix + accessiblityKey;
			} else {
				accessiblityKey = accessiblityKey.replace(/Unfilled+/g, "").replace(/Filled+/g, "");
				if (strings[accessiblityKey]) {
					desObj[className].accessibilityLabel = prefix + accessiblityKey;
				}
			}
		}
	}
}

function trimDoubleQuotes(str, regExp) {
	do {
		m = regExp.exec(str);
		if (m) {
			var index = m.index;
			str = str.slice(0, index) + str.slice(index + 1);
			while (str[index] != '"') {
				index++;
			}
			str = str.slice(0, index) + str.slice(index + 1);
		}
	} while (m);
	return str;
}