/**
 * Created by James on 16/09/2016.
 */


/**
 * Created by James on 16/09/2016.
 */

var jsgui = require('jsgui2-lang');
var get_a_sig = jsgui.get_a_sig;
var remove_sig_from_arr_shell = jsgui.remove_sig_from_arr_shell;
var each = jsgui.each;
var clone = jsgui.clone;
var Data_Object = jsgui.Data_Object;


// Won't be fields, just items within the control.

// class Control_DOM
// create .content as a collection




var Control_fields = [
	['content', 'collection'],
	['dom', 'control_dom'],
	['size', 'size'],
	['color', 'color']
]
class Control_Core extends Data_Object {

	// Set up a field with type Control.
	//  Then it will be sent to the client as a control field, and the reference re-obtained.


	// Connect all fields? Just some of them?
	//  Want to make it easy for the necessary fields / control references to be sent to the client.
	//'connect_fields': true,

	// Style does Data_Object.set('style')
	//  so need to be careful about this style object.
	//   Will need to refer to it when rendering.

	// There will be the jsgui-style, but I think having normal style as the default is best, and that will get
	//  overridden in some circumstances.


	// We are likely to need a better style function in HTML.

	// may be good in some ways having it work as a field.

	// Keep dom.style.attributes as it is, but modify that when changing inline styles.

	'constructor'(spec) {
		// but process / normalize the spec here?
		spec = spec || {};
		//spec.nodeType = spec.nodeType || 1;
		//console.log('pre super init');
		//this._super(spec);

		//do_init_call(this, spec);
		this.mapListeners = {};

		// Some of the Control initialization makes sense to do before the Data_Object initialization.
		//  Data_Object will run the fields as function calls to set the values.
		// When setting the color upon init, it's not setting the color in the css.
		//  However, size is working OK.
		this.__type_name = 'control';
		this.__type = 'control';
		super(spec);


		//console.log('post super init');
		var spec_content;



		if (!this._abstract) {
			var tagName = spec.tagName || spec.tag_name || 'div';
			this.set('dom.tagName', tagName);
			this._icss = {};
			//this._.dom = {'tagName': 'div'};

			// Abstract controls won't have

			//console.log('dom ' + stringify(dom));

			// The DOM is a field that it should be getting from the control.
			spec_content = spec.content;
			if (spec_content) {
				tsc = tof(spec_content);
				if (tsc == 'array') {
					throw 'Content array not yet supported here.'
				} else if (tsc == 'string' || tsc == 'control') {
					this.content().add(spec_content);
				}

			}

			if (spec.el) {

				//console.log('spec.el', spec.el);
				this.set('dom.el', spec.el);
				//console.log('this._.dom._.el', this._.dom._.el);
				//throw 'stop';
			}

			var that = this;
			var context = this._context;
			//console.log('context', context);
			if (context) {

				if (context.register_control) context.register_control(this);
			} else {
				//console.trace('');
				//throw 'Control requires context'

				// I think the very first Control object's prototype or something that inherits from it does not have
				//  a context at some stage.
			}
			if (spec['class']) {
				//this.set('dom.attributes.class', spec['class']);
				this.add_class(spec['class']);
			}
			var content = this.get('content');
			content._parent = this;
			var that = this;

			// Want something in the change event that indicates the bubble level.
			//  It looks like the changes bubble upwards.

			// Want a 'target' for the change event.

			var size = this.get('size');
			var set_dom_size = function(size) {
				var width = size[0].join('');
				var height = size[1].join('');

				//console.log('width', width);
				//console.log('height', height);

				that.style({
					'width': width,
					'height': height
				});
			};

			var set_dom_color = function(color) {
				var color_css_property = 'background-color';

				// need to run output processor on the inernal color value

				var out_color = output_processors['color'](color);

				//console.log('out_color');


				that.style(color_css_property, out_color);
			};


			// This is where it sets the size to begin with.
			//  Need the same for color.
			//  Possibly need the same for a whole load of properties.
			if (size._) {
				set_dom_size(size._);
			}

			size.on('change', function(e_size_change) {
				//console.log('e_size_change', e_size_change);

				var target = e_size_change.target, name = e_size_change.name, value = e_size_change.value;

				set_dom_size(value);

				//console.log('*** value', value);
				//console.log('*** tof value', tof(value));

				// Could use an html/css output processor.


			});


			// Need to listen for changes in the color as well.

			var color = this.get('color');

			if (color._) {
				console.log('color._', color._);
				set_dom_color(color._);
			}

			color.on('change', function(e_color_change) {
				console.log('core ctrl e_color_change', e_color_change);

				var value = e_color_change.value;

				// Some controls will have color property apply to a different css property

				var color_css_property = 'background-color';

				// need to run output processor on the inernal color value

				var out_color = output_processors['color'](value);

				console.log('out_color');


				that.style(color_css_property, out_color);
			});
		}
	}


	'post_init'(spec) {
		//throw 'stop';
		if (spec && spec.id === true) {
			// get the id from the context.
			//if (t)
			this.set('dom.attributes.id', this._id());

		}
	}

	'_get_amalgamated_style'(arr_contexts) {


		return clone(this._.style);
	}

	'_get_rendered_inline_css_dict'() {

		// and does setting the style work right?

		// will refer to an object, will return this._.inline_css_dict.
		//  will render that dict when necessary ---?
		//  amalgamting the styles

		// when changing the style of something - may be overwritten by amalgamated styles?
		//  have an amalgamated style override?

		//var contexts = this.getContexts(),

		var ast = this.get_amalgamated_style()


		//console.log('ast ' + stringify(ast));
		var inline_css_dict = get_inline_css_dict_from_style(ast);

		//console.log('inline_css_dict ' + jsgui.stringify(inline_css_dict));

		return inline_css_dict;
	}


