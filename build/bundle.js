
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var colorName = {
    	"aliceblue": [240, 248, 255],
    	"antiquewhite": [250, 235, 215],
    	"aqua": [0, 255, 255],
    	"aquamarine": [127, 255, 212],
    	"azure": [240, 255, 255],
    	"beige": [245, 245, 220],
    	"bisque": [255, 228, 196],
    	"black": [0, 0, 0],
    	"blanchedalmond": [255, 235, 205],
    	"blue": [0, 0, 255],
    	"blueviolet": [138, 43, 226],
    	"brown": [165, 42, 42],
    	"burlywood": [222, 184, 135],
    	"cadetblue": [95, 158, 160],
    	"chartreuse": [127, 255, 0],
    	"chocolate": [210, 105, 30],
    	"coral": [255, 127, 80],
    	"cornflowerblue": [100, 149, 237],
    	"cornsilk": [255, 248, 220],
    	"crimson": [220, 20, 60],
    	"cyan": [0, 255, 255],
    	"darkblue": [0, 0, 139],
    	"darkcyan": [0, 139, 139],
    	"darkgoldenrod": [184, 134, 11],
    	"darkgray": [169, 169, 169],
    	"darkgreen": [0, 100, 0],
    	"darkgrey": [169, 169, 169],
    	"darkkhaki": [189, 183, 107],
    	"darkmagenta": [139, 0, 139],
    	"darkolivegreen": [85, 107, 47],
    	"darkorange": [255, 140, 0],
    	"darkorchid": [153, 50, 204],
    	"darkred": [139, 0, 0],
    	"darksalmon": [233, 150, 122],
    	"darkseagreen": [143, 188, 143],
    	"darkslateblue": [72, 61, 139],
    	"darkslategray": [47, 79, 79],
    	"darkslategrey": [47, 79, 79],
    	"darkturquoise": [0, 206, 209],
    	"darkviolet": [148, 0, 211],
    	"deeppink": [255, 20, 147],
    	"deepskyblue": [0, 191, 255],
    	"dimgray": [105, 105, 105],
    	"dimgrey": [105, 105, 105],
    	"dodgerblue": [30, 144, 255],
    	"firebrick": [178, 34, 34],
    	"floralwhite": [255, 250, 240],
    	"forestgreen": [34, 139, 34],
    	"fuchsia": [255, 0, 255],
    	"gainsboro": [220, 220, 220],
    	"ghostwhite": [248, 248, 255],
    	"gold": [255, 215, 0],
    	"goldenrod": [218, 165, 32],
    	"gray": [128, 128, 128],
    	"green": [0, 128, 0],
    	"greenyellow": [173, 255, 47],
    	"grey": [128, 128, 128],
    	"honeydew": [240, 255, 240],
    	"hotpink": [255, 105, 180],
    	"indianred": [205, 92, 92],
    	"indigo": [75, 0, 130],
    	"ivory": [255, 255, 240],
    	"khaki": [240, 230, 140],
    	"lavender": [230, 230, 250],
    	"lavenderblush": [255, 240, 245],
    	"lawngreen": [124, 252, 0],
    	"lemonchiffon": [255, 250, 205],
    	"lightblue": [173, 216, 230],
    	"lightcoral": [240, 128, 128],
    	"lightcyan": [224, 255, 255],
    	"lightgoldenrodyellow": [250, 250, 210],
    	"lightgray": [211, 211, 211],
    	"lightgreen": [144, 238, 144],
    	"lightgrey": [211, 211, 211],
    	"lightpink": [255, 182, 193],
    	"lightsalmon": [255, 160, 122],
    	"lightseagreen": [32, 178, 170],
    	"lightskyblue": [135, 206, 250],
    	"lightslategray": [119, 136, 153],
    	"lightslategrey": [119, 136, 153],
    	"lightsteelblue": [176, 196, 222],
    	"lightyellow": [255, 255, 224],
    	"lime": [0, 255, 0],
    	"limegreen": [50, 205, 50],
    	"linen": [250, 240, 230],
    	"magenta": [255, 0, 255],
    	"maroon": [128, 0, 0],
    	"mediumaquamarine": [102, 205, 170],
    	"mediumblue": [0, 0, 205],
    	"mediumorchid": [186, 85, 211],
    	"mediumpurple": [147, 112, 219],
    	"mediumseagreen": [60, 179, 113],
    	"mediumslateblue": [123, 104, 238],
    	"mediumspringgreen": [0, 250, 154],
    	"mediumturquoise": [72, 209, 204],
    	"mediumvioletred": [199, 21, 133],
    	"midnightblue": [25, 25, 112],
    	"mintcream": [245, 255, 250],
    	"mistyrose": [255, 228, 225],
    	"moccasin": [255, 228, 181],
    	"navajowhite": [255, 222, 173],
    	"navy": [0, 0, 128],
    	"oldlace": [253, 245, 230],
    	"olive": [128, 128, 0],
    	"olivedrab": [107, 142, 35],
    	"orange": [255, 165, 0],
    	"orangered": [255, 69, 0],
    	"orchid": [218, 112, 214],
    	"palegoldenrod": [238, 232, 170],
    	"palegreen": [152, 251, 152],
    	"paleturquoise": [175, 238, 238],
    	"palevioletred": [219, 112, 147],
    	"papayawhip": [255, 239, 213],
    	"peachpuff": [255, 218, 185],
    	"peru": [205, 133, 63],
    	"pink": [255, 192, 203],
    	"plum": [221, 160, 221],
    	"powderblue": [176, 224, 230],
    	"purple": [128, 0, 128],
    	"rebeccapurple": [102, 51, 153],
    	"red": [255, 0, 0],
    	"rosybrown": [188, 143, 143],
    	"royalblue": [65, 105, 225],
    	"saddlebrown": [139, 69, 19],
    	"salmon": [250, 128, 114],
    	"sandybrown": [244, 164, 96],
    	"seagreen": [46, 139, 87],
    	"seashell": [255, 245, 238],
    	"sienna": [160, 82, 45],
    	"silver": [192, 192, 192],
    	"skyblue": [135, 206, 235],
    	"slateblue": [106, 90, 205],
    	"slategray": [112, 128, 144],
    	"slategrey": [112, 128, 144],
    	"snow": [255, 250, 250],
    	"springgreen": [0, 255, 127],
    	"steelblue": [70, 130, 180],
    	"tan": [210, 180, 140],
    	"teal": [0, 128, 128],
    	"thistle": [216, 191, 216],
    	"tomato": [255, 99, 71],
    	"turquoise": [64, 224, 208],
    	"violet": [238, 130, 238],
    	"wheat": [245, 222, 179],
    	"white": [255, 255, 255],
    	"whitesmoke": [245, 245, 245],
    	"yellow": [255, 255, 0],
    	"yellowgreen": [154, 205, 50]
    };

    var isArrayish = function isArrayish(obj) {
    	if (!obj || typeof obj === 'string') {
    		return false;
    	}

    	return obj instanceof Array || Array.isArray(obj) ||
    		(obj.length >= 0 && (obj.splice instanceof Function ||
    			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
    };

    var simpleSwizzle = createCommonjsModule(function (module) {



    var concat = Array.prototype.concat;
    var slice = Array.prototype.slice;

    var swizzle = module.exports = function swizzle(args) {
    	var results = [];

    	for (var i = 0, len = args.length; i < len; i++) {
    		var arg = args[i];

    		if (isArrayish(arg)) {
    			// http://jsperf.com/javascript-array-concat-vs-push/98
    			results = concat.call(results, slice.call(arg));
    		} else {
    			results.push(arg);
    		}
    	}

    	return results;
    };

    swizzle.wrap = function (fn) {
    	return function () {
    		return fn(swizzle(arguments));
    	};
    };
    });

    /* MIT license */

    var colorString = createCommonjsModule(function (module) {
    var reverseNames = {};

    // create a list of reverse color names
    for (var name in colorName) {
    	if (colorName.hasOwnProperty(name)) {
    		reverseNames[colorName[name]] = name;
    	}
    }

    var cs = module.exports = {
    	to: {},
    	get: {}
    };

    cs.get = function (string) {
    	var prefix = string.substring(0, 3).toLowerCase();
    	var val;
    	var model;
    	switch (prefix) {
    		case 'hsl':
    			val = cs.get.hsl(string);
    			model = 'hsl';
    			break;
    		case 'hwb':
    			val = cs.get.hwb(string);
    			model = 'hwb';
    			break;
    		default:
    			val = cs.get.rgb(string);
    			model = 'rgb';
    			break;
    	}

    	if (!val) {
    		return null;
    	}

    	return {model: model, value: val};
    };

    cs.get.rgb = function (string) {
    	if (!string) {
    		return null;
    	}

    	var abbr = /^#([a-f0-9]{3,4})$/i;
    	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
    	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    	var keyword = /(\D+)/;

    	var rgb = [0, 0, 0, 1];
    	var match;
    	var i;
    	var hexAlpha;

    	if (match = string.match(hex)) {
    		hexAlpha = match[2];
    		match = match[1];

    		for (i = 0; i < 3; i++) {
    			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
    			var i2 = i * 2;
    			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
    		}

    		if (hexAlpha) {
    			rgb[3] = parseInt(hexAlpha, 16) / 255;
    		}
    	} else if (match = string.match(abbr)) {
    		match = match[1];
    		hexAlpha = match[3];

    		for (i = 0; i < 3; i++) {
    			rgb[i] = parseInt(match[i] + match[i], 16);
    		}

    		if (hexAlpha) {
    			rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
    		}
    	} else if (match = string.match(rgba)) {
    		for (i = 0; i < 3; i++) {
    			rgb[i] = parseInt(match[i + 1], 0);
    		}

    		if (match[4]) {
    			rgb[3] = parseFloat(match[4]);
    		}
    	} else if (match = string.match(per)) {
    		for (i = 0; i < 3; i++) {
    			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
    		}

    		if (match[4]) {
    			rgb[3] = parseFloat(match[4]);
    		}
    	} else if (match = string.match(keyword)) {
    		if (match[1] === 'transparent') {
    			return [0, 0, 0, 0];
    		}

    		rgb = colorName[match[1]];

    		if (!rgb) {
    			return null;
    		}

    		rgb[3] = 1;

    		return rgb;
    	} else {
    		return null;
    	}

    	for (i = 0; i < 3; i++) {
    		rgb[i] = clamp(rgb[i], 0, 255);
    	}
    	rgb[3] = clamp(rgb[3], 0, 1);

    	return rgb;
    };

    cs.get.hsl = function (string) {
    	if (!string) {
    		return null;
    	}

    	var hsl = /^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    	var match = string.match(hsl);

    	if (match) {
    		var alpha = parseFloat(match[4]);
    		var h = (parseFloat(match[1]) + 360) % 360;
    		var s = clamp(parseFloat(match[2]), 0, 100);
    		var l = clamp(parseFloat(match[3]), 0, 100);
    		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

    		return [h, s, l, a];
    	}

    	return null;
    };

    cs.get.hwb = function (string) {
    	if (!string) {
    		return null;
    	}

    	var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    	var match = string.match(hwb);

    	if (match) {
    		var alpha = parseFloat(match[4]);
    		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
    		var w = clamp(parseFloat(match[2]), 0, 100);
    		var b = clamp(parseFloat(match[3]), 0, 100);
    		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
    		return [h, w, b, a];
    	}

    	return null;
    };

    cs.to.hex = function () {
    	var rgba = simpleSwizzle(arguments);

    	return (
    		'#' +
    		hexDouble(rgba[0]) +
    		hexDouble(rgba[1]) +
    		hexDouble(rgba[2]) +
    		(rgba[3] < 1
    			? (hexDouble(Math.round(rgba[3] * 255)))
    			: '')
    	);
    };

    cs.to.rgb = function () {
    	var rgba = simpleSwizzle(arguments);

    	return rgba.length < 4 || rgba[3] === 1
    		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
    		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
    };

    cs.to.rgb.percent = function () {
    	var rgba = simpleSwizzle(arguments);

    	var r = Math.round(rgba[0] / 255 * 100);
    	var g = Math.round(rgba[1] / 255 * 100);
    	var b = Math.round(rgba[2] / 255 * 100);

    	return rgba.length < 4 || rgba[3] === 1
    		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
    		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
    };

    cs.to.hsl = function () {
    	var hsla = simpleSwizzle(arguments);
    	return hsla.length < 4 || hsla[3] === 1
    		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
    		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
    };

    // hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
    // (hwb have alpha optional & 1 is default value)
    cs.to.hwb = function () {
    	var hwba = simpleSwizzle(arguments);

    	var a = '';
    	if (hwba.length >= 4 && hwba[3] !== 1) {
    		a = ', ' + hwba[3];
    	}

    	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
    };

    cs.to.keyword = function (rgb) {
    	return reverseNames[rgb.slice(0, 3)];
    };

    // helpers
    function clamp(num, min, max) {
    	return Math.min(Math.max(min, num), max);
    }

    function hexDouble(num) {
    	var str = num.toString(16).toUpperCase();
    	return (str.length < 2) ? '0' + str : str;
    }
    });

    /* MIT license */

    var conversions = createCommonjsModule(function (module) {
    // NOTE: conversions should only return primitive values (i.e. arrays, or
    //       values that give correct `typeof` results).
    //       do not use box values types (i.e. Number(), String(), etc.)

    var reverseKeywords = {};
    for (var key in colorName) {
    	if (colorName.hasOwnProperty(key)) {
    		reverseKeywords[colorName[key]] = key;
    	}
    }

    var convert = module.exports = {
    	rgb: {channels: 3, labels: 'rgb'},
    	hsl: {channels: 3, labels: 'hsl'},
    	hsv: {channels: 3, labels: 'hsv'},
    	hwb: {channels: 3, labels: 'hwb'},
    	cmyk: {channels: 4, labels: 'cmyk'},
    	xyz: {channels: 3, labels: 'xyz'},
    	lab: {channels: 3, labels: 'lab'},
    	lch: {channels: 3, labels: 'lch'},
    	hex: {channels: 1, labels: ['hex']},
    	keyword: {channels: 1, labels: ['keyword']},
    	ansi16: {channels: 1, labels: ['ansi16']},
    	ansi256: {channels: 1, labels: ['ansi256']},
    	hcg: {channels: 3, labels: ['h', 'c', 'g']},
    	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
    	gray: {channels: 1, labels: ['gray']}
    };

    // hide .channels and .labels properties
    for (var model in convert) {
    	if (convert.hasOwnProperty(model)) {
    		if (!('channels' in convert[model])) {
    			throw new Error('missing channels property: ' + model);
    		}

    		if (!('labels' in convert[model])) {
    			throw new Error('missing channel labels property: ' + model);
    		}

    		if (convert[model].labels.length !== convert[model].channels) {
    			throw new Error('channel and label counts mismatch: ' + model);
    		}

    		var channels = convert[model].channels;
    		var labels = convert[model].labels;
    		delete convert[model].channels;
    		delete convert[model].labels;
    		Object.defineProperty(convert[model], 'channels', {value: channels});
    		Object.defineProperty(convert[model], 'labels', {value: labels});
    	}
    }

    convert.rgb.hsl = function (rgb) {
    	var r = rgb[0] / 255;
    	var g = rgb[1] / 255;
    	var b = rgb[2] / 255;
    	var min = Math.min(r, g, b);
    	var max = Math.max(r, g, b);
    	var delta = max - min;
    	var h;
    	var s;
    	var l;

    	if (max === min) {
    		h = 0;
    	} else if (r === max) {
    		h = (g - b) / delta;
    	} else if (g === max) {
    		h = 2 + (b - r) / delta;
    	} else if (b === max) {
    		h = 4 + (r - g) / delta;
    	}

    	h = Math.min(h * 60, 360);

    	if (h < 0) {
    		h += 360;
    	}

    	l = (min + max) / 2;

    	if (max === min) {
    		s = 0;
    	} else if (l <= 0.5) {
    		s = delta / (max + min);
    	} else {
    		s = delta / (2 - max - min);
    	}

    	return [h, s * 100, l * 100];
    };

    convert.rgb.hsv = function (rgb) {
    	var rdif;
    	var gdif;
    	var bdif;
    	var h;
    	var s;

    	var r = rgb[0] / 255;
    	var g = rgb[1] / 255;
    	var b = rgb[2] / 255;
    	var v = Math.max(r, g, b);
    	var diff = v - Math.min(r, g, b);
    	var diffc = function (c) {
    		return (v - c) / 6 / diff + 1 / 2;
    	};

    	if (diff === 0) {
    		h = s = 0;
    	} else {
    		s = diff / v;
    		rdif = diffc(r);
    		gdif = diffc(g);
    		bdif = diffc(b);

    		if (r === v) {
    			h = bdif - gdif;
    		} else if (g === v) {
    			h = (1 / 3) + rdif - bdif;
    		} else if (b === v) {
    			h = (2 / 3) + gdif - rdif;
    		}
    		if (h < 0) {
    			h += 1;
    		} else if (h > 1) {
    			h -= 1;
    		}
    	}

    	return [
    		h * 360,
    		s * 100,
    		v * 100
    	];
    };

    convert.rgb.hwb = function (rgb) {
    	var r = rgb[0];
    	var g = rgb[1];
    	var b = rgb[2];
    	var h = convert.rgb.hsl(rgb)[0];
    	var w = 1 / 255 * Math.min(r, Math.min(g, b));

    	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

    	return [h, w * 100, b * 100];
    };

    convert.rgb.cmyk = function (rgb) {
    	var r = rgb[0] / 255;
    	var g = rgb[1] / 255;
    	var b = rgb[2] / 255;
    	var c;
    	var m;
    	var y;
    	var k;

    	k = Math.min(1 - r, 1 - g, 1 - b);
    	c = (1 - r - k) / (1 - k) || 0;
    	m = (1 - g - k) / (1 - k) || 0;
    	y = (1 - b - k) / (1 - k) || 0;

    	return [c * 100, m * 100, y * 100, k * 100];
    };

    /**
     * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
     * */
    function comparativeDistance(x, y) {
    	return (
    		Math.pow(x[0] - y[0], 2) +
    		Math.pow(x[1] - y[1], 2) +
    		Math.pow(x[2] - y[2], 2)
    	);
    }

    convert.rgb.keyword = function (rgb) {
    	var reversed = reverseKeywords[rgb];
    	if (reversed) {
    		return reversed;
    	}

    	var currentClosestDistance = Infinity;
    	var currentClosestKeyword;

    	for (var keyword in colorName) {
    		if (colorName.hasOwnProperty(keyword)) {
    			var value = colorName[keyword];

    			// Compute comparative distance
    			var distance = comparativeDistance(rgb, value);

    			// Check if its less, if so set as closest
    			if (distance < currentClosestDistance) {
    				currentClosestDistance = distance;
    				currentClosestKeyword = keyword;
    			}
    		}
    	}

    	return currentClosestKeyword;
    };

    convert.keyword.rgb = function (keyword) {
    	return colorName[keyword];
    };

    convert.rgb.xyz = function (rgb) {
    	var r = rgb[0] / 255;
    	var g = rgb[1] / 255;
    	var b = rgb[2] / 255;

    	// assume sRGB
    	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
    	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
    	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

    	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
    	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
    	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

    	return [x * 100, y * 100, z * 100];
    };

    convert.rgb.lab = function (rgb) {
    	var xyz = convert.rgb.xyz(rgb);
    	var x = xyz[0];
    	var y = xyz[1];
    	var z = xyz[2];
    	var l;
    	var a;
    	var b;

    	x /= 95.047;
    	y /= 100;
    	z /= 108.883;

    	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
    	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
    	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

    	l = (116 * y) - 16;
    	a = 500 * (x - y);
    	b = 200 * (y - z);

    	return [l, a, b];
    };

    convert.hsl.rgb = function (hsl) {
    	var h = hsl[0] / 360;
    	var s = hsl[1] / 100;
    	var l = hsl[2] / 100;
    	var t1;
    	var t2;
    	var t3;
    	var rgb;
    	var val;

    	if (s === 0) {
    		val = l * 255;
    		return [val, val, val];
    	}

    	if (l < 0.5) {
    		t2 = l * (1 + s);
    	} else {
    		t2 = l + s - l * s;
    	}

    	t1 = 2 * l - t2;

    	rgb = [0, 0, 0];
    	for (var i = 0; i < 3; i++) {
    		t3 = h + 1 / 3 * -(i - 1);
    		if (t3 < 0) {
    			t3++;
    		}
    		if (t3 > 1) {
    			t3--;
    		}

    		if (6 * t3 < 1) {
    			val = t1 + (t2 - t1) * 6 * t3;
    		} else if (2 * t3 < 1) {
    			val = t2;
    		} else if (3 * t3 < 2) {
    			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    		} else {
    			val = t1;
    		}

    		rgb[i] = val * 255;
    	}

    	return rgb;
    };

    convert.hsl.hsv = function (hsl) {
    	var h = hsl[0];
    	var s = hsl[1] / 100;
    	var l = hsl[2] / 100;
    	var smin = s;
    	var lmin = Math.max(l, 0.01);
    	var sv;
    	var v;

    	l *= 2;
    	s *= (l <= 1) ? l : 2 - l;
    	smin *= lmin <= 1 ? lmin : 2 - lmin;
    	v = (l + s) / 2;
    	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

    	return [h, sv * 100, v * 100];
    };

    convert.hsv.rgb = function (hsv) {
    	var h = hsv[0] / 60;
    	var s = hsv[1] / 100;
    	var v = hsv[2] / 100;
    	var hi = Math.floor(h) % 6;

    	var f = h - Math.floor(h);
    	var p = 255 * v * (1 - s);
    	var q = 255 * v * (1 - (s * f));
    	var t = 255 * v * (1 - (s * (1 - f)));
    	v *= 255;

    	switch (hi) {
    		case 0:
    			return [v, t, p];
    		case 1:
    			return [q, v, p];
    		case 2:
    			return [p, v, t];
    		case 3:
    			return [p, q, v];
    		case 4:
    			return [t, p, v];
    		case 5:
    			return [v, p, q];
    	}
    };

    convert.hsv.hsl = function (hsv) {
    	var h = hsv[0];
    	var s = hsv[1] / 100;
    	var v = hsv[2] / 100;
    	var vmin = Math.max(v, 0.01);
    	var lmin;
    	var sl;
    	var l;

    	l = (2 - s) * v;
    	lmin = (2 - s) * vmin;
    	sl = s * vmin;
    	sl /= (lmin <= 1) ? lmin : 2 - lmin;
    	sl = sl || 0;
    	l /= 2;

    	return [h, sl * 100, l * 100];
    };

    // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
    convert.hwb.rgb = function (hwb) {
    	var h = hwb[0] / 360;
    	var wh = hwb[1] / 100;
    	var bl = hwb[2] / 100;
    	var ratio = wh + bl;
    	var i;
    	var v;
    	var f;
    	var n;

    	// wh + bl cant be > 1
    	if (ratio > 1) {
    		wh /= ratio;
    		bl /= ratio;
    	}

    	i = Math.floor(6 * h);
    	v = 1 - bl;
    	f = 6 * h - i;

    	if ((i & 0x01) !== 0) {
    		f = 1 - f;
    	}

    	n = wh + f * (v - wh); // linear interpolation

    	var r;
    	var g;
    	var b;
    	switch (i) {
    		default:
    		case 6:
    		case 0: r = v; g = n; b = wh; break;
    		case 1: r = n; g = v; b = wh; break;
    		case 2: r = wh; g = v; b = n; break;
    		case 3: r = wh; g = n; b = v; break;
    		case 4: r = n; g = wh; b = v; break;
    		case 5: r = v; g = wh; b = n; break;
    	}

    	return [r * 255, g * 255, b * 255];
    };

    convert.cmyk.rgb = function (cmyk) {
    	var c = cmyk[0] / 100;
    	var m = cmyk[1] / 100;
    	var y = cmyk[2] / 100;
    	var k = cmyk[3] / 100;
    	var r;
    	var g;
    	var b;

    	r = 1 - Math.min(1, c * (1 - k) + k);
    	g = 1 - Math.min(1, m * (1 - k) + k);
    	b = 1 - Math.min(1, y * (1 - k) + k);

    	return [r * 255, g * 255, b * 255];
    };

    convert.xyz.rgb = function (xyz) {
    	var x = xyz[0] / 100;
    	var y = xyz[1] / 100;
    	var z = xyz[2] / 100;
    	var r;
    	var g;
    	var b;

    	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
    	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
    	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

    	// assume sRGB
    	r = r > 0.0031308
    		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    		: r * 12.92;

    	g = g > 0.0031308
    		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    		: g * 12.92;

    	b = b > 0.0031308
    		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    		: b * 12.92;

    	r = Math.min(Math.max(0, r), 1);
    	g = Math.min(Math.max(0, g), 1);
    	b = Math.min(Math.max(0, b), 1);

    	return [r * 255, g * 255, b * 255];
    };

    convert.xyz.lab = function (xyz) {
    	var x = xyz[0];
    	var y = xyz[1];
    	var z = xyz[2];
    	var l;
    	var a;
    	var b;

    	x /= 95.047;
    	y /= 100;
    	z /= 108.883;

    	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
    	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
    	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

    	l = (116 * y) - 16;
    	a = 500 * (x - y);
    	b = 200 * (y - z);

    	return [l, a, b];
    };

    convert.lab.xyz = function (lab) {
    	var l = lab[0];
    	var a = lab[1];
    	var b = lab[2];
    	var x;
    	var y;
    	var z;

    	y = (l + 16) / 116;
    	x = a / 500 + y;
    	z = y - b / 200;

    	var y2 = Math.pow(y, 3);
    	var x2 = Math.pow(x, 3);
    	var z2 = Math.pow(z, 3);
    	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
    	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
    	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

    	x *= 95.047;
    	y *= 100;
    	z *= 108.883;

    	return [x, y, z];
    };

    convert.lab.lch = function (lab) {
    	var l = lab[0];
    	var a = lab[1];
    	var b = lab[2];
    	var hr;
    	var h;
    	var c;

    	hr = Math.atan2(b, a);
    	h = hr * 360 / 2 / Math.PI;

    	if (h < 0) {
    		h += 360;
    	}

    	c = Math.sqrt(a * a + b * b);

    	return [l, c, h];
    };

    convert.lch.lab = function (lch) {
    	var l = lch[0];
    	var c = lch[1];
    	var h = lch[2];
    	var a;
    	var b;
    	var hr;

    	hr = h / 360 * 2 * Math.PI;
    	a = c * Math.cos(hr);
    	b = c * Math.sin(hr);

    	return [l, a, b];
    };

    convert.rgb.ansi16 = function (args) {
    	var r = args[0];
    	var g = args[1];
    	var b = args[2];
    	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

    	value = Math.round(value / 50);

    	if (value === 0) {
    		return 30;
    	}

    	var ansi = 30
    		+ ((Math.round(b / 255) << 2)
    		| (Math.round(g / 255) << 1)
    		| Math.round(r / 255));

    	if (value === 2) {
    		ansi += 60;
    	}

    	return ansi;
    };

    convert.hsv.ansi16 = function (args) {
    	// optimization here; we already know the value and don't need to get
    	// it converted for us.
    	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };

    convert.rgb.ansi256 = function (args) {
    	var r = args[0];
    	var g = args[1];
    	var b = args[2];

    	// we use the extended greyscale palette here, with the exception of
    	// black and white. normal palette only has 4 greyscale shades.
    	if (r === g && g === b) {
    		if (r < 8) {
    			return 16;
    		}

    		if (r > 248) {
    			return 231;
    		}

    		return Math.round(((r - 8) / 247) * 24) + 232;
    	}

    	var ansi = 16
    		+ (36 * Math.round(r / 255 * 5))
    		+ (6 * Math.round(g / 255 * 5))
    		+ Math.round(b / 255 * 5);

    	return ansi;
    };

    convert.ansi16.rgb = function (args) {
    	var color = args % 10;

    	// handle greyscale
    	if (color === 0 || color === 7) {
    		if (args > 50) {
    			color += 3.5;
    		}

    		color = color / 10.5 * 255;

    		return [color, color, color];
    	}

    	var mult = (~~(args > 50) + 1) * 0.5;
    	var r = ((color & 1) * mult) * 255;
    	var g = (((color >> 1) & 1) * mult) * 255;
    	var b = (((color >> 2) & 1) * mult) * 255;

    	return [r, g, b];
    };

    convert.ansi256.rgb = function (args) {
    	// handle greyscale
    	if (args >= 232) {
    		var c = (args - 232) * 10 + 8;
    		return [c, c, c];
    	}

    	args -= 16;

    	var rem;
    	var r = Math.floor(args / 36) / 5 * 255;
    	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
    	var b = (rem % 6) / 5 * 255;

    	return [r, g, b];
    };

    convert.rgb.hex = function (args) {
    	var integer = ((Math.round(args[0]) & 0xFF) << 16)
    		+ ((Math.round(args[1]) & 0xFF) << 8)
    		+ (Math.round(args[2]) & 0xFF);

    	var string = integer.toString(16).toUpperCase();
    	return '000000'.substring(string.length) + string;
    };

    convert.hex.rgb = function (args) {
    	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    	if (!match) {
    		return [0, 0, 0];
    	}

    	var colorString = match[0];

    	if (match[0].length === 3) {
    		colorString = colorString.split('').map(function (char) {
    			return char + char;
    		}).join('');
    	}

    	var integer = parseInt(colorString, 16);
    	var r = (integer >> 16) & 0xFF;
    	var g = (integer >> 8) & 0xFF;
    	var b = integer & 0xFF;

    	return [r, g, b];
    };

    convert.rgb.hcg = function (rgb) {
    	var r = rgb[0] / 255;
    	var g = rgb[1] / 255;
    	var b = rgb[2] / 255;
    	var max = Math.max(Math.max(r, g), b);
    	var min = Math.min(Math.min(r, g), b);
    	var chroma = (max - min);
    	var grayscale;
    	var hue;

    	if (chroma < 1) {
    		grayscale = min / (1 - chroma);
    	} else {
    		grayscale = 0;
    	}

    	if (chroma <= 0) {
    		hue = 0;
    	} else
    	if (max === r) {
    		hue = ((g - b) / chroma) % 6;
    	} else
    	if (max === g) {
    		hue = 2 + (b - r) / chroma;
    	} else {
    		hue = 4 + (r - g) / chroma + 4;
    	}

    	hue /= 6;
    	hue %= 1;

    	return [hue * 360, chroma * 100, grayscale * 100];
    };

    convert.hsl.hcg = function (hsl) {
    	var s = hsl[1] / 100;
    	var l = hsl[2] / 100;
    	var c = 1;
    	var f = 0;

    	if (l < 0.5) {
    		c = 2.0 * s * l;
    	} else {
    		c = 2.0 * s * (1.0 - l);
    	}

    	if (c < 1.0) {
    		f = (l - 0.5 * c) / (1.0 - c);
    	}

    	return [hsl[0], c * 100, f * 100];
    };

    convert.hsv.hcg = function (hsv) {
    	var s = hsv[1] / 100;
    	var v = hsv[2] / 100;

    	var c = s * v;
    	var f = 0;

    	if (c < 1.0) {
    		f = (v - c) / (1 - c);
    	}

    	return [hsv[0], c * 100, f * 100];
    };

    convert.hcg.rgb = function (hcg) {
    	var h = hcg[0] / 360;
    	var c = hcg[1] / 100;
    	var g = hcg[2] / 100;

    	if (c === 0.0) {
    		return [g * 255, g * 255, g * 255];
    	}

    	var pure = [0, 0, 0];
    	var hi = (h % 1) * 6;
    	var v = hi % 1;
    	var w = 1 - v;
    	var mg = 0;

    	switch (Math.floor(hi)) {
    		case 0:
    			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
    		case 1:
    			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
    		case 2:
    			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
    		case 3:
    			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
    		case 4:
    			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
    		default:
    			pure[0] = 1; pure[1] = 0; pure[2] = w;
    	}

    	mg = (1.0 - c) * g;

    	return [
    		(c * pure[0] + mg) * 255,
    		(c * pure[1] + mg) * 255,
    		(c * pure[2] + mg) * 255
    	];
    };

    convert.hcg.hsv = function (hcg) {
    	var c = hcg[1] / 100;
    	var g = hcg[2] / 100;

    	var v = c + g * (1.0 - c);
    	var f = 0;

    	if (v > 0.0) {
    		f = c / v;
    	}

    	return [hcg[0], f * 100, v * 100];
    };

    convert.hcg.hsl = function (hcg) {
    	var c = hcg[1] / 100;
    	var g = hcg[2] / 100;

    	var l = g * (1.0 - c) + 0.5 * c;
    	var s = 0;

    	if (l > 0.0 && l < 0.5) {
    		s = c / (2 * l);
    	} else
    	if (l >= 0.5 && l < 1.0) {
    		s = c / (2 * (1 - l));
    	}

    	return [hcg[0], s * 100, l * 100];
    };

    convert.hcg.hwb = function (hcg) {
    	var c = hcg[1] / 100;
    	var g = hcg[2] / 100;
    	var v = c + g * (1.0 - c);
    	return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };

    convert.hwb.hcg = function (hwb) {
    	var w = hwb[1] / 100;
    	var b = hwb[2] / 100;
    	var v = 1 - b;
    	var c = v - w;
    	var g = 0;

    	if (c < 1) {
    		g = (v - c) / (1 - c);
    	}

    	return [hwb[0], c * 100, g * 100];
    };

    convert.apple.rgb = function (apple) {
    	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
    };

    convert.rgb.apple = function (rgb) {
    	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
    };

    convert.gray.rgb = function (args) {
    	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };

    convert.gray.hsl = convert.gray.hsv = function (args) {
    	return [0, 0, args[0]];
    };

    convert.gray.hwb = function (gray) {
    	return [0, 100, gray[0]];
    };

    convert.gray.cmyk = function (gray) {
    	return [0, 0, 0, gray[0]];
    };

    convert.gray.lab = function (gray) {
    	return [gray[0], 0, 0];
    };

    convert.gray.hex = function (gray) {
    	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
    	var integer = (val << 16) + (val << 8) + val;

    	var string = integer.toString(16).toUpperCase();
    	return '000000'.substring(string.length) + string;
    };

    convert.rgb.gray = function (rgb) {
    	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
    	return [val / 255 * 100];
    };
    });

    /*
    	this function routes a model to all other models.

    	all functions that are routed have a property `.conversion` attached
    	to the returned synthetic function. This property is an array
    	of strings, each with the steps in between the 'from' and 'to'
    	color models (inclusive).

    	conversions that are not possible simply are not included.
    */

    function buildGraph() {
    	var graph = {};
    	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
    	var models = Object.keys(conversions);

    	for (var len = models.length, i = 0; i < len; i++) {
    		graph[models[i]] = {
    			// http://jsperf.com/1-vs-infinity
    			// micro-opt, but this is simple.
    			distance: -1,
    			parent: null
    		};
    	}

    	return graph;
    }

    // https://en.wikipedia.org/wiki/Breadth-first_search
    function deriveBFS(fromModel) {
    	var graph = buildGraph();
    	var queue = [fromModel]; // unshift -> queue -> pop

    	graph[fromModel].distance = 0;

    	while (queue.length) {
    		var current = queue.pop();
    		var adjacents = Object.keys(conversions[current]);

    		for (var len = adjacents.length, i = 0; i < len; i++) {
    			var adjacent = adjacents[i];
    			var node = graph[adjacent];

    			if (node.distance === -1) {
    				node.distance = graph[current].distance + 1;
    				node.parent = current;
    				queue.unshift(adjacent);
    			}
    		}
    	}

    	return graph;
    }

    function link(from, to) {
    	return function (args) {
    		return to(from(args));
    	};
    }

    function wrapConversion(toModel, graph) {
    	var path = [graph[toModel].parent, toModel];
    	var fn = conversions[graph[toModel].parent][toModel];

    	var cur = graph[toModel].parent;
    	while (graph[cur].parent) {
    		path.unshift(graph[cur].parent);
    		fn = link(conversions[graph[cur].parent][cur], fn);
    		cur = graph[cur].parent;
    	}

    	fn.conversion = path;
    	return fn;
    }

    var route = function (fromModel) {
    	var graph = deriveBFS(fromModel);
    	var conversion = {};

    	var models = Object.keys(graph);
    	for (var len = models.length, i = 0; i < len; i++) {
    		var toModel = models[i];
    		var node = graph[toModel];

    		if (node.parent === null) {
    			// no possible conversion, or this node is the source model.
    			continue;
    		}

    		conversion[toModel] = wrapConversion(toModel, graph);
    	}

    	return conversion;
    };

    var convert = {};

    var models = Object.keys(conversions);

    function wrapRaw(fn) {
    	var wrappedFn = function (args) {
    		if (args === undefined || args === null) {
    			return args;
    		}

    		if (arguments.length > 1) {
    			args = Array.prototype.slice.call(arguments);
    		}

    		return fn(args);
    	};

    	// preserve .conversion property if there is one
    	if ('conversion' in fn) {
    		wrappedFn.conversion = fn.conversion;
    	}

    	return wrappedFn;
    }

    function wrapRounded(fn) {
    	var wrappedFn = function (args) {
    		if (args === undefined || args === null) {
    			return args;
    		}

    		if (arguments.length > 1) {
    			args = Array.prototype.slice.call(arguments);
    		}

    		var result = fn(args);

    		// we're assuming the result is an array here.
    		// see notice in conversions.js; don't use box types
    		// in conversion functions.
    		if (typeof result === 'object') {
    			for (var len = result.length, i = 0; i < len; i++) {
    				result[i] = Math.round(result[i]);
    			}
    		}

    		return result;
    	};

    	// preserve .conversion property if there is one
    	if ('conversion' in fn) {
    		wrappedFn.conversion = fn.conversion;
    	}

    	return wrappedFn;
    }

    models.forEach(function (fromModel) {
    	convert[fromModel] = {};

    	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
    	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

    	var routes = route(fromModel);
    	var routeModels = Object.keys(routes);

    	routeModels.forEach(function (toModel) {
    		var fn = routes[toModel];

    		convert[fromModel][toModel] = wrapRounded(fn);
    		convert[fromModel][toModel].raw = wrapRaw(fn);
    	});
    });

    var colorConvert = convert;

    var _slice = [].slice;

    var skippedModels = [
    	// to be honest, I don't really feel like keyword belongs in color convert, but eh.
    	'keyword',

    	// gray conflicts with some method names, and has its own method defined.
    	'gray',

    	// shouldn't really be in color-convert either...
    	'hex'
    ];

    var hashedModelKeys = {};
    Object.keys(colorConvert).forEach(function (model) {
    	hashedModelKeys[_slice.call(colorConvert[model].labels).sort().join('')] = model;
    });

    var limiters = {};

    function Color(obj, model) {
    	if (!(this instanceof Color)) {
    		return new Color(obj, model);
    	}

    	if (model && model in skippedModels) {
    		model = null;
    	}

    	if (model && !(model in colorConvert)) {
    		throw new Error('Unknown model: ' + model);
    	}

    	var i;
    	var channels;

    	if (obj == null) { // eslint-disable-line no-eq-null,eqeqeq
    		this.model = 'rgb';
    		this.color = [0, 0, 0];
    		this.valpha = 1;
    	} else if (obj instanceof Color) {
    		this.model = obj.model;
    		this.color = obj.color.slice();
    		this.valpha = obj.valpha;
    	} else if (typeof obj === 'string') {
    		var result = colorString.get(obj);
    		if (result === null) {
    			throw new Error('Unable to parse color from string: ' + obj);
    		}

    		this.model = result.model;
    		channels = colorConvert[this.model].channels;
    		this.color = result.value.slice(0, channels);
    		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
    	} else if (obj.length) {
    		this.model = model || 'rgb';
    		channels = colorConvert[this.model].channels;
    		var newArr = _slice.call(obj, 0, channels);
    		this.color = zeroArray(newArr, channels);
    		this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
    	} else if (typeof obj === 'number') {
    		// this is always RGB - can be converted later on.
    		obj &= 0xFFFFFF;
    		this.model = 'rgb';
    		this.color = [
    			(obj >> 16) & 0xFF,
    			(obj >> 8) & 0xFF,
    			obj & 0xFF
    		];
    		this.valpha = 1;
    	} else {
    		this.valpha = 1;

    		var keys = Object.keys(obj);
    		if ('alpha' in obj) {
    			keys.splice(keys.indexOf('alpha'), 1);
    			this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
    		}

    		var hashedKeys = keys.sort().join('');
    		if (!(hashedKeys in hashedModelKeys)) {
    			throw new Error('Unable to parse color from object: ' + JSON.stringify(obj));
    		}

    		this.model = hashedModelKeys[hashedKeys];

    		var labels = colorConvert[this.model].labels;
    		var color = [];
    		for (i = 0; i < labels.length; i++) {
    			color.push(obj[labels[i]]);
    		}

    		this.color = zeroArray(color);
    	}

    	// perform limitations (clamping, etc.)
    	if (limiters[this.model]) {
    		channels = colorConvert[this.model].channels;
    		for (i = 0; i < channels; i++) {
    			var limit = limiters[this.model][i];
    			if (limit) {
    				this.color[i] = limit(this.color[i]);
    			}
    		}
    	}

    	this.valpha = Math.max(0, Math.min(1, this.valpha));

    	if (Object.freeze) {
    		Object.freeze(this);
    	}
    }

    Color.prototype = {
    	toString: function () {
    		return this.string();
    	},

    	toJSON: function () {
    		return this[this.model]();
    	},

    	string: function (places) {
    		var self = this.model in colorString.to ? this : this.rgb();
    		self = self.round(typeof places === 'number' ? places : 1);
    		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
    		return colorString.to[self.model](args);
    	},

    	percentString: function (places) {
    		var self = this.rgb().round(typeof places === 'number' ? places : 1);
    		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
    		return colorString.to.rgb.percent(args);
    	},

    	array: function () {
    		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
    	},

    	object: function () {
    		var result = {};
    		var channels = colorConvert[this.model].channels;
    		var labels = colorConvert[this.model].labels;

    		for (var i = 0; i < channels; i++) {
    			result[labels[i]] = this.color[i];
    		}

    		if (this.valpha !== 1) {
    			result.alpha = this.valpha;
    		}

    		return result;
    	},

    	unitArray: function () {
    		var rgb = this.rgb().color;
    		rgb[0] /= 255;
    		rgb[1] /= 255;
    		rgb[2] /= 255;

    		if (this.valpha !== 1) {
    			rgb.push(this.valpha);
    		}

    		return rgb;
    	},

    	unitObject: function () {
    		var rgb = this.rgb().object();
    		rgb.r /= 255;
    		rgb.g /= 255;
    		rgb.b /= 255;

    		if (this.valpha !== 1) {
    			rgb.alpha = this.valpha;
    		}

    		return rgb;
    	},

    	round: function (places) {
    		places = Math.max(places || 0, 0);
    		return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
    	},

    	alpha: function (val) {
    		if (arguments.length) {
    			return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
    		}

    		return this.valpha;
    	},

    	// rgb
    	red: getset('rgb', 0, maxfn(255)),
    	green: getset('rgb', 1, maxfn(255)),
    	blue: getset('rgb', 2, maxfn(255)),

    	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) { return ((val % 360) + 360) % 360; }), // eslint-disable-line brace-style

    	saturationl: getset('hsl', 1, maxfn(100)),
    	lightness: getset('hsl', 2, maxfn(100)),

    	saturationv: getset('hsv', 1, maxfn(100)),
    	value: getset('hsv', 2, maxfn(100)),

    	chroma: getset('hcg', 1, maxfn(100)),
    	gray: getset('hcg', 2, maxfn(100)),

    	white: getset('hwb', 1, maxfn(100)),
    	wblack: getset('hwb', 2, maxfn(100)),

    	cyan: getset('cmyk', 0, maxfn(100)),
    	magenta: getset('cmyk', 1, maxfn(100)),
    	yellow: getset('cmyk', 2, maxfn(100)),
    	black: getset('cmyk', 3, maxfn(100)),

    	x: getset('xyz', 0, maxfn(100)),
    	y: getset('xyz', 1, maxfn(100)),
    	z: getset('xyz', 2, maxfn(100)),

    	l: getset('lab', 0, maxfn(100)),
    	a: getset('lab', 1),
    	b: getset('lab', 2),

    	keyword: function (val) {
    		if (arguments.length) {
    			return new Color(val);
    		}

    		return colorConvert[this.model].keyword(this.color);
    	},

    	hex: function (val) {
    		if (arguments.length) {
    			return new Color(val);
    		}

    		return colorString.to.hex(this.rgb().round().color);
    	},

    	rgbNumber: function () {
    		var rgb = this.rgb().color;
    		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
    	},

    	luminosity: function () {
    		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
    		var rgb = this.rgb().color;

    		var lum = [];
    		for (var i = 0; i < rgb.length; i++) {
    			var chan = rgb[i] / 255;
    			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
    		}

    		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
    	},

    	contrast: function (color2) {
    		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
    		var lum1 = this.luminosity();
    		var lum2 = color2.luminosity();

    		if (lum1 > lum2) {
    			return (lum1 + 0.05) / (lum2 + 0.05);
    		}

    		return (lum2 + 0.05) / (lum1 + 0.05);
    	},

    	level: function (color2) {
    		var contrastRatio = this.contrast(color2);
    		if (contrastRatio >= 7.1) {
    			return 'AAA';
    		}

    		return (contrastRatio >= 4.5) ? 'AA' : '';
    	},

    	isDark: function () {
    		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
    		var rgb = this.rgb().color;
    		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    		return yiq < 128;
    	},

    	isLight: function () {
    		return !this.isDark();
    	},

    	negate: function () {
    		var rgb = this.rgb();
    		for (var i = 0; i < 3; i++) {
    			rgb.color[i] = 255 - rgb.color[i];
    		}
    		return rgb;
    	},

    	lighten: function (ratio) {
    		var hsl = this.hsl();
    		hsl.color[2] += hsl.color[2] * ratio;
    		return hsl;
    	},

    	darken: function (ratio) {
    		var hsl = this.hsl();
    		hsl.color[2] -= hsl.color[2] * ratio;
    		return hsl;
    	},

    	saturate: function (ratio) {
    		var hsl = this.hsl();
    		hsl.color[1] += hsl.color[1] * ratio;
    		return hsl;
    	},

    	desaturate: function (ratio) {
    		var hsl = this.hsl();
    		hsl.color[1] -= hsl.color[1] * ratio;
    		return hsl;
    	},

    	whiten: function (ratio) {
    		var hwb = this.hwb();
    		hwb.color[1] += hwb.color[1] * ratio;
    		return hwb;
    	},

    	blacken: function (ratio) {
    		var hwb = this.hwb();
    		hwb.color[2] += hwb.color[2] * ratio;
    		return hwb;
    	},

    	grayscale: function () {
    		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
    		var rgb = this.rgb().color;
    		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
    		return Color.rgb(val, val, val);
    	},

    	fade: function (ratio) {
    		return this.alpha(this.valpha - (this.valpha * ratio));
    	},

    	opaquer: function (ratio) {
    		return this.alpha(this.valpha + (this.valpha * ratio));
    	},

    	rotate: function (degrees) {
    		var hsl = this.hsl();
    		var hue = hsl.color[0];
    		hue = (hue + degrees) % 360;
    		hue = hue < 0 ? 360 + hue : hue;
    		hsl.color[0] = hue;
    		return hsl;
    	},

    	mix: function (mixinColor, weight) {
    		// ported from sass implementation in C
    		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
    		if (!mixinColor || !mixinColor.rgb) {
    			throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
    		}
    		var color1 = mixinColor.rgb();
    		var color2 = this.rgb();
    		var p = weight === undefined ? 0.5 : weight;

    		var w = 2 * p - 1;
    		var a = color1.alpha() - color2.alpha();

    		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    		var w2 = 1 - w1;

    		return Color.rgb(
    				w1 * color1.red() + w2 * color2.red(),
    				w1 * color1.green() + w2 * color2.green(),
    				w1 * color1.blue() + w2 * color2.blue(),
    				color1.alpha() * p + color2.alpha() * (1 - p));
    	}
    };

    // model conversion methods and static constructors
    Object.keys(colorConvert).forEach(function (model) {
    	if (skippedModels.indexOf(model) !== -1) {
    		return;
    	}

    	var channels = colorConvert[model].channels;

    	// conversion methods
    	Color.prototype[model] = function () {
    		if (this.model === model) {
    			return new Color(this);
    		}

    		if (arguments.length) {
    			return new Color(arguments, model);
    		}

    		var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
    		return new Color(assertArray(colorConvert[this.model][model].raw(this.color)).concat(newAlpha), model);
    	};

    	// 'static' construction methods
    	Color[model] = function (color) {
    		if (typeof color === 'number') {
    			color = zeroArray(_slice.call(arguments), channels);
    		}
    		return new Color(color, model);
    	};
    });

    function roundTo(num, places) {
    	return Number(num.toFixed(places));
    }

    function roundToPlace(places) {
    	return function (num) {
    		return roundTo(num, places);
    	};
    }

    function getset(model, channel, modifier) {
    	model = Array.isArray(model) ? model : [model];

    	model.forEach(function (m) {
    		(limiters[m] || (limiters[m] = []))[channel] = modifier;
    	});

    	model = model[0];

    	return function (val) {
    		var result;

    		if (arguments.length) {
    			if (modifier) {
    				val = modifier(val);
    			}

    			result = this[model]();
    			result.color[channel] = val;
    			return result;
    		}

    		result = this[model]().color[channel];
    		if (modifier) {
    			result = modifier(result);
    		}

    		return result;
    	};
    }

    function maxfn(max) {
    	return function (v) {
    		return Math.max(0, Math.min(max, v));
    	};
    }

    function assertArray(val) {
    	return Array.isArray(val) ? val : [val];
    }

    function zeroArray(arr, length) {
    	for (var i = 0; i < length; i++) {
    		if (typeof arr[i] !== 'number') {
    			arr[i] = 0;
    		}
    	}

    	return arr;
    }

    var color = Color;

    /* src/common-frame.svelte generated by Svelte v3.32.1 */
    const file = "src/common-frame.svelte";

    // (39:4) {#if title}
    function create_if_block_1(ctx) {
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(h2, "class", "svelte-1pgvz7t");
    			add_location(h2, file, 39, 6, 1047);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (42:4) {#if subtitle}
    function create_if_block(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(/*subtitle*/ ctx[1]);
    			attr_dev(h3, "class", "svelte-1pgvz7t");
    			add_location(h3, file, 42, 6, 1099);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*subtitle*/ 2) set_data_dev(t, /*subtitle*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(42:4) {#if subtitle}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let section;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block0 = /*title*/ ctx[0] && create_if_block_1(ctx);
    	let if_block1 = /*subtitle*/ ctx[1] && create_if_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "title-bar svelte-1pgvz7t");
    			add_location(div0, file, 37, 2, 1001);
    			attr_dev(div1, "class", "padding svelte-1pgvz7t");
    			add_location(div1, file, 45, 2, 1140);
    			attr_dev(section, "id", /*id*/ ctx[3]);
    			set_style(section, "--themeColor", /*themeColor*/ ctx[2]);
    			set_style(section, "--backgroundColor", /*backgroundColor*/ ctx[4]);
    			set_style(section, "--textColor", /*textColor*/ ctx[5]);
    			attr_dev(section, "class", "svelte-1pgvz7t");
    			add_location(section, file, 36, 0, 882);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(section, t1);
    			append_dev(section, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*subtitle*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 128) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*id*/ 8) {
    				attr_dev(section, "id", /*id*/ ctx[3]);
    			}

    			if (!current || dirty & /*themeColor*/ 4) {
    				set_style(section, "--themeColor", /*themeColor*/ ctx[2]);
    			}

    			if (!current || dirty & /*backgroundColor*/ 16) {
    				set_style(section, "--backgroundColor", /*backgroundColor*/ ctx[4]);
    			}

    			if (!current || dirty & /*textColor*/ 32) {
    				set_style(section, "--textColor", /*textColor*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let backgroundColor;
    	let textColor;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Common_frame", slots, ['default']);

    	let { title } = $$props,
    		{ subtitle } = $$props,
    		{ themeColor } = $$props,
    		{ id } = $$props,
    		{ globalSettings } = $$props;

    	const writable_props = ["title", "subtitle", "themeColor", "id", "globalSettings"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Common_frame> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("themeColor" in $$props) $$invalidate(2, themeColor = $$props.themeColor);
    		if ("id" in $$props) $$invalidate(3, id = $$props.id);
    		if ("globalSettings" in $$props) $$invalidate(6, globalSettings = $$props.globalSettings);
    		if ("$$scope" in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Color: color,
    		title,
    		subtitle,
    		themeColor,
    		id,
    		globalSettings,
    		backgroundColor,
    		textColor
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("themeColor" in $$props) $$invalidate(2, themeColor = $$props.themeColor);
    		if ("id" in $$props) $$invalidate(3, id = $$props.id);
    		if ("globalSettings" in $$props) $$invalidate(6, globalSettings = $$props.globalSettings);
    		if ("backgroundColor" in $$props) $$invalidate(4, backgroundColor = $$props.backgroundColor);
    		if ("textColor" in $$props) $$invalidate(5, textColor = $$props.textColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*themeColor*/ 4) {
    			$$invalidate(4, backgroundColor = color(themeColor).lightness(96));
    		}

    		if ($$self.$$.dirty & /*themeColor*/ 4) {
    			$$invalidate(5, textColor = color(themeColor).luminosity() > 0.7 ? "#000" : "#fff");
    		}
    	};

    	return [
    		title,
    		subtitle,
    		themeColor,
    		id,
    		backgroundColor,
    		textColor,
    		globalSettings,
    		$$scope,
    		slots
    	];
    }

    class Common_frame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			title: 0,
    			subtitle: 1,
    			themeColor: 2,
    			id: 3,
    			globalSettings: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Common_frame",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<Common_frame> was created without expected prop 'title'");
    		}

    		if (/*subtitle*/ ctx[1] === undefined && !("subtitle" in props)) {
    			console.warn("<Common_frame> was created without expected prop 'subtitle'");
    		}

    		if (/*themeColor*/ ctx[2] === undefined && !("themeColor" in props)) {
    			console.warn("<Common_frame> was created without expected prop 'themeColor'");
    		}

    		if (/*id*/ ctx[3] === undefined && !("id" in props)) {
    			console.warn("<Common_frame> was created without expected prop 'id'");
    		}

    		if (/*globalSettings*/ ctx[6] === undefined && !("globalSettings" in props)) {
    			console.warn("<Common_frame> was created without expected prop 'globalSettings'");
    		}
    	}

    	get title() {
    		throw new Error("<Common_frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Common_frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error("<Common_frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error("<Common_frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get themeColor() {
    		throw new Error("<Common_frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set themeColor(value) {
    		throw new Error("<Common_frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Common_frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Common_frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Common_frame>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Common_frame>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/nav-header.svelte generated by Svelte v3.32.1 */
    const file$1 = "src/nav-header.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    // (55:4) {#each imageExtensionsShort as ext, i}
    function create_each_block_1(ctx) {
    	let source;

    	const block = {
    		c: function create() {
    			source = element("source");
    			attr_dev(source, "type", "image/" + /*ext*/ ctx[18]);
    			attr_dev(source, "sizes", "30vw");
    			attr_dev(source, "srcset", /*imageSrcset*/ ctx[5][/*i*/ ctx[20]]);
    			attr_dev(source, "class", "svelte-2njd8f");
    			add_location(source, file$1, 55, 6, 2304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, source, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(source);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(55:4) {#each imageExtensionsShort as ext, i}",
    		ctx
    	});

    	return block;
    }

    // (71:4) {#each contents.items as item}
    function create_each_block(ctx) {
    	let div;
    	let t_value = /*item*/ ctx[15].label + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[10](/*item*/ ctx[15]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "header_navigation_list_items svelte-2njd8f");
    			add_location(div, file$1, 71, 6, 3243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*contents*/ 1 && t_value !== (t_value = /*item*/ ctx[15].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(71:4) {#each contents.items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let header_1;
    	let picture;
    	let t0;
    	let img;
    	let t1;
    	let input;
    	let t2;
    	let label0;
    	let svg0;
    	let path0;
    	let path1;
    	let t3;
    	let nav;
    	let label1;
    	let h3;
    	let span0;
    	let t5;
    	let span1;
    	let t7;
    	let t8;
    	let div;
    	let svg1;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*imageExtensionsShort*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*contents*/ ctx[0].items;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			header_1 = element("header");
    			picture = element("picture");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			img = element("img");
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			label0 = element("label");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t3 = space();
    			nav = element("nav");
    			label1 = element("label");
    			h3 = element("h3");
    			span0 = element("span");
    			span0.textContent = "ナビゲーション";
    			t5 = text("を");
    			span1 = element("span");
    			span1.textContent = "閉じる";
    			t7 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div = element("div");
    			svg1 = svg_element("svg");
    			attr_dev(img, "class", "header_logo svelte-2njd8f");
    			attr_dev(img, "sizes", "30vw");
    			attr_dev(img, "srcset", /*imageSrcset*/ ctx[5][/*safeImageExtensionIndex*/ ctx[4]]);
    			attr_dev(img, "alt", "画像");
    			add_location(img, file$1, 57, 4, 2387);
    			attr_dev(picture, "title", "クリックするとページの先頭に戻ります");
    			attr_dev(picture, "class", "svelte-2njd8f");
    			add_location(picture, file$1, 53, 2, 2174);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "ui_button header_button_checkbox svelte-2njd8f");
    			input.checked = true;
    			attr_dev(input, "name", "header_button_checkbox");
    			attr_dev(input, "id", "header_button_checkbox");
    			add_location(input, file$1, 59, 2, 2498);
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "class", "svelte-2njd8f");
    			add_location(path0, file$1, 62, 6, 2803);
    			attr_dev(path1, "d", "M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z");
    			attr_dev(path1, "class", "svelte-2njd8f");
    			add_location(path1, file$1, 63, 6, 2848);
    			attr_dev(svg0, "class", "header_button_svg svelte-2njd8f");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			add_location(svg0, file$1, 61, 4, 2745);
    			attr_dev(label0, "for", "header_button_checkbox");
    			attr_dev(label0, "class", "header_button svelte-2njd8f");
    			attr_dev(label0, "title", "クリックするとナビゲーションを開閉できます");
    			add_location(label0, file$1, 60, 2, 2652);
    			attr_dev(span0, "class", "break-scope svelte-2njd8f");
    			add_location(span0, file$1, 68, 42, 3106);
    			attr_dev(span1, "class", "break-scope svelte-2njd8f");
    			add_location(span1, file$1, 68, 83, 3147);
    			attr_dev(h3, "class", "header_navigation_title svelte-2njd8f");
    			add_location(h3, file$1, 68, 6, 3070);
    			attr_dev(label1, "for", "header_button_checkbox");
    			attr_dev(label1, "class", "header_navigation_list_items header_navigation_title svelte-2njd8f");
    			add_location(label1, file$1, 67, 4, 2966);
    			attr_dev(svg1, "class", "header_button_svg svelte-2njd8f");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "fill", "white");
    			add_location(svg1, file$1, 74, 6, 3406);
    			attr_dev(div, "class", "header_button_dummy svelte-2njd8f");
    			add_location(div, file$1, 73, 4, 3366);
    			attr_dev(nav, "class", "header_navigation svelte-2njd8f");
    			add_location(nav, file$1, 66, 2, 2930);

    			attr_dev(header_1, "title", window.CSS.supports(`(backdrop-filter:blur(10px)) or (-webkit-backdrop-filter:blur(10px)) or (-moz-backdrop-filter:blur(10px)`)
    			? ""
    			: "Firefoxをお使いの方はabout:configを開いてbackdrop-filterを有効にすると他のブラウザーと同じ見た目にすることができます。");

    			set_style(header_1, "--itemsCount", /*contents*/ ctx[0].items.length);
    			attr_dev(header_1, "class", "svelte-2njd8f");
    			add_location(header_1, file$1, 52, 0, 1873);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header_1, anchor);
    			append_dev(header_1, picture);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(picture, null);
    			}

    			append_dev(picture, t0);
    			append_dev(picture, img);
    			append_dev(header_1, t1);
    			append_dev(header_1, input);
    			/*input_binding*/ ctx[9](input);
    			append_dev(header_1, t2);
    			append_dev(header_1, label0);
    			append_dev(label0, svg0);
    			append_dev(svg0, path0);
    			append_dev(svg0, path1);
    			append_dev(header_1, t3);
    			append_dev(header_1, nav);
    			append_dev(nav, label1);
    			append_dev(label1, h3);
    			append_dev(h3, span0);
    			append_dev(h3, t5);
    			append_dev(h3, span1);
    			append_dev(nav, t7);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}

    			append_dev(nav, t8);
    			append_dev(nav, div);
    			append_dev(div, svg1);
    			/*header_1_binding*/ ctx[11](header_1);

    			if (!mounted) {
    				dispose = listen_dev(picture, "click", /*click_handler*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imageExtensionsShort, imageSrcset*/ 40) {
    				each_value_1 = /*imageExtensionsShort*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(picture, t0);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*triggerSmoothScroll, contents*/ 65) {
    				each_value = /*contents*/ ctx[0].items;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(nav, t8);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*contents*/ 1) {
    				set_style(header_1, "--itemsCount", /*contents*/ ctx[0].items.length);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header_1);
    			destroy_each(each_blocks_1, detaching);
    			/*input_binding*/ ctx[9](null);
    			destroy_each(each_blocks, detaching);
    			/*header_1_binding*/ ctx[11](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const scroll_duration = 400; //ms

    function easeInOutCubic(x) {
    	return x < 0.5
    	? 4 * x * x * x
    	: 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav_header", slots, []);
    	let { contents } = $$props, { globalSettings } = $$props;
    	let imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort;
    	let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
    	const imageSizes = contents.imageSizes || globalSettings.imageSizes;

    	let imageSrcset = imageExtensionsShort.map(ext => {
    		return imageSizes.map(size => `${contents.imageDirectory || globalSettings.imageDirectory}${contents.imageId}@${size}w.${ext} ${size}w`);
    	});

    	let header, checkbox;
    	let abort_scroll = false;

    	function smoothScroll(time, start_time, origin, destination) {
    		if (time == start_time) {
    			$$invalidate(2, checkbox.checked = false, checkbox);
    			requestAnimationFrame(time => smoothScroll(time, start_time, origin, destination));
    			return;
    		}

    		if (abort_scroll) {
    			abort_scroll = false;
    			return;
    		}

    		scrollTo({
    			top: origin + (destination || origin * -1) * easeInOutCubic((time - start_time) / scroll_duration)
    		});

    		if (time - start_time > scroll_duration) return;
    		requestAnimationFrame(time => smoothScroll(time, start_time, origin, destination));
    	}

    	function triggerSmoothScroll(target) {
    		if (target != "top") {
    			var targetElement = document.getElementById(target);
    		}

    		requestAnimationFrame(time => smoothScroll(time, time, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0, target == "top"
    		? 0
    		: targetElement.getBoundingClientRect().top - header.clientHeight));
    	}

    	onMount(() => setTimeout(() => document.getElementById("header_button_checkbox").checked = false, 2000));
    	const writable_props = ["contents", "globalSettings"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav_header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => triggerSmoothScroll("top");

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			checkbox = $$value;
    			$$invalidate(2, checkbox);
    		});
    	}

    	const click_handler_1 = item => triggerSmoothScroll(item.id);

    	function header_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			header = $$value;
    			$$invalidate(1, header);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(7, globalSettings = $$props.globalSettings);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		contents,
    		globalSettings,
    		imageExtensionsShort,
    		safeImageExtensionIndex,
    		imageSizes,
    		imageSrcset,
    		easeInOutCubic,
    		header,
    		checkbox,
    		scroll_duration,
    		abort_scroll,
    		smoothScroll,
    		triggerSmoothScroll
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(7, globalSettings = $$props.globalSettings);
    		if ("imageExtensionsShort" in $$props) $$invalidate(3, imageExtensionsShort = $$props.imageExtensionsShort);
    		if ("safeImageExtensionIndex" in $$props) $$invalidate(4, safeImageExtensionIndex = $$props.safeImageExtensionIndex);
    		if ("imageSrcset" in $$props) $$invalidate(5, imageSrcset = $$props.imageSrcset);
    		if ("header" in $$props) $$invalidate(1, header = $$props.header);
    		if ("checkbox" in $$props) $$invalidate(2, checkbox = $$props.checkbox);
    		if ("abort_scroll" in $$props) abort_scroll = $$props.abort_scroll;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		contents,
    		header,
    		checkbox,
    		imageExtensionsShort,
    		safeImageExtensionIndex,
    		imageSrcset,
    		triggerSmoothScroll,
    		globalSettings,
    		click_handler,
    		input_binding,
    		click_handler_1,
    		header_1_binding
    	];
    }

    class Nav_header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { contents: 0, globalSettings: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav_header",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Nav_header> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[7] === undefined && !("globalSettings" in props)) {
    			console.warn("<Nav_header> was created without expected prop 'globalSettings'");
    		}
    	}

    	get contents() {
    		throw new Error("<Nav_header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Nav_header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Nav_header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Nav_header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/button.svelte generated by Svelte v3.32.1 */

    const file$2 = "src/button.svelte";

    // (37:0) {:else}
    function create_else_block(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "style", /*style*/ ctx[1]);
    			attr_dev(button, "class", "svelte-1891uv8");
    			add_location(button, file$2, 37, 2, 801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*target*/ ctx[0])) /*target*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*style*/ 2) {
    				attr_dev(button, "style", /*style*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(37:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:0) {#if isAnchor}
    function create_if_block$1(ctx) {
    	let a;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*target*/ ctx[0]);
    			attr_dev(a, "style", /*style*/ ctx[1]);
    			attr_dev(a, "class", "svelte-1891uv8");
    			add_location(a, file$2, 35, 2, 738);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*target*/ 1) {
    				attr_dev(a, "href", /*target*/ ctx[0]);
    			}

    			if (!current || dirty & /*style*/ 2) {
    				attr_dev(a, "style", /*style*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(35:0) {#if isAnchor}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isAnchor*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { target } = $$props, { marginLeft } = $$props, { marginRight } = $$props;
    	let isAnchor = RegExp("^https?://").test(target);
    	let style = "";

    	if (!isAnchor) {
    		let event = new CustomEvent(target);

    		target = function () {
    			document.dispatchEvent(event);
    		};
    	}

    	if (!marginLeft && !marginRight) {
    		style = "margin-left: 0;margin-right: 0";
    	} else if (!marginRight) {
    		style = "margin-right: 0";
    	} else if (!marginLeft) {
    		style = "margin-left: 0";
    	}

    	const writable_props = ["target", "marginLeft", "marginRight"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("target" in $$props) $$invalidate(0, target = $$props.target);
    		if ("marginLeft" in $$props) $$invalidate(3, marginLeft = $$props.marginLeft);
    		if ("marginRight" in $$props) $$invalidate(4, marginRight = $$props.marginRight);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		target,
    		marginLeft,
    		marginRight,
    		isAnchor,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ("target" in $$props) $$invalidate(0, target = $$props.target);
    		if ("marginLeft" in $$props) $$invalidate(3, marginLeft = $$props.marginLeft);
    		if ("marginRight" in $$props) $$invalidate(4, marginRight = $$props.marginRight);
    		if ("isAnchor" in $$props) $$invalidate(2, isAnchor = $$props.isAnchor);
    		if ("style" in $$props) $$invalidate(1, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [target, style, isAnchor, marginLeft, marginRight, $$scope, slots];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { target: 0, marginLeft: 3, marginRight: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*target*/ ctx[0] === undefined && !("target" in props)) {
    			console.warn("<Button> was created without expected prop 'target'");
    		}

    		if (/*marginLeft*/ ctx[3] === undefined && !("marginLeft" in props)) {
    			console.warn("<Button> was created without expected prop 'marginLeft'");
    		}

    		if (/*marginRight*/ ctx[4] === undefined && !("marginRight" in props)) {
    			console.warn("<Button> was created without expected prop 'marginRight'");
    		}
    	}

    	get target() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get marginLeft() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set marginLeft(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get marginRight() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set marginRight(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/static-content.svelte generated by Svelte v3.32.1 */
    const file$3 = "src/static-content.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (17:4) {#each imageExtensionsShort as ext, i}
    function create_each_block_2(ctx) {
    	let source;

    	const block = {
    		c: function create() {
    			source = element("source");
    			attr_dev(source, "type", "image/" + /*ext*/ ctx[14]);
    			attr_dev(source, "sizes", "30vw");
    			attr_dev(source, "srcset", /*imageSrcset*/ ctx[2][/*i*/ ctx[16]]);
    			add_location(source, file$3, 17, 6, 782);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, source, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(source);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(17:4) {#each imageExtensionsShort as ext, i}",
    		ctx
    	});

    	return block;
    }

    // (24:6) {#each article as article}
    function create_each_block_1$1(ctx) {
    	let p;
    	let t_value = /*article*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-12hs8pm");
    			add_location(p, file$3, 24, 8, 1075);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(24:6) {#each article as article}",
    		ctx
    	});

    	return block;
    }

    // (30:8) <Button target="{button.target}" marginLeft="{buttonsLayout=='right'}" marginRight="{buttonsLayout=='left'}">
    function create_default_slot(ctx) {
    	let t_value = /*button*/ ctx[9].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(30:8) <Button target=\\\"{button.target}\\\" marginLeft=\\\"{buttonsLayout=='right'}\\\" marginRight=\\\"{buttonsLayout=='left'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:6) {#each buttons as button}
    function create_each_block$1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				target: /*button*/ ctx[9].target,
    				marginLeft: /*buttonsLayout*/ ctx[3] == "right",
    				marginRight: /*buttonsLayout*/ ctx[3] == "left",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 131072) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(29:6) {#each buttons as button}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let picture;
    	let t0;
    	let img;
    	let t1;
    	let section2;
    	let section0;
    	let t2;
    	let section1;
    	let current;
    	let each_value_2 = /*imageExtensionsShort*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*article*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*buttons*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			picture = element("picture");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t0 = space();
    			img = element("img");
    			t1 = space();
    			section2 = element("section");
    			section0 = element("section");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			section1 = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(img, "class", "header_logo svelte-12hs8pm");
    			attr_dev(img, "sizes", "30vw");
    			attr_dev(img, "srcset", /*imageSrcset*/ ctx[2][/*safeImageExtensionIndex*/ ctx[1]]);
    			attr_dev(img, "alt", "画像");
    			add_location(img, file$3, 19, 4, 865);
    			attr_dev(picture, "class", "svelte-12hs8pm");
    			add_location(picture, file$3, 15, 2, 723);
    			attr_dev(section0, "class", "text svelte-12hs8pm");
    			add_location(section0, file$3, 22, 4, 1011);
    			attr_dev(section1, "class", "buttons svelte-12hs8pm");
    			add_location(section1, file$3, 27, 4, 1125);
    			attr_dev(section2, "class", "right-column svelte-12hs8pm");
    			add_location(section2, file$3, 21, 2, 976);
    			attr_dev(div, "class", "container svelte-12hs8pm");
    			add_location(div, file$3, 14, 0, 697);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, picture);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(picture, null);
    			}

    			append_dev(picture, t0);
    			append_dev(picture, img);
    			append_dev(div, t1);
    			append_dev(div, section2);
    			append_dev(section2, section0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(section0, null);
    			}

    			append_dev(section2, t2);
    			append_dev(section2, section1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imageExtensionsShort, imageSrcset*/ 5) {
    				each_value_2 = /*imageExtensionsShort*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(picture, t0);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*article*/ 32) {
    				each_value_1 = /*article*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(section0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*buttons, buttonsLayout*/ 24) {
    				each_value = /*buttons*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Static_content", slots, []);
    	let { contents } = $$props, { globalSettings } = $$props;
    	let imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort;
    	let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
    	const imageSizes = contents.imageSizes || globalSettings.imageSizes;

    	let imageSrcset = imageExtensionsShort.map(ext => {
    		return imageSizes.map(size => `${contents.imageDirectory || globalSettings.imageDirectory}${contents.imageId}@${size}w.${ext} ${size}w`);
    	});

    	let article = contents.article;
    	let buttonsLayout = contents.bottomButtonsLayout;
    	let buttons = contents.bottomButtons;
    	const writable_props = ["contents", "globalSettings"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Static_content> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(6, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(7, globalSettings = $$props.globalSettings);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		contents,
    		globalSettings,
    		imageExtensionsShort,
    		safeImageExtensionIndex,
    		imageSizes,
    		imageSrcset,
    		article,
    		buttonsLayout,
    		buttons
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(6, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(7, globalSettings = $$props.globalSettings);
    		if ("imageExtensionsShort" in $$props) $$invalidate(0, imageExtensionsShort = $$props.imageExtensionsShort);
    		if ("safeImageExtensionIndex" in $$props) $$invalidate(1, safeImageExtensionIndex = $$props.safeImageExtensionIndex);
    		if ("imageSrcset" in $$props) $$invalidate(2, imageSrcset = $$props.imageSrcset);
    		if ("article" in $$props) $$invalidate(5, article = $$props.article);
    		if ("buttonsLayout" in $$props) $$invalidate(3, buttonsLayout = $$props.buttonsLayout);
    		if ("buttons" in $$props) $$invalidate(4, buttons = $$props.buttons);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		imageExtensionsShort,
    		safeImageExtensionIndex,
    		imageSrcset,
    		buttonsLayout,
    		buttons,
    		article,
    		contents,
    		globalSettings
    	];
    }

    class Static_content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { contents: 6, globalSettings: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Static_content",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[6] === undefined && !("contents" in props)) {
    			console.warn("<Static_content> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[7] === undefined && !("globalSettings" in props)) {
    			console.warn("<Static_content> was created without expected prop 'globalSettings'");
    		}
    	}

    	get contents() {
    		throw new Error("<Static_content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Static_content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Static_content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Static_content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/emphasizing-list.svelte generated by Svelte v3.32.1 */
    const file$4 = "src/emphasizing-list.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (156:6) {#each imageExtensionsShort as ext, i}
    function create_each_block_2$1(ctx) {
    	let source;
    	let source_srcset_value;

    	const block = {
    		c: function create() {
    			source = element("source");
    			attr_dev(source, "type", "image/" + /*ext*/ ctx[21]);
    			attr_dev(source, "sizes", "30vw");
    			attr_dev(source, "srcset", source_srcset_value = /*imageSrcset*/ ctx[6][/*i*/ ctx[18]]);
    			add_location(source, file$4, 156, 8, 4033);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, source, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imageSrcset*/ 64 && source_srcset_value !== (source_srcset_value = /*imageSrcset*/ ctx[6][/*i*/ ctx[18]])) {
    				attr_dev(source, "srcset", source_srcset_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(source);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(156:6) {#each imageExtensionsShort as ext, i}",
    		ctx
    	});

    	return block;
    }

    // (167:10) {#each articles[articleSwitched ? selectedArticleIndex : selectedArticleIndexLast].article as article}
    function create_each_block_1$2(ctx) {
    	let p;
    	let t_value = /*article*/ ctx[16] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-1v7fw9d");
    			add_location(p, file$4, 167, 12, 4672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*articleSwitched, selectedArticleIndex, selectedArticleIndexLast*/ 38 && t_value !== (t_value = /*article*/ ctx[16] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(167:10) {#each articles[articleSwitched ? selectedArticleIndex : selectedArticleIndexLast].article as article}",
    		ctx
    	});

    	return block;
    }

    // (173:6) {#each articles.slice(0, contents.listItemsCount + 1) as article, i}
    function create_each_block$2(ctx) {
    	let li;
    	let t_value = /*article*/ ctx[16].title + "";
    	let t;
    	let li_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "data-article-index", /*i*/ ctx[18]);

    			attr_dev(li, "class", li_class_value = "listed-title " + (/*selectedArticleIndex*/ ctx[1] == /*i*/ ctx[18]
    			? "isSelected"
    			: "") + " svelte-1v7fw9d");

    			add_location(li, file$4, 173, 8, 4876);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", /*setSelectedArticle*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && t_value !== (t_value = /*article*/ ctx[16].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*selectedArticleIndex*/ 2 && li_class_value !== (li_class_value = "listed-title " + (/*selectedArticleIndex*/ ctx[1] == /*i*/ ctx[18]
    			? "isSelected"
    			: "") + " svelte-1v7fw9d")) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(173:6) {#each articles.slice(0, contents.listItemsCount + 1) as article, i}",
    		ctx
    	});

    	return block;
    }

    // (179:2) <Button target="toggleExpand" marginLeft="{false}" marginRight="{false}">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("もっと見る");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(179:2) <Button target=\\\"toggleExpand\\\" marginLeft=\\\"{false}\\\" marginRight=\\\"{false}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div2;
    	let div1;
    	let picture;
    	let t0;
    	let img;
    	let img_class_value;
    	let img_srcset_value;
    	let t1;
    	let section;
    	let h3;

    	let t2_value = /*articles*/ ctx[10][/*hiding*/ ctx[4]
    	? /*selectedArticleIndexLast*/ ctx[2]
    	: /*selectedArticleIndex*/ ctx[1]].title + "";

    	let t2;
    	let h3_class_value;
    	let t3;
    	let div0;
    	let article;
    	let div0_class_value;
    	let t4;
    	let ul;
    	let t5;
    	let button;
    	let current;
    	let each_value_2 = /*imageExtensionsShort*/ ctx[7];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*articles*/ ctx[10][/*articleSwitched*/ ctx[5]
    	? /*selectedArticleIndex*/ ctx[1]
    	: /*selectedArticleIndexLast*/ ctx[2]].article;

    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*articles*/ ctx[10].slice(0, /*contents*/ ctx[0].listItemsCount + 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	button = new Button({
    			props: {
    				target: "toggleExpand",
    				marginLeft: false,
    				marginRight: false,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			picture = element("picture");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t0 = space();
    			img = element("img");
    			t1 = space();
    			section = element("section");
    			h3 = element("h3");
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			article = element("article");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			create_component(button.$$.fragment);
    			attr_dev(img, "class", img_class_value = "" + (null_to_empty(/*hiding*/ ctx[4] ? "hidden" : "shown") + " svelte-1v7fw9d"));
    			attr_dev(img, "sizes", "30vw");
    			attr_dev(img, "srcset", img_srcset_value = /*imageSrcset*/ ctx[6][/*safeImageExtensionIndex*/ ctx[8]]);
    			attr_dev(img, "alt", "画像");
    			add_location(img, file$4, 158, 6, 4120);
    			attr_dev(picture, "class", "svelte-1v7fw9d");
    			add_location(picture, file$4, 154, 4, 3970);
    			attr_dev(h3, "class", h3_class_value = "" + (null_to_empty(/*hiding*/ ctx[4] ? "hidden" : "shown") + " svelte-1v7fw9d"));
    			add_location(h3, file$4, 161, 6, 4290);
    			add_location(article, file$4, 165, 8, 4537);
    			attr_dev(div0, "class", div0_class_value = "articleWrapper " + (/*hiding*/ ctx[4] ? "hidden" : "shown") + " svelte-1v7fw9d");
    			set_style(div0, "--height", /*articleHeight*/ ctx[3] + "px");
    			add_location(div0, file$4, 164, 6, 4434);
    			set_style(ul, "height", /*contents*/ ctx[0].listItemsCount + "em");
    			attr_dev(ul, "class", "svelte-1v7fw9d");
    			add_location(ul, file$4, 171, 6, 4745);
    			attr_dev(section, "class", "right-column svelte-1v7fw9d");
    			add_location(section, file$4, 160, 4, 4253);
    			attr_dev(div1, "class", "columns svelte-1v7fw9d");
    			add_location(div1, file$4, 153, 2, 3944);
    			attr_dev(div2, "class", "container svelte-1v7fw9d");
    			set_style(div2, "--transitionDuration", /*transitionDuration*/ ctx[9] + "ms");
    			add_location(div2, file$4, 152, 0, 3865);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, picture);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(picture, null);
    			}

    			append_dev(picture, t0);
    			append_dev(picture, img);
    			append_dev(div1, t1);
    			append_dev(div1, section);
    			append_dev(section, h3);
    			append_dev(h3, t2);
    			append_dev(section, t3);
    			append_dev(section, div0);
    			append_dev(div0, article);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(article, null);
    			}

    			append_dev(section, t4);
    			append_dev(section, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div2, t5);
    			mount_component(button, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imageExtensionsShort, imageSrcset*/ 192) {
    				each_value_2 = /*imageExtensionsShort*/ ctx[7];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$1(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(picture, t0);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (!current || dirty & /*hiding*/ 16 && img_class_value !== (img_class_value = "" + (null_to_empty(/*hiding*/ ctx[4] ? "hidden" : "shown") + " svelte-1v7fw9d"))) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (!current || dirty & /*imageSrcset*/ 64 && img_srcset_value !== (img_srcset_value = /*imageSrcset*/ ctx[6][/*safeImageExtensionIndex*/ ctx[8]])) {
    				attr_dev(img, "srcset", img_srcset_value);
    			}

    			if ((!current || dirty & /*hiding, selectedArticleIndexLast, selectedArticleIndex*/ 22) && t2_value !== (t2_value = /*articles*/ ctx[10][/*hiding*/ ctx[4]
    			? /*selectedArticleIndexLast*/ ctx[2]
    			: /*selectedArticleIndex*/ ctx[1]].title + "")) set_data_dev(t2, t2_value);

    			if (!current || dirty & /*hiding*/ 16 && h3_class_value !== (h3_class_value = "" + (null_to_empty(/*hiding*/ ctx[4] ? "hidden" : "shown") + " svelte-1v7fw9d"))) {
    				attr_dev(h3, "class", h3_class_value);
    			}

    			if (dirty & /*articles, articleSwitched, selectedArticleIndex, selectedArticleIndexLast*/ 1062) {
    				each_value_1 = /*articles*/ ctx[10][/*articleSwitched*/ ctx[5]
    				? /*selectedArticleIndex*/ ctx[1]
    				: /*selectedArticleIndexLast*/ ctx[2]].article;

    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(article, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (!current || dirty & /*hiding*/ 16 && div0_class_value !== (div0_class_value = "articleWrapper " + (/*hiding*/ ctx[4] ? "hidden" : "shown") + " svelte-1v7fw9d")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*articleHeight*/ 8) {
    				set_style(div0, "--height", /*articleHeight*/ ctx[3] + "px");
    			}

    			if (dirty & /*selectedArticleIndex, setSelectedArticle, articles, contents*/ 3075) {
    				each_value = /*articles*/ ctx[10].slice(0, /*contents*/ ctx[0].listItemsCount + 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*contents*/ 1) {
    				set_style(ul, "height", /*contents*/ ctx[0].listItemsCount + "em");
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8388608) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Emphasizing_list", slots, []);
    	let { contents } = $$props, { globalSettings } = $$props;
    	let imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort;
    	let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
    	const imageSizes = contents.imageSizes || globalSettings.imageSizes;
    	let transitionDuration = globalSettings.transitionDuration;
    	let articles = contents.articles;
    	let selectedArticleIndex = 0;
    	let selectedArticleIndexLast;
    	let articleElement;
    	let articleHeight;
    	let hiding = false;
    	let articleSwitched = true;

    	function setImageSrcset(index) {
    		$$invalidate(6, imageSrcset = imageExtensionsShort.map(ext => {
    			return imageSizes.map(size => `${contents.imageDirectory || globalSettings.imageDirectory}${articles[index].imageId}@${size}w.${ext} ${size}w`);
    		}));
    	}

    	let imageSrcset;
    	setImageSrcset(selectedArticleIndex);

    	function setSelectedArticle(value) {
    		$$invalidate(2, selectedArticleIndexLast = selectedArticleIndex);

    		if (isNaN(value)) {
    			var target = value.target.dataset.articleIndex;
    		} else {
    			var target = value;
    		}

    		if (target != selectedArticleIndexLast) {
    			$$invalidate(4, hiding = true);
    			$$invalidate(5, articleSwitched = false);
    			$$invalidate(1, selectedArticleIndex = target);

    			setTimeout(
    				() => {
    					$$invalidate(5, articleSwitched = true);
    				},
    				transitionDuration / 2
    			);

    			setTimeout(
    				() => {
    					setImageSrcset(selectedArticleIndex);
    					$$invalidate(3, articleHeight = articleElement.clientHeight);
    					$$invalidate(4, hiding = false);
    				},
    				transitionDuration / 2
    			);
    		}
    	}

    	document.addEventListener("DOMContentLoaded", () => {
    		articleElement = document.querySelector("article");
    		$$invalidate(3, articleHeight = articleElement.clientHeight);
    	});

    	document.addEventListener("toggleExpand", () => alert("done!"));
    	const writable_props = ["contents", "globalSettings"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Emphasizing_list> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(12, globalSettings = $$props.globalSettings);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		contents,
    		globalSettings,
    		imageExtensionsShort,
    		safeImageExtensionIndex,
    		imageSizes,
    		transitionDuration,
    		articles,
    		selectedArticleIndex,
    		selectedArticleIndexLast,
    		articleElement,
    		articleHeight,
    		hiding,
    		articleSwitched,
    		setImageSrcset,
    		imageSrcset,
    		setSelectedArticle
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(12, globalSettings = $$props.globalSettings);
    		if ("imageExtensionsShort" in $$props) $$invalidate(7, imageExtensionsShort = $$props.imageExtensionsShort);
    		if ("safeImageExtensionIndex" in $$props) $$invalidate(8, safeImageExtensionIndex = $$props.safeImageExtensionIndex);
    		if ("transitionDuration" in $$props) $$invalidate(9, transitionDuration = $$props.transitionDuration);
    		if ("articles" in $$props) $$invalidate(10, articles = $$props.articles);
    		if ("selectedArticleIndex" in $$props) $$invalidate(1, selectedArticleIndex = $$props.selectedArticleIndex);
    		if ("selectedArticleIndexLast" in $$props) $$invalidate(2, selectedArticleIndexLast = $$props.selectedArticleIndexLast);
    		if ("articleElement" in $$props) articleElement = $$props.articleElement;
    		if ("articleHeight" in $$props) $$invalidate(3, articleHeight = $$props.articleHeight);
    		if ("hiding" in $$props) $$invalidate(4, hiding = $$props.hiding);
    		if ("articleSwitched" in $$props) $$invalidate(5, articleSwitched = $$props.articleSwitched);
    		if ("imageSrcset" in $$props) $$invalidate(6, imageSrcset = $$props.imageSrcset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		contents,
    		selectedArticleIndex,
    		selectedArticleIndexLast,
    		articleHeight,
    		hiding,
    		articleSwitched,
    		imageSrcset,
    		imageExtensionsShort,
    		safeImageExtensionIndex,
    		transitionDuration,
    		articles,
    		setSelectedArticle,
    		globalSettings
    	];
    }

    class Emphasizing_list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { contents: 0, globalSettings: 12 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Emphasizing_list",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Emphasizing_list> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[12] === undefined && !("globalSettings" in props)) {
    			console.warn("<Emphasizing_list> was created without expected prop 'globalSettings'");
    		}
    	}

    	get contents() {
    		throw new Error("<Emphasizing_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Emphasizing_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Emphasizing_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Emphasizing_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const sync = writable({});

    /*! npm.im/supports-webp 2.0.1 */

    var index = new Promise(function (resolve) {
    	var image = new Image();
    	image.onerror = function () { return resolve(false); };
    	image.onload = function () { return resolve(image.width === 1); };
    	image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    }).catch(function () { return false; });

    var supportsWebp_commonJs = index;

    /* src/slide-hero.svelte generated by Svelte v3.32.1 */
    const file$5 = "src/slide-hero.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    // (39:2) {#each imageSrcsets as srcsets}
    function create_each_block_2$2(ctx) {
    	let link;
    	let link_href_value;
    	let link_imagesrcset_value;

    	const block = {
    		c: function create() {
    			link = element("link");
    			attr_dev(link, "rel", "preload");
    			attr_dev(link, "as", "image");

    			attr_dev(link, "href", link_href_value = "" + ((/*contents*/ ctx[0].imageDirectory || /*globalSettings*/ ctx[2].imageDirectory) + /*contents*/ ctx[0].articles[0].imageId + "@" + (/*imageSizes*/ ctx[8].find(/*func*/ ctx[13]) || /*imageSizes*/ ctx[8].sort(func_1)[0]) + "w." + (supportsWebp_commonJs
    			? "webp"
    			: /*imageExtensionsShort*/ ctx[6][/*safeImageExtensionIndex*/ ctx[7]])));

    			attr_dev(link, "imagesrcset", link_imagesrcset_value = /*srcsets*/ ctx[21][supportsWebp_commonJs && /*imageExtensionsShort*/ ctx[6].includes("webp")
    			? /*imageExtensionsShort*/ ctx[6].findIndex(func_2)
    			: 0]);

    			attr_dev(link, "imagesizes", "80vw");
    			add_location(link, file$5, 39, 4, 1483);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, link, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents, globalSettings*/ 5 && link_href_value !== (link_href_value = "" + ((/*contents*/ ctx[0].imageDirectory || /*globalSettings*/ ctx[2].imageDirectory) + /*contents*/ ctx[0].articles[0].imageId + "@" + (/*imageSizes*/ ctx[8].find(/*func*/ ctx[13]) || /*imageSizes*/ ctx[8].sort(func_1)[0]) + "w." + (supportsWebp_commonJs
    			? "webp"
    			: /*imageExtensionsShort*/ ctx[6][/*safeImageExtensionIndex*/ ctx[7]])))) {
    				attr_dev(link, "href", link_href_value);
    			}

    			if (dirty & /*imageSrcsets*/ 8 && link_imagesrcset_value !== (link_imagesrcset_value = /*srcsets*/ ctx[21][supportsWebp_commonJs && /*imageExtensionsShort*/ ctx[6].includes("webp")
    			? /*imageExtensionsShort*/ ctx[6].findIndex(func_2)
    			: 0])) {
    				attr_dev(link, "imagesrcset", link_imagesrcset_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(39:2) {#each imageSrcsets as srcsets}",
    		ctx
    	});

    	return block;
    }

    // (47:6) {#each imageExtensionsShort as ext, i}
    function create_each_block_1$3(ctx) {
    	let source;
    	let source_srcset_value;

    	const block = {
    		c: function create() {
    			source = element("source");
    			attr_dev(source, "type", "image/" + /*ext*/ ctx[18]);
    			attr_dev(source, "sizes", "80vw");

    			attr_dev(source, "srcset", source_srcset_value = /*imageSrcsets*/ ctx[3].slice(/*$sync*/ ctx[5][/*pairId*/ ctx[1]].slide + /*v*/ ctx[15] == /*imageSrcsets*/ ctx[3].length
    			? 0
    			: /*$sync*/ ctx[5][/*pairId*/ ctx[1]].slide + /*v*/ ctx[15])[/*i*/ ctx[20]]);

    			add_location(source, file$5, 47, 8, 2297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, source, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imageSrcsets, $sync, pairId*/ 42 && source_srcset_value !== (source_srcset_value = /*imageSrcsets*/ ctx[3].slice(/*$sync*/ ctx[5][/*pairId*/ ctx[1]].slide + /*v*/ ctx[15] == /*imageSrcsets*/ ctx[3].length
    			? 0
    			: /*$sync*/ ctx[5][/*pairId*/ ctx[1]].slide + /*v*/ ctx[15])[/*i*/ ctx[20]])) {
    				attr_dev(source, "srcset", source_srcset_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(source);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(47:6) {#each imageExtensionsShort as ext, i}",
    		ctx
    	});

    	return block;
    }

    // (45:2) {#each imageColumn as v}
    function create_each_block$3(ctx) {
    	let picture;
    	let t0;
    	let img;
    	let img_srcset_value;
    	let t1;
    	let picture_class_value;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*imageExtensionsShort*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[14](/*v*/ ctx[15]);
    	}

    	const block = {
    		c: function create() {
    			picture = element("picture");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			img = element("img");
    			t1 = space();
    			attr_dev(img, "sizes", "80vw");

    			attr_dev(img, "srcset", img_srcset_value = /*imageSrcsets*/ ctx[3].slice(/*$sync*/ ctx[5][/*pairId*/ ctx[1]].slide + /*v*/ ctx[15] == /*imageSrcsets*/ ctx[3].length
    			? 0
    			: /*$sync*/ ctx[5][/*pairId*/ ctx[1]].slide + /*v*/ ctx[15])[/*safeImageExtensionIndex*/ ctx[7]]);

    			attr_dev(img, "alt", "画像");
    			attr_dev(img, "class", "svelte-1t0sc69");
    			add_location(img, file$5, 49, 6, 2469);

    			attr_dev(picture, "class", picture_class_value = "" + (null_to_empty(/*$sync*/ ctx[5][/*pairId*/ ctx[1]].inTransition
    			? "inTransition"
    			: "") + " svelte-1t0sc69"));

    			add_location(picture, file$5, 45, 4, 2149);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, picture, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(picture, null);
    			}

    			append_dev(picture, t0);
    			append_dev(picture, img);
    			append_dev(picture, t1);

    			if (!mounted) {
    				dispose = listen_dev(picture, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*imageExtensionsShort, imageSrcsets, $sync, pairId, imageColumn*/ 618) {
    				each_value_1 = /*imageExtensionsShort*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(picture, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*imageSrcsets, $sync, pairId*/ 42 && img_srcset_value !== (img_srcset_value = /*imageSrcsets*/ ctx[3].slice(/*$sync*/ ctx[5][/*pairId*/ ctx[1]].slide + /*v*/ ctx[15] == /*imageSrcsets*/ ctx[3].length
    			? 0
    			: /*$sync*/ ctx[5][/*pairId*/ ctx[1]].slide + /*v*/ ctx[15])[/*safeImageExtensionIndex*/ ctx[7]])) {
    				attr_dev(img, "srcset", img_srcset_value);
    			}

    			if (dirty & /*$sync, pairId*/ 34 && picture_class_value !== (picture_class_value = "" + (null_to_empty(/*$sync*/ ctx[5][/*pairId*/ ctx[1]].inTransition
    			? "inTransition"
    			: "") + " svelte-1t0sc69"))) {
    				attr_dev(picture, "class", picture_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(picture);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(45:2) {#each imageColumn as v}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let each0_anchor;
    	let t;
    	let div;
    	let each_value_2 = /*imageSrcsets*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	let each_value = /*imageColumn*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			each0_anchor = empty();
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "container svelte-1t0sc69");
    			set_style(div, "--transitionDuration", /*transitionDuration*/ ctx[10] + "ms");
    			set_style(div, "--slideOffset", /*slideOffset*/ ctx[4]);
    			add_location(div, file$5, 43, 0, 2011);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(document.head, null);
    			}

    			append_dev(document.head, each0_anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*contents, globalSettings, imageSizes, window, supportsWebP, imageExtensionsShort, safeImageExtensionIndex, imageSrcsets*/ 461) {
    				each_value_2 = /*imageSrcsets*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(each0_anchor.parentNode, each0_anchor);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*$sync, pairId, slide, imageColumn, imageSrcsets, safeImageExtensionIndex, imageExtensionsShort*/ 2794) {
    				each_value = /*imageColumn*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*slideOffset*/ 16) {
    				set_style(div, "--slideOffset", /*slideOffset*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks_1, detaching);
    			detach_dev(each0_anchor);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func_1 = (a, b) => b - a;
    const func_2 = v => v == "webp";

    function instance$5($$self, $$props, $$invalidate) {
    	let $sync;
    	validate_store(sync, "sync");
    	component_subscribe($$self, sync, $$value => $$invalidate(5, $sync = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Slide_hero", slots, []);

    	let { contents } = $$props,
    		{ pairId } = $$props,
    		{ isParent } = $$props,
    		{ globalSettings } = $$props;

    	let imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort;
    	let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
    	let imageSizes = contents.imageSizes || globalSettings.imageSizes;
    	let imageSrcsets = [];

    	for (let i = 0; i < contents.articles.length; i++) {
    		imageSrcsets[i] = imageExtensionsShort.map(ext => {
    			return imageSizes.map(size => `${contents.imageDirectory || globalSettings.imageDirectory}${contents.articles[i].imageId}@${size}w.${ext} ${size}w`);
    		});
    	}

    	const imageColumn = [-1, 0, 1, 2];
    	const transitionDuration = globalSettings.transitionDuration;
    	let slideOffset = "0vw";

    	function slide(v) {
    		set_store_value(sync, $sync[pairId].inTransition = true, $sync);
    		$$invalidate(4, slideOffset = `${80 * v}vw`);

    		if ($sync[pairId].slide + v >= imageSrcsets.length) {
    			set_store_value(sync, $sync[pairId].transitionOffset = v - imageSrcsets.length, $sync);
    		} else if ($sync[pairId].slide + v < 0) {
    			set_store_value(sync, $sync[pairId].transitionOffset = v + imageSrcsets.length, $sync);
    		} else {
    			set_store_value(sync, $sync[pairId].transitionOffset = v, $sync);
    		}

    		setTimeout(
    			() => {
    				set_store_value(sync, $sync[pairId].inTransition = false, $sync);
    				$$invalidate(4, slideOffset = "0vw");
    				set_store_value(sync, $sync[pairId].slide += $sync[pairId].transitionOffset, $sync);
    			},
    			transitionDuration
    		);
    	}

    	const writable_props = ["contents", "pairId", "isParent", "globalSettings"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Slide_hero> was created with unknown prop '${key}'`);
    	});

    	const func = v => v >= window.innerWidth * window.devicePixelRatio * globalSettings.standardWidth / 100;
    	const click_handler = v => slide(v);

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("pairId" in $$props) $$invalidate(1, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(12, isParent = $$props.isParent);
    		if ("globalSettings" in $$props) $$invalidate(2, globalSettings = $$props.globalSettings);
    	};

    	$$self.$capture_state = () => ({
    		sync,
    		supportsWebP: supportsWebp_commonJs,
    		contents,
    		pairId,
    		isParent,
    		globalSettings,
    		imageExtensionsShort,
    		safeImageExtensionIndex,
    		imageSizes,
    		imageSrcsets,
    		imageColumn,
    		transitionDuration,
    		slideOffset,
    		slide,
    		$sync
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("pairId" in $$props) $$invalidate(1, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(12, isParent = $$props.isParent);
    		if ("globalSettings" in $$props) $$invalidate(2, globalSettings = $$props.globalSettings);
    		if ("imageExtensionsShort" in $$props) $$invalidate(6, imageExtensionsShort = $$props.imageExtensionsShort);
    		if ("safeImageExtensionIndex" in $$props) $$invalidate(7, safeImageExtensionIndex = $$props.safeImageExtensionIndex);
    		if ("imageSizes" in $$props) $$invalidate(8, imageSizes = $$props.imageSizes);
    		if ("imageSrcsets" in $$props) $$invalidate(3, imageSrcsets = $$props.imageSrcsets);
    		if ("slideOffset" in $$props) $$invalidate(4, slideOffset = $$props.slideOffset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		contents,
    		pairId,
    		globalSettings,
    		imageSrcsets,
    		slideOffset,
    		$sync,
    		imageExtensionsShort,
    		safeImageExtensionIndex,
    		imageSizes,
    		imageColumn,
    		transitionDuration,
    		slide,
    		isParent,
    		func,
    		click_handler
    	];
    }

    class Slide_hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			contents: 0,
    			pairId: 1,
    			isParent: 12,
    			globalSettings: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slide_hero",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Slide_hero> was created without expected prop 'contents'");
    		}

    		if (/*pairId*/ ctx[1] === undefined && !("pairId" in props)) {
    			console.warn("<Slide_hero> was created without expected prop 'pairId'");
    		}

    		if (/*isParent*/ ctx[12] === undefined && !("isParent" in props)) {
    			console.warn("<Slide_hero> was created without expected prop 'isParent'");
    		}

    		if (/*globalSettings*/ ctx[2] === undefined && !("globalSettings" in props)) {
    			console.warn("<Slide_hero> was created without expected prop 'globalSettings'");
    		}
    	}

    	get contents() {
    		throw new Error("<Slide_hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Slide_hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pairId() {
    		throw new Error("<Slide_hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pairId(value) {
    		throw new Error("<Slide_hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isParent() {
    		throw new Error("<Slide_hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isParent(value) {
    		throw new Error("<Slide_hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Slide_hero>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Slide_hero>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/slide-description.svelte generated by Svelte v3.32.1 */

    // (16:0) <Cframe title={contents.articles[$sync[pairId].slide].title} subtitle={contents.articles[$sync[pairId].slide].subtitle} themeColor={contents.articles[$sync[pairId].slide].themeColor}>
    function create_default_slot$2(ctx) {
    	let t_value = /*contents*/ ctx[1].articles[/*$sync*/ ctx[2][/*pairId*/ ctx[0]].slide].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents, $sync, pairId*/ 7 && t_value !== (t_value = /*contents*/ ctx[1].articles[/*$sync*/ ctx[2][/*pairId*/ ctx[0]].slide].description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(16:0) <Cframe title={contents.articles[$sync[pairId].slide].title} subtitle={contents.articles[$sync[pairId].slide].subtitle} themeColor={contents.articles[$sync[pairId].slide].themeColor}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let cframe;
    	let current;

    	cframe = new Common_frame({
    			props: {
    				title: /*contents*/ ctx[1].articles[/*$sync*/ ctx[2][/*pairId*/ ctx[0]].slide].title,
    				subtitle: /*contents*/ ctx[1].articles[/*$sync*/ ctx[2][/*pairId*/ ctx[0]].slide].subtitle,
    				themeColor: /*contents*/ ctx[1].articles[/*$sync*/ ctx[2][/*pairId*/ ctx[0]].slide].themeColor,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cframe.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(cframe, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const cframe_changes = {};
    			if (dirty & /*contents, $sync, pairId*/ 7) cframe_changes.title = /*contents*/ ctx[1].articles[/*$sync*/ ctx[2][/*pairId*/ ctx[0]].slide].title;
    			if (dirty & /*contents, $sync, pairId*/ 7) cframe_changes.subtitle = /*contents*/ ctx[1].articles[/*$sync*/ ctx[2][/*pairId*/ ctx[0]].slide].subtitle;
    			if (dirty & /*contents, $sync, pairId*/ 7) cframe_changes.themeColor = /*contents*/ ctx[1].articles[/*$sync*/ ctx[2][/*pairId*/ ctx[0]].slide].themeColor;

    			if (dirty & /*$$scope, contents, $sync, pairId*/ 263) {
    				cframe_changes.$$scope = { dirty, ctx };
    			}

    			cframe.$set(cframe_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cframe.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cframe.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cframe, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $sync;
    	validate_store(sync, "sync");
    	component_subscribe($$self, sync, $$value => $$invalidate(2, $sync = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Slide_description", slots, []);

    	let { pairId } = $$props,
    		{ isParent } = $$props,
    		{ globalSettings } = $$props,
    		{ contents } = $$props;

    	let imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort;
    	let safeImageExtensionIndex = imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
    	let imageSizes = contents.imageSizes || globalSettings.imageSizes;

    	if (isParent) set_store_value(
    		sync,
    		$sync[pairId] = {
    			slide: 0,
    			inTransition: false,
    			transitionOffset: 0
    		},
    		$sync
    	);

    	const writable_props = ["pairId", "isParent", "globalSettings", "contents"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Slide_description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("pairId" in $$props) $$invalidate(0, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(3, isParent = $$props.isParent);
    		if ("globalSettings" in $$props) $$invalidate(4, globalSettings = $$props.globalSettings);
    		if ("contents" in $$props) $$invalidate(1, contents = $$props.contents);
    	};

    	$$self.$capture_state = () => ({
    		Cframe: Common_frame,
    		sync,
    		pairId,
    		isParent,
    		globalSettings,
    		contents,
    		imageExtensionsShort,
    		safeImageExtensionIndex,
    		imageSizes,
    		$sync
    	});

    	$$self.$inject_state = $$props => {
    		if ("pairId" in $$props) $$invalidate(0, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(3, isParent = $$props.isParent);
    		if ("globalSettings" in $$props) $$invalidate(4, globalSettings = $$props.globalSettings);
    		if ("contents" in $$props) $$invalidate(1, contents = $$props.contents);
    		if ("imageExtensionsShort" in $$props) imageExtensionsShort = $$props.imageExtensionsShort;
    		if ("safeImageExtensionIndex" in $$props) safeImageExtensionIndex = $$props.safeImageExtensionIndex;
    		if ("imageSizes" in $$props) imageSizes = $$props.imageSizes;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pairId, contents, $sync, isParent, globalSettings];
    }

    class Slide_description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			pairId: 0,
    			isParent: 3,
    			globalSettings: 4,
    			contents: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slide_description",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pairId*/ ctx[0] === undefined && !("pairId" in props)) {
    			console.warn("<Slide_description> was created without expected prop 'pairId'");
    		}

    		if (/*isParent*/ ctx[3] === undefined && !("isParent" in props)) {
    			console.warn("<Slide_description> was created without expected prop 'isParent'");
    		}

    		if (/*globalSettings*/ ctx[4] === undefined && !("globalSettings" in props)) {
    			console.warn("<Slide_description> was created without expected prop 'globalSettings'");
    		}

    		if (/*contents*/ ctx[1] === undefined && !("contents" in props)) {
    			console.warn("<Slide_description> was created without expected prop 'contents'");
    		}
    	}

    	get pairId() {
    		throw new Error("<Slide_description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pairId(value) {
    		throw new Error("<Slide_description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isParent() {
    		throw new Error("<Slide_description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isParent(value) {
    		throw new Error("<Slide_description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Slide_description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Slide_description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contents() {
    		throw new Error("<Slide_description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Slide_description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.1 */
    const file$6 = "src/App.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].title;
    	child_ctx[4] = list[i].subtitle;
    	child_ctx[5] = list[i].themeColor;
    	child_ctx[6] = list[i].sectionType;
    	child_ctx[7] = list[i].contents;
    	child_ctx[8] = list[i].id;
    	child_ctx[9] = list[i].pairId;
    	child_ctx[10] = list[i].isParent;
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (14:0) {#if settings.find(v => v.sectionType == 'navHeader')}
    function create_if_block_5(ctx) {
    	let nheader;
    	let current;

    	nheader = new Nav_header({
    			props: {
    				contents: /*settings*/ ctx[0].find(func_1$1).contents,
    				globalSettings: /*globalSettings*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nheader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nheader, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nheader_changes = {};
    			if (dirty & /*settings*/ 1) nheader_changes.contents = /*settings*/ ctx[0].find(func_1$1).contents;
    			if (dirty & /*globalSettings*/ 2) nheader_changes.globalSettings = /*globalSettings*/ ctx[1];
    			nheader.$set(nheader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nheader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(14:0) {#if settings.find(v => v.sectionType == 'navHeader')}",
    		ctx
    	});

    	return block;
    }

    // (23:41) 
    function create_if_block_2(ctx) {
    	let cframe;
    	let current;

    	cframe = new Common_frame({
    			props: {
    				id: /*id*/ ctx[8],
    				title: /*title*/ ctx[3],
    				subtitle: /*subtitle*/ ctx[4],
    				themeColor: /*themeColor*/ ctx[5],
    				globalSettings: /*globalSettings*/ ctx[1],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cframe.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cframe, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cframe_changes = {};
    			if (dirty & /*settings*/ 1) cframe_changes.id = /*id*/ ctx[8];
    			if (dirty & /*settings*/ 1) cframe_changes.title = /*title*/ ctx[3];
    			if (dirty & /*settings*/ 1) cframe_changes.subtitle = /*subtitle*/ ctx[4];
    			if (dirty & /*settings*/ 1) cframe_changes.themeColor = /*themeColor*/ ctx[5];
    			if (dirty & /*globalSettings*/ 2) cframe_changes.globalSettings = /*globalSettings*/ ctx[1];

    			if (dirty & /*$$scope, settings, globalSettings*/ 8195) {
    				cframe_changes.$$scope = { dirty, ctx };
    			}

    			cframe.$set(cframe_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cframe.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cframe.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cframe, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(23:41) ",
    		ctx
    	});

    	return block;
    }

    // (21:41) 
    function create_if_block_1$1(ctx) {
    	let desc;
    	let current;

    	desc = new Slide_description({
    			props: {
    				contents: /*contents*/ ctx[7],
    				globalSettings: /*globalSettings*/ ctx[1],
    				pairId: /*pairId*/ ctx[9],
    				isParent: /*isParent*/ ctx[10]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(desc.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(desc, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const desc_changes = {};
    			if (dirty & /*settings*/ 1) desc_changes.contents = /*contents*/ ctx[7];
    			if (dirty & /*globalSettings*/ 2) desc_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*settings*/ 1) desc_changes.pairId = /*pairId*/ ctx[9];
    			if (dirty & /*settings*/ 1) desc_changes.isParent = /*isParent*/ ctx[10];
    			desc.$set(desc_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(desc.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(desc.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(desc, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(21:41) ",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if sectionType == "slideHero"}
    function create_if_block$2(ctx) {
    	let hero;
    	let current;

    	function func_2(...args) {
    		return /*func_2*/ ctx[2](/*pairId*/ ctx[9], ...args);
    	}

    	hero = new Slide_hero({
    			props: {
    				contents: /*contents*/ ctx[7] || /*settings*/ ctx[0].find(func_2).contents,
    				globalSettings: /*globalSettings*/ ctx[1],
    				pairId: /*pairId*/ ctx[9],
    				isParent: /*isParent*/ ctx[10]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(hero.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hero, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const hero_changes = {};
    			if (dirty & /*settings*/ 1) hero_changes.contents = /*contents*/ ctx[7] || /*settings*/ ctx[0].find(func_2).contents;
    			if (dirty & /*globalSettings*/ 2) hero_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*settings*/ 1) hero_changes.pairId = /*pairId*/ ctx[9];
    			if (dirty & /*settings*/ 1) hero_changes.isParent = /*isParent*/ ctx[10];
    			hero.$set(hero_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hero.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hero.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hero, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(19:4) {#if sectionType == \\\"slideHero\\\"}",
    		ctx
    	});

    	return block;
    }

    // (27:51) 
    function create_if_block_4(ctx) {
    	let elist;
    	let current;

    	elist = new Emphasizing_list({
    			props: {
    				contents: /*contents*/ ctx[7],
    				globalSettings: /*globalSettings*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(elist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(elist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const elist_changes = {};
    			if (dirty & /*settings*/ 1) elist_changes.contents = /*contents*/ ctx[7];
    			if (dirty & /*globalSettings*/ 2) elist_changes.globalSettings = /*globalSettings*/ ctx[1];
    			elist.$set(elist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(elist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(elist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(elist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(27:51) ",
    		ctx
    	});

    	return block;
    }

    // (25:8) {#if sectionType == "static"}
    function create_if_block_3(ctx) {
    	let static_1;
    	let current;

    	static_1 = new Static_content({
    			props: {
    				contents: /*contents*/ ctx[7],
    				globalSettings: /*globalSettings*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(static_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(static_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const static_1_changes = {};
    			if (dirty & /*settings*/ 1) static_1_changes.contents = /*contents*/ ctx[7];
    			if (dirty & /*globalSettings*/ 2) static_1_changes.globalSettings = /*globalSettings*/ ctx[1];
    			static_1.$set(static_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(static_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(static_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(static_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(25:8) {#if sectionType == \\\"static\\\"}",
    		ctx
    	});

    	return block;
    }

    // (24:6) <Cframe {id} {title} {subtitle} {themeColor} {globalSettings}>
    function create_default_slot$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_3, create_if_block_4];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*sectionType*/ ctx[6] == "static") return 0;
    		if (/*sectionType*/ ctx[6] == "emphasizingList") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(24:6) <Cframe {id} {title} {subtitle} {themeColor} {globalSettings}>",
    		ctx
    	});

    	return block;
    }

    // (18:2) {#each settings as {title, subtitle, themeColor, sectionType, contents, id, pairId, isParent}
    function create_each_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*sectionType*/ ctx[6] == "slideHero") return 0;
    		if (/*sectionType*/ ctx[6] == "slideDesc") return 1;
    		if (/*sectionType*/ ctx[6] != "navHeader") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(18:2) {#each settings as {title, subtitle, themeColor, sectionType, contents, id, pairId, isParent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let show_if = /*settings*/ ctx[0].find(func);
    	let t;
    	let main;
    	let current;
    	let if_block = show_if && create_if_block_5(ctx);
    	let each_value = /*settings*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(main, "--standardWidth", /*globalSettings*/ ctx[1].standardWidth + "vw");
    			set_style(main, "--transitionDuration", /*globalSettings*/ ctx[1].transitionDuration + "ms");
    			add_location(main, file$6, 16, 0, 542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings*/ 1) show_if = /*settings*/ ctx[0].find(func);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*settings*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*settings, globalSettings*/ 3) {
    				each_value = /*settings*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*globalSettings*/ 2) {
    				set_style(main, "--standardWidth", /*globalSettings*/ ctx[1].standardWidth + "vw");
    			}

    			if (!current || dirty & /*globalSettings*/ 2) {
    				set_style(main, "--transitionDuration", /*globalSettings*/ ctx[1].transitionDuration + "ms");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = v => v.sectionType == "navHeader";
    const func_1$1 = v => v.sectionType == "navHeader";

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { settings } = $$props;
    	let { globalSettings } = $$props;
    	const writable_props = ["settings", "globalSettings"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const func_2 = (pairId, v) => v.pairId == pairId && v.isParent;

    	$$self.$$set = $$props => {
    		if ("settings" in $$props) $$invalidate(0, settings = $$props.settings);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    	};

    	$$self.$capture_state = () => ({
    		Cframe: Common_frame,
    		Nheader: Nav_header,
    		Static: Static_content,
    		Elist: Emphasizing_list,
    		Hero: Slide_hero,
    		Desc: Slide_description,
    		settings,
    		globalSettings
    	});

    	$$self.$inject_state = $$props => {
    		if ("settings" in $$props) $$invalidate(0, settings = $$props.settings);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings, globalSettings, func_2];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { settings: 0, globalSettings: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[0] === undefined && !("settings" in props)) {
    			console.warn("<App> was created without expected prop 'settings'");
    		}

    		if (/*globalSettings*/ ctx[1] === undefined && !("globalSettings" in props)) {
    			console.warn("<App> was created without expected prop 'globalSettings'");
    		}
    	}

    	get settings() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        globalSettings: {
          standardWidth: '80', // vw
          imageDirectory: './img/',
          imageExtensionsShort: ['webp', 'png'],
          imageSizes: [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
          transitionDuration: 500, //ms
        },
        settings: [
          {
            sectionType: 'navHeader',
            themeColor: '#fff',
            contents: {
              imageId: 'ssm-logo-landscape',
              items: [
                {id: 'works', label: '作品'},
                {id: 'news', label: 'ニュース'},
                {id: 'about', label: 'チームについて'},
                {id: 'members', label: 'メンバー'}
              ]
            }
          },
          {
            sectionType: 'slideHero',
            pairId: 'hero',
            id: 'info'
          },
          {
            sectionType: 'slideDesc',
            pairId: 'hero',
            isParent: true,
            contents: {
              articles: [
                {
                  title: 'フォーリンパフェ',
                  subtitle: 'パフェが落ちるやつ',
                  themeColor: '#4ae0ef',
                  imageId: 'fall_in_parfait-ss1',
                  alt: 'テスト画像1',
                  description: 'フォーリンパフェの説明文です。ここにゲームの説明文を入れます。この左にスクリーンショットなどを表示し、この下に対応ハードなどを書くといいと思います。ダウンロードリンクなどのボタンも設置予定。'
                },
                {
                  title: 'Cup Runmen',
                  subtitle: 'VRMカップ麺ボブスレーレース',
                  themeColor: '#1f83d8',
                  imageId: 'cup-run_ss',
                  alt: 'テスト画像2',
                  description: 'Cup Runmenの説明文です。ここにゲームの説明文を入れます。この左にスクリーンショットなどを表示し、この下に対応ハードなどを書くといいと思います。ダウンロードリンクなどのボタンも設置予定。'
                },
                {
                  title: 'れーぞく！ネクロマンスちゃん',
                  subtitle: 'コミカルポップ全方位シューティング',
                  themeColor: '#fdaa2b',
                  imageId: 'necromance_ss',
                  alt: 'テスト画像3',
                  description: 'れーぞく！ネクロマンスちゃんの説明文です。ここにゲームの説明文を入れます。この左にスクリーンショットなどを表示し、この下に対応ハードなどを書くといいと思います。ダウンロードリンクなどのボタンも設置予定。'
                },
                {
                  title: 'SPINNER',
                  subtitle: 'ハイスピード対戦アクション',
                  themeColor: '#000',
                  imageId: 'spinner_ss',
                  alt: 'テスト画像4',
                  description: 'SPINNERの説明文です。ここにゲームの説明文を入れます。この左にスクリーンショットなどを表示し、この下に対応ハードなどを書くといいと思います。ダウンロードリンクなどのボタンも設置予定。'
                }
              ]
            }
          },
          {
            sectionType: 'emphasizingList',
            cycleType: 'compact',
            title: 'NEWS',
            subtitle: 'チームからのお知らせ',
            themeColor: '#ff0200',
            id: 'news',
            contents: {
              listItemsCount: 5,
              autoCyclePeriodInMs: 5000,
              stopAutoCycleWhenClicked: true,
              articles: [
                {
                  imageId: 'ssm-logo-landscape',
                  title: '【速報】まちこー、無事に東京に帰還',
                  article: [
                    "スーパースターマインのリーダーのまちこーが東京に帰ってきました。",
                    "民が無事を祈る中、まちこーは成田空港に降り立ちました。",
                    "現場では5000人のファンが出迎えたそうです。"
                  ]
                },
                {
                  imageId: 'ssm-logo',
                  title: '【奇跡】まちこーのアパート、無傷',
                  article: [
                    "先日の地震による被害が心配されていたまちこー宅ですが、",
                    "奇跡的に被害が出ていなかったということです。",
                    "現場では5000人のファンが歓声を上げたそうです。"
                  ]
                },
                {
                  imageId: 'ssm-logo-landscape',
                  title: '【速報】ワイドモニター、歩夢宅に導入',
                  article: [
                    "つい先ほど、我らがデザイナーの歩夢の家にワイドモニターが導入されました",
                    "早速設置を進めているとのことです。"
                  ]
                },
                {
                  imageId: 'ssm-logo',
                  title: '【悲報】モニターアームのネジ、落ちる',
                  article: [
                    "我らがデザイナーの歩夢がモニターの設置をしていたところ、モニターアームのねじが穴に落下してしまったそうです。",
                    "Twitterでも助けを求めており、懸命な作業が続けられています。"
                  ]
                },
                {
                  imageId: 'ssm-logo-landscape',
                  title: '【速報】モニターアームのネジ、見つかる',
                  article: [
                    "我らがデザイナーの歩夢が懸命な救出活動を行なっていたモニターアームのネジですが、つい先ほど無事に救出されたそうです。",
                    "救出の際には磁石を搭載した専用の高価なドライバーが用いられたそうです。",
                    "無事に救出されたことを受け、本人は次のようにコメントしています。",
                    "「非常に過酷なミッションでしたが、なんとかやり遂げることができました。これも全て応援してくださったみなさんのおかげです」"
                  ]
                }
              ]
            }
          },
          {
            sectionType: 'static',
            title: 'ABOUT',
            themeColor: '#f15a23',
            contents: {
              imageId: 'ssm-logo-landscape',
              article: [
                "スーパースターマインは大学サークル発、新進気鋭のゲーム制作チーム。",
                "面白いものが大好きです。"
              ],
              bottomButtonsLayout: 'left',
              bottomButtons: [
                {
                  title: 'お問い合わせ・連絡',
                  target: 'https://google.com'
                },
                {
                  title: 'Test',
                  target: 'toggleExpand'
                }
              ]
            }
          },
          {
            sectionType: 'cards',
            title: 'MEMBERS',
            themeColor: '#f7931d'
          }
        ]
      }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
