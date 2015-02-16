module.exports = {
	"APPLOAD_GET" : {
		"status" : "Success",
		"code" : "200",
		"message" : "x",
		"description" : "x",
		"data" : {
			"appload" : {
				"id" : "12345",
				"client_id" : "1",
				"default_token" : "jVnk0KPE1",
				"features" : {
					"is_feedback_enabled" : "1",
					"is_email_supported_enabled" : "1",
					"is_sms_supported_enabled" : "1",
					"is_reminders_enabled" : "1",
					"is_maps_enabled" : "1",
					"is_storelocator_enabled" : "1",
					"is_wishabi_enabled" : "1",
					"is_proxy_enabled" : "1",
					"is_stores_signup_enabled" : "1",
					"is_transferrx_enabled" : "1",
					"is_adherence_enabled" : "1",
					"is_pdx_webapi_enabled" : "1",
					"is_doctors_enabled" : "1",
					"is_refill_reminders_enabled" : "1",
					"is_quick_refill_enabled" : "1",
					"is_refill_by_scan_enabled" : "1",
					"is_text_msg_enabled" : "1",
					"is_primary_pharmacy_enabled" : "1",
					"is_coupons_enabled" : "1",
					"is_facebook_share_enabled" : "1"
				},
				"client_json" : {
					"force_update" : false,
					"force_reload_after_update" : false,
					"async_update" : true,
					"theme" : {
						"id" : "mscripts",
						"version" : 1,
						"url" : "https://staging.remscripts.com/nativemia/theme_mscripts.json"
					},
					"template" : {
						"id" : "list",
						"version" : 1,
						"url" : "https://staging.remscripts.com/nativemia/template_list.json"
					},
					"menu" : {
						"id" : "mscripts",
						"version" : 1,
						"url" : "https://staging.remscripts.com/nativemia/menu_mscripts.json"
					},
					"language" : {
						"id" : "en",
						"version" : 1,
						"url" : "https://staging.remscripts.com/nativemia/en.json"
					},
					"images" : [{
						"version" : 1,
						"id" : "logo_pl",
						"code" : "logo",
						"format" : "png",
						"orientation" : ["portrait", "landscape"],
						"url" : "https://staging.remscripts.com/nativemia/logo.png"
					}],
					"fonts" : [{
						"id" : "mscripts",
						"version" : 1,
						"code" : "icon",
						"format" : "ttf",
						"url" : "https://staging.remscripts.com/nativemia/mscripts.ttf",
						"platform" : ["ios", "android", "mobileweb"]
					}, {
						"id" : "Roboto-Light",
						"version" : 1,
						"code" : "light",
						"format" : "ttf",
						"url" : "https://staging.remscripts.com/nativemia/Roboto-Light.ttf",
						"platform" : ["android", "mobileweb"]
					}, {
						"id" : "Roboto-Regular",
						"version" : 1,
						"code" : "regular",
						"format" : "ttf",
						"url" : "https://staging.remscripts.com/nativemia/Roboto-Regular.ttf",
						"platform" : ["android", "mobileweb"]
					}, {
						"id" : "Roboto-Medium",
						"version" : 1,
						"code" : "medium",
						"format" : "ttf",
						"url" : "https://staging.remscripts.com/nativemia/Roboto-Medium.ttf",
						"platform" : ["android", "mobileweb"]
					}, {
						"id" : "Roboto-Bold",
						"version" : 1,
						"code" : "bold",
						"format" : "ttf",
						"url" : "https://staging.remscripts.com/nativemia/Roboto-Bold.ttf",
						"platform" : ["android", "mobileweb"]
					}, {
						"id" : "Lato-Light",
						"version" : 1,
						"code" : "light",
						"format" : "ttf",
						"url" : "https://staging.remscripts.com/nativemia/Lato-Light.ttf",
						"platform" : ["ios"]
					}, {
						"id" : "Lato-Regular",
						"version" : 1,
						"code" : "regular",
						"format" : "ttf",
						"url" : "https://staging.remscripts.com/nativemia/Lato-Regular.ttf",
						"platform" : ["ios"]
					}, {
						"id" : "Lato-Bold",
						"version" : 1,
						"code" : "medium",
						"format" : "ttf",
						"url" : "https://staging.remscripts.com/nativemia/Lato-Bold.ttf",
						"platform" : ["ios"]
					}, {
						"id" : "Lato-Black",
						"version" : 1,
						"code" : "bold",
						"format" : "ttf",
						"url" : "https://staging.remscripts.com/nativemia/Lato-Black.ttf",
						"platform" : ["ios"]
					}]
				},
				"feedback_available" : "0",
				"feedback_url" : "",
				"is_upgrade_required" : "0",
				"upgrade_message" : "x",
				"supported_language" : "en,sp",
				"onphone_sync_max_value" : "15",
				"pickup_timegroup" : "pickupAsap",
				"refill_max_start_reminder_period" : "2",
				"supportemail_to" : "trsupport@mscripts.com",
				"supportemail_cc" : "",
				"supportphone" : "18883474494",
				"store_search_criteria" : "Search by City, State or Zip",
				"footer_text" : "mscripts, LLC 2014 and Target, Inc",
				"help_text_url" : "https://trtestbeta.remscripts.com/trhelp/",
				"facebook_url" : "http://www.facebook.com/Target",
				"twitter_url" : "http://twitter.com/#!/Target",
				"youtube_url" : "http://www.youtube.com/user/Target",
				"blog_url" : "",
				"getapp_url" : "https://trtestbeta.remscripts.com/trjwap",
				"client_url" : "",
				"gcmproject_id" : "135456903377",
				"facebook_appid" : "242869275747790"
			}
		}
	},
	"PATIENTS_MOBILE_EXISTS_OR_SHARED" : {
		"status" : "Success",
		"code" : "200",
		"message" : "The user exists in our system.",
		"description" : "x",
		"data" : {
			"patients" : {
				"is_mobile_shared" : "1",
				"mobile_exists" : "0"
			}
		}
	}
};
