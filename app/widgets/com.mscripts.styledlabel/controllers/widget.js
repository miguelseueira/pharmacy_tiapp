var args = arguments[0] || {},
    _html,
    _bold;

(function() {

	var options = _.pick(args, ["width", "height", "top", "bottom", "left", "right", "font", "color", "textAlign", "backgroundColor", "borderColor", "borderWidth", "borderRadius"]);
	if (!_.isEmpty(options)) {
		$.widget.applyProperties(options);
	}

	_bold = {
		fontSize : args.font && args.font.fontSize ? args.font.fontSize : 18,
		fontWeight : "bold",
	};

	if (_.has(args, "html")) {
		setHtml(args.html);
	}

})();

function setHtml(html) {
	_html = html;
	if (OS_IOS) {
		var htmlparser = require(WPATH("htmlparser"));
		var handler = new htmlparser.HtmlBuilder(function(error, dom) {
			if (error) {
				console.error("unable to parse html");
			} else {

				var text = "",
				    strings = [],
				    attributes = [],
				    len = dom.length,
				    i = 0,
				    j = 0;

				for ( i = 0; i < len; i++) {
					var item = dom[i];
					if (item.children) {
						var children = item.children;
						for (j in children) {
							children[j].previous = true;
							dom.splice(i + 1, 0, children[j]);
						}
						delete item.children;
						len = dom.length;
					} else if (item.data) {
						strings.push(item.data);
					}
				}

				j = 0;
				var lastIndex = len - 1;
				for ( i = 0; i < len; i++) {
					var item = dom[i];
					switch(item.name) {
					case "b":
						attributes.push({
							type : Titanium.UI.iOS.ATTRIBUTE_FONT,
							value : _bold,
							range : [text.length, strings[j].length]
						});
						break;
					case "font":
						attributes.push({
							type : Titanium.UI.iOS.ATTRIBUTE_FOREGROUND_COLOR,
							value : item.attributes.color,
							range : [text.length, strings[j].length]
						});
						break;
					case "u":
						attributes.push({
							type : Titanium.UI.iOS.ATTRIBUTE_UNDERLINES_STYLE,
							value : Titanium.UI.iOS.ATTRIBUTE_UNDERLINE_STYLE_SINGLE | Titanium.UI.iOS.ATTRIBUTE_UNDERLINE_PATTERN_SOLID,
							range : [text.length, strings[j].length]
						});
						break;
					}
					if (item.data || (dom[i + 1] && !dom[i + 1].previous)) {
						text += strings[j];
						j += 1;
					}
				}

				$.widget.attributedString = Ti.UI.iOS.createAttributedString({
					text : strings.join(''),
					attributes : attributes
				});
			}
		});
		new htmlparser.Parser(handler).parseComplete(html);
	} else {
		$.widget.html = _html;
	}
}

function getHtml() {
	return _html;
}

function didClick(e) {
	$.trigger("click");
}

exports.setHtml = setHtml;
exports.getHtml = getHtml;

