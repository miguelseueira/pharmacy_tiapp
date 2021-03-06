var Alloy = require("alloy"),
    barcode = require("barcode"),
    apiCodes = Alloy.CFG.apiCodes,
    $,
    phone,
    barcodeData,
    refillErroMessage;

function init(ctrl, ph, callback) {
	$ = ctrl;
	/**
	 *  undefined will be excluded
	 * on JSON.stringify, so server
	 * request won't have this field
	 */
	phone = ph || undefined;
	barcode.capture($, {
		acceptedFormats : Alloy.CFG.accepted_barcode_formats,
		success : didGetBarcode,
		passthrough : callback
	});
}

function didGetBarcode(e) {
	/**
	 *  if the prescription scanned is currently
	 * associated with the mail order store then
	 * the delivery method is mail order else it is pickup
	 */
	barcodeData = e.result;
	$.http.request({
		method : "prescriptions_refill",
		params : {
			filter : {
				refill_type : apiCodes.refill_type_scan
			},
			data : [{
				prescriptions : [{
					mobile_number : phone,
					pickup_mode : barcodeData.substring(Alloy.CFG.rx_store_start_index, Alloy.CFG.rx_store_end_index) === Alloy.Models.appload.get("mail_order_store_identifier") ? apiCodes.pickup_mode_mail_order : apiCodes.pickup_mode_instore,
					pickup_time_group : Alloy.CFG.pickup_time_group,
					barcode_data : barcodeData
				}]
			}]
		},
		success : didRefill
	});
}

function didRefill(result, passthrough) {
	/**
	 *  will have only one prescription for scan
	 */
	var prescription = result.data.prescriptions[0],
	    navigation;
	if (prescription.refill_is_error === true) {
		//failure
		navigation = {
			titleid : "titleRefillFailure",
			ctrl : "refillFailure",
			ctrlArguments : {
				phone : phone,
				refillErroMessage : prescription.refill_error_message				
			}
		};
	} else {
		/**
		 * if store identifier and rx number
		 * start index are same, then store identifier
		 * is not considered when user enters it (refill type).
		 * While scan we can't avoid store identifier, so re-index
		 * the rx number if required
		 */
		var startIndex = Alloy.CFG.rx_start_index,
		    endIndex = Alloy.Globals.rx_max;
		if (Alloy.CFG.rx_store_start_index === startIndex) {
			var storeIdentifierLen = Alloy.CFG.rx_store_end_index - Alloy.CFG.rx_store_start_index;
			startIndex += storeIdentifierLen;
			endIndex += storeIdentifierLen;
		}
		//success
		_.extend(prescription, {
			title : $.strings.strPrefixRx.concat(barcodeData.substring(startIndex, endIndex)),
			subtitle : prescription.refill_inline_message || prescription.refill_error_message
		});
		navigation = {
			ctrl : "refillSuccess",
			ctrlArguments : {
				prescriptions : [prescription],
				phone : phone
			}
		};
	}
	$.app.navigator.open(navigation);
}

exports.init = init;