	'property_css_transition_duration'(style_property_name) {
		// this._.s

		// will refer to style properties differently

		if (this.has('_.s.transition')) {
			// look up the css transition in the jsgui style
			//if(this._.s.transition) {
			var tr = this._.s.transition;
			if (tr[style_property_name]) {
				// anything about duration etc?
				var dur = tr[style_property_name][0];
				return dur;
			}
			//}
		}
	}

	// 'ret' function - gets something if possible.
	'has'(item_name) {
		var arr = item_name.split('.');
		//console.log('arr ' + arr);
		var c = 0,
			l = arr.length;
		var i = this;
		var s;
		while (c < l) {
			s = arr[c];
			//console.log('s ' + s);
			if (typeof i[s] == 'undefined') {
				return false;
			}
			i = i[s];
			c++;
		};
		return i;
	}

	// The Dom attributes could count as fields, and wind up rendering themselves using Get.
	//  Dom attributes likely to be a collection as well, perhaps automatically sorted by name.
	// Could use collection rendering.
	'renderDomAttributes'() {
		//console.log('renderDomAttributes');

		// Pre-render dom attributes?
		//  To set the dom attributes programmatically according to properties.

		if (this.beforeRenderDomAttributes) {
			this.beforeRenderDomAttributes();
		}

		// Need to set up the data-jsgui-ctrl-fields attribute.
		//  Probably should not be setting it directly.
		//  It's just a string property.
		// The code that I'm currently using is messy and would be better if it were encapsulated.
		//  Just setting a property of a control with another control, on the server, should be enough to get this mechanism operating.
		//  It will be available as a field on the client-side.

		var dom_attrs = this.get('dom.attributes');

		if (!dom_attrs) {
			throw 'expecting dom_attrs';
		} else {
			if (this._ctrl_fields) {
				// go through the control fields, putting together the data attribute that will be persited to the client.

				// need to compose the string.

				var obj_ctrl_fields = {};

				var keys = Object.keys(this._ctrl_fields);
				var key;
				for (var c = 0, l = keys.length; c < l; c++) {
					key = keys[c];
					obj_ctrl_fields[key] = this._ctrl_fields[key]._id();
				}

				//each(this._ctrl_fields, function(ctrl_field, name) {
				//  obj_ctrl_fields[name] = ctrl_field._id();
				//});


				//this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(obj_ctrl_fields).replace(/"/g, "'"));
				// lower level set here?
				dom_attrs.set('data-jsgui-ctrl-fields', stringify(obj_ctrl_fields).replace(/"/g, "'"))


			}

			if (this._fields) {
				// go through the control fields, putting together the data attribute that will be persited to the client.

				// need to compose the string.

				//var obj_fields = {};
				//each(this._ctrl_fields, function(ctrl_field, name) {
				//  obj_ctrl_fields[name] = ctrl_field._id();
				//});

				//this.set('dom.attributes.data-jsgui-fields', stringify({
				//    'num_days': num_days
				//}).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"));


				//this.set('dom.attributes.data-jsgui-fields', stringify(this._fields).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"));
				dom_attrs.set('data-jsgui-fields', stringify(this._fields).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"))

			}
			var arr = [];
			//var arr_dom = dom_attrs._arr;

			//for (var c = 0, l = arr_dom.length; c < l; c++) {
			//  arr.push(' ', c, '="', arr_dom[c], '"');
			//}
			var _ = dom_attrs._;
			var dom_attrs_keys = Object.keys(_);
			//console.log('dom_attrs_keys', dom_attrs_keys);
			//throw 'stop';

			var key, item;
			for (var c = 0, l = dom_attrs_keys.length; c < l; c++) {
				key = dom_attrs_keys[c];
				item = _[key];
				arr.push(' ', key, '="', item, '"');
			}



			//dom_attrs.each(function (i, v) {
			//    arr.push(' ', i, '="', v, '"');
			//});
			return arr.join('');
		}


		// Maintaining a dict, or some data structure of the inline styles will help.






		//res = arr.join('');
		//return res;

	}
	'renderBeginTagToHtml'() {

		// will be in _.dom.tagName
		//  I think that's why we need the further level properties.

		// dom.style.transform3d.translate3d
		//  these property levels could go quite deep. Want a convenient way of using them without having to manually code lots of
		//  iterations, nested existance checks. Could have shortcuts so it knows what dom.translate3d means.
		// do we have 'get'?
		//var dom = this.get('dom');
		//var tagName = this.get('dom.tagName'),
		var tagName = this._.dom._.tagName;
		//console.log('this._.dom', this._.dom._.attributes);

		//console.log('tagName', tagName);
		res;

		if (tagName === false) {
			res = '';
		} else {

			//var dom_attributes = this.renderDomAttributes();
			res = ['<', tagName, this.renderDomAttributes(), '>'].join('');
		}
		//var res = ['<', this._.tagName, this.renderDomAttributes(), '>'].join('');

		//console.log('renderBeginTagToHtml res ' + res);
		return res;
	}
	'renderEndTagToHtml'() {
		// will have different way of referring to the tagName, but that could be a shortcut.
		// dom.tagName();
		//  through the fields system.
		var dom = this.get('dom');
		var tagName = dom.get('tagName'),
			res;

		var noClosingTag = dom.get('noClosingTag');

		//console.log(tof(noClosingTag));
		//throw 'stop';

		if (tagName === false || noClosingTag) {
			res = '';
		} else {
			res = ['</', tagName, '>'].join('');
		}

		//console.log('renderBeginTagToHtml res ' + res);
		return res;
	}
	'renderHtmlAppendment'() {
		return this.htmlAppendment || '';
	}

	// not rendering a jQuery object....
	// content including the tags? Not for the moment. Tags being false means there are no tags, and this tagless control acts as a container for other
	//  controls or content.
	// That will be useful for having different insertion points in controls without having to have them enclosed by an HTML element.

	'renderEmptyNodeJqo'() {
		return [this.renderBeginTagToHtml(), this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
	}

	// Need to implement deferred rendering.
	//  Some controls will ge ttheir data from a Resource / from Resources.
	//  This means the data is available to them asyncronously.
	//  The control will not be ready to render immediately.

	// For example, a control shows the records in a DB table. This is done through accessing a Resource.
	//  The control will not be ready to render until it has loaded the data from the Resource.

	// I think some kind of 'status' in the Control would make sense.
	//  Assumed to be ready, but could have .__status = 'waiting'
	// Could hold more info about waiting and timing?

	// For the moment, just need to be able to delay rendering a control until all subcontrols are ready.

	// Will go through the control tree like with rendering, noting down any that are not ready, and subscribing to their ready events.
	//  We count down the number yet to be ready, when that is 0 we do the rendering like normal, except returning the result asyncronously.


	'iterate_this_and_subcontrols'(ctrl_callback) {
		ctrl_callback(this);

		var content = this.get('content');
		var that = this;

		content.each(function(i, v) {
			//console.log('v', v);

			tv = tof(v);
			if (tv == 'string') {
				// escape the string.

				//var output = jsgui.output_processors['string'](n);
				//res.push(output);
				//res.push(jsgui.output_processors['string'](n));

			}
			/*
			 if (tof(n) == 'string') {
			 // escape the string.

			 var output = jsgui.output_processors['string'](n);
			 res.push(output);

			 }
			 */
			if (tv == 'data_value') {
				//var output = jsgui.output_processors['string'](n.get());
				//res.push(jsgui.output_processors['string'](n.get()));
			} else {
				//htm = n.all_html_render();
				//res.push(n.all_html_render());

				// it should not be null, but can ignore it for the moment / forever

				if (v && v.iterate_this_and_subcontrols) {
					v.iterate_this_and_subcontrols.call(v, ctrl_callback);
				}


			}



		});


	}

	// Should now include deferred rendering.

	'all_html_render'(callback) {

		//console.log('all render callback', tof(callback));
		if (callback) {

			//console.log('deferred rendering');
			//throw 'stop';

			// Get the map of any controls that have __status == 'waiting'.
			var that = this;
			// want to recursively iterate through controls and subconstrols.
			var arr_waiting_controls = [];

			// Worth setting up the listener on this loop?



			this.iterate_this_and_subcontrols(function(control) {
				if (control.__status == 'waiting') arr_waiting_controls.push(control);
			});

			// then if we are waiting on any of them we listen for them to complete.

			//console.log('arr_waiting_controls.length', arr_waiting_controls.length);

			if (arr_waiting_controls.length == 0) {
				var html = this.all_html_render();
				callback(null, html);
			} else {
				var c = arr_waiting_controls.length;

				var complete = function() {
					//console.log('complete');
					that.pre_all_html_render();

					var dom = that.get('dom');
					//console.log('dom', dom);

					if (dom) {
						// does it have innerHTML?
						//  I think that will just be a content item that gets rendered anyway.
						//console.log('has dom');

						/*

						 var beginning = this.renderBeginTagToHtml();
						 var middle = this.all_html_render_internal_controls();
						 var end = this.renderEndTagToHtml();
						 var appendment = this.renderHtmlAppendment();

						 res = [beginning, middle, end, appendment].join('');
						 */
						//return [that.renderBeginTagToHtml(), that.all_html_render_internal_controls(), that.renderEndTagToHtml(), that.renderHtmlAppendment()].join('');
						var html = [that.renderBeginTagToHtml(), that.all_html_render_internal_controls(), that.renderEndTagToHtml(), that.renderHtmlAppendment()].join('');
						//console.log('html', html);
						callback(null, html);
						//throw ('stop');
					}
				}

				each(arr_waiting_controls, function(control, i) {


					control.on('ready', function(e_ready) {
						//console.log('control ready');
						c--;
						//console.log('c');
						if (c == 0) {
							complete();
						}

					});
				});


			}
		} else {
			this.pre_all_html_render();

			var dom = this.get('dom');

			if (dom) {
				// does it have innerHTML?
				//  I think that will just be a content item that gets rendered anyway.
				//console.log('has dom');

				/*

				 var beginning = this.renderBeginTagToHtml();
				 var middle = this.all_html_render_internal_controls();
				 var end = this.renderEndTagToHtml();
				 var appendment = this.renderHtmlAppendment();

				 res = [beginning, middle, end, appendment].join('');
				 */
				return [this.renderBeginTagToHtml(), this.all_html_render_internal_controls(), this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
				//throw ('stop');
			}
		}

		//console.log('all_html_render ');
		//if (this.pre_all_html_render) {
		//
		//}


		//return res;
	}



	'render_content'() {

		//console.log('render_content');

		// it's controls() now, gets the collection of controls.
		//each(this._.controls, function(i, n) {

		//var fields = this.fields();
		//console.log('fields ' + stringify(fields));

		// Some kind of full content?
		//  Content shortcuts?

		// Or have an internal_content property?
		//  Possibility of different places for internal content?
		//   Or not right now?

		// I think an internal_content reference would be best.
		//  or just .internal


		// should be able to get the content... it's a field.
		//  but complications because it's a collection.

		// When adding a string to the collection...

		var content = this.get('content');

		// Does not have content?
		//  That's very strange.

		if (!content.length) {
			console.log('!!!no content length!!!');
			console.log('');
			console.log(this);
			console.log('');
			console.trace();
			console.log('content', content);
			console.log('tof(content) ' + tof(content));
			throw 'stop';
		}

		//console.log('content', content);
		//console.log('tof(content) ' + tof(content));

		// The content should not be a control.
		//  Can't call a part of a control its 'content', as that already exists.
		//  Should be considered a protected word.

		var contentLength = content.length();

		// var res = [];

		var res = new Array(contentLength);

		//console.log('-------------------------');
		//console.log('content ' + stringify(content));
		//console.log('tof(content) ' + tof(content));
		//throw('8) stop');

		/*
		 each(controls._arr, function(i, n) {
		 htm = n.all_html_render();
		 res.push(htm);
		 });
		 */
		var tn, output;
		//console.log('content', content);

		// content._arr

		var arr = content._arr;
		var c, l = arr.length, n;

		for (c = 0; c < l; c++) {
			n = arr[c];
			// Could use faster duck typing here.
			tn = tof(n);
			if (tn == 'string') {
				// escape the string.
				//var output = jsgui.output_processors['string'](n);
				//res.push(output);
				res.push(jsgui.output_processors['string'](n));
			}
			/*
			 if (tof(n) == 'string') {
			 // escape the string.

			 var output = jsgui.output_processors['string'](n);
			 res.push(output);

			 }
			 */
			if (tn == 'data_value') {
				//var output = jsgui.output_processors['string'](n.get());
				res.push(jsgui.output_processors['string'](n._));
			} else {
				if (tn == 'data_object') {
					//console.log('n', n);
					//
					throw 'stop';
				} else {
					res.push(n.all_html_render());
				}
				//htm = n.all_html_render();
			}
		}

		//console.log('res', res);
		return res.join('');
	}

	'all_html_render_internal_controls'() {
		//var controls = this.controls, res = [];
		return this.render_content();
	}
	'pre_all_html_render'() {

	}



	'compose'() {

		// I think having this avoids a recursion problem with _super calling itself.
	}

	'wait'(callback) {
		//console.log('wait');
		setTimeout(function () {
			callback();
		}, 0);
	}
	// could use aliases for style properties.

	'visible'(callback) {

		//console.log('vis');

		//return this.style('display', 'block', callback);
		this.style('display', 'block', callback);
	}

	// These kind of functions, that set a property to a value, could be made in a more efficient way.

	// have this in a function chain?
	'transparent'(callback) {
		// make block or inline display, maybe depending on what it was before being made hidden
		//console.log('transp');
		// if display is none then display it.
		//  may have the previous display value stored.
		//return this.style({'opacity': 0}, callback);
		this.style('opacity', 0, callback);
		/*

		 this.style({
		 'display': 'block',
		 'opacity': 0
		 });

		 if (callback) {
		 setTimeout(function() {
		 callback();
		 }, 0);
		 } else {
		 return this;
		 }
		 */
	}
	'opaque'(callback) {
		return this.style({
			'opacity': 1
		}, callback);

	}

	// possibly change name
	'chain'(arr_chain, callback) {
		// each item in the array is a function call (reference) that needs to be executed.
		// assuming the last param in each function is the callback.

		var pos_in_chain = 0;

		//setTimeout()
		var that = this;
		var process_chain = function () {
			//console.log('process_chain arr_chain.length ' + arr_chain.length + ', pos_in_chain ' + pos_in_chain);
			//console.log('arr_chain.length ' + arr_chain.length);
			if (pos_in_chain < arr_chain.length) {
				var item = arr_chain[pos_in_chain];

				// what types can item be
				// an array... that means more than one thing gets applied at this point in the chain.

				var t_item = tof(item);

				//console.log('t_item ' + t_item);
				if (t_item == 'array') {
					// do more than one item at once.

					// will wait for them all to be complete too.
					var count = item.length;
					var cb = function () {
						count--;
						if (count == 0) {
							//if (callback) {
							//	callback();
							//}
							pos_in_chain++;
							process_chain();
						}
					};
					each(item, function (i, v) {
						that.fn_call(v, function () {
							cb();
						});
					});
					//console.log('arr item ' + stringify(item));
				} else {
					// for a string I think.
					// could be a map, and need to call the item(s) in the map.
					that.fn_call(item, function () {
						//console.log('cb1');
						pos_in_chain++;
						process_chain();
					});
				}
			} else {
				if (callback) {
					callback.call(that);
				}
			}
		}
		process_chain();
	}
	'fn_call'(call, callback) {
		// and callbacks within the right way?
		//console.log('fn_call ' + call);
		var t = tof(call);
		//console.log('t ' + t);
		// but call may be an object...
		var fn, params, that = this;
		if (t == 'string') {
			fn = this[call];
			params = [];
			//console.log('callback ' + callback);
			if (callback) {
				return fn.call(this, callback);
			} else {
				return fn.call(this);
			}
		};
		if (t == 'array') {
			// the 0th item in the arr should be the function name, the rest the params
			// but does the function have a 'callback' param that we know about here? not now.
			fn = this[call[0]];
			params = call.slice(1);
			if (callback) params.push(callback);
			return fn.apply(this, params);
		}
		if (t == 'object') {
			// how many?
			var count = 0;
			each(call, function (i, v) {
				count++;
			});

			each(call, function (i, v) {
				var cb = function () {
					count--;
					if (count == 0) {
						callback.call(that);
					}
				};
				that.fn_call([i, v], cb);
			});
		}
	}

	// I think .animate syntax would be very helpful.
	//  syntax similar to jQuery but likely to allow more possible options???
	//   more ways of expressing the options.






	// This could probably be defined as an alias.

	// transition -> style.transition
	//  Integrating callbacks with these property changes?
	//  Maybe should not do so much more on compressing & generalizing yet.

	// Horizontal_Carousel_Selector
	//  Or just show these various selectable items in the horizontal carousel.

	// Will maybe make the carousel continuous, so could go from December to January, and it would raise an event
	//  signifying the continuation and direction, so this could make the year change.
	// Would have a horizontal carousel selector for selecting the year, with it continuing.
	//  Could make it a combo selector so the value can be typed in as well. 'J' would bring up 'January', 'June' and 'July' as autoselect items.
	// Putting these GUI features in place will not take so long, and will help this to be a powerful toolkit.

	// May be worth doing more on databases and authentication though.



	'transition'(value, callback) {
		//var i = {};
		//i[]

		// may include multiple transitions in an array.
		return this.style({
			'transition': value
		}, callback);
	}

	'transit'() {

		var a = arguments; a.l = arguments.length; var sig = get_a_sig(a, 1);
		var that = this;
		var unshelled_sig = remove_sig_from_arr_shell(sig);
		//if (remove_sig_from_arr_shell(sig))
		//console.log('unshelled_sig ' + unshelled_sig);
		if (unshelled_sig == '[[n,s],o]') {
			return this.transit(a[0][0], a[0][1]);
		}

		if (sig == '[[[n,s],o],f]') {
			var transit = a[0];
			var callback = a[1];

			var duration_and_tf = transit[0];
			var map_values = transit[1];

			this.transit(duration_and_tf, map_values, callback);

		} else if (sig == '[[n,s],o,f]') {
			var duration_and_tf = a[0];
			var map_values = a[1];
			var callback = a[2];
			var transition = {};
			each(map_values, function (i, v) {
				// set the transition style
				transition[i] = duration_and_tf;
			});
			that.transition(transition);

			each(map_values, function (i, v) {
				// set the transition style
				//transition[i] = arr_duration_and_timing_function;

				// use the style function to set the value
				// and use a callback system here for when they are all done.

				that.style(i, v);
			});

			//this.transit(duration_and_tf, map_values, callback);
		} else if (a.length == 2) {
			var duration_and_tf = a[0];
			//console.log('a ' + stringify(a));

			// transit includes the map values

			var duration_and_tf = a[0];
			var map_values = a[1];
			//var transit_map = a[1];
			var transition = {};

			each(map_values, function (i, v) {
				// set the transition style
				transition[i] = duration_and_tf;


			});
			that.transition(transition);

			each(map_values, function (i, v) {
				// set the transition style
				//transition[i] = arr_duration_and_timing_function;

				// use the style function to set the value
				// and use a callback system here for when they are all done.

				that.style(i, v);

			});
			//console.log('transit_map ' + stringify(transit_map));
			//this.transit(duration_and_tf, transit_map);
			//that.transition()
		} // else if (a.length == 3) {
		//	var arr_duration_and_timing_function = a[0], map_values = a[1], callback = a[2];
		//	console.log('a ' + stringify(a));


		//}

	}

	// and also want to be able to output the property.

	'out'(property_name) {
		var dti_control = data_type_instance('control');

		//var prop_ref = get_property_reference(this, property_name, false);
		var prop_ref = dti_control.nested_get_property_reference([this, '_'], property_name, true);

		var item_type = prop_ref[2];
		var dti_item = data_type_instance(item_type);

		var out_val = dti_item.output(prop_ref[0][prop_ref[1]]);

		//console.log('out prop_ref ' + stringify(prop_ref));
		//console.log('out out_val ' + stringify(out_val));

		return out_val;
	}

	'page_context'(val) {
		if (typeof val == 'undefined') {
			// _.page_context should not be a function.

			// how frequently does it need to be called?
			//  is it being called too much?
			//console.log('� this._.page_context ' + this._.page_context);
			if (is_defined(this._.page_context)) {
				return this._.page_context;
			} else {
				if (jsgui.page_context) {
					return jsgui.page_context;
				}
			}
		} else {
			this._.page_context = val;
		}
	}

	// may change the controls access functions, but seems simple and OK for the moment to wrap them like this.

	// will just be adding to the content.

	'_add_control'(new_content) {
		//var content = this.get('content');


		// The controls array being an ID'd and indexed collection.
		//  Everything in there has an ID.
		//  So needs a page_context.
		//  Seems a little inconvenient.
		//  But will solve the problem for the moment.



		//return content.add(new_content);
		return this.get('content').add(new_content);
	}
	'add'(new_content) {

		//console.log('new_content', new_content);

		// Will also turn XML strings describing jsgui controls/content into controls/content.

		var tnc = tof(new_content);
		//console.log('control add content tnc', tnc);

		if (tnc == 'array') {
			var res = [], that = this;
			each(new_content, function(i, v) {
				res.push(that.add(v));
			});
			return res;
		} else {

			if (new_content) {
				if (!new_content._context) {
					if (this._context) {
						new_content._context = this._context;
					}
				}
				var inner_control = this.get('inner_control');


				//console.log('inner_control', inner_control);

				// Does it add a Data_Object successfully?

				// Could adding this cause content inside the content that's being added to duplicate?

				if (inner_control) {
					return inner_control.get('content').add(new_content);
				} else {
					return this.get('content').add(new_content);
				}
			}


		}

		//var content = this.get('content');

		// but the context of the new control should be set.

		// Carousel Button
		//  Carousel button Selector
		//  In horizontal mode.

		//throw 'stop';

		// won't need to apply the context automatically... but maybe if the object does not already have one.


		//console.log('post content add');
	}
	'insert_before'(target) {
		//console.log('target', target);

		//console.log('pre find parent');
		//throw 'stop';

		// The parent of a content Collection being a Control?
		//  Probably makes sense.


		var target_parent = target.parent().parent();

		//console.log('target_parent', target_parent);

		var target_index = target._index;

		//console.log('target_index', target_index);

		// insert into the content collection.

		var content = target_parent.get('content');

		content.insert(this, target_index);
	}
	'stringify' () {
		var res = [];
		res.push('Control(' + stringify(this._) + ')');
		return res.join('');
	}
	'style'() {

		var a = arguments; a.l = arguments.length; var sig = get_a_sig(a, 1);
		// For the moment, this should be a convenient way of updating the dom attributes style.

		//  This could do the document update or not....

		var style_name, style_value, modify_dom = true;

		if (sig == '[s]') {

			// Best not to refer to the computed styles probably?
			//  Really want to interact with inline styles here.

			// maybe have some syntax for computed styles, such as .style('computed', style_name);
			//  Or just don't have it, get it from the element if needed.




			// Want to get a style value.
			//  This could get fairly complicated when getComputedStyle is not around, in older browsers.

			// May have a system to read through a stylesheet and work out what would get applied to an element

			// For the moment, will look at style of control property (need to develop that more).

			var styleName = a[0];
			//console.log('get style ' + styleName);

			var el = this.get('dom.el');

			// Should probably return a copy of the style, not read from the DOM.

			var res = getComputedStyle(el)[styleName];
			return res;


		}


		//console.log('style sig ' + sig);

		if (sig == '[s,s,b]') {
			var styleName = a[0];
			var styleValue = a[1];

			// Modify dom by default if there is a DOM.


			var modifyDom = a[2];

		};

		if (sig == '[s,s]' || sig == '[s,n]') {
			var styleName = a[0];
			var styleValue = a[1];

			// rebuild the css style???
			//  May just be in the dom attributes as well.

			//var das = this._.dom_attributes._.style;
			//console.log('das', das);

			//var da = this._.dom._.attributes;
			//console.log('da', da);




			// Modify dom by default if there is a DOM.
			//var modifyDom = a[2];

		};






		if (styleName && typeof styleValue !== 'undefined') {
			//var styleName = a[0];
			//var styleValue = a[1];

			// dom.attributes.style - as a normal data_object?
			//  Or a particular type of attribute that is dealt with differently?


			// Need to set the inline css dict

			// will update the dom attributes string from the style?
			//  will set an item in the inline_css_dict

			this._icss[styleName] = styleValue;

			// then rebuild the dom attributes style from that one.

			// produce the inline css from that dict...

			//console.log('styleName', styleName);

			var str_css = '';
			//var first = true;
			each(this._icss, function(item_style_value, item_style_name) {
				//if (!first) {
				//    str_css = str_css + '';
				//}
				str_css = str_css + item_style_name + ':' + item_style_value + ';';
			})
			//console.log('str_css', str_css);


			if (modify_dom) {
				this.set('dom.attributes.style', str_css);
			}

		}
		var that = this;


		if (sig == '[o]') {

			// could recompute the whole style string in a more optimized way.
			//  there could also be a style map, that would help in storing and checking particular styles.



			each(a[0], function(v, i) {
				//console.log('v', v);
				//console.log('i', i);
				that.style(i, v, false);
			});

			var style = this.value('dom.attributes.style');

			var el = this.value('dom.el');

			if (el) {
				el.style.cssText = style;
			}


		}


	}
	'active'() {
		// only on the server.
		//  Not necessarily!
		//  Perhaps client-side rendering should render the jsgui id. That is really necessary.
		//  However, perhaps should not use active to do this.


		//console.log('');
		//console.log('active');
		var id = this._id();

		//var domAttributes = this.get('dom.attributes');

		//domAttributes.set('data-jsgui-id', id);
		//domAttributes.set('data-jsgui-type', this.__type_name);


		// Longer code version...
		var dom = this._.dom;


		//console.log('this', this);

		var dom_attributes = this._.dom._.attributes;
		if (!dom_attributes) {
			dom_attributes = dom.get('attributes');
			//dom_attributes.set('data-jsgui-id', id);
			//dom_attributes.set('data-jsgui-type', this.__type_name);
			//console.log('dom_attributes', dom_attributes);
			//dom_attributes._['data-jsgui-id'] = new Data_Value({'value': id});
			//dom_attributes._['data-jsgui-type'] = new Data_Value({'value': this.__type_name});
		} else {

		}
		//console.log('dom_attributes', dom_attributes);
		//throw 'stop';
		dom_attributes._['data-jsgui-id'] = new Data_Value({'value': id});
		dom_attributes._['data-jsgui-type'] = new Data_Value({'value': this.__type_name});
		//var el = this._.el || dom._.el;
		var el;

		if (dom._.el) {
			el = dom._.el._;
		}

		if (el) {
			//console.log('el', el);
			//console.log('el.nodeType', el.nodeType);

			if (el.nodeType === 1) {
				el.setAttribute('data-jsgui-id', id);
				el.setAttribute('data-jsgui-type', this.__type_name);
			}


		}






		// Then update the DOM?




		// Calls active on the inner controls.

		//
		var tCtrl;

		this.get('content').each(function(i, ctrl) {
			//console.log('active i', i);

			tCtrl = tof(ctrl);
			//console.log('tCtrl', tCtrl);
			if (tCtrl === 'control') {
				ctrl.active();
			}
		});

		// need to listen to content change.


	}
	// So I think the resource-pool will have a selection scope.
	'find_selection_scope'() {
		//console.log('find_selection_scope');

		var res = this.get('selection_scope');
		if (res) return res;

		// look at the ancestor...

		var parent = this.get('parent');
		//console.log('parent ' + tof(parent));


		if (parent) return parent.find_selection_scope();

	}

	'click'(handler) {
		// Adding the click event listener... does that add it to the DOM?

		this.add_event_listener('click', handler);
	}
	'hover'(fn_in, fn_out) {
		this.add_event_listener('mouseover', function(e) {
			//console.log('hover mouseover');
			fn_in();
		})

		this.add_event_listener('mouseout', function(e) {
			//console.log('hover mouseout');
			fn_out();
		})
	}



	'add_class'(class_name) {
		// Should have already set these up on activation.
		//console.log('Control add_class ' + class_name);
		var cls = this.get('dom.attributes.class');
		//console.log('cls ' + cls);
		var el = this.get('dom.el');

		//console.log('add_class el ' + el);
		if (!cls) {

			this.set('dom.attributes.class', class_name);


			// as well as that, need to have the class in the doc respond to this chaging.
			//  event listener listening for dom changes will update this.

			//if (el) el.className = class_name;

		} else {
			var tCls = tof(cls);
			//console.log('tCls ' + tCls);
			if (tCls == 'object') {
				//cls
				cls[class_name] = true;
				// then get the classes from the obj

				var arr_class = [];
				each(cls, function(i, v) {
					if (v) arr_class.push(i);
				})
				var str_class = arr_class.join(' ');
				el.className = str_class;
			} else if (tCls == 'data_value') {
				var val = cls.value();

				var arr_classes = val.split(' ');
				var already_has_class = false, l = arr_classes.length, c = 0;
				while (c < l &! already_has_class) {
					if (arr_classes[c] == class_name) {
						already_has_class = true;
					}
					c++;
				}
				if (!already_has_class) {
					arr_classes.push(class_name);
				}
				var str_cls = arr_classes.join(' ');
				//console.log('str_cls', str_cls);
				this.set('dom.attributes.class', str_cls);

				//this.add_class(val);
				// And the DOM should update itself when one of these 'model' objects gets changed - depending on if its activated or not.


			} else if (tCls == 'string') {
				var arr_classes = cls.split(' ');
				var already_has_class = false, l = arr_classes.length, c = 0;
				while (c < l &! already_has_class) {
					if (arr_classes[c] == class_name) {
						already_has_class = true;
					}
					c++;
				}
				if (!already_has_class) {
					arr_classes.push(class_name);
				}
				var str_cls = arr_classes.join(' ');
				//console.log('str_cls', str_cls);
				this.set('dom.attributes.class', str_cls);
				// And the DOM should update itself when one of these 'model' objects gets changed - depending on if its activated or not.


			}
		}
		//throw 'stop';

	}

	'remove_class'(class_name) {
		//console.log('remove_class ' + class_name);


		var cls = this.get('dom.attributes.class');
		//console.log('cls ' + stringify(cls));
		var el = this.get('dom.el');
		//console.log('el', el);
		if (cls) {
			var tCls = tof(cls);
			//console.log('tCls', tCls);
			//throw 'stop';
			if (tCls == 'object') {
				//el.

				// go through it again, building the class string...
				var arr_class = [];
				each(cls, function(i, v) {
					//if (v) arr_class.push(i);
					if (i == class_name) cls[i] = false;
					if (cls[i]) arr_class.push(i);
				})
				var str_class = arr_class.join(' ');
				this.set('dom.attributes.class', str_cls);
				//el.className = str_class;

				//console.log('str_class ' + str_class);
			}
			if (tCls == 'string') {
				//console.log('cls', cls);
				var arr_classes = cls.split(' ');
				var arr_res = [];
				var l = arr_classes.length, c = 0;
				//console.log('arr_classes', arr_classes);
				while (c < l) {
					if (arr_classes[c] != class_name) {
						//already_has_class = true;
						arr_res.push(arr_classes[c]);
					}
					c++;
				}
				//console.log('arr_res', arr_res);
				var str_cls = arr_res.join(' ');
				//console.log('str_cls ', str_cls);
				this.set('dom.attributes.class', str_cls);

				//console.log('str_cls ' + str_cls);
				//throw 'stop';
			}

			// and if it's a data value, do similar...

			if (tCls == 'data_value') {
				var cls2 = cls.value();

				var arr_classes = cls2.split(' ');
				var arr_res = [];
				var l = arr_classes.length, c = 0;
				//console.log('arr_classes', arr_classes);
				while (c < l) {
					if (arr_classes[c] != class_name) {
						//already_has_class = true;
						arr_res.push(arr_classes[c]);
					}
					c++;
				}
				//console.log('arr_res', arr_res);
				var str_cls = arr_res.join(' ');
				//console.log('str_cls ', str_cls);
				this.set('dom.attributes.class', str_cls);

				//console.log('str_cls ' + str_cls);
			}

		}
	}

	'hover_class'(class_name) {
		// Though this is a behaviour...
		//  could make this work through the behaviour system?
		//  could make the behaviour system work with this.
		//   This one seems fairly simple, lower level than behaviour system.

		// but in the group... when hover_class gets called for the group, it needs to be active on the group....

		// When targeting a group as well...
		//  May need to give groups a bit more thought.

		// But hover_class seems useful at least.


		var that = this;
		that.hover(function(e_in) {
			that.add_class(class_name);
			//ctrl_key_close_quote.add_class(hover_class);
		}, function(e_out) {
			that.remove_class(class_name);
			//ctrl_key_close_quote.remove_class(hover_class);
		})


	}

	/*
	 'find': function(selector) {

	 }
	 */

	/*
	 'children': fp(function(a, sig) {
	 var selector;


	 if (sig == '[s]') {
	 selector = a[0];
	 }




	 })
	 */


	'matches_selector'(selector) {

	}

	// Want to see if an element (or control) is a descendant of this.
	//  If this is an ancestor of element or control. is_ancestor_of
	// will go through DOM parent nodes or control parents.

	'is_ancestor_of'(target) {
		var t_target = tof(target);
		//console.log('t_target', t_target);

		var el = this.value('dom.el');

		var inner = function(target2) {

			if (target2 == el) {
				return true;
			}
			var parent = target2.parentNode;
			if (!parent) {
				return false;
			}  else {
				return inner(parent);
			}

		}

		if (t_target == 'object') {
			if (el != target) {
				var parent = target.parentNode;
				if (parent) {
					return inner(parent);
				}
			}

		}
	}

	'find_selected_ancestor_in_scope'() {
		// same selection scope
		// is this one already selected?
		// best not to check....

		var s = this.get('selection_scope');


		var parent = this.get('parent');
		//console.log('parent ' + parent);

		var ps = parent.get('selection_scope');

		if (s === ps) {
			// Probably would be much more convenient to get a data value just as its value,
			//  or have a more convenient data value idiom.
			var psel = parent.get('selected');
			if (psel && psel.value && psel.value() == true) {
				//throw 'stop';

				return parent;
			} else {
				return parent.find_selected_ancestor_in_scope();
			}
		}
		//throw 'stop';


	}

	'remove'() {
		var el = this.get('dom.el');
		if (el) {
			if (el.parentNode) {
				el.parentNode.removeChild(el);
			}
		}
	}

	'shallow_copy'() {
		console.log('Control shallow_copy');

		var res = new Control({
			'context': this._context
		});


		// need to get setting of one data object to another correct.
		//  That looks like a lower level piece of functionality that needs attention.

		// For the moment, want to get some kind of shallow copy working.

		//res.set('dom.attributes', this.get('dom.attributes'));

		var da = this.get('dom.attributes');
		var cl = da.get('class');

		console.log('cl ' + stringify(cl));
		console.log('cl ' + tof(cl));

		var map_class_exclude = {
			'bg-light-yellow': true,
			'selected': true
		}

		each(cl, function(i, v) {
			if (i && !map_class_exclude[i]) res.add_class(i);
		})

		var res_content = res.get('content');

		this.get('content').each(function(i, v) {
			console.log('v ' + v);
			//console.log('v ' + stringify(v));
			console.log('tof v ' + tof(v));

			if (tof(v) == 'data_value') {
				res_content.add(v.value());
			} else {
				res_content.add(v.shallow_copy());
			}


		})

		return res;
	}

	// 01/03/2016
	//  Better for color to be handled by the input and output processing systems and fields.
	//  Not using a function within the Control definition space.
	//  .size works like this already. Should be similar.
	///  ??? or not???

	// May be better as a property with getter & setter.
	//


	'color'() {

		var a = arguments; a.l = arguments.length; var sig = get_a_sig(a, 1);

		// It may be worth having a color field.
		//  And that color field gets listened to, and DOM changes get made from that.



		console.log('color sig ', sig);
		// Should probably try to use color input and output processors.

		var input_processor = jsgui.input_processors['color'];
		//console.log('input_processor', input_processor);

		var output_processor = jsgui.output_processors['color'];
		//console.log('output_processor', output_processor);

		if (sig == '[]') {
			var el = this.get('dom.el');

			//var w = parseInt(getStyle(el, 'width'), 10);
			//var h = parseInt(getStyle(el, 'height'), 10);
			//var res = [w, h];
			//return res;
		}
		if (sig == '[a]') {
			var processed = input_processor(a[0]);
			//console.log('processed', processed);

			this.set('color', processed, false); // false not to raise change event from it?

			var html_color = output_processor(processed);

			//console.log('html_color', html_color);

			var color_property_name = this.__color_property_name || 'background-color';

			this.style(color_property_name, html_color);

		}

	}

	'offset'() {
		var a = arguments; a.l = arguments.length; var sig = get_a_sig(a, 1);
		if (sig == '[]') {
			var el = this.get('dom.el');
			var res = [el.offsetLeft, el.offsetTop];
			return res;
		}
		if (sig == '[a]') {
			this.style({
				'left': a[0] + 'px',
				'top': a[1] + 'px'
			})
		}
	}

	'clear'() {
		// clear all the contents.
		// ui should react to the change.

		return this.get('content').clear();

	}

	'activate'() {
		// Do nothing for basic control I think.
		//  Possibly will be doing some things depending on discovered properties.

		// Need to work more on heirachy in activation.
		//  Want html documents (and pretty much everythin else) to use the enhanced activation.
		//  Should be OK having that in the dependency chain on the server, much of the code won't be called though.

		// Or, enhance the activations of the prototypes?
		//  I'd prefer to have the enhancements become higher up the chain.


	}

};

var p = Control_Core.prototype;
p.fields = Control_fields;
p.connect_fields = true;

module.exports = Control_Core;