
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
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
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
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
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
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
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    function tick() {
        schedule_update();
        return resolved_promise;
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
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

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
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

    // (42:4) {#if title}
    function create_if_block_1(ctx) {
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(h2, "class", "svelte-1g2xbe3");
    			add_location(h2, file, 42, 6, 1080);
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
    		source: "(42:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#if subtitle}
    function create_if_block(ctx) {
    	let h3;
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(/*subtitle*/ ctx[1]);
    			attr_dev(h3, "class", "svelte-1g2xbe3");
    			add_location(h3, file, 45, 6, 1132);
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
    		source: "(45:4) {#if subtitle}",
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
    			attr_dev(div0, "class", "title-bar svelte-1g2xbe3");
    			add_location(div0, file, 40, 2, 1034);
    			attr_dev(div1, "class", "padding svelte-1g2xbe3");
    			add_location(div1, file, 48, 2, 1173);
    			attr_dev(section, "id", /*id*/ ctx[3]);
    			set_style(section, "--themeColor", /*themeColor*/ ctx[2]);
    			set_style(section, "--backgroundColor", /*backgroundColor*/ ctx[4]);
    			set_style(section, "--textColor", /*textColor*/ ctx[5]);
    			attr_dev(section, "class", "svelte-1g2xbe3");
    			add_location(section, file, 39, 0, 915);
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

    /* src/picture.svelte generated by Svelte v3.32.1 */
    const file$1 = "src/picture.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	child_ctx[23] = i;
    	return child_ctx;
    }

    // (42:2) {#each imageExtensionsShort as ext, i}
    function create_each_block(ctx) {
    	let source;
    	let source_type_value;
    	let source_srcset_value;

    	const block = {
    		c: function create() {
    			source = element("source");
    			attr_dev(source, "type", source_type_value = "image/" + /*ext*/ ctx[21]);
    			attr_dev(source, "sizes", /*sizes*/ ctx[1]);
    			attr_dev(source, "srcset", source_srcset_value = /*resolveSrcsets*/ ctx[16](/*imageDirectory*/ ctx[10], /*imageExtensionsShort*/ ctx[11], /*imageSizes*/ ctx[12], /*imageId*/ ctx[0], /*loading*/ ctx[15], /*tinyImageExtensionsShort*/ ctx[13], /*tinyImageSize*/ ctx[14])[/*i*/ ctx[23]]);
    			add_location(source, file$1, 42, 4, 1567);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, source, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imageExtensionsShort*/ 2048 && source_type_value !== (source_type_value = "image/" + /*ext*/ ctx[21])) {
    				attr_dev(source, "type", source_type_value);
    			}

    			if (dirty & /*sizes*/ 2) {
    				attr_dev(source, "sizes", /*sizes*/ ctx[1]);
    			}

    			if (dirty & /*imageDirectory, imageExtensionsShort, imageSizes, imageId, loading, tinyImageExtensionsShort, tinyImageSize*/ 64513 && source_srcset_value !== (source_srcset_value = /*resolveSrcsets*/ ctx[16](/*imageDirectory*/ ctx[10], /*imageExtensionsShort*/ ctx[11], /*imageSizes*/ ctx[12], /*imageId*/ ctx[0], /*loading*/ ctx[15], /*tinyImageExtensionsShort*/ ctx[13], /*tinyImageSize*/ ctx[14])[/*i*/ ctx[23]])) {
    				attr_dev(source, "srcset", source_srcset_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(source);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(42:2) {#each imageExtensionsShort as ext, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let picture;
    	let t;
    	let img;
    	let img_srcset_value;
    	let mounted;
    	let dispose;
    	let each_value = /*imageExtensionsShort*/ ctx[11];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			picture = element("picture");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			img = element("img");
    			attr_dev(img, "class", /*imgClass*/ ctx[6]);
    			attr_dev(img, "sizes", /*sizes*/ ctx[1]);
    			attr_dev(img, "srcset", img_srcset_value = /*resolveSrcsets*/ ctx[16](/*imageDirectory*/ ctx[10], /*imageExtensionsShort*/ ctx[11], /*imageSizes*/ ctx[12], /*imageId*/ ctx[0], /*loading*/ ctx[15], /*tinyImageExtensionsShort*/ ctx[13], /*tinyImageSize*/ ctx[14])[getSafeImageExtensionIndex(/*imageExtensionsShort*/ ctx[11])]);
    			attr_dev(img, "alt", /*alt*/ ctx[2]);
    			attr_dev(img, "width", /*width*/ ctx[3]);
    			attr_dev(img, "height", /*height*/ ctx[4]);
    			add_location(img, file$1, 44, 2, 1753);
    			attr_dev(picture, "class", /*pictureClass*/ ctx[5]);
    			attr_dev(picture, "title", /*title*/ ctx[8]);
    			attr_dev(picture, "style", /*style*/ ctx[9]);
    			add_location(picture, file$1, 40, 0, 1458);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, picture, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(picture, null);
    			}

    			append_dev(picture, t);
    			append_dev(picture, img);

    			if (!mounted) {
    				dispose = listen_dev(
    					picture,
    					"click",
    					function () {
    						if (is_function(/*click*/ ctx[7])) /*click*/ ctx[7].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*imageExtensionsShort, sizes, resolveSrcsets, imageDirectory, imageSizes, imageId, loading, tinyImageExtensionsShort, tinyImageSize*/ 130051) {
    				each_value = /*imageExtensionsShort*/ ctx[11];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(picture, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*imgClass*/ 64) {
    				attr_dev(img, "class", /*imgClass*/ ctx[6]);
    			}

    			if (dirty & /*sizes*/ 2) {
    				attr_dev(img, "sizes", /*sizes*/ ctx[1]);
    			}

    			if (dirty & /*imageDirectory, imageExtensionsShort, imageSizes, imageId, loading, tinyImageExtensionsShort, tinyImageSize*/ 64513 && img_srcset_value !== (img_srcset_value = /*resolveSrcsets*/ ctx[16](/*imageDirectory*/ ctx[10], /*imageExtensionsShort*/ ctx[11], /*imageSizes*/ ctx[12], /*imageId*/ ctx[0], /*loading*/ ctx[15], /*tinyImageExtensionsShort*/ ctx[13], /*tinyImageSize*/ ctx[14])[getSafeImageExtensionIndex(/*imageExtensionsShort*/ ctx[11])])) {
    				attr_dev(img, "srcset", img_srcset_value);
    			}

    			if (dirty & /*alt*/ 4) {
    				attr_dev(img, "alt", /*alt*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 8) {
    				attr_dev(img, "width", /*width*/ ctx[3]);
    			}

    			if (dirty & /*height*/ 16) {
    				attr_dev(img, "height", /*height*/ ctx[4]);
    			}

    			if (dirty & /*pictureClass*/ 32) {
    				attr_dev(picture, "class", /*pictureClass*/ ctx[5]);
    			}

    			if (dirty & /*title*/ 256) {
    				attr_dev(picture, "title", /*title*/ ctx[8]);
    			}

    			if (dirty & /*style*/ 512) {
    				attr_dev(picture, "style", /*style*/ ctx[9]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(picture);
    			destroy_each(each_blocks, detaching);
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

    function getSafeImageExtensionIndex(imageExtensionsShort) {
    	return imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Picture", slots, []);

    	let { contents } = $$props,
    		{ globalSettings } = $$props,
    		{ imageId } = $$props,
    		{ sizes = "100vw" } = $$props,
    		{ alt = `${imageId}の画像` } = $$props,
    		{ width } = $$props,
    		{ height } = $$props,
    		{ pictureClass } = $$props,
    		{ imgClass } = $$props,
    		{ click } = $$props,
    		{ title } = $$props,
    		{ style } = $$props,
    		{ useTiny } = $$props,
    		{ imageDirectory = contents.imageDirectory || globalSettings.imageDirectory } = $$props,
    		{ imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort } = $$props,
    		{ imageSizes = contents.imageSizes || globalSettings.imageSizes } = $$props,
    		{ tinyImageExtensionsShort = contents.tinyImageExtensionsShort || globalSettings.tinyImageExtensionsShort } = $$props,
    		{ tinyImageSize = contents.tinyImageSize || globalSettings.tinyImageSize } = $$props;

    	let loading = true;
    	const dispatch = createEventDispatcher();
    	addEventListener("load", () => $$invalidate(15, loading = false));

    	function resolveSrcsets(
    		imageDirectory,
    	imageExtensionsShort,
    	imageSizes,
    	imageId,
    	loading,
    	tinyImageExtensionsShort,
    	tinyImageSize
    	) {
    		return (loading && useTiny
    		? tinyImageExtensionsShort
    		: imageExtensionsShort).map(ext => {
    			if (loading && useTiny) {
    				return `${imageDirectory}${imageId}@${tinyImageSize}w.${ext} ${tinyImageSize}w`;
    			} else {
    				return imageSizes.map(size => `${imageDirectory}${imageId}@${size}w.${ext} ${size}w`);
    			}
    		});
    	}

    	const writable_props = [
    		"contents",
    		"globalSettings",
    		"imageId",
    		"sizes",
    		"alt",
    		"width",
    		"height",
    		"pictureClass",
    		"imgClass",
    		"click",
    		"title",
    		"style",
    		"useTiny",
    		"imageDirectory",
    		"imageExtensionsShort",
    		"imageSizes",
    		"tinyImageExtensionsShort",
    		"tinyImageSize"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Picture> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(17, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(18, globalSettings = $$props.globalSettings);
    		if ("imageId" in $$props) $$invalidate(0, imageId = $$props.imageId);
    		if ("sizes" in $$props) $$invalidate(1, sizes = $$props.sizes);
    		if ("alt" in $$props) $$invalidate(2, alt = $$props.alt);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    		if ("height" in $$props) $$invalidate(4, height = $$props.height);
    		if ("pictureClass" in $$props) $$invalidate(5, pictureClass = $$props.pictureClass);
    		if ("imgClass" in $$props) $$invalidate(6, imgClass = $$props.imgClass);
    		if ("click" in $$props) $$invalidate(7, click = $$props.click);
    		if ("title" in $$props) $$invalidate(8, title = $$props.title);
    		if ("style" in $$props) $$invalidate(9, style = $$props.style);
    		if ("useTiny" in $$props) $$invalidate(19, useTiny = $$props.useTiny);
    		if ("imageDirectory" in $$props) $$invalidate(10, imageDirectory = $$props.imageDirectory);
    		if ("imageExtensionsShort" in $$props) $$invalidate(11, imageExtensionsShort = $$props.imageExtensionsShort);
    		if ("imageSizes" in $$props) $$invalidate(12, imageSizes = $$props.imageSizes);
    		if ("tinyImageExtensionsShort" in $$props) $$invalidate(13, tinyImageExtensionsShort = $$props.tinyImageExtensionsShort);
    		if ("tinyImageSize" in $$props) $$invalidate(14, tinyImageSize = $$props.tinyImageSize);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		contents,
    		globalSettings,
    		imageId,
    		sizes,
    		alt,
    		width,
    		height,
    		pictureClass,
    		imgClass,
    		click,
    		title,
    		style,
    		useTiny,
    		imageDirectory,
    		imageExtensionsShort,
    		imageSizes,
    		tinyImageExtensionsShort,
    		tinyImageSize,
    		loading,
    		dispatch,
    		resolveSrcsets,
    		getSafeImageExtensionIndex
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(17, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(18, globalSettings = $$props.globalSettings);
    		if ("imageId" in $$props) $$invalidate(0, imageId = $$props.imageId);
    		if ("sizes" in $$props) $$invalidate(1, sizes = $$props.sizes);
    		if ("alt" in $$props) $$invalidate(2, alt = $$props.alt);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    		if ("height" in $$props) $$invalidate(4, height = $$props.height);
    		if ("pictureClass" in $$props) $$invalidate(5, pictureClass = $$props.pictureClass);
    		if ("imgClass" in $$props) $$invalidate(6, imgClass = $$props.imgClass);
    		if ("click" in $$props) $$invalidate(7, click = $$props.click);
    		if ("title" in $$props) $$invalidate(8, title = $$props.title);
    		if ("style" in $$props) $$invalidate(9, style = $$props.style);
    		if ("useTiny" in $$props) $$invalidate(19, useTiny = $$props.useTiny);
    		if ("imageDirectory" in $$props) $$invalidate(10, imageDirectory = $$props.imageDirectory);
    		if ("imageExtensionsShort" in $$props) $$invalidate(11, imageExtensionsShort = $$props.imageExtensionsShort);
    		if ("imageSizes" in $$props) $$invalidate(12, imageSizes = $$props.imageSizes);
    		if ("tinyImageExtensionsShort" in $$props) $$invalidate(13, tinyImageExtensionsShort = $$props.tinyImageExtensionsShort);
    		if ("tinyImageSize" in $$props) $$invalidate(14, tinyImageSize = $$props.tinyImageSize);
    		if ("loading" in $$props) $$invalidate(15, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		imageId,
    		sizes,
    		alt,
    		width,
    		height,
    		pictureClass,
    		imgClass,
    		click,
    		title,
    		style,
    		imageDirectory,
    		imageExtensionsShort,
    		imageSizes,
    		tinyImageExtensionsShort,
    		tinyImageSize,
    		loading,
    		resolveSrcsets,
    		contents,
    		globalSettings,
    		useTiny
    	];
    }

    class Picture extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			contents: 17,
    			globalSettings: 18,
    			imageId: 0,
    			sizes: 1,
    			alt: 2,
    			width: 3,
    			height: 4,
    			pictureClass: 5,
    			imgClass: 6,
    			click: 7,
    			title: 8,
    			style: 9,
    			useTiny: 19,
    			imageDirectory: 10,
    			imageExtensionsShort: 11,
    			imageSizes: 12,
    			tinyImageExtensionsShort: 13,
    			tinyImageSize: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Picture",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[17] === undefined && !("contents" in props)) {
    			console.warn("<Picture> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[18] === undefined && !("globalSettings" in props)) {
    			console.warn("<Picture> was created without expected prop 'globalSettings'");
    		}

    		if (/*imageId*/ ctx[0] === undefined && !("imageId" in props)) {
    			console.warn("<Picture> was created without expected prop 'imageId'");
    		}

    		if (/*width*/ ctx[3] === undefined && !("width" in props)) {
    			console.warn("<Picture> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[4] === undefined && !("height" in props)) {
    			console.warn("<Picture> was created without expected prop 'height'");
    		}

    		if (/*pictureClass*/ ctx[5] === undefined && !("pictureClass" in props)) {
    			console.warn("<Picture> was created without expected prop 'pictureClass'");
    		}

    		if (/*imgClass*/ ctx[6] === undefined && !("imgClass" in props)) {
    			console.warn("<Picture> was created without expected prop 'imgClass'");
    		}

    		if (/*click*/ ctx[7] === undefined && !("click" in props)) {
    			console.warn("<Picture> was created without expected prop 'click'");
    		}

    		if (/*title*/ ctx[8] === undefined && !("title" in props)) {
    			console.warn("<Picture> was created without expected prop 'title'");
    		}

    		if (/*style*/ ctx[9] === undefined && !("style" in props)) {
    			console.warn("<Picture> was created without expected prop 'style'");
    		}

    		if (/*useTiny*/ ctx[19] === undefined && !("useTiny" in props)) {
    			console.warn("<Picture> was created without expected prop 'useTiny'");
    		}
    	}

    	get contents() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageId() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageId(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sizes() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sizes(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pictureClass() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pictureClass(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgClass() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgClass(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get click() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set click(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useTiny() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useTiny(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageDirectory() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageDirectory(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageExtensionsShort() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageExtensionsShort(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageSizes() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageSizes(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tinyImageExtensionsShort() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tinyImageExtensionsShort(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tinyImageSize() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tinyImageSize(value) {
    		throw new Error("<Picture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/nav-header.svelte generated by Svelte v3.32.1 */
    const file$2 = "src/nav-header.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (67:4) {#each contents.items as item}
    function create_each_block$1(ctx) {
    	let div;
    	let t_value = /*item*/ ctx[11].label + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*item*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "header_navigation_list_items svelte-24qdv2");
    			add_location(div, file$2, 67, 6, 3087);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*contents*/ 1 && t_value !== (t_value = /*item*/ ctx[11].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(67:4) {#each contents.items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let header_1;
    	let picture;
    	let t0;
    	let input;
    	let t1;
    	let label0;
    	let svg0;
    	let path0;
    	let path1;
    	let t2;
    	let nav;
    	let label1;
    	let span2;
    	let span0;
    	let t4;
    	let span1;
    	let t6;
    	let svg1;
    	let path2;
    	let path3;
    	let t7;
    	let t8;
    	let div;
    	let svg2;
    	let current;

    	picture = new Picture({
    			props: {
    				click: /*func*/ ctx[5],
    				title: "クリックするとページの先頭に戻ります",
    				imgClass: "header_logo",
    				sizes: "30vw",
    				contents: /*contents*/ ctx[0],
    				globalSettings: /*globalSettings*/ ctx[1],
    				imageId: /*contents*/ ctx[0].imageId,
    				width: /*contents*/ ctx[0].aspectRatio.width,
    				height: /*contents*/ ctx[0].aspectRatio.height
    			},
    			$$inline: true
    		});

    	let each_value = /*contents*/ ctx[0].items;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			header_1 = element("header");
    			create_component(picture.$$.fragment);
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			label0 = element("label");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t2 = space();
    			nav = element("nav");
    			label1 = element("label");
    			span2 = element("span");
    			span0 = element("span");
    			span0.textContent = "ナビゲーション";
    			t4 = text("を");
    			span1 = element("span");
    			span1.textContent = "閉じる";
    			t6 = space();
    			svg1 = svg_element("svg");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			t7 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div = element("div");
    			svg2 = svg_element("svg");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "ui_button header_button_checkbox svelte-24qdv2");
    			input.checked = true;
    			attr_dev(input, "name", "header_button_checkbox");
    			attr_dev(input, "id", "header_button_checkbox");
    			add_location(input, file$2, 49, 2, 1988);
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "class", "svelte-24qdv2");
    			add_location(path0, file$2, 52, 6, 2293);
    			attr_dev(path1, "d", "M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z");
    			attr_dev(path1, "class", "svelte-24qdv2");
    			add_location(path1, file$2, 53, 6, 2338);
    			attr_dev(svg0, "class", "header_button_svg svelte-24qdv2");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			add_location(svg0, file$2, 51, 4, 2235);
    			attr_dev(label0, "for", "header_button_checkbox");
    			attr_dev(label0, "class", "header_button svelte-24qdv2");
    			attr_dev(label0, "title", "クリックするとナビゲーションを開閉できます");
    			add_location(label0, file$2, 50, 2, 2142);
    			attr_dev(span0, "class", "break-scope svelte-24qdv2");
    			add_location(span0, file$2, 59, 10, 2601);
    			attr_dev(span1, "class", "break-scope svelte-24qdv2");
    			add_location(span1, file$2, 59, 51, 2642);
    			attr_dev(span2, "class", "header_navigation_close_button_text svelte-24qdv2");
    			add_location(span2, file$2, 58, 8, 2540);
    			attr_dev(path2, "d", "M0 0h24v24H0z");
    			attr_dev(path2, "fill", "none");
    			attr_dev(path2, "class", "svelte-24qdv2");
    			add_location(path2, file$2, 62, 10, 2782);
    			attr_dev(path3, "d", "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z");
    			attr_dev(path3, "class", "svelte-24qdv2");
    			add_location(path3, file$2, 63, 10, 2830);
    			attr_dev(svg1, "class", "header_navigation_close_button_svg svelte-24qdv2");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			add_location(svg1, file$2, 61, 8, 2703);
    			attr_dev(label1, "for", "header_button_checkbox");
    			attr_dev(label1, "class", "header_navigation_close_button svelte-24qdv2");
    			add_location(label1, file$2, 57, 4, 2456);
    			attr_dev(svg2, "class", "header_button_svg svelte-24qdv2");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "fill", "white");
    			add_location(svg2, file$2, 70, 6, 3250);
    			attr_dev(div, "class", "header_button_dummy svelte-24qdv2");
    			add_location(div, file$2, 69, 4, 3210);
    			attr_dev(nav, "class", "header_navigation svelte-24qdv2");
    			add_location(nav, file$2, 56, 2, 2420);

    			attr_dev(header_1, "title", window.CSS.supports(`(backdrop-filter:blur(10px)) or (-webkit-backdrop-filter:blur(10px)) or (-moz-backdrop-filter:blur(10px)`)
    			? ""
    			: "Firefoxをお使いの方はabout:configを開いてbackdrop-filterを有効にすると他のブラウザーと同じ見た目にすることができます。");

    			set_style(header_1, "--itemsCount", /*contents*/ ctx[0].items.length);
    			attr_dev(header_1, "class", "svelte-24qdv2");
    			add_location(header_1, file$2, 47, 0, 1443);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header_1, anchor);
    			mount_component(picture, header_1, null);
    			append_dev(header_1, t0);
    			append_dev(header_1, input);
    			/*input_binding*/ ctx[6](input);
    			append_dev(header_1, t1);
    			append_dev(header_1, label0);
    			append_dev(label0, svg0);
    			append_dev(svg0, path0);
    			append_dev(svg0, path1);
    			append_dev(header_1, t2);
    			append_dev(header_1, nav);
    			append_dev(nav, label1);
    			append_dev(label1, span2);
    			append_dev(span2, span0);
    			append_dev(span2, t4);
    			append_dev(span2, span1);
    			append_dev(label1, t6);
    			append_dev(label1, svg1);
    			append_dev(svg1, path2);
    			append_dev(svg1, path3);
    			append_dev(nav, t7);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}

    			append_dev(nav, t8);
    			append_dev(nav, div);
    			append_dev(div, svg2);
    			/*header_1_binding*/ ctx[8](header_1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const picture_changes = {};
    			if (dirty & /*contents*/ 1) picture_changes.contents = /*contents*/ ctx[0];
    			if (dirty & /*globalSettings*/ 2) picture_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*contents*/ 1) picture_changes.imageId = /*contents*/ ctx[0].imageId;
    			if (dirty & /*contents*/ 1) picture_changes.width = /*contents*/ ctx[0].aspectRatio.width;
    			if (dirty & /*contents*/ 1) picture_changes.height = /*contents*/ ctx[0].aspectRatio.height;
    			picture.$set(picture_changes);

    			if (dirty & /*triggerSmoothScroll, contents*/ 17) {
    				each_value = /*contents*/ ctx[0].items;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(nav, t8);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*contents*/ 1) {
    				set_style(header_1, "--itemsCount", /*contents*/ ctx[0].items.length);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(picture.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(picture.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header_1);
    			destroy_component(picture);
    			/*input_binding*/ ctx[6](null);
    			destroy_each(each_blocks, detaching);
    			/*header_1_binding*/ ctx[8](null);
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

    const scroll_duration = 400; //ms

    function easeInOutCubic(x) {
    	return x < 0.5
    	? 4 * x * x * x
    	: 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Nav_header", slots, []);
    	let { contents } = $$props, { globalSettings } = $$props;
    	let header, checkbox;
    	let abort_scroll = false;

    	function smoothScroll(time, start_time, origin, destination) {
    		if (time == start_time) {
    			$$invalidate(3, checkbox.checked = false, checkbox);
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

    	const func = () => triggerSmoothScroll("top");

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			checkbox = $$value;
    			$$invalidate(3, checkbox);
    		});
    	}

    	const click_handler = item => triggerSmoothScroll(item.id);

    	function header_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			header = $$value;
    			$$invalidate(2, header);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Picture,
    		contents,
    		globalSettings,
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
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("header" in $$props) $$invalidate(2, header = $$props.header);
    		if ("checkbox" in $$props) $$invalidate(3, checkbox = $$props.checkbox);
    		if ("abort_scroll" in $$props) abort_scroll = $$props.abort_scroll;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		contents,
    		globalSettings,
    		header,
    		checkbox,
    		triggerSmoothScroll,
    		func,
    		input_binding,
    		click_handler,
    		header_1_binding
    	];
    }

    class Nav_header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { contents: 0, globalSettings: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav_header",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Nav_header> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[1] === undefined && !("globalSettings" in props)) {
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

    const file$3 = "src/button.svelte";

    // (45:0) {:else}
    function create_else_block(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "style", /*style*/ ctx[2]);
    			button.disabled = /*disabled*/ ctx[1];
    			attr_dev(button, "class", "svelte-15tl0g9");
    			add_location(button, file$3, 45, 2, 1061);
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
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*style*/ 4) {
    				attr_dev(button, "style", /*style*/ ctx[2]);
    			}

    			if (!current || dirty & /*disabled*/ 2) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[1]);
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
    		source: "(45:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:0) {#if isAnchor}
    function create_if_block$1(ctx) {
    	let a;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*target*/ ctx[0]);
    			attr_dev(a, "style", /*style*/ ctx[2]);
    			attr_dev(a, "disabled", /*disabled*/ ctx[1]);
    			attr_dev(a, "class", "svelte-15tl0g9");
    			add_location(a, file$3, 43, 2, 987);
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
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*target*/ 1) {
    				attr_dev(a, "href", /*target*/ ctx[0]);
    			}

    			if (!current || dirty & /*style*/ 4) {
    				attr_dev(a, "style", /*style*/ ctx[2]);
    			}

    			if (!current || dirty & /*disabled*/ 2) {
    				attr_dev(a, "disabled", /*disabled*/ ctx[1]);
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
    		source: "(43:0) {#if isAnchor}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isAnchor*/ ctx[3]) return 0;
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);

    	let { target } = $$props,
    		{ disabled = false } = $$props,
    		{ marginLeft } = $$props,
    		{ marginRight } = $$props,
    		{ width = "45%" } = $$props,
    		{ bg } = $$props;

    	let isAnchor = RegExp("^https?://").test(target);
    	let style = "";

    	if (!isAnchor) {
    		let event = new CustomEvent(target);

    		target = function () {
    			document.dispatchEvent(event);
    		};
    	}

    	if (!marginLeft && !marginRight) {
    		style = "margin-left: 0;margin-right: 0;";
    	} else if (!marginRight) {
    		style = "margin-right: 0;";
    	} else if (!marginLeft) {
    		style = "margin-left: 0;";
    	}

    	if (disabled) {
    		style = style + "--themeColor: #aaa;";
    	} else if (bg) {
    		style = style + `--themeColor: ${bg};`;
    	}

    	style = style + `width:${width};`;
    	const writable_props = ["target", "disabled", "marginLeft", "marginRight", "width", "bg"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("target" in $$props) $$invalidate(0, target = $$props.target);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("marginLeft" in $$props) $$invalidate(4, marginLeft = $$props.marginLeft);
    		if ("marginRight" in $$props) $$invalidate(5, marginRight = $$props.marginRight);
    		if ("width" in $$props) $$invalidate(6, width = $$props.width);
    		if ("bg" in $$props) $$invalidate(7, bg = $$props.bg);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		target,
    		disabled,
    		marginLeft,
    		marginRight,
    		width,
    		bg,
    		isAnchor,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ("target" in $$props) $$invalidate(0, target = $$props.target);
    		if ("disabled" in $$props) $$invalidate(1, disabled = $$props.disabled);
    		if ("marginLeft" in $$props) $$invalidate(4, marginLeft = $$props.marginLeft);
    		if ("marginRight" in $$props) $$invalidate(5, marginRight = $$props.marginRight);
    		if ("width" in $$props) $$invalidate(6, width = $$props.width);
    		if ("bg" in $$props) $$invalidate(7, bg = $$props.bg);
    		if ("isAnchor" in $$props) $$invalidate(3, isAnchor = $$props.isAnchor);
    		if ("style" in $$props) $$invalidate(2, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		target,
    		disabled,
    		style,
    		isAnchor,
    		marginLeft,
    		marginRight,
    		width,
    		bg,
    		$$scope,
    		slots
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			target: 0,
    			disabled: 1,
    			marginLeft: 4,
    			marginRight: 5,
    			width: 6,
    			bg: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*target*/ ctx[0] === undefined && !("target" in props)) {
    			console.warn("<Button> was created without expected prop 'target'");
    		}

    		if (/*marginLeft*/ ctx[4] === undefined && !("marginLeft" in props)) {
    			console.warn("<Button> was created without expected prop 'marginLeft'");
    		}

    		if (/*marginRight*/ ctx[5] === undefined && !("marginRight" in props)) {
    			console.warn("<Button> was created without expected prop 'marginRight'");
    		}

    		if (/*bg*/ ctx[7] === undefined && !("bg" in props)) {
    			console.warn("<Button> was created without expected prop 'bg'");
    		}
    	}

    	get target() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
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

    	get width() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bg() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bg(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/static-content.svelte generated by Svelte v3.32.1 */
    const file$4 = "src/static-content.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (18:6) {#each article as article}
    function create_each_block_2(ctx) {
    	let p;
    	let t_value = /*article*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-14m4gfi");
    			add_location(p, file$4, 18, 8, 747);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*article*/ 16 && t_value !== (t_value = /*article*/ ctx[4] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(18:6) {#each article as article}",
    		ctx
    	});

    	return block;
    }

    // (29:10) {:else}
    function create_else_block$1(ctx) {
    	let t_value = /*button*/ ctx[6].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*buttons*/ 8 && t_value !== (t_value = /*button*/ ctx[6].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(29:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:10) {#if Array.isArray(button.title)}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*button*/ ctx[6].title;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*buttons*/ 8) {
    				each_value_1 = /*button*/ ctx[6].title;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(25:10) {#if Array.isArray(button.title)}",
    		ctx
    	});

    	return block;
    }

    // (26:12) {#each button.title as title}
    function create_each_block_1(ctx) {
    	let span;
    	let t_value = /*title*/ ctx[9] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "break-scope");
    			add_location(span, file$4, 26, 14, 997);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*buttons*/ 8 && t_value !== (t_value = /*title*/ ctx[9] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(26:12) {#each button.title as title}",
    		ctx
    	});

    	return block;
    }

    // (24:8) <Button target="{button.target}">
    function create_default_slot(ctx) {
    	let show_if;
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (show_if == null || dirty & /*buttons*/ 8) show_if = !!Array.isArray(/*button*/ ctx[6].title);
    		if (show_if) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(24:8) <Button target=\\\"{button.target}\\\">",
    		ctx
    	});

    	return block;
    }

    // (23:6) {#each buttons as button}
    function create_each_block$2(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				target: /*button*/ ctx[6].target,
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
    			if (dirty & /*buttons*/ 8) button_changes.target = /*button*/ ctx[6].target;

    			if (dirty & /*$$scope, buttons*/ 16392) {
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(23:6) {#each buttons as button}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let picture;
    	let t0;
    	let div0;
    	let t1;
    	let section2;
    	let section0;
    	let t2;
    	let section1;
    	let current;

    	picture = new Picture({
    			props: {
    				pictureClass: "static-picture",
    				imgClass: "static-img",
    				sizes: "@media screen and (orientation: portrait) " + /*standardWidth*/ ctx[2] + "vw, " + /*standardWidth*/ ctx[2] * 0.35 + "vw",
    				contents: /*contents*/ ctx[0],
    				globalSettings: /*globalSettings*/ ctx[1],
    				imageId: /*contents*/ ctx[0].imageId,
    				width: /*contents*/ ctx[0].aspectRatio.width,
    				height: /*contents*/ ctx[0].aspectRatio.height,
    				style: "width:100%"
    			},
    			$$inline: true
    		});

    	let each_value_2 = /*article*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*buttons*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(picture.$$.fragment);
    			t0 = space();
    			div0 = element("div");
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

    			attr_dev(div0, "class", "spacer svelte-14m4gfi");
    			add_location(div0, file$4, 14, 2, 619);
    			attr_dev(section0, "class", "text svelte-14m4gfi");
    			add_location(section0, file$4, 16, 4, 683);
    			attr_dev(section1, "class", "buttons svelte-14m4gfi");
    			add_location(section1, file$4, 21, 4, 797);
    			attr_dev(section2, "class", "right-column svelte-14m4gfi");
    			add_location(section2, file$4, 15, 2, 648);
    			attr_dev(div1, "class", "container svelte-14m4gfi");
    			add_location(div1, file$4, 12, 0, 288);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(picture, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, section2);
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
    			const picture_changes = {};
    			if (dirty & /*standardWidth*/ 4) picture_changes.sizes = "@media screen and (orientation: portrait) " + /*standardWidth*/ ctx[2] + "vw, " + /*standardWidth*/ ctx[2] * 0.35 + "vw";
    			if (dirty & /*contents*/ 1) picture_changes.contents = /*contents*/ ctx[0];
    			if (dirty & /*globalSettings*/ 2) picture_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*contents*/ 1) picture_changes.imageId = /*contents*/ ctx[0].imageId;
    			if (dirty & /*contents*/ 1) picture_changes.width = /*contents*/ ctx[0].aspectRatio.width;
    			if (dirty & /*contents*/ 1) picture_changes.height = /*contents*/ ctx[0].aspectRatio.height;
    			picture.$set(picture_changes);

    			if (dirty & /*article*/ 16) {
    				each_value_2 = /*article*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(section0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*buttons, Array*/ 8) {
    				each_value = /*buttons*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    			transition_in(picture.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(picture.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(picture);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
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
    	validate_slots("Static_content", slots, []);

    	let { contents } = $$props,
    		{ globalSettings } = $$props,
    		{ standardWidth } = $$props,
    		{ article = contents.article } = $$props,
    		{ buttonsLayout = contents.bottomButtonsLayout } = $$props,
    		{ buttons = contents.bottomButtons } = $$props;

    	const writable_props = [
    		"contents",
    		"globalSettings",
    		"standardWidth",
    		"article",
    		"buttonsLayout",
    		"buttons"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Static_content> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
    		if ("article" in $$props) $$invalidate(4, article = $$props.article);
    		if ("buttonsLayout" in $$props) $$invalidate(5, buttonsLayout = $$props.buttonsLayout);
    		if ("buttons" in $$props) $$invalidate(3, buttons = $$props.buttons);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Picture,
    		contents,
    		globalSettings,
    		standardWidth,
    		article,
    		buttonsLayout,
    		buttons
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
    		if ("article" in $$props) $$invalidate(4, article = $$props.article);
    		if ("buttonsLayout" in $$props) $$invalidate(5, buttonsLayout = $$props.buttonsLayout);
    		if ("buttons" in $$props) $$invalidate(3, buttons = $$props.buttons);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contents, globalSettings, standardWidth, buttons, article, buttonsLayout];
    }

    class Static_content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			contents: 0,
    			globalSettings: 1,
    			standardWidth: 2,
    			article: 4,
    			buttonsLayout: 5,
    			buttons: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Static_content",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Static_content> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[1] === undefined && !("globalSettings" in props)) {
    			console.warn("<Static_content> was created without expected prop 'globalSettings'");
    		}

    		if (/*standardWidth*/ ctx[2] === undefined && !("standardWidth" in props)) {
    			console.warn("<Static_content> was created without expected prop 'standardWidth'");
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

    	get standardWidth() {
    		throw new Error("<Static_content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set standardWidth(value) {
    		throw new Error("<Static_content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get article() {
    		throw new Error("<Static_content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set article(value) {
    		throw new Error("<Static_content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonsLayout() {
    		throw new Error("<Static_content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonsLayout(value) {
    		throw new Error("<Static_content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttons() {
    		throw new Error("<Static_content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttons(value) {
    		throw new Error("<Static_content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/image-list.svelte generated by Svelte v3.32.1 */
    const file$5 = "src/image-list.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (17:6) {:else}
    function create_else_block$2(ctx) {
    	let span;
    	let t_value = /*article*/ ctx[3].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "title");
    			add_location(span, file$5, 17, 8, 805);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && t_value !== (t_value = /*article*/ ctx[3].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(17:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (13:6) {#if Array.isArray(article.title)}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*article*/ ctx[3].title;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1) {
    				each_value_1 = /*article*/ ctx[3].title;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(13:6) {#if Array.isArray(article.title)}",
    		ctx
    	});

    	return block;
    }

    // (14:8) {#each article.title as title}
    function create_each_block_1$1(ctx) {
    	let span;
    	let t_value = /*title*/ ctx[6] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "title break-scope");
    			add_location(span, file$5, 14, 10, 720);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && t_value !== (t_value = /*title*/ ctx[6] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(14:8) {#each article.title as title}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#each contents.articles as article}
    function create_each_block$3(ctx) {
    	let article;
    	let picture;
    	let t0;
    	let a;
    	let show_if;
    	let t1;
    	let time;

    	let t2_value = (/*article*/ ctx[3].date.year
    	? ("0000" + /*article*/ ctx[3].date.year).slice(-4)
    	: "") + (/*article*/ ctx[3].date.month
    	? "/" + ("00" + /*article*/ ctx[3].date.month).slice(-2)
    	: "") + (/*article*/ ctx[3].date.day
    	? "/" + ("00" + /*article*/ ctx[3].date.day).slice(-2)
    	: "") + "";

    	let t2;
    	let time_datetime_value;
    	let a_href_value;
    	let t3;
    	let current;

    	picture = new Picture({
    			props: {
    				pictureClass: "il-picture",
    				imgClass: "il-img",
    				sizes: "@media screen and (orientation: portrait) " + /*standardWidth*/ ctx[2] + "vw, " + /*standardWidth*/ ctx[2] * 0.3 + "vw",
    				contents: /*contents*/ ctx[0],
    				globalSettings: /*globalSettings*/ ctx[1],
    				imageId: /*article*/ ctx[3].imageId || /*contents*/ ctx[0].fallbackImageId,
    				width: /*contents*/ ctx[0].aspectRatio.width,
    				height: /*contents*/ ctx[0].aspectRatio.height
    			},
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (show_if == null || dirty & /*contents*/ 1) show_if = !!Array.isArray(/*article*/ ctx[3].title);
    		if (show_if) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			create_component(picture.$$.fragment);
    			t0 = space();
    			a = element("a");
    			if_block.c();
    			t1 = space();
    			time = element("time");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(time, "class", "date svelte-tw98i3");

    			attr_dev(time, "datetime", time_datetime_value = (/*article*/ ctx[3].date.year
    			? ("0000" + /*article*/ ctx[3].date.year).slice(-4)
    			: "") + (/*article*/ ctx[3].date.month
    			? "-" + ("00" + /*article*/ ctx[3].date.month).slice(-2)
    			: "") + (/*article*/ ctx[3].date.day
    			? "-" + ("00" + /*article*/ ctx[3].date.day).slice(-2)
    			: ""));

    			add_location(time, file$5, 20, 6, 920);
    			attr_dev(a, "class", "title-container svelte-tw98i3");
    			attr_dev(a, "href", a_href_value = /*article*/ ctx[3].url);
    			add_location(a, file$5, 11, 4, 583);
    			attr_dev(article, "class", "svelte-tw98i3");
    			add_location(article, file$5, 9, 2, 263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			mount_component(picture, article, null);
    			append_dev(article, t0);
    			append_dev(article, a);
    			if_block.m(a, null);
    			append_dev(a, t1);
    			append_dev(a, time);
    			append_dev(time, t2);
    			append_dev(article, t3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const picture_changes = {};
    			if (dirty & /*standardWidth*/ 4) picture_changes.sizes = "@media screen and (orientation: portrait) " + /*standardWidth*/ ctx[2] + "vw, " + /*standardWidth*/ ctx[2] * 0.3 + "vw";
    			if (dirty & /*contents*/ 1) picture_changes.contents = /*contents*/ ctx[0];
    			if (dirty & /*globalSettings*/ 2) picture_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*contents*/ 1) picture_changes.imageId = /*article*/ ctx[3].imageId || /*contents*/ ctx[0].fallbackImageId;
    			if (dirty & /*contents*/ 1) picture_changes.width = /*contents*/ ctx[0].aspectRatio.width;
    			if (dirty & /*contents*/ 1) picture_changes.height = /*contents*/ ctx[0].aspectRatio.height;
    			picture.$set(picture_changes);

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(a, t1);
    				}
    			}

    			if ((!current || dirty & /*contents*/ 1) && t2_value !== (t2_value = (/*article*/ ctx[3].date.year
    			? ("0000" + /*article*/ ctx[3].date.year).slice(-4)
    			: "") + (/*article*/ ctx[3].date.month
    			? "/" + ("00" + /*article*/ ctx[3].date.month).slice(-2)
    			: "") + (/*article*/ ctx[3].date.day
    			? "/" + ("00" + /*article*/ ctx[3].date.day).slice(-2)
    			: "") + "")) set_data_dev(t2, t2_value);

    			if (!current || dirty & /*contents*/ 1 && time_datetime_value !== (time_datetime_value = (/*article*/ ctx[3].date.year
    			? ("0000" + /*article*/ ctx[3].date.year).slice(-4)
    			: "") + (/*article*/ ctx[3].date.month
    			? "-" + ("00" + /*article*/ ctx[3].date.month).slice(-2)
    			: "") + (/*article*/ ctx[3].date.day
    			? "-" + ("00" + /*article*/ ctx[3].date.day).slice(-2)
    			: ""))) {
    				attr_dev(time, "datetime", time_datetime_value);
    			}

    			if (!current || dirty & /*contents*/ 1 && a_href_value !== (a_href_value = /*article*/ ctx[3].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(picture.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(picture.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(picture);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(9:0) {#each contents.articles as article}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*contents*/ ctx[0].articles;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*contents, Array, standardWidth, globalSettings*/ 7) {
    				each_value = /*contents*/ ctx[0].articles;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
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

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Image_list", slots, []);

    	let { contents } = $$props,
    		{ globalSettings } = $$props,
    		{ standardWidth } = $$props;

    	document.addEventListener("toggleExpand", () => alert("done!"));
    	const writable_props = ["contents", "globalSettings", "standardWidth"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Image_list> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Picture,
    		contents,
    		globalSettings,
    		standardWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contents, globalSettings, standardWidth];
    }

    class Image_list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			contents: 0,
    			globalSettings: 1,
    			standardWidth: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image_list",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Image_list> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[1] === undefined && !("globalSettings" in props)) {
    			console.warn("<Image_list> was created without expected prop 'globalSettings'");
    		}

    		if (/*standardWidth*/ ctx[2] === undefined && !("standardWidth" in props)) {
    			console.warn("<Image_list> was created without expected prop 'standardWidth'");
    		}
    	}

    	get contents() {
    		throw new Error("<Image_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Image_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Image_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Image_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get standardWidth() {
    		throw new Error("<Image_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set standardWidth(value) {
    		throw new Error("<Image_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * SSR Window 3.0.0
     * Better handling for window object in SSR environment
     * https://github.com/nolimits4web/ssr-window
     *
     * Copyright 2020, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: November 9, 2020
     */
    /* eslint-disable no-param-reassign */
    function isObject(obj) {
        return (obj !== null &&
            typeof obj === 'object' &&
            'constructor' in obj &&
            obj.constructor === Object);
    }
    function extend(target, src) {
        if (target === void 0) { target = {}; }
        if (src === void 0) { src = {}; }
        Object.keys(src).forEach(function (key) {
            if (typeof target[key] === 'undefined')
                target[key] = src[key];
            else if (isObject(src[key]) &&
                isObject(target[key]) &&
                Object.keys(src[key]).length > 0) {
                extend(target[key], src[key]);
            }
        });
    }

    var ssrDocument = {
        body: {},
        addEventListener: function () { },
        removeEventListener: function () { },
        activeElement: {
            blur: function () { },
            nodeName: '',
        },
        querySelector: function () {
            return null;
        },
        querySelectorAll: function () {
            return [];
        },
        getElementById: function () {
            return null;
        },
        createEvent: function () {
            return {
                initEvent: function () { },
            };
        },
        createElement: function () {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute: function () { },
                getElementsByTagName: function () {
                    return [];
                },
            };
        },
        createElementNS: function () {
            return {};
        },
        importNode: function () {
            return null;
        },
        location: {
            hash: '',
            host: '',
            hostname: '',
            href: '',
            origin: '',
            pathname: '',
            protocol: '',
            search: '',
        },
    };
    function getDocument() {
        var doc = typeof document !== 'undefined' ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }

    var ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: '',
        },
        location: {
            hash: '',
            host: '',
            hostname: '',
            href: '',
            origin: '',
            pathname: '',
            protocol: '',
            search: '',
        },
        history: {
            replaceState: function () { },
            pushState: function () { },
            go: function () { },
            back: function () { },
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener: function () { },
        removeEventListener: function () { },
        getComputedStyle: function () {
            return {
                getPropertyValue: function () {
                    return '';
                },
            };
        },
        Image: function () { },
        Date: function () { },
        screen: {},
        setTimeout: function () { },
        clearTimeout: function () { },
        matchMedia: function () {
            return {};
        },
        requestAnimationFrame: function (callback) {
            if (typeof setTimeout === 'undefined') {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame: function (id) {
            if (typeof setTimeout === 'undefined') {
                return;
            }
            clearTimeout(id);
        },
    };
    function getWindow() {
        var win = typeof window !== 'undefined' ? window : {};
        extend(win, ssrWindow);
        return win;
    }

    /**
     * Dom7 3.0.0
     * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
     * https://framework7.io/docs/dom7.html
     *
     * Copyright 2020, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: November 9, 2020
     */

    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if (Class) _setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }

      return _construct.apply(null, arguments);
    }

    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }

    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? new Map() : undefined;

      _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !_isNativeFunction(Class)) return Class;

        if (typeof Class !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }

        if (typeof _cache !== "undefined") {
          if (_cache.has(Class)) return _cache.get(Class);

          _cache.set(Class, Wrapper);
        }

        function Wrapper() {
          return _construct(Class, arguments, _getPrototypeOf(this).constructor);
        }

        Wrapper.prototype = Object.create(Class.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        return _setPrototypeOf(Wrapper, Class);
      };

      return _wrapNativeSuper(Class);
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    /* eslint-disable no-proto */
    function makeReactive(obj) {
      var proto = obj.__proto__;
      Object.defineProperty(obj, '__proto__', {
        get: function get() {
          return proto;
        },
        set: function set(value) {
          proto.__proto__ = value;
        }
      });
    }

    var Dom7 = /*#__PURE__*/function (_Array) {
      _inheritsLoose(Dom7, _Array);

      function Dom7(items) {
        var _this;

        _this = _Array.call.apply(_Array, [this].concat(items)) || this;
        makeReactive(_assertThisInitialized(_this));
        return _this;
      }

      return Dom7;
    }( /*#__PURE__*/_wrapNativeSuper(Array));

    function arrayFlat(arr) {
      if (arr === void 0) {
        arr = [];
      }

      var res = [];
      arr.forEach(function (el) {
        if (Array.isArray(el)) {
          res.push.apply(res, arrayFlat(el));
        } else {
          res.push(el);
        }
      });
      return res;
    }
    function arrayFilter(arr, callback) {
      return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
      var uniqueArray = [];

      for (var i = 0; i < arr.length; i += 1) {
        if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
      }

      return uniqueArray;
    }

    function qsa(selector, context) {
      if (typeof selector !== 'string') {
        return [selector];
      }

      var a = [];
      var res = context.querySelectorAll(selector);

      for (var i = 0; i < res.length; i += 1) {
        a.push(res[i]);
      }

      return a;
    }

    function $(selector, context) {
      var window = getWindow();
      var document = getDocument();
      var arr = [];

      if (!context && selector instanceof Dom7) {
        return selector;
      }

      if (!selector) {
        return new Dom7(arr);
      }

      if (typeof selector === 'string') {
        var html = selector.trim();

        if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
          var toCreate = 'div';
          if (html.indexOf('<li') === 0) toCreate = 'ul';
          if (html.indexOf('<tr') === 0) toCreate = 'tbody';
          if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
          if (html.indexOf('<tbody') === 0) toCreate = 'table';
          if (html.indexOf('<option') === 0) toCreate = 'select';
          var tempParent = document.createElement(toCreate);
          tempParent.innerHTML = html;

          for (var i = 0; i < tempParent.childNodes.length; i += 1) {
            arr.push(tempParent.childNodes[i]);
          }
        } else {
          arr = qsa(selector.trim(), context || document);
        } // arr = qsa(selector, document);

      } else if (selector.nodeType || selector === window || selector === document) {
        arr.push(selector);
      } else if (Array.isArray(selector)) {
        if (selector instanceof Dom7) return selector;
        arr = selector;
      }

      return new Dom7(arrayUnique(arr));
    }

    $.fn = Dom7.prototype;

    function addClass() {
      for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
        classes[_key] = arguments[_key];
      }

      var classNames = arrayFlat(classes.map(function (c) {
        return c.split(' ');
      }));
      this.forEach(function (el) {
        var _el$classList;

        (_el$classList = el.classList).add.apply(_el$classList, classNames);
      });
      return this;
    }

    function removeClass() {
      for (var _len2 = arguments.length, classes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        classes[_key2] = arguments[_key2];
      }

      var classNames = arrayFlat(classes.map(function (c) {
        return c.split(' ');
      }));
      this.forEach(function (el) {
        var _el$classList2;

        (_el$classList2 = el.classList).remove.apply(_el$classList2, classNames);
      });
      return this;
    }

    function toggleClass() {
      for (var _len3 = arguments.length, classes = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        classes[_key3] = arguments[_key3];
      }

      var classNames = arrayFlat(classes.map(function (c) {
        return c.split(' ');
      }));
      this.forEach(function (el) {
        classNames.forEach(function (className) {
          el.classList.toggle(className);
        });
      });
    }

    function hasClass() {
      for (var _len4 = arguments.length, classes = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        classes[_key4] = arguments[_key4];
      }

      var classNames = arrayFlat(classes.map(function (c) {
        return c.split(' ');
      }));
      return arrayFilter(this, function (el) {
        return classNames.filter(function (className) {
          return el.classList.contains(className);
        }).length > 0;
      }).length > 0;
    }

    function attr$1(attrs, value) {
      if (arguments.length === 1 && typeof attrs === 'string') {
        // Get attr
        if (this[0]) return this[0].getAttribute(attrs);
        return undefined;
      } // Set attrs


      for (var i = 0; i < this.length; i += 1) {
        if (arguments.length === 2) {
          // String
          this[i].setAttribute(attrs, value);
        } else {
          // Object
          for (var attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
          }
        }
      }

      return this;
    }

    function removeAttr(attr) {
      for (var i = 0; i < this.length; i += 1) {
        this[i].removeAttribute(attr);
      }

      return this;
    }

    function transform(transform) {
      for (var i = 0; i < this.length; i += 1) {
        this[i].style.transform = transform;
      }

      return this;
    }

    function transition(duration) {
      for (var i = 0; i < this.length; i += 1) {
        this[i].style.transitionDuration = typeof duration !== 'string' ? duration + "ms" : duration;
      }

      return this;
    }

    function on() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      var eventType = args[0],
          targetSelector = args[1],
          listener = args[2],
          capture = args[3];

      if (typeof args[1] === 'function') {
        eventType = args[0];
        listener = args[1];
        capture = args[2];
        targetSelector = undefined;
      }

      if (!capture) capture = false;

      function handleLiveEvent(e) {
        var target = e.target;
        if (!target) return;
        var eventData = e.target.dom7EventData || [];

        if (eventData.indexOf(e) < 0) {
          eventData.unshift(e);
        }

        if ($(target).is(targetSelector)) listener.apply(target, eventData);else {
          var _parents = $(target).parents(); // eslint-disable-line


          for (var k = 0; k < _parents.length; k += 1) {
            if ($(_parents[k]).is(targetSelector)) listener.apply(_parents[k], eventData);
          }
        }
      }

      function handleEvent(e) {
        var eventData = e && e.target ? e.target.dom7EventData || [] : [];

        if (eventData.indexOf(e) < 0) {
          eventData.unshift(e);
        }

        listener.apply(this, eventData);
      }

      var events = eventType.split(' ');
      var j;

      for (var i = 0; i < this.length; i += 1) {
        var el = this[i];

        if (!targetSelector) {
          for (j = 0; j < events.length; j += 1) {
            var event = events[j];
            if (!el.dom7Listeners) el.dom7Listeners = {};
            if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
            el.dom7Listeners[event].push({
              listener: listener,
              proxyListener: handleEvent
            });
            el.addEventListener(event, handleEvent, capture);
          }
        } else {
          // Live events
          for (j = 0; j < events.length; j += 1) {
            var _event = events[j];
            if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
            if (!el.dom7LiveListeners[_event]) el.dom7LiveListeners[_event] = [];

            el.dom7LiveListeners[_event].push({
              listener: listener,
              proxyListener: handleLiveEvent
            });

            el.addEventListener(_event, handleLiveEvent, capture);
          }
        }
      }

      return this;
    }

    function off() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      var eventType = args[0],
          targetSelector = args[1],
          listener = args[2],
          capture = args[3];

      if (typeof args[1] === 'function') {
        eventType = args[0];
        listener = args[1];
        capture = args[2];
        targetSelector = undefined;
      }

      if (!capture) capture = false;
      var events = eventType.split(' ');

      for (var i = 0; i < events.length; i += 1) {
        var event = events[i];

        for (var j = 0; j < this.length; j += 1) {
          var el = this[j];
          var handlers = void 0;

          if (!targetSelector && el.dom7Listeners) {
            handlers = el.dom7Listeners[event];
          } else if (targetSelector && el.dom7LiveListeners) {
            handlers = el.dom7LiveListeners[event];
          }

          if (handlers && handlers.length) {
            for (var k = handlers.length - 1; k >= 0; k -= 1) {
              var handler = handlers[k];

              if (listener && handler.listener === listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              } else if (!listener) {
                el.removeEventListener(event, handler.proxyListener, capture);
                handlers.splice(k, 1);
              }
            }
          }
        }
      }

      return this;
    }

    function trigger() {
      var window = getWindow();

      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      var events = args[0].split(' ');
      var eventData = args[1];

      for (var i = 0; i < events.length; i += 1) {
        var event = events[i];

        for (var j = 0; j < this.length; j += 1) {
          var el = this[j];

          if (window.CustomEvent) {
            var evt = new window.CustomEvent(event, {
              detail: eventData,
              bubbles: true,
              cancelable: true
            });
            el.dom7EventData = args.filter(function (data, dataIndex) {
              return dataIndex > 0;
            });
            el.dispatchEvent(evt);
            el.dom7EventData = [];
            delete el.dom7EventData;
          }
        }
      }

      return this;
    }

    function transitionEnd(callback) {
      var dom = this;

      function fireCallBack(e) {
        if (e.target !== this) return;
        callback.call(this, e);
        dom.off('transitionend', fireCallBack);
      }

      if (callback) {
        dom.on('transitionend', fireCallBack);
      }

      return this;
    }

    function outerWidth(includeMargins) {
      if (this.length > 0) {
        if (includeMargins) {
          var _styles = this.styles();

          return this[0].offsetWidth + parseFloat(_styles.getPropertyValue('margin-right')) + parseFloat(_styles.getPropertyValue('margin-left'));
        }

        return this[0].offsetWidth;
      }

      return null;
    }

    function outerHeight(includeMargins) {
      if (this.length > 0) {
        if (includeMargins) {
          var _styles2 = this.styles();

          return this[0].offsetHeight + parseFloat(_styles2.getPropertyValue('margin-top')) + parseFloat(_styles2.getPropertyValue('margin-bottom'));
        }

        return this[0].offsetHeight;
      }

      return null;
    }

    function offset() {
      if (this.length > 0) {
        var window = getWindow();
        var document = getDocument();
        var el = this[0];
        var box = el.getBoundingClientRect();
        var body = document.body;
        var clientTop = el.clientTop || body.clientTop || 0;
        var clientLeft = el.clientLeft || body.clientLeft || 0;
        var scrollTop = el === window ? window.scrollY : el.scrollTop;
        var scrollLeft = el === window ? window.scrollX : el.scrollLeft;
        return {
          top: box.top + scrollTop - clientTop,
          left: box.left + scrollLeft - clientLeft
        };
      }

      return null;
    }

    function styles() {
      var window = getWindow();
      if (this[0]) return window.getComputedStyle(this[0], null);
      return {};
    }

    function css(props, value) {
      var window = getWindow();
      var i;

      if (arguments.length === 1) {
        if (typeof props === 'string') {
          // .css('width')
          if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
          // .css({ width: '100px' })
          for (i = 0; i < this.length; i += 1) {
            for (var _prop in props) {
              this[i].style[_prop] = props[_prop];
            }
          }

          return this;
        }
      }

      if (arguments.length === 2 && typeof props === 'string') {
        // .css('width', '100px')
        for (i = 0; i < this.length; i += 1) {
          this[i].style[props] = value;
        }

        return this;
      }

      return this;
    }

    function each(callback) {
      if (!callback) return this;
      this.forEach(function (el, index) {
        callback.apply(el, [el, index]);
      });
      return this;
    }

    function filter(callback) {
      var result = arrayFilter(this, callback);
      return $(result);
    }

    function html(html) {
      if (typeof html === 'undefined') {
        return this[0] ? this[0].innerHTML : null;
      }

      for (var i = 0; i < this.length; i += 1) {
        this[i].innerHTML = html;
      }

      return this;
    }

    function text$1(text) {
      if (typeof text === 'undefined') {
        return this[0] ? this[0].textContent.trim() : null;
      }

      for (var i = 0; i < this.length; i += 1) {
        this[i].textContent = text;
      }

      return this;
    }

    function is(selector) {
      var window = getWindow();
      var document = getDocument();
      var el = this[0];
      var compareWith;
      var i;
      if (!el || typeof selector === 'undefined') return false;

      if (typeof selector === 'string') {
        if (el.matches) return el.matches(selector);
        if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
        if (el.msMatchesSelector) return el.msMatchesSelector(selector);
        compareWith = $(selector);

        for (i = 0; i < compareWith.length; i += 1) {
          if (compareWith[i] === el) return true;
        }

        return false;
      }

      if (selector === document) {
        return el === document;
      }

      if (selector === window) {
        return el === window;
      }

      if (selector.nodeType || selector instanceof Dom7) {
        compareWith = selector.nodeType ? [selector] : selector;

        for (i = 0; i < compareWith.length; i += 1) {
          if (compareWith[i] === el) return true;
        }

        return false;
      }

      return false;
    }

    function index() {
      var child = this[0];
      var i;

      if (child) {
        i = 0; // eslint-disable-next-line

        while ((child = child.previousSibling) !== null) {
          if (child.nodeType === 1) i += 1;
        }

        return i;
      }

      return undefined;
    }

    function eq(index) {
      if (typeof index === 'undefined') return this;
      var length = this.length;

      if (index > length - 1) {
        return $([]);
      }

      if (index < 0) {
        var returnIndex = length + index;
        if (returnIndex < 0) return $([]);
        return $([this[returnIndex]]);
      }

      return $([this[index]]);
    }

    function append$1() {
      var newChild;
      var document = getDocument();

      for (var k = 0; k < arguments.length; k += 1) {
        newChild = k < 0 || arguments.length <= k ? undefined : arguments[k];

        for (var i = 0; i < this.length; i += 1) {
          if (typeof newChild === 'string') {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = newChild;

            while (tempDiv.firstChild) {
              this[i].appendChild(tempDiv.firstChild);
            }
          } else if (newChild instanceof Dom7) {
            for (var j = 0; j < newChild.length; j += 1) {
              this[i].appendChild(newChild[j]);
            }
          } else {
            this[i].appendChild(newChild);
          }
        }
      }

      return this;
    }

    function prepend(newChild) {
      var document = getDocument();
      var i;
      var j;

      for (i = 0; i < this.length; i += 1) {
        if (typeof newChild === 'string') {
          var tempDiv = document.createElement('div');
          tempDiv.innerHTML = newChild;

          for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
          }
        } else if (newChild instanceof Dom7) {
          for (j = 0; j < newChild.length; j += 1) {
            this[i].insertBefore(newChild[j], this[i].childNodes[0]);
          }
        } else {
          this[i].insertBefore(newChild, this[i].childNodes[0]);
        }
      }

      return this;
    }

    function next(selector) {
      if (this.length > 0) {
        if (selector) {
          if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
            return $([this[0].nextElementSibling]);
          }

          return $([]);
        }

        if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
        return $([]);
      }

      return $([]);
    }

    function nextAll(selector) {
      var nextEls = [];
      var el = this[0];
      if (!el) return $([]);

      while (el.nextElementSibling) {
        var _next = el.nextElementSibling; // eslint-disable-line

        if (selector) {
          if ($(_next).is(selector)) nextEls.push(_next);
        } else nextEls.push(_next);

        el = _next;
      }

      return $(nextEls);
    }

    function prev(selector) {
      if (this.length > 0) {
        var el = this[0];

        if (selector) {
          if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
            return $([el.previousElementSibling]);
          }

          return $([]);
        }

        if (el.previousElementSibling) return $([el.previousElementSibling]);
        return $([]);
      }

      return $([]);
    }

    function prevAll(selector) {
      var prevEls = [];
      var el = this[0];
      if (!el) return $([]);

      while (el.previousElementSibling) {
        var _prev = el.previousElementSibling; // eslint-disable-line

        if (selector) {
          if ($(_prev).is(selector)) prevEls.push(_prev);
        } else prevEls.push(_prev);

        el = _prev;
      }

      return $(prevEls);
    }

    function parent(selector) {
      var parents = []; // eslint-disable-line

      for (var i = 0; i < this.length; i += 1) {
        if (this[i].parentNode !== null) {
          if (selector) {
            if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
          } else {
            parents.push(this[i].parentNode);
          }
        }
      }

      return $(parents);
    }

    function parents(selector) {
      var parents = []; // eslint-disable-line

      for (var i = 0; i < this.length; i += 1) {
        var _parent = this[i].parentNode; // eslint-disable-line

        while (_parent) {
          if (selector) {
            if ($(_parent).is(selector)) parents.push(_parent);
          } else {
            parents.push(_parent);
          }

          _parent = _parent.parentNode;
        }
      }

      return $(parents);
    }

    function closest(selector) {
      var closest = this; // eslint-disable-line

      if (typeof selector === 'undefined') {
        return $([]);
      }

      if (!closest.is(selector)) {
        closest = closest.parents(selector).eq(0);
      }

      return closest;
    }

    function find(selector) {
      var foundElements = [];

      for (var i = 0; i < this.length; i += 1) {
        var found = this[i].querySelectorAll(selector);

        for (var j = 0; j < found.length; j += 1) {
          foundElements.push(found[j]);
        }
      }

      return $(foundElements);
    }

    function children$1(selector) {
      var children = []; // eslint-disable-line

      for (var i = 0; i < this.length; i += 1) {
        var childNodes = this[i].children;

        for (var j = 0; j < childNodes.length; j += 1) {
          if (!selector || $(childNodes[j]).is(selector)) {
            children.push(childNodes[j]);
          }
        }
      }

      return $(children);
    }

    function remove() {
      for (var i = 0; i < this.length; i += 1) {
        if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
      }

      return this;
    }

    var Methods = {
      addClass: addClass,
      removeClass: removeClass,
      hasClass: hasClass,
      toggleClass: toggleClass,
      attr: attr$1,
      removeAttr: removeAttr,
      transform: transform,
      transition: transition,
      on: on,
      off: off,
      trigger: trigger,
      transitionEnd: transitionEnd,
      outerWidth: outerWidth,
      outerHeight: outerHeight,
      styles: styles,
      offset: offset,
      css: css,
      each: each,
      html: html,
      text: text$1,
      is: is,
      index: index,
      eq: eq,
      append: append$1,
      prepend: prepend,
      next: next,
      nextAll: nextAll,
      prev: prev,
      prevAll: prevAll,
      parent: parent,
      parents: parents,
      closest: closest,
      find: find,
      children: children$1,
      filter: filter,
      remove: remove
    };
    Object.keys(Methods).forEach(function (methodName) {
      $.fn[methodName] = Methods[methodName];
    });

    function deleteProps(obj) {
      var object = obj;
      Object.keys(object).forEach(function (key) {
        try {
          object[key] = null;
        } catch (e) {// no getter for object
        }

        try {
          delete object[key];
        } catch (e) {// something got wrong
        }
      });
    }

    function nextTick(callback, delay) {
      if (delay === void 0) {
        delay = 0;
      }

      return setTimeout(callback, delay);
    }

    function now() {
      return Date.now();
    }

    function getComputedStyle$1(el) {
      var window = getWindow();
      var style;

      if (window.getComputedStyle) {
        style = window.getComputedStyle(el, null);
      }

      if (!style && el.currentStyle) {
        style = el.currentStyle;
      }

      if (!style) {
        style = el.style;
      }

      return style;
    }

    function getTranslate(el, axis) {
      if (axis === void 0) {
        axis = 'x';
      }

      var window = getWindow();
      var matrix;
      var curTransform;
      var transformMatrix;
      var curStyle = getComputedStyle$1(el);

      if (window.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;

        if (curTransform.split(',').length > 6) {
          curTransform = curTransform.split(', ').map(function (a) {
            return a.replace(',', '.');
          }).join(', ');
        } // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case


        transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
      } else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
      }

      if (axis === 'x') {
        // Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
          else curTransform = parseFloat(matrix[4]);
      }

      if (axis === 'y') {
        // Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
        else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
          else curTransform = parseFloat(matrix[5]);
      }

      return curTransform || 0;
    }

    function isObject$1(o) {
      return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
    }

    function extend$1() {
      var to = Object(arguments.length <= 0 ? undefined : arguments[0]);
      var noExtend = ['__proto__', 'constructor', 'prototype'];

      for (var i = 1; i < arguments.length; i += 1) {
        var nextSource = i < 0 || arguments.length <= i ? undefined : arguments[i];

        if (nextSource !== undefined && nextSource !== null) {
          var keysArray = Object.keys(Object(nextSource)).filter(function (key) {
            return noExtend.indexOf(key) < 0;
          });

          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

            if (desc !== undefined && desc.enumerable) {
              if (isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
                if (nextSource[nextKey].__swiper__) {
                  to[nextKey] = nextSource[nextKey];
                } else {
                  extend$1(to[nextKey], nextSource[nextKey]);
                }
              } else if (!isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
                to[nextKey] = {};

                if (nextSource[nextKey].__swiper__) {
                  to[nextKey] = nextSource[nextKey];
                } else {
                  extend$1(to[nextKey], nextSource[nextKey]);
                }
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }

      return to;
    }

    function bindModuleMethods(instance, obj) {
      Object.keys(obj).forEach(function (key) {
        if (isObject$1(obj[key])) {
          Object.keys(obj[key]).forEach(function (subKey) {
            if (typeof obj[key][subKey] === 'function') {
              obj[key][subKey] = obj[key][subKey].bind(instance);
            }
          });
        }

        instance[key] = obj[key];
      });
    }

    var support;

    function calcSupport() {
      var window = getWindow();
      var document = getDocument();
      return {
        touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
        pointerEvents: !!window.PointerEvent && 'maxTouchPoints' in window.navigator && window.navigator.maxTouchPoints >= 0,
        observer: function checkObserver() {
          return 'MutationObserver' in window || 'WebkitMutationObserver' in window;
        }(),
        passiveListener: function checkPassiveListener() {
          var supportsPassive = false;

          try {
            var opts = Object.defineProperty({}, 'passive', {
              // eslint-disable-next-line
              get: function get() {
                supportsPassive = true;
              }
            });
            window.addEventListener('testPassiveListener', null, opts);
          } catch (e) {// No support
          }

          return supportsPassive;
        }(),
        gestures: function checkGestures() {
          return 'ongesturestart' in window;
        }()
      };
    }

    function getSupport() {
      if (!support) {
        support = calcSupport();
      }

      return support;
    }

    var device;

    function calcDevice(_temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          userAgent = _ref.userAgent;

      var support = getSupport();
      var window = getWindow();
      var platform = window.navigator.platform;
      var ua = userAgent || window.navigator.userAgent;
      var device = {
        ios: false,
        android: false
      };
      var screenWidth = window.screen.width;
      var screenHeight = window.screen.height;
      var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

      var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
      var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
      var iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
      var windows = platform === 'Win32';
      var macos = platform === 'MacIntel'; // iPadOs 13 fix

      var iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

      if (!ipad && macos && support.touch && iPadScreens.indexOf(screenWidth + "x" + screenHeight) >= 0) {
        ipad = ua.match(/(Version)\/([\d.]+)/);
        if (!ipad) ipad = [0, 1, '13_0_0'];
        macos = false;
      } // Android


      if (android && !windows) {
        device.os = 'android';
        device.android = true;
      }

      if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
      } // Export object


      return device;
    }

    function getDevice(overrides) {
      if (overrides === void 0) {
        overrides = {};
      }

      if (!device) {
        device = calcDevice(overrides);
      }

      return device;
    }

    var browser;

    function calcBrowser() {
      var window = getWindow();

      function isSafari() {
        var ua = window.navigator.userAgent.toLowerCase();
        return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
      }

      return {
        isEdge: !!window.navigator.userAgent.match(/Edge/g),
        isSafari: isSafari(),
        isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
      };
    }

    function getBrowser() {
      if (!browser) {
        browser = calcBrowser();
      }

      return browser;
    }

    var supportsResizeObserver = function supportsResizeObserver() {
      var window = getWindow();
      return typeof window.ResizeObserver !== 'undefined';
    };

    var Resize = {
      name: 'resize',
      create: function create() {
        var swiper = this;
        extend$1(swiper, {
          resize: {
            observer: null,
            createObserver: function createObserver() {
              if (!swiper || swiper.destroyed || !swiper.initialized) return;
              swiper.resize.observer = new ResizeObserver(function (entries) {
                var width = swiper.width,
                    height = swiper.height;
                var newWidth = width;
                var newHeight = height;
                entries.forEach(function (_ref) {
                  var contentBoxSize = _ref.contentBoxSize,
                      contentRect = _ref.contentRect,
                      target = _ref.target;
                  if (target && target !== swiper.el) return;
                  newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                  newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                });

                if (newWidth !== width || newHeight !== height) {
                  swiper.resize.resizeHandler();
                }
              });
              swiper.resize.observer.observe(swiper.el);
            },
            removeObserver: function removeObserver() {
              if (swiper.resize.observer && swiper.resize.observer.unobserve && swiper.el) {
                swiper.resize.observer.unobserve(swiper.el);
                swiper.resize.observer = null;
              }
            },
            resizeHandler: function resizeHandler() {
              if (!swiper || swiper.destroyed || !swiper.initialized) return;
              swiper.emit('beforeResize');
              swiper.emit('resize');
            },
            orientationChangeHandler: function orientationChangeHandler() {
              if (!swiper || swiper.destroyed || !swiper.initialized) return;
              swiper.emit('orientationchange');
            }
          }
        });
      },
      on: {
        init: function init(swiper) {
          var window = getWindow();

          if (swiper.params.resizeObserver && supportsResizeObserver()) {
            swiper.resize.createObserver();
            return;
          } // Emit resize


          window.addEventListener('resize', swiper.resize.resizeHandler); // Emit orientationchange

          window.addEventListener('orientationchange', swiper.resize.orientationChangeHandler);
        },
        destroy: function destroy(swiper) {
          var window = getWindow();
          swiper.resize.removeObserver();
          window.removeEventListener('resize', swiper.resize.resizeHandler);
          window.removeEventListener('orientationchange', swiper.resize.orientationChangeHandler);
        }
      }
    };

    function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
    var Observer = {
      attach: function attach(target, options) {
        if (options === void 0) {
          options = {};
        }

        var window = getWindow();
        var swiper = this;
        var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
        var observer = new ObserverFunc(function (mutations) {
          // The observerUpdate event should only be triggered
          // once despite the number of mutations.  Additional
          // triggers are redundant and are very costly
          if (mutations.length === 1) {
            swiper.emit('observerUpdate', mutations[0]);
            return;
          }

          var observerUpdate = function observerUpdate() {
            swiper.emit('observerUpdate', mutations[0]);
          };

          if (window.requestAnimationFrame) {
            window.requestAnimationFrame(observerUpdate);
          } else {
            window.setTimeout(observerUpdate, 0);
          }
        });
        observer.observe(target, {
          attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
          childList: typeof options.childList === 'undefined' ? true : options.childList,
          characterData: typeof options.characterData === 'undefined' ? true : options.characterData
        });
        swiper.observer.observers.push(observer);
      },
      init: function init() {
        var swiper = this;
        if (!swiper.support.observer || !swiper.params.observer) return;

        if (swiper.params.observeParents) {
          var containerParents = swiper.$el.parents();

          for (var i = 0; i < containerParents.length; i += 1) {
            swiper.observer.attach(containerParents[i]);
          }
        } // Observe container


        swiper.observer.attach(swiper.$el[0], {
          childList: swiper.params.observeSlideChildren
        }); // Observe wrapper

        swiper.observer.attach(swiper.$wrapperEl[0], {
          attributes: false
        });
      },
      destroy: function destroy() {
        var swiper = this;
        swiper.observer.observers.forEach(function (observer) {
          observer.disconnect();
        });
        swiper.observer.observers = [];
      }
    };
    var Observer$1 = {
      name: 'observer',
      params: {
        observer: false,
        observeParents: false,
        observeSlideChildren: false
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          observer: _extends({}, Observer, {
            observers: []
          })
        });
      },
      on: {
        init: function init(swiper) {
          swiper.observer.init();
        },
        destroy: function destroy(swiper) {
          swiper.observer.destroy();
        }
      }
    };

    var modular = {
      useParams: function useParams(instanceParams) {
        var instance = this;
        if (!instance.modules) return;
        Object.keys(instance.modules).forEach(function (moduleName) {
          var module = instance.modules[moduleName]; // Extend params

          if (module.params) {
            extend$1(instanceParams, module.params);
          }
        });
      },
      useModules: function useModules(modulesParams) {
        if (modulesParams === void 0) {
          modulesParams = {};
        }

        var instance = this;
        if (!instance.modules) return;
        Object.keys(instance.modules).forEach(function (moduleName) {
          var module = instance.modules[moduleName];
          var moduleParams = modulesParams[moduleName] || {}; // Add event listeners

          if (module.on && instance.on) {
            Object.keys(module.on).forEach(function (moduleEventName) {
              instance.on(moduleEventName, module.on[moduleEventName]);
            });
          } // Module create callback


          if (module.create) {
            module.create.bind(instance)(moduleParams);
          }
        });
      }
    };

    /* eslint-disable no-underscore-dangle */
    var eventsEmitter = {
      on: function on(events, handler, priority) {
        var self = this;
        if (typeof handler !== 'function') return self;
        var method = priority ? 'unshift' : 'push';
        events.split(' ').forEach(function (event) {
          if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
          self.eventsListeners[event][method](handler);
        });
        return self;
      },
      once: function once(events, handler, priority) {
        var self = this;
        if (typeof handler !== 'function') return self;

        function onceHandler() {
          self.off(events, onceHandler);

          if (onceHandler.__emitterProxy) {
            delete onceHandler.__emitterProxy;
          }

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          handler.apply(self, args);
        }

        onceHandler.__emitterProxy = handler;
        return self.on(events, onceHandler, priority);
      },
      onAny: function onAny(handler, priority) {
        var self = this;
        if (typeof handler !== 'function') return self;
        var method = priority ? 'unshift' : 'push';

        if (self.eventsAnyListeners.indexOf(handler) < 0) {
          self.eventsAnyListeners[method](handler);
        }

        return self;
      },
      offAny: function offAny(handler) {
        var self = this;
        if (!self.eventsAnyListeners) return self;
        var index = self.eventsAnyListeners.indexOf(handler);

        if (index >= 0) {
          self.eventsAnyListeners.splice(index, 1);
        }

        return self;
      },
      off: function off(events, handler) {
        var self = this;
        if (!self.eventsListeners) return self;
        events.split(' ').forEach(function (event) {
          if (typeof handler === 'undefined') {
            self.eventsListeners[event] = [];
          } else if (self.eventsListeners[event]) {
            self.eventsListeners[event].forEach(function (eventHandler, index) {
              if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
                self.eventsListeners[event].splice(index, 1);
              }
            });
          }
        });
        return self;
      },
      emit: function emit() {
        var self = this;
        if (!self.eventsListeners) return self;
        var events;
        var data;
        var context;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (typeof args[0] === 'string' || Array.isArray(args[0])) {
          events = args[0];
          data = args.slice(1, args.length);
          context = self;
        } else {
          events = args[0].events;
          data = args[0].data;
          context = args[0].context || self;
        }

        data.unshift(context);
        var eventsArray = Array.isArray(events) ? events : events.split(' ');
        eventsArray.forEach(function (event) {
          if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
            self.eventsAnyListeners.forEach(function (eventHandler) {
              eventHandler.apply(context, [event].concat(data));
            });
          }

          if (self.eventsListeners && self.eventsListeners[event]) {
            self.eventsListeners[event].forEach(function (eventHandler) {
              eventHandler.apply(context, data);
            });
          }
        });
        return self;
      }
    };

    function updateSize() {
      var swiper = this;
      var width;
      var height;
      var $el = swiper.$el;

      if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
        width = swiper.params.width;
      } else {
        width = $el[0].clientWidth;
      }

      if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
        height = swiper.params.height;
      } else {
        height = $el[0].clientHeight;
      }

      if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
        return;
      } // Subtract paddings


      width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
      height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
      if (Number.isNaN(width)) width = 0;
      if (Number.isNaN(height)) height = 0;
      extend$1(swiper, {
        width: width,
        height: height,
        size: swiper.isHorizontal() ? width : height
      });
    }

    function updateSlides() {
      var swiper = this;

      var getDirectionLabel = function getDirectionLabel(property) {
        if (swiper.isHorizontal()) {
          return property;
        } // prettier-ignore


        return {
          'width': 'height',
          'margin-top': 'margin-left',
          'margin-bottom ': 'margin-right',
          'margin-left': 'margin-top',
          'margin-right': 'margin-bottom',
          'padding-left': 'padding-top',
          'padding-right': 'padding-bottom',
          'marginRight': 'marginBottom'
        }[property];
      };

      var getDirectionPropertyValue = function getDirectionPropertyValue(node, label) {
        return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
      };

      var params = swiper.params;
      var $wrapperEl = swiper.$wrapperEl,
          swiperSize = swiper.size,
          rtl = swiper.rtlTranslate,
          wrongRTL = swiper.wrongRTL;
      var isVirtual = swiper.virtual && params.virtual.enabled;
      var previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
      var slides = $wrapperEl.children("." + swiper.params.slideClass);
      var slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
      var snapGrid = [];
      var slidesGrid = [];
      var slidesSizesGrid = [];

      function slidesForMargin(slideEl, slideIndex) {
        if (!params.cssMode) return true;

        if (slideIndex === slides.length - 1) {
          return false;
        }

        return true;
      }

      var offsetBefore = params.slidesOffsetBefore;

      if (typeof offsetBefore === 'function') {
        offsetBefore = params.slidesOffsetBefore.call(swiper);
      }

      var offsetAfter = params.slidesOffsetAfter;

      if (typeof offsetAfter === 'function') {
        offsetAfter = params.slidesOffsetAfter.call(swiper);
      }

      var previousSnapGridLength = swiper.snapGrid.length;
      var previousSlidesGridLength = swiper.slidesGrid.length;
      var spaceBetween = params.spaceBetween;
      var slidePosition = -offsetBefore;
      var prevSlideSize = 0;
      var index = 0;

      if (typeof swiperSize === 'undefined') {
        return;
      }

      if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
        spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
      }

      swiper.virtualSize = -spaceBetween; // reset margins

      if (rtl) slides.css({
        marginLeft: '',
        marginTop: ''
      });else slides.css({
        marginRight: '',
        marginBottom: ''
      });
      var slidesNumberEvenToRows;

      if (params.slidesPerColumn > 1) {
        if (Math.floor(slidesLength / params.slidesPerColumn) === slidesLength / swiper.params.slidesPerColumn) {
          slidesNumberEvenToRows = slidesLength;
        } else {
          slidesNumberEvenToRows = Math.ceil(slidesLength / params.slidesPerColumn) * params.slidesPerColumn;
        }

        if (params.slidesPerView !== 'auto' && params.slidesPerColumnFill === 'row') {
          slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, params.slidesPerView * params.slidesPerColumn);
        }
      } // Calc slides


      var slideSize;
      var slidesPerColumn = params.slidesPerColumn;
      var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
      var numFullColumns = Math.floor(slidesLength / params.slidesPerColumn);

      for (var i = 0; i < slidesLength; i += 1) {
        slideSize = 0;
        var slide = slides.eq(i);

        if (params.slidesPerColumn > 1) {
          // Set slides order
          var newSlideOrderIndex = void 0;
          var column = void 0;
          var row = void 0;

          if (params.slidesPerColumnFill === 'row' && params.slidesPerGroup > 1) {
            var groupIndex = Math.floor(i / (params.slidesPerGroup * params.slidesPerColumn));
            var slideIndexInGroup = i - params.slidesPerColumn * params.slidesPerGroup * groupIndex;
            var columnsInGroup = groupIndex === 0 ? params.slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * slidesPerColumn * params.slidesPerGroup) / slidesPerColumn), params.slidesPerGroup);
            row = Math.floor(slideIndexInGroup / columnsInGroup);
            column = slideIndexInGroup - row * columnsInGroup + groupIndex * params.slidesPerGroup;
            newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
            slide.css({
              '-webkit-box-ordinal-group': newSlideOrderIndex,
              '-moz-box-ordinal-group': newSlideOrderIndex,
              '-ms-flex-order': newSlideOrderIndex,
              '-webkit-order': newSlideOrderIndex,
              order: newSlideOrderIndex
            });
          } else if (params.slidesPerColumnFill === 'column') {
            column = Math.floor(i / slidesPerColumn);
            row = i - column * slidesPerColumn;

            if (column > numFullColumns || column === numFullColumns && row === slidesPerColumn - 1) {
              row += 1;

              if (row >= slidesPerColumn) {
                row = 0;
                column += 1;
              }
            }
          } else {
            row = Math.floor(i / slidesPerRow);
            column = i - row * slidesPerRow;
          }

          slide.css(getDirectionLabel('margin-top'), row !== 0 && params.spaceBetween && params.spaceBetween + "px");
        }

        if (slide.css('display') === 'none') continue; // eslint-disable-line

        if (params.slidesPerView === 'auto') {
          var slideStyles = getComputedStyle(slide[0]);
          var currentTransform = slide[0].style.transform;
          var currentWebKitTransform = slide[0].style.webkitTransform;

          if (currentTransform) {
            slide[0].style.transform = 'none';
          }

          if (currentWebKitTransform) {
            slide[0].style.webkitTransform = 'none';
          }

          if (params.roundLengths) {
            slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
          } else {
            // eslint-disable-next-line
            var width = getDirectionPropertyValue(slideStyles, 'width');
            var paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
            var paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
            var marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
            var marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
            var boxSizing = slideStyles.getPropertyValue('box-sizing');

            if (boxSizing && boxSizing === 'border-box') {
              slideSize = width + marginLeft + marginRight;
            } else {
              var _slide$ = slide[0],
                  clientWidth = _slide$.clientWidth,
                  offsetWidth = _slide$.offsetWidth;
              slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
            }
          }

          if (currentTransform) {
            slide[0].style.transform = currentTransform;
          }

          if (currentWebKitTransform) {
            slide[0].style.webkitTransform = currentWebKitTransform;
          }

          if (params.roundLengths) slideSize = Math.floor(slideSize);
        } else {
          slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
          if (params.roundLengths) slideSize = Math.floor(slideSize);

          if (slides[i]) {
            slides[i].style[getDirectionLabel('width')] = slideSize + "px";
          }
        }

        if (slides[i]) {
          slides[i].swiperSlideSize = slideSize;
        }

        slidesSizesGrid.push(slideSize);

        if (params.centeredSlides) {
          slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
          if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
          if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
          if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
          if (params.roundLengths) slidePosition = Math.floor(slidePosition);
          if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
          slidesGrid.push(slidePosition);
        } else {
          if (params.roundLengths) slidePosition = Math.floor(slidePosition);
          if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
          slidesGrid.push(slidePosition);
          slidePosition = slidePosition + slideSize + spaceBetween;
        }

        swiper.virtualSize += slideSize + spaceBetween;
        prevSlideSize = slideSize;
        index += 1;
      }

      swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
      var newSlidesGrid;

      if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
        $wrapperEl.css({
          width: swiper.virtualSize + params.spaceBetween + "px"
        });
      }

      if (params.setWrapperSize) {
        var _$wrapperEl$css;

        $wrapperEl.css((_$wrapperEl$css = {}, _$wrapperEl$css[getDirectionLabel('width')] = swiper.virtualSize + params.spaceBetween + "px", _$wrapperEl$css));
      }

      if (params.slidesPerColumn > 1) {
        var _$wrapperEl$css2;

        swiper.virtualSize = (slideSize + params.spaceBetween) * slidesNumberEvenToRows;
        swiper.virtualSize = Math.ceil(swiper.virtualSize / params.slidesPerColumn) - params.spaceBetween;
        $wrapperEl.css((_$wrapperEl$css2 = {}, _$wrapperEl$css2[getDirectionLabel('width')] = swiper.virtualSize + params.spaceBetween + "px", _$wrapperEl$css2));

        if (params.centeredSlides) {
          newSlidesGrid = [];

          for (var _i = 0; _i < snapGrid.length; _i += 1) {
            var slidesGridItem = snapGrid[_i];
            if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
            if (snapGrid[_i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
          }

          snapGrid = newSlidesGrid;
        }
      } // Remove last grid elements depending on width


      if (!params.centeredSlides) {
        newSlidesGrid = [];

        for (var _i2 = 0; _i2 < snapGrid.length; _i2 += 1) {
          var _slidesGridItem = snapGrid[_i2];
          if (params.roundLengths) _slidesGridItem = Math.floor(_slidesGridItem);

          if (snapGrid[_i2] <= swiper.virtualSize - swiperSize) {
            newSlidesGrid.push(_slidesGridItem);
          }
        }

        snapGrid = newSlidesGrid;

        if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
          snapGrid.push(swiper.virtualSize - swiperSize);
        }
      }

      if (snapGrid.length === 0) snapGrid = [0];

      if (params.spaceBetween !== 0) {
        var _slides$filter$css;

        var key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
        slides.filter(slidesForMargin).css((_slides$filter$css = {}, _slides$filter$css[key] = spaceBetween + "px", _slides$filter$css));
      }

      if (params.centeredSlides && params.centeredSlidesBounds) {
        var allSlidesSize = 0;
        slidesSizesGrid.forEach(function (slideSizeValue) {
          allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
        });
        allSlidesSize -= params.spaceBetween;
        var maxSnap = allSlidesSize - swiperSize;
        snapGrid = snapGrid.map(function (snap) {
          if (snap < 0) return -offsetBefore;
          if (snap > maxSnap) return maxSnap + offsetAfter;
          return snap;
        });
      }

      if (params.centerInsufficientSlides) {
        var _allSlidesSize = 0;
        slidesSizesGrid.forEach(function (slideSizeValue) {
          _allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
        });
        _allSlidesSize -= params.spaceBetween;

        if (_allSlidesSize < swiperSize) {
          var allSlidesOffset = (swiperSize - _allSlidesSize) / 2;
          snapGrid.forEach(function (snap, snapIndex) {
            snapGrid[snapIndex] = snap - allSlidesOffset;
          });
          slidesGrid.forEach(function (snap, snapIndex) {
            slidesGrid[snapIndex] = snap + allSlidesOffset;
          });
        }
      }

      extend$1(swiper, {
        slides: slides,
        snapGrid: snapGrid,
        slidesGrid: slidesGrid,
        slidesSizesGrid: slidesSizesGrid
      });

      if (slidesLength !== previousSlidesLength) {
        swiper.emit('slidesLengthChange');
      }

      if (snapGrid.length !== previousSnapGridLength) {
        if (swiper.params.watchOverflow) swiper.checkOverflow();
        swiper.emit('snapGridLengthChange');
      }

      if (slidesGrid.length !== previousSlidesGridLength) {
        swiper.emit('slidesGridLengthChange');
      }

      if (params.watchSlidesProgress || params.watchSlidesVisibility) {
        swiper.updateSlidesOffset();
      }
    }

    function updateAutoHeight(speed) {
      var swiper = this;
      var activeSlides = [];
      var newHeight = 0;
      var i;

      if (typeof speed === 'number') {
        swiper.setTransition(speed);
      } else if (speed === true) {
        swiper.setTransition(swiper.params.speed);
      } // Find slides currently in view


      if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
        if (swiper.params.centeredSlides) {
          swiper.visibleSlides.each(function (slide) {
            activeSlides.push(slide);
          });
        } else {
          for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            var index = swiper.activeIndex + i;
            if (index > swiper.slides.length) break;
            activeSlides.push(swiper.slides.eq(index)[0]);
          }
        }
      } else {
        activeSlides.push(swiper.slides.eq(swiper.activeIndex)[0]);
      } // Find new height from highest slide in view


      for (i = 0; i < activeSlides.length; i += 1) {
        if (typeof activeSlides[i] !== 'undefined') {
          var height = activeSlides[i].offsetHeight;
          newHeight = height > newHeight ? height : newHeight;
        }
      } // Update Height


      if (newHeight) swiper.$wrapperEl.css('height', newHeight + "px");
    }

    function updateSlidesOffset() {
      var swiper = this;
      var slides = swiper.slides;

      for (var i = 0; i < slides.length; i += 1) {
        slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
      }
    }

    function updateSlidesProgress(translate) {
      if (translate === void 0) {
        translate = this && this.translate || 0;
      }

      var swiper = this;
      var params = swiper.params;
      var slides = swiper.slides,
          rtl = swiper.rtlTranslate;
      if (slides.length === 0) return;
      if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
      var offsetCenter = -translate;
      if (rtl) offsetCenter = translate; // Visible Slides

      slides.removeClass(params.slideVisibleClass);
      swiper.visibleSlidesIndexes = [];
      swiper.visibleSlides = [];

      for (var i = 0; i < slides.length; i += 1) {
        var slide = slides[i];
        var slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slide.swiperSlideOffset) / (slide.swiperSlideSize + params.spaceBetween);

        if (params.watchSlidesVisibility || params.centeredSlides && params.autoHeight) {
          var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
          var slideAfter = slideBefore + swiper.slidesSizesGrid[i];
          var isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;

          if (isVisible) {
            swiper.visibleSlides.push(slide);
            swiper.visibleSlidesIndexes.push(i);
            slides.eq(i).addClass(params.slideVisibleClass);
          }
        }

        slide.progress = rtl ? -slideProgress : slideProgress;
      }

      swiper.visibleSlides = $(swiper.visibleSlides);
    }

    function updateProgress(translate) {
      var swiper = this;

      if (typeof translate === 'undefined') {
        var multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

        translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
      }

      var params = swiper.params;
      var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
      var progress = swiper.progress,
          isBeginning = swiper.isBeginning,
          isEnd = swiper.isEnd;
      var wasBeginning = isBeginning;
      var wasEnd = isEnd;

      if (translatesDiff === 0) {
        progress = 0;
        isBeginning = true;
        isEnd = true;
      } else {
        progress = (translate - swiper.minTranslate()) / translatesDiff;
        isBeginning = progress <= 0;
        isEnd = progress >= 1;
      }

      extend$1(swiper, {
        progress: progress,
        isBeginning: isBeginning,
        isEnd: isEnd
      });
      if (params.watchSlidesProgress || params.watchSlidesVisibility || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);

      if (isBeginning && !wasBeginning) {
        swiper.emit('reachBeginning toEdge');
      }

      if (isEnd && !wasEnd) {
        swiper.emit('reachEnd toEdge');
      }

      if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
        swiper.emit('fromEdge');
      }

      swiper.emit('progress', progress);
    }

    function updateSlidesClasses() {
      var swiper = this;
      var slides = swiper.slides,
          params = swiper.params,
          $wrapperEl = swiper.$wrapperEl,
          activeIndex = swiper.activeIndex,
          realIndex = swiper.realIndex;
      var isVirtual = swiper.virtual && params.virtual.enabled;
      slides.removeClass(params.slideActiveClass + " " + params.slideNextClass + " " + params.slidePrevClass + " " + params.slideDuplicateActiveClass + " " + params.slideDuplicateNextClass + " " + params.slideDuplicatePrevClass);
      var activeSlide;

      if (isVirtual) {
        activeSlide = swiper.$wrapperEl.find("." + params.slideClass + "[data-swiper-slide-index=\"" + activeIndex + "\"]");
      } else {
        activeSlide = slides.eq(activeIndex);
      } // Active classes


      activeSlide.addClass(params.slideActiveClass);

      if (params.loop) {
        // Duplicate to all looped slides
        if (activeSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children("." + params.slideClass + ":not(." + params.slideDuplicateClass + ")[data-swiper-slide-index=\"" + realIndex + "\"]").addClass(params.slideDuplicateActiveClass);
        } else {
          $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + "[data-swiper-slide-index=\"" + realIndex + "\"]").addClass(params.slideDuplicateActiveClass);
        }
      } // Next Slide


      var nextSlide = activeSlide.nextAll("." + params.slideClass).eq(0).addClass(params.slideNextClass);

      if (params.loop && nextSlide.length === 0) {
        nextSlide = slides.eq(0);
        nextSlide.addClass(params.slideNextClass);
      } // Prev Slide


      var prevSlide = activeSlide.prevAll("." + params.slideClass).eq(0).addClass(params.slidePrevClass);

      if (params.loop && prevSlide.length === 0) {
        prevSlide = slides.eq(-1);
        prevSlide.addClass(params.slidePrevClass);
      }

      if (params.loop) {
        // Duplicate to all looped slides
        if (nextSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children("." + params.slideClass + ":not(." + params.slideDuplicateClass + ")[data-swiper-slide-index=\"" + nextSlide.attr('data-swiper-slide-index') + "\"]").addClass(params.slideDuplicateNextClass);
        } else {
          $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + "[data-swiper-slide-index=\"" + nextSlide.attr('data-swiper-slide-index') + "\"]").addClass(params.slideDuplicateNextClass);
        }

        if (prevSlide.hasClass(params.slideDuplicateClass)) {
          $wrapperEl.children("." + params.slideClass + ":not(." + params.slideDuplicateClass + ")[data-swiper-slide-index=\"" + prevSlide.attr('data-swiper-slide-index') + "\"]").addClass(params.slideDuplicatePrevClass);
        } else {
          $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + "[data-swiper-slide-index=\"" + prevSlide.attr('data-swiper-slide-index') + "\"]").addClass(params.slideDuplicatePrevClass);
        }
      }

      swiper.emitSlidesClasses();
    }

    function updateActiveIndex(newActiveIndex) {
      var swiper = this;
      var translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
      var slidesGrid = swiper.slidesGrid,
          snapGrid = swiper.snapGrid,
          params = swiper.params,
          previousIndex = swiper.activeIndex,
          previousRealIndex = swiper.realIndex,
          previousSnapIndex = swiper.snapIndex;
      var activeIndex = newActiveIndex;
      var snapIndex;

      if (typeof activeIndex === 'undefined') {
        for (var i = 0; i < slidesGrid.length; i += 1) {
          if (typeof slidesGrid[i + 1] !== 'undefined') {
            if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
              activeIndex = i;
            } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
              activeIndex = i + 1;
            }
          } else if (translate >= slidesGrid[i]) {
            activeIndex = i;
          }
        } // Normalize slideIndex


        if (params.normalizeSlideIndex) {
          if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
        }
      }

      if (snapGrid.indexOf(translate) >= 0) {
        snapIndex = snapGrid.indexOf(translate);
      } else {
        var skip = Math.min(params.slidesPerGroupSkip, activeIndex);
        snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
      }

      if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

      if (activeIndex === previousIndex) {
        if (snapIndex !== previousSnapIndex) {
          swiper.snapIndex = snapIndex;
          swiper.emit('snapIndexChange');
        }

        return;
      } // Get real index


      var realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);
      extend$1(swiper, {
        snapIndex: snapIndex,
        realIndex: realIndex,
        previousIndex: previousIndex,
        activeIndex: activeIndex
      });
      swiper.emit('activeIndexChange');
      swiper.emit('snapIndexChange');

      if (previousRealIndex !== realIndex) {
        swiper.emit('realIndexChange');
      }

      if (swiper.initialized || swiper.params.runCallbacksOnInit) {
        swiper.emit('slideChange');
      }
    }

    function updateClickedSlide(e) {
      var swiper = this;
      var params = swiper.params;
      var slide = $(e.target).closest("." + params.slideClass)[0];
      var slideFound = false;
      var slideIndex;

      if (slide) {
        for (var i = 0; i < swiper.slides.length; i += 1) {
          if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
          }
        }
      }

      if (slide && slideFound) {
        swiper.clickedSlide = slide;

        if (swiper.virtual && swiper.params.virtual.enabled) {
          swiper.clickedIndex = parseInt($(slide).attr('data-swiper-slide-index'), 10);
        } else {
          swiper.clickedIndex = slideIndex;
        }
      } else {
        swiper.clickedSlide = undefined;
        swiper.clickedIndex = undefined;
        return;
      }

      if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
        swiper.slideToClickedSlide();
      }
    }

    var update$1 = {
      updateSize: updateSize,
      updateSlides: updateSlides,
      updateAutoHeight: updateAutoHeight,
      updateSlidesOffset: updateSlidesOffset,
      updateSlidesProgress: updateSlidesProgress,
      updateProgress: updateProgress,
      updateSlidesClasses: updateSlidesClasses,
      updateActiveIndex: updateActiveIndex,
      updateClickedSlide: updateClickedSlide
    };

    function getSwiperTranslate(axis) {
      if (axis === void 0) {
        axis = this.isHorizontal() ? 'x' : 'y';
      }

      var swiper = this;
      var params = swiper.params,
          rtl = swiper.rtlTranslate,
          translate = swiper.translate,
          $wrapperEl = swiper.$wrapperEl;

      if (params.virtualTranslate) {
        return rtl ? -translate : translate;
      }

      if (params.cssMode) {
        return translate;
      }

      var currentTranslate = getTranslate($wrapperEl[0], axis);
      if (rtl) currentTranslate = -currentTranslate;
      return currentTranslate || 0;
    }

    function setTranslate(translate, byController) {
      var swiper = this;
      var rtl = swiper.rtlTranslate,
          params = swiper.params,
          $wrapperEl = swiper.$wrapperEl,
          wrapperEl = swiper.wrapperEl,
          progress = swiper.progress;
      var x = 0;
      var y = 0;
      var z = 0;

      if (swiper.isHorizontal()) {
        x = rtl ? -translate : translate;
      } else {
        y = translate;
      }

      if (params.roundLengths) {
        x = Math.floor(x);
        y = Math.floor(y);
      }

      if (params.cssMode) {
        wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
      } else if (!params.virtualTranslate) {
        $wrapperEl.transform("translate3d(" + x + "px, " + y + "px, " + z + "px)");
      }

      swiper.previousTranslate = swiper.translate;
      swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

      var newProgress;
      var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

      if (translatesDiff === 0) {
        newProgress = 0;
      } else {
        newProgress = (translate - swiper.minTranslate()) / translatesDiff;
      }

      if (newProgress !== progress) {
        swiper.updateProgress(translate);
      }

      swiper.emit('setTranslate', swiper.translate, byController);
    }

    function minTranslate() {
      return -this.snapGrid[0];
    }

    function maxTranslate() {
      return -this.snapGrid[this.snapGrid.length - 1];
    }

    function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
      if (translate === void 0) {
        translate = 0;
      }

      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      if (translateBounds === void 0) {
        translateBounds = true;
      }

      var swiper = this;
      var params = swiper.params,
          wrapperEl = swiper.wrapperEl;

      if (swiper.animating && params.preventInteractionOnTransition) {
        return false;
      }

      var minTranslate = swiper.minTranslate();
      var maxTranslate = swiper.maxTranslate();
      var newTranslate;
      if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate; // Update progress

      swiper.updateProgress(newTranslate);

      if (params.cssMode) {
        var isH = swiper.isHorizontal();

        if (speed === 0) {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
        } else {
          // eslint-disable-next-line
          if (wrapperEl.scrollTo) {
            var _wrapperEl$scrollTo;

            wrapperEl.scrollTo((_wrapperEl$scrollTo = {}, _wrapperEl$scrollTo[isH ? 'left' : 'top'] = -newTranslate, _wrapperEl$scrollTo.behavior = 'smooth', _wrapperEl$scrollTo));
          } else {
            wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
          }
        }

        return true;
      }

      if (speed === 0) {
        swiper.setTransition(0);
        swiper.setTranslate(newTranslate);

        if (runCallbacks) {
          swiper.emit('beforeTransitionStart', speed, internal);
          swiper.emit('transitionEnd');
        }
      } else {
        swiper.setTransition(speed);
        swiper.setTranslate(newTranslate);

        if (runCallbacks) {
          swiper.emit('beforeTransitionStart', speed, internal);
          swiper.emit('transitionStart');
        }

        if (!swiper.animating) {
          swiper.animating = true;

          if (!swiper.onTranslateToWrapperTransitionEnd) {
            swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
              if (!swiper || swiper.destroyed) return;
              if (e.target !== this) return;
              swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
              swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
              swiper.onTranslateToWrapperTransitionEnd = null;
              delete swiper.onTranslateToWrapperTransitionEnd;

              if (runCallbacks) {
                swiper.emit('transitionEnd');
              }
            };
          }

          swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
        }
      }

      return true;
    }

    var translate = {
      getTranslate: getSwiperTranslate,
      setTranslate: setTranslate,
      minTranslate: minTranslate,
      maxTranslate: maxTranslate,
      translateTo: translateTo
    };

    function setTransition(duration, byController) {
      var swiper = this;

      if (!swiper.params.cssMode) {
        swiper.$wrapperEl.transition(duration);
      }

      swiper.emit('setTransition', duration, byController);
    }

    function transitionStart(runCallbacks, direction) {
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      var swiper = this;
      var activeIndex = swiper.activeIndex,
          params = swiper.params,
          previousIndex = swiper.previousIndex;
      if (params.cssMode) return;

      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }

      var dir = direction;

      if (!dir) {
        if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
      }

      swiper.emit('transitionStart');

      if (runCallbacks && activeIndex !== previousIndex) {
        if (dir === 'reset') {
          swiper.emit('slideResetTransitionStart');
          return;
        }

        swiper.emit('slideChangeTransitionStart');

        if (dir === 'next') {
          swiper.emit('slideNextTransitionStart');
        } else {
          swiper.emit('slidePrevTransitionStart');
        }
      }
    }

    function transitionEnd$1(runCallbacks, direction) {
      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      var swiper = this;
      var activeIndex = swiper.activeIndex,
          previousIndex = swiper.previousIndex,
          params = swiper.params;
      swiper.animating = false;
      if (params.cssMode) return;
      swiper.setTransition(0);
      var dir = direction;

      if (!dir) {
        if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
      }

      swiper.emit('transitionEnd');

      if (runCallbacks && activeIndex !== previousIndex) {
        if (dir === 'reset') {
          swiper.emit('slideResetTransitionEnd');
          return;
        }

        swiper.emit('slideChangeTransitionEnd');

        if (dir === 'next') {
          swiper.emit('slideNextTransitionEnd');
        } else {
          swiper.emit('slidePrevTransitionEnd');
        }
      }
    }

    var transition$1 = {
      setTransition: setTransition,
      transitionStart: transitionStart,
      transitionEnd: transitionEnd$1
    };

    function slideTo(index, speed, runCallbacks, internal) {
      if (index === void 0) {
        index = 0;
      }

      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      if (typeof index !== 'number' && typeof index !== 'string') {
        throw new Error("The 'index' argument cannot have type other than 'number' or 'string'. [" + typeof index + "] given.");
      }

      if (typeof index === 'string') {
        /**
         * The `index` argument converted from `string` to `number`.
         * @type {number}
         */
        var indexAsNumber = parseInt(index, 10);
        /**
         * Determines whether the `index` argument is a valid `number`
         * after being converted from the `string` type.
         * @type {boolean}
         */

        var isValidNumber = isFinite(indexAsNumber);

        if (!isValidNumber) {
          throw new Error("The passed-in 'index' (string) couldn't be converted to 'number'. [" + index + "] given.");
        } // Knowing that the converted `index` is a valid number,
        // we can update the original argument's value.


        index = indexAsNumber;
      }

      var swiper = this;
      var slideIndex = index;
      if (slideIndex < 0) slideIndex = 0;
      var params = swiper.params,
          snapGrid = swiper.snapGrid,
          slidesGrid = swiper.slidesGrid,
          previousIndex = swiper.previousIndex,
          activeIndex = swiper.activeIndex,
          rtl = swiper.rtlTranslate,
          wrapperEl = swiper.wrapperEl;

      if (swiper.animating && params.preventInteractionOnTransition) {
        return false;
      }

      var skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
      var snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
      if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

      if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
        swiper.emit('beforeSlideChangeStart');
      }

      var translate = -snapGrid[snapIndex]; // Update progress

      swiper.updateProgress(translate); // Normalize slideIndex

      if (params.normalizeSlideIndex) {
        for (var i = 0; i < slidesGrid.length; i += 1) {
          var normalizedTranslate = -Math.floor(translate * 100);
          var normalizedGird = Math.floor(slidesGrid[i] * 100);
          var normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

          if (typeof slidesGrid[i + 1] !== 'undefined') {
            if (normalizedTranslate >= normalizedGird && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGird) / 2) {
              slideIndex = i;
            } else if (normalizedTranslate >= normalizedGird && normalizedTranslate < normalizedGridNext) {
              slideIndex = i + 1;
            }
          } else if (normalizedTranslate >= normalizedGird) {
            slideIndex = i;
          }
        }
      } // Directions locks


      if (swiper.initialized && slideIndex !== activeIndex) {
        if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
          return false;
        }

        if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
          if ((activeIndex || 0) !== slideIndex) return false;
        }
      }

      var direction;
      if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset'; // Update Index

      if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
        swiper.updateActiveIndex(slideIndex); // Update Height

        if (params.autoHeight) {
          swiper.updateAutoHeight();
        }

        swiper.updateSlidesClasses();

        if (params.effect !== 'slide') {
          swiper.setTranslate(translate);
        }

        if (direction !== 'reset') {
          swiper.transitionStart(runCallbacks, direction);
          swiper.transitionEnd(runCallbacks, direction);
        }

        return false;
      }

      if (params.cssMode) {
        var isH = swiper.isHorizontal();
        var t = -translate;

        if (rtl) {
          t = wrapperEl.scrollWidth - wrapperEl.offsetWidth - t;
        }

        if (speed === 0) {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
        } else {
          // eslint-disable-next-line
          if (wrapperEl.scrollTo) {
            var _wrapperEl$scrollTo;

            wrapperEl.scrollTo((_wrapperEl$scrollTo = {}, _wrapperEl$scrollTo[isH ? 'left' : 'top'] = t, _wrapperEl$scrollTo.behavior = 'smooth', _wrapperEl$scrollTo));
          } else {
            wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
          }
        }

        return true;
      }

      if (speed === 0) {
        swiper.setTransition(0);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      } else {
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.transitionStart(runCallbacks, direction);

        if (!swiper.animating) {
          swiper.animating = true;

          if (!swiper.onSlideToWrapperTransitionEnd) {
            swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
              if (!swiper || swiper.destroyed) return;
              if (e.target !== this) return;
              swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
              swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
              swiper.onSlideToWrapperTransitionEnd = null;
              delete swiper.onSlideToWrapperTransitionEnd;
              swiper.transitionEnd(runCallbacks, direction);
            };
          }

          swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
          swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
        }
      }

      return true;
    }

    function slideToLoop(index, speed, runCallbacks, internal) {
      if (index === void 0) {
        index = 0;
      }

      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      var swiper = this;
      var newIndex = index;

      if (swiper.params.loop) {
        newIndex += swiper.loopedSlides;
      }

      return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideNext(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      var swiper = this;
      var params = swiper.params,
          animating = swiper.animating;
      var increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup;

      if (params.loop) {
        if (animating && params.loopPreventsSlide) return false;
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      }

      return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slidePrev(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      var swiper = this;
      var params = swiper.params,
          animating = swiper.animating,
          snapGrid = swiper.snapGrid,
          slidesGrid = swiper.slidesGrid,
          rtlTranslate = swiper.rtlTranslate;

      if (params.loop) {
        if (animating && params.loopPreventsSlide) return false;
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
      }

      var translate = rtlTranslate ? swiper.translate : -swiper.translate;

      function normalize(val) {
        if (val < 0) return -Math.floor(Math.abs(val));
        return Math.floor(val);
      }

      var normalizedTranslate = normalize(translate);
      var normalizedSnapGrid = snapGrid.map(function (val) {
        return normalize(val);
      });
      snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate)];
      var prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

      if (typeof prevSnap === 'undefined' && params.cssMode) {
        snapGrid.forEach(function (snap) {
          if (!prevSnap && normalizedTranslate >= snap) prevSnap = snap;
        });
      }

      var prevIndex;

      if (typeof prevSnap !== 'undefined') {
        prevIndex = slidesGrid.indexOf(prevSnap);
        if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
      }

      return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideReset(speed, runCallbacks, internal) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      var swiper = this;
      return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }

    /* eslint no-unused-vars: "off" */
    function slideToClosest(speed, runCallbacks, internal, threshold) {
      if (speed === void 0) {
        speed = this.params.speed;
      }

      if (runCallbacks === void 0) {
        runCallbacks = true;
      }

      if (threshold === void 0) {
        threshold = 0.5;
      }

      var swiper = this;
      var index = swiper.activeIndex;
      var skip = Math.min(swiper.params.slidesPerGroupSkip, index);
      var snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
      var translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

      if (translate >= swiper.snapGrid[snapIndex]) {
        // The current translate is on or after the current snap index, so the choice
        // is between the current index and the one after it.
        var currentSnap = swiper.snapGrid[snapIndex];
        var nextSnap = swiper.snapGrid[snapIndex + 1];

        if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
          index += swiper.params.slidesPerGroup;
        }
      } else {
        // The current translate is before the current snap index, so the choice
        // is between the current index and the one before it.
        var prevSnap = swiper.snapGrid[snapIndex - 1];
        var _currentSnap = swiper.snapGrid[snapIndex];

        if (translate - prevSnap <= (_currentSnap - prevSnap) * threshold) {
          index -= swiper.params.slidesPerGroup;
        }
      }

      index = Math.max(index, 0);
      index = Math.min(index, swiper.slidesGrid.length - 1);
      return swiper.slideTo(index, speed, runCallbacks, internal);
    }

    function slideToClickedSlide() {
      var swiper = this;
      var params = swiper.params,
          $wrapperEl = swiper.$wrapperEl;
      var slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
      var slideToIndex = swiper.clickedIndex;
      var realIndex;

      if (params.loop) {
        if (swiper.animating) return;
        realIndex = parseInt($(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);

        if (params.centeredSlides) {
          if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
            swiper.loopFix();
            slideToIndex = $wrapperEl.children("." + params.slideClass + "[data-swiper-slide-index=\"" + realIndex + "\"]:not(." + params.slideDuplicateClass + ")").eq(0).index();
            nextTick(function () {
              swiper.slideTo(slideToIndex);
            });
          } else {
            swiper.slideTo(slideToIndex);
          }
        } else if (slideToIndex > swiper.slides.length - slidesPerView) {
          swiper.loopFix();
          slideToIndex = $wrapperEl.children("." + params.slideClass + "[data-swiper-slide-index=\"" + realIndex + "\"]:not(." + params.slideDuplicateClass + ")").eq(0).index();
          nextTick(function () {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else {
        swiper.slideTo(slideToIndex);
      }
    }

    var slide = {
      slideTo: slideTo,
      slideToLoop: slideToLoop,
      slideNext: slideNext,
      slidePrev: slidePrev,
      slideReset: slideReset,
      slideToClosest: slideToClosest,
      slideToClickedSlide: slideToClickedSlide
    };

    function loopCreate() {
      var swiper = this;
      var document = getDocument();
      var params = swiper.params,
          $wrapperEl = swiper.$wrapperEl; // Remove duplicated slides

      $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass).remove();
      var slides = $wrapperEl.children("." + params.slideClass);

      if (params.loopFillGroupWithBlank) {
        var blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

        if (blankSlidesNum !== params.slidesPerGroup) {
          for (var i = 0; i < blankSlidesNum; i += 1) {
            var blankNode = $(document.createElement('div')).addClass(params.slideClass + " " + params.slideBlankClass);
            $wrapperEl.append(blankNode);
          }

          slides = $wrapperEl.children("." + params.slideClass);
        }
      }

      if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;
      swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
      swiper.loopedSlides += params.loopAdditionalSlides;

      if (swiper.loopedSlides > slides.length) {
        swiper.loopedSlides = slides.length;
      }

      var prependSlides = [];
      var appendSlides = [];
      slides.each(function (el, index) {
        var slide = $(el);

        if (index < swiper.loopedSlides) {
          appendSlides.push(el);
        }

        if (index < slides.length && index >= slides.length - swiper.loopedSlides) {
          prependSlides.push(el);
        }

        slide.attr('data-swiper-slide-index', index);
      });

      for (var _i = 0; _i < appendSlides.length; _i += 1) {
        $wrapperEl.append($(appendSlides[_i].cloneNode(true)).addClass(params.slideDuplicateClass));
      }

      for (var _i2 = prependSlides.length - 1; _i2 >= 0; _i2 -= 1) {
        $wrapperEl.prepend($(prependSlides[_i2].cloneNode(true)).addClass(params.slideDuplicateClass));
      }
    }

    function loopFix() {
      var swiper = this;
      swiper.emit('beforeLoopFix');
      var activeIndex = swiper.activeIndex,
          slides = swiper.slides,
          loopedSlides = swiper.loopedSlides,
          allowSlidePrev = swiper.allowSlidePrev,
          allowSlideNext = swiper.allowSlideNext,
          snapGrid = swiper.snapGrid,
          rtl = swiper.rtlTranslate;
      var newIndex;
      swiper.allowSlidePrev = true;
      swiper.allowSlideNext = true;
      var snapTranslate = -snapGrid[activeIndex];
      var diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

      if (activeIndex < loopedSlides) {
        newIndex = slides.length - loopedSlides * 3 + activeIndex;
        newIndex += loopedSlides;
        var slideChanged = swiper.slideTo(newIndex, 0, false, true);

        if (slideChanged && diff !== 0) {
          swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
      } else if (activeIndex >= slides.length - loopedSlides) {
        // Fix For Positive Oversliding
        newIndex = -slides.length + activeIndex + loopedSlides;
        newIndex += loopedSlides;

        var _slideChanged = swiper.slideTo(newIndex, 0, false, true);

        if (_slideChanged && diff !== 0) {
          swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
      }

      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit('loopFix');
    }

    function loopDestroy() {
      var swiper = this;
      var $wrapperEl = swiper.$wrapperEl,
          params = swiper.params,
          slides = swiper.slides;
      $wrapperEl.children("." + params.slideClass + "." + params.slideDuplicateClass + ",." + params.slideClass + "." + params.slideBlankClass).remove();
      slides.removeAttr('data-swiper-slide-index');
    }

    var loop = {
      loopCreate: loopCreate,
      loopFix: loopFix,
      loopDestroy: loopDestroy
    };

    function setGrabCursor(moving) {
      var swiper = this;
      if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
      var el = swiper.el;
      el.style.cursor = 'move';
      el.style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
      el.style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
      el.style.cursor = moving ? 'grabbing' : 'grab';
    }

    function unsetGrabCursor() {
      var swiper = this;

      if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
        return;
      }

      swiper.el.style.cursor = '';
    }

    var grabCursor = {
      setGrabCursor: setGrabCursor,
      unsetGrabCursor: unsetGrabCursor
    };

    function appendSlide(slides) {
      var swiper = this;
      var $wrapperEl = swiper.$wrapperEl,
          params = swiper.params;

      if (params.loop) {
        swiper.loopDestroy();
      }

      if (typeof slides === 'object' && 'length' in slides) {
        for (var i = 0; i < slides.length; i += 1) {
          if (slides[i]) $wrapperEl.append(slides[i]);
        }
      } else {
        $wrapperEl.append(slides);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!(params.observer && swiper.support.observer)) {
        swiper.update();
      }
    }

    function prependSlide(slides) {
      var swiper = this;
      var params = swiper.params,
          $wrapperEl = swiper.$wrapperEl,
          activeIndex = swiper.activeIndex;

      if (params.loop) {
        swiper.loopDestroy();
      }

      var newActiveIndex = activeIndex + 1;

      if (typeof slides === 'object' && 'length' in slides) {
        for (var i = 0; i < slides.length; i += 1) {
          if (slides[i]) $wrapperEl.prepend(slides[i]);
        }

        newActiveIndex = activeIndex + slides.length;
      } else {
        $wrapperEl.prepend(slides);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!(params.observer && swiper.support.observer)) {
        swiper.update();
      }

      swiper.slideTo(newActiveIndex, 0, false);
    }

    function addSlide(index, slides) {
      var swiper = this;
      var $wrapperEl = swiper.$wrapperEl,
          params = swiper.params,
          activeIndex = swiper.activeIndex;
      var activeIndexBuffer = activeIndex;

      if (params.loop) {
        activeIndexBuffer -= swiper.loopedSlides;
        swiper.loopDestroy();
        swiper.slides = $wrapperEl.children("." + params.slideClass);
      }

      var baseLength = swiper.slides.length;

      if (index <= 0) {
        swiper.prependSlide(slides);
        return;
      }

      if (index >= baseLength) {
        swiper.appendSlide(slides);
        return;
      }

      var newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
      var slidesBuffer = [];

      for (var i = baseLength - 1; i >= index; i -= 1) {
        var currentSlide = swiper.slides.eq(i);
        currentSlide.remove();
        slidesBuffer.unshift(currentSlide);
      }

      if (typeof slides === 'object' && 'length' in slides) {
        for (var _i = 0; _i < slides.length; _i += 1) {
          if (slides[_i]) $wrapperEl.append(slides[_i]);
        }

        newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
      } else {
        $wrapperEl.append(slides);
      }

      for (var _i2 = 0; _i2 < slidesBuffer.length; _i2 += 1) {
        $wrapperEl.append(slidesBuffer[_i2]);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!(params.observer && swiper.support.observer)) {
        swiper.update();
      }

      if (params.loop) {
        swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
      } else {
        swiper.slideTo(newActiveIndex, 0, false);
      }
    }

    function removeSlide(slidesIndexes) {
      var swiper = this;
      var params = swiper.params,
          $wrapperEl = swiper.$wrapperEl,
          activeIndex = swiper.activeIndex;
      var activeIndexBuffer = activeIndex;

      if (params.loop) {
        activeIndexBuffer -= swiper.loopedSlides;
        swiper.loopDestroy();
        swiper.slides = $wrapperEl.children("." + params.slideClass);
      }

      var newActiveIndex = activeIndexBuffer;
      var indexToRemove;

      if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
        for (var i = 0; i < slidesIndexes.length; i += 1) {
          indexToRemove = slidesIndexes[i];
          if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
          if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
        }

        newActiveIndex = Math.max(newActiveIndex, 0);
      } else {
        indexToRemove = slidesIndexes;
        if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
        if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
        newActiveIndex = Math.max(newActiveIndex, 0);
      }

      if (params.loop) {
        swiper.loopCreate();
      }

      if (!(params.observer && swiper.support.observer)) {
        swiper.update();
      }

      if (params.loop) {
        swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
      } else {
        swiper.slideTo(newActiveIndex, 0, false);
      }
    }

    function removeAllSlides() {
      var swiper = this;
      var slidesIndexes = [];

      for (var i = 0; i < swiper.slides.length; i += 1) {
        slidesIndexes.push(i);
      }

      swiper.removeSlide(slidesIndexes);
    }

    var manipulation = {
      appendSlide: appendSlide,
      prependSlide: prependSlide,
      addSlide: addSlide,
      removeSlide: removeSlide,
      removeAllSlides: removeAllSlides
    };

    function onTouchStart(event) {
      var swiper = this;
      var document = getDocument();
      var window = getWindow();
      var data = swiper.touchEventsData;
      var params = swiper.params,
          touches = swiper.touches;

      if (swiper.animating && params.preventInteractionOnTransition) {
        return;
      }

      var e = event;
      if (e.originalEvent) e = e.originalEvent;
      var $targetEl = $(e.target);

      if (params.touchEventsTarget === 'wrapper') {
        if (!$targetEl.closest(swiper.wrapperEl).length) return;
      }

      data.isTouchEvent = e.type === 'touchstart';
      if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
      if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
      if (data.isTouched && data.isMoved) return; // change target el for shadow root componenet

      var swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';

      if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) {
        $targetEl = $(event.path[0]);
      }

      if (params.noSwiping && $targetEl.closest(params.noSwipingSelector ? params.noSwipingSelector : "." + params.noSwipingClass)[0]) {
        swiper.allowClick = true;
        return;
      }

      if (params.swipeHandler) {
        if (!$targetEl.closest(params.swipeHandler)[0]) return;
      }

      touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
      touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      var startX = touches.currentX;
      var startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

      var edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
      var edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

      if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
        if (edgeSwipeDetection === 'prevent') {
          event.preventDefault();
        } else {
          return;
        }
      }

      extend$1(data, {
        isTouched: true,
        isMoved: false,
        allowTouchCallbacks: true,
        isScrolling: undefined,
        startMoving: undefined
      });
      touches.startX = startX;
      touches.startY = startY;
      data.touchStartTime = now();
      swiper.allowClick = true;
      swiper.updateSize();
      swiper.swipeDirection = undefined;
      if (params.threshold > 0) data.allowThresholdMove = false;

      if (e.type !== 'touchstart') {
        var preventDefault = true;
        if ($targetEl.is(data.formElements)) preventDefault = false;

        if (document.activeElement && $(document.activeElement).is(data.formElements) && document.activeElement !== $targetEl[0]) {
          document.activeElement.blur();
        }

        var shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

        if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
          e.preventDefault();
        }
      }

      swiper.emit('touchStart', e);
    }

    function onTouchMove(event) {
      var document = getDocument();
      var swiper = this;
      var data = swiper.touchEventsData;
      var params = swiper.params,
          touches = swiper.touches,
          rtl = swiper.rtlTranslate;
      var e = event;
      if (e.originalEvent) e = e.originalEvent;

      if (!data.isTouched) {
        if (data.startMoving && data.isScrolling) {
          swiper.emit('touchMoveOpposite', e);
        }

        return;
      }

      if (data.isTouchEvent && e.type !== 'touchmove') return;
      var targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
      var pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
      var pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

      if (e.preventedByNestedSwiper) {
        touches.startX = pageX;
        touches.startY = pageY;
        return;
      }

      if (!swiper.allowTouchMove) {
        // isMoved = true;
        swiper.allowClick = false;

        if (data.isTouched) {
          extend$1(touches, {
            startX: pageX,
            startY: pageY,
            currentX: pageX,
            currentY: pageY
          });
          data.touchStartTime = now();
        }

        return;
      }

      if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
        if (swiper.isVertical()) {
          // Vertical
          if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
            data.isTouched = false;
            data.isMoved = false;
            return;
          }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
          return;
        }
      }

      if (data.isTouchEvent && document.activeElement) {
        if (e.target === document.activeElement && $(e.target).is(data.formElements)) {
          data.isMoved = true;
          swiper.allowClick = false;
          return;
        }
      }

      if (data.allowTouchCallbacks) {
        swiper.emit('touchMove', e);
      }

      if (e.targetTouches && e.targetTouches.length > 1) return;
      touches.currentX = pageX;
      touches.currentY = pageY;
      var diffX = touches.currentX - touches.startX;
      var diffY = touches.currentY - touches.startY;
      if (swiper.params.threshold && Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)) < swiper.params.threshold) return;

      if (typeof data.isScrolling === 'undefined') {
        var touchAngle;

        if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
          data.isScrolling = false;
        } else {
          // eslint-disable-next-line
          if (diffX * diffX + diffY * diffY >= 25) {
            touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
            data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
          }
        }
      }

      if (data.isScrolling) {
        swiper.emit('touchMoveOpposite', e);
      }

      if (typeof data.startMoving === 'undefined') {
        if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
          data.startMoving = true;
        }
      }

      if (data.isScrolling) {
        data.isTouched = false;
        return;
      }

      if (!data.startMoving) {
        return;
      }

      swiper.allowClick = false;

      if (!params.cssMode && e.cancelable) {
        e.preventDefault();
      }

      if (params.touchMoveStopPropagation && !params.nested) {
        e.stopPropagation();
      }

      if (!data.isMoved) {
        if (params.loop) {
          swiper.loopFix();
        }

        data.startTranslate = swiper.getTranslate();
        swiper.setTransition(0);

        if (swiper.animating) {
          swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
        }

        data.allowMomentumBounce = false; // Grab Cursor

        if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
          swiper.setGrabCursor(true);
        }

        swiper.emit('sliderFirstMove', e);
      }

      swiper.emit('sliderMove', e);
      data.isMoved = true;
      var diff = swiper.isHorizontal() ? diffX : diffY;
      touches.diff = diff;
      diff *= params.touchRatio;
      if (rtl) diff = -diff;
      swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
      data.currentTranslate = diff + data.startTranslate;
      var disableParentSwiper = true;
      var resistanceRatio = params.resistanceRatio;

      if (params.touchReleaseOnEdges) {
        resistanceRatio = 0;
      }

      if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + Math.pow(-swiper.minTranslate() + data.startTranslate + diff, resistanceRatio);
      } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - Math.pow(swiper.maxTranslate() - data.startTranslate - diff, resistanceRatio);
      }

      if (disableParentSwiper) {
        e.preventedByNestedSwiper = true;
      } // Directions locks


      if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
        data.currentTranslate = data.startTranslate;
      }

      if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
        data.currentTranslate = data.startTranslate;
      }

      if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
        data.currentTranslate = data.startTranslate;
      } // Threshold


      if (params.threshold > 0) {
        if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
          if (!data.allowThresholdMove) {
            data.allowThresholdMove = true;
            touches.startX = touches.currentX;
            touches.startY = touches.currentY;
            data.currentTranslate = data.startTranslate;
            touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
            return;
          }
        } else {
          data.currentTranslate = data.startTranslate;
          return;
        }
      }

      if (!params.followFinger || params.cssMode) return; // Update active index in free mode

      if (params.freeMode || params.watchSlidesProgress || params.watchSlidesVisibility) {
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }

      if (params.freeMode) {
        // Velocity
        if (data.velocities.length === 0) {
          data.velocities.push({
            position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
            time: data.touchStartTime
          });
        }

        data.velocities.push({
          position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
          time: now()
        });
      } // Update progress


      swiper.updateProgress(data.currentTranslate); // Update translate

      swiper.setTranslate(data.currentTranslate);
    }

    function onTouchEnd(event) {
      var swiper = this;
      var data = swiper.touchEventsData;
      var params = swiper.params,
          touches = swiper.touches,
          rtl = swiper.rtlTranslate,
          $wrapperEl = swiper.$wrapperEl,
          slidesGrid = swiper.slidesGrid,
          snapGrid = swiper.snapGrid;
      var e = event;
      if (e.originalEvent) e = e.originalEvent;

      if (data.allowTouchCallbacks) {
        swiper.emit('touchEnd', e);
      }

      data.allowTouchCallbacks = false;

      if (!data.isTouched) {
        if (data.isMoved && params.grabCursor) {
          swiper.setGrabCursor(false);
        }

        data.isMoved = false;
        data.startMoving = false;
        return;
      } // Return Grab Cursor


      if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(false);
      } // Time diff


      var touchEndTime = now();
      var timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

      if (swiper.allowClick) {
        swiper.updateClickedSlide(e);
        swiper.emit('tap click', e);

        if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
          swiper.emit('doubleTap doubleClick', e);
        }
      }

      data.lastClickTime = now();
      nextTick(function () {
        if (!swiper.destroyed) swiper.allowClick = true;
      });

      if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        return;
      }

      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      var currentPos;

      if (params.followFinger) {
        currentPos = rtl ? swiper.translate : -swiper.translate;
      } else {
        currentPos = -data.currentTranslate;
      }

      if (params.cssMode) {
        return;
      }

      if (params.freeMode) {
        if (currentPos < -swiper.minTranslate()) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        if (currentPos > -swiper.maxTranslate()) {
          if (swiper.slides.length < snapGrid.length) {
            swiper.slideTo(snapGrid.length - 1);
          } else {
            swiper.slideTo(swiper.slides.length - 1);
          }

          return;
        }

        if (params.freeModeMomentum) {
          if (data.velocities.length > 1) {
            var lastMoveEvent = data.velocities.pop();
            var velocityEvent = data.velocities.pop();
            var distance = lastMoveEvent.position - velocityEvent.position;
            var time = lastMoveEvent.time - velocityEvent.time;
            swiper.velocity = distance / time;
            swiper.velocity /= 2;

            if (Math.abs(swiper.velocity) < params.freeModeMinimumVelocity) {
              swiper.velocity = 0;
            } // this implies that the user stopped moving a finger then released.
            // There would be no events with distance zero, so the last event is stale.


            if (time > 150 || now() - lastMoveEvent.time > 300) {
              swiper.velocity = 0;
            }
          } else {
            swiper.velocity = 0;
          }

          swiper.velocity *= params.freeModeMomentumVelocityRatio;
          data.velocities.length = 0;
          var momentumDuration = 1000 * params.freeModeMomentumRatio;
          var momentumDistance = swiper.velocity * momentumDuration;
          var newPosition = swiper.translate + momentumDistance;
          if (rtl) newPosition = -newPosition;
          var doBounce = false;
          var afterBouncePosition;
          var bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeModeMomentumBounceRatio;
          var needsLoopFix;

          if (newPosition < swiper.maxTranslate()) {
            if (params.freeModeMomentumBounce) {
              if (newPosition + swiper.maxTranslate() < -bounceAmount) {
                newPosition = swiper.maxTranslate() - bounceAmount;
              }

              afterBouncePosition = swiper.maxTranslate();
              doBounce = true;
              data.allowMomentumBounce = true;
            } else {
              newPosition = swiper.maxTranslate();
            }

            if (params.loop && params.centeredSlides) needsLoopFix = true;
          } else if (newPosition > swiper.minTranslate()) {
            if (params.freeModeMomentumBounce) {
              if (newPosition - swiper.minTranslate() > bounceAmount) {
                newPosition = swiper.minTranslate() + bounceAmount;
              }

              afterBouncePosition = swiper.minTranslate();
              doBounce = true;
              data.allowMomentumBounce = true;
            } else {
              newPosition = swiper.minTranslate();
            }

            if (params.loop && params.centeredSlides) needsLoopFix = true;
          } else if (params.freeModeSticky) {
            var nextSlide;

            for (var j = 0; j < snapGrid.length; j += 1) {
              if (snapGrid[j] > -newPosition) {
                nextSlide = j;
                break;
              }
            }

            if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
              newPosition = snapGrid[nextSlide];
            } else {
              newPosition = snapGrid[nextSlide - 1];
            }

            newPosition = -newPosition;
          }

          if (needsLoopFix) {
            swiper.once('transitionEnd', function () {
              swiper.loopFix();
            });
          } // Fix duration


          if (swiper.velocity !== 0) {
            if (rtl) {
              momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
            } else {
              momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
            }

            if (params.freeModeSticky) {
              // If freeModeSticky is active and the user ends a swipe with a slow-velocity
              // event, then durations can be 20+ seconds to slide one (or zero!) slides.
              // It's easy to see this when simulating touch with mouse events. To fix this,
              // limit single-slide swipes to the default slide duration. This also has the
              // nice side effect of matching slide speed if the user stopped moving before
              // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
              // For faster swipes, also apply limits (albeit higher ones).
              var moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
              var currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];

              if (moveDistance < currentSlideSize) {
                momentumDuration = params.speed;
              } else if (moveDistance < 2 * currentSlideSize) {
                momentumDuration = params.speed * 1.5;
              } else {
                momentumDuration = params.speed * 2.5;
              }
            }
          } else if (params.freeModeSticky) {
            swiper.slideToClosest();
            return;
          }

          if (params.freeModeMomentumBounce && doBounce) {
            swiper.updateProgress(afterBouncePosition);
            swiper.setTransition(momentumDuration);
            swiper.setTranslate(newPosition);
            swiper.transitionStart(true, swiper.swipeDirection);
            swiper.animating = true;
            $wrapperEl.transitionEnd(function () {
              if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
              swiper.emit('momentumBounce');
              swiper.setTransition(params.speed);
              setTimeout(function () {
                swiper.setTranslate(afterBouncePosition);
                $wrapperEl.transitionEnd(function () {
                  if (!swiper || swiper.destroyed) return;
                  swiper.transitionEnd();
                });
              }, 0);
            });
          } else if (swiper.velocity) {
            swiper.updateProgress(newPosition);
            swiper.setTransition(momentumDuration);
            swiper.setTranslate(newPosition);
            swiper.transitionStart(true, swiper.swipeDirection);

            if (!swiper.animating) {
              swiper.animating = true;
              $wrapperEl.transitionEnd(function () {
                if (!swiper || swiper.destroyed) return;
                swiper.transitionEnd();
              });
            }
          } else {
            swiper.emit('_freeModeNoMomentumRelease');
            swiper.updateProgress(newPosition);
          }

          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        } else if (params.freeModeSticky) {
          swiper.slideToClosest();
          return;
        } else if (params.freeMode) {
          swiper.emit('_freeModeNoMomentumRelease');
        }

        if (!params.freeModeMomentum || timeDiff >= params.longSwipesMs) {
          swiper.updateProgress();
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        }

        return;
      } // Find current slide


      var stopIndex = 0;
      var groupSize = swiper.slidesSizesGrid[0];

      for (var i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
        var _increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

        if (typeof slidesGrid[i + _increment] !== 'undefined') {
          if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + _increment]) {
            stopIndex = i;
            groupSize = slidesGrid[i + _increment] - slidesGrid[i];
          }
        } else if (currentPos >= slidesGrid[i]) {
          stopIndex = i;
          groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
        }
      } // Find current slide size


      var ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
      var increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

      if (timeDiff > params.longSwipesMs) {
        // Long touches
        if (!params.longSwipes) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        if (swiper.swipeDirection === 'next') {
          if (ratio >= params.longSwipesRatio) swiper.slideTo(stopIndex + increment);else swiper.slideTo(stopIndex);
        }

        if (swiper.swipeDirection === 'prev') {
          if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment);else swiper.slideTo(stopIndex);
        }
      } else {
        // Short swipes
        if (!params.shortSwipes) {
          swiper.slideTo(swiper.activeIndex);
          return;
        }

        var isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

        if (!isNavButtonTarget) {
          if (swiper.swipeDirection === 'next') {
            swiper.slideTo(stopIndex + increment);
          }

          if (swiper.swipeDirection === 'prev') {
            swiper.slideTo(stopIndex);
          }
        } else if (e.target === swiper.navigation.nextEl) {
          swiper.slideTo(stopIndex + increment);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    }

    function onResize() {
      var swiper = this;
      var params = swiper.params,
          el = swiper.el;
      if (el && el.offsetWidth === 0) return; // Breakpoints

      if (params.breakpoints) {
        swiper.setBreakpoint();
      } // Save locks


      var allowSlideNext = swiper.allowSlideNext,
          allowSlidePrev = swiper.allowSlidePrev,
          snapGrid = swiper.snapGrid; // Disable locks on resize

      swiper.allowSlideNext = true;
      swiper.allowSlidePrev = true;
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateSlidesClasses();

      if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
        swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        swiper.slideTo(swiper.activeIndex, 0, false, true);
      }

      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
        swiper.autoplay.run();
      } // Return locks after resize


      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;

      if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
    }

    function onClick(e) {
      var swiper = this;

      if (!swiper.allowClick) {
        if (swiper.params.preventClicks) e.preventDefault();

        if (swiper.params.preventClicksPropagation && swiper.animating) {
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }
    }

    function onScroll() {
      var swiper = this;
      var wrapperEl = swiper.wrapperEl,
          rtlTranslate = swiper.rtlTranslate;
      swiper.previousTranslate = swiper.translate;

      if (swiper.isHorizontal()) {
        if (rtlTranslate) {
          swiper.translate = wrapperEl.scrollWidth - wrapperEl.offsetWidth - wrapperEl.scrollLeft;
        } else {
          swiper.translate = -wrapperEl.scrollLeft;
        }
      } else {
        swiper.translate = -wrapperEl.scrollTop;
      } // eslint-disable-next-line


      if (swiper.translate === -0) swiper.translate = 0;
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
      var newProgress;
      var translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

      if (translatesDiff === 0) {
        newProgress = 0;
      } else {
        newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
      }

      if (newProgress !== swiper.progress) {
        swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
      }

      swiper.emit('setTranslate', swiper.translate, false);
    }

    var dummyEventAttached = false;

    function dummyEventListener() {}

    function attachEvents() {
      var swiper = this;
      var document = getDocument();
      var params = swiper.params,
          touchEvents = swiper.touchEvents,
          el = swiper.el,
          wrapperEl = swiper.wrapperEl,
          device = swiper.device,
          support = swiper.support;
      swiper.onTouchStart = onTouchStart.bind(swiper);
      swiper.onTouchMove = onTouchMove.bind(swiper);
      swiper.onTouchEnd = onTouchEnd.bind(swiper);

      if (params.cssMode) {
        swiper.onScroll = onScroll.bind(swiper);
      }

      swiper.onClick = onClick.bind(swiper);
      var capture = !!params.nested; // Touch Events

      if (!support.touch && support.pointerEvents) {
        el.addEventListener(touchEvents.start, swiper.onTouchStart, false);
        document.addEventListener(touchEvents.move, swiper.onTouchMove, capture);
        document.addEventListener(touchEvents.end, swiper.onTouchEnd, false);
      } else {
        if (support.touch) {
          var passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
            passive: true,
            capture: false
          } : false;
          el.addEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
          el.addEventListener(touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
            passive: false,
            capture: capture
          } : capture);
          el.addEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);

          if (touchEvents.cancel) {
            el.addEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
          }

          if (!dummyEventAttached) {
            document.addEventListener('touchstart', dummyEventListener);
            dummyEventAttached = true;
          }
        }

        if (params.simulateTouch && !device.ios && !device.android || params.simulateTouch && !support.touch && device.ios) {
          el.addEventListener('mousedown', swiper.onTouchStart, false);
          document.addEventListener('mousemove', swiper.onTouchMove, capture);
          document.addEventListener('mouseup', swiper.onTouchEnd, false);
        }
      } // Prevent Links Clicks


      if (params.preventClicks || params.preventClicksPropagation) {
        el.addEventListener('click', swiper.onClick, true);
      }

      if (params.cssMode) {
        wrapperEl.addEventListener('scroll', swiper.onScroll);
      } // Resize handler


      if (params.updateOnWindowResize) {
        swiper.on(device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
      } else {
        swiper.on('observerUpdate', onResize, true);
      }
    }

    function detachEvents() {
      var swiper = this;
      var document = getDocument();
      var params = swiper.params,
          touchEvents = swiper.touchEvents,
          el = swiper.el,
          wrapperEl = swiper.wrapperEl,
          device = swiper.device,
          support = swiper.support;
      var capture = !!params.nested; // Touch Events

      if (!support.touch && support.pointerEvents) {
        el.removeEventListener(touchEvents.start, swiper.onTouchStart, false);
        document.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
        document.removeEventListener(touchEvents.end, swiper.onTouchEnd, false);
      } else {
        if (support.touch) {
          var passiveListener = touchEvents.start === 'onTouchStart' && support.passiveListener && params.passiveListeners ? {
            passive: true,
            capture: false
          } : false;
          el.removeEventListener(touchEvents.start, swiper.onTouchStart, passiveListener);
          el.removeEventListener(touchEvents.move, swiper.onTouchMove, capture);
          el.removeEventListener(touchEvents.end, swiper.onTouchEnd, passiveListener);

          if (touchEvents.cancel) {
            el.removeEventListener(touchEvents.cancel, swiper.onTouchEnd, passiveListener);
          }
        }

        if (params.simulateTouch && !device.ios && !device.android || params.simulateTouch && !support.touch && device.ios) {
          el.removeEventListener('mousedown', swiper.onTouchStart, false);
          document.removeEventListener('mousemove', swiper.onTouchMove, capture);
          document.removeEventListener('mouseup', swiper.onTouchEnd, false);
        }
      } // Prevent Links Clicks


      if (params.preventClicks || params.preventClicksPropagation) {
        el.removeEventListener('click', swiper.onClick, true);
      }

      if (params.cssMode) {
        wrapperEl.removeEventListener('scroll', swiper.onScroll);
      } // Resize handler


      swiper.off(device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize);
    }

    var events = {
      attachEvents: attachEvents,
      detachEvents: detachEvents
    };

    function setBreakpoint() {
      var swiper = this;
      var activeIndex = swiper.activeIndex,
          initialized = swiper.initialized,
          _swiper$loopedSlides = swiper.loopedSlides,
          loopedSlides = _swiper$loopedSlides === void 0 ? 0 : _swiper$loopedSlides,
          params = swiper.params,
          $el = swiper.$el;
      var breakpoints = params.breakpoints;
      if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

      var breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);

      if (breakpoint && swiper.currentBreakpoint !== breakpoint) {
        var breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;

        if (breakpointOnlyParams) {
          ['slidesPerView', 'spaceBetween', 'slidesPerGroup', 'slidesPerGroupSkip', 'slidesPerColumn'].forEach(function (param) {
            var paramValue = breakpointOnlyParams[param];
            if (typeof paramValue === 'undefined') return;

            if (param === 'slidesPerView' && (paramValue === 'AUTO' || paramValue === 'auto')) {
              breakpointOnlyParams[param] = 'auto';
            } else if (param === 'slidesPerView') {
              breakpointOnlyParams[param] = parseFloat(paramValue);
            } else {
              breakpointOnlyParams[param] = parseInt(paramValue, 10);
            }
          });
        }

        var breakpointParams = breakpointOnlyParams || swiper.originalParams;
        var wasMultiRow = params.slidesPerColumn > 1;
        var isMultiRow = breakpointParams.slidesPerColumn > 1;

        if (wasMultiRow && !isMultiRow) {
          $el.removeClass(params.containerModifierClass + "multirow " + params.containerModifierClass + "multirow-column");
          swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
          $el.addClass(params.containerModifierClass + "multirow");

          if (breakpointParams.slidesPerColumnFill === 'column') {
            $el.addClass(params.containerModifierClass + "multirow-column");
          }

          swiper.emitContainerClasses();
        }

        var directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        var needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

        if (directionChanged && initialized) {
          swiper.changeDirection();
        }

        extend$1(swiper.params, breakpointParams);
        extend$1(swiper, {
          allowTouchMove: swiper.params.allowTouchMove,
          allowSlideNext: swiper.params.allowSlideNext,
          allowSlidePrev: swiper.params.allowSlidePrev
        });
        swiper.currentBreakpoint = breakpoint;
        swiper.emit('_beforeBreakpoint', breakpointParams);

        if (needsReLoop && initialized) {
          swiper.loopDestroy();
          swiper.loopCreate();
          swiper.updateSlides();
          swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }

        swiper.emit('breakpoint', breakpointParams);
      }
    }

    function getBreakpoint(breakpoints, base, containerEl) {
      if (base === void 0) {
        base = 'window';
      }

      if (!breakpoints || base === 'container' && !containerEl) return undefined;
      var breakpoint = false;
      var window = getWindow();
      var currentWidth = base === 'window' ? window.innerWidth : containerEl.clientWidth;
      var currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
      var points = Object.keys(breakpoints).map(function (point) {
        if (typeof point === 'string' && point.indexOf('@') === 0) {
          var minRatio = parseFloat(point.substr(1));
          var value = currentHeight * minRatio;
          return {
            value: value,
            point: point
          };
        }

        return {
          value: point,
          point: point
        };
      });
      points.sort(function (a, b) {
        return parseInt(a.value, 10) - parseInt(b.value, 10);
      });

      for (var i = 0; i < points.length; i += 1) {
        var _points$i = points[i],
            point = _points$i.point,
            value = _points$i.value;

        if (value <= currentWidth) {
          breakpoint = point;
        }
      }

      return breakpoint || 'max';
    }

    var breakpoints = {
      setBreakpoint: setBreakpoint,
      getBreakpoint: getBreakpoint
    };

    function prepareClasses(entries, prefix) {
      var resultClasses = [];
      entries.forEach(function (item) {
        if (typeof item === 'object') {
          Object.keys(item).forEach(function (classNames) {
            if (item[classNames]) {
              resultClasses.push(prefix + classNames);
            }
          });
        } else if (typeof item === 'string') {
          resultClasses.push(prefix + item);
        }
      });
      return resultClasses;
    }

    function addClasses() {
      var swiper = this;
      var classNames = swiper.classNames,
          params = swiper.params,
          rtl = swiper.rtl,
          $el = swiper.$el,
          device = swiper.device,
          support = swiper.support; // prettier-ignore

      var suffixes = prepareClasses(['initialized', params.direction, {
        'pointer-events': support.pointerEvents && !support.touch
      }, {
        'free-mode': params.freeMode
      }, {
        'autoheight': params.autoHeight
      }, {
        'rtl': rtl
      }, {
        'multirow': params.slidesPerColumn > 1
      }, {
        'multirow-column': params.slidesPerColumn > 1 && params.slidesPerColumnFill === 'column'
      }, {
        'android': device.android
      }, {
        'ios': device.ios
      }, {
        'css-mode': params.cssMode
      }], params.containerModifierClass);
      classNames.push.apply(classNames, suffixes);
      $el.addClass([].concat(classNames).join(' '));
      swiper.emitContainerClasses();
    }

    function removeClasses() {
      var swiper = this;
      var $el = swiper.$el,
          classNames = swiper.classNames;
      $el.removeClass(classNames.join(' '));
      swiper.emitContainerClasses();
    }

    var classes = {
      addClasses: addClasses,
      removeClasses: removeClasses
    };

    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
      var window = getWindow();
      var image;

      function onReady() {
        if (callback) callback();
      }

      var isPicture = $(imageEl).parent('picture')[0];

      if (!isPicture && (!imageEl.complete || !checkForComplete)) {
        if (src) {
          image = new window.Image();
          image.onload = onReady;
          image.onerror = onReady;

          if (sizes) {
            image.sizes = sizes;
          }

          if (srcset) {
            image.srcset = srcset;
          }

          if (src) {
            image.src = src;
          }
        } else {
          onReady();
        }
      } else {
        // image already loaded...
        onReady();
      }
    }

    function preloadImages() {
      var swiper = this;
      swiper.imagesToLoad = swiper.$el.find('img');

      function onReady() {
        if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
        if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

        if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
          if (swiper.params.updateOnImagesReady) swiper.update();
          swiper.emit('imagesReady');
        }
      }

      for (var i = 0; i < swiper.imagesToLoad.length; i += 1) {
        var imageEl = swiper.imagesToLoad[i];
        swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
      }
    }

    var images = {
      loadImage: loadImage,
      preloadImages: preloadImages
    };

    function checkOverflow() {
      var swiper = this;
      var params = swiper.params;
      var wasLocked = swiper.isLocked;
      var lastSlidePosition = swiper.slides.length > 0 && params.slidesOffsetBefore + params.spaceBetween * (swiper.slides.length - 1) + swiper.slides[0].offsetWidth * swiper.slides.length;

      if (params.slidesOffsetBefore && params.slidesOffsetAfter && lastSlidePosition) {
        swiper.isLocked = lastSlidePosition <= swiper.size;
      } else {
        swiper.isLocked = swiper.snapGrid.length === 1;
      }

      swiper.allowSlideNext = !swiper.isLocked;
      swiper.allowSlidePrev = !swiper.isLocked; // events

      if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? 'lock' : 'unlock');

      if (wasLocked && wasLocked !== swiper.isLocked) {
        swiper.isEnd = false;
        if (swiper.navigation) swiper.navigation.update();
      }
    }

    var checkOverflow$1 = {
      checkOverflow: checkOverflow
    };

    var defaults = {
      init: true,
      direction: 'horizontal',
      touchEventsTarget: 'container',
      initialSlide: 0,
      speed: 300,
      cssMode: false,
      updateOnWindowResize: true,
      resizeObserver: false,
      nested: false,
      // Overrides
      width: null,
      height: null,
      //
      preventInteractionOnTransition: false,
      // ssr
      userAgent: null,
      url: null,
      // To support iOS's swipe-to-go-back gesture (when being used in-app).
      edgeSwipeDetection: false,
      edgeSwipeThreshold: 20,
      // Free mode
      freeMode: false,
      freeModeMomentum: true,
      freeModeMomentumRatio: 1,
      freeModeMomentumBounce: true,
      freeModeMomentumBounceRatio: 1,
      freeModeMomentumVelocityRatio: 1,
      freeModeSticky: false,
      freeModeMinimumVelocity: 0.02,
      // Autoheight
      autoHeight: false,
      // Set wrapper width
      setWrapperSize: false,
      // Virtual Translate
      virtualTranslate: false,
      // Effects
      effect: 'slide',
      // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
      // Breakpoints
      breakpoints: undefined,
      breakpointsBase: 'window',
      // Slides grid
      spaceBetween: 0,
      slidesPerView: 1,
      slidesPerColumn: 1,
      slidesPerColumnFill: 'column',
      slidesPerGroup: 1,
      slidesPerGroupSkip: 0,
      centeredSlides: false,
      centeredSlidesBounds: false,
      slidesOffsetBefore: 0,
      // in px
      slidesOffsetAfter: 0,
      // in px
      normalizeSlideIndex: true,
      centerInsufficientSlides: false,
      // Disable swiper and hide navigation when container not overflow
      watchOverflow: false,
      // Round length
      roundLengths: false,
      // Touches
      touchRatio: 1,
      touchAngle: 45,
      simulateTouch: true,
      shortSwipes: true,
      longSwipes: true,
      longSwipesRatio: 0.5,
      longSwipesMs: 300,
      followFinger: true,
      allowTouchMove: true,
      threshold: 0,
      touchMoveStopPropagation: false,
      touchStartPreventDefault: true,
      touchStartForcePreventDefault: false,
      touchReleaseOnEdges: false,
      // Unique Navigation Elements
      uniqueNavElements: true,
      // Resistance
      resistance: true,
      resistanceRatio: 0.85,
      // Progress
      watchSlidesProgress: false,
      watchSlidesVisibility: false,
      // Cursor
      grabCursor: false,
      // Clicks
      preventClicks: true,
      preventClicksPropagation: true,
      slideToClickedSlide: false,
      // Images
      preloadImages: true,
      updateOnImagesReady: true,
      // loop
      loop: false,
      loopAdditionalSlides: 0,
      loopedSlides: null,
      loopFillGroupWithBlank: false,
      loopPreventsSlide: true,
      // Swiping/no swiping
      allowSlidePrev: true,
      allowSlideNext: true,
      swipeHandler: null,
      // '.swipe-handler',
      noSwiping: true,
      noSwipingClass: 'swiper-no-swiping',
      noSwipingSelector: null,
      // Passive Listeners
      passiveListeners: true,
      // NS
      containerModifierClass: 'swiper-container-',
      // NEW
      slideClass: 'swiper-slide',
      slideBlankClass: 'swiper-slide-invisible-blank',
      slideActiveClass: 'swiper-slide-active',
      slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
      slideVisibleClass: 'swiper-slide-visible',
      slideDuplicateClass: 'swiper-slide-duplicate',
      slideNextClass: 'swiper-slide-next',
      slideDuplicateNextClass: 'swiper-slide-duplicate-next',
      slidePrevClass: 'swiper-slide-prev',
      slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
      wrapperClass: 'swiper-wrapper',
      // Callbacks
      runCallbacksOnInit: true,
      // Internals
      _emitClasses: false
    };

    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
    var prototypes = {
      modular: modular,
      eventsEmitter: eventsEmitter,
      update: update$1,
      translate: translate,
      transition: transition$1,
      slide: slide,
      loop: loop,
      grabCursor: grabCursor,
      manipulation: manipulation,
      events: events,
      breakpoints: breakpoints,
      checkOverflow: checkOverflow$1,
      classes: classes,
      images: images
    };
    var extendedDefaults = {};

    var Swiper = /*#__PURE__*/function () {
      function Swiper() {
        var el;
        var params;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
          params = args[0];
        } else {
          el = args[0];
          params = args[1];
        }

        if (!params) params = {};
        params = extend$1({}, params);
        if (el && !params.el) params.el = el;

        if (params.el && $(params.el).length > 1) {
          var swipers = [];
          $(params.el).each(function (containerEl) {
            var newParams = extend$1({}, params, {
              el: containerEl
            });
            swipers.push(new Swiper(newParams));
          });
          return swipers;
        } // Swiper Instance


        var swiper = this;
        swiper.__swiper__ = true;
        swiper.support = getSupport();
        swiper.device = getDevice({
          userAgent: params.userAgent
        });
        swiper.browser = getBrowser();
        swiper.eventsListeners = {};
        swiper.eventsAnyListeners = [];

        if (typeof swiper.modules === 'undefined') {
          swiper.modules = {};
        }

        Object.keys(swiper.modules).forEach(function (moduleName) {
          var module = swiper.modules[moduleName];

          if (module.params) {
            var moduleParamName = Object.keys(module.params)[0];
            var moduleParams = module.params[moduleParamName];
            if (typeof moduleParams !== 'object' || moduleParams === null) return;
            if (!(moduleParamName in params && 'enabled' in moduleParams)) return;

            if (params[moduleParamName] === true) {
              params[moduleParamName] = {
                enabled: true
              };
            }

            if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
              params[moduleParamName].enabled = true;
            }

            if (!params[moduleParamName]) params[moduleParamName] = {
              enabled: false
            };
          }
        }); // Extend defaults with modules params

        var swiperParams = extend$1({}, defaults);
        swiper.useParams(swiperParams); // Extend defaults with passed params

        swiper.params = extend$1({}, swiperParams, extendedDefaults, params);
        swiper.originalParams = extend$1({}, swiper.params);
        swiper.passedParams = extend$1({}, params); // add event listeners

        if (swiper.params && swiper.params.on) {
          Object.keys(swiper.params.on).forEach(function (eventName) {
            swiper.on(eventName, swiper.params.on[eventName]);
          });
        }

        if (swiper.params && swiper.params.onAny) {
          swiper.onAny(swiper.params.onAny);
        } // Save Dom lib


        swiper.$ = $; // Extend Swiper

        extend$1(swiper, {
          el: el,
          // Classes
          classNames: [],
          // Slides
          slides: $(),
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],
          // isDirection
          isHorizontal: function isHorizontal() {
            return swiper.params.direction === 'horizontal';
          },
          isVertical: function isVertical() {
            return swiper.params.direction === 'vertical';
          },
          // Indexes
          activeIndex: 0,
          realIndex: 0,
          //
          isBeginning: true,
          isEnd: false,
          // Props
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: false,
          // Locks
          allowSlideNext: swiper.params.allowSlideNext,
          allowSlidePrev: swiper.params.allowSlidePrev,
          // Touch Events
          touchEvents: function touchEvents() {
            var touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
            var desktop = ['mousedown', 'mousemove', 'mouseup'];

            if (swiper.support.pointerEvents) {
              desktop = ['pointerdown', 'pointermove', 'pointerup'];
            }

            swiper.touchEventsTouch = {
              start: touch[0],
              move: touch[1],
              end: touch[2],
              cancel: touch[3]
            };
            swiper.touchEventsDesktop = {
              start: desktop[0],
              move: desktop[1],
              end: desktop[2]
            };
            return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
          }(),
          touchEventsData: {
            isTouched: undefined,
            isMoved: undefined,
            allowTouchCallbacks: undefined,
            touchStartTime: undefined,
            isScrolling: undefined,
            currentTranslate: undefined,
            startTranslate: undefined,
            allowThresholdMove: undefined,
            // Form elements to match
            formElements: 'input, select, option, textarea, button, video, label',
            // Last click time
            lastClickTime: now(),
            clickTimeout: undefined,
            // Velocities
            velocities: [],
            allowMomentumBounce: undefined,
            isTouchEvent: undefined,
            startMoving: undefined
          },
          // Clicks
          allowClick: true,
          // Touches
          allowTouchMove: swiper.params.allowTouchMove,
          touches: {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            diff: 0
          },
          // Images
          imagesToLoad: [],
          imagesLoaded: 0
        }); // Install Modules

        swiper.useModules();
        swiper.emit('_swiper'); // Init

        if (swiper.params.init) {
          swiper.init();
        } // Return app instance


        return swiper;
      }

      var _proto = Swiper.prototype;

      _proto.emitContainerClasses = function emitContainerClasses() {
        var swiper = this;
        if (!swiper.params._emitClasses || !swiper.el) return;
        var classes = swiper.el.className.split(' ').filter(function (className) {
          return className.indexOf('swiper-container') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
        });
        swiper.emit('_containerClasses', classes.join(' '));
      };

      _proto.getSlideClasses = function getSlideClasses(slideEl) {
        var swiper = this;
        return slideEl.className.split(' ').filter(function (className) {
          return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
        }).join(' ');
      };

      _proto.emitSlidesClasses = function emitSlidesClasses() {
        var swiper = this;
        if (!swiper.params._emitClasses || !swiper.el) return;
        var updates = [];
        swiper.slides.each(function (slideEl) {
          var classNames = swiper.getSlideClasses(slideEl);
          updates.push({
            slideEl: slideEl,
            classNames: classNames
          });
          swiper.emit('_slideClass', slideEl, classNames);
        });
        swiper.emit('_slideClasses', updates);
      };

      _proto.slidesPerViewDynamic = function slidesPerViewDynamic() {
        var swiper = this;
        var params = swiper.params,
            slides = swiper.slides,
            slidesGrid = swiper.slidesGrid,
            swiperSize = swiper.size,
            activeIndex = swiper.activeIndex;
        var spv = 1;

        if (params.centeredSlides) {
          var slideSize = slides[activeIndex].swiperSlideSize;
          var breakLoop;

          for (var i = activeIndex + 1; i < slides.length; i += 1) {
            if (slides[i] && !breakLoop) {
              slideSize += slides[i].swiperSlideSize;
              spv += 1;
              if (slideSize > swiperSize) breakLoop = true;
            }
          }

          for (var _i = activeIndex - 1; _i >= 0; _i -= 1) {
            if (slides[_i] && !breakLoop) {
              slideSize += slides[_i].swiperSlideSize;
              spv += 1;
              if (slideSize > swiperSize) breakLoop = true;
            }
          }
        } else {
          for (var _i2 = activeIndex + 1; _i2 < slides.length; _i2 += 1) {
            if (slidesGrid[_i2] - slidesGrid[activeIndex] < swiperSize) {
              spv += 1;
            }
          }
        }

        return spv;
      };

      _proto.update = function update() {
        var swiper = this;
        if (!swiper || swiper.destroyed) return;
        var snapGrid = swiper.snapGrid,
            params = swiper.params; // Breakpoints

        if (params.breakpoints) {
          swiper.setBreakpoint();
        }

        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateProgress();
        swiper.updateSlidesClasses();

        function setTranslate() {
          var translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
          var newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
          swiper.setTranslate(newTranslate);
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
        }

        var translated;

        if (swiper.params.freeMode) {
          setTranslate();

          if (swiper.params.autoHeight) {
            swiper.updateAutoHeight();
          }
        } else {
          if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
            translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
          } else {
            translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
          }

          if (!translated) {
            setTranslate();
          }
        }

        if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
          swiper.checkOverflow();
        }

        swiper.emit('update');
      };

      _proto.changeDirection = function changeDirection(newDirection, needUpdate) {
        if (needUpdate === void 0) {
          needUpdate = true;
        }

        var swiper = this;
        var currentDirection = swiper.params.direction;

        if (!newDirection) {
          // eslint-disable-next-line
          newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
        }

        if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
          return swiper;
        }

        swiper.$el.removeClass("" + swiper.params.containerModifierClass + currentDirection).addClass("" + swiper.params.containerModifierClass + newDirection);
        swiper.emitContainerClasses();
        swiper.params.direction = newDirection;
        swiper.slides.each(function (slideEl) {
          if (newDirection === 'vertical') {
            slideEl.style.width = '';
          } else {
            slideEl.style.height = '';
          }
        });
        swiper.emit('changeDirection');
        if (needUpdate) swiper.update();
        return swiper;
      };

      _proto.mount = function mount(el) {
        var swiper = this;
        if (swiper.mounted) return true; // Find el

        var $el = $(el || swiper.params.el);
        el = $el[0];

        if (!el) {
          return false;
        }

        el.swiper = swiper; // Find Wrapper

        var $wrapperEl;

        if (el && el.shadowRoot && el.shadowRoot.querySelector) {
          $wrapperEl = $(el.shadowRoot.querySelector("." + swiper.params.wrapperClass)); // Children needs to return slot items

          $wrapperEl.children = function (options) {
            return $el.children(options);
          };
        } else {
          $wrapperEl = $el.children("." + swiper.params.wrapperClass);
        }

        extend$1(swiper, {
          $el: $el,
          el: el,
          $wrapperEl: $wrapperEl,
          wrapperEl: $wrapperEl[0],
          mounted: true,
          // RTL
          rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
          rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
          wrongRTL: $wrapperEl.css('display') === '-webkit-box'
        });
        return true;
      };

      _proto.init = function init(el) {
        var swiper = this;
        if (swiper.initialized) return swiper;
        var mounted = swiper.mount(el);
        if (mounted === false) return swiper;
        swiper.emit('beforeInit'); // Set breakpoint

        if (swiper.params.breakpoints) {
          swiper.setBreakpoint();
        } // Add Classes


        swiper.addClasses(); // Create loop

        if (swiper.params.loop) {
          swiper.loopCreate();
        } // Update size


        swiper.updateSize(); // Update slides

        swiper.updateSlides();

        if (swiper.params.watchOverflow) {
          swiper.checkOverflow();
        } // Set Grab Cursor


        if (swiper.params.grabCursor) {
          swiper.setGrabCursor();
        }

        if (swiper.params.preloadImages) {
          swiper.preloadImages();
        } // Slide To Initial Slide


        if (swiper.params.loop) {
          swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit);
        } else {
          swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit);
        } // Attach events


        swiper.attachEvents(); // Init Flag

        swiper.initialized = true; // Emit

        swiper.emit('init');
        swiper.emit('afterInit');
        return swiper;
      };

      _proto.destroy = function destroy(deleteInstance, cleanStyles) {
        if (deleteInstance === void 0) {
          deleteInstance = true;
        }

        if (cleanStyles === void 0) {
          cleanStyles = true;
        }

        var swiper = this;
        var params = swiper.params,
            $el = swiper.$el,
            $wrapperEl = swiper.$wrapperEl,
            slides = swiper.slides;

        if (typeof swiper.params === 'undefined' || swiper.destroyed) {
          return null;
        }

        swiper.emit('beforeDestroy'); // Init Flag

        swiper.initialized = false; // Detach events

        swiper.detachEvents(); // Destroy loop

        if (params.loop) {
          swiper.loopDestroy();
        } // Cleanup styles


        if (cleanStyles) {
          swiper.removeClasses();
          $el.removeAttr('style');
          $wrapperEl.removeAttr('style');

          if (slides && slides.length) {
            slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index');
          }
        }

        swiper.emit('destroy'); // Detach emitter events

        Object.keys(swiper.eventsListeners).forEach(function (eventName) {
          swiper.off(eventName);
        });

        if (deleteInstance !== false) {
          swiper.$el[0].swiper = null;
          deleteProps(swiper);
        }

        swiper.destroyed = true;
        return null;
      };

      Swiper.extendDefaults = function extendDefaults(newDefaults) {
        extend$1(extendedDefaults, newDefaults);
      };

      Swiper.installModule = function installModule(module) {
        if (!Swiper.prototype.modules) Swiper.prototype.modules = {};
        var name = module.name || Object.keys(Swiper.prototype.modules).length + "_" + now();
        Swiper.prototype.modules[name] = module;
      };

      Swiper.use = function use(module) {
        if (Array.isArray(module)) {
          module.forEach(function (m) {
            return Swiper.installModule(m);
          });
          return Swiper;
        }

        Swiper.installModule(module);
        return Swiper;
      };

      _createClass(Swiper, null, [{
        key: "extendedDefaults",
        get: function get() {
          return extendedDefaults;
        }
      }, {
        key: "defaults",
        get: function get() {
          return defaults;
        }
      }]);

      return Swiper;
    }();

    Object.keys(prototypes).forEach(function (prototypeGroup) {
      Object.keys(prototypes[prototypeGroup]).forEach(function (protoMethod) {
        Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
      });
    });
    Swiper.use([Resize, Observer$1]);

    function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
    var Virtual = {
      update: function update(force) {
        var swiper = this;
        var _swiper$params = swiper.params,
            slidesPerView = _swiper$params.slidesPerView,
            slidesPerGroup = _swiper$params.slidesPerGroup,
            centeredSlides = _swiper$params.centeredSlides;
        var _swiper$params$virtua = swiper.params.virtual,
            addSlidesBefore = _swiper$params$virtua.addSlidesBefore,
            addSlidesAfter = _swiper$params$virtua.addSlidesAfter;
        var _swiper$virtual = swiper.virtual,
            previousFrom = _swiper$virtual.from,
            previousTo = _swiper$virtual.to,
            slides = _swiper$virtual.slides,
            previousSlidesGrid = _swiper$virtual.slidesGrid,
            renderSlide = _swiper$virtual.renderSlide,
            previousOffset = _swiper$virtual.offset;
        swiper.updateActiveIndex();
        var activeIndex = swiper.activeIndex || 0;
        var offsetProp;
        if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
        var slidesAfter;
        var slidesBefore;

        if (centeredSlides) {
          slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
          slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
        } else {
          slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
          slidesBefore = slidesPerGroup + addSlidesBefore;
        }

        var from = Math.max((activeIndex || 0) - slidesBefore, 0);
        var to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1);
        var offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
        extend$1(swiper.virtual, {
          from: from,
          to: to,
          offset: offset,
          slidesGrid: swiper.slidesGrid
        });

        function onRendered() {
          swiper.updateSlides();
          swiper.updateProgress();
          swiper.updateSlidesClasses();

          if (swiper.lazy && swiper.params.lazy.enabled) {
            swiper.lazy.load();
          }
        }

        if (previousFrom === from && previousTo === to && !force) {
          if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
            swiper.slides.css(offsetProp, offset + "px");
          }

          swiper.updateProgress();
          return;
        }

        if (swiper.params.virtual.renderExternal) {
          swiper.params.virtual.renderExternal.call(swiper, {
            offset: offset,
            from: from,
            to: to,
            slides: function getSlides() {
              var slidesToRender = [];

              for (var i = from; i <= to; i += 1) {
                slidesToRender.push(slides[i]);
              }

              return slidesToRender;
            }()
          });

          if (swiper.params.virtual.renderExternalUpdate) {
            onRendered();
          }

          return;
        }

        var prependIndexes = [];
        var appendIndexes = [];

        if (force) {
          swiper.$wrapperEl.find("." + swiper.params.slideClass).remove();
        } else {
          for (var i = previousFrom; i <= previousTo; i += 1) {
            if (i < from || i > to) {
              swiper.$wrapperEl.find("." + swiper.params.slideClass + "[data-swiper-slide-index=\"" + i + "\"]").remove();
            }
          }
        }

        for (var _i = 0; _i < slides.length; _i += 1) {
          if (_i >= from && _i <= to) {
            if (typeof previousTo === 'undefined' || force) {
              appendIndexes.push(_i);
            } else {
              if (_i > previousTo) appendIndexes.push(_i);
              if (_i < previousFrom) prependIndexes.push(_i);
            }
          }
        }

        appendIndexes.forEach(function (index) {
          swiper.$wrapperEl.append(renderSlide(slides[index], index));
        });
        prependIndexes.sort(function (a, b) {
          return b - a;
        }).forEach(function (index) {
          swiper.$wrapperEl.prepend(renderSlide(slides[index], index));
        });
        swiper.$wrapperEl.children('.swiper-slide').css(offsetProp, offset + "px");
        onRendered();
      },
      renderSlide: function renderSlide(slide, index) {
        var swiper = this;
        var params = swiper.params.virtual;

        if (params.cache && swiper.virtual.cache[index]) {
          return swiper.virtual.cache[index];
        }

        var $slideEl = params.renderSlide ? $(params.renderSlide.call(swiper, slide, index)) : $("<div class=\"" + swiper.params.slideClass + "\" data-swiper-slide-index=\"" + index + "\">" + slide + "</div>");
        if (!$slideEl.attr('data-swiper-slide-index')) $slideEl.attr('data-swiper-slide-index', index);
        if (params.cache) swiper.virtual.cache[index] = $slideEl;
        return $slideEl;
      },
      appendSlide: function appendSlide(slides) {
        var swiper = this;

        if (typeof slides === 'object' && 'length' in slides) {
          for (var i = 0; i < slides.length; i += 1) {
            if (slides[i]) swiper.virtual.slides.push(slides[i]);
          }
        } else {
          swiper.virtual.slides.push(slides);
        }

        swiper.virtual.update(true);
      },
      prependSlide: function prependSlide(slides) {
        var swiper = this;
        var activeIndex = swiper.activeIndex;
        var newActiveIndex = activeIndex + 1;
        var numberOfNewSlides = 1;

        if (Array.isArray(slides)) {
          for (var i = 0; i < slides.length; i += 1) {
            if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
          }

          newActiveIndex = activeIndex + slides.length;
          numberOfNewSlides = slides.length;
        } else {
          swiper.virtual.slides.unshift(slides);
        }

        if (swiper.params.virtual.cache) {
          var cache = swiper.virtual.cache;
          var newCache = {};
          Object.keys(cache).forEach(function (cachedIndex) {
            var $cachedEl = cache[cachedIndex];
            var cachedElIndex = $cachedEl.attr('data-swiper-slide-index');

            if (cachedElIndex) {
              $cachedEl.attr('data-swiper-slide-index', parseInt(cachedElIndex, 10) + 1);
            }

            newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = $cachedEl;
          });
          swiper.virtual.cache = newCache;
        }

        swiper.virtual.update(true);
        swiper.slideTo(newActiveIndex, 0);
      },
      removeSlide: function removeSlide(slidesIndexes) {
        var swiper = this;
        if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
        var activeIndex = swiper.activeIndex;

        if (Array.isArray(slidesIndexes)) {
          for (var i = slidesIndexes.length - 1; i >= 0; i -= 1) {
            swiper.virtual.slides.splice(slidesIndexes[i], 1);

            if (swiper.params.virtual.cache) {
              delete swiper.virtual.cache[slidesIndexes[i]];
            }

            if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
            activeIndex = Math.max(activeIndex, 0);
          }
        } else {
          swiper.virtual.slides.splice(slidesIndexes, 1);

          if (swiper.params.virtual.cache) {
            delete swiper.virtual.cache[slidesIndexes];
          }

          if (slidesIndexes < activeIndex) activeIndex -= 1;
          activeIndex = Math.max(activeIndex, 0);
        }

        swiper.virtual.update(true);
        swiper.slideTo(activeIndex, 0);
      },
      removeAllSlides: function removeAllSlides() {
        var swiper = this;
        swiper.virtual.slides = [];

        if (swiper.params.virtual.cache) {
          swiper.virtual.cache = {};
        }

        swiper.virtual.update(true);
        swiper.slideTo(0, 0);
      }
    };
    var virtual = {
      name: 'virtual',
      params: {
        virtual: {
          enabled: false,
          slides: [],
          cache: true,
          renderSlide: null,
          renderExternal: null,
          renderExternalUpdate: true,
          addSlidesBefore: 0,
          addSlidesAfter: 0
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          virtual: _extends$1({}, Virtual, {
            slides: swiper.params.virtual.slides,
            cache: {}
          })
        });
      },
      on: {
        beforeInit: function beforeInit(swiper) {
          if (!swiper.params.virtual.enabled) return;
          swiper.classNames.push(swiper.params.containerModifierClass + "virtual");
          var overwriteParams = {
            watchSlidesProgress: true
          };
          extend$1(swiper.params, overwriteParams);
          extend$1(swiper.originalParams, overwriteParams);

          if (!swiper.params.initialSlide) {
            swiper.virtual.update();
          }
        },
        setTranslate: function setTranslate(swiper) {
          if (!swiper.params.virtual.enabled) return;
          swiper.virtual.update();
        }
      }
    };

    function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
    var Keyboard = {
      handle: function handle(event) {
        var swiper = this;
        var window = getWindow();
        var document = getDocument();
        var rtl = swiper.rtlTranslate;
        var e = event;
        if (e.originalEvent) e = e.originalEvent; // jquery fix

        var kc = e.keyCode || e.charCode;
        var pageUpDown = swiper.params.keyboard.pageUpDown;
        var isPageUp = pageUpDown && kc === 33;
        var isPageDown = pageUpDown && kc === 34;
        var isArrowLeft = kc === 37;
        var isArrowRight = kc === 39;
        var isArrowUp = kc === 38;
        var isArrowDown = kc === 40; // Directions locks

        if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
          return false;
        }

        if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
          return false;
        }

        if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
          return undefined;
        }

        if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
          return undefined;
        }

        if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
          var inView = false; // Check that swiper should be inside of visible area of window

          if (swiper.$el.parents("." + swiper.params.slideClass).length > 0 && swiper.$el.parents("." + swiper.params.slideActiveClass).length === 0) {
            return undefined;
          }

          var $el = swiper.$el;
          var swiperWidth = $el[0].clientWidth;
          var swiperHeight = $el[0].clientHeight;
          var windowWidth = window.innerWidth;
          var windowHeight = window.innerHeight;
          var swiperOffset = swiper.$el.offset();
          if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
          var swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];

          for (var i = 0; i < swiperCoord.length; i += 1) {
            var point = swiperCoord[i];

            if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
              if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

              inView = true;
            }
          }

          if (!inView) return undefined;
        }

        if (swiper.isHorizontal()) {
          if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
            if (e.preventDefault) e.preventDefault();else e.returnValue = false;
          }

          if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
          if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
        } else {
          if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
            if (e.preventDefault) e.preventDefault();else e.returnValue = false;
          }

          if (isPageDown || isArrowDown) swiper.slideNext();
          if (isPageUp || isArrowUp) swiper.slidePrev();
        }

        swiper.emit('keyPress', kc);
        return undefined;
      },
      enable: function enable() {
        var swiper = this;
        var document = getDocument();
        if (swiper.keyboard.enabled) return;
        $(document).on('keydown', swiper.keyboard.handle);
        swiper.keyboard.enabled = true;
      },
      disable: function disable() {
        var swiper = this;
        var document = getDocument();
        if (!swiper.keyboard.enabled) return;
        $(document).off('keydown', swiper.keyboard.handle);
        swiper.keyboard.enabled = false;
      }
    };
    var keyboard = {
      name: 'keyboard',
      params: {
        keyboard: {
          enabled: false,
          onlyInViewport: true,
          pageUpDown: true
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          keyboard: _extends$2({
            enabled: false
          }, Keyboard)
        });
      },
      on: {
        init: function init(swiper) {
          if (swiper.params.keyboard.enabled) {
            swiper.keyboard.enable();
          }
        },
        destroy: function destroy(swiper) {
          if (swiper.keyboard.enabled) {
            swiper.keyboard.disable();
          }
        }
      }
    };

    function isEventSupported() {
      var document = getDocument();
      var eventName = 'onwheel';
      var isSupported = (eventName in document);

      if (!isSupported) {
        var element = document.createElement('div');
        element.setAttribute(eventName, 'return;');
        isSupported = typeof element[eventName] === 'function';
      }

      if (!isSupported && document.implementation && document.implementation.hasFeature && // always returns true in newer browsers as per the standard.
      // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
      document.implementation.hasFeature('', '') !== true) {
        // This is the only way to test support for the `wheel` event in IE9+.
        isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
      }

      return isSupported;
    }

    var Mousewheel = {
      lastScrollTime: now(),
      lastEventBeforeSnap: undefined,
      recentWheelEvents: [],
      event: function event() {
        var window = getWindow();
        if (window.navigator.userAgent.indexOf('firefox') > -1) return 'DOMMouseScroll';
        return isEventSupported() ? 'wheel' : 'mousewheel';
      },
      normalize: function normalize(e) {
        // Reasonable defaults
        var PIXEL_STEP = 10;
        var LINE_HEIGHT = 40;
        var PAGE_HEIGHT = 800;
        var sX = 0;
        var sY = 0; // spinX, spinY

        var pX = 0;
        var pY = 0; // pixelX, pixelY
        // Legacy

        if ('detail' in e) {
          sY = e.detail;
        }

        if ('wheelDelta' in e) {
          sY = -e.wheelDelta / 120;
        }

        if ('wheelDeltaY' in e) {
          sY = -e.wheelDeltaY / 120;
        }

        if ('wheelDeltaX' in e) {
          sX = -e.wheelDeltaX / 120;
        } // side scrolling on FF with DOMMouseScroll


        if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
          sX = sY;
          sY = 0;
        }

        pX = sX * PIXEL_STEP;
        pY = sY * PIXEL_STEP;

        if ('deltaY' in e) {
          pY = e.deltaY;
        }

        if ('deltaX' in e) {
          pX = e.deltaX;
        }

        if (e.shiftKey && !pX) {
          // if user scrolls with shift he wants horizontal scroll
          pX = pY;
          pY = 0;
        }

        if ((pX || pY) && e.deltaMode) {
          if (e.deltaMode === 1) {
            // delta in LINE units
            pX *= LINE_HEIGHT;
            pY *= LINE_HEIGHT;
          } else {
            // delta in PAGE units
            pX *= PAGE_HEIGHT;
            pY *= PAGE_HEIGHT;
          }
        } // Fall-back if spin cannot be determined


        if (pX && !sX) {
          sX = pX < 1 ? -1 : 1;
        }

        if (pY && !sY) {
          sY = pY < 1 ? -1 : 1;
        }

        return {
          spinX: sX,
          spinY: sY,
          pixelX: pX,
          pixelY: pY
        };
      },
      handleMouseEnter: function handleMouseEnter() {
        var swiper = this;
        swiper.mouseEntered = true;
      },
      handleMouseLeave: function handleMouseLeave() {
        var swiper = this;
        swiper.mouseEntered = false;
      },
      handle: function handle(event) {
        var e = event;
        var disableParentSwiper = true;
        var swiper = this;
        var params = swiper.params.mousewheel;

        if (swiper.params.cssMode) {
          e.preventDefault();
        }

        var target = swiper.$el;

        if (swiper.params.mousewheel.eventsTarget !== 'container') {
          target = $(swiper.params.mousewheel.eventsTarget);
        }

        if (!swiper.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges) return true;
        if (e.originalEvent) e = e.originalEvent; // jquery fix

        var delta = 0;
        var rtlFactor = swiper.rtlTranslate ? -1 : 1;
        var data = Mousewheel.normalize(e);

        if (params.forceToAxis) {
          if (swiper.isHorizontal()) {
            if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
          } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
        } else {
          delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
        }

        if (delta === 0) return true;
        if (params.invert) delta = -delta; // Get the scroll positions

        var positions = swiper.getTranslate() + delta * params.sensitivity;
        if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
        if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate(); // When loop is true:
        //     the disableParentSwiper will be true.
        // When loop is false:
        //     if the scroll positions is not on edge,
        //     then the disableParentSwiper will be true.
        //     if the scroll on edge positions,
        //     then the disableParentSwiper will be false.

        disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
        if (disableParentSwiper && swiper.params.nested) e.stopPropagation();

        if (!swiper.params.freeMode) {
          // Register the new event in a variable which stores the relevant data
          var newEvent = {
            time: now(),
            delta: Math.abs(delta),
            direction: Math.sign(delta),
            raw: event
          }; // Keep the most recent events

          var recentWheelEvents = swiper.mousewheel.recentWheelEvents;

          if (recentWheelEvents.length >= 2) {
            recentWheelEvents.shift(); // only store the last N events
          }

          var prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
          recentWheelEvents.push(newEvent); // If there is at least one previous recorded event:
          //   If direction has changed or
          //   if the scroll is quicker than the previous one:
          //     Animate the slider.
          // Else (this is the first time the wheel is moved):
          //     Animate the slider.

          if (prevEvent) {
            if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
              swiper.mousewheel.animateSlider(newEvent);
            }
          } else {
            swiper.mousewheel.animateSlider(newEvent);
          } // If it's time to release the scroll:
          //   Return now so you don't hit the preventDefault.


          if (swiper.mousewheel.releaseScroll(newEvent)) {
            return true;
          }
        } else {
          // Freemode or scrollContainer:
          // If we recently snapped after a momentum scroll, then ignore wheel events
          // to give time for the deceleration to finish. Stop ignoring after 500 msecs
          // or if it's a new scroll (larger delta or inverse sign as last event before
          // an end-of-momentum snap).
          var _newEvent = {
            time: now(),
            delta: Math.abs(delta),
            direction: Math.sign(delta)
          };
          var lastEventBeforeSnap = swiper.mousewheel.lastEventBeforeSnap;
          var ignoreWheelEvents = lastEventBeforeSnap && _newEvent.time < lastEventBeforeSnap.time + 500 && _newEvent.delta <= lastEventBeforeSnap.delta && _newEvent.direction === lastEventBeforeSnap.direction;

          if (!ignoreWheelEvents) {
            swiper.mousewheel.lastEventBeforeSnap = undefined;

            if (swiper.params.loop) {
              swiper.loopFix();
            }

            var position = swiper.getTranslate() + delta * params.sensitivity;
            var wasBeginning = swiper.isBeginning;
            var wasEnd = swiper.isEnd;
            if (position >= swiper.minTranslate()) position = swiper.minTranslate();
            if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
            swiper.setTransition(0);
            swiper.setTranslate(position);
            swiper.updateProgress();
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();

            if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
              swiper.updateSlidesClasses();
            }

            if (swiper.params.freeModeSticky) {
              // When wheel scrolling starts with sticky (aka snap) enabled, then detect
              // the end of a momentum scroll by storing recent (N=15?) wheel events.
              // 1. do all N events have decreasing or same (absolute value) delta?
              // 2. did all N events arrive in the last M (M=500?) msecs?
              // 3. does the earliest event have an (absolute value) delta that's
              //    at least P (P=1?) larger than the most recent event's delta?
              // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
              // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
              // Snap immediately and ignore remaining wheel events in this scroll.
              // See comment above for "remaining wheel events in this scroll" determination.
              // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
              clearTimeout(swiper.mousewheel.timeout);
              swiper.mousewheel.timeout = undefined;
              var _recentWheelEvents = swiper.mousewheel.recentWheelEvents;

              if (_recentWheelEvents.length >= 15) {
                _recentWheelEvents.shift(); // only store the last N events

              }

              var _prevEvent = _recentWheelEvents.length ? _recentWheelEvents[_recentWheelEvents.length - 1] : undefined;

              var firstEvent = _recentWheelEvents[0];

              _recentWheelEvents.push(_newEvent);

              if (_prevEvent && (_newEvent.delta > _prevEvent.delta || _newEvent.direction !== _prevEvent.direction)) {
                // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
                _recentWheelEvents.splice(0);
              } else if (_recentWheelEvents.length >= 15 && _newEvent.time - firstEvent.time < 500 && firstEvent.delta - _newEvent.delta >= 1 && _newEvent.delta <= 6) {
                // We're at the end of the deceleration of a momentum scroll, so there's no need
                // to wait for more events. Snap ASAP on the next tick.
                // Also, because there's some remaining momentum we'll bias the snap in the
                // direction of the ongoing scroll because it's better UX for the scroll to snap
                // in the same direction as the scroll instead of reversing to snap.  Therefore,
                // if it's already scrolled more than 20% in the current direction, keep going.
                var snapToThreshold = delta > 0 ? 0.8 : 0.2;
                swiper.mousewheel.lastEventBeforeSnap = _newEvent;

                _recentWheelEvents.splice(0);

                swiper.mousewheel.timeout = nextTick(function () {
                  swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
                }, 0); // no delay; move on next tick
              }

              if (!swiper.mousewheel.timeout) {
                // if we get here, then we haven't detected the end of a momentum scroll, so
                // we'll consider a scroll "complete" when there haven't been any wheel events
                // for 500ms.
                swiper.mousewheel.timeout = nextTick(function () {
                  var snapToThreshold = 0.5;
                  swiper.mousewheel.lastEventBeforeSnap = _newEvent;

                  _recentWheelEvents.splice(0);

                  swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
                }, 500);
              }
            } // Emit event


            if (!ignoreWheelEvents) swiper.emit('scroll', e); // Stop autoplay

            if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop(); // Return page scroll on edge positions

            if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
          }
        }

        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
        return false;
      },
      animateSlider: function animateSlider(newEvent) {
        var swiper = this;
        var window = getWindow();

        if (this.params.mousewheel.thresholdDelta && newEvent.delta < this.params.mousewheel.thresholdDelta) {
          // Prevent if delta of wheel scroll delta is below configured threshold
          return false;
        }

        if (this.params.mousewheel.thresholdTime && now() - swiper.mousewheel.lastScrollTime < this.params.mousewheel.thresholdTime) {
          // Prevent if time between scrolls is below configured threshold
          return false;
        } // If the movement is NOT big enough and
        // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
        //   Don't go any further (avoid insignificant scroll movement).


        if (newEvent.delta >= 6 && now() - swiper.mousewheel.lastScrollTime < 60) {
          // Return false as a default
          return true;
        } // If user is scrolling towards the end:
        //   If the slider hasn't hit the latest slide or
        //   if the slider is a loop and
        //   if the slider isn't moving right now:
        //     Go to next slide and
        //     emit a scroll event.
        // Else (the user is scrolling towards the beginning) and
        // if the slider hasn't hit the first slide or
        // if the slider is a loop and
        // if the slider isn't moving right now:
        //   Go to prev slide and
        //   emit a scroll event.


        if (newEvent.direction < 0) {
          if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
            swiper.slideNext();
            swiper.emit('scroll', newEvent.raw);
          }
        } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
          swiper.slidePrev();
          swiper.emit('scroll', newEvent.raw);
        } // If you got here is because an animation has been triggered so store the current time


        swiper.mousewheel.lastScrollTime = new window.Date().getTime(); // Return false as a default

        return false;
      },
      releaseScroll: function releaseScroll(newEvent) {
        var swiper = this;
        var params = swiper.params.mousewheel;

        if (newEvent.direction < 0) {
          if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
            // Return true to animate scroll on edges
            return true;
          }
        } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
          // Return true to animate scroll on edges
          return true;
        }

        return false;
      },
      enable: function enable() {
        var swiper = this;
        var event = Mousewheel.event();

        if (swiper.params.cssMode) {
          swiper.wrapperEl.removeEventListener(event, swiper.mousewheel.handle);
          return true;
        }

        if (!event) return false;
        if (swiper.mousewheel.enabled) return false;
        var target = swiper.$el;

        if (swiper.params.mousewheel.eventsTarget !== 'container') {
          target = $(swiper.params.mousewheel.eventsTarget);
        }

        target.on('mouseenter', swiper.mousewheel.handleMouseEnter);
        target.on('mouseleave', swiper.mousewheel.handleMouseLeave);
        target.on(event, swiper.mousewheel.handle);
        swiper.mousewheel.enabled = true;
        return true;
      },
      disable: function disable() {
        var swiper = this;
        var event = Mousewheel.event();

        if (swiper.params.cssMode) {
          swiper.wrapperEl.addEventListener(event, swiper.mousewheel.handle);
          return true;
        }

        if (!event) return false;
        if (!swiper.mousewheel.enabled) return false;
        var target = swiper.$el;

        if (swiper.params.mousewheel.eventsTarget !== 'container') {
          target = $(swiper.params.mousewheel.eventsTarget);
        }

        target.off(event, swiper.mousewheel.handle);
        swiper.mousewheel.enabled = false;
        return true;
      }
    };
    var mousewheel = {
      name: 'mousewheel',
      params: {
        mousewheel: {
          enabled: false,
          releaseOnEdges: false,
          invert: false,
          forceToAxis: false,
          sensitivity: 1,
          eventsTarget: 'container',
          thresholdDelta: null,
          thresholdTime: null
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          mousewheel: {
            enabled: false,
            lastScrollTime: now(),
            lastEventBeforeSnap: undefined,
            recentWheelEvents: [],
            enable: Mousewheel.enable,
            disable: Mousewheel.disable,
            handle: Mousewheel.handle,
            handleMouseEnter: Mousewheel.handleMouseEnter,
            handleMouseLeave: Mousewheel.handleMouseLeave,
            animateSlider: Mousewheel.animateSlider,
            releaseScroll: Mousewheel.releaseScroll
          }
        });
      },
      on: {
        init: function init(swiper) {
          if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
            swiper.mousewheel.disable();
          }

          if (swiper.params.mousewheel.enabled) swiper.mousewheel.enable();
        },
        destroy: function destroy(swiper) {
          if (swiper.params.cssMode) {
            swiper.mousewheel.enable();
          }

          if (swiper.mousewheel.enabled) swiper.mousewheel.disable();
        }
      }
    };

    function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
    var Navigation = {
      toggleEl: function toggleEl($el, disabled) {
        $el[disabled ? 'addClass' : 'removeClass'](this.params.navigation.disabledClass);
        if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;
      },
      update: function update() {
        // Update Navigation Buttons
        var swiper = this;
        var params = swiper.params.navigation;
        var toggleEl = swiper.navigation.toggleEl;
        if (swiper.params.loop) return;
        var _swiper$navigation = swiper.navigation,
            $nextEl = _swiper$navigation.$nextEl,
            $prevEl = _swiper$navigation.$prevEl;

        if ($prevEl && $prevEl.length > 0) {
          if (swiper.isBeginning) {
            toggleEl($prevEl, true);
          } else {
            toggleEl($prevEl, false);
          }

          $prevEl[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
        }

        if ($nextEl && $nextEl.length > 0) {
          if (swiper.isEnd) {
            toggleEl($nextEl, true);
          } else {
            toggleEl($nextEl, false);
          }

          $nextEl[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
        }
      },
      onPrevClick: function onPrevClick(e) {
        var swiper = this;
        e.preventDefault();
        if (swiper.isBeginning && !swiper.params.loop) return;
        swiper.slidePrev();
      },
      onNextClick: function onNextClick(e) {
        var swiper = this;
        e.preventDefault();
        if (swiper.isEnd && !swiper.params.loop) return;
        swiper.slideNext();
      },
      init: function init() {
        var swiper = this;
        var params = swiper.params.navigation;
        if (!(params.nextEl || params.prevEl)) return;
        var $nextEl;
        var $prevEl;

        if (params.nextEl) {
          $nextEl = $(params.nextEl);

          if (swiper.params.uniqueNavElements && typeof params.nextEl === 'string' && $nextEl.length > 1 && swiper.$el.find(params.nextEl).length === 1) {
            $nextEl = swiper.$el.find(params.nextEl);
          }
        }

        if (params.prevEl) {
          $prevEl = $(params.prevEl);

          if (swiper.params.uniqueNavElements && typeof params.prevEl === 'string' && $prevEl.length > 1 && swiper.$el.find(params.prevEl).length === 1) {
            $prevEl = swiper.$el.find(params.prevEl);
          }
        }

        if ($nextEl && $nextEl.length > 0) {
          $nextEl.on('click', swiper.navigation.onNextClick);
        }

        if ($prevEl && $prevEl.length > 0) {
          $prevEl.on('click', swiper.navigation.onPrevClick);
        }

        extend$1(swiper.navigation, {
          $nextEl: $nextEl,
          nextEl: $nextEl && $nextEl[0],
          $prevEl: $prevEl,
          prevEl: $prevEl && $prevEl[0]
        });
      },
      destroy: function destroy() {
        var swiper = this;
        var _swiper$navigation2 = swiper.navigation,
            $nextEl = _swiper$navigation2.$nextEl,
            $prevEl = _swiper$navigation2.$prevEl;

        if ($nextEl && $nextEl.length) {
          $nextEl.off('click', swiper.navigation.onNextClick);
          $nextEl.removeClass(swiper.params.navigation.disabledClass);
        }

        if ($prevEl && $prevEl.length) {
          $prevEl.off('click', swiper.navigation.onPrevClick);
          $prevEl.removeClass(swiper.params.navigation.disabledClass);
        }
      }
    };
    var navigation = {
      name: 'navigation',
      params: {
        navigation: {
          nextEl: null,
          prevEl: null,
          hideOnClick: false,
          disabledClass: 'swiper-button-disabled',
          hiddenClass: 'swiper-button-hidden',
          lockClass: 'swiper-button-lock'
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          navigation: _extends$3({}, Navigation)
        });
      },
      on: {
        init: function init(swiper) {
          swiper.navigation.init();
          swiper.navigation.update();
        },
        toEdge: function toEdge(swiper) {
          swiper.navigation.update();
        },
        fromEdge: function fromEdge(swiper) {
          swiper.navigation.update();
        },
        destroy: function destroy(swiper) {
          swiper.navigation.destroy();
        },
        click: function click(swiper, e) {
          var _swiper$navigation3 = swiper.navigation,
              $nextEl = _swiper$navigation3.$nextEl,
              $prevEl = _swiper$navigation3.$prevEl;
          var targetEl = e.target;

          if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
            if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
            var isHidden;

            if ($nextEl) {
              isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
            } else if ($prevEl) {
              isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
            }

            if (isHidden === true) {
              swiper.emit('navigationShow');
            } else {
              swiper.emit('navigationHide');
            }

            if ($nextEl) {
              $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
            }

            if ($prevEl) {
              $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
            }
          }
        }
      }
    };

    function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }
    var Pagination = {
      update: function update() {
        // Render || Update Pagination bullets/items
        var swiper = this;
        var rtl = swiper.rtl;
        var params = swiper.params.pagination;
        if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
        var slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
        var $el = swiper.pagination.$el; // Current/Total

        var current;
        var total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

        if (swiper.params.loop) {
          current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);

          if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
            current -= slidesLength - swiper.loopedSlides * 2;
          }

          if (current > total - 1) current -= total;
          if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
        } else if (typeof swiper.snapIndex !== 'undefined') {
          current = swiper.snapIndex;
        } else {
          current = swiper.activeIndex || 0;
        } // Types


        if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
          var bullets = swiper.pagination.bullets;
          var firstIndex;
          var lastIndex;
          var midIndex;

          if (params.dynamicBullets) {
            swiper.pagination.bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
            $el.css(swiper.isHorizontal() ? 'width' : 'height', swiper.pagination.bulletSize * (params.dynamicMainBullets + 4) + "px");

            if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
              swiper.pagination.dynamicBulletIndex += current - swiper.previousIndex;

              if (swiper.pagination.dynamicBulletIndex > params.dynamicMainBullets - 1) {
                swiper.pagination.dynamicBulletIndex = params.dynamicMainBullets - 1;
              } else if (swiper.pagination.dynamicBulletIndex < 0) {
                swiper.pagination.dynamicBulletIndex = 0;
              }
            }

            firstIndex = current - swiper.pagination.dynamicBulletIndex;
            lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
            midIndex = (lastIndex + firstIndex) / 2;
          }

          bullets.removeClass(params.bulletActiveClass + " " + params.bulletActiveClass + "-next " + params.bulletActiveClass + "-next-next " + params.bulletActiveClass + "-prev " + params.bulletActiveClass + "-prev-prev " + params.bulletActiveClass + "-main");

          if ($el.length > 1) {
            bullets.each(function (bullet) {
              var $bullet = $(bullet);
              var bulletIndex = $bullet.index();

              if (bulletIndex === current) {
                $bullet.addClass(params.bulletActiveClass);
              }

              if (params.dynamicBullets) {
                if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
                  $bullet.addClass(params.bulletActiveClass + "-main");
                }

                if (bulletIndex === firstIndex) {
                  $bullet.prev().addClass(params.bulletActiveClass + "-prev").prev().addClass(params.bulletActiveClass + "-prev-prev");
                }

                if (bulletIndex === lastIndex) {
                  $bullet.next().addClass(params.bulletActiveClass + "-next").next().addClass(params.bulletActiveClass + "-next-next");
                }
              }
            });
          } else {
            var $bullet = bullets.eq(current);
            var bulletIndex = $bullet.index();
            $bullet.addClass(params.bulletActiveClass);

            if (params.dynamicBullets) {
              var $firstDisplayedBullet = bullets.eq(firstIndex);
              var $lastDisplayedBullet = bullets.eq(lastIndex);

              for (var i = firstIndex; i <= lastIndex; i += 1) {
                bullets.eq(i).addClass(params.bulletActiveClass + "-main");
              }

              if (swiper.params.loop) {
                if (bulletIndex >= bullets.length - params.dynamicMainBullets) {
                  for (var _i = params.dynamicMainBullets; _i >= 0; _i -= 1) {
                    bullets.eq(bullets.length - _i).addClass(params.bulletActiveClass + "-main");
                  }

                  bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(params.bulletActiveClass + "-prev");
                } else {
                  $firstDisplayedBullet.prev().addClass(params.bulletActiveClass + "-prev").prev().addClass(params.bulletActiveClass + "-prev-prev");
                  $lastDisplayedBullet.next().addClass(params.bulletActiveClass + "-next").next().addClass(params.bulletActiveClass + "-next-next");
                }
              } else {
                $firstDisplayedBullet.prev().addClass(params.bulletActiveClass + "-prev").prev().addClass(params.bulletActiveClass + "-prev-prev");
                $lastDisplayedBullet.next().addClass(params.bulletActiveClass + "-next").next().addClass(params.bulletActiveClass + "-next-next");
              }
            }
          }

          if (params.dynamicBullets) {
            var dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
            var bulletsOffset = (swiper.pagination.bulletSize * dynamicBulletsLength - swiper.pagination.bulletSize) / 2 - midIndex * swiper.pagination.bulletSize;
            var offsetProp = rtl ? 'right' : 'left';
            bullets.css(swiper.isHorizontal() ? offsetProp : 'top', bulletsOffset + "px");
          }
        }

        if (params.type === 'fraction') {
          $el.find("." + params.currentClass).text(params.formatFractionCurrent(current + 1));
          $el.find("." + params.totalClass).text(params.formatFractionTotal(total));
        }

        if (params.type === 'progressbar') {
          var progressbarDirection;

          if (params.progressbarOpposite) {
            progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
          } else {
            progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
          }

          var scale = (current + 1) / total;
          var scaleX = 1;
          var scaleY = 1;

          if (progressbarDirection === 'horizontal') {
            scaleX = scale;
          } else {
            scaleY = scale;
          }

          $el.find("." + params.progressbarFillClass).transform("translate3d(0,0,0) scaleX(" + scaleX + ") scaleY(" + scaleY + ")").transition(swiper.params.speed);
        }

        if (params.type === 'custom' && params.renderCustom) {
          $el.html(params.renderCustom(swiper, current + 1, total));
          swiper.emit('paginationRender', $el[0]);
        } else {
          swiper.emit('paginationUpdate', $el[0]);
        }

        $el[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
      },
      render: function render() {
        // Render Container
        var swiper = this;
        var params = swiper.params.pagination;
        if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
        var slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
        var $el = swiper.pagination.$el;
        var paginationHTML = '';

        if (params.type === 'bullets') {
          var numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

          if (swiper.params.freeMode && !swiper.params.loop && numberOfBullets > slidesLength) {
            numberOfBullets = slidesLength;
          }

          for (var i = 0; i < numberOfBullets; i += 1) {
            if (params.renderBullet) {
              paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
            } else {
              paginationHTML += "<" + params.bulletElement + " class=\"" + params.bulletClass + "\"></" + params.bulletElement + ">";
            }
          }

          $el.html(paginationHTML);
          swiper.pagination.bullets = $el.find("." + params.bulletClass.replace(/ /g, '.'));
        }

        if (params.type === 'fraction') {
          if (params.renderFraction) {
            paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
          } else {
            paginationHTML = "<span class=\"" + params.currentClass + "\"></span>" + ' / ' + ("<span class=\"" + params.totalClass + "\"></span>");
          }

          $el.html(paginationHTML);
        }

        if (params.type === 'progressbar') {
          if (params.renderProgressbar) {
            paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
          } else {
            paginationHTML = "<span class=\"" + params.progressbarFillClass + "\"></span>";
          }

          $el.html(paginationHTML);
        }

        if (params.type !== 'custom') {
          swiper.emit('paginationRender', swiper.pagination.$el[0]);
        }
      },
      init: function init() {
        var swiper = this;
        var params = swiper.params.pagination;
        if (!params.el) return;
        var $el = $(params.el);
        if ($el.length === 0) return;

        if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1) {
          $el = swiper.$el.find(params.el);
        }

        if (params.type === 'bullets' && params.clickable) {
          $el.addClass(params.clickableClass);
        }

        $el.addClass(params.modifierClass + params.type);

        if (params.type === 'bullets' && params.dynamicBullets) {
          $el.addClass("" + params.modifierClass + params.type + "-dynamic");
          swiper.pagination.dynamicBulletIndex = 0;

          if (params.dynamicMainBullets < 1) {
            params.dynamicMainBullets = 1;
          }
        }

        if (params.type === 'progressbar' && params.progressbarOpposite) {
          $el.addClass(params.progressbarOppositeClass);
        }

        if (params.clickable) {
          $el.on('click', "." + params.bulletClass.replace(/ /g, '.'), function onClick(e) {
            e.preventDefault();
            var index = $(this).index() * swiper.params.slidesPerGroup;
            if (swiper.params.loop) index += swiper.loopedSlides;
            swiper.slideTo(index);
          });
        }

        extend$1(swiper.pagination, {
          $el: $el,
          el: $el[0]
        });
      },
      destroy: function destroy() {
        var swiper = this;
        var params = swiper.params.pagination;
        if (!params.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0) return;
        var $el = swiper.pagination.$el;
        $el.removeClass(params.hiddenClass);
        $el.removeClass(params.modifierClass + params.type);
        if (swiper.pagination.bullets) swiper.pagination.bullets.removeClass(params.bulletActiveClass);

        if (params.clickable) {
          $el.off('click', "." + params.bulletClass.replace(/ /g, '.'));
        }
      }
    };
    var pagination = {
      name: 'pagination',
      params: {
        pagination: {
          el: null,
          bulletElement: 'span',
          clickable: false,
          hideOnClick: false,
          renderBullet: null,
          renderProgressbar: null,
          renderFraction: null,
          renderCustom: null,
          progressbarOpposite: false,
          type: 'bullets',
          // 'bullets' or 'progressbar' or 'fraction' or 'custom'
          dynamicBullets: false,
          dynamicMainBullets: 1,
          formatFractionCurrent: function formatFractionCurrent(number) {
            return number;
          },
          formatFractionTotal: function formatFractionTotal(number) {
            return number;
          },
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
          modifierClass: 'swiper-pagination-',
          // NEW
          currentClass: 'swiper-pagination-current',
          totalClass: 'swiper-pagination-total',
          hiddenClass: 'swiper-pagination-hidden',
          progressbarFillClass: 'swiper-pagination-progressbar-fill',
          progressbarOppositeClass: 'swiper-pagination-progressbar-opposite',
          clickableClass: 'swiper-pagination-clickable',
          // NEW
          lockClass: 'swiper-pagination-lock'
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          pagination: _extends$4({
            dynamicBulletIndex: 0
          }, Pagination)
        });
      },
      on: {
        init: function init(swiper) {
          swiper.pagination.init();
          swiper.pagination.render();
          swiper.pagination.update();
        },
        activeIndexChange: function activeIndexChange(swiper) {
          if (swiper.params.loop) {
            swiper.pagination.update();
          } else if (typeof swiper.snapIndex === 'undefined') {
            swiper.pagination.update();
          }
        },
        snapIndexChange: function snapIndexChange(swiper) {
          if (!swiper.params.loop) {
            swiper.pagination.update();
          }
        },
        slidesLengthChange: function slidesLengthChange(swiper) {
          if (swiper.params.loop) {
            swiper.pagination.render();
            swiper.pagination.update();
          }
        },
        snapGridLengthChange: function snapGridLengthChange(swiper) {
          if (!swiper.params.loop) {
            swiper.pagination.render();
            swiper.pagination.update();
          }
        },
        destroy: function destroy(swiper) {
          swiper.pagination.destroy();
        },
        click: function click(swiper, e) {
          var targetEl = e.target;

          if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && swiper.pagination.$el.length > 0 && !$(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
            if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
            var isHidden = swiper.pagination.$el.hasClass(swiper.params.pagination.hiddenClass);

            if (isHidden === true) {
              swiper.emit('paginationShow');
            } else {
              swiper.emit('paginationHide');
            }

            swiper.pagination.$el.toggleClass(swiper.params.pagination.hiddenClass);
          }
        }
      }
    };

    function _extends$5() { _extends$5 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$5.apply(this, arguments); }
    var Scrollbar = {
      setTranslate: function setTranslate() {
        var swiper = this;
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        var scrollbar = swiper.scrollbar,
            rtl = swiper.rtlTranslate,
            progress = swiper.progress;
        var dragSize = scrollbar.dragSize,
            trackSize = scrollbar.trackSize,
            $dragEl = scrollbar.$dragEl,
            $el = scrollbar.$el;
        var params = swiper.params.scrollbar;
        var newSize = dragSize;
        var newPos = (trackSize - dragSize) * progress;

        if (rtl) {
          newPos = -newPos;

          if (newPos > 0) {
            newSize = dragSize - newPos;
            newPos = 0;
          } else if (-newPos + dragSize > trackSize) {
            newSize = trackSize + newPos;
          }
        } else if (newPos < 0) {
          newSize = dragSize + newPos;
          newPos = 0;
        } else if (newPos + dragSize > trackSize) {
          newSize = trackSize - newPos;
        }

        if (swiper.isHorizontal()) {
          $dragEl.transform("translate3d(" + newPos + "px, 0, 0)");
          $dragEl[0].style.width = newSize + "px";
        } else {
          $dragEl.transform("translate3d(0px, " + newPos + "px, 0)");
          $dragEl[0].style.height = newSize + "px";
        }

        if (params.hide) {
          clearTimeout(swiper.scrollbar.timeout);
          $el[0].style.opacity = 1;
          swiper.scrollbar.timeout = setTimeout(function () {
            $el[0].style.opacity = 0;
            $el.transition(400);
          }, 1000);
        }
      },
      setTransition: function setTransition(duration) {
        var swiper = this;
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        swiper.scrollbar.$dragEl.transition(duration);
      },
      updateSize: function updateSize() {
        var swiper = this;
        if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
        var scrollbar = swiper.scrollbar;
        var $dragEl = scrollbar.$dragEl,
            $el = scrollbar.$el;
        $dragEl[0].style.width = '';
        $dragEl[0].style.height = '';
        var trackSize = swiper.isHorizontal() ? $el[0].offsetWidth : $el[0].offsetHeight;
        var divider = swiper.size / swiper.virtualSize;
        var moveDivider = divider * (trackSize / swiper.size);
        var dragSize;

        if (swiper.params.scrollbar.dragSize === 'auto') {
          dragSize = trackSize * divider;
        } else {
          dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
        }

        if (swiper.isHorizontal()) {
          $dragEl[0].style.width = dragSize + "px";
        } else {
          $dragEl[0].style.height = dragSize + "px";
        }

        if (divider >= 1) {
          $el[0].style.display = 'none';
        } else {
          $el[0].style.display = '';
        }

        if (swiper.params.scrollbar.hide) {
          $el[0].style.opacity = 0;
        }

        extend$1(scrollbar, {
          trackSize: trackSize,
          divider: divider,
          moveDivider: moveDivider,
          dragSize: dragSize
        });
        scrollbar.$el[swiper.params.watchOverflow && swiper.isLocked ? 'addClass' : 'removeClass'](swiper.params.scrollbar.lockClass);
      },
      getPointerPosition: function getPointerPosition(e) {
        var swiper = this;

        if (swiper.isHorizontal()) {
          return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientX : e.clientX;
        }

        return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientY : e.clientY;
      },
      setDragPosition: function setDragPosition(e) {
        var swiper = this;
        var scrollbar = swiper.scrollbar,
            rtl = swiper.rtlTranslate;
        var $el = scrollbar.$el,
            dragSize = scrollbar.dragSize,
            trackSize = scrollbar.trackSize,
            dragStartPos = scrollbar.dragStartPos;
        var positionRatio;
        positionRatio = (scrollbar.getPointerPosition(e) - $el.offset()[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
        positionRatio = Math.max(Math.min(positionRatio, 1), 0);

        if (rtl) {
          positionRatio = 1 - positionRatio;
        }

        var position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
        swiper.updateProgress(position);
        swiper.setTranslate(position);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      },
      onDragStart: function onDragStart(e) {
        var swiper = this;
        var params = swiper.params.scrollbar;
        var scrollbar = swiper.scrollbar,
            $wrapperEl = swiper.$wrapperEl;
        var $el = scrollbar.$el,
            $dragEl = scrollbar.$dragEl;
        swiper.scrollbar.isTouched = true;
        swiper.scrollbar.dragStartPos = e.target === $dragEl[0] || e.target === $dragEl ? scrollbar.getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
        e.preventDefault();
        e.stopPropagation();
        $wrapperEl.transition(100);
        $dragEl.transition(100);
        scrollbar.setDragPosition(e);
        clearTimeout(swiper.scrollbar.dragTimeout);
        $el.transition(0);

        if (params.hide) {
          $el.css('opacity', 1);
        }

        if (swiper.params.cssMode) {
          swiper.$wrapperEl.css('scroll-snap-type', 'none');
        }

        swiper.emit('scrollbarDragStart', e);
      },
      onDragMove: function onDragMove(e) {
        var swiper = this;
        var scrollbar = swiper.scrollbar,
            $wrapperEl = swiper.$wrapperEl;
        var $el = scrollbar.$el,
            $dragEl = scrollbar.$dragEl;
        if (!swiper.scrollbar.isTouched) return;
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
        scrollbar.setDragPosition(e);
        $wrapperEl.transition(0);
        $el.transition(0);
        $dragEl.transition(0);
        swiper.emit('scrollbarDragMove', e);
      },
      onDragEnd: function onDragEnd(e) {
        var swiper = this;
        var params = swiper.params.scrollbar;
        var scrollbar = swiper.scrollbar,
            $wrapperEl = swiper.$wrapperEl;
        var $el = scrollbar.$el;
        if (!swiper.scrollbar.isTouched) return;
        swiper.scrollbar.isTouched = false;

        if (swiper.params.cssMode) {
          swiper.$wrapperEl.css('scroll-snap-type', '');
          $wrapperEl.transition('');
        }

        if (params.hide) {
          clearTimeout(swiper.scrollbar.dragTimeout);
          swiper.scrollbar.dragTimeout = nextTick(function () {
            $el.css('opacity', 0);
            $el.transition(400);
          }, 1000);
        }

        swiper.emit('scrollbarDragEnd', e);

        if (params.snapOnRelease) {
          swiper.slideToClosest();
        }
      },
      enableDraggable: function enableDraggable() {
        var swiper = this;
        if (!swiper.params.scrollbar.el) return;
        var document = getDocument();
        var scrollbar = swiper.scrollbar,
            touchEventsTouch = swiper.touchEventsTouch,
            touchEventsDesktop = swiper.touchEventsDesktop,
            params = swiper.params,
            support = swiper.support;
        var $el = scrollbar.$el;
        var target = $el[0];
        var activeListener = support.passiveListener && params.passiveListeners ? {
          passive: false,
          capture: false
        } : false;
        var passiveListener = support.passiveListener && params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        if (!target) return;

        if (!support.touch) {
          target.addEventListener(touchEventsDesktop.start, swiper.scrollbar.onDragStart, activeListener);
          document.addEventListener(touchEventsDesktop.move, swiper.scrollbar.onDragMove, activeListener);
          document.addEventListener(touchEventsDesktop.end, swiper.scrollbar.onDragEnd, passiveListener);
        } else {
          target.addEventListener(touchEventsTouch.start, swiper.scrollbar.onDragStart, activeListener);
          target.addEventListener(touchEventsTouch.move, swiper.scrollbar.onDragMove, activeListener);
          target.addEventListener(touchEventsTouch.end, swiper.scrollbar.onDragEnd, passiveListener);
        }
      },
      disableDraggable: function disableDraggable() {
        var swiper = this;
        if (!swiper.params.scrollbar.el) return;
        var document = getDocument();
        var scrollbar = swiper.scrollbar,
            touchEventsTouch = swiper.touchEventsTouch,
            touchEventsDesktop = swiper.touchEventsDesktop,
            params = swiper.params,
            support = swiper.support;
        var $el = scrollbar.$el;
        var target = $el[0];
        var activeListener = support.passiveListener && params.passiveListeners ? {
          passive: false,
          capture: false
        } : false;
        var passiveListener = support.passiveListener && params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        if (!target) return;

        if (!support.touch) {
          target.removeEventListener(touchEventsDesktop.start, swiper.scrollbar.onDragStart, activeListener);
          document.removeEventListener(touchEventsDesktop.move, swiper.scrollbar.onDragMove, activeListener);
          document.removeEventListener(touchEventsDesktop.end, swiper.scrollbar.onDragEnd, passiveListener);
        } else {
          target.removeEventListener(touchEventsTouch.start, swiper.scrollbar.onDragStart, activeListener);
          target.removeEventListener(touchEventsTouch.move, swiper.scrollbar.onDragMove, activeListener);
          target.removeEventListener(touchEventsTouch.end, swiper.scrollbar.onDragEnd, passiveListener);
        }
      },
      init: function init() {
        var swiper = this;
        if (!swiper.params.scrollbar.el) return;
        var scrollbar = swiper.scrollbar,
            $swiperEl = swiper.$el;
        var params = swiper.params.scrollbar;
        var $el = $(params.el);

        if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && $swiperEl.find(params.el).length === 1) {
          $el = $swiperEl.find(params.el);
        }

        var $dragEl = $el.find("." + swiper.params.scrollbar.dragClass);

        if ($dragEl.length === 0) {
          $dragEl = $("<div class=\"" + swiper.params.scrollbar.dragClass + "\"></div>");
          $el.append($dragEl);
        }

        extend$1(scrollbar, {
          $el: $el,
          el: $el[0],
          $dragEl: $dragEl,
          dragEl: $dragEl[0]
        });

        if (params.draggable) {
          scrollbar.enableDraggable();
        }
      },
      destroy: function destroy() {
        var swiper = this;
        swiper.scrollbar.disableDraggable();
      }
    };
    var scrollbar = {
      name: 'scrollbar',
      params: {
        scrollbar: {
          el: null,
          dragSize: 'auto',
          hide: false,
          draggable: false,
          snapOnRelease: true,
          lockClass: 'swiper-scrollbar-lock',
          dragClass: 'swiper-scrollbar-drag'
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          scrollbar: _extends$5({
            isTouched: false,
            timeout: null,
            dragTimeout: null
          }, Scrollbar)
        });
      },
      on: {
        init: function init(swiper) {
          swiper.scrollbar.init();
          swiper.scrollbar.updateSize();
          swiper.scrollbar.setTranslate();
        },
        update: function update(swiper) {
          swiper.scrollbar.updateSize();
        },
        resize: function resize(swiper) {
          swiper.scrollbar.updateSize();
        },
        observerUpdate: function observerUpdate(swiper) {
          swiper.scrollbar.updateSize();
        },
        setTranslate: function setTranslate(swiper) {
          swiper.scrollbar.setTranslate();
        },
        setTransition: function setTransition(swiper, duration) {
          swiper.scrollbar.setTransition(duration);
        },
        destroy: function destroy(swiper) {
          swiper.scrollbar.destroy();
        }
      }
    };

    function _extends$6() { _extends$6 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$6.apply(this, arguments); }
    var Parallax = {
      setTransform: function setTransform(el, progress) {
        var swiper = this;
        var rtl = swiper.rtl;
        var $el = $(el);
        var rtlFactor = rtl ? -1 : 1;
        var p = $el.attr('data-swiper-parallax') || '0';
        var x = $el.attr('data-swiper-parallax-x');
        var y = $el.attr('data-swiper-parallax-y');
        var scale = $el.attr('data-swiper-parallax-scale');
        var opacity = $el.attr('data-swiper-parallax-opacity');

        if (x || y) {
          x = x || '0';
          y = y || '0';
        } else if (swiper.isHorizontal()) {
          x = p;
          y = '0';
        } else {
          y = p;
          x = '0';
        }

        if (x.indexOf('%') >= 0) {
          x = parseInt(x, 10) * progress * rtlFactor + "%";
        } else {
          x = x * progress * rtlFactor + "px";
        }

        if (y.indexOf('%') >= 0) {
          y = parseInt(y, 10) * progress + "%";
        } else {
          y = y * progress + "px";
        }

        if (typeof opacity !== 'undefined' && opacity !== null) {
          var currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
          $el[0].style.opacity = currentOpacity;
        }

        if (typeof scale === 'undefined' || scale === null) {
          $el.transform("translate3d(" + x + ", " + y + ", 0px)");
        } else {
          var currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
          $el.transform("translate3d(" + x + ", " + y + ", 0px) scale(" + currentScale + ")");
        }
      },
      setTranslate: function setTranslate() {
        var swiper = this;
        var $el = swiper.$el,
            slides = swiper.slides,
            progress = swiper.progress,
            snapGrid = swiper.snapGrid;
        $el.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(function (el) {
          swiper.parallax.setTransform(el, progress);
        });
        slides.each(function (slideEl, slideIndex) {
          var slideProgress = slideEl.progress;

          if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
            slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
          }

          slideProgress = Math.min(Math.max(slideProgress, -1), 1);
          $(slideEl).find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(function (el) {
            swiper.parallax.setTransform(el, slideProgress);
          });
        });
      },
      setTransition: function setTransition(duration) {
        if (duration === void 0) {
          duration = this.params.speed;
        }

        var swiper = this;
        var $el = swiper.$el;
        $el.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(function (parallaxEl) {
          var $parallaxEl = $(parallaxEl);
          var parallaxDuration = parseInt($parallaxEl.attr('data-swiper-parallax-duration'), 10) || duration;
          if (duration === 0) parallaxDuration = 0;
          $parallaxEl.transition(parallaxDuration);
        });
      }
    };
    var parallax = {
      name: 'parallax',
      params: {
        parallax: {
          enabled: false
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          parallax: _extends$6({}, Parallax)
        });
      },
      on: {
        beforeInit: function beforeInit(swiper) {
          if (!swiper.params.parallax.enabled) return;
          swiper.params.watchSlidesProgress = true;
          swiper.originalParams.watchSlidesProgress = true;
        },
        init: function init(swiper) {
          if (!swiper.params.parallax.enabled) return;
          swiper.parallax.setTranslate();
        },
        setTranslate: function setTranslate(swiper) {
          if (!swiper.params.parallax.enabled) return;
          swiper.parallax.setTranslate();
        },
        setTransition: function setTransition(swiper, duration) {
          if (!swiper.params.parallax.enabled) return;
          swiper.parallax.setTransition(duration);
        }
      }
    };

    function _extends$7() { _extends$7 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$7.apply(this, arguments); }
    var Zoom = {
      // Calc Scale From Multi-touches
      getDistanceBetweenTouches: function getDistanceBetweenTouches(e) {
        if (e.targetTouches.length < 2) return 1;
        var x1 = e.targetTouches[0].pageX;
        var y1 = e.targetTouches[0].pageY;
        var x2 = e.targetTouches[1].pageX;
        var y2 = e.targetTouches[1].pageY;
        var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return distance;
      },
      // Events
      onGestureStart: function onGestureStart(e) {
        var swiper = this;
        var support = swiper.support;
        var params = swiper.params.zoom;
        var zoom = swiper.zoom;
        var gesture = zoom.gesture;
        zoom.fakeGestureTouched = false;
        zoom.fakeGestureMoved = false;

        if (!support.gestures) {
          if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
            return;
          }

          zoom.fakeGestureTouched = true;
          gesture.scaleStart = Zoom.getDistanceBetweenTouches(e);
        }

        if (!gesture.$slideEl || !gesture.$slideEl.length) {
          gesture.$slideEl = $(e.target).closest("." + swiper.params.slideClass);
          if (gesture.$slideEl.length === 0) gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
          gesture.$imageEl = gesture.$slideEl.find('img, svg, canvas, picture, .swiper-zoom-target');
          gesture.$imageWrapEl = gesture.$imageEl.parent("." + params.containerClass);
          gesture.maxRatio = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

          if (gesture.$imageWrapEl.length === 0) {
            gesture.$imageEl = undefined;
            return;
          }
        }

        if (gesture.$imageEl) {
          gesture.$imageEl.transition(0);
        }

        swiper.zoom.isScaling = true;
      },
      onGestureChange: function onGestureChange(e) {
        var swiper = this;
        var support = swiper.support;
        var params = swiper.params.zoom;
        var zoom = swiper.zoom;
        var gesture = zoom.gesture;

        if (!support.gestures) {
          if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
            return;
          }

          zoom.fakeGestureMoved = true;
          gesture.scaleMove = Zoom.getDistanceBetweenTouches(e);
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
          if (e.type === 'gesturechange') zoom.onGestureStart(e);
          return;
        }

        if (support.gestures) {
          zoom.scale = e.scale * zoom.currentScale;
        } else {
          zoom.scale = gesture.scaleMove / gesture.scaleStart * zoom.currentScale;
        }

        if (zoom.scale > gesture.maxRatio) {
          zoom.scale = gesture.maxRatio - 1 + Math.pow(zoom.scale - gesture.maxRatio + 1, 0.5);
        }

        if (zoom.scale < params.minRatio) {
          zoom.scale = params.minRatio + 1 - Math.pow(params.minRatio - zoom.scale + 1, 0.5);
        }

        gesture.$imageEl.transform("translate3d(0,0,0) scale(" + zoom.scale + ")");
      },
      onGestureEnd: function onGestureEnd(e) {
        var swiper = this;
        var device = swiper.device;
        var support = swiper.support;
        var params = swiper.params.zoom;
        var zoom = swiper.zoom;
        var gesture = zoom.gesture;

        if (!support.gestures) {
          if (!zoom.fakeGestureTouched || !zoom.fakeGestureMoved) {
            return;
          }

          if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2 && !device.android) {
            return;
          }

          zoom.fakeGestureTouched = false;
          zoom.fakeGestureMoved = false;
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
        gesture.$imageEl.transition(swiper.params.speed).transform("translate3d(0,0,0) scale(" + zoom.scale + ")");
        zoom.currentScale = zoom.scale;
        zoom.isScaling = false;
        if (zoom.scale === 1) gesture.$slideEl = undefined;
      },
      onTouchStart: function onTouchStart(e) {
        var swiper = this;
        var device = swiper.device;
        var zoom = swiper.zoom;
        var gesture = zoom.gesture,
            image = zoom.image;
        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        if (image.isTouched) return;
        if (device.android && e.cancelable) e.preventDefault();
        image.isTouched = true;
        image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
      },
      onTouchMove: function onTouchMove(e) {
        var swiper = this;
        var zoom = swiper.zoom;
        var gesture = zoom.gesture,
            image = zoom.image,
            velocity = zoom.velocity;
        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        swiper.allowClick = false;
        if (!image.isTouched || !gesture.$slideEl) return;

        if (!image.isMoved) {
          image.width = gesture.$imageEl[0].offsetWidth;
          image.height = gesture.$imageEl[0].offsetHeight;
          image.startX = getTranslate(gesture.$imageWrapEl[0], 'x') || 0;
          image.startY = getTranslate(gesture.$imageWrapEl[0], 'y') || 0;
          gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
          gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
          gesture.$imageWrapEl.transition(0);

          if (swiper.rtl) {
            image.startX = -image.startX;
            image.startY = -image.startY;
          }
        } // Define if we need image drag


        var scaledWidth = image.width * zoom.scale;
        var scaledHeight = image.height * zoom.scale;
        if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight) return;
        image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
        image.maxX = -image.minX;
        image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
        image.maxY = -image.minY;
        image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

        if (!image.isMoved && !zoom.isScaling) {
          if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
            image.isTouched = false;
            return;
          }

          if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
            image.isTouched = false;
            return;
          }
        }

        if (e.cancelable) {
          e.preventDefault();
        }

        e.stopPropagation();
        image.isMoved = true;
        image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
        image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;

        if (image.currentX < image.minX) {
          image.currentX = image.minX + 1 - Math.pow(image.minX - image.currentX + 1, 0.8);
        }

        if (image.currentX > image.maxX) {
          image.currentX = image.maxX - 1 + Math.pow(image.currentX - image.maxX + 1, 0.8);
        }

        if (image.currentY < image.minY) {
          image.currentY = image.minY + 1 - Math.pow(image.minY - image.currentY + 1, 0.8);
        }

        if (image.currentY > image.maxY) {
          image.currentY = image.maxY - 1 + Math.pow(image.currentY - image.maxY + 1, 0.8);
        } // Velocity


        if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
        if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
        if (!velocity.prevTime) velocity.prevTime = Date.now();
        velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
        velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
        if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
        if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
        velocity.prevPositionX = image.touchesCurrent.x;
        velocity.prevPositionY = image.touchesCurrent.y;
        velocity.prevTime = Date.now();
        gesture.$imageWrapEl.transform("translate3d(" + image.currentX + "px, " + image.currentY + "px,0)");
      },
      onTouchEnd: function onTouchEnd() {
        var swiper = this;
        var zoom = swiper.zoom;
        var gesture = zoom.gesture,
            image = zoom.image,
            velocity = zoom.velocity;
        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

        if (!image.isTouched || !image.isMoved) {
          image.isTouched = false;
          image.isMoved = false;
          return;
        }

        image.isTouched = false;
        image.isMoved = false;
        var momentumDurationX = 300;
        var momentumDurationY = 300;
        var momentumDistanceX = velocity.x * momentumDurationX;
        var newPositionX = image.currentX + momentumDistanceX;
        var momentumDistanceY = velocity.y * momentumDurationY;
        var newPositionY = image.currentY + momentumDistanceY; // Fix duration

        if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
        if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
        var momentumDuration = Math.max(momentumDurationX, momentumDurationY);
        image.currentX = newPositionX;
        image.currentY = newPositionY; // Define if we need image drag

        var scaledWidth = image.width * zoom.scale;
        var scaledHeight = image.height * zoom.scale;
        image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
        image.maxX = -image.minX;
        image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
        image.maxY = -image.minY;
        image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
        image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
        gesture.$imageWrapEl.transition(momentumDuration).transform("translate3d(" + image.currentX + "px, " + image.currentY + "px,0)");
      },
      onTransitionEnd: function onTransitionEnd() {
        var swiper = this;
        var zoom = swiper.zoom;
        var gesture = zoom.gesture;

        if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
          if (gesture.$imageEl) {
            gesture.$imageEl.transform('translate3d(0,0,0) scale(1)');
          }

          if (gesture.$imageWrapEl) {
            gesture.$imageWrapEl.transform('translate3d(0,0,0)');
          }

          zoom.scale = 1;
          zoom.currentScale = 1;
          gesture.$slideEl = undefined;
          gesture.$imageEl = undefined;
          gesture.$imageWrapEl = undefined;
        }
      },
      // Toggle Zoom
      toggle: function toggle(e) {
        var swiper = this;
        var zoom = swiper.zoom;

        if (zoom.scale && zoom.scale !== 1) {
          // Zoom Out
          zoom.out();
        } else {
          // Zoom In
          zoom.in(e);
        }
      },
      in: function _in(e) {
        var swiper = this;
        var window = getWindow();
        var zoom = swiper.zoom;
        var params = swiper.params.zoom;
        var gesture = zoom.gesture,
            image = zoom.image;

        if (!gesture.$slideEl) {
          if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
            gesture.$slideEl = swiper.$wrapperEl.children("." + swiper.params.slideActiveClass);
          } else {
            gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
          }

          gesture.$imageEl = gesture.$slideEl.find('img, svg, canvas, picture, .swiper-zoom-target');
          gesture.$imageWrapEl = gesture.$imageEl.parent("." + params.containerClass);
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        gesture.$slideEl.addClass("" + params.zoomedSlideClass);
        var touchX;
        var touchY;
        var offsetX;
        var offsetY;
        var diffX;
        var diffY;
        var translateX;
        var translateY;
        var imageWidth;
        var imageHeight;
        var scaledWidth;
        var scaledHeight;
        var translateMinX;
        var translateMinY;
        var translateMaxX;
        var translateMaxY;
        var slideWidth;
        var slideHeight;

        if (typeof image.touchesStart.x === 'undefined' && e) {
          touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
          touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
        } else {
          touchX = image.touchesStart.x;
          touchY = image.touchesStart.y;
        }

        zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
        zoom.currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

        if (e) {
          slideWidth = gesture.$slideEl[0].offsetWidth;
          slideHeight = gesture.$slideEl[0].offsetHeight;
          offsetX = gesture.$slideEl.offset().left + window.scrollX;
          offsetY = gesture.$slideEl.offset().top + window.scrollY;
          diffX = offsetX + slideWidth / 2 - touchX;
          diffY = offsetY + slideHeight / 2 - touchY;
          imageWidth = gesture.$imageEl[0].offsetWidth;
          imageHeight = gesture.$imageEl[0].offsetHeight;
          scaledWidth = imageWidth * zoom.scale;
          scaledHeight = imageHeight * zoom.scale;
          translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
          translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
          translateMaxX = -translateMinX;
          translateMaxY = -translateMinY;
          translateX = diffX * zoom.scale;
          translateY = diffY * zoom.scale;

          if (translateX < translateMinX) {
            translateX = translateMinX;
          }

          if (translateX > translateMaxX) {
            translateX = translateMaxX;
          }

          if (translateY < translateMinY) {
            translateY = translateMinY;
          }

          if (translateY > translateMaxY) {
            translateY = translateMaxY;
          }
        } else {
          translateX = 0;
          translateY = 0;
        }

        gesture.$imageWrapEl.transition(300).transform("translate3d(" + translateX + "px, " + translateY + "px,0)");
        gesture.$imageEl.transition(300).transform("translate3d(0,0,0) scale(" + zoom.scale + ")");
      },
      out: function out() {
        var swiper = this;
        var zoom = swiper.zoom;
        var params = swiper.params.zoom;
        var gesture = zoom.gesture;

        if (!gesture.$slideEl) {
          if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
            gesture.$slideEl = swiper.$wrapperEl.children("." + swiper.params.slideActiveClass);
          } else {
            gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
          }

          gesture.$imageEl = gesture.$slideEl.find('img, svg, canvas, picture, .swiper-zoom-target');
          gesture.$imageWrapEl = gesture.$imageEl.parent("." + params.containerClass);
        }

        if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
        zoom.scale = 1;
        zoom.currentScale = 1;
        gesture.$imageWrapEl.transition(300).transform('translate3d(0,0,0)');
        gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)');
        gesture.$slideEl.removeClass("" + params.zoomedSlideClass);
        gesture.$slideEl = undefined;
      },
      toggleGestures: function toggleGestures(method) {
        var swiper = this;
        var zoom = swiper.zoom;
        var selector = zoom.slideSelector,
            passive = zoom.passiveListener;
        swiper.$wrapperEl[method]('gesturestart', selector, zoom.onGestureStart, passive);
        swiper.$wrapperEl[method]('gesturechange', selector, zoom.onGestureChange, passive);
        swiper.$wrapperEl[method]('gestureend', selector, zoom.onGestureEnd, passive);
      },
      enableGestures: function enableGestures() {
        if (this.zoom.gesturesEnabled) return;
        this.zoom.gesturesEnabled = true;
        this.zoom.toggleGestures('on');
      },
      disableGestures: function disableGestures() {
        if (!this.zoom.gesturesEnabled) return;
        this.zoom.gesturesEnabled = false;
        this.zoom.toggleGestures('off');
      },
      // Attach/Detach Events
      enable: function enable() {
        var swiper = this;
        var support = swiper.support;
        var zoom = swiper.zoom;
        if (zoom.enabled) return;
        zoom.enabled = true;
        var passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        var activeListenerWithCapture = support.passiveListener ? {
          passive: false,
          capture: true
        } : true;
        var slideSelector = "." + swiper.params.slideClass;
        swiper.zoom.passiveListener = passiveListener;
        swiper.zoom.slideSelector = slideSelector; // Scale image

        if (support.gestures) {
          swiper.$wrapperEl.on(swiper.touchEvents.start, swiper.zoom.enableGestures, passiveListener);
          swiper.$wrapperEl.on(swiper.touchEvents.end, swiper.zoom.disableGestures, passiveListener);
        } else if (swiper.touchEvents.start === 'touchstart') {
          swiper.$wrapperEl.on(swiper.touchEvents.start, slideSelector, zoom.onGestureStart, passiveListener);
          swiper.$wrapperEl.on(swiper.touchEvents.move, slideSelector, zoom.onGestureChange, activeListenerWithCapture);
          swiper.$wrapperEl.on(swiper.touchEvents.end, slideSelector, zoom.onGestureEnd, passiveListener);

          if (swiper.touchEvents.cancel) {
            swiper.$wrapperEl.on(swiper.touchEvents.cancel, slideSelector, zoom.onGestureEnd, passiveListener);
          }
        } // Move image


        swiper.$wrapperEl.on(swiper.touchEvents.move, "." + swiper.params.zoom.containerClass, zoom.onTouchMove, activeListenerWithCapture);
      },
      disable: function disable() {
        var swiper = this;
        var zoom = swiper.zoom;
        if (!zoom.enabled) return;
        var support = swiper.support;
        swiper.zoom.enabled = false;
        var passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
          passive: true,
          capture: false
        } : false;
        var activeListenerWithCapture = support.passiveListener ? {
          passive: false,
          capture: true
        } : true;
        var slideSelector = "." + swiper.params.slideClass; // Scale image

        if (support.gestures) {
          swiper.$wrapperEl.off(swiper.touchEvents.start, swiper.zoom.enableGestures, passiveListener);
          swiper.$wrapperEl.off(swiper.touchEvents.end, swiper.zoom.disableGestures, passiveListener);
        } else if (swiper.touchEvents.start === 'touchstart') {
          swiper.$wrapperEl.off(swiper.touchEvents.start, slideSelector, zoom.onGestureStart, passiveListener);
          swiper.$wrapperEl.off(swiper.touchEvents.move, slideSelector, zoom.onGestureChange, activeListenerWithCapture);
          swiper.$wrapperEl.off(swiper.touchEvents.end, slideSelector, zoom.onGestureEnd, passiveListener);

          if (swiper.touchEvents.cancel) {
            swiper.$wrapperEl.off(swiper.touchEvents.cancel, slideSelector, zoom.onGestureEnd, passiveListener);
          }
        } // Move image


        swiper.$wrapperEl.off(swiper.touchEvents.move, "." + swiper.params.zoom.containerClass, zoom.onTouchMove, activeListenerWithCapture);
      }
    };
    var zoom = {
      name: 'zoom',
      params: {
        zoom: {
          enabled: false,
          maxRatio: 3,
          minRatio: 1,
          toggle: true,
          containerClass: 'swiper-zoom-container',
          zoomedSlideClass: 'swiper-slide-zoomed'
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          zoom: _extends$7({
            enabled: false,
            scale: 1,
            currentScale: 1,
            isScaling: false,
            gesture: {
              $slideEl: undefined,
              slideWidth: undefined,
              slideHeight: undefined,
              $imageEl: undefined,
              $imageWrapEl: undefined,
              maxRatio: 3
            },
            image: {
              isTouched: undefined,
              isMoved: undefined,
              currentX: undefined,
              currentY: undefined,
              minX: undefined,
              minY: undefined,
              maxX: undefined,
              maxY: undefined,
              width: undefined,
              height: undefined,
              startX: undefined,
              startY: undefined,
              touchesStart: {},
              touchesCurrent: {}
            },
            velocity: {
              x: undefined,
              y: undefined,
              prevPositionX: undefined,
              prevPositionY: undefined,
              prevTime: undefined
            }
          }, Zoom)
        });
        var scale = 1;
        Object.defineProperty(swiper.zoom, 'scale', {
          get: function get() {
            return scale;
          },
          set: function set(value) {
            if (scale !== value) {
              var imageEl = swiper.zoom.gesture.$imageEl ? swiper.zoom.gesture.$imageEl[0] : undefined;
              var slideEl = swiper.zoom.gesture.$slideEl ? swiper.zoom.gesture.$slideEl[0] : undefined;
              swiper.emit('zoomChange', value, imageEl, slideEl);
            }

            scale = value;
          }
        });
      },
      on: {
        init: function init(swiper) {
          if (swiper.params.zoom.enabled) {
            swiper.zoom.enable();
          }
        },
        destroy: function destroy(swiper) {
          swiper.zoom.disable();
        },
        touchStart: function touchStart(swiper, e) {
          if (!swiper.zoom.enabled) return;
          swiper.zoom.onTouchStart(e);
        },
        touchEnd: function touchEnd(swiper, e) {
          if (!swiper.zoom.enabled) return;
          swiper.zoom.onTouchEnd(e);
        },
        doubleTap: function doubleTap(swiper, e) {
          if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
            swiper.zoom.toggle(e);
          }
        },
        transitionEnd: function transitionEnd(swiper) {
          if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
            swiper.zoom.onTransitionEnd();
          }
        },
        slideChange: function slideChange(swiper) {
          if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
            swiper.zoom.onTransitionEnd();
          }
        }
      }
    };

    function _extends$8() { _extends$8 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$8.apply(this, arguments); }
    var Lazy = {
      loadInSlide: function loadInSlide(index, loadInDuplicate) {
        if (loadInDuplicate === void 0) {
          loadInDuplicate = true;
        }

        var swiper = this;
        var params = swiper.params.lazy;
        if (typeof index === 'undefined') return;
        if (swiper.slides.length === 0) return;
        var isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        var $slideEl = isVirtual ? swiper.$wrapperEl.children("." + swiper.params.slideClass + "[data-swiper-slide-index=\"" + index + "\"]") : swiper.slides.eq(index);
        var $images = $slideEl.find("." + params.elementClass + ":not(." + params.loadedClass + "):not(." + params.loadingClass + ")");

        if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
          $images.push($slideEl[0]);
        }

        if ($images.length === 0) return;
        $images.each(function (imageEl) {
          var $imageEl = $(imageEl);
          $imageEl.addClass(params.loadingClass);
          var background = $imageEl.attr('data-background');
          var src = $imageEl.attr('data-src');
          var srcset = $imageEl.attr('data-srcset');
          var sizes = $imageEl.attr('data-sizes');
          var $pictureEl = $imageEl.parent('picture');
          swiper.loadImage($imageEl[0], src || background, srcset, sizes, false, function () {
            if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper && !swiper.params || swiper.destroyed) return;

            if (background) {
              $imageEl.css('background-image', "url(\"" + background + "\")");
              $imageEl.removeAttr('data-background');
            } else {
              if (srcset) {
                $imageEl.attr('srcset', srcset);
                $imageEl.removeAttr('data-srcset');
              }

              if (sizes) {
                $imageEl.attr('sizes', sizes);
                $imageEl.removeAttr('data-sizes');
              }

              if ($pictureEl.length) {
                $pictureEl.children('source').each(function (sourceEl) {
                  var $source = $(sourceEl);

                  if ($source.attr('data-srcset')) {
                    $source.attr('srcset', $source.attr('data-srcset'));
                    $source.removeAttr('data-srcset');
                  }
                });
              }

              if (src) {
                $imageEl.attr('src', src);
                $imageEl.removeAttr('data-src');
              }
            }

            $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
            $slideEl.find("." + params.preloaderClass).remove();

            if (swiper.params.loop && loadInDuplicate) {
              var slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');

              if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
                var originalSlide = swiper.$wrapperEl.children("[data-swiper-slide-index=\"" + slideOriginalIndex + "\"]:not(." + swiper.params.slideDuplicateClass + ")");
                swiper.lazy.loadInSlide(originalSlide.index(), false);
              } else {
                var duplicatedSlide = swiper.$wrapperEl.children("." + swiper.params.slideDuplicateClass + "[data-swiper-slide-index=\"" + slideOriginalIndex + "\"]");
                swiper.lazy.loadInSlide(duplicatedSlide.index(), false);
              }
            }

            swiper.emit('lazyImageReady', $slideEl[0], $imageEl[0]);

            if (swiper.params.autoHeight) {
              swiper.updateAutoHeight();
            }
          });
          swiper.emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
        });
      },
      load: function load() {
        var swiper = this;
        var $wrapperEl = swiper.$wrapperEl,
            swiperParams = swiper.params,
            slides = swiper.slides,
            activeIndex = swiper.activeIndex;
        var isVirtual = swiper.virtual && swiperParams.virtual.enabled;
        var params = swiperParams.lazy;
        var slidesPerView = swiperParams.slidesPerView;

        if (slidesPerView === 'auto') {
          slidesPerView = 0;
        }

        function slideExist(index) {
          if (isVirtual) {
            if ($wrapperEl.children("." + swiperParams.slideClass + "[data-swiper-slide-index=\"" + index + "\"]").length) {
              return true;
            }
          } else if (slides[index]) return true;

          return false;
        }

        function slideIndex(slideEl) {
          if (isVirtual) {
            return $(slideEl).attr('data-swiper-slide-index');
          }

          return $(slideEl).index();
        }

        if (!swiper.lazy.initialImageLoaded) swiper.lazy.initialImageLoaded = true;

        if (swiper.params.watchSlidesVisibility) {
          $wrapperEl.children("." + swiperParams.slideVisibleClass).each(function (slideEl) {
            var index = isVirtual ? $(slideEl).attr('data-swiper-slide-index') : $(slideEl).index();
            swiper.lazy.loadInSlide(index);
          });
        } else if (slidesPerView > 1) {
          for (var i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
            if (slideExist(i)) swiper.lazy.loadInSlide(i);
          }
        } else {
          swiper.lazy.loadInSlide(activeIndex);
        }

        if (params.loadPrevNext) {
          if (slidesPerView > 1 || params.loadPrevNextAmount && params.loadPrevNextAmount > 1) {
            var amount = params.loadPrevNextAmount;
            var spv = slidesPerView;
            var maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
            var minIndex = Math.max(activeIndex - Math.max(spv, amount), 0); // Next Slides

            for (var _i = activeIndex + slidesPerView; _i < maxIndex; _i += 1) {
              if (slideExist(_i)) swiper.lazy.loadInSlide(_i);
            } // Prev Slides


            for (var _i2 = minIndex; _i2 < activeIndex; _i2 += 1) {
              if (slideExist(_i2)) swiper.lazy.loadInSlide(_i2);
            }
          } else {
            var nextSlide = $wrapperEl.children("." + swiperParams.slideNextClass);
            if (nextSlide.length > 0) swiper.lazy.loadInSlide(slideIndex(nextSlide));
            var prevSlide = $wrapperEl.children("." + swiperParams.slidePrevClass);
            if (prevSlide.length > 0) swiper.lazy.loadInSlide(slideIndex(prevSlide));
          }
        }
      },
      checkInViewOnLoad: function checkInViewOnLoad() {
        var window = getWindow();
        var swiper = this;
        if (!swiper || swiper.destroyed) return;
        var $scrollElement = swiper.params.lazy.scrollingElement ? $(swiper.params.lazy.scrollingElement) : $(window);
        var isWindow = $scrollElement[0] === window;
        var scrollElementWidth = isWindow ? window.innerWidth : $scrollElement[0].offsetWidth;
        var scrollElementHeight = isWindow ? window.innerHeight : $scrollElement[0].offsetHeight;
        var swiperOffset = swiper.$el.offset();
        var rtl = swiper.rtlTranslate;
        var inView = false;
        if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
        var swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiper.width, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiper.height], [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height]];

        for (var i = 0; i < swiperCoord.length; i += 1) {
          var point = swiperCoord[i];

          if (point[0] >= 0 && point[0] <= scrollElementWidth && point[1] >= 0 && point[1] <= scrollElementHeight) {
            if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

            inView = true;
          }
        }

        if (inView) {
          swiper.lazy.load();
          $scrollElement.off('scroll', swiper.lazy.checkInViewOnLoad);
        } else if (!swiper.lazy.scrollHandlerAttached) {
          swiper.lazy.scrollHandlerAttached = true;
          $scrollElement.on('scroll', swiper.lazy.checkInViewOnLoad);
        }
      }
    };
    var lazy = {
      name: 'lazy',
      params: {
        lazy: {
          checkInView: false,
          enabled: false,
          loadPrevNext: false,
          loadPrevNextAmount: 1,
          loadOnTransitionStart: false,
          scrollingElement: '',
          elementClass: 'swiper-lazy',
          loadingClass: 'swiper-lazy-loading',
          loadedClass: 'swiper-lazy-loaded',
          preloaderClass: 'swiper-lazy-preloader'
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          lazy: _extends$8({
            initialImageLoaded: false
          }, Lazy)
        });
      },
      on: {
        beforeInit: function beforeInit(swiper) {
          if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
            swiper.params.preloadImages = false;
          }
        },
        init: function init(swiper) {
          if (swiper.params.lazy.enabled && !swiper.params.loop && swiper.params.initialSlide === 0) {
            if (swiper.params.lazy.checkInView) {
              swiper.lazy.checkInViewOnLoad();
            } else {
              swiper.lazy.load();
            }
          }
        },
        scroll: function scroll(swiper) {
          if (swiper.params.freeMode && !swiper.params.freeModeSticky) {
            swiper.lazy.load();
          }
        },
        'scrollbarDragMove resize _freeModeNoMomentumRelease': function lazyLoad(swiper) {
          if (swiper.params.lazy.enabled) {
            swiper.lazy.load();
          }
        },
        transitionStart: function transitionStart(swiper) {
          if (swiper.params.lazy.enabled) {
            if (swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !swiper.lazy.initialImageLoaded) {
              swiper.lazy.load();
            }
          }
        },
        transitionEnd: function transitionEnd(swiper) {
          if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
            swiper.lazy.load();
          }
        },
        slideChange: function slideChange(swiper) {
          if (swiper.params.lazy.enabled && swiper.params.cssMode) {
            swiper.lazy.load();
          }
        }
      }
    };

    function _extends$9() { _extends$9 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$9.apply(this, arguments); }
    var Controller = {
      LinearSpline: function LinearSpline(x, y) {
        var binarySearch = function search() {
          var maxIndex;
          var minIndex;
          var guess;
          return function (array, val) {
            minIndex = -1;
            maxIndex = array.length;

            while (maxIndex - minIndex > 1) {
              guess = maxIndex + minIndex >> 1;

              if (array[guess] <= val) {
                minIndex = guess;
              } else {
                maxIndex = guess;
              }
            }

            return maxIndex;
          };
        }();

        this.x = x;
        this.y = y;
        this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
        // (x1,y1) is the known point before given value,
        // (x3,y3) is the known point after given value.

        var i1;
        var i3;

        this.interpolate = function interpolate(x2) {
          if (!x2) return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):

          i3 = binarySearch(this.x, x2);
          i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
          // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1

          return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
        };

        return this;
      },
      // xxx: for now i will just save one spline function to to
      getInterpolateFunction: function getInterpolateFunction(c) {
        var swiper = this;

        if (!swiper.controller.spline) {
          swiper.controller.spline = swiper.params.loop ? new Controller.LinearSpline(swiper.slidesGrid, c.slidesGrid) : new Controller.LinearSpline(swiper.snapGrid, c.snapGrid);
        }
      },
      setTranslate: function setTranslate(_setTranslate, byController) {
        var swiper = this;
        var controlled = swiper.controller.control;
        var multiplier;
        var controlledTranslate;
        var Swiper = swiper.constructor;

        function setControlledTranslate(c) {
          // this will create an Interpolate function based on the snapGrids
          // x is the Grid of the scrolled scroller and y will be the controlled scroller
          // it makes sense to create this only once and recall it for the interpolation
          // the function does a lot of value caching for performance
          var translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;

          if (swiper.params.controller.by === 'slide') {
            swiper.controller.getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
            // but it did not work out

            controlledTranslate = -swiper.controller.spline.interpolate(-translate);
          }

          if (!controlledTranslate || swiper.params.controller.by === 'container') {
            multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
            controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
          }

          if (swiper.params.controller.inverse) {
            controlledTranslate = c.maxTranslate() - controlledTranslate;
          }

          c.updateProgress(controlledTranslate);
          c.setTranslate(controlledTranslate, swiper);
          c.updateActiveIndex();
          c.updateSlidesClasses();
        }

        if (Array.isArray(controlled)) {
          for (var i = 0; i < controlled.length; i += 1) {
            if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
              setControlledTranslate(controlled[i]);
            }
          }
        } else if (controlled instanceof Swiper && byController !== controlled) {
          setControlledTranslate(controlled);
        }
      },
      setTransition: function setTransition(duration, byController) {
        var swiper = this;
        var Swiper = swiper.constructor;
        var controlled = swiper.controller.control;
        var i;

        function setControlledTransition(c) {
          c.setTransition(duration, swiper);

          if (duration !== 0) {
            c.transitionStart();

            if (c.params.autoHeight) {
              nextTick(function () {
                c.updateAutoHeight();
              });
            }

            c.$wrapperEl.transitionEnd(function () {
              if (!controlled) return;

              if (c.params.loop && swiper.params.controller.by === 'slide') {
                c.loopFix();
              }

              c.transitionEnd();
            });
          }
        }

        if (Array.isArray(controlled)) {
          for (i = 0; i < controlled.length; i += 1) {
            if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
              setControlledTransition(controlled[i]);
            }
          }
        } else if (controlled instanceof Swiper && byController !== controlled) {
          setControlledTransition(controlled);
        }
      }
    };
    var Controller$1 = {
      name: 'controller',
      params: {
        controller: {
          control: undefined,
          inverse: false,
          by: 'slide' // or 'container'

        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          controller: _extends$9({
            control: swiper.params.controller.control
          }, Controller)
        });
      },
      on: {
        update: function update(swiper) {
          if (!swiper.controller.control) return;

          if (swiper.controller.spline) {
            swiper.controller.spline = undefined;
            delete swiper.controller.spline;
          }
        },
        resize: function resize(swiper) {
          if (!swiper.controller.control) return;

          if (swiper.controller.spline) {
            swiper.controller.spline = undefined;
            delete swiper.controller.spline;
          }
        },
        observerUpdate: function observerUpdate(swiper) {
          if (!swiper.controller.control) return;

          if (swiper.controller.spline) {
            swiper.controller.spline = undefined;
            delete swiper.controller.spline;
          }
        },
        setTranslate: function setTranslate(swiper, translate, byController) {
          if (!swiper.controller.control) return;
          swiper.controller.setTranslate(translate, byController);
        },
        setTransition: function setTransition(swiper, duration, byController) {
          if (!swiper.controller.control) return;
          swiper.controller.setTransition(duration, byController);
        }
      }
    };

    function _extends$a() { _extends$a = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$a.apply(this, arguments); }
    var A11y = {
      getRandomNumber: function getRandomNumber(size) {
        if (size === void 0) {
          size = 16;
        }

        var randomChar = function randomChar() {
          return Math.round(16 * Math.random()).toString(16);
        };

        return 'x'.repeat(size).replace(/x/g, randomChar);
      },
      makeElFocusable: function makeElFocusable($el) {
        $el.attr('tabIndex', '0');
        return $el;
      },
      makeElNotFocusable: function makeElNotFocusable($el) {
        $el.attr('tabIndex', '-1');
        return $el;
      },
      addElRole: function addElRole($el, role) {
        $el.attr('role', role);
        return $el;
      },
      addElRoleDescription: function addElRoleDescription($el, description) {
        $el.attr('aria-roledescription', description);
        return $el;
      },
      addElControls: function addElControls($el, controls) {
        $el.attr('aria-controls', controls);
        return $el;
      },
      addElLabel: function addElLabel($el, label) {
        $el.attr('aria-label', label);
        return $el;
      },
      addElId: function addElId($el, id) {
        $el.attr('id', id);
        return $el;
      },
      addElLive: function addElLive($el, live) {
        $el.attr('aria-live', live);
        return $el;
      },
      disableEl: function disableEl($el) {
        $el.attr('aria-disabled', true);
        return $el;
      },
      enableEl: function enableEl($el) {
        $el.attr('aria-disabled', false);
        return $el;
      },
      onEnterOrSpaceKey: function onEnterOrSpaceKey(e) {
        if (e.keyCode !== 13 && e.keyCode !== 32) return;
        var swiper = this;
        var params = swiper.params.a11y;
        var $targetEl = $(e.target);

        if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
          if (!(swiper.isEnd && !swiper.params.loop)) {
            swiper.slideNext();
          }

          if (swiper.isEnd) {
            swiper.a11y.notify(params.lastSlideMessage);
          } else {
            swiper.a11y.notify(params.nextSlideMessage);
          }
        }

        if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
          if (!(swiper.isBeginning && !swiper.params.loop)) {
            swiper.slidePrev();
          }

          if (swiper.isBeginning) {
            swiper.a11y.notify(params.firstSlideMessage);
          } else {
            swiper.a11y.notify(params.prevSlideMessage);
          }
        }

        if (swiper.pagination && $targetEl.is("." + swiper.params.pagination.bulletClass.replace(/ /g, '.'))) {
          $targetEl[0].click();
        }
      },
      notify: function notify(message) {
        var swiper = this;
        var notification = swiper.a11y.liveRegion;
        if (notification.length === 0) return;
        notification.html('');
        notification.html(message);
      },
      updateNavigation: function updateNavigation() {
        var swiper = this;
        if (swiper.params.loop || !swiper.navigation) return;
        var _swiper$navigation = swiper.navigation,
            $nextEl = _swiper$navigation.$nextEl,
            $prevEl = _swiper$navigation.$prevEl;

        if ($prevEl && $prevEl.length > 0) {
          if (swiper.isBeginning) {
            swiper.a11y.disableEl($prevEl);
            swiper.a11y.makeElNotFocusable($prevEl);
          } else {
            swiper.a11y.enableEl($prevEl);
            swiper.a11y.makeElFocusable($prevEl);
          }
        }

        if ($nextEl && $nextEl.length > 0) {
          if (swiper.isEnd) {
            swiper.a11y.disableEl($nextEl);
            swiper.a11y.makeElNotFocusable($nextEl);
          } else {
            swiper.a11y.enableEl($nextEl);
            swiper.a11y.makeElFocusable($nextEl);
          }
        }
      },
      updatePagination: function updatePagination() {
        var swiper = this;
        var params = swiper.params.a11y;

        if (swiper.pagination && swiper.params.pagination.clickable && swiper.pagination.bullets && swiper.pagination.bullets.length) {
          swiper.pagination.bullets.each(function (bulletEl) {
            var $bulletEl = $(bulletEl);
            swiper.a11y.makeElFocusable($bulletEl);

            if (!swiper.params.pagination.renderBullet) {
              swiper.a11y.addElRole($bulletEl, 'button');
              swiper.a11y.addElLabel($bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1));
            }
          });
        }
      },
      init: function init() {
        var swiper = this;
        var params = swiper.params.a11y;
        swiper.$el.append(swiper.a11y.liveRegion); // Container

        var $containerEl = swiper.$el;

        if (params.containerRoleDescriptionMessage) {
          swiper.a11y.addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
        }

        if (params.containerMessage) {
          swiper.a11y.addElLabel($containerEl, params.containerMessage);
        } // Wrapper


        var $wrapperEl = swiper.$wrapperEl;
        var wrapperId = $wrapperEl.attr('id') || "swiper-wrapper-" + swiper.a11y.getRandomNumber(16);
        var live;
        swiper.a11y.addElId($wrapperEl, wrapperId);

        if (swiper.params.autoplay && swiper.params.autoplay.enabled) {
          live = 'off';
        } else {
          live = 'polite';
        }

        swiper.a11y.addElLive($wrapperEl, live); // Slide

        if (params.itemRoleDescriptionMessage) {
          swiper.a11y.addElRoleDescription($(swiper.slides), params.itemRoleDescriptionMessage);
        }

        swiper.a11y.addElRole($(swiper.slides), 'group');
        swiper.slides.each(function (slideEl) {
          var $slideEl = $(slideEl);
          var ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, $slideEl.index() + 1).replace(/\{\{slidesLength\}\}/, swiper.slides.length);
          swiper.a11y.addElLabel($slideEl, ariaLabelMessage);
        }); // Navigation

        var $nextEl;
        var $prevEl;

        if (swiper.navigation && swiper.navigation.$nextEl) {
          $nextEl = swiper.navigation.$nextEl;
        }

        if (swiper.navigation && swiper.navigation.$prevEl) {
          $prevEl = swiper.navigation.$prevEl;
        }

        if ($nextEl && $nextEl.length) {
          swiper.a11y.makeElFocusable($nextEl);

          if ($nextEl[0].tagName !== 'BUTTON') {
            swiper.a11y.addElRole($nextEl, 'button');
            $nextEl.on('keydown', swiper.a11y.onEnterOrSpaceKey);
          }

          swiper.a11y.addElLabel($nextEl, params.nextSlideMessage);
          swiper.a11y.addElControls($nextEl, wrapperId);
        }

        if ($prevEl && $prevEl.length) {
          swiper.a11y.makeElFocusable($prevEl);

          if ($prevEl[0].tagName !== 'BUTTON') {
            swiper.a11y.addElRole($prevEl, 'button');
            $prevEl.on('keydown', swiper.a11y.onEnterOrSpaceKey);
          }

          swiper.a11y.addElLabel($prevEl, params.prevSlideMessage);
          swiper.a11y.addElControls($prevEl, wrapperId);
        } // Pagination


        if (swiper.pagination && swiper.params.pagination.clickable && swiper.pagination.bullets && swiper.pagination.bullets.length) {
          swiper.pagination.$el.on('keydown', "." + swiper.params.pagination.bulletClass.replace(/ /g, '.'), swiper.a11y.onEnterOrSpaceKey);
        }
      },
      destroy: function destroy() {
        var swiper = this;
        if (swiper.a11y.liveRegion && swiper.a11y.liveRegion.length > 0) swiper.a11y.liveRegion.remove();
        var $nextEl;
        var $prevEl;

        if (swiper.navigation && swiper.navigation.$nextEl) {
          $nextEl = swiper.navigation.$nextEl;
        }

        if (swiper.navigation && swiper.navigation.$prevEl) {
          $prevEl = swiper.navigation.$prevEl;
        }

        if ($nextEl) {
          $nextEl.off('keydown', swiper.a11y.onEnterOrSpaceKey);
        }

        if ($prevEl) {
          $prevEl.off('keydown', swiper.a11y.onEnterOrSpaceKey);
        } // Pagination


        if (swiper.pagination && swiper.params.pagination.clickable && swiper.pagination.bullets && swiper.pagination.bullets.length) {
          swiper.pagination.$el.off('keydown', "." + swiper.params.pagination.bulletClass.replace(/ /g, '.'), swiper.a11y.onEnterOrSpaceKey);
        }
      }
    };
    var a11y = {
      name: 'a11y',
      params: {
        a11y: {
          enabled: true,
          notificationClass: 'swiper-notification',
          prevSlideMessage: 'Previous slide',
          nextSlideMessage: 'Next slide',
          firstSlideMessage: 'This is the first slide',
          lastSlideMessage: 'This is the last slide',
          paginationBulletMessage: 'Go to slide {{index}}',
          slideLabelMessage: '{{index}} / {{slidesLength}}',
          containerMessage: null,
          containerRoleDescriptionMessage: null,
          itemRoleDescriptionMessage: null
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          a11y: _extends$a({}, A11y, {
            liveRegion: $("<span class=\"" + swiper.params.a11y.notificationClass + "\" aria-live=\"assertive\" aria-atomic=\"true\"></span>")
          })
        });
      },
      on: {
        afterInit: function afterInit(swiper) {
          if (!swiper.params.a11y.enabled) return;
          swiper.a11y.init();
          swiper.a11y.updateNavigation();
        },
        toEdge: function toEdge(swiper) {
          if (!swiper.params.a11y.enabled) return;
          swiper.a11y.updateNavigation();
        },
        fromEdge: function fromEdge(swiper) {
          if (!swiper.params.a11y.enabled) return;
          swiper.a11y.updateNavigation();
        },
        paginationUpdate: function paginationUpdate(swiper) {
          if (!swiper.params.a11y.enabled) return;
          swiper.a11y.updatePagination();
        },
        destroy: function destroy(swiper) {
          if (!swiper.params.a11y.enabled) return;
          swiper.a11y.destroy();
        }
      }
    };

    function _extends$b() { _extends$b = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$b.apply(this, arguments); }
    var History = {
      init: function init() {
        var swiper = this;
        var window = getWindow();
        if (!swiper.params.history) return;

        if (!window.history || !window.history.pushState) {
          swiper.params.history.enabled = false;
          swiper.params.hashNavigation.enabled = true;
          return;
        }

        var history = swiper.history;
        history.initialized = true;
        history.paths = History.getPathValues(swiper.params.url);
        if (!history.paths.key && !history.paths.value) return;
        history.scrollToSlide(0, history.paths.value, swiper.params.runCallbacksOnInit);

        if (!swiper.params.history.replaceState) {
          window.addEventListener('popstate', swiper.history.setHistoryPopState);
        }
      },
      destroy: function destroy() {
        var swiper = this;
        var window = getWindow();

        if (!swiper.params.history.replaceState) {
          window.removeEventListener('popstate', swiper.history.setHistoryPopState);
        }
      },
      setHistoryPopState: function setHistoryPopState() {
        var swiper = this;
        swiper.history.paths = History.getPathValues(swiper.params.url);
        swiper.history.scrollToSlide(swiper.params.speed, swiper.history.paths.value, false);
      },
      getPathValues: function getPathValues(urlOverride) {
        var window = getWindow();
        var location;

        if (urlOverride) {
          location = new URL(urlOverride);
        } else {
          location = window.location;
        }

        var pathArray = location.pathname.slice(1).split('/').filter(function (part) {
          return part !== '';
        });
        var total = pathArray.length;
        var key = pathArray[total - 2];
        var value = pathArray[total - 1];
        return {
          key: key,
          value: value
        };
      },
      setHistory: function setHistory(key, index) {
        var swiper = this;
        var window = getWindow();
        if (!swiper.history.initialized || !swiper.params.history.enabled) return;
        var location;

        if (swiper.params.url) {
          location = new URL(swiper.params.url);
        } else {
          location = window.location;
        }

        var slide = swiper.slides.eq(index);
        var value = History.slugify(slide.attr('data-history'));

        if (!location.pathname.includes(key)) {
          value = key + "/" + value;
        }

        var currentState = window.history.state;

        if (currentState && currentState.value === value) {
          return;
        }

        if (swiper.params.history.replaceState) {
          window.history.replaceState({
            value: value
          }, null, value);
        } else {
          window.history.pushState({
            value: value
          }, null, value);
        }
      },
      slugify: function slugify(text) {
        return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
      },
      scrollToSlide: function scrollToSlide(speed, value, runCallbacks) {
        var swiper = this;

        if (value) {
          for (var i = 0, length = swiper.slides.length; i < length; i += 1) {
            var slide = swiper.slides.eq(i);
            var slideHistory = History.slugify(slide.attr('data-history'));

            if (slideHistory === value && !slide.hasClass(swiper.params.slideDuplicateClass)) {
              var index = slide.index();
              swiper.slideTo(index, speed, runCallbacks);
            }
          }
        } else {
          swiper.slideTo(0, speed, runCallbacks);
        }
      }
    };
    var history = {
      name: 'history',
      params: {
        history: {
          enabled: false,
          replaceState: false,
          key: 'slides'
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          history: _extends$b({}, History)
        });
      },
      on: {
        init: function init(swiper) {
          if (swiper.params.history.enabled) {
            swiper.history.init();
          }
        },
        destroy: function destroy(swiper) {
          if (swiper.params.history.enabled) {
            swiper.history.destroy();
          }
        },
        transitionEnd: function transitionEnd(swiper) {
          if (swiper.history.initialized) {
            swiper.history.setHistory(swiper.params.history.key, swiper.activeIndex);
          }
        },
        slideChange: function slideChange(swiper) {
          if (swiper.history.initialized && swiper.params.cssMode) {
            swiper.history.setHistory(swiper.params.history.key, swiper.activeIndex);
          }
        }
      }
    };

    function _extends$c() { _extends$c = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$c.apply(this, arguments); }
    var HashNavigation = {
      onHashCange: function onHashCange() {
        var swiper = this;
        var document = getDocument();
        swiper.emit('hashChange');
        var newHash = document.location.hash.replace('#', '');
        var activeSlideHash = swiper.slides.eq(swiper.activeIndex).attr('data-hash');

        if (newHash !== activeSlideHash) {
          var newIndex = swiper.$wrapperEl.children("." + swiper.params.slideClass + "[data-hash=\"" + newHash + "\"]").index();
          if (typeof newIndex === 'undefined') return;
          swiper.slideTo(newIndex);
        }
      },
      setHash: function setHash() {
        var swiper = this;
        var window = getWindow();
        var document = getDocument();
        if (!swiper.hashNavigation.initialized || !swiper.params.hashNavigation.enabled) return;

        if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
          window.history.replaceState(null, null, "#" + swiper.slides.eq(swiper.activeIndex).attr('data-hash') || '');
          swiper.emit('hashSet');
        } else {
          var slide = swiper.slides.eq(swiper.activeIndex);
          var hash = slide.attr('data-hash') || slide.attr('data-history');
          document.location.hash = hash || '';
          swiper.emit('hashSet');
        }
      },
      init: function init() {
        var swiper = this;
        var document = getDocument();
        var window = getWindow();
        if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
        swiper.hashNavigation.initialized = true;
        var hash = document.location.hash.replace('#', '');

        if (hash) {
          var speed = 0;

          for (var i = 0, length = swiper.slides.length; i < length; i += 1) {
            var slide = swiper.slides.eq(i);
            var slideHash = slide.attr('data-hash') || slide.attr('data-history');

            if (slideHash === hash && !slide.hasClass(swiper.params.slideDuplicateClass)) {
              var index = slide.index();
              swiper.slideTo(index, speed, swiper.params.runCallbacksOnInit, true);
            }
          }
        }

        if (swiper.params.hashNavigation.watchState) {
          $(window).on('hashchange', swiper.hashNavigation.onHashCange);
        }
      },
      destroy: function destroy() {
        var swiper = this;
        var window = getWindow();

        if (swiper.params.hashNavigation.watchState) {
          $(window).off('hashchange', swiper.hashNavigation.onHashCange);
        }
      }
    };
    var hashNavigation = {
      name: 'hash-navigation',
      params: {
        hashNavigation: {
          enabled: false,
          replaceState: false,
          watchState: false
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          hashNavigation: _extends$c({
            initialized: false
          }, HashNavigation)
        });
      },
      on: {
        init: function init(swiper) {
          if (swiper.params.hashNavigation.enabled) {
            swiper.hashNavigation.init();
          }
        },
        destroy: function destroy(swiper) {
          if (swiper.params.hashNavigation.enabled) {
            swiper.hashNavigation.destroy();
          }
        },
        transitionEnd: function transitionEnd(swiper) {
          if (swiper.hashNavigation.initialized) {
            swiper.hashNavigation.setHash();
          }
        },
        slideChange: function slideChange(swiper) {
          if (swiper.hashNavigation.initialized && swiper.params.cssMode) {
            swiper.hashNavigation.setHash();
          }
        }
      }
    };

    function _extends$d() { _extends$d = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$d.apply(this, arguments); }
    var Autoplay = {
      run: function run() {
        var swiper = this;
        var $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
        var delay = swiper.params.autoplay.delay;

        if ($activeSlideEl.attr('data-swiper-autoplay')) {
          delay = $activeSlideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
        }

        clearTimeout(swiper.autoplay.timeout);
        swiper.autoplay.timeout = nextTick(function () {
          var autoplayResult;

          if (swiper.params.autoplay.reverseDirection) {
            if (swiper.params.loop) {
              swiper.loopFix();
              autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
              swiper.emit('autoplay');
            } else if (!swiper.isBeginning) {
              autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
              swiper.emit('autoplay');
            } else if (!swiper.params.autoplay.stopOnLastSlide) {
              autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
              swiper.emit('autoplay');
            } else {
              swiper.autoplay.stop();
            }
          } else if (swiper.params.loop) {
            swiper.loopFix();
            autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
            swiper.emit('autoplay');
          } else if (!swiper.isEnd) {
            autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
            swiper.emit('autoplay');
          } else if (!swiper.params.autoplay.stopOnLastSlide) {
            autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
            swiper.emit('autoplay');
          } else {
            swiper.autoplay.stop();
          }

          if (swiper.params.cssMode && swiper.autoplay.running) swiper.autoplay.run();else if (autoplayResult === false) {
            swiper.autoplay.run();
          }
        }, delay);
      },
      start: function start() {
        var swiper = this;
        if (typeof swiper.autoplay.timeout !== 'undefined') return false;
        if (swiper.autoplay.running) return false;
        swiper.autoplay.running = true;
        swiper.emit('autoplayStart');
        swiper.autoplay.run();
        return true;
      },
      stop: function stop() {
        var swiper = this;
        if (!swiper.autoplay.running) return false;
        if (typeof swiper.autoplay.timeout === 'undefined') return false;

        if (swiper.autoplay.timeout) {
          clearTimeout(swiper.autoplay.timeout);
          swiper.autoplay.timeout = undefined;
        }

        swiper.autoplay.running = false;
        swiper.emit('autoplayStop');
        return true;
      },
      pause: function pause(speed) {
        var swiper = this;
        if (!swiper.autoplay.running) return;
        if (swiper.autoplay.paused) return;
        if (swiper.autoplay.timeout) clearTimeout(swiper.autoplay.timeout);
        swiper.autoplay.paused = true;

        if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
          swiper.autoplay.paused = false;
          swiper.autoplay.run();
        } else {
          swiper.$wrapperEl[0].addEventListener('transitionend', swiper.autoplay.onTransitionEnd);
          swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.autoplay.onTransitionEnd);
        }
      },
      onVisibilityChange: function onVisibilityChange() {
        var swiper = this;
        var document = getDocument();

        if (document.visibilityState === 'hidden' && swiper.autoplay.running) {
          swiper.autoplay.pause();
        }

        if (document.visibilityState === 'visible' && swiper.autoplay.paused) {
          swiper.autoplay.run();
          swiper.autoplay.paused = false;
        }
      },
      onTransitionEnd: function onTransitionEnd(e) {
        var swiper = this;
        if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
        if (e.target !== swiper.$wrapperEl[0]) return;
        swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.autoplay.onTransitionEnd);
        swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.autoplay.onTransitionEnd);
        swiper.autoplay.paused = false;

        if (!swiper.autoplay.running) {
          swiper.autoplay.stop();
        } else {
          swiper.autoplay.run();
        }
      }
    };
    var autoplay = {
      name: 'autoplay',
      params: {
        autoplay: {
          enabled: false,
          delay: 3000,
          waitForTransition: true,
          disableOnInteraction: true,
          stopOnLastSlide: false,
          reverseDirection: false
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          autoplay: _extends$d({}, Autoplay, {
            running: false,
            paused: false
          })
        });
      },
      on: {
        init: function init(swiper) {
          if (swiper.params.autoplay.enabled) {
            swiper.autoplay.start();
            var document = getDocument();
            document.addEventListener('visibilitychange', swiper.autoplay.onVisibilityChange);
          }
        },
        beforeTransitionStart: function beforeTransitionStart(swiper, speed, internal) {
          if (swiper.autoplay.running) {
            if (internal || !swiper.params.autoplay.disableOnInteraction) {
              swiper.autoplay.pause(speed);
            } else {
              swiper.autoplay.stop();
            }
          }
        },
        sliderFirstMove: function sliderFirstMove(swiper) {
          if (swiper.autoplay.running) {
            if (swiper.params.autoplay.disableOnInteraction) {
              swiper.autoplay.stop();
            } else {
              swiper.autoplay.pause();
            }
          }
        },
        touchEnd: function touchEnd(swiper) {
          if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) {
            swiper.autoplay.run();
          }
        },
        destroy: function destroy(swiper) {
          if (swiper.autoplay.running) {
            swiper.autoplay.stop();
          }

          var document = getDocument();
          document.removeEventListener('visibilitychange', swiper.autoplay.onVisibilityChange);
        }
      }
    };

    function _extends$e() { _extends$e = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$e.apply(this, arguments); }
    var Fade = {
      setTranslate: function setTranslate() {
        var swiper = this;
        var slides = swiper.slides;

        for (var i = 0; i < slides.length; i += 1) {
          var $slideEl = swiper.slides.eq(i);
          var offset = $slideEl[0].swiperSlideOffset;
          var tx = -offset;
          if (!swiper.params.virtualTranslate) tx -= swiper.translate;
          var ty = 0;

          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }

          var slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl.css({
            opacity: slideOpacity
          }).transform("translate3d(" + tx + "px, " + ty + "px, 0px)");
        }
      },
      setTransition: function setTransition(duration) {
        var swiper = this;
        var slides = swiper.slides,
            $wrapperEl = swiper.$wrapperEl;
        slides.transition(duration);

        if (swiper.params.virtualTranslate && duration !== 0) {
          var eventTriggered = false;
          slides.transitionEnd(function () {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;
            eventTriggered = true;
            swiper.animating = false;
            var triggerEvents = ['webkitTransitionEnd', 'transitionend'];

            for (var i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      }
    };
    var EffectFade = {
      name: 'effect-fade',
      params: {
        fadeEffect: {
          crossFade: false
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          fadeEffect: _extends$e({}, Fade)
        });
      },
      on: {
        beforeInit: function beforeInit(swiper) {
          if (swiper.params.effect !== 'fade') return;
          swiper.classNames.push(swiper.params.containerModifierClass + "fade");
          var overwriteParams = {
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: true,
            spaceBetween: 0,
            virtualTranslate: true
          };
          extend$1(swiper.params, overwriteParams);
          extend$1(swiper.originalParams, overwriteParams);
        },
        setTranslate: function setTranslate(swiper) {
          if (swiper.params.effect !== 'fade') return;
          swiper.fadeEffect.setTranslate();
        },
        setTransition: function setTransition(swiper, duration) {
          if (swiper.params.effect !== 'fade') return;
          swiper.fadeEffect.setTransition(duration);
        }
      }
    };

    function _extends$f() { _extends$f = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$f.apply(this, arguments); }
    var Cube = {
      setTranslate: function setTranslate() {
        var swiper = this;
        var $el = swiper.$el,
            $wrapperEl = swiper.$wrapperEl,
            slides = swiper.slides,
            swiperWidth = swiper.width,
            swiperHeight = swiper.height,
            rtl = swiper.rtlTranslate,
            swiperSize = swiper.size,
            browser = swiper.browser;
        var params = swiper.params.cubeEffect;
        var isHorizontal = swiper.isHorizontal();
        var isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        var wrapperRotate = 0;
        var $cubeShadowEl;

        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');

            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
              $wrapperEl.append($cubeShadowEl);
            }

            $cubeShadowEl.css({
              height: swiperWidth + "px"
            });
          } else {
            $cubeShadowEl = $el.find('.swiper-cube-shadow');

            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = $('<div class="swiper-cube-shadow"></div>');
              $el.append($cubeShadowEl);
            }
          }
        }

        for (var i = 0; i < slides.length; i += 1) {
          var $slideEl = slides.eq(i);
          var slideIndex = i;

          if (isVirtual) {
            slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
          }

          var slideAngle = slideIndex * 90;
          var round = Math.floor(slideAngle / 360);

          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }

          var progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          var tx = 0;
          var ty = 0;
          var tz = 0;

          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + round * 4 * swiperSize;
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = 3 * swiperSize + swiperSize * 4 * round;
          }

          if (rtl) {
            tx = -tx;
          }

          if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }

          var transform = "rotateX(" + (isHorizontal ? 0 : -slideAngle) + "deg) rotateY(" + (isHorizontal ? slideAngle : 0) + "deg) translate3d(" + tx + "px, " + ty + "px, " + tz + "px)";

          if (progress <= 1 && progress > -1) {
            wrapperRotate = slideIndex * 90 + progress * 90;
            if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
          }

          $slideEl.transform(transform);

          if (params.slideShadows) {
            // Set shadows
            var shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            var shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

            if (shadowBefore.length === 0) {
              shadowBefore = $("<div class=\"swiper-slide-shadow-" + (isHorizontal ? 'left' : 'top') + "\"></div>");
              $slideEl.append(shadowBefore);
            }

            if (shadowAfter.length === 0) {
              shadowAfter = $("<div class=\"swiper-slide-shadow-" + (isHorizontal ? 'right' : 'bottom') + "\"></div>");
              $slideEl.append(shadowAfter);
            }

            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
        }

        $wrapperEl.css({
          '-webkit-transform-origin': "50% 50% -" + swiperSize / 2 + "px",
          '-moz-transform-origin': "50% 50% -" + swiperSize / 2 + "px",
          '-ms-transform-origin': "50% 50% -" + swiperSize / 2 + "px",
          'transform-origin': "50% 50% -" + swiperSize / 2 + "px"
        });

        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl.transform("translate3d(0px, " + (swiperWidth / 2 + params.shadowOffset) + "px, " + -swiperWidth / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + params.shadowScale + ")");
          } else {
            var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
            var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
            var scale1 = params.shadowScale;
            var scale2 = params.shadowScale / multiplier;
            var offset = params.shadowOffset;
            $cubeShadowEl.transform("scale3d(" + scale1 + ", 1, " + scale2 + ") translate3d(0px, " + (swiperHeight / 2 + offset) + "px, " + -swiperHeight / 2 / scale2 + "px) rotateX(-90deg)");
          }
        }

        var zFactor = browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
        $wrapperEl.transform("translate3d(0px,0," + zFactor + "px) rotateX(" + (swiper.isHorizontal() ? 0 : wrapperRotate) + "deg) rotateY(" + (swiper.isHorizontal() ? -wrapperRotate : 0) + "deg)");
      },
      setTransition: function setTransition(duration) {
        var swiper = this;
        var $el = swiper.$el,
            slides = swiper.slides;
        slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);

        if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
          $el.find('.swiper-cube-shadow').transition(duration);
        }
      }
    };
    var effectCube = {
      name: 'effect-cube',
      params: {
        cubeEffect: {
          slideShadows: true,
          shadow: true,
          shadowOffset: 20,
          shadowScale: 0.94
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          cubeEffect: _extends$f({}, Cube)
        });
      },
      on: {
        beforeInit: function beforeInit(swiper) {
          if (swiper.params.effect !== 'cube') return;
          swiper.classNames.push(swiper.params.containerModifierClass + "cube");
          swiper.classNames.push(swiper.params.containerModifierClass + "3d");
          var overwriteParams = {
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: true,
            resistanceRatio: 0,
            spaceBetween: 0,
            centeredSlides: false,
            virtualTranslate: true
          };
          extend$1(swiper.params, overwriteParams);
          extend$1(swiper.originalParams, overwriteParams);
        },
        setTranslate: function setTranslate(swiper) {
          if (swiper.params.effect !== 'cube') return;
          swiper.cubeEffect.setTranslate();
        },
        setTransition: function setTransition(swiper, duration) {
          if (swiper.params.effect !== 'cube') return;
          swiper.cubeEffect.setTransition(duration);
        }
      }
    };

    function _extends$g() { _extends$g = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$g.apply(this, arguments); }
    var Flip = {
      setTranslate: function setTranslate() {
        var swiper = this;
        var slides = swiper.slides,
            rtl = swiper.rtlTranslate;

        for (var i = 0; i < slides.length; i += 1) {
          var $slideEl = slides.eq(i);
          var progress = $slideEl[0].progress;

          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          }

          var offset = $slideEl[0].swiperSlideOffset;
          var rotate = -180 * progress;
          var rotateY = rotate;
          var rotateX = 0;
          var tx = -offset;
          var ty = 0;

          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }

          $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

          if (swiper.params.flipEffect.slideShadows) {
            // Set shadows
            var shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            var shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

            if (shadowBefore.length === 0) {
              shadowBefore = $("<div class=\"swiper-slide-shadow-" + (swiper.isHorizontal() ? 'left' : 'top') + "\"></div>");
              $slideEl.append(shadowBefore);
            }

            if (shadowAfter.length === 0) {
              shadowAfter = $("<div class=\"swiper-slide-shadow-" + (swiper.isHorizontal() ? 'right' : 'bottom') + "\"></div>");
              $slideEl.append(shadowAfter);
            }

            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }

          $slideEl.transform("translate3d(" + tx + "px, " + ty + "px, 0px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)");
        }
      },
      setTransition: function setTransition(duration) {
        var swiper = this;
        var slides = swiper.slides,
            activeIndex = swiper.activeIndex,
            $wrapperEl = swiper.$wrapperEl;
        slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);

        if (swiper.params.virtualTranslate && duration !== 0) {
          var eventTriggered = false; // eslint-disable-next-line

          slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return; // if (!$(this).hasClass(swiper.params.slideActiveClass)) return;

            eventTriggered = true;
            swiper.animating = false;
            var triggerEvents = ['webkitTransitionEnd', 'transitionend'];

            for (var i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      }
    };
    var effectFlip = {
      name: 'effect-flip',
      params: {
        flipEffect: {
          slideShadows: true,
          limitRotation: true
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          flipEffect: _extends$g({}, Flip)
        });
      },
      on: {
        beforeInit: function beforeInit(swiper) {
          if (swiper.params.effect !== 'flip') return;
          swiper.classNames.push(swiper.params.containerModifierClass + "flip");
          swiper.classNames.push(swiper.params.containerModifierClass + "3d");
          var overwriteParams = {
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerGroup: 1,
            watchSlidesProgress: true,
            spaceBetween: 0,
            virtualTranslate: true
          };
          extend$1(swiper.params, overwriteParams);
          extend$1(swiper.originalParams, overwriteParams);
        },
        setTranslate: function setTranslate(swiper) {
          if (swiper.params.effect !== 'flip') return;
          swiper.flipEffect.setTranslate();
        },
        setTransition: function setTransition(swiper, duration) {
          if (swiper.params.effect !== 'flip') return;
          swiper.flipEffect.setTransition(duration);
        }
      }
    };

    function _extends$h() { _extends$h = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$h.apply(this, arguments); }
    var Coverflow = {
      setTranslate: function setTranslate() {
        var swiper = this;
        var swiperWidth = swiper.width,
            swiperHeight = swiper.height,
            slides = swiper.slides,
            slidesSizesGrid = swiper.slidesSizesGrid;
        var params = swiper.params.coverflowEffect;
        var isHorizontal = swiper.isHorizontal();
        var transform = swiper.translate;
        var center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
        var rotate = isHorizontal ? params.rotate : -params.rotate;
        var translate = params.depth; // Each slide offset from center

        for (var i = 0, length = slides.length; i < length; i += 1) {
          var $slideEl = slides.eq(i);
          var slideSize = slidesSizesGrid[i];
          var slideOffset = $slideEl[0].swiperSlideOffset;
          var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * params.modifier;
          var rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          var rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

          var translateZ = -translate * Math.abs(offsetMultiplier);
          var stretch = params.stretch; // Allow percentage to make a relative stretch for responsive sliders

          if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
            stretch = parseFloat(params.stretch) / 100 * slideSize;
          }

          var translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
          var translateX = isHorizontal ? stretch * offsetMultiplier : 0;
          var scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier); // Fix for ultra small values

          if (Math.abs(translateX) < 0.001) translateX = 0;
          if (Math.abs(translateY) < 0.001) translateY = 0;
          if (Math.abs(translateZ) < 0.001) translateZ = 0;
          if (Math.abs(rotateY) < 0.001) rotateY = 0;
          if (Math.abs(rotateX) < 0.001) rotateX = 0;
          if (Math.abs(scale) < 0.001) scale = 0;
          var slideTransform = "translate3d(" + translateX + "px," + translateY + "px," + translateZ + "px)  rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(" + scale + ")";
          $slideEl.transform(slideTransform);
          $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

          if (params.slideShadows) {
            // Set shadows
            var $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            var $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

            if ($shadowBeforeEl.length === 0) {
              $shadowBeforeEl = $("<div class=\"swiper-slide-shadow-" + (isHorizontal ? 'left' : 'top') + "\"></div>");
              $slideEl.append($shadowBeforeEl);
            }

            if ($shadowAfterEl.length === 0) {
              $shadowAfterEl = $("<div class=\"swiper-slide-shadow-" + (isHorizontal ? 'right' : 'bottom') + "\"></div>");
              $slideEl.append($shadowAfterEl);
            }

            if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
            if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
          }
        }
      },
      setTransition: function setTransition(duration) {
        var swiper = this;
        swiper.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
      }
    };
    var effectCoverflow = {
      name: 'effect-coverflow',
      params: {
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          scale: 1,
          modifier: 1,
          slideShadows: true
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          coverflowEffect: _extends$h({}, Coverflow)
        });
      },
      on: {
        beforeInit: function beforeInit(swiper) {
          if (swiper.params.effect !== 'coverflow') return;
          swiper.classNames.push(swiper.params.containerModifierClass + "coverflow");
          swiper.classNames.push(swiper.params.containerModifierClass + "3d");
          swiper.params.watchSlidesProgress = true;
          swiper.originalParams.watchSlidesProgress = true;
        },
        setTranslate: function setTranslate(swiper) {
          if (swiper.params.effect !== 'coverflow') return;
          swiper.coverflowEffect.setTranslate();
        },
        setTransition: function setTransition(swiper, duration) {
          if (swiper.params.effect !== 'coverflow') return;
          swiper.coverflowEffect.setTransition(duration);
        }
      }
    };

    function _extends$i() { _extends$i = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$i.apply(this, arguments); }
    var Thumbs = {
      init: function init() {
        var swiper = this;
        var thumbsParams = swiper.params.thumbs;
        if (swiper.thumbs.initialized) return false;
        swiper.thumbs.initialized = true;
        var SwiperClass = swiper.constructor;

        if (thumbsParams.swiper instanceof SwiperClass) {
          swiper.thumbs.swiper = thumbsParams.swiper;
          extend$1(swiper.thumbs.swiper.originalParams, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
          extend$1(swiper.thumbs.swiper.params, {
            watchSlidesProgress: true,
            slideToClickedSlide: false
          });
        } else if (isObject$1(thumbsParams.swiper)) {
          swiper.thumbs.swiper = new SwiperClass(extend$1({}, thumbsParams.swiper, {
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            slideToClickedSlide: false
          }));
          swiper.thumbs.swiperCreated = true;
        }

        swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
        swiper.thumbs.swiper.on('tap', swiper.thumbs.onThumbClick);
        return true;
      },
      onThumbClick: function onThumbClick() {
        var swiper = this;
        var thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper) return;
        var clickedIndex = thumbsSwiper.clickedIndex;
        var clickedSlide = thumbsSwiper.clickedSlide;
        if (clickedSlide && $(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
        if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
        var slideToIndex;

        if (thumbsSwiper.params.loop) {
          slideToIndex = parseInt($(thumbsSwiper.clickedSlide).attr('data-swiper-slide-index'), 10);
        } else {
          slideToIndex = clickedIndex;
        }

        if (swiper.params.loop) {
          var currentIndex = swiper.activeIndex;

          if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
            swiper.loopFix(); // eslint-disable-next-line

            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
            currentIndex = swiper.activeIndex;
          }

          var prevIndex = swiper.slides.eq(currentIndex).prevAll("[data-swiper-slide-index=\"" + slideToIndex + "\"]").eq(0).index();
          var nextIndex = swiper.slides.eq(currentIndex).nextAll("[data-swiper-slide-index=\"" + slideToIndex + "\"]").eq(0).index();
          if (typeof prevIndex === 'undefined') slideToIndex = nextIndex;else if (typeof nextIndex === 'undefined') slideToIndex = prevIndex;else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex;else slideToIndex = prevIndex;
        }

        swiper.slideTo(slideToIndex);
      },
      update: function update(initial) {
        var swiper = this;
        var thumbsSwiper = swiper.thumbs.swiper;
        if (!thumbsSwiper) return;
        var slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
        var autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
        var useOffset = autoScrollOffset && !thumbsSwiper.params.loop;

        if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
          var currentThumbsIndex = thumbsSwiper.activeIndex;
          var newThumbsIndex;
          var direction;

          if (thumbsSwiper.params.loop) {
            if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
              thumbsSwiper.loopFix(); // eslint-disable-next-line

              thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
              currentThumbsIndex = thumbsSwiper.activeIndex;
            } // Find actual thumbs index to slide to


            var prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll("[data-swiper-slide-index=\"" + swiper.realIndex + "\"]").eq(0).index();
            var nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll("[data-swiper-slide-index=\"" + swiper.realIndex + "\"]").eq(0).index();
            if (typeof prevThumbsIndex === 'undefined') newThumbsIndex = nextThumbsIndex;else if (typeof nextThumbsIndex === 'undefined') newThumbsIndex = prevThumbsIndex;else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) newThumbsIndex = currentThumbsIndex;else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) newThumbsIndex = nextThumbsIndex;else newThumbsIndex = prevThumbsIndex;
            direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
          } else {
            newThumbsIndex = swiper.realIndex;
            direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
          }

          if (useOffset) {
            newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
          }

          if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
            if (thumbsSwiper.params.centeredSlides) {
              if (newThumbsIndex > currentThumbsIndex) {
                newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
              } else {
                newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
              }
            } else if (newThumbsIndex > currentThumbsIndex) {
              newThumbsIndex = newThumbsIndex - slidesPerView + 1;
            }

            thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
          }
        } // Activate thumbs


        var thumbsToActivate = 1;
        var thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;

        if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
          thumbsToActivate = swiper.params.slidesPerView;
        }

        if (!swiper.params.thumbs.multipleActiveThumbs) {
          thumbsToActivate = 1;
        }

        thumbsToActivate = Math.floor(thumbsToActivate);
        thumbsSwiper.slides.removeClass(thumbActiveClass);

        if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
          for (var i = 0; i < thumbsToActivate; i += 1) {
            thumbsSwiper.$wrapperEl.children("[data-swiper-slide-index=\"" + (swiper.realIndex + i) + "\"]").addClass(thumbActiveClass);
          }
        } else {
          for (var _i = 0; _i < thumbsToActivate; _i += 1) {
            thumbsSwiper.slides.eq(swiper.realIndex + _i).addClass(thumbActiveClass);
          }
        }
      }
    };
    var thumbs = {
      name: 'thumbs',
      params: {
        thumbs: {
          swiper: null,
          multipleActiveThumbs: true,
          autoScrollOffset: 0,
          slideThumbActiveClass: 'swiper-slide-thumb-active',
          thumbsContainerClass: 'swiper-container-thumbs'
        }
      },
      create: function create() {
        var swiper = this;
        bindModuleMethods(swiper, {
          thumbs: _extends$i({
            swiper: null,
            initialized: false
          }, Thumbs)
        });
      },
      on: {
        beforeInit: function beforeInit(swiper) {
          var thumbs = swiper.params.thumbs;
          if (!thumbs || !thumbs.swiper) return;
          swiper.thumbs.init();
          swiper.thumbs.update(true);
        },
        slideChange: function slideChange(swiper) {
          if (!swiper.thumbs.swiper) return;
          swiper.thumbs.update();
        },
        update: function update(swiper) {
          if (!swiper.thumbs.swiper) return;
          swiper.thumbs.update();
        },
        resize: function resize(swiper) {
          if (!swiper.thumbs.swiper) return;
          swiper.thumbs.update();
        },
        observerUpdate: function observerUpdate(swiper) {
          if (!swiper.thumbs.swiper) return;
          swiper.thumbs.update();
        },
        setTransition: function setTransition(swiper, duration) {
          var thumbsSwiper = swiper.thumbs.swiper;
          if (!thumbsSwiper) return;
          thumbsSwiper.setTransition(duration);
        },
        beforeDestroy: function beforeDestroy(swiper) {
          var thumbsSwiper = swiper.thumbs.swiper;
          if (!thumbsSwiper) return;

          if (swiper.thumbs.swiperCreated && thumbsSwiper) {
            thumbsSwiper.destroy();
          }
        }
      }
    };

    /**
     * Swiper 6.5.3
     * Most modern mobile touch slider and framework with hardware accelerated transitions
     * https://swiperjs.com
     *
     * Copyright 2014-2021 Vladimir Kharlampidi
     *
     * Released under the MIT License
     *
     * Released on: March 31, 2021
     */

    const __esModule = true;

    var swiper_esm = /*#__PURE__*/Object.freeze({
        __proto__: null,
        __esModule: __esModule,
        Swiper: Swiper,
        'default': Swiper,
        Virtual: virtual,
        Keyboard: keyboard,
        Mousewheel: mousewheel,
        Navigation: navigation,
        Pagination: pagination,
        Scrollbar: scrollbar,
        Parallax: parallax,
        Zoom: zoom,
        Lazy: lazy,
        Controller: Controller$1,
        A11y: a11y,
        History: history,
        HashNavigation: hashNavigation,
        Autoplay: autoplay,
        EffectFade: EffectFade,
        EffectCube: effectCube,
        EffectFlip: effectFlip,
        EffectCoverflow: effectCoverflow,
        Thumbs: thumbs
    });

    function isObject$2(o) {
      return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
    }

    function extend$2(target, src) {
      var noExtend = ['__proto__', 'constructor', 'prototype'];
      Object.keys(src).filter(function (key) {
        return noExtend.indexOf(key) < 0;
      }).forEach(function (key) {
        if (typeof target[key] === 'undefined') target[key] = src[key];else if (isObject$2(src[key]) && isObject$2(target[key]) && Object.keys(src[key]).length > 0) {
          if (src[key].__swiper__) target[key] = src[key];else extend$2(target[key], src[key]);
        } else {
          target[key] = src[key];
        }
      });
    }

    function needsNavigation(params) {
      if (params === void 0) {
        params = {};
      }

      return params.navigation && typeof params.navigation.nextEl === 'undefined' && typeof params.navigation.prevEl === 'undefined';
    }

    function needsPagination(params) {
      if (params === void 0) {
        params = {};
      }

      return params.pagination && typeof params.pagination.el === 'undefined';
    }

    function needsScrollbar(params) {
      if (params === void 0) {
        params = {};
      }

      return params.scrollbar && typeof params.scrollbar.el === 'undefined';
    }

    function uniqueClasses(classNames) {
      if (classNames === void 0) {
        classNames = '';
      }

      var classes = classNames.split(' ').map(function (c) {
        return c.trim();
      }).filter(function (c) {
        return !!c;
      });
      var unique = [];
      classes.forEach(function (c) {
        if (unique.indexOf(c) < 0) unique.push(c);
      });
      return unique.join(' ');
    }

    /* underscore in name -> watch for changes */
    var paramsList = ['init', '_direction', 'touchEventsTarget', 'initialSlide', '_speed', 'cssMode', 'updateOnWindowResize', 'resizeObserver', 'nested', '_width', '_height', 'preventInteractionOnTransition', 'userAgent', 'url', '_edgeSwipeDetection', '_edgeSwipeThreshold', '_freeMode', '_freeModeMomentum', '_freeModeMomentumRatio', '_freeModeMomentumBounce', '_freeModeMomentumBounceRatio', '_freeModeMomentumVelocityRatio', '_freeModeSticky', '_freeModeMinimumVelocity', '_autoHeight', 'setWrapperSize', 'virtualTranslate', '_effect', 'breakpoints', '_spaceBetween', '_slidesPerView', '_slidesPerColumn', '_slidesPerColumnFill', '_slidesPerGroup', '_slidesPerGroupSkip', '_centeredSlides', '_centeredSlidesBounds', '_slidesOffsetBefore', '_slidesOffsetAfter', 'normalizeSlideIndex', '_centerInsufficientSlides', '_watchOverflow', 'roundLengths', 'touchRatio', 'touchAngle', 'simulateTouch', '_shortSwipes', '_longSwipes', 'longSwipesRatio', 'longSwipesMs', '_followFinger', 'allowTouchMove', '_threshold', 'touchMoveStopPropagation', 'touchStartPreventDefault', 'touchStartForcePreventDefault', 'touchReleaseOnEdges', 'uniqueNavElements', '_resistance', '_resistanceRatio', '_watchSlidesProgress', '_watchSlidesVisibility', '_grabCursor', 'preventClicks', 'preventClicksPropagation', '_slideToClickedSlide', '_preloadImages', 'updateOnImagesReady', '_loop', '_loopAdditionalSlides', '_loopedSlides', '_loopFillGroupWithBlank', 'loopPreventsSlide', '_allowSlidePrev', '_allowSlideNext', '_swipeHandler', '_noSwiping', 'noSwipingClass', 'noSwipingSelector', 'passiveListeners', 'containerModifierClass', 'slideClass', 'slideBlankClass', 'slideActiveClass', 'slideDuplicateActiveClass', 'slideVisibleClass', 'slideDuplicateClass', 'slideNextClass', 'slideDuplicateNextClass', 'slidePrevClass', 'slideDuplicatePrevClass', 'wrapperClass', 'runCallbacksOnInit', 'observer', 'observeParents', 'observeSlideChildren', // modules
    'a11y', 'autoplay', '_controller', 'coverflowEffect', 'cubeEffect', 'fadeEffect', 'flipEffect', 'hashNavigation', 'history', 'keyboard', 'lazy', 'mousewheel', '_navigation', '_pagination', 'parallax', '_scrollbar', '_thumbs', 'virtual', 'zoom'];

    // eslint-disable-next-line

    function getParams(obj) {
      if (obj === void 0) {
        obj = {};
      }

      var params = {
        on: {}
      };
      var passedParams = {};
      extend$2(params, Swiper.defaults);
      extend$2(params, Swiper.extendedDefaults);
      params._emitClasses = true;
      params.init = false;
      var rest = {};
      var allowedParams = paramsList.map(function (key) {
        return key.replace(/_/, '');
      });
      Object.keys(obj).forEach(function (key) {
        if (allowedParams.indexOf(key) >= 0) {
          if (isObject$2(obj[key])) {
            params[key] = {};
            passedParams[key] = {};
            extend$2(params[key], obj[key]);
            extend$2(passedParams[key], obj[key]);
          } else {
            params[key] = obj[key];
            passedParams[key] = obj[key];
          }
        } else if (key.search(/on[A-Z]/) === 0 && typeof obj[key] === 'function') {
          params.on["" + key[2].toLowerCase() + key.substr(3)] = obj[key];
        } else {
          rest[key] = obj[key];
        }
      });
      ['navigation', 'pagination', 'scrollbar'].forEach(function (key) {
        if (params[key] === true) params[key] = {};
      });
      return {
        params: params,
        passedParams: passedParams,
        rest: rest
      };
    }

    // eslint-disable-next-line

    function initSwiper(swiperParams) {
      return new Swiper(swiperParams);
    }

    function mountSwiper(_ref, swiperParams) {
      var el = _ref.el,
          nextEl = _ref.nextEl,
          prevEl = _ref.prevEl,
          paginationEl = _ref.paginationEl,
          scrollbarEl = _ref.scrollbarEl,
          swiper = _ref.swiper;

      if (needsNavigation(swiperParams) && nextEl && prevEl) {
        swiper.params.navigation.nextEl = nextEl;
        swiper.originalParams.navigation.nextEl = nextEl;
        swiper.params.navigation.prevEl = prevEl;
        swiper.originalParams.navigation.prevEl = prevEl;
      }

      if (needsPagination(swiperParams) && paginationEl) {
        swiper.params.pagination.el = paginationEl;
        swiper.originalParams.pagination.el = paginationEl;
      }

      if (needsScrollbar(swiperParams) && scrollbarEl) {
        swiper.params.scrollbar.el = scrollbarEl;
        swiper.originalParams.scrollbar.el = scrollbarEl;
      }

      swiper.init(el);
    }

    function getChangedParams(swiperParams, oldParams) {
      var keys = [];
      if (!oldParams) return keys;

      var addKey = function addKey(key) {
        if (keys.indexOf(key) < 0) keys.push(key);
      };

      var watchParams = paramsList.filter(function (key) {
        return key[0] === '_';
      }).map(function (key) {
        return key.replace(/_/, '');
      });
      watchParams.forEach(function (key) {
        if (key in swiperParams && key in oldParams) {
          if (isObject$2(swiperParams[key]) && isObject$2(oldParams[key])) {
            var newKeys = Object.keys(swiperParams[key]);
            var oldKeys = Object.keys(oldParams[key]);

            if (newKeys.length !== oldKeys.length) {
              addKey(key);
            } else {
              newKeys.forEach(function (newKey) {
                if (swiperParams[key][newKey] !== oldParams[key][newKey]) {
                  addKey(key);
                }
              });
              oldKeys.forEach(function (oldKey) {
                if (swiperParams[key][oldKey] !== oldParams[key][oldKey]) addKey(key);
              });
            }
          } else if (swiperParams[key] !== oldParams[key]) {
            addKey(key);
          }
        }
      });
      return keys;
    }

    function updateSwiper(swiper, passedParams, changedParams) {
      var updateParams = changedParams.filter(function (key) {
        return key !== 'children' && key !== 'direction';
      });
      var currentParams = swiper.params,
          pagination = swiper.pagination,
          navigation = swiper.navigation,
          scrollbar = swiper.scrollbar,
          thumbs = swiper.thumbs;
      var needThumbsInit;
      var needControllerInit;
      var needPaginationInit;
      var needScrollbarInit;
      var needNavigationInit;

      if (changedParams.includes('thumbs') && passedParams.thumbs && passedParams.thumbs.swiper && currentParams.thumbs && !currentParams.thumbs.swiper) {
        needThumbsInit = true;
      }

      if (changedParams.includes('controller') && passedParams.controller && passedParams.controller.control && currentParams.controller && !currentParams.controller.control) {
        needControllerInit = true;
      }

      if (changedParams.includes('pagination') && passedParams.pagination && passedParams.pagination.el && currentParams.pagination && pagination && !pagination.el) {
        needPaginationInit = true;
      }

      if (changedParams.includes('scrollbar') && passedParams.scrollbar && passedParams.scrollbar.el && currentParams.scrollbar && scrollbar && !scrollbar.el) {
        needScrollbarInit = true;
      }

      if (changedParams.includes('navigation') && passedParams.navigation && passedParams.navigation.prevEl && passedParams.navigation.nextEl && currentParams.navigation && navigation && !navigation.prevEl && !navigation.nextEl) {
        needNavigationInit = true;
      }

      updateParams.forEach(function (key) {
        if (isObject$2(currentParams[key]) && isObject$2(passedParams[key])) {
          extend$2(currentParams[key], passedParams[key]);
        } else {
          currentParams[key] = passedParams[key];
        }
      });

      if (needThumbsInit) {
        var initialized = thumbs.init();

        if (initialized) {
          thumbs.update(true);
        }
      }

      if (needControllerInit) {
        swiper.controller.control = currentParams.controller.control;
      }

      if (needPaginationInit) {
        pagination.init();
        pagination.render();
        pagination.update();
      }

      if (needScrollbarInit) {
        scrollbar.init();
        scrollbar.updateSize();
        scrollbar.setTranslate();
      }

      if (needNavigationInit) {
        navigation.init();
        navigation.update();
      }

      if (changedParams.includes('allowSlideNext')) {
        swiper.allowSlideNext = passedParams.allowSlideNext;
      }

      if (changedParams.includes('allowSlidePrev')) {
        swiper.allowSlidePrev = passedParams.allowSlidePrev;
      }

      if (changedParams.includes('direction')) {
        swiper.changeDirection(passedParams.direction, false);
      }

      swiper.update();
    }

    /* swiper.svelte generated by Svelte v3.31.2 */
    const get_container_end_slot_changes = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_container_end_slot_context = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_wrapper_end_slot_changes = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_wrapper_end_slot_context = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_default_slot_changes = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_default_slot_context = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_wrapper_start_slot_changes = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_wrapper_start_slot_context = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_container_start_slot_changes = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_container_start_slot_context = ctx => ({ virtualData: /*virtualData*/ ctx[9] });

    // (147:2) {#if needsNavigation(swiperParams)}
    function create_if_block_2(ctx) {
    	let div0;
    	let t;
    	let div1;

    	return {
    		c() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr(div0, "class", "swiper-button-prev");
    			attr(div1, "class", "swiper-button-next");
    		},
    		m(target, anchor) {
    			insert(target, div0, anchor);
    			/*div0_binding*/ ctx[13](div0);
    			insert(target, t, anchor);
    			insert(target, div1, anchor);
    			/*div1_binding*/ ctx[14](div1);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(div0);
    			/*div0_binding*/ ctx[13](null);
    			if (detaching) detach(t);
    			if (detaching) detach(div1);
    			/*div1_binding*/ ctx[14](null);
    		}
    	};
    }

    // (151:2) {#if needsScrollbar(swiperParams)}
    function create_if_block_1$1(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "swiper-scrollbar");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			/*div_binding*/ ctx[15](div);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			/*div_binding*/ ctx[15](null);
    		}
    	};
    }

    // (154:2) {#if needsPagination(swiperParams)}
    function create_if_block$4(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "swiper-pagination");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			/*div_binding_1*/ ctx[16](div);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			/*div_binding_1*/ ctx[16](null);
    		}
    	};
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let t0;
    	let show_if_2 = needsNavigation(/*swiperParams*/ ctx[2]);
    	let t1;
    	let show_if_1 = needsScrollbar(/*swiperParams*/ ctx[2]);
    	let t2;
    	let show_if = needsPagination(/*swiperParams*/ ctx[2]);
    	let t3;
    	let div0;
    	let t4;
    	let t5;
    	let t6;
    	let div1_class_value;
    	let current;
    	const container_start_slot_template = /*#slots*/ ctx[12]["container-start"];
    	const container_start_slot = create_slot(container_start_slot_template, ctx, /*$$scope*/ ctx[11], get_container_start_slot_context);
    	let if_block0 = show_if_2 && create_if_block_2(ctx);
    	let if_block1 = show_if_1 && create_if_block_1$1(ctx);
    	let if_block2 = show_if && create_if_block$4(ctx);
    	const wrapper_start_slot_template = /*#slots*/ ctx[12]["wrapper-start"];
    	const wrapper_start_slot = create_slot(wrapper_start_slot_template, ctx, /*$$scope*/ ctx[11], get_wrapper_start_slot_context);
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], get_default_slot_context);
    	const wrapper_end_slot_template = /*#slots*/ ctx[12]["wrapper-end"];
    	const wrapper_end_slot = create_slot(wrapper_end_slot_template, ctx, /*$$scope*/ ctx[11], get_wrapper_end_slot_context);
    	const container_end_slot_template = /*#slots*/ ctx[12]["container-end"];
    	const container_end_slot = create_slot(container_end_slot_template, ctx, /*$$scope*/ ctx[11], get_container_end_slot_context);

    	let div1_levels = [
    		{
    			class: div1_class_value = uniqueClasses(`${/*containerClasses*/ ctx[1]}${/*className*/ ctx[0] ? ` ${/*className*/ ctx[0]}` : ""}`)
    		},
    		/*restProps*/ ctx[3]
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	return {
    		c() {
    			div1 = element("div");
    			if (container_start_slot) container_start_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			div0 = element("div");
    			if (wrapper_start_slot) wrapper_start_slot.c();
    			t4 = space();
    			if (default_slot) default_slot.c();
    			t5 = space();
    			if (wrapper_end_slot) wrapper_end_slot.c();
    			t6 = space();
    			if (container_end_slot) container_end_slot.c();
    			attr(div0, "class", "swiper-wrapper");
    			set_attributes(div1, div1_data);
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);

    			if (container_start_slot) {
    				container_start_slot.m(div1, null);
    			}

    			append(div1, t0);
    			if (if_block0) if_block0.m(div1, null);
    			append(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			append(div1, t2);
    			if (if_block2) if_block2.m(div1, null);
    			append(div1, t3);
    			append(div1, div0);

    			if (wrapper_start_slot) {
    				wrapper_start_slot.m(div0, null);
    			}

    			append(div0, t4);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append(div0, t5);

    			if (wrapper_end_slot) {
    				wrapper_end_slot.m(div0, null);
    			}

    			append(div1, t6);

    			if (container_end_slot) {
    				container_end_slot.m(div1, null);
    			}

    			/*div1_binding_1*/ ctx[17](div1);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (container_start_slot) {
    				if (container_start_slot.p && dirty & /*$$scope, virtualData*/ 2560) {
    					update_slot(container_start_slot, container_start_slot_template, ctx, /*$$scope*/ ctx[11], dirty, get_container_start_slot_changes, get_container_start_slot_context);
    				}
    			}

    			if (dirty & /*swiperParams*/ 4) show_if_2 = needsNavigation(/*swiperParams*/ ctx[2]);

    			if (show_if_2) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*swiperParams*/ 4) show_if_1 = needsScrollbar(/*swiperParams*/ ctx[2]);

    			if (show_if_1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div1, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*swiperParams*/ 4) show_if = needsPagination(/*swiperParams*/ ctx[2]);

    			if (show_if) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$4(ctx);
    					if_block2.c();
    					if_block2.m(div1, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (wrapper_start_slot) {
    				if (wrapper_start_slot.p && dirty & /*$$scope, virtualData*/ 2560) {
    					update_slot(wrapper_start_slot, wrapper_start_slot_template, ctx, /*$$scope*/ ctx[11], dirty, get_wrapper_start_slot_changes, get_wrapper_start_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, virtualData*/ 2560) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}

    			if (wrapper_end_slot) {
    				if (wrapper_end_slot.p && dirty & /*$$scope, virtualData*/ 2560) {
    					update_slot(wrapper_end_slot, wrapper_end_slot_template, ctx, /*$$scope*/ ctx[11], dirty, get_wrapper_end_slot_changes, get_wrapper_end_slot_context);
    				}
    			}

    			if (container_end_slot) {
    				if (container_end_slot.p && dirty & /*$$scope, virtualData*/ 2560) {
    					update_slot(container_end_slot, container_end_slot_template, ctx, /*$$scope*/ ctx[11], dirty, get_container_end_slot_changes, get_container_end_slot_context);
    				}
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				(!current || dirty & /*containerClasses, className*/ 3 && div1_class_value !== (div1_class_value = uniqueClasses(`${/*containerClasses*/ ctx[1]}${/*className*/ ctx[0] ? ` ${/*className*/ ctx[0]}` : ""}`))) && { class: div1_class_value },
    				dirty & /*restProps*/ 8 && /*restProps*/ ctx[3]
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container_start_slot, local);
    			transition_in(wrapper_start_slot, local);
    			transition_in(default_slot, local);
    			transition_in(wrapper_end_slot, local);
    			transition_in(container_end_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container_start_slot, local);
    			transition_out(wrapper_start_slot, local);
    			transition_out(default_slot, local);
    			transition_out(wrapper_end_slot, local);
    			transition_out(container_end_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    			if (container_start_slot) container_start_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (wrapper_start_slot) wrapper_start_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (wrapper_end_slot) wrapper_end_slot.d(detaching);
    			if (container_end_slot) container_end_slot.d(detaching);
    			/*div1_binding_1*/ ctx[17](null);
    		}
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","swiper"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const dispatch = createEventDispatcher();
    	let { class: className = undefined } = $$props;
    	let containerClasses = "swiper-container";
    	let breakpointChanged = false;
    	let swiperInstance = null;
    	let oldPassedParams = null;
    	let paramsData;
    	let swiperParams;
    	let passedParams;
    	let restProps;
    	let swiperEl = null;
    	let prevEl = null;
    	let nextEl = null;
    	let scrollbarEl = null;
    	let paginationEl = null;
    	let virtualData = { slides: [] };

    	function swiper() {
    		return swiperInstance;
    	}

    	const setVirtualData = data => {
    		$$invalidate(9, virtualData = data);

    		tick().then(() => {
    			swiperInstance.$wrapperEl.children(".swiper-slide").each(el => {
    				if (el.onSwiper) el.onSwiper(swiperInstance);
    			});

    			swiperInstance.updateSlides();
    			swiperInstance.updateProgress();
    			swiperInstance.updateSlidesClasses();

    			if (swiperInstance.lazy && swiperInstance.params.lazy.enabled) {
    				swiperInstance.lazy.load();
    			}
    		});
    	};

    	const calcParams = () => {
    		paramsData = getParams($$restProps);
    		$$invalidate(2, swiperParams = paramsData.params);
    		passedParams = paramsData.passedParams;
    		$$invalidate(3, restProps = paramsData.rest);
    	};

    	calcParams();
    	oldPassedParams = passedParams;

    	const onBeforeBreakpoint = () => {
    		breakpointChanged = true;
    	};

    	swiperParams.onAny = (event, ...args) => {
    		dispatch(event, [args]);
    	};

    	Object.assign(swiperParams.on, {
    		_beforeBreakpoint: onBeforeBreakpoint,
    		_containerClasses(_swiper, classes) {
    			$$invalidate(1, containerClasses = classes);
    		}
    	});

    	swiperInstance = initSwiper(swiperParams);

    	if (swiperInstance.virtual && swiperInstance.params.virtual.enabled) {
    		const extendWith = {
    			cache: false,
    			renderExternal: data => {
    				setVirtualData(data);

    				if (swiperParams.virtual && swiperParams.virtual.renderExternal) {
    					swiperParams.virtual.renderExternal(data);
    				}
    			},
    			renderExternalUpdate: false
    		};

    		extend$2(swiperInstance.params.virtual, extendWith);
    		extend$2(swiperInstance.originalParams.virtual, extendWith);
    	}

    	onMount(() => {
    		if (!swiperEl) return;

    		mountSwiper(
    			{
    				el: swiperEl,
    				nextEl,
    				prevEl,
    				paginationEl,
    				scrollbarEl,
    				swiper: swiperInstance
    			},
    			swiperParams
    		);

    		dispatch("swiper", [swiperInstance]);
    		if (swiperParams.virtual) return;

    		swiperInstance.slides.each(el => {
    			if (el.onSwiper) el.onSwiper(swiperInstance);
    		});
    	});

    	afterUpdate(() => {
    		if (!swiperInstance) return;
    		calcParams();
    		const changedParams = getChangedParams(passedParams, oldPassedParams);

    		if ((changedParams.length || breakpointChanged) && swiperInstance && !swiperInstance.destroyed) {
    			updateSwiper(swiperInstance, passedParams, changedParams);
    		}

    		breakpointChanged = false;
    		oldPassedParams = passedParams;
    	});

    	onDestroy(() => {
    		if (swiperInstance && !swiperInstance.destroyed) {
    			swiperInstance.destroy(true, false);
    		}
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			prevEl = $$value;
    			$$invalidate(5, prevEl);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			nextEl = $$value;
    			$$invalidate(6, nextEl);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			scrollbarEl = $$value;
    			$$invalidate(7, scrollbarEl);
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			paginationEl = $$value;
    			$$invalidate(8, paginationEl);
    		});
    	}

    	function div1_binding_1($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			swiperEl = $$value;
    			$$invalidate(4, swiperEl);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(27, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	return [
    		className,
    		containerClasses,
    		swiperParams,
    		restProps,
    		swiperEl,
    		prevEl,
    		nextEl,
    		scrollbarEl,
    		paginationEl,
    		virtualData,
    		swiper,
    		$$scope,
    		slots,
    		div0_binding,
    		div1_binding,
    		div_binding,
    		div_binding_1,
    		div1_binding_1
    	];
    }

    class Swiper$1 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { class: 0, swiper: 10 });
    	}

    	get swiper() {
    		return this.$$.ctx[10];
    	}
    }

    /* swiper.svelte generated by Svelte v3.31.2 */
    const get_default_slot_changes_1 = dirty => ({ data: dirty & /*slideData*/ 32 });
    const get_default_slot_context_1 = ctx => ({ data: /*slideData*/ ctx[5] });
    const get_default_slot_changes$1 = dirty => ({ data: dirty & /*slideData*/ 32 });
    const get_default_slot_context$1 = ctx => ({ data: /*slideData*/ ctx[5] });

    // (92:2) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context_1);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, slideData*/ 160) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, get_default_slot_changes_1, get_default_slot_context_1);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (85:2) {#if zoom}
    function create_if_block$5(ctx) {
    	let div;
    	let div_data_swiper_zoom_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$1);

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr(div, "class", "swiper-zoom-container");

    			attr(div, "data-swiper-zoom", div_data_swiper_zoom_value = typeof /*zoom*/ ctx[0] === "number"
    			? /*zoom*/ ctx[0]
    			: undefined);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, slideData*/ 160) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$1, get_default_slot_context$1);
    				}
    			}

    			if (!current || dirty & /*zoom*/ 1 && div_data_swiper_zoom_value !== (div_data_swiper_zoom_value = typeof /*zoom*/ ctx[0] === "number"
    			? /*zoom*/ ctx[0]
    			: undefined)) {
    				attr(div, "data-swiper-zoom", div_data_swiper_zoom_value);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function create_fragment$7(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_class_value;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*zoom*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let div_levels = [
    		{
    			class: div_class_value = uniqueClasses(`${/*slideClasses*/ ctx[3]}${/*className*/ ctx[2] ? ` ${/*className*/ ctx[2]}` : ""}`)
    		},
    		{
    			"data-swiper-slide-index": /*virtualIndex*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[6]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if_block.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			/*div_binding*/ ctx[9](div);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*slideClasses, className*/ 12 && div_class_value !== (div_class_value = uniqueClasses(`${/*slideClasses*/ ctx[3]}${/*className*/ ctx[2] ? ` ${/*className*/ ctx[2]}` : ""}`))) && { class: div_class_value },
    				(!current || dirty & /*virtualIndex*/ 2) && {
    					"data-swiper-slide-index": /*virtualIndex*/ ctx[1]
    				},
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if_blocks[current_block_type_index].d();
    			/*div_binding*/ ctx[9](null);
    		}
    	};
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let slideData;
    	const omit_props_names = ["zoom","virtualIndex","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { zoom = undefined } = $$props;
    	let { virtualIndex = undefined } = $$props;
    	let { class: className = undefined } = $$props;
    	let slideEl = null;
    	let slideClasses = "swiper-slide";
    	let swiper = null;
    	let eventAttached = false;

    	const updateClasses = (_, el, classNames) => {
    		if (el === slideEl) {
    			$$invalidate(3, slideClasses = classNames);
    		}
    	};

    	const attachEvent = () => {
    		if (!swiper || eventAttached) return;
    		swiper.on("_slideClass", updateClasses);
    		eventAttached = true;
    	};

    	const detachEvent = () => {
    		if (!swiper) return;
    		swiper.off("_slideClass", updateClasses);
    		eventAttached = false;
    	};

    	onMount(() => {
    		if (typeof virtualIndex === "undefined") return;

    		$$invalidate(
    			4,
    			slideEl.onSwiper = _swiper => {
    				swiper = _swiper;
    				attachEvent();
    			},
    			slideEl
    		);

    		attachEvent();
    	});

    	afterUpdate(() => {
    		if (!slideEl || !swiper) return;

    		if (swiper.destroyed) {
    			if (slideClasses !== "swiper-slide") {
    				$$invalidate(3, slideClasses = "swiper-slide");
    			}

    			return;
    		}

    		attachEvent();
    	});

    	beforeUpdate(() => {
    		attachEvent();
    	});

    	onDestroy(() => {
    		if (!swiper) return;
    		detachEvent();
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			slideEl = $$value;
    			$$invalidate(4, slideEl);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("zoom" in $$new_props) $$invalidate(0, zoom = $$new_props.zoom);
    		if ("virtualIndex" in $$new_props) $$invalidate(1, virtualIndex = $$new_props.virtualIndex);
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*slideClasses*/ 8) {
    			$$invalidate(5, slideData = {
    				isActive: slideClasses.indexOf("swiper-slide-active") >= 0 || slideClasses.indexOf("swiper-slide-duplicate-active") >= 0,
    				isVisible: slideClasses.indexOf("swiper-slide-visible") >= 0,
    				isDuplicate: slideClasses.indexOf("swiper-slide-duplicate") >= 0,
    				isPrev: slideClasses.indexOf("swiper-slide-prev") >= 0 || slideClasses.indexOf("swiper-slide-duplicate-prev") >= 0,
    				isNext: slideClasses.indexOf("swiper-slide-next") >= 0 || slideClasses.indexOf("swiper-slide-duplicate-next") >= 0
    			});
    		}
    	};

    	return [
    		zoom,
    		virtualIndex,
    		className,
    		slideClasses,
    		slideEl,
    		slideData,
    		$$restProps,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Swiper$2 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { zoom: 0, virtualIndex: 1, class: 2 });
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

    var internal = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', { value: true });

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
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
    function not_equal(a, b) {
        return a != a ? b == b : a !== b;
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
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
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
    function update_slot_spread(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_spread_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_spread_changes_fn(dirty) | get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function once(fn) {
        let ran = false;
        return function (...args) {
            if (ran)
                return;
            ran = true;
            fn.call(this, ...args);
        };
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }
    const has_prop = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    exports.now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    exports.raf = is_client ? cb => requestAnimationFrame(cb) : noop;
    // used internally for testing
    function set_now(fn) {
        exports.now = fn;
    }
    function set_raf(fn) {
        exports.raf = fn;
    }

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            exports.raf(run_tasks);
    }
    /**
     * For testing purposes only!
     */
    function clear_loops() {
        tasks.clear();
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            exports.raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function element_is(name, is) {
        return document.createElement(name, { is });
    }
    function object_without_properties(obj, exclude) {
        const target = {};
        for (const k in obj) {
            if (has_prop(obj, k)
                // @ts-ignore
                && exclude.indexOf(k) === -1) {
                // @ts-ignore
                target[k] = obj[k];
            }
        }
        return target;
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function xlink_attr(node, attribute, value) {
        node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function time_ranges_to_array(ranges) {
        const array = [];
        for (let i = 0; i < ranges.length; i += 1) {
            array.push({ start: ranges.start(i), end: ranges.end(i) });
        }
        return array;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                const remove = [];
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j++];
                    if (!attributes[attribute.name]) {
                        remove.push(attribute.name);
                    }
                }
                for (let k = 0; k < remove.length; k++) {
                    node.removeAttribute(remove[k]);
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function claim_space(nodes) {
        return claim_text(nodes, ' ');
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_input_type(input, type) {
        try {
            input.type = type;
        }
        catch (e) {
            // do nothing
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    function query_selector_all(selector, parent = document.body) {
        return Array.from(parent.querySelectorAll(selector));
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }
    function attribute_to_object(attributes) {
        const result = {};
        for (const attribute of attributes) {
            result[attribute.name] = attribute.value;
        }
        return result;
    }
    function get_custom_elements_slots(element) {
        const result = {};
        element.childNodes.forEach((node) => {
            result[node.slot || 'default'] = true;
        });
        return result;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        exports.raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = exports.now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    function set_current_component(component) {
        exports.current_component = component;
    }
    function get_current_component() {
        if (!exports.current_component)
            throw new Error('Function called outside component initialization');
        return exports.current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const intros = { enabled: false };
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = exports.now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = exports.now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: exports.now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : commonjsGlobal);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_destroy_block(block, lookup) {
        block.f();
        destroy_block(block, lookup);
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    // source: https://html.spec.whatwg.org/multipage/indices.html
    const boolean_attributes = new Set([
        'allowfullscreen',
        'allowpaymentrequest',
        'async',
        'autofocus',
        'autoplay',
        'checked',
        'controls',
        'default',
        'defer',
        'disabled',
        'formnovalidate',
        'hidden',
        'ismap',
        'loop',
        'multiple',
        'muted',
        'nomodule',
        'novalidate',
        'open',
        'playsinline',
        'readonly',
        'required',
        'reversed',
        'selected'
    ]);

    const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
    // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
    // https://infra.spec.whatwg.org/#noncharacter
    function spread(args, classes_to_add) {
        const attributes = Object.assign({}, ...args);
        if (classes_to_add) {
            if (attributes.class == null) {
                attributes.class = classes_to_add;
            }
            else {
                attributes.class += ' ' + classes_to_add;
            }
        }
        let str = '';
        Object.keys(attributes).forEach(name => {
            if (invalid_attribute_name_character.test(name))
                return;
            const value = attributes[name];
            if (value === true)
                str += ' ' + name;
            else if (boolean_attributes.has(name.toLowerCase())) {
                if (value)
                    str += ' ' + name;
            }
            else if (value != null) {
                str += ` ${name}="${String(value).replace(/"/g, '&#34;').replace(/'/g, '&#39;')}"`;
            }
        });
        return str;
    }
    const escaped = {
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    function escape(html) {
        return String(html).replace(/["'&<>]/g, match => escaped[match]);
    }
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
    }
    const missing_component = {
        $$render: () => ''
    };
    function validate_component(component, name) {
        if (!component || !component.$$render) {
            if (name === 'svelte:component')
                name += ' this={...}';
            throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
        }
        return component;
    }
    function debug(file, line, column, values) {
        console.log(`{@debug} ${file ? file + ' ' : ''}(${line}:${column})`); // eslint-disable-line no-console
        console.log(values); // eslint-disable-line no-console
        return '';
    }
    let on_destroy;
    function create_ssr_component(fn) {
        function $$render(result, props, bindings, slots) {
            const parent_component = exports.current_component;
            const $$ = {
                on_destroy,
                context: new Map(parent_component ? parent_component.$$.context : []),
                // these will be immediately discarded
                on_mount: [],
                before_update: [],
                after_update: [],
                callbacks: blank_object()
            };
            set_current_component({ $$ });
            const html = fn(result, props, bindings, slots);
            set_current_component(parent_component);
            return html;
        }
        return {
            render: (props = {}, options = {}) => {
                on_destroy = [];
                const result = { title: '', head: '', css: new Set() };
                const html = $$render(result, props, {}, options);
                run_all(on_destroy);
                return {
                    html,
                    css: {
                        code: Array.from(result.css).map(css => css.code).join('\n'),
                        map: null // TODO
                    },
                    head: result.title + result.head
                };
            },
            $$render
        };
    }
    function add_attribute(name, value, boolean) {
        if (value == null || (boolean && !value))
            return '';
        return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
    }
    function add_classes(classes) {
        return classes ? ` class="${classes}"` : '';
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function claim_component(block, parent_nodes) {
        block && block.l(parent_nodes);
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
        const parent_component = exports.current_component;
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
    if (typeof HTMLElement === 'function') {
        exports.SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
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
        };
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
    function detach_between_dev(before, after) {
        while (before.nextSibling && before.nextSibling !== after) {
            detach_dev(before.nextSibling);
        }
    }
    function detach_before_dev(after) {
        while (after.previousSibling) {
            detach_dev(after.previousSibling);
        }
    }
    function detach_after_dev(before) {
        while (before.nextSibling) {
            detach_dev(before.nextSibling);
        }
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function dataset_dev(node, property, value) {
        node.dataset[property] = value;
        dispatch_dev('SvelteDOMSetDataset', { node, property, value });
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
    /**
     * Base class to create strongly typed Svelte components.
     * This only exists for typing purposes and should be used in `.d.ts` files.
     *
     * ### Example:
     *
     * You have component library on npm called `component-library`, from which
     * you export a component called `MyComponent`. For Svelte+TypeScript users,
     * you want to provide typings. Therefore you create a `index.d.ts`:
     * ```ts
     * import { SvelteComponentTyped } from "svelte";
     * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
     * ```
     * Typing this makes it possible for IDEs like VS Code with the Svelte extension
     * to provide intellisense and to use the component like this in a Svelte file
     * with TypeScript:
     * ```svelte
     * <script lang="ts">
     * 	import { MyComponent } from "component-library";
     * </script>
     * <MyComponent foo={'bar'} />
     * ```
     *
     * #### Why not make this part of `SvelteComponent(Dev)`?
     * Because
     * ```ts
     * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
     * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
     * ```
     * will throw a type error, so we need to seperate the more strictly typed class.
     */
    class SvelteComponentTyped extends SvelteComponentDev {
        constructor(options) {
            super(options);
        }
    }
    function loop_guard(timeout) {
        const start = Date.now();
        return () => {
            if (Date.now() - start > timeout) {
                throw new Error('Infinite loop detected');
            }
        };
    }

    exports.HtmlTag = HtmlTag;
    exports.SvelteComponent = SvelteComponent;
    exports.SvelteComponentDev = SvelteComponentDev;
    exports.SvelteComponentTyped = SvelteComponentTyped;
    exports.action_destroyer = action_destroyer;
    exports.add_attribute = add_attribute;
    exports.add_classes = add_classes;
    exports.add_flush_callback = add_flush_callback;
    exports.add_location = add_location;
    exports.add_render_callback = add_render_callback;
    exports.add_resize_listener = add_resize_listener;
    exports.add_transform = add_transform;
    exports.afterUpdate = afterUpdate;
    exports.append = append;
    exports.append_dev = append_dev;
    exports.assign = assign;
    exports.attr = attr;
    exports.attr_dev = attr_dev;
    exports.attribute_to_object = attribute_to_object;
    exports.beforeUpdate = beforeUpdate;
    exports.bind = bind;
    exports.binding_callbacks = binding_callbacks;
    exports.blank_object = blank_object;
    exports.bubble = bubble;
    exports.check_outros = check_outros;
    exports.children = children;
    exports.claim_component = claim_component;
    exports.claim_element = claim_element;
    exports.claim_space = claim_space;
    exports.claim_text = claim_text;
    exports.clear_loops = clear_loops;
    exports.component_subscribe = component_subscribe;
    exports.compute_rest_props = compute_rest_props;
    exports.compute_slots = compute_slots;
    exports.createEventDispatcher = createEventDispatcher;
    exports.create_animation = create_animation;
    exports.create_bidirectional_transition = create_bidirectional_transition;
    exports.create_component = create_component;
    exports.create_in_transition = create_in_transition;
    exports.create_out_transition = create_out_transition;
    exports.create_slot = create_slot;
    exports.create_ssr_component = create_ssr_component;
    exports.custom_event = custom_event;
    exports.dataset_dev = dataset_dev;
    exports.debug = debug;
    exports.destroy_block = destroy_block;
    exports.destroy_component = destroy_component;
    exports.destroy_each = destroy_each;
    exports.detach = detach;
    exports.detach_after_dev = detach_after_dev;
    exports.detach_before_dev = detach_before_dev;
    exports.detach_between_dev = detach_between_dev;
    exports.detach_dev = detach_dev;
    exports.dirty_components = dirty_components;
    exports.dispatch_dev = dispatch_dev;
    exports.each = each;
    exports.element = element;
    exports.element_is = element_is;
    exports.empty = empty;
    exports.escape = escape;
    exports.escaped = escaped;
    exports.exclude_internal_props = exclude_internal_props;
    exports.fix_and_destroy_block = fix_and_destroy_block;
    exports.fix_and_outro_and_destroy_block = fix_and_outro_and_destroy_block;
    exports.fix_position = fix_position;
    exports.flush = flush;
    exports.getContext = getContext;
    exports.get_binding_group_value = get_binding_group_value;
    exports.get_current_component = get_current_component;
    exports.get_custom_elements_slots = get_custom_elements_slots;
    exports.get_slot_changes = get_slot_changes;
    exports.get_slot_context = get_slot_context;
    exports.get_spread_object = get_spread_object;
    exports.get_spread_update = get_spread_update;
    exports.get_store_value = get_store_value;
    exports.globals = globals;
    exports.group_outros = group_outros;
    exports.handle_promise = handle_promise;
    exports.hasContext = hasContext;
    exports.has_prop = has_prop;
    exports.identity = identity;
    exports.init = init;
    exports.insert = insert;
    exports.insert_dev = insert_dev;
    exports.intros = intros;
    exports.invalid_attribute_name_character = invalid_attribute_name_character;
    exports.is_client = is_client;
    exports.is_crossorigin = is_crossorigin;
    exports.is_empty = is_empty;
    exports.is_function = is_function;
    exports.is_promise = is_promise;
    exports.listen = listen;
    exports.listen_dev = listen_dev;
    exports.loop = loop;
    exports.loop_guard = loop_guard;
    exports.missing_component = missing_component;
    exports.mount_component = mount_component;
    exports.noop = noop;
    exports.not_equal = not_equal;
    exports.null_to_empty = null_to_empty;
    exports.object_without_properties = object_without_properties;
    exports.onDestroy = onDestroy;
    exports.onMount = onMount;
    exports.once = once;
    exports.outro_and_destroy_block = outro_and_destroy_block;
    exports.prevent_default = prevent_default;
    exports.prop_dev = prop_dev;
    exports.query_selector_all = query_selector_all;
    exports.run = run;
    exports.run_all = run_all;
    exports.safe_not_equal = safe_not_equal;
    exports.schedule_update = schedule_update;
    exports.select_multiple_value = select_multiple_value;
    exports.select_option = select_option;
    exports.select_options = select_options;
    exports.select_value = select_value;
    exports.self = self;
    exports.setContext = setContext;
    exports.set_attributes = set_attributes;
    exports.set_current_component = set_current_component;
    exports.set_custom_element_data = set_custom_element_data;
    exports.set_data = set_data;
    exports.set_data_dev = set_data_dev;
    exports.set_input_type = set_input_type;
    exports.set_input_value = set_input_value;
    exports.set_now = set_now;
    exports.set_raf = set_raf;
    exports.set_store_value = set_store_value;
    exports.set_style = set_style;
    exports.set_svg_attributes = set_svg_attributes;
    exports.space = space;
    exports.spread = spread;
    exports.stop_propagation = stop_propagation;
    exports.subscribe = subscribe;
    exports.svg_element = svg_element;
    exports.text = text;
    exports.tick = tick;
    exports.time_ranges_to_array = time_ranges_to_array;
    exports.to_number = to_number;
    exports.toggle_class = toggle_class;
    exports.transition_in = transition_in;
    exports.transition_out = transition_out;
    exports.update_keyed_each = update_keyed_each;
    exports.update_slot = update_slot;
    exports.update_slot_spread = update_slot_spread;
    exports.validate_component = validate_component;
    exports.validate_each_argument = validate_each_argument;
    exports.validate_each_keys = validate_each_keys;
    exports.validate_slots = validate_slots;
    exports.validate_store = validate_store;
    exports.xlink_attr = xlink_attr;
    });

    var svelte = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', { value: true });





    Object.defineProperty(exports, 'SvelteComponent', {
    	enumerable: true,
    	get: function () {
    		return internal.SvelteComponentDev;
    	}
    });
    Object.defineProperty(exports, 'SvelteComponentTyped', {
    	enumerable: true,
    	get: function () {
    		return internal.SvelteComponentTyped;
    	}
    });
    Object.defineProperty(exports, 'afterUpdate', {
    	enumerable: true,
    	get: function () {
    		return internal.afterUpdate;
    	}
    });
    Object.defineProperty(exports, 'beforeUpdate', {
    	enumerable: true,
    	get: function () {
    		return internal.beforeUpdate;
    	}
    });
    Object.defineProperty(exports, 'createEventDispatcher', {
    	enumerable: true,
    	get: function () {
    		return internal.createEventDispatcher;
    	}
    });
    Object.defineProperty(exports, 'getContext', {
    	enumerable: true,
    	get: function () {
    		return internal.getContext;
    	}
    });
    Object.defineProperty(exports, 'hasContext', {
    	enumerable: true,
    	get: function () {
    		return internal.hasContext;
    	}
    });
    Object.defineProperty(exports, 'onDestroy', {
    	enumerable: true,
    	get: function () {
    		return internal.onDestroy;
    	}
    });
    Object.defineProperty(exports, 'onMount', {
    	enumerable: true,
    	get: function () {
    		return internal.onMount;
    	}
    });
    Object.defineProperty(exports, 'setContext', {
    	enumerable: true,
    	get: function () {
    		return internal.setContext;
    	}
    });
    Object.defineProperty(exports, 'tick', {
    	enumerable: true,
    	get: function () {
    		return internal.tick;
    	}
    });
    });

    var isObject_1 = isObject$3;
    var extend_1 = extend$3;
    var needsNavigation_1 = needsNavigation$1;
    var needsPagination_1 = needsPagination$1;
    var needsScrollbar_1 = needsScrollbar$1;
    var uniqueClasses_1 = uniqueClasses$1;

    function isObject$3(o) {
      return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
    }

    function extend$3(target, src) {
      var noExtend = ['__proto__', 'constructor', 'prototype'];
      Object.keys(src).filter(function (key) {
        return noExtend.indexOf(key) < 0;
      }).forEach(function (key) {
        if (typeof target[key] === 'undefined') target[key] = src[key];else if (isObject$3(src[key]) && isObject$3(target[key]) && Object.keys(src[key]).length > 0) {
          if (src[key].__swiper__) target[key] = src[key];else extend$3(target[key], src[key]);
        } else {
          target[key] = src[key];
        }
      });
    }

    function needsNavigation$1(params) {
      if (params === void 0) {
        params = {};
      }

      return params.navigation && typeof params.navigation.nextEl === 'undefined' && typeof params.navigation.prevEl === 'undefined';
    }

    function needsPagination$1(params) {
      if (params === void 0) {
        params = {};
      }

      return params.pagination && typeof params.pagination.el === 'undefined';
    }

    function needsScrollbar$1(params) {
      if (params === void 0) {
        params = {};
      }

      return params.scrollbar && typeof params.scrollbar.el === 'undefined';
    }

    function uniqueClasses$1(classNames) {
      if (classNames === void 0) {
        classNames = '';
      }

      var classes = classNames.split(' ').map(function (c) {
        return c.trim();
      }).filter(function (c) {
        return !!c;
      });
      var unique = [];
      classes.forEach(function (c) {
        if (unique.indexOf(c) < 0) unique.push(c);
      });
      return unique.join(' ');
    }

    var utils = /*#__PURE__*/Object.defineProperty({
    	isObject: isObject_1,
    	extend: extend_1,
    	needsNavigation: needsNavigation_1,
    	needsPagination: needsPagination_1,
    	needsScrollbar: needsScrollbar_1,
    	uniqueClasses: uniqueClasses_1
    }, '__esModule', {value: true});

    var paramsList_1 = createCommonjsModule(function (module, exports) {

    exports.__esModule = true;
    exports.paramsList = void 0;

    /* underscore in name -> watch for changes */
    var paramsList = ['init', '_direction', 'touchEventsTarget', 'initialSlide', '_speed', 'cssMode', 'updateOnWindowResize', 'resizeObserver', 'nested', '_width', '_height', 'preventInteractionOnTransition', 'userAgent', 'url', '_edgeSwipeDetection', '_edgeSwipeThreshold', '_freeMode', '_freeModeMomentum', '_freeModeMomentumRatio', '_freeModeMomentumBounce', '_freeModeMomentumBounceRatio', '_freeModeMomentumVelocityRatio', '_freeModeSticky', '_freeModeMinimumVelocity', '_autoHeight', 'setWrapperSize', 'virtualTranslate', '_effect', 'breakpoints', '_spaceBetween', '_slidesPerView', '_slidesPerColumn', '_slidesPerColumnFill', '_slidesPerGroup', '_slidesPerGroupSkip', '_centeredSlides', '_centeredSlidesBounds', '_slidesOffsetBefore', '_slidesOffsetAfter', 'normalizeSlideIndex', '_centerInsufficientSlides', '_watchOverflow', 'roundLengths', 'touchRatio', 'touchAngle', 'simulateTouch', '_shortSwipes', '_longSwipes', 'longSwipesRatio', 'longSwipesMs', '_followFinger', 'allowTouchMove', '_threshold', 'touchMoveStopPropagation', 'touchStartPreventDefault', 'touchStartForcePreventDefault', 'touchReleaseOnEdges', 'uniqueNavElements', '_resistance', '_resistanceRatio', '_watchSlidesProgress', '_watchSlidesVisibility', '_grabCursor', 'preventClicks', 'preventClicksPropagation', '_slideToClickedSlide', '_preloadImages', 'updateOnImagesReady', '_loop', '_loopAdditionalSlides', '_loopedSlides', '_loopFillGroupWithBlank', 'loopPreventsSlide', '_allowSlidePrev', '_allowSlideNext', '_swipeHandler', '_noSwiping', 'noSwipingClass', 'noSwipingSelector', 'passiveListeners', 'containerModifierClass', 'slideClass', 'slideBlankClass', 'slideActiveClass', 'slideDuplicateActiveClass', 'slideVisibleClass', 'slideDuplicateClass', 'slideNextClass', 'slideDuplicateNextClass', 'slidePrevClass', 'slideDuplicatePrevClass', 'wrapperClass', 'runCallbacksOnInit', 'observer', 'observeParents', 'observeSlideChildren', // modules
    'a11y', 'autoplay', '_controller', 'coverflowEffect', 'cubeEffect', 'fadeEffect', 'flipEffect', 'hashNavigation', 'history', 'keyboard', 'lazy', 'mousewheel', '_navigation', '_pagination', 'parallax', '_scrollbar', '_thumbs', 'virtual', 'zoom'];
    exports.paramsList = paramsList;
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(swiper_esm);

    var getParams_2 = getParams$1;

    var _core = _interopRequireDefault(require$$0);





    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    // eslint-disable-next-line
    function getParams$1(obj) {
      if (obj === void 0) {
        obj = {};
      }

      var params = {
        on: {}
      };
      var passedParams = {};
      (0, utils.extend)(params, _core.default.defaults);
      (0, utils.extend)(params, _core.default.extendedDefaults);
      params._emitClasses = true;
      params.init = false;
      var rest = {};

      var allowedParams = paramsList_1.paramsList.map(function (key) {
        return key.replace(/_/, '');
      });

      Object.keys(obj).forEach(function (key) {
        if (allowedParams.indexOf(key) >= 0) {
          if ((0, utils.isObject)(obj[key])) {
            params[key] = {};
            passedParams[key] = {};
            (0, utils.extend)(params[key], obj[key]);
            (0, utils.extend)(passedParams[key], obj[key]);
          } else {
            params[key] = obj[key];
            passedParams[key] = obj[key];
          }
        } else if (key.search(/on[A-Z]/) === 0 && typeof obj[key] === 'function') {
          params.on["" + key[2].toLowerCase() + key.substr(3)] = obj[key];
        } else {
          rest[key] = obj[key];
        }
      });
      ['navigation', 'pagination', 'scrollbar'].forEach(function (key) {
        if (params[key] === true) params[key] = {};
      });
      return {
        params: params,
        passedParams: passedParams,
        rest: rest
      };
    }

    var getParams_1 = /*#__PURE__*/Object.defineProperty({
    	getParams: getParams_2
    }, '__esModule', {value: true});

    var initSwiper_2 = initSwiper$1;
    var mountSwiper_1 = mountSwiper$1;

    var _core$1 = _interopRequireDefault$1(require$$0);



    function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    // eslint-disable-next-line
    function initSwiper$1(swiperParams) {
      return new _core$1.default(swiperParams);
    }

    function mountSwiper$1(_ref, swiperParams) {
      var el = _ref.el,
          nextEl = _ref.nextEl,
          prevEl = _ref.prevEl,
          paginationEl = _ref.paginationEl,
          scrollbarEl = _ref.scrollbarEl,
          swiper = _ref.swiper;

      if ((0, utils.needsNavigation)(swiperParams) && nextEl && prevEl) {
        swiper.params.navigation.nextEl = nextEl;
        swiper.originalParams.navigation.nextEl = nextEl;
        swiper.params.navigation.prevEl = prevEl;
        swiper.originalParams.navigation.prevEl = prevEl;
      }

      if ((0, utils.needsPagination)(swiperParams) && paginationEl) {
        swiper.params.pagination.el = paginationEl;
        swiper.originalParams.pagination.el = paginationEl;
      }

      if ((0, utils.needsScrollbar)(swiperParams) && scrollbarEl) {
        swiper.params.scrollbar.el = scrollbarEl;
        swiper.originalParams.scrollbar.el = scrollbarEl;
      }

      swiper.init(el);
    }

    var initSwiper_1 = /*#__PURE__*/Object.defineProperty({
    	initSwiper: initSwiper_2,
    	mountSwiper: mountSwiper_1
    }, '__esModule', {value: true});

    var getChangedParams_2 = getChangedParams$1;





    function getChangedParams$1(swiperParams, oldParams) {
      var keys = [];
      if (!oldParams) return keys;

      var addKey = function addKey(key) {
        if (keys.indexOf(key) < 0) keys.push(key);
      };

      var watchParams = paramsList_1.paramsList.filter(function (key) {
        return key[0] === '_';
      }).map(function (key) {
        return key.replace(/_/, '');
      });

      watchParams.forEach(function (key) {
        if (key in swiperParams && key in oldParams) {
          if ((0, utils.isObject)(swiperParams[key]) && (0, utils.isObject)(oldParams[key])) {
            var newKeys = Object.keys(swiperParams[key]);
            var oldKeys = Object.keys(oldParams[key]);

            if (newKeys.length !== oldKeys.length) {
              addKey(key);
            } else {
              newKeys.forEach(function (newKey) {
                if (swiperParams[key][newKey] !== oldParams[key][newKey]) {
                  addKey(key);
                }
              });
              oldKeys.forEach(function (oldKey) {
                if (swiperParams[key][oldKey] !== oldParams[key][oldKey]) addKey(key);
              });
            }
          } else if (swiperParams[key] !== oldParams[key]) {
            addKey(key);
          }
        }
      });
      return keys;
    }

    var getChangedParams_1 = /*#__PURE__*/Object.defineProperty({
    	getChangedParams: getChangedParams_2
    }, '__esModule', {value: true});

    var updateSwiper_2 = updateSwiper$1;



    function updateSwiper$1(swiper, passedParams, changedParams) {
      var updateParams = changedParams.filter(function (key) {
        return key !== 'children' && key !== 'direction';
      });
      var currentParams = swiper.params,
          pagination = swiper.pagination,
          navigation = swiper.navigation,
          scrollbar = swiper.scrollbar,
          thumbs = swiper.thumbs;
      var needThumbsInit;
      var needControllerInit;
      var needPaginationInit;
      var needScrollbarInit;
      var needNavigationInit;

      if (changedParams.includes('thumbs') && passedParams.thumbs && passedParams.thumbs.swiper && currentParams.thumbs && !currentParams.thumbs.swiper) {
        needThumbsInit = true;
      }

      if (changedParams.includes('controller') && passedParams.controller && passedParams.controller.control && currentParams.controller && !currentParams.controller.control) {
        needControllerInit = true;
      }

      if (changedParams.includes('pagination') && passedParams.pagination && passedParams.pagination.el && currentParams.pagination && pagination && !pagination.el) {
        needPaginationInit = true;
      }

      if (changedParams.includes('scrollbar') && passedParams.scrollbar && passedParams.scrollbar.el && currentParams.scrollbar && scrollbar && !scrollbar.el) {
        needScrollbarInit = true;
      }

      if (changedParams.includes('navigation') && passedParams.navigation && passedParams.navigation.prevEl && passedParams.navigation.nextEl && currentParams.navigation && navigation && !navigation.prevEl && !navigation.nextEl) {
        needNavigationInit = true;
      }

      updateParams.forEach(function (key) {
        if ((0, utils.isObject)(currentParams[key]) && (0, utils.isObject)(passedParams[key])) {
          (0, utils.extend)(currentParams[key], passedParams[key]);
        } else {
          currentParams[key] = passedParams[key];
        }
      });

      if (needThumbsInit) {
        var initialized = thumbs.init();

        if (initialized) {
          thumbs.update(true);
        }
      }

      if (needControllerInit) {
        swiper.controller.control = currentParams.controller.control;
      }

      if (needPaginationInit) {
        pagination.init();
        pagination.render();
        pagination.update();
      }

      if (needScrollbarInit) {
        scrollbar.init();
        scrollbar.updateSize();
        scrollbar.setTranslate();
      }

      if (needNavigationInit) {
        navigation.init();
        navigation.update();
      }

      if (changedParams.includes('allowSlideNext')) {
        swiper.allowSlideNext = passedParams.allowSlideNext;
      }

      if (changedParams.includes('allowSlidePrev')) {
        swiper.allowSlidePrev = passedParams.allowSlidePrev;
      }

      if (changedParams.includes('direction')) {
        swiper.changeDirection(passedParams.direction, false);
      }

      swiper.update();
    }

    var updateSwiper_1 = /*#__PURE__*/Object.defineProperty({
    	updateSwiper: updateSwiper_2
    }, '__esModule', {value: true});

    /* swiper.svelte generated by Svelte v3.31.2 */

    const { SvelteComponent: SvelteComponent$1, append: append$2, assign: assign$1, attr: attr$2, binding_callbacks: binding_callbacks$1, compute_rest_props: compute_rest_props$1, create_slot: create_slot$1, detach: detach$1, element: element$1, exclude_internal_props: exclude_internal_props$1, get_spread_update: get_spread_update$1, init: init$1, insert: insert$1, noop: noop$1, safe_not_equal: safe_not_equal$1, set_attributes: set_attributes$1, space: space$1, transition_in: transition_in$1, transition_out: transition_out$1, update_slot: update_slot$1 } = internal;
    const { onMount: onMount$1, onDestroy: onDestroy$1, afterUpdate: afterUpdate$1, createEventDispatcher: createEventDispatcher$1, tick: tick$1, beforeUpdate: beforeUpdate$1 } = svelte;
    const { getParams: getParams$2 } = getParams_1;
    const { initSwiper: initSwiper$2, mountSwiper: mountSwiper$2 } = initSwiper_1;
    const { needsScrollbar: needsScrollbar$2, needsNavigation: needsNavigation$2, needsPagination: needsPagination$2, uniqueClasses: uniqueClasses$2, extend: extend$4 } = utils;
    const { getChangedParams: getChangedParams$2 } = getChangedParams_1;
    const { updateSwiper: updateSwiper$2 } = updateSwiper_1;
    const get_container_end_slot_changes$1 = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_container_end_slot_context$1 = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_wrapper_end_slot_changes$1 = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_wrapper_end_slot_context$1 = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_default_slot_changes$2 = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_default_slot_context$2 = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_wrapper_start_slot_changes$1 = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_wrapper_start_slot_context$1 = ctx => ({ virtualData: /*virtualData*/ ctx[9] });
    const get_container_start_slot_changes$1 = dirty => ({ virtualData: dirty & /*virtualData*/ 512 });
    const get_container_start_slot_context$1 = ctx => ({ virtualData: /*virtualData*/ ctx[9] });

    // (147:2) {#if needsNavigation(swiperParams)}
    function create_if_block_2$1(ctx) {
    	let div0;
    	let t;
    	let div1;

    	return {
    		c() {
    			div0 = element$1("div");
    			t = space$1();
    			div1 = element$1("div");
    			attr$2(div0, "class", "swiper-button-prev");
    			attr$2(div1, "class", "swiper-button-next");
    		},
    		m(target, anchor) {
    			insert$1(target, div0, anchor);
    			/*div0_binding*/ ctx[13](div0);
    			insert$1(target, t, anchor);
    			insert$1(target, div1, anchor);
    			/*div1_binding*/ ctx[14](div1);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach$1(div0);
    			/*div0_binding*/ ctx[13](null);
    			if (detaching) detach$1(t);
    			if (detaching) detach$1(div1);
    			/*div1_binding*/ ctx[14](null);
    		}
    	};
    }

    // (151:2) {#if needsScrollbar(swiperParams)}
    function create_if_block_1$2(ctx) {
    	let div;

    	return {
    		c() {
    			div = element$1("div");
    			attr$2(div, "class", "swiper-scrollbar");
    		},
    		m(target, anchor) {
    			insert$1(target, div, anchor);
    			/*div_binding*/ ctx[15](div);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach$1(div);
    			/*div_binding*/ ctx[15](null);
    		}
    	};
    }

    // (154:2) {#if needsPagination(swiperParams)}
    function create_if_block$6(ctx) {
    	let div;

    	return {
    		c() {
    			div = element$1("div");
    			attr$2(div, "class", "swiper-pagination");
    		},
    		m(target, anchor) {
    			insert$1(target, div, anchor);
    			/*div_binding_1*/ ctx[16](div);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach$1(div);
    			/*div_binding_1*/ ctx[16](null);
    		}
    	};
    }

    function create_fragment$8(ctx) {
    	let div1;
    	let t0;
    	let show_if_2 = needsNavigation$2(/*swiperParams*/ ctx[2]);
    	let t1;
    	let show_if_1 = needsScrollbar$2(/*swiperParams*/ ctx[2]);
    	let t2;
    	let show_if = needsPagination$2(/*swiperParams*/ ctx[2]);
    	let t3;
    	let div0;
    	let t4;
    	let t5;
    	let t6;
    	let div1_class_value;
    	let current;
    	const container_start_slot_template = /*#slots*/ ctx[12]["container-start"];
    	const container_start_slot = create_slot$1(container_start_slot_template, ctx, /*$$scope*/ ctx[11], get_container_start_slot_context$1);
    	let if_block0 = show_if_2 && create_if_block_2$1(ctx);
    	let if_block1 = show_if_1 && create_if_block_1$2(ctx);
    	let if_block2 = show_if && create_if_block$6(ctx);
    	const wrapper_start_slot_template = /*#slots*/ ctx[12]["wrapper-start"];
    	const wrapper_start_slot = create_slot$1(wrapper_start_slot_template, ctx, /*$$scope*/ ctx[11], get_wrapper_start_slot_context$1);
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot$1(default_slot_template, ctx, /*$$scope*/ ctx[11], get_default_slot_context$2);
    	const wrapper_end_slot_template = /*#slots*/ ctx[12]["wrapper-end"];
    	const wrapper_end_slot = create_slot$1(wrapper_end_slot_template, ctx, /*$$scope*/ ctx[11], get_wrapper_end_slot_context$1);
    	const container_end_slot_template = /*#slots*/ ctx[12]["container-end"];
    	const container_end_slot = create_slot$1(container_end_slot_template, ctx, /*$$scope*/ ctx[11], get_container_end_slot_context$1);

    	let div1_levels = [
    		{
    			class: div1_class_value = uniqueClasses$2(`${/*containerClasses*/ ctx[1]}${/*className*/ ctx[0] ? ` ${/*className*/ ctx[0]}` : ""}`)
    		},
    		/*restProps*/ ctx[3]
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign$1(div1_data, div1_levels[i]);
    	}

    	return {
    		c() {
    			div1 = element$1("div");
    			if (container_start_slot) container_start_slot.c();
    			t0 = space$1();
    			if (if_block0) if_block0.c();
    			t1 = space$1();
    			if (if_block1) if_block1.c();
    			t2 = space$1();
    			if (if_block2) if_block2.c();
    			t3 = space$1();
    			div0 = element$1("div");
    			if (wrapper_start_slot) wrapper_start_slot.c();
    			t4 = space$1();
    			if (default_slot) default_slot.c();
    			t5 = space$1();
    			if (wrapper_end_slot) wrapper_end_slot.c();
    			t6 = space$1();
    			if (container_end_slot) container_end_slot.c();
    			attr$2(div0, "class", "swiper-wrapper");
    			set_attributes$1(div1, div1_data);
    		},
    		m(target, anchor) {
    			insert$1(target, div1, anchor);

    			if (container_start_slot) {
    				container_start_slot.m(div1, null);
    			}

    			append$2(div1, t0);
    			if (if_block0) if_block0.m(div1, null);
    			append$2(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			append$2(div1, t2);
    			if (if_block2) if_block2.m(div1, null);
    			append$2(div1, t3);
    			append$2(div1, div0);

    			if (wrapper_start_slot) {
    				wrapper_start_slot.m(div0, null);
    			}

    			append$2(div0, t4);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append$2(div0, t5);

    			if (wrapper_end_slot) {
    				wrapper_end_slot.m(div0, null);
    			}

    			append$2(div1, t6);

    			if (container_end_slot) {
    				container_end_slot.m(div1, null);
    			}

    			/*div1_binding_1*/ ctx[17](div1);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (container_start_slot) {
    				if (container_start_slot.p && dirty & /*$$scope, virtualData*/ 2560) {
    					update_slot$1(container_start_slot, container_start_slot_template, ctx, /*$$scope*/ ctx[11], dirty, get_container_start_slot_changes$1, get_container_start_slot_context$1);
    				}
    			}

    			if (dirty & /*swiperParams*/ 4) show_if_2 = needsNavigation$2(/*swiperParams*/ ctx[2]);

    			if (show_if_2) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*swiperParams*/ 4) show_if_1 = needsScrollbar$2(/*swiperParams*/ ctx[2]);

    			if (show_if_1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(div1, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*swiperParams*/ 4) show_if = needsPagination$2(/*swiperParams*/ ctx[2]);

    			if (show_if) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$6(ctx);
    					if_block2.c();
    					if_block2.m(div1, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (wrapper_start_slot) {
    				if (wrapper_start_slot.p && dirty & /*$$scope, virtualData*/ 2560) {
    					update_slot$1(wrapper_start_slot, wrapper_start_slot_template, ctx, /*$$scope*/ ctx[11], dirty, get_wrapper_start_slot_changes$1, get_wrapper_start_slot_context$1);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, virtualData*/ 2560) {
    					update_slot$1(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[11], dirty, get_default_slot_changes$2, get_default_slot_context$2);
    				}
    			}

    			if (wrapper_end_slot) {
    				if (wrapper_end_slot.p && dirty & /*$$scope, virtualData*/ 2560) {
    					update_slot$1(wrapper_end_slot, wrapper_end_slot_template, ctx, /*$$scope*/ ctx[11], dirty, get_wrapper_end_slot_changes$1, get_wrapper_end_slot_context$1);
    				}
    			}

    			if (container_end_slot) {
    				if (container_end_slot.p && dirty & /*$$scope, virtualData*/ 2560) {
    					update_slot$1(container_end_slot, container_end_slot_template, ctx, /*$$scope*/ ctx[11], dirty, get_container_end_slot_changes$1, get_container_end_slot_context$1);
    				}
    			}

    			set_attributes$1(div1, div1_data = get_spread_update$1(div1_levels, [
    				(!current || dirty & /*containerClasses, className*/ 3 && div1_class_value !== (div1_class_value = uniqueClasses$2(`${/*containerClasses*/ ctx[1]}${/*className*/ ctx[0] ? ` ${/*className*/ ctx[0]}` : ""}`))) && { class: div1_class_value },
    				dirty & /*restProps*/ 8 && /*restProps*/ ctx[3]
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in$1(container_start_slot, local);
    			transition_in$1(wrapper_start_slot, local);
    			transition_in$1(default_slot, local);
    			transition_in$1(wrapper_end_slot, local);
    			transition_in$1(container_end_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out$1(container_start_slot, local);
    			transition_out$1(wrapper_start_slot, local);
    			transition_out$1(default_slot, local);
    			transition_out$1(wrapper_end_slot, local);
    			transition_out$1(container_end_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach$1(div1);
    			if (container_start_slot) container_start_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (wrapper_start_slot) wrapper_start_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (wrapper_end_slot) wrapper_end_slot.d(detaching);
    			if (container_end_slot) container_end_slot.d(detaching);
    			/*div1_binding_1*/ ctx[17](null);
    		}
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","swiper"];
    	let $$restProps = compute_rest_props$1($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const dispatch = createEventDispatcher$1();
    	let { class: className = undefined } = $$props;
    	let containerClasses = "swiper-container";
    	let breakpointChanged = false;
    	let swiperInstance = null;
    	let oldPassedParams = null;
    	let paramsData;
    	let swiperParams;
    	let passedParams;
    	let restProps;
    	let swiperEl = null;
    	let prevEl = null;
    	let nextEl = null;
    	let scrollbarEl = null;
    	let paginationEl = null;
    	let virtualData = { slides: [] };

    	function swiper() {
    		return swiperInstance;
    	}

    	const setVirtualData = data => {
    		$$invalidate(9, virtualData = data);

    		tick$1().then(() => {
    			swiperInstance.$wrapperEl.children(".swiper-slide").each(el => {
    				if (el.onSwiper) el.onSwiper(swiperInstance);
    			});

    			swiperInstance.updateSlides();
    			swiperInstance.updateProgress();
    			swiperInstance.updateSlidesClasses();

    			if (swiperInstance.lazy && swiperInstance.params.lazy.enabled) {
    				swiperInstance.lazy.load();
    			}
    		});
    	};

    	const calcParams = () => {
    		paramsData = getParams$2($$restProps);
    		$$invalidate(2, swiperParams = paramsData.params);
    		passedParams = paramsData.passedParams;
    		$$invalidate(3, restProps = paramsData.rest);
    	};

    	calcParams();
    	oldPassedParams = passedParams;

    	const onBeforeBreakpoint = () => {
    		breakpointChanged = true;
    	};

    	swiperParams.onAny = (event, ...args) => {
    		dispatch(event, [args]);
    	};

    	Object.assign(swiperParams.on, {
    		_beforeBreakpoint: onBeforeBreakpoint,
    		_containerClasses(_swiper, classes) {
    			$$invalidate(1, containerClasses = classes);
    		}
    	});

    	swiperInstance = initSwiper$2(swiperParams);

    	if (swiperInstance.virtual && swiperInstance.params.virtual.enabled) {
    		const extendWith = {
    			cache: false,
    			renderExternal: data => {
    				setVirtualData(data);

    				if (swiperParams.virtual && swiperParams.virtual.renderExternal) {
    					swiperParams.virtual.renderExternal(data);
    				}
    			},
    			renderExternalUpdate: false
    		};

    		extend$4(swiperInstance.params.virtual, extendWith);
    		extend$4(swiperInstance.originalParams.virtual, extendWith);
    	}

    	onMount$1(() => {
    		if (!swiperEl) return;

    		mountSwiper$2(
    			{
    				el: swiperEl,
    				nextEl,
    				prevEl,
    				paginationEl,
    				scrollbarEl,
    				swiper: swiperInstance
    			},
    			swiperParams
    		);

    		dispatch("swiper", [swiperInstance]);
    		if (swiperParams.virtual) return;

    		swiperInstance.slides.each(el => {
    			if (el.onSwiper) el.onSwiper(swiperInstance);
    		});
    	});

    	afterUpdate$1(() => {
    		if (!swiperInstance) return;
    		calcParams();
    		const changedParams = getChangedParams$2(passedParams, oldPassedParams);

    		if ((changedParams.length || breakpointChanged) && swiperInstance && !swiperInstance.destroyed) {
    			updateSwiper$2(swiperInstance, passedParams, changedParams);
    		}

    		breakpointChanged = false;
    		oldPassedParams = passedParams;
    	});

    	onDestroy$1(() => {
    		if (swiperInstance && !swiperInstance.destroyed) {
    			swiperInstance.destroy(true, false);
    		}
    	});

    	function div0_binding($$value) {
    		binding_callbacks$1[$$value ? "unshift" : "push"](() => {
    			prevEl = $$value;
    			$$invalidate(5, prevEl);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks$1[$$value ? "unshift" : "push"](() => {
    			nextEl = $$value;
    			$$invalidate(6, nextEl);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks$1[$$value ? "unshift" : "push"](() => {
    			scrollbarEl = $$value;
    			$$invalidate(7, scrollbarEl);
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks$1[$$value ? "unshift" : "push"](() => {
    			paginationEl = $$value;
    			$$invalidate(8, paginationEl);
    		});
    	}

    	function div1_binding_1($$value) {
    		binding_callbacks$1[$$value ? "unshift" : "push"](() => {
    			swiperEl = $$value;
    			$$invalidate(4, swiperEl);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign$1(assign$1({}, $$props), exclude_internal_props$1($$new_props));
    		$$invalidate(27, $$restProps = compute_rest_props$1($$props, omit_props_names));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("$$scope" in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	return [
    		className,
    		containerClasses,
    		swiperParams,
    		restProps,
    		swiperEl,
    		prevEl,
    		nextEl,
    		scrollbarEl,
    		paginationEl,
    		virtualData,
    		swiper,
    		$$scope,
    		slots,
    		div0_binding,
    		div1_binding,
    		div_binding,
    		div_binding_1,
    		div1_binding_1
    	];
    }

    class Swiper$3 extends SvelteComponent$1 {
    	constructor(options) {
    		super();
    		init$1(this, options, instance$8, create_fragment$8, safe_not_equal$1, { class: 0, swiper: 10 });
    	}

    	get swiper() {
    		return this.$$.ctx[10];
    	}
    }

    var _default = Swiper$3;

    var swiper = {
    	default: _default
    };

    /* src/slide-hero-swiper.svelte generated by Svelte v3.32.1 */
    const file$6 = "src/slide-hero-swiper.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (54:6) <SwiperSlide>
    function create_default_slot_1(ctx) {
    	let picture;
    	let t;
    	let current;

    	picture = new Picture({
    			props: {
    				imgClass: "slide-img",
    				sizes: "" + (/*standardWidth*/ ctx[2] / 16 * 9 / /*article*/ ctx[9].aspectRatio.height * /*article*/ ctx[9].aspectRatio.width + "vw"),
    				contents: /*contents*/ ctx[0],
    				globalSettings: /*globalSettings*/ ctx[1],
    				imageId: /*article*/ ctx[9].imageId,
    				width: /*article*/ ctx[9].aspectRatio.width,
    				height: /*article*/ ctx[9].aspectRatio.height,
    				useTiny: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(picture.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(picture, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const picture_changes = {};
    			if (dirty & /*standardWidth, contents*/ 5) picture_changes.sizes = "" + (/*standardWidth*/ ctx[2] / 16 * 9 / /*article*/ ctx[9].aspectRatio.height * /*article*/ ctx[9].aspectRatio.width + "vw");
    			if (dirty & /*contents*/ 1) picture_changes.contents = /*contents*/ ctx[0];
    			if (dirty & /*globalSettings*/ 2) picture_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*contents*/ 1) picture_changes.imageId = /*article*/ ctx[9].imageId;
    			if (dirty & /*contents*/ 1) picture_changes.width = /*article*/ ctx[9].aspectRatio.width;
    			if (dirty & /*contents*/ 1) picture_changes.height = /*article*/ ctx[9].aspectRatio.height;
    			picture.$set(picture_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(picture.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(picture.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(picture, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(54:6) <SwiperSlide>",
    		ctx
    	});

    	return block;
    }

    // (53:4) {#each contents.articles as article}
    function create_each_block$4(ctx) {
    	let swiperslide;
    	let current;

    	swiperslide = new Swiper$2({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(swiperslide.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swiperslide, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiperslide_changes = {};

    			if (dirty & /*$$scope, standardWidth, contents, globalSettings*/ 4103) {
    				swiperslide_changes.$$scope = { dirty, ctx };
    			}

    			swiperslide.$set(swiperslide_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiperslide.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiperslide.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swiperslide, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(53:4) {#each contents.articles as article}",
    		ctx
    	});

    	return block;
    }

    // (35:2) <Swiper     centeredSlides={true}     spaceBetween={4}     slidesPerView={'auto'}     grabCursor={true}     speed={transitionDuration}     slideToClickedSlide={true}     loop={true}     on:swiper={e => {       const [swiper] = e.detail;       window.addEventListener('load', () => setTimeout(() => {         swiper.loopDestroy();         swiper.loopCreate();         swiper.update();       }))}}     loopedSlides={contents.articles.length}     controller={{ control: controlledSwiper }}   >
    function create_default_slot$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*contents*/ ctx[0].articles;
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
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*standardWidth, contents, globalSettings*/ 7) {
    				each_value = /*contents*/ ctx[0].articles;
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
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(35:2) <Swiper     centeredSlides={true}     spaceBetween={4}     slidesPerView={'auto'}     grabCursor={true}     speed={transitionDuration}     slideToClickedSlide={true}     loop={true}     on:swiper={e => {       const [swiper] = e.detail;       window.addEventListener('load', () => setTimeout(() => {         swiper.loopDestroy();         swiper.loopCreate();         swiper.update();       }))}}     loopedSlides={contents.articles.length}     controller={{ control: controlledSwiper }}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let link0;
    	let link1;
    	let t0;
    	let div;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let swiper_1;
    	let t2;
    	let img1;
    	let img1_src_value;
    	let current;

    	swiper_1 = new Swiper$1({
    			props: {
    				centeredSlides: true,
    				spaceBetween: 4,
    				slidesPerView: "auto",
    				grabCursor: true,
    				speed: /*transitionDuration*/ ctx[4],
    				slideToClickedSlide: true,
    				loop: true,
    				loopedSlides: /*contents*/ ctx[0].articles.length,
    				controller: { control: /*controlledSwiper*/ ctx[3] },
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swiper_1.$on("swiper", /*swiper_handler*/ ctx[7]);

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			t0 = space();
    			div = element("div");
    			img0 = element("img");
    			t1 = space();
    			create_component(swiper_1.$$.fragment);
    			t2 = space();
    			img1 = element("img");
    			attr_dev(link0, "rel", "preload");
    			attr_dev(link0, "href", "/swiper-bundle.min.css");
    			attr_dev(link0, "as", "style");
    			add_location(link0, file$6, 28, 2, 805);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "type", "text/css");
    			attr_dev(link1, "href", "/swiper-bundle.min.css");
    			add_location(link1, file$6, 29, 2, 869);
    			attr_dev(img0, "class", "arrow left svelte-1ssy7h5");
    			if (img0.src !== (img0_src_value = "/img/arrow.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "左のスライドへ");
    			attr_dev(img0, "width", "309.94");
    			attr_dev(img0, "height", "355.04");
    			add_location(img0, file$6, 33, 2, 982);
    			attr_dev(img1, "class", "arrow right svelte-1ssy7h5");
    			if (img1.src !== (img1_src_value = "/img/arrow.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "右のスライドへ");
    			attr_dev(img1, "width", "309.94");
    			attr_dev(img1, "height", "355.04");
    			add_location(img1, file$6, 58, 2, 1945);
    			attr_dev(div, "class", "slide-hero svelte-1ssy7h5");
    			add_location(div, file$6, 32, 0, 955);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, img0);
    			append_dev(div, t1);
    			mount_component(swiper_1, div, null);
    			append_dev(div, t2);
    			append_dev(div, img1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const swiper_1_changes = {};
    			if (dirty & /*contents*/ 1) swiper_1_changes.loopedSlides = /*contents*/ ctx[0].articles.length;
    			if (dirty & /*controlledSwiper*/ 8) swiper_1_changes.controller = { control: /*controlledSwiper*/ ctx[3] };

    			if (dirty & /*$$scope, contents, standardWidth, globalSettings*/ 4103) {
    				swiper_1_changes.$$scope = { dirty, ctx };
    			}

    			swiper_1.$set(swiper_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiper_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiper_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(swiper_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $sync;
    	validate_store(sync, "sync");
    	component_subscribe($$self, sync, $$value => $$invalidate(8, $sync = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Slide_hero_swiper", slots, []);

    	let { contents } = $$props,
    		{ pairId } = $$props,
    		{ isParent } = $$props,
    		{ globalSettings } = $$props,
    		{ standardWidth } = $$props;

    	const transitionDuration = globalSettings.transitionDuration;
    	Swiper.use([Controller$1, EffectFade]);
    	let controlledSwiper = null;

    	addEventListener("controllee_load", () => {
    		$$invalidate(3, controlledSwiper = $sync.controlledSwiper);
    	});

    	addEventListener("tinyImageUnloaded", () => {
    		alert("hello");
    	});

    	const writable_props = ["contents", "pairId", "isParent", "globalSettings", "standardWidth"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Slide_hero_swiper> was created with unknown prop '${key}'`);
    	});

    	const swiper_handler = e => {
    		const [swiper] = e.detail;

    		window.addEventListener("load", () => setTimeout(() => {
    			swiper.loopDestroy();
    			swiper.loopCreate();
    			swiper.update();
    		}));
    	};

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("pairId" in $$props) $$invalidate(5, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(6, isParent = $$props.isParent);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
    	};

    	$$self.$capture_state = () => ({
    		Swiper: Swiper$1,
    		SwiperSlide: Swiper$2,
    		SwiperCore: Swiper,
    		Controller: Controller$1,
    		EffectFade,
    		sync,
    		Picture,
    		onMount,
    		swiper,
    		contents,
    		pairId,
    		isParent,
    		globalSettings,
    		standardWidth,
    		transitionDuration,
    		controlledSwiper,
    		$sync
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("pairId" in $$props) $$invalidate(5, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(6, isParent = $$props.isParent);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
    		if ("controlledSwiper" in $$props) $$invalidate(3, controlledSwiper = $$props.controlledSwiper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		contents,
    		globalSettings,
    		standardWidth,
    		controlledSwiper,
    		transitionDuration,
    		pairId,
    		isParent,
    		swiper_handler
    	];
    }

    class Slide_hero_swiper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			contents: 0,
    			pairId: 5,
    			isParent: 6,
    			globalSettings: 1,
    			standardWidth: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slide_hero_swiper",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Slide_hero_swiper> was created without expected prop 'contents'");
    		}

    		if (/*pairId*/ ctx[5] === undefined && !("pairId" in props)) {
    			console.warn("<Slide_hero_swiper> was created without expected prop 'pairId'");
    		}

    		if (/*isParent*/ ctx[6] === undefined && !("isParent" in props)) {
    			console.warn("<Slide_hero_swiper> was created without expected prop 'isParent'");
    		}

    		if (/*globalSettings*/ ctx[1] === undefined && !("globalSettings" in props)) {
    			console.warn("<Slide_hero_swiper> was created without expected prop 'globalSettings'");
    		}

    		if (/*standardWidth*/ ctx[2] === undefined && !("standardWidth" in props)) {
    			console.warn("<Slide_hero_swiper> was created without expected prop 'standardWidth'");
    		}
    	}

    	get contents() {
    		throw new Error("<Slide_hero_swiper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Slide_hero_swiper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pairId() {
    		throw new Error("<Slide_hero_swiper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pairId(value) {
    		throw new Error("<Slide_hero_swiper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isParent() {
    		throw new Error("<Slide_hero_swiper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isParent(value) {
    		throw new Error("<Slide_hero_swiper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Slide_hero_swiper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Slide_hero_swiper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get standardWidth() {
    		throw new Error("<Slide_hero_swiper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set standardWidth(value) {
    		throw new Error("<Slide_hero_swiper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/youtube-iframe.svelte generated by Svelte v3.32.1 */
    const file$7 = "src/youtube-iframe.svelte";

    // (10:2) {#if load}
    function create_if_block$7(ctx) {
    	let iframe;
    	let t;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			t = text("YouTube動画の埋め込み");
    			attr_dev(iframe, "width", "16");
    			attr_dev(iframe, "height", "9");
    			if (iframe.src !== (iframe_src_value = "https://www.youtube-nocookie.com/embed/" + /*id*/ ctx[2] + "?autoplay=1&playsinline=1")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "title", "YouTube動画の埋め込み");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "fullscreen;accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture");
    			iframe.allowFullscreen = "true";
    			attr_dev(iframe, "loading", "lazy");
    			attr_dev(iframe, "class", "svelte-tjsith");
    			add_location(iframe, file$7, 10, 4, 419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    			append_dev(iframe, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*id*/ 4 && iframe.src !== (iframe_src_value = "https://www.youtube-nocookie.com/embed/" + /*id*/ ctx[2] + "?autoplay=1&playsinline=1")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(10:2) {#if load}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let picture;
    	let t0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	picture = new Picture({
    			props: {
    				imgClass: "youtube-thumbnail",
    				contents: /*contents*/ ctx[0],
    				globalSettings: /*globalSettings*/ ctx[1],
    				imageId: /*id*/ ctx[2],
    				width: "16",
    				height: "9"
    			},
    			$$inline: true
    		});

    	let if_block = /*load*/ ctx[3] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(picture.$$.fragment);
    			t0 = space();
    			img = element("img");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(img, "class", "play-icon svelte-tjsith");
    			if (img.src !== (img_src_value = "/img/youtube.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "YouTubeの再生ボタン");
    			attr_dev(img, "width", "44");
    			attr_dev(img, "height", "31");
    			add_location(img, file$7, 8, 2, 312);
    			attr_dev(div, "class", div_class_value = "youtube-wrapper " + (/*load*/ ctx[3] ? "load" : "") + " svelte-tjsith");
    			add_location(div, file$7, 6, 0, 124);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(picture, div, null);
    			append_dev(div, t0);
    			append_dev(div, img);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const picture_changes = {};
    			if (dirty & /*contents*/ 1) picture_changes.contents = /*contents*/ ctx[0];
    			if (dirty & /*globalSettings*/ 2) picture_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*id*/ 4) picture_changes.imageId = /*id*/ ctx[2];
    			picture.$set(picture_changes);

    			if (/*load*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*load*/ 8 && div_class_value !== (div_class_value = "youtube-wrapper " + (/*load*/ ctx[3] ? "load" : "") + " svelte-tjsith")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(picture.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(picture.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(picture);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Youtube_iframe", slots, []);
    	let { contents } = $$props, { globalSettings } = $$props, { id } = $$props;
    	let load = false;
    	const writable_props = ["contents", "globalSettings", "id"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Youtube_iframe> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(3, load = true);

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("id" in $$props) $$invalidate(2, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		Picture,
    		contents,
    		globalSettings,
    		id,
    		load
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("id" in $$props) $$invalidate(2, id = $$props.id);
    		if ("load" in $$props) $$invalidate(3, load = $$props.load);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contents, globalSettings, id, load, click_handler];
    }

    class Youtube_iframe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { contents: 0, globalSettings: 1, id: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Youtube_iframe",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Youtube_iframe> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[1] === undefined && !("globalSettings" in props)) {
    			console.warn("<Youtube_iframe> was created without expected prop 'globalSettings'");
    		}

    		if (/*id*/ ctx[2] === undefined && !("id" in props)) {
    			console.warn("<Youtube_iframe> was created without expected prop 'id'");
    		}
    	}

    	get contents() {
    		throw new Error("<Youtube_iframe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Youtube_iframe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Youtube_iframe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Youtube_iframe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Youtube_iframe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Youtube_iframe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/slide-description.svelte generated by Svelte v3.32.1 */

    const { console: console_1, document: document_1 } = globals;
    const file$8 = "src/slide-description.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_10(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    // (69:14) {:else}
    function create_else_block_4(ctx) {
    	let t_value = /*article*/ ctx[9].subtitle + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*article*/ ctx[9].subtitle + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(69:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (65:14) {#if Array.isArray(article.subtitle)}
    function create_if_block_14(ctx) {
    	let each_1_anchor;
    	let each_value_10 = /*article*/ ctx[9].subtitle;
    	validate_each_argument(each_value_10);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_10.length; i += 1) {
    		each_blocks[i] = create_each_block_10(get_each_context_10(ctx, each_value_10, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2) {
    				each_value_10 = /*article*/ ctx[9].subtitle;
    				validate_each_argument(each_value_10);
    				let i;

    				for (i = 0; i < each_value_10.length; i += 1) {
    					const child_ctx = get_each_context_10(ctx, each_value_10, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_10(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_10.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(65:14) {#if Array.isArray(article.subtitle)}",
    		ctx
    	});

    	return block;
    }

    // (66:16) {#each article.subtitle as subtitle}
    function create_each_block_10(ctx) {
    	let t_value = /*subtitle*/ ctx[33] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*subtitle*/ ctx[33] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_10.name,
    		type: "each",
    		source: "(66:16) {#each article.subtitle as subtitle}",
    		ctx
    	});

    	return block;
    }

    // (78:14) {:else}
    function create_else_block_3(ctx) {
    	let t_value = /*article*/ ctx[9].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*article*/ ctx[9].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(78:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (74:14) {#if Array.isArray(article.title)}
    function create_if_block_13(ctx) {
    	let each_1_anchor;
    	let each_value_9 = /*article*/ ctx[9].title;
    	validate_each_argument(each_value_9);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_9.length; i += 1) {
    		each_blocks[i] = create_each_block_9(get_each_context_9(ctx, each_value_9, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2) {
    				each_value_9 = /*article*/ ctx[9].title;
    				validate_each_argument(each_value_9);
    				let i;

    				for (i = 0; i < each_value_9.length; i += 1) {
    					const child_ctx = get_each_context_9(ctx, each_value_9, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_9.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(74:14) {#if Array.isArray(article.title)}",
    		ctx
    	});

    	return block;
    }

    // (75:16) {#each article.title as title}
    function create_each_block_9(ctx) {
    	let t_value = /*title*/ ctx[15] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*title*/ ctx[15] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_9.name,
    		type: "each",
    		source: "(75:16) {#each article.title as title}",
    		ctx
    	});

    	return block;
    }

    // (86:14) {#if button.popup}
    function create_if_block_12(ctx) {
    	let div;
    	let t_value = /*button*/ ctx[12].popup + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "popup svelte-cpi42m");
    			add_location(div, file$8, 86, 16, 3265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*button*/ ctx[12].popup + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(86:14) {#if button.popup}",
    		ctx
    	});

    	return block;
    }

    // (94:16) {:else}
    function create_else_block_2(ctx) {
    	let t_value = /*button*/ ctx[12].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*button*/ ctx[12].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(94:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (90:16) {#if Array.isArray(button.title)}
    function create_if_block_11(ctx) {
    	let each_1_anchor;
    	let each_value_8 = /*button*/ ctx[12].title;
    	validate_each_argument(each_value_8);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_8.length; i += 1) {
    		each_blocks[i] = create_each_block_8(get_each_context_8(ctx, each_value_8, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2) {
    				each_value_8 = /*button*/ ctx[12].title;
    				validate_each_argument(each_value_8);
    				let i;

    				for (i = 0; i < each_value_8.length; i += 1) {
    					const child_ctx = get_each_context_8(ctx, each_value_8, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_8.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(90:16) {#if Array.isArray(button.title)}",
    		ctx
    	});

    	return block;
    }

    // (91:18) {#each button.title as title}
    function create_each_block_8(ctx) {
    	let span;
    	let t_value = /*title*/ ctx[15] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "break-scope svelte-cpi42m");
    			add_location(span, file$8, 91, 20, 3515);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*title*/ ctx[15] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(91:18) {#each button.title as title}",
    		ctx
    	});

    	return block;
    }

    // (89:14) <Button target={button.target} bg="#3183fd" width="auto">
    function create_default_slot_5(ctx) {
    	let show_if;
    	let t;

    	function select_block_type_2(ctx, dirty) {
    		if (show_if == null || dirty[0] & /*contents*/ 2) show_if = !!Array.isArray(/*button*/ ctx[12].title);
    		if (show_if) return create_if_block_11;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_2(ctx, [-1]);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(89:14) <Button target={button.target} bg=\\\"#3183fd\\\" width=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (85:12) {#each article.buttons as button}
    function create_each_block_7(ctx) {
    	let t;
    	let button;
    	let current;
    	let if_block = /*button*/ ctx[12].popup && create_if_block_12(ctx);

    	button = new Button({
    			props: {
    				target: /*button*/ ctx[12].target,
    				bg: "#3183fd",
    				width: "auto",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*button*/ ctx[12].popup) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_12(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const button_changes = {};
    			if (dirty[0] & /*contents*/ 2) button_changes.target = /*button*/ ctx[12].target;

    			if (dirty[0] & /*contents*/ 2 | dirty[1] & /*$$scope*/ 32) {
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(85:12) {#each article.buttons as button}",
    		ctx
    	});

    	return block;
    }

    // (102:10) {#if article.slides}
    function create_if_block_9(ctx) {
    	let div;
    	let swiper;
    	let current;

    	swiper = new Swiper$1({
    			props: {
    				centeredSlides: true,
    				autoHeight: true,
    				spaceBetween: 0,
    				slidesPerView: 1,
    				speed: /*transitionDuration*/ ctx[3],
    				updateOnImagesReady: true,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(swiper.$$.fragment);
    			attr_dev(div, "class", "slide svelte-cpi42m");
    			add_location(div, file$8, 102, 12, 3824);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(swiper, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiper_changes = {};

    			if (dirty[0] & /*contents, globalSettings*/ 3 | dirty[1] & /*$$scope*/ 32) {
    				swiper_changes.$$scope = { dirty, ctx };
    			}

    			swiper.$set(swiper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(swiper);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(102:10) {#if article.slides}",
    		ctx
    	});

    	return block;
    }

    // (114:20) {#if slide.type == "youtube"}
    function create_if_block_10(ctx) {
    	let yframe;
    	let current;

    	yframe = new Youtube_iframe({
    			props: {
    				contents: /*contents*/ ctx[1],
    				globalSettings: /*globalSettings*/ ctx[0],
    				id: /*slide*/ ctx[24].id
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(yframe.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(yframe, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const yframe_changes = {};
    			if (dirty[0] & /*contents*/ 2) yframe_changes.contents = /*contents*/ ctx[1];
    			if (dirty[0] & /*globalSettings*/ 1) yframe_changes.globalSettings = /*globalSettings*/ ctx[0];
    			if (dirty[0] & /*contents*/ 2) yframe_changes.id = /*slide*/ ctx[24].id;
    			yframe.$set(yframe_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(yframe.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(yframe.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(yframe, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(114:20) {#if slide.type == \\\"youtube\\\"}",
    		ctx
    	});

    	return block;
    }

    // (113:18) <SwiperSlide>
    function create_default_slot_4(ctx) {
    	let t;
    	let current;
    	let if_block = /*slide*/ ctx[24].type == "youtube" && create_if_block_10(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*slide*/ ctx[24].type == "youtube") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*contents*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_10(ctx);
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(113:18) <SwiperSlide>",
    		ctx
    	});

    	return block;
    }

    // (112:16) {#each article.slides as slide}
    function create_each_block_6(ctx) {
    	let swiperslide;
    	let current;

    	swiperslide = new Swiper$2({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(swiperslide.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swiperslide, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiperslide_changes = {};

    			if (dirty[0] & /*contents, globalSettings*/ 3 | dirty[1] & /*$$scope*/ 32) {
    				swiperslide_changes.$$scope = { dirty, ctx };
    			}

    			swiperslide.$set(swiperslide_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiperslide.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiperslide.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swiperslide, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(112:16) {#each article.slides as slide}",
    		ctx
    	});

    	return block;
    }

    // (104:14) <Swiper                 centeredSlides={true}                 autoHeight={true}                 spaceBetween={0}                 slidesPerView={1}                 speed={transitionDuration}                 updateOnImagesReady={true}               >
    function create_default_slot_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_6 = /*article*/ ctx[9].slides;
    	validate_each_argument(each_value_6);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents, globalSettings*/ 3) {
    				each_value_6 = /*article*/ ctx[9].slides;
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_6.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_6.length; i += 1) {
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(104:14) <Swiper                 centeredSlides={true}                 autoHeight={true}                 spaceBetween={0}                 slidesPerView={1}                 speed={transitionDuration}                 updateOnImagesReady={true}               >",
    		ctx
    	});

    	return block;
    }

    // (128:14) {:else}
    function create_else_block_1(ctx) {
    	let t_value = /*article*/ ctx[9].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*article*/ ctx[9].description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(128:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (124:14) {#if Array.isArray(article.description)}
    function create_if_block_8(ctx) {
    	let each_1_anchor;
    	let each_value_5 = /*article*/ ctx[9].description;
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2) {
    				each_value_5 = /*article*/ ctx[9].description;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(124:14) {#if Array.isArray(article.description)}",
    		ctx
    	});

    	return block;
    }

    // (125:16) {#each article.description as p, i}
    function create_each_block_5(ctx) {
    	let p;
    	let t_value = /*p*/ ctx[22] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "" + (null_to_empty(/*i*/ ctx[11] == 0 ? "first-line" : "") + " svelte-cpi42m"));
    			add_location(p, file$8, 125, 18, 4637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*p*/ ctx[22] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(125:16) {#each article.description as p, i}",
    		ctx
    	});

    	return block;
    }

    // (132:12) {#if article.specs}
    function create_if_block_2$2(ctx) {
    	let div;
    	let t;
    	let if_block0 = /*article*/ ctx[9].specs.times && create_if_block_4(ctx);
    	let if_block1 = /*article*/ ctx[9].specs.platforms && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "specs svelte-cpi42m");
    			add_location(div, file$8, 132, 14, 4856);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*article*/ ctx[9].specs.times) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*article*/ ctx[9].specs.platforms) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(132:12) {#if article.specs}",
    		ctx
    	});

    	return block;
    }

    // (134:16) {#if article.specs.times}
    function create_if_block_4(ctx) {
    	let div;
    	let span;
    	let t1;
    	let each_value_4 = /*article*/ ctx[9].specs.times;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "制作時期";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "tag svelte-cpi42m");
    			add_location(span, file$8, 135, 20, 4976);
    			attr_dev(div, "class", "times svelte-cpi42m");
    			add_location(div, file$8, 134, 18, 4936);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2) {
    				each_value_4 = /*article*/ ctx[9].specs.times;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(134:16) {#if article.specs.times}",
    		ctx
    	});

    	return block;
    }

    // (140:24) {#if time.year}
    function create_if_block_7(ctx) {
    	let t0_value = /*time*/ ctx[20].year + "";
    	let t0;
    	let t1;

    	let t2_value = (!(/*time*/ ctx[20].month || /*time*/ ctx[20].day)
    	? /*time*/ ctx[20].annotation
    	: "") + "";

    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text("年");
    			t2 = text(t2_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t0_value !== (t0_value = /*time*/ ctx[20].year + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*contents*/ 2 && t2_value !== (t2_value = (!(/*time*/ ctx[20].month || /*time*/ ctx[20].day)
    			? /*time*/ ctx[20].annotation
    			: "") + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(140:24) {#if time.year}",
    		ctx
    	});

    	return block;
    }

    // (143:24) {#if time.month}
    function create_if_block_6(ctx) {
    	let t0_value = /*time*/ ctx[20].month + "";
    	let t0;
    	let t1;
    	let t2_value = (!/*time*/ ctx[20].day ? /*time*/ ctx[20].annotation : "") + "";
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text("月");
    			t2 = text(t2_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t0_value !== (t0_value = /*time*/ ctx[20].month + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*contents*/ 2 && t2_value !== (t2_value = (!/*time*/ ctx[20].day ? /*time*/ ctx[20].annotation : "") + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(143:24) {#if time.month}",
    		ctx
    	});

    	return block;
    }

    // (146:24) {#if time.day}
    function create_if_block_5(ctx) {
    	let t0_value = /*time*/ ctx[20].day + "";
    	let t0;
    	let t1;
    	let t2_value = /*time*/ ctx[20].annotation + "";
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text("日");
    			t2 = text(t2_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t0_value !== (t0_value = /*time*/ ctx[20].day + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*contents*/ 2 && t2_value !== (t2_value = /*time*/ ctx[20].annotation + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(146:24) {#if time.day}",
    		ctx
    	});

    	return block;
    }

    // (137:20) {#each article.specs.times as time, i}
    function create_each_block_4(ctx) {
    	let time;
    	let t0;
    	let t1;
    	let time_datetime_value;
    	let t2;

    	let t3_value = (/*i*/ ctx[11] + 1 != /*article*/ ctx[9].specs.times.length
    	? ", "
    	: "") + "";

    	let t3;
    	let if_block0 = /*time*/ ctx[20].year && create_if_block_7(ctx);
    	let if_block1 = /*time*/ ctx[20].month && create_if_block_6(ctx);
    	let if_block2 = /*time*/ ctx[20].day && create_if_block_5(ctx);

    	const block = {
    		c: function create() {
    			time = element("time");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			t3 = text(t3_value);
    			attr_dev(time, "class", "break-scope svelte-cpi42m");

    			attr_dev(time, "datetime", time_datetime_value = (/*time*/ ctx[20].year
    			? ("0000" + /*time*/ ctx[20].year).slice(-4)
    			: "") + (/*time*/ ctx[20].month
    			? "-" + ("00" + /*time*/ ctx[20].month).slice(-2)
    			: "") + (/*time*/ ctx[20].day
    			? "-" + ("00" + /*time*/ ctx[20].day).slice(-2)
    			: ""));

    			add_location(time, file$8, 138, 22, 5157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, time, anchor);
    			if (if_block0) if_block0.m(time, null);
    			append_dev(time, t0);
    			if (if_block1) if_block1.m(time, null);
    			append_dev(time, t1);
    			if (if_block2) if_block2.m(time, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*time*/ ctx[20].year) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(time, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*time*/ ctx[20].month) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					if_block1.m(time, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*time*/ ctx[20].day) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_5(ctx);
    					if_block2.c();
    					if_block2.m(time, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty[0] & /*contents*/ 2 && time_datetime_value !== (time_datetime_value = (/*time*/ ctx[20].year
    			? ("0000" + /*time*/ ctx[20].year).slice(-4)
    			: "") + (/*time*/ ctx[20].month
    			? "-" + ("00" + /*time*/ ctx[20].month).slice(-2)
    			: "") + (/*time*/ ctx[20].day
    			? "-" + ("00" + /*time*/ ctx[20].day).slice(-2)
    			: ""))) {
    				attr_dev(time, "datetime", time_datetime_value);
    			}

    			if (dirty[0] & /*contents*/ 2 && t3_value !== (t3_value = (/*i*/ ctx[11] + 1 != /*article*/ ctx[9].specs.times.length
    			? ", "
    			: "") + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(time);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(137:20) {#each article.specs.times as time, i}",
    		ctx
    	});

    	return block;
    }

    // (154:16) {#if article.specs.platforms}
    function create_if_block_3(ctx) {
    	let div;
    	let span;
    	let t1;
    	let each_value_3 = /*article*/ ctx[9].specs.platforms;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "対応プラットフォーム";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "tag svelte-cpi42m");
    			add_location(span, file$8, 155, 20, 6064);
    			attr_dev(div, "class", "platforms svelte-cpi42m");
    			add_location(div, file$8, 154, 18, 6020);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2) {
    				each_value_3 = /*article*/ ctx[9].specs.platforms;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(154:16) {#if article.specs.platforms}",
    		ctx
    	});

    	return block;
    }

    // (157:20) {#each article.specs.platforms as platform, i}
    function create_each_block_3(ctx) {
    	let span;
    	let t0_value = /*platform*/ ctx[18].name + "";
    	let t0;
    	let t1;
    	let t2_value = (/*platform*/ ctx[18].version || "") + "";
    	let t2;
    	let t3_value = (/*platform*/ ctx[18].orLater ? "以降" : "") + "";
    	let t3;

    	let t4_value = (/*i*/ ctx[11] + 1 != /*article*/ ctx[9].specs.platforms.length
    	? ","
    	: "") + "";

    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(span, "class", "break-scope svelte-cpi42m");
    			add_location(span, file$8, 157, 22, 6189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			append_dev(span, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t0_value !== (t0_value = /*platform*/ ctx[18].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*contents*/ 2 && t2_value !== (t2_value = (/*platform*/ ctx[18].version || "") + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*contents*/ 2 && t3_value !== (t3_value = (/*platform*/ ctx[18].orLater ? "以降" : "") + "")) set_data_dev(t3, t3_value);

    			if (dirty[0] & /*contents*/ 2 && t4_value !== (t4_value = (/*i*/ ctx[11] + 1 != /*article*/ ctx[9].specs.platforms.length
    			? ","
    			: "") + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(157:20) {#each article.specs.platforms as platform, i}",
    		ctx
    	});

    	return block;
    }

    // (170:12) {#if button.popup}
    function create_if_block_1$3(ctx) {
    	let div;
    	let t_value = /*button*/ ctx[12].popup + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "popup svelte-cpi42m");
    			add_location(div, file$8, 170, 14, 6663);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*button*/ ctx[12].popup + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(170:12) {#if button.popup}",
    		ctx
    	});

    	return block;
    }

    // (178:14) {:else}
    function create_else_block$4(ctx) {
    	let t_value = /*button*/ ctx[12].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*button*/ ctx[12].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(178:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (174:14) {#if Array.isArray(button.title)}
    function create_if_block$8(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*button*/ ctx[12].title;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2) {
    				each_value_2 = /*button*/ ctx[12].title;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(174:14) {#if Array.isArray(button.title)}",
    		ctx
    	});

    	return block;
    }

    // (175:16) {#each button.title as title}
    function create_each_block_2$1(ctx) {
    	let span;
    	let t_value = /*title*/ ctx[15] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "break-scope svelte-cpi42m");
    			add_location(span, file$8, 175, 18, 6932);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*title*/ ctx[15] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(175:16) {#each button.title as title}",
    		ctx
    	});

    	return block;
    }

    // (173:12) <Button target={button.target} bg="#3183fd" width="calc(var(--standardWidth) * 0.45)">
    function create_default_slot_2(ctx) {
    	let show_if;
    	let t;

    	function select_block_type_4(ctx, dirty) {
    		if (show_if == null || dirty[0] & /*contents*/ 2) show_if = !!Array.isArray(/*button*/ ctx[12].title);
    		if (show_if) return create_if_block$8;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type_4(ctx, [-1]);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_4(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(173:12) <Button target={button.target} bg=\\\"#3183fd\\\" width=\\\"calc(var(--standardWidth) * 0.45)\\\">",
    		ctx
    	});

    	return block;
    }

    // (169:10) {#each article.buttons as button}
    function create_each_block_1$2(ctx) {
    	let t;
    	let button;
    	let current;
    	let if_block = /*button*/ ctx[12].popup && create_if_block_1$3(ctx);

    	button = new Button({
    			props: {
    				target: /*button*/ ctx[12].target,
    				bg: "#3183fd",
    				width: "calc(var(--standardWidth) * 0.45)",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*button*/ ctx[12].popup) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const button_changes = {};
    			if (dirty[0] & /*contents*/ 2) button_changes.target = /*button*/ ctx[12].target;

    			if (dirty[0] & /*contents*/ 2 | dirty[1] & /*$$scope*/ 32) {
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(169:10) {#each article.buttons as button}",
    		ctx
    	});

    	return block;
    }

    // (60:4) <SwiperSlide>
    function create_default_slot_1$1(ctx) {
    	let div7;
    	let div3;
    	let div0;
    	let span0;
    	let show_if_2;
    	let t0;
    	let span1;
    	let show_if_1;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div5;
    	let t4;
    	let div4;
    	let article;
    	let show_if;
    	let t5;
    	let t6;
    	let div6;
    	let t7;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (show_if_2 == null || dirty[0] & /*contents*/ 2) show_if_2 = !!Array.isArray(/*article*/ ctx[9].subtitle);
    		if (show_if_2) return create_if_block_14;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type(ctx, [-1]);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (show_if_1 == null || dirty[0] & /*contents*/ 2) show_if_1 = !!Array.isArray(/*article*/ ctx[9].title);
    		if (show_if_1) return create_if_block_13;
    		return create_else_block_3;
    	}

    	let current_block_type_1 = select_block_type_1(ctx, [-1]);
    	let if_block1 = current_block_type_1(ctx);
    	let each_value_7 = /*article*/ ctx[9].buttons;
    	validate_each_argument(each_value_7);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_7.length; i += 1) {
    		each_blocks_1[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let if_block2 = /*article*/ ctx[9].slides && create_if_block_9(ctx);

    	function select_block_type_3(ctx, dirty) {
    		if (show_if == null || dirty[0] & /*contents*/ 2) show_if = !!Array.isArray(/*article*/ ctx[9].description);
    		if (show_if) return create_if_block_8;
    		return create_else_block_1;
    	}

    	let current_block_type_2 = select_block_type_3(ctx, [-1]);
    	let if_block3 = current_block_type_2(ctx);
    	let if_block4 = /*article*/ ctx[9].specs && create_if_block_2$2(ctx);
    	let each_value_1 = /*article*/ ctx[9].buttons;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			if_block0.c();
    			t0 = space();
    			span1 = element("span");
    			if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div5 = element("div");
    			if (if_block2) if_block2.c();
    			t4 = space();
    			div4 = element("div");
    			article = element("article");
    			if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			div6 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			attr_dev(span0, "class", "subtitle svelte-cpi42m");
    			add_location(span0, file$8, 63, 12, 2531);
    			attr_dev(span1, "class", "title svelte-cpi42m");
    			add_location(span1, file$8, 72, 12, 2820);
    			attr_dev(div0, "class", "headline svelte-cpi42m");
    			add_location(div0, file$8, 62, 10, 2496);
    			attr_dev(div1, "class", "spacer svelte-cpi42m");
    			add_location(div1, file$8, 82, 10, 3108);
    			attr_dev(div2, "class", "buttons pc svelte-cpi42m");
    			add_location(div2, file$8, 83, 10, 3145);
    			attr_dev(div3, "class", "title-container svelte-cpi42m");
    			add_location(div3, file$8, 61, 8, 2456);
    			attr_dev(article, "class", "svelte-cpi42m");
    			add_location(article, file$8, 122, 12, 4502);
    			attr_dev(div4, "class", "description svelte-cpi42m");
    			add_location(div4, file$8, 121, 10, 4464);
    			attr_dev(div5, "class", "description-container svelte-cpi42m");
    			add_location(div5, file$8, 100, 8, 3745);
    			attr_dev(div6, "class", "buttons mobile svelte-cpi42m");
    			add_location(div6, file$8, 167, 8, 6545);
    			attr_dev(div7, "class", "slide-container svelte-cpi42m");
    			set_style(div7, "--backgroundColor", /*backgroundColor*/ ctx[4][/*i*/ ctx[11]]);
    			set_style(div7, "--themeColor", /*contents*/ ctx[1].articles[/*i*/ ctx[11]].themeColor);
    			add_location(div7, file$8, 60, 6, 2322);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div3);
    			append_dev(div3, div0);
    			append_dev(div0, span0);
    			if_block0.m(span0, null);
    			append_dev(div0, t0);
    			append_dev(div0, span1);
    			if_block1.m(span1, null);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			append_dev(div7, t3);
    			append_dev(div7, div5);
    			if (if_block2) if_block2.m(div5, null);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, article);
    			if_block3.m(article, null);
    			append_dev(div4, t5);
    			if (if_block4) if_block4.m(div4, null);
    			append_dev(div7, t6);
    			append_dev(div7, div6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div6, null);
    			}

    			insert_dev(target, t7, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(span0, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx, dirty)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(span1, null);
    				}
    			}

    			if (dirty[0] & /*contents*/ 2) {
    				each_value_7 = /*article*/ ctx[9].buttons;
    				validate_each_argument(each_value_7);
    				let i;

    				for (i = 0; i < each_value_7.length; i += 1) {
    					const child_ctx = get_each_context_7(ctx, each_value_7, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_7(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_7.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*article*/ ctx[9].slides) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*contents*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_9(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div5, t4);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type_2 === (current_block_type_2 = select_block_type_3(ctx, dirty)) && if_block3) {
    				if_block3.p(ctx, dirty);
    			} else {
    				if_block3.d(1);
    				if_block3 = current_block_type_2(ctx);

    				if (if_block3) {
    					if_block3.c();
    					if_block3.m(article, null);
    				}
    			}

    			if (/*article*/ ctx[9].specs) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_2$2(ctx);
    					if_block4.c();
    					if_block4.m(div4, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (dirty[0] & /*contents*/ 2) {
    				each_value_1 = /*article*/ ctx[9].buttons;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div6, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*contents*/ 2) {
    				set_style(div7, "--themeColor", /*contents*/ ctx[1].articles[/*i*/ ctx[11]].themeColor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_7.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			transition_in(if_block2);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			transition_out(if_block2);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if_block0.d();
    			if_block1.d();
    			destroy_each(each_blocks_1, detaching);
    			if (if_block2) if_block2.d();
    			if_block3.d();
    			if (if_block4) if_block4.d();
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(60:4) <SwiperSlide>",
    		ctx
    	});

    	return block;
    }

    // (59:2) {#each contents.articles as article, i}
    function create_each_block$5(ctx) {
    	let swiperslide;
    	let current;

    	swiperslide = new Swiper$2({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(swiperslide.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(swiperslide, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiperslide_changes = {};

    			if (dirty[0] & /*contents, globalSettings*/ 3 | dirty[1] & /*$$scope*/ 32) {
    				swiperslide_changes.$$scope = { dirty, ctx };
    			}

    			swiperslide.$set(swiperslide_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiperslide.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiperslide.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(swiperslide, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(59:2) {#each contents.articles as article, i}",
    		ctx
    	});

    	return block;
    }

    // (44:0) <Swiper   allowSlideNext={false}   allowSlidePrev={false}   allowTouchMove={false}   autoHeight={true}   spaceBetween={0}   slidesPerView={1}   speed={transitionDuration}   loop={true}   loopAdditionalSlides={contents.articles.length - 1}   effect='fade'   fadeEffect={{crossFade: true}}   on:swiper={setControlledSwiper}   controller={{ control: controlledSwiper ? controlledSwiper : null }} >
    function create_default_slot$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*contents*/ ctx[1].articles;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*backgroundColor, contents, transitionDuration, globalSettings*/ 27) {
    				each_value = /*contents*/ ctx[1].articles;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(44:0) <Swiper   allowSlideNext={false}   allowSlidePrev={false}   allowTouchMove={false}   autoHeight={true}   spaceBetween={0}   slidesPerView={1}   speed={transitionDuration}   loop={true}   loopAdditionalSlides={contents.articles.length - 1}   effect='fade'   fadeEffect={{crossFade: true}}   on:swiper={setControlledSwiper}   controller={{ control: controlledSwiper ? controlledSwiper : null }} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let link0;
    	let link1;
    	let t;
    	let swiper;
    	let current;

    	swiper = new Swiper$1({
    			props: {
    				allowSlideNext: false,
    				allowSlidePrev: false,
    				allowTouchMove: false,
    				autoHeight: true,
    				spaceBetween: 0,
    				slidesPerView: 1,
    				speed: /*transitionDuration*/ ctx[3],
    				loop: true,
    				loopAdditionalSlides: /*contents*/ ctx[1].articles.length - 1,
    				effect: "fade",
    				fadeEffect: { crossFade: true },
    				controller: {
    					control: /*controlledSwiper*/ ctx[2]
    					? /*controlledSwiper*/ ctx[2]
    					: null
    				},
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swiper.$on("swiper", /*setControlledSwiper*/ ctx[5]);

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			t = space();
    			create_component(swiper.$$.fragment);
    			attr_dev(link0, "rel", "preload");
    			attr_dev(link0, "href", "/swiper-bundle.min.css");
    			attr_dev(link0, "as", "style");
    			attr_dev(link0, "class", "svelte-cpi42m");
    			add_location(link0, file$8, 39, 2, 1711);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "type", "text/css");
    			attr_dev(link1, "href", "/swiper-bundle.min.css");
    			attr_dev(link1, "class", "svelte-cpi42m");
    			add_location(link1, file$8, 40, 2, 1775);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, link0);
    			append_dev(document_1.head, link1);
    			insert_dev(target, t, anchor);
    			mount_component(swiper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiper_changes = {};
    			if (dirty[0] & /*contents*/ 2) swiper_changes.loopAdditionalSlides = /*contents*/ ctx[1].articles.length - 1;

    			if (dirty[0] & /*controlledSwiper*/ 4) swiper_changes.controller = {
    				control: /*controlledSwiper*/ ctx[2]
    				? /*controlledSwiper*/ ctx[2]
    				: null
    			};

    			if (dirty[0] & /*contents, globalSettings*/ 3 | dirty[1] & /*$$scope*/ 32) {
    				swiper_changes.$$scope = { dirty, ctx };
    			}

    			swiper.$set(swiper_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(swiper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(swiper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			if (detaching) detach_dev(t);
    			destroy_component(swiper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $sync;
    	validate_store(sync, "sync");
    	component_subscribe($$self, sync, $$value => $$invalidate(8, $sync = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Slide_description", slots, []);

    	let { pairId } = $$props,
    		{ isParent } = $$props,
    		{ globalSettings } = $$props,
    		{ contents } = $$props;

    	const transitionDuration = globalSettings.transitionDuration,
    		backgroundColor = contents.articles.map(v => color(v.themeColor).lightness(95).desaturate(0.3).hex());

    	console.log(backgroundColor);
    	Swiper.use([Controller$1, EffectFade]);
    	let controlledSwiper = null;

    	const setControlledSwiper = e => {
    		const [swiper] = e.detail;
    		set_store_value(sync, $sync.controlledSwiper = null, $sync);

    		// set Controller swiper instance
    		setTimeout(
    			() => {
    				$$invalidate(2, controlledSwiper = swiper);
    				controlledSwiper.updateAutoHeight();
    				set_store_value(sync, $sync.controlledSwiper = controlledSwiper, $sync);
    				dispatchEvent(new CustomEvent("controllee_load", { detail: pairId }));
    			},
    			100
    		);
    	};

    	//Adobe font loading
    	(function (d) {
    		var config = {
    				kitId: "egn6fhp",
    				scriptTimeout: 3000,
    				async: true
    			},
    			h = d.documentElement,
    			t = setTimeout(
    				function () {
    					h.className = h.className.replace(/\bwf-loading\b/g, "") + " wf-inactive";
    				},
    				config.scriptTimeout
    			),
    			tk = d.createElement("script"),
    			f = false,
    			s = d.getElementsByTagName("script")[0],
    			a;

    		h.className += " wf-loading";
    		tk.src = "https://use.typekit.net/" + config.kitId + ".js";
    		tk.async = true;

    		tk.onload = tk.onreadystatechange = function () {
    			a = this.readyState;
    			if (f || a && a != "complete" && a != "loaded") return;
    			f = true;
    			clearTimeout(t);

    			try {
    				Typekit.load(config);
    			} catch(e) {
    				
    			}
    		};

    		s.parentNode.insertBefore(tk, s);
    	})(document);

    	const writable_props = ["pairId", "isParent", "globalSettings", "contents"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Slide_description> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("pairId" in $$props) $$invalidate(6, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(7, isParent = $$props.isParent);
    		if ("globalSettings" in $$props) $$invalidate(0, globalSettings = $$props.globalSettings);
    		if ("contents" in $$props) $$invalidate(1, contents = $$props.contents);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Yframe: Youtube_iframe,
    		Swiper: Swiper$1,
    		SwiperSlide: Swiper$2,
    		SwiperCore: Swiper,
    		Controller: Controller$1,
    		EffectFade,
    		sync,
    		Color: color,
    		pairId,
    		isParent,
    		globalSettings,
    		contents,
    		transitionDuration,
    		backgroundColor,
    		controlledSwiper,
    		setControlledSwiper,
    		$sync
    	});

    	$$self.$inject_state = $$props => {
    		if ("pairId" in $$props) $$invalidate(6, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(7, isParent = $$props.isParent);
    		if ("globalSettings" in $$props) $$invalidate(0, globalSettings = $$props.globalSettings);
    		if ("contents" in $$props) $$invalidate(1, contents = $$props.contents);
    		if ("controlledSwiper" in $$props) $$invalidate(2, controlledSwiper = $$props.controlledSwiper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		globalSettings,
    		contents,
    		controlledSwiper,
    		transitionDuration,
    		backgroundColor,
    		setControlledSwiper,
    		pairId,
    		isParent
    	];
    }

    class Slide_description extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$b,
    			create_fragment$b,
    			safe_not_equal,
    			{
    				pairId: 6,
    				isParent: 7,
    				globalSettings: 0,
    				contents: 1
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slide_description",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pairId*/ ctx[6] === undefined && !("pairId" in props)) {
    			console_1.warn("<Slide_description> was created without expected prop 'pairId'");
    		}

    		if (/*isParent*/ ctx[7] === undefined && !("isParent" in props)) {
    			console_1.warn("<Slide_description> was created without expected prop 'isParent'");
    		}

    		if (/*globalSettings*/ ctx[0] === undefined && !("globalSettings" in props)) {
    			console_1.warn("<Slide_description> was created without expected prop 'globalSettings'");
    		}

    		if (/*contents*/ ctx[1] === undefined && !("contents" in props)) {
    			console_1.warn("<Slide_description> was created without expected prop 'contents'");
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

    /* src/footer.svelte generated by Svelte v3.32.1 */

    const { Object: Object_1 } = globals;
    const file$9 = "src/footer.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (42:2) {#if contents.copyright}
    function create_if_block_4$1(ctx) {
    	let section;
    	let div;
    	let show_if = Array.isArray(/*contents*/ ctx[0].copyright);
    	let if_block = show_if && create_if_block_5$1(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$9, 43, 6, 1925);
    			attr_dev(section, "class", "copyright svelte-1wdp62n");
    			add_location(section, file$9, 42, 4, 1891);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1) show_if = Array.isArray(/*contents*/ ctx[0].copyright);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(42:2) {#if contents.copyright}",
    		ctx
    	});

    	return block;
    }

    // (45:8) {#if Array.isArray(contents.copyright)}
    function create_if_block_5$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*contents*/ ctx[0].copyright;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1) {
    				each_value = /*contents*/ ctx[0].copyright;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(45:8) {#if Array.isArray(contents.copyright)}",
    		ctx
    	});

    	return block;
    }

    // (46:10) {#each contents.copyright as copyright, i}
    function create_each_block$6(ctx) {
    	let span;
    	let html_tag;
    	let raw_value = /*copyright*/ ctx[4] + "";

    	let t_value = (/*i*/ ctx[6] + 1 != /*contents*/ ctx[0].copyright.length
    	? ", "
    	: "") + "";

    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			html_tag = new HtmlTag(t);
    			attr_dev(span, "class", "break-scope");
    			add_location(span, file$9, 46, 12, 2044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			html_tag.m(raw_value, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && raw_value !== (raw_value = /*copyright*/ ctx[4] + "")) html_tag.p(raw_value);

    			if (dirty & /*contents*/ 1 && t_value !== (t_value = (/*i*/ ctx[6] + 1 != /*contents*/ ctx[0].copyright.length
    			? ", "
    			: "") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(46:10) {#each contents.copyright as copyright, i}",
    		ctx
    	});

    	return block;
    }

    // (53:2) {#if contents.codeLicense}
    function create_if_block_1$4(ctx) {
    	let section0;
    	let div0;
    	let t0;
    	let t1_value = /*licenses*/ ctx[1][/*contents*/ ctx[0].codeLicense.license] + "";
    	let t1;

    	let t2_value = (/*contents*/ ctx[0].codeLicense.linkLabel && /*contents*/ ctx[0].codeLicense.url
    	? " and available at "
    	: ".") + "";

    	let t2;
    	let t3;
    	let t4;
    	let section1;
    	let div1;
    	let t5;
    	let t6_value = /*licenses*/ ctx[1][/*contents*/ ctx[0].codeLicense.license] + "";
    	let t6;
    	let t7;

    	let t8_value = (/*contents*/ ctx[0].codeLicense.linkLabel && /*contents*/ ctx[0].codeLicense.url
    	? "おり、"
    	: "います。") + "";

    	let t8;
    	let t9;
    	let if_block0 = /*contents*/ ctx[0].codeLicense.linkLabel && /*contents*/ ctx[0].codeLicense.url && create_if_block_3$1(ctx);
    	let if_block1 = /*contents*/ ctx[0].codeLicense.linkLabel && /*contents*/ ctx[0].codeLicense.url && create_if_block_2$3(ctx);

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			div0 = element("div");
    			t0 = text("The source code of this web site is licensed under a ");
    			t1 = text(t1_value);
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			section1 = element("section");
    			div1 = element("div");
    			t5 = text("このWebサイトのソースコードは");
    			t6 = text(t6_value);
    			t7 = text("ライセンスの下で提供されて");
    			t8 = text(t8_value);
    			t9 = space();
    			if (if_block1) if_block1.c();
    			add_location(div0, file$9, 54, 6, 2274);
    			attr_dev(section0, "class", "license svelte-1wdp62n");
    			add_location(section0, file$9, 53, 4, 2242);
    			add_location(div1, file$9, 62, 6, 2705);
    			attr_dev(section1, "class", "license svelte-1wdp62n");
    			add_location(section1, file$9, 61, 4, 2673);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			append_dev(section0, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			if (if_block0) if_block0.m(div0, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div1);
    			append_dev(div1, t5);
    			append_dev(div1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, t9);
    			if (if_block1) if_block1.m(div1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && t1_value !== (t1_value = /*licenses*/ ctx[1][/*contents*/ ctx[0].codeLicense.license] + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*contents*/ 1 && t2_value !== (t2_value = (/*contents*/ ctx[0].codeLicense.linkLabel && /*contents*/ ctx[0].codeLicense.url
    			? " and available at "
    			: ".") + "")) set_data_dev(t2, t2_value);

    			if (/*contents*/ ctx[0].codeLicense.linkLabel && /*contents*/ ctx[0].codeLicense.url) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*contents*/ 1 && t6_value !== (t6_value = /*licenses*/ ctx[1][/*contents*/ ctx[0].codeLicense.license] + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*contents*/ 1 && t8_value !== (t8_value = (/*contents*/ ctx[0].codeLicense.linkLabel && /*contents*/ ctx[0].codeLicense.url
    			? "おり、"
    			: "います。") + "")) set_data_dev(t8, t8_value);

    			if (/*contents*/ ctx[0].codeLicense.linkLabel && /*contents*/ ctx[0].codeLicense.url) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2$3(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(section1);
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(53:2) {#if contents.codeLicense}",
    		ctx
    	});

    	return block;
    }

    // (57:8) {#if contents.codeLicense.linkLabel && contents.codeLicense.url}
    function create_if_block_3$1(ctx) {
    	let a;
    	let t0_value = /*contents*/ ctx[0].codeLicense.linkLabel + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = text(".");
    			attr_dev(a, "href", a_href_value = /*contents*/ ctx[0].codeLicense.url);
    			add_location(a, file$9, 57, 10, 2554);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && t0_value !== (t0_value = /*contents*/ ctx[0].codeLicense.linkLabel + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*contents*/ 1 && a_href_value !== (a_href_value = /*contents*/ ctx[0].codeLicense.url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(57:8) {#if contents.codeLicense.linkLabel && contents.codeLicense.url}",
    		ctx
    	});

    	return block;
    }

    // (65:8) {#if contents.codeLicense.linkLabel && contents.codeLicense.url}
    function create_if_block_2$3(ctx) {
    	let a;
    	let t0_value = /*contents*/ ctx[0].codeLicense.linkLabel + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = text("から入手して利用できます。");
    			attr_dev(a, "href", a_href_value = /*contents*/ ctx[0].codeLicense.url);
    			add_location(a, file$9, 65, 10, 2949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && t0_value !== (t0_value = /*contents*/ ctx[0].codeLicense.linkLabel + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*contents*/ 1 && a_href_value !== (a_href_value = /*contents*/ ctx[0].codeLicense.url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(65:8) {#if contents.codeLicense.linkLabel && contents.codeLicense.url}",
    		ctx
    	});

    	return block;
    }

    // (71:2) {#if contents.assetsLicense.ccType}
    function create_if_block$9(ctx) {
    	let section0;
    	let div0;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let a0_href_value;
    	let t0;
    	let a1;
    	let t1;

    	let t2_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/by/i)
    	? "Attribution"
    	: "") + "";

    	let t2;

    	let t3_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 1
    	? "-"
    	: "") + "";

    	let t3;

    	let t4_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/nc/i)
    	? "NonCommercial"
    	: "") + "";

    	let t4;

    	let t5_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 2
    	? "-"
    	: "") + "";

    	let t5;

    	let t6_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/nd/i)
    	? "NoDerivatives"
    	: "") + "";

    	let t6;

    	let t7_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 3
    	? "-"
    	: "") + "";

    	let t7;

    	let t8_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/sa/i)
    	? "ShareAlike"
    	: "") + "";

    	let t8;
    	let t9;
    	let a1_href_value;
    	let t10;
    	let t11;
    	let section1;
    	let div1;
    	let a2;
    	let img1;
    	let img1_src_value;
    	let a2_href_value;
    	let t12;
    	let a3;
    	let t13;

    	let t14_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/by/i)
    	? "表示"
    	: "") + "";

    	let t14;

    	let t15_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 1
    	? " - "
    	: "") + "";

    	let t15;

    	let t16_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/nc/i)
    	? "非営利"
    	: "") + "";

    	let t16;

    	let t17_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 2
    	? " - "
    	: "") + "";

    	let t17;

    	let t18_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/nd/i)
    	? "改変禁止"
    	: "") + "";

    	let t18;

    	let t19_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 3
    	? " - "
    	: "") + "";

    	let t19;

    	let t20_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/sa/i)
    	? "継承"
    	: "") + "";

    	let t20;
    	let t21;
    	let t22;

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			div0 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = text("All non-source code resources such as images and videos are licensed under a ");
    			a1 = element("a");
    			t1 = text("Creative Commons ");
    			t2 = text(t2_value);
    			t3 = text(t3_value);
    			t4 = text(t4_value);
    			t5 = text(t5_value);
    			t6 = text(t6_value);
    			t7 = text(t7_value);
    			t8 = text(t8_value);
    			t9 = text(" 4.0 International License");
    			t10 = text(".");
    			t11 = space();
    			section1 = element("section");
    			div1 = element("div");
    			a2 = element("a");
    			img1 = element("img");
    			t12 = text("全てのソースコード以外の画像や動画などのリソースは ");
    			a3 = element("a");
    			t13 = text("クリエイティブ・コモンズ ");
    			t14 = text(t14_value);
    			t15 = text(t15_value);
    			t16 = text(t16_value);
    			t17 = text(t17_value);
    			t18 = text(t18_value);
    			t19 = text(t19_value);
    			t20 = text(t20_value);
    			t21 = text(" 4.0 国際 ライセンス");
    			t22 = text("の下に提供されています。");
    			attr_dev(img0, "alt", "Creative Commons License");
    			set_style(img0, "border-width", "0");
    			set_style(img0, "display", "inline-block");
    			set_style(img0, "vertical-align", "middle");
    			set_style(img0, "margin-right", "1ch");
    			if (img0.src !== (img0_src_value = "https://i.creativecommons.org/l/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/80x15.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$9, 73, 105, 3278);
    			attr_dev(a0, "rel", "license");
    			attr_dev(a0, "href", a0_href_value = "http://creativecommons.org/licenses/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/");
    			add_location(a0, file$9, 73, 8, 3181);
    			attr_dev(a1, "rel", "license");
    			attr_dev(a1, "href", a1_href_value = "http://creativecommons.org/licenses/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/");
    			add_location(a1, file$9, 73, 393, 3566);
    			add_location(div0, file$9, 72, 6, 3167);
    			attr_dev(section0, "class", "creative-commons svelte-1wdp62n");
    			add_location(section0, file$9, 71, 4, 3126);
    			attr_dev(img1, "alt", "クリエイティブ・コモンズ・ライセンス");
    			set_style(img1, "border-width", "0");
    			set_style(img1, "display", "inline-block");
    			set_style(img1, "vertical-align", "middle");
    			set_style(img1, "margin-right", "1ch");
    			if (img1.src !== (img1_src_value = "https://i.creativecommons.org/l/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/80x15.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$9, 78, 113, 4368);
    			attr_dev(a2, "rel", "license");
    			attr_dev(a2, "href", a2_href_value = "https://creativecommons.org/licenses/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/deed.ja");
    			add_location(a2, file$9, 78, 8, 4263);
    			attr_dev(a3, "rel", "license");
    			attr_dev(a3, "href", "https://creativecommons.org/licenses/by-nd/4.0/deed.ja");
    			add_location(a3, file$9, 78, 344, 4599);
    			add_location(div1, file$9, 77, 6, 4249);
    			attr_dev(section1, "class", "creative-commons svelte-1wdp62n");
    			add_location(section1, file$9, 76, 4, 4208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			append_dev(section0, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, a1);
    			append_dev(a1, t1);
    			append_dev(a1, t2);
    			append_dev(a1, t3);
    			append_dev(a1, t4);
    			append_dev(a1, t5);
    			append_dev(a1, t6);
    			append_dev(a1, t7);
    			append_dev(a1, t8);
    			append_dev(a1, t9);
    			append_dev(div0, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div1);
    			append_dev(div1, a2);
    			append_dev(a2, img1);
    			append_dev(div1, t12);
    			append_dev(div1, a3);
    			append_dev(a3, t13);
    			append_dev(a3, t14);
    			append_dev(a3, t15);
    			append_dev(a3, t16);
    			append_dev(a3, t17);
    			append_dev(a3, t18);
    			append_dev(a3, t19);
    			append_dev(a3, t20);
    			append_dev(a3, t21);
    			append_dev(div1, t22);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && img0.src !== (img0_src_value = "https://i.creativecommons.org/l/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/80x15.png")) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*contents*/ 1 && a0_href_value !== (a0_href_value = "http://creativecommons.org/licenses/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/")) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty & /*contents*/ 1 && t2_value !== (t2_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/by/i)
    			? "Attribution"
    			: "") + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*contents*/ 1 && t3_value !== (t3_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 1
    			? "-"
    			: "") + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*contents*/ 1 && t4_value !== (t4_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/nc/i)
    			? "NonCommercial"
    			: "") + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*contents*/ 1 && t5_value !== (t5_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 2
    			? "-"
    			: "") + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*contents*/ 1 && t6_value !== (t6_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/nd/i)
    			? "NoDerivatives"
    			: "") + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*contents*/ 1 && t7_value !== (t7_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 3
    			? "-"
    			: "") + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*contents*/ 1 && t8_value !== (t8_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/sa/i)
    			? "ShareAlike"
    			: "") + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*contents*/ 1 && a1_href_value !== (a1_href_value = "http://creativecommons.org/licenses/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/")) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			if (dirty & /*contents*/ 1 && img1.src !== (img1_src_value = "https://i.creativecommons.org/l/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/80x15.png")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (dirty & /*contents*/ 1 && a2_href_value !== (a2_href_value = "https://creativecommons.org/licenses/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/deed.ja")) {
    				attr_dev(a2, "href", a2_href_value);
    			}

    			if (dirty & /*contents*/ 1 && t14_value !== (t14_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/by/i)
    			? "表示"
    			: "") + "")) set_data_dev(t14, t14_value);

    			if (dirty & /*contents*/ 1 && t15_value !== (t15_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 1
    			? " - "
    			: "") + "")) set_data_dev(t15, t15_value);

    			if (dirty & /*contents*/ 1 && t16_value !== (t16_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/nc/i)
    			? "非営利"
    			: "") + "")) set_data_dev(t16, t16_value);

    			if (dirty & /*contents*/ 1 && t17_value !== (t17_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 2
    			? " - "
    			: "") + "")) set_data_dev(t17, t17_value);

    			if (dirty & /*contents*/ 1 && t18_value !== (t18_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/nd/i)
    			? "改変禁止"
    			: "") + "")) set_data_dev(t18, t18_value);

    			if (dirty & /*contents*/ 1 && t19_value !== (t19_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/-/gi).length >= 3
    			? " - "
    			: "") + "")) set_data_dev(t19, t19_value);

    			if (dirty & /*contents*/ 1 && t20_value !== (t20_value = (/*contents*/ ctx[0].assetsLicense.ccType.match(/sa/i)
    			? "継承"
    			: "") + "")) set_data_dev(t20, t20_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(section1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(71:2) {#if contents.assetsLicense.ccType}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let footer;
    	let t0;
    	let t1;
    	let if_block0 = /*contents*/ ctx[0].copyright && create_if_block_4$1(ctx);
    	let if_block1 = /*contents*/ ctx[0].codeLicense && create_if_block_1$4(ctx);
    	let if_block2 = /*contents*/ ctx[0].assetsLicense.ccType && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			set_style(footer, "--itemsCount", /*func*/ ctx[3]());
    			attr_dev(footer, "class", "svelte-1wdp62n");
    			add_location(footer, file$9, 40, 0, 1718);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			if (if_block0) if_block0.m(footer, null);
    			append_dev(footer, t0);
    			if (if_block1) if_block1.m(footer, null);
    			append_dev(footer, t1);
    			if (if_block2) if_block2.m(footer, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*contents*/ ctx[0].copyright) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(footer, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*contents*/ ctx[0].codeLicense) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$4(ctx);
    					if_block1.c();
    					if_block1.m(footer, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*contents*/ ctx[0].assetsLicense.ccType) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$9(ctx);
    					if_block2.c();
    					if_block2.m(footer, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*contents*/ 1) {
    				set_style(footer, "--itemsCount", /*func*/ ctx[3]());
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Footer", slots, []);
    	let { contents } = $$props, { globalSettings } = $$props;

    	const licenses = {
    		"afl-3.0": "Academic Free License v3.0",
    		"apache-2.0": "Apache license 2.0",
    		"artistic-2.0": "Artistic license 2.0",
    		"bsl-1.0": "Boost Software License 1.0",
    		"bsd-2-clause": "BSD 2-clause \"Simplified\" license",
    		"bsd-3-clause": "BSD 3-clause \"New\" or \"Revised\" license",
    		"bsd-3-clause-clear": "BSD 3-clause Clear license",
    		"cc": "Creative Commons license family",
    		"cc0-1.0": "Creative Commons Zero v1.0 Universal",
    		"cc-by-4.0": "Creative Commons Attribution 4.0",
    		"cc-by-sa-4.0": "Creative Commons Attribution Share Alike 4.0",
    		"wtfpl": "Do What The F*ck You Want To Public License",
    		"ecl-2.0": "Educational Community License v2.0",
    		"epl-1.0": "Eclipse Public License 1.0",
    		"epl-2.0": "Eclipse Public License 2.0",
    		"eupl-1.1": "European Union Public License 1.1",
    		"agpl-3.0": "GNU Affero General Public License v3.0",
    		"gpl": "GNU General Public License family",
    		"gpl-2.0": "GNU General Public License v2.0",
    		"gpl-3.0": "GNU General Public License v3.0",
    		"lgpl": "GNU Lesser General Public License family",
    		"lgpl-2.1": "GNU Lesser General Public License v2.1",
    		"lgpl-3.0": "GNU Lesser General Public License v3.0",
    		"isc": "ISC",
    		"lppl-1.3c": "LaTeX Project Public License v1.3c",
    		"ms-pl": "Microsoft Public License",
    		"mit": "MIT",
    		"mpl-2.0": "Mozilla Public License 2.0",
    		"osl-3.0": "Open Software License 3.0",
    		"postgresql": "PostgreSQL License",
    		"ofl-1.1": "SIL Open Font License 1.1",
    		"ncsa": "University of Illinois/NCSA Open Source License",
    		"unlicense": "The Unlicense",
    		"zlib": "zLib License"
    	};

    	const writable_props = ["contents", "globalSettings"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	const func = () => {
    		let count = 0;
    		Object.keys(contents).forEach(v => count += v == "copyright" ? 1 : 2);
    		return count;
    	};

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(2, globalSettings = $$props.globalSettings);
    	};

    	$$self.$capture_state = () => ({ contents, globalSettings, licenses });

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(2, globalSettings = $$props.globalSettings);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contents, licenses, globalSettings, func];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { contents: 0, globalSettings: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Footer> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[2] === undefined && !("globalSettings" in props)) {
    			console.warn("<Footer> was created without expected prop 'globalSettings'");
    		}
    	}

    	get contents() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/cards.svelte generated by Svelte v3.32.1 */
    const file$a = "src/cards.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (34:10) {#if card.imageId}
    function create_if_block$a(ctx) {
    	let div;
    	let picture;
    	let current;

    	picture = new Picture({
    			props: {
    				imgClass: "card_left-img card_img",
    				contents: /*contents*/ ctx[0],
    				globalSettings: /*globalSettings*/ ctx[1],
    				imageId: /*card*/ ctx[7].imageId,
    				sizes: "(min-aspect-ratio: 16/9) " + /*standardWidth*/ ctx[2] / 3 / 3 + "vw, " + /*standardWidth*/ ctx[2] / 2 / 3 + "vw, (max-aspect-ratio: 1/1) " + /*standardWidth*/ ctx[2] * 0.8 / 3 + "vw, (max-aspect-ratio: 3/4) " + /*standardWidth*/ ctx[2] / 3 + "vw",
    				width: "1",
    				height: "1"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(picture.$$.fragment);
    			attr_dev(div, "class", "left svelte-i515aq");
    			add_location(div, file$a, 34, 12, 1028);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(picture, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const picture_changes = {};
    			if (dirty & /*contents*/ 1) picture_changes.contents = /*contents*/ ctx[0];
    			if (dirty & /*globalSettings*/ 2) picture_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*contents*/ 1) picture_changes.imageId = /*card*/ ctx[7].imageId;
    			if (dirty & /*standardWidth*/ 4) picture_changes.sizes = "(min-aspect-ratio: 16/9) " + /*standardWidth*/ ctx[2] / 3 / 3 + "vw, " + /*standardWidth*/ ctx[2] / 2 / 3 + "vw, (max-aspect-ratio: 1/1) " + /*standardWidth*/ ctx[2] * 0.8 / 3 + "vw, (max-aspect-ratio: 3/4) " + /*standardWidth*/ ctx[2] / 3 + "vw";
    			picture.$set(picture_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(picture.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(picture.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(picture);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(34:10) {#if card.imageId}",
    		ctx
    	});

    	return block;
    }

    // (42:14) {#each card.post as post}
    function create_each_block_2$2(ctx) {
    	let span;
    	let t_value = /*post*/ ctx[13] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-i515aq");
    			add_location(span, file$a, 42, 16, 1596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && t_value !== (t_value = /*post*/ ctx[13] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(42:14) {#each card.post as post}",
    		ctx
    	});

    	return block;
    }

    // (53:10) {#each card.accounts as account}
    function create_each_block_1$3(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_width_value;
    	let img_height_value;
    	let t0;
    	let span;
    	let t1_value = /*account*/ ctx[10].id + "";
    	let t1;
    	let t2;
    	let a_class_value;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();

    			if (img.src !== (img_src_value = "" + (/*globalSettings*/ ctx[1].imageDirectory + "/" + (/*account*/ ctx[10].name == "youtube"
    			? "youtube-white"
    			: /*account*/ ctx[10].name) + ".svg"))) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "alt", img_alt_value = "" + (/*account*/ ctx[10].name + "のアイコン"));
    			attr_dev(img, "width", img_width_value = /*socialConsts*/ ctx[5].aspectRatios[/*account*/ ctx[10].name].width);
    			attr_dev(img, "height", img_height_value = /*socialConsts*/ ctx[5].aspectRatios[/*account*/ ctx[10].name].height);
    			attr_dev(img, "class", "svelte-i515aq");
    			add_location(img, file$a, 55, 14, 2405);
    			attr_dev(span, "class", "id svelte-i515aq");
    			add_location(span, file$a, 56, 14, 2664);
    			attr_dev(a, "class", a_class_value = "social-button " + /*account*/ ctx[10].name + " " + (/*card*/ ctx[7].accounts.length > 2 ? "iconOnly" : "") + " svelte-i515aq");

    			attr_dev(a, "href", a_href_value = /*account*/ ctx[10].customUrl
    			? /*account*/ ctx[10].customUrl
    			: `https://${/*socialConsts*/ ctx[5].urls[/*account*/ ctx[10].name]}/${/*account*/ ctx[10].id}`);

    			add_location(a, file$a, 53, 12, 2185);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    			append_dev(a, t0);
    			append_dev(a, span);
    			append_dev(span, t1);
    			append_dev(a, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*globalSettings, contents*/ 3 && img.src !== (img_src_value = "" + (/*globalSettings*/ ctx[1].imageDirectory + "/" + (/*account*/ ctx[10].name == "youtube"
    			? "youtube-white"
    			: /*account*/ ctx[10].name) + ".svg"))) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*contents*/ 1 && img_alt_value !== (img_alt_value = "" + (/*account*/ ctx[10].name + "のアイコン"))) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*contents*/ 1 && img_width_value !== (img_width_value = /*socialConsts*/ ctx[5].aspectRatios[/*account*/ ctx[10].name].width)) {
    				attr_dev(img, "width", img_width_value);
    			}

    			if (dirty & /*contents*/ 1 && img_height_value !== (img_height_value = /*socialConsts*/ ctx[5].aspectRatios[/*account*/ ctx[10].name].height)) {
    				attr_dev(img, "height", img_height_value);
    			}

    			if (dirty & /*contents*/ 1 && t1_value !== (t1_value = /*account*/ ctx[10].id + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*contents*/ 1 && a_class_value !== (a_class_value = "social-button " + /*account*/ ctx[10].name + " " + (/*card*/ ctx[7].accounts.length > 2 ? "iconOnly" : "") + " svelte-i515aq")) {
    				attr_dev(a, "class", a_class_value);
    			}

    			if (dirty & /*contents*/ 1 && a_href_value !== (a_href_value = /*account*/ ctx[10].customUrl
    			? /*account*/ ctx[10].customUrl
    			: `https://${/*socialConsts*/ ctx[5].urls[/*account*/ ctx[10].name]}/${/*account*/ ctx[10].id}`)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(53:10) {#each card.accounts as account}",
    		ctx
    	});

    	return block;
    }

    // (30:2) {#each contents.cards as card}
    function create_each_block$7(ctx) {
    	let div8;
    	let div7;
    	let div5;
    	let t0;
    	let div4;
    	let div0;
    	let t1_value = /*card*/ ctx[7].name + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let div3;
    	let div2;
    	let t4;
    	let picture;
    	let div4_class_value;
    	let t5;
    	let div6;
    	let t6;
    	let current;
    	let if_block = /*card*/ ctx[7].imageId && create_if_block$a(ctx);
    	let each_value_2 = /*card*/ ctx[7].post;
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	picture = new Picture({
    			props: {
    				imgClass: "card_img",
    				contents: /*contents*/ ctx[0],
    				globalSettings: /*globalSettings*/ ctx[1],
    				imageDirectory: /*globalSettings*/ ctx[1].imageDirectory,
    				imageId: /*contents*/ ctx[0].logoImageId,
    				imageSizes: /*contents*/ ctx[0].logoImageSizes,
    				sizes: "" + (3 * /*ch*/ ctx[4] + "px"),
    				width: /*contents*/ ctx[0].logoAspectRatio.width,
    				height: /*contents*/ ctx[0].logoAspectRatio.height
    			},
    			$$inline: true
    		});

    	let each_value_1 = /*card*/ ctx[7].accounts;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div7 = element("div");
    			div5 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div4 = element("div");
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t4 = space();
    			create_component(picture.$$.fragment);
    			t5 = space();
    			div6 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			attr_dev(div0, "class", "name svelte-i515aq");
    			add_location(div0, file$a, 39, 12, 1473);
    			attr_dev(div1, "class", "post svelte-i515aq");
    			add_location(div1, file$a, 40, 12, 1521);
    			set_style(div2, "opacity", "0");
    			set_style(div2, "width", "1ch");
    			add_location(div2, file$a, 46, 14, 1702);
    			attr_dev(div3, "class", "logo svelte-i515aq");
    			add_location(div3, file$a, 45, 12, 1669);
    			attr_dev(div4, "class", div4_class_value = "right " + (/*card*/ ctx[7].imageId ? "" : "noImage") + " svelte-i515aq");
    			add_location(div4, file$a, 38, 10, 1409);
    			attr_dev(div5, "class", "upper svelte-i515aq");
    			add_location(div5, file$a, 32, 8, 967);
    			attr_dev(div6, "class", "lower svelte-i515aq");
    			add_location(div6, file$a, 51, 8, 2110);
    			attr_dev(div7, "class", "card svelte-i515aq");
    			add_location(div7, file$a, 31, 6, 940);
    			attr_dev(div8, "class", "card_wrapper svelte-i515aq");
    			add_location(div8, file$a, 30, 4, 907);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, div5);
    			if (if_block) if_block.m(div5, null);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div0, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			/*div2_binding*/ ctx[6](div2);
    			append_dev(div3, t4);
    			mount_component(picture, div3, null);
    			append_dev(div7, t5);
    			append_dev(div7, div6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div6, null);
    			}

    			append_dev(div8, t6);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*card*/ ctx[7].imageId) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*contents*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div5, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*contents*/ 1) && t1_value !== (t1_value = /*card*/ ctx[7].name + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*contents*/ 1) {
    				each_value_2 = /*card*/ ctx[7].post;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			const picture_changes = {};
    			if (dirty & /*contents*/ 1) picture_changes.contents = /*contents*/ ctx[0];
    			if (dirty & /*globalSettings*/ 2) picture_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*globalSettings*/ 2) picture_changes.imageDirectory = /*globalSettings*/ ctx[1].imageDirectory;
    			if (dirty & /*contents*/ 1) picture_changes.imageId = /*contents*/ ctx[0].logoImageId;
    			if (dirty & /*contents*/ 1) picture_changes.imageSizes = /*contents*/ ctx[0].logoImageSizes;
    			if (dirty & /*ch*/ 16) picture_changes.sizes = "" + (3 * /*ch*/ ctx[4] + "px");
    			if (dirty & /*contents*/ 1) picture_changes.width = /*contents*/ ctx[0].logoAspectRatio.width;
    			if (dirty & /*contents*/ 1) picture_changes.height = /*contents*/ ctx[0].logoAspectRatio.height;
    			picture.$set(picture_changes);

    			if (!current || dirty & /*contents*/ 1 && div4_class_value !== (div4_class_value = "right " + (/*card*/ ctx[7].imageId ? "" : "noImage") + " svelte-i515aq")) {
    				attr_dev(div4, "class", div4_class_value);
    			}

    			if (dirty & /*contents, socialConsts, globalSettings*/ 35) {
    				each_value_1 = /*card*/ ctx[7].accounts;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div6, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(picture.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(picture.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_1, detaching);
    			/*div2_binding*/ ctx[6](null);
    			destroy_component(picture);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(30:2) {#each contents.cards as card}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let current;
    	let each_value = /*contents*/ ctx[0].cards;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "card_container svelte-i515aq");
    			add_location(div, file$a, 28, 0, 841);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*contents, socialConsts, globalSettings, ch, ch2px, standardWidth*/ 63) {
    				each_value = /*contents*/ ctx[0].cards;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
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
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Cards", slots, []);

    	let { contents } = $$props,
    		{ globalSettings } = $$props,
    		{ standardWidth } = $$props;

    	const socialConsts = {
    		urls: {
    			"twitter": "twitter.com",
    			"facebook": "facebook.com",
    			"note": "note.com",
    			"github": "github.com",
    			"qiita": "qiita.com",
    			"youtube": "www.youtube.com/c"
    		},
    		aspectRatios: {
    			"twitter": { width: 2499, height: 2032 },
    			"facebook": { width: 971, height: 965 },
    			"note": { width: 167, height: 188 },
    			"github": { width: 362, height: 354 },
    			"qiita": { width: 1, height: 1 },
    			"youtube": { width: 44, height: 31 }
    		}
    	};

    	let ch2px;
    	let ch;
    	onMount(() => $$invalidate(4, ch = ch2px.getBoundingClientRect().width));
    	const writable_props = ["contents", "globalSettings", "standardWidth"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cards> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ch2px = $$value;
    			$$invalidate(3, ch2px);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
    	};

    	$$self.$capture_state = () => ({
    		contents,
    		globalSettings,
    		standardWidth,
    		Picture,
    		onMount,
    		socialConsts,
    		ch2px,
    		ch
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
    		if ("ch2px" in $$props) $$invalidate(3, ch2px = $$props.ch2px);
    		if ("ch" in $$props) $$invalidate(4, ch = $$props.ch);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contents, globalSettings, standardWidth, ch2px, ch, socialConsts, div2_binding];
    }

    class Cards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			contents: 0,
    			globalSettings: 1,
    			standardWidth: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cards",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Cards> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[1] === undefined && !("globalSettings" in props)) {
    			console.warn("<Cards> was created without expected prop 'globalSettings'");
    		}

    		if (/*standardWidth*/ ctx[2] === undefined && !("standardWidth" in props)) {
    			console.warn("<Cards> was created without expected prop 'standardWidth'");
    		}
    	}

    	get contents() {
    		throw new Error("<Cards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Cards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get globalSettings() {
    		throw new Error("<Cards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set globalSettings(value) {
    		throw new Error("<Cards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get standardWidth() {
    		throw new Error("<Cards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set standardWidth(value) {
    		throw new Error("<Cards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.1 */
    const file$b = "src/App.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i].title;
    	child_ctx[6] = list[i].subtitle;
    	child_ctx[7] = list[i].themeColor;
    	child_ctx[8] = list[i].sectionType;
    	child_ctx[9] = list[i].contents;
    	child_ctx[10] = list[i].id;
    	child_ctx[11] = list[i].pairId;
    	child_ctx[12] = list[i].isParent;
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (25:0) {#if settings.find(v => v.sectionType == 'navHeader')}
    function create_if_block_7$1(ctx) {
    	let nheader;
    	let current;

    	nheader = new Nav_header({
    			props: {
    				contents: /*settings*/ ctx[0].find(func_1).contents,
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
    			if (dirty & /*settings*/ 1) nheader_changes.contents = /*settings*/ ctx[0].find(func_1).contents;
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
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(25:0) {#if settings.find(v => v.sectionType == 'navHeader')}",
    		ctx
    	});

    	return block;
    }

    // (36:41) 
    function create_if_block_3$2(ctx) {
    	let cframe;
    	let current;

    	cframe = new Common_frame({
    			props: {
    				id: /*id*/ ctx[10],
    				title: /*title*/ ctx[5],
    				subtitle: /*subtitle*/ ctx[6],
    				themeColor: /*themeColor*/ ctx[7],
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
    			if (dirty & /*settings*/ 1) cframe_changes.id = /*id*/ ctx[10];
    			if (dirty & /*settings*/ 1) cframe_changes.title = /*title*/ ctx[5];
    			if (dirty & /*settings*/ 1) cframe_changes.subtitle = /*subtitle*/ ctx[6];
    			if (dirty & /*settings*/ 1) cframe_changes.themeColor = /*themeColor*/ ctx[7];
    			if (dirty & /*globalSettings*/ 2) cframe_changes.globalSettings = /*globalSettings*/ ctx[1];

    			if (dirty & /*$$scope, settings, globalSettings, standardWidth*/ 32775) {
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
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(36:41) ",
    		ctx
    	});

    	return block;
    }

    // (34:38) 
    function create_if_block_2$4(ctx) {
    	let footer;
    	let current;

    	footer = new Footer({
    			props: {
    				contents: /*contents*/ ctx[9],
    				globalSettings: /*globalSettings*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(footer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const footer_changes = {};
    			if (dirty & /*settings*/ 1) footer_changes.contents = /*contents*/ ctx[9];
    			if (dirty & /*globalSettings*/ 2) footer_changes.globalSettings = /*globalSettings*/ ctx[1];
    			footer.$set(footer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(34:38) ",
    		ctx
    	});

    	return block;
    }

    // (32:41) 
    function create_if_block_1$5(ctx) {
    	let desc;
    	let current;

    	desc = new Slide_description({
    			props: {
    				contents: /*contents*/ ctx[9],
    				globalSettings: /*globalSettings*/ ctx[1],
    				pairId: /*pairId*/ ctx[11],
    				isParent: /*isParent*/ ctx[12]
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
    			if (dirty & /*settings*/ 1) desc_changes.contents = /*contents*/ ctx[9];
    			if (dirty & /*globalSettings*/ 2) desc_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*settings*/ 1) desc_changes.pairId = /*pairId*/ ctx[11];
    			if (dirty & /*settings*/ 1) desc_changes.isParent = /*isParent*/ ctx[12];
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
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(32:41) ",
    		ctx
    	});

    	return block;
    }

    // (30:4) {#if sectionType == "slideHero"}
    function create_if_block$b(ctx) {
    	let heros;
    	let current;

    	function func_2(...args) {
    		return /*func_2*/ ctx[3](/*pairId*/ ctx[11], ...args);
    	}

    	heros = new Slide_hero_swiper({
    			props: {
    				contents: /*contents*/ ctx[9] || /*settings*/ ctx[0].find(func_2).contents,
    				globalSettings: /*globalSettings*/ ctx[1],
    				pairId: /*pairId*/ ctx[11],
    				isParent: /*isParent*/ ctx[12],
    				standardWidth: /*standardWidth*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(heros.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(heros, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const heros_changes = {};
    			if (dirty & /*settings*/ 1) heros_changes.contents = /*contents*/ ctx[9] || /*settings*/ ctx[0].find(func_2).contents;
    			if (dirty & /*globalSettings*/ 2) heros_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*settings*/ 1) heros_changes.pairId = /*pairId*/ ctx[11];
    			if (dirty & /*settings*/ 1) heros_changes.isParent = /*isParent*/ ctx[12];
    			if (dirty & /*standardWidth*/ 4) heros_changes.standardWidth = /*standardWidth*/ ctx[2];
    			heros.$set(heros_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heros.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heros.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(heros, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(30:4) {#if sectionType == \\\"slideHero\\\"}",
    		ctx
    	});

    	return block;
    }

    // (42:41) 
    function create_if_block_6$1(ctx) {
    	let cards;
    	let current;

    	cards = new Cards({
    			props: {
    				contents: /*contents*/ ctx[9],
    				globalSettings: /*globalSettings*/ ctx[1],
    				standardWidth: /*standardWidth*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cards.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cards, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cards_changes = {};
    			if (dirty & /*settings*/ 1) cards_changes.contents = /*contents*/ ctx[9];
    			if (dirty & /*globalSettings*/ 2) cards_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*standardWidth*/ 4) cards_changes.standardWidth = /*standardWidth*/ ctx[2];
    			cards.$set(cards_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cards, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(42:41) ",
    		ctx
    	});

    	return block;
    }

    // (40:45) 
    function create_if_block_5$2(ctx) {
    	let ilist;
    	let current;

    	ilist = new Image_list({
    			props: {
    				contents: /*contents*/ ctx[9],
    				globalSettings: /*globalSettings*/ ctx[1],
    				standardWidth: /*standardWidth*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(ilist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ilist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const ilist_changes = {};
    			if (dirty & /*settings*/ 1) ilist_changes.contents = /*contents*/ ctx[9];
    			if (dirty & /*globalSettings*/ 2) ilist_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*standardWidth*/ 4) ilist_changes.standardWidth = /*standardWidth*/ ctx[2];
    			ilist.$set(ilist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ilist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ilist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ilist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(40:45) ",
    		ctx
    	});

    	return block;
    }

    // (38:8) {#if sectionType == "static"}
    function create_if_block_4$2(ctx) {
    	let static_1;
    	let current;

    	static_1 = new Static_content({
    			props: {
    				contents: /*contents*/ ctx[9],
    				globalSettings: /*globalSettings*/ ctx[1],
    				standardWidth: /*standardWidth*/ ctx[2]
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
    			if (dirty & /*settings*/ 1) static_1_changes.contents = /*contents*/ ctx[9];
    			if (dirty & /*globalSettings*/ 2) static_1_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*standardWidth*/ 4) static_1_changes.standardWidth = /*standardWidth*/ ctx[2];
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
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(38:8) {#if sectionType == \\\"static\\\"}",
    		ctx
    	});

    	return block;
    }

    // (37:6) <Cframe {id} {title} {subtitle} {themeColor} {globalSettings}>
    function create_default_slot$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_4$2, create_if_block_5$2, create_if_block_6$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*sectionType*/ ctx[8] == "static") return 0;
    		if (/*sectionType*/ ctx[8] == "imageList") return 1;
    		if (/*sectionType*/ ctx[8] == "cards") return 2;
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
    		source: "(37:6) <Cframe {id} {title} {subtitle} {themeColor} {globalSettings}>",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#each settings as {title, subtitle, themeColor, sectionType, contents, id, pairId, isParent}
    function create_each_block$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_if_block_1$5, create_if_block_2$4, create_if_block_3$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*sectionType*/ ctx[8] == "slideHero") return 0;
    		if (/*sectionType*/ ctx[8] == "slideDesc") return 1;
    		if (/*sectionType*/ ctx[8] == "footer") return 2;
    		if (/*sectionType*/ ctx[8] != "navHeader") return 3;
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
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(29:2) {#each settings as {title, subtitle, themeColor, sectionType, contents, id, pairId, isParent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let show_if = /*settings*/ ctx[0].find(func);
    	let t;
    	let main;
    	let current;
    	let if_block = show_if && create_if_block_7$1(ctx);
    	let each_value = /*settings*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
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

    			set_style(main, "--transitionDuration", /*globalSettings*/ ctx[1].transitionDuration + "ms");
    			set_style(main, "--standardWidth", /*standardWidth*/ ctx[2] + "vw");
    			add_location(main, file$b, 27, 0, 1124);
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
    					if_block = create_if_block_7$1(ctx);
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

    			if (dirty & /*settings, globalSettings, standardWidth*/ 7) {
    				each_value = /*settings*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
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
    				set_style(main, "--transitionDuration", /*globalSettings*/ ctx[1].transitionDuration + "ms");
    			}

    			if (!current || dirty & /*standardWidth*/ 4) {
    				set_style(main, "--standardWidth", /*standardWidth*/ ctx[2] + "vw");
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = v => v.sectionType == "navHeader";
    const func_1 = v => v.sectionType == "navHeader";

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { settings } = $$props;
    	let { globalSettings } = $$props;
    	let standardWidth;

    	const setStandardWidth = (media, v) => $$invalidate(2, standardWidth = media.matches
    	? v.value
    	: globalSettings.standardWidths[globalSettings.standardWidths.findIndex(w => w.mediaQuery == "default")].value);

    	globalSettings.standardWidths.forEach(v => {
    		if (v.mediaQuery && v.mediaQuery != "default") {
    			let media = matchMedia(`(${v.mediaQuery})`);
    			if (!standardWidth) setStandardWidth(media, v);
    			media.addEventListener("change", () => setStandardWidth(media, v));
    		}
    	});

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
    		Ilist: Image_list,
    		HeroS: Slide_hero_swiper,
    		Desc: Slide_description,
    		Footer,
    		Cards,
    		settings,
    		globalSettings,
    		standardWidth,
    		setStandardWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ("settings" in $$props) $$invalidate(0, settings = $$props.settings);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [settings, globalSettings, standardWidth, func_2];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { settings: 0, globalSettings: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$e.name
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
          standardWidths: [
            {
              mediaQuery: 'min-aspect-ratio: 16/9',
              value: 70
            },
            {
              mediaQuery: 'default',
              value: 80
            },
            {
              mediaQuery: 'max-aspect-ratio: 3/4',
              value: 90
            },
          ],
          imageDirectory: './img/',
          imageExtensionsShort: ['webp', 'png'],
          imageSizes: [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
          tinyImageSize: 15,
          tinyImageExtensionsShort: ['webp', 'jpg'],
          transitionDuration: 500, //ms
        },
        settings: [
          {
            sectionType: 'navHeader',
            themeColor: '#fff',
            contents: {
              imageId: 'ssm-logo-landscape',
              aspectRatio: {width: 7, height: 3},
              items: [
                {id: 'top', label: '作品'},
                {id: 'news', label: 'ニュース'},
                {id: 'about', label: 'チームについて'},
                {id: 'members', label: 'メンバー'}
              ]
            }
          },
          {
            sectionType: 'slideHero',
            pairId: 'hero',
          },
          {
            sectionType: 'slideDesc',
            pairId: 'hero',
            isParent: true,
            contents: {
              articles: [
                {
                  title: 'れーぞく！ネクロマンスちゃん',
                  subtitle: 'れーぞく全方位シューティングゲーム',
                  themeColor: '#ed773e',
                  imageId: 'necromance_ss',
                  alt: 'れーぞく！ネクロマンスちゃんのプレイ画面',
                  aspectRatio: {width: 16, height: 9},
                  description: [
                    'スーパースターマイン第一作目のSTG。',
                    '敵弾をスレスレでかわすことで強大な必殺技をブッ放せる、という『れーぞくシステム』を搭載。リスクとリターンの取捨選択に手に汗握る、白熱したバトルを楽しめる。',
                    'ストーリーや世界観をこだわり抜き、カットイン映像やボイス付きシナリオパートといったリッチな表現にも挑戦。',
                    'ゲームクリエイター甲子園2020にて総合大賞3位、審査員特別賞、話題賞受賞。コミックマーケット97、デジゲー博2020に出展。',
                    'Boothにて体験版を配信中。'
                  ],
                  buttons: [
                    {
                      popup: 'Boothにて販売中',
                      title: '体験版を見てみる',
                      target: 'https://superstarmine.booth.pm/items/2618292'
                    }
                  ],
                  slides: [
                    {
                      type: 'youtube',
                      id: 'kQc84ApB2OM'
                    }
                  ],
                  specs: {
                    times: [
                      {
                        year: '2019',
                        month: '8',
                        annotation: '〜',
                      }
                    ],
                    platforms: [
                      {
                        name: 'Windows',
                        version: '7',
                        orLater: true
                      },
                      {
                        name: 'macOS',
                        version: 'Sierra',
                        orLater: true
                      }
                    ]
                  }
                },
                {
                  title: 'SPINNER',
                  subtitle: '新感覚ホッケーアクションゲーム',
                  themeColor: '#464646',
                  imageId: 'spinner_ss',
                  alt: 'SPINNERのプレイ画面',
                  aspectRatio: {width: 16, height: 9},
                  description: [
                    'ハンドルコントローラーを用いて戦う1vs1のホッケーゲーム。',
                    'ゴールがなく、パックが端のラインを超えると対となるラインにワープするという仕様が特徴。',
                    'GCGEXPO2019にて総合優勝。',
                    '2020年2月に開催され、200名近くの業界人が参加したゲーム業界年始あいさつ会では体験会を開催し、プロクリエイターの方々から建設的なフィードバックをいただいた。'
                  ],
                  buttons: [
                    {
                      title: '紹介記事を読む',
                      target: 'https://game.creators-guild.com/g4c/%e3%82%b2%e3%83%bc%e3%83%a0%e6%a5%ad%e7%95%8c%e4%ba%a4%e6%b5%81%e4%bc%9a%e3%81%ab%e6%bd%9c%e5%85%a5%ef%bc%81/'
                    }
                  ],
                  specs: {
                    times: [
                      {
                        year: '2019',
                        month: '11',
                        annotation: '(2週間)',
                      }
                    ],
                    platforms: [
                      {
                        name: 'Windows',
                        version: '7',
                        orLater: true
                      },
                      {
                        name: 'macOS',
                        version: 'Sierra',
                        orLater: true
                      }
                    ]
                  }
                },
                {
                  title: 'CUPRUNMEN',
                  subtitle: 'VRMタイムアタックランゲーム',
                  themeColor: '#b56c4e',
                  imageId: 'cup-run_ss',
                  alt: 'CUPRUNMENのプレイ画面',
                  aspectRatio: {width: 16, height: 9},
                  description: [
                    '初となるフルリモート体制で制作したランゲーム。',
                    '技術的にユニークな点として、「プレイヤーの向きとステージの法線ベクトルから溢れるスープ量を算出する」という処理を行っている。',
                    'また、ローカルのVRMアバターをゲームに用いるという試みを行った。',
                    'ニコニコネット超会議超ハッカソンに出展。'
                  ],
                  buttons: [
                    {
                      popup: '今すぐプレイ',
                      title: [
                        'unityroomで',
                        '遊ぶ'
                      ],
                      target: 'https://unityroom.com/games/cuprunmen'
                    }
                  ],
                  slides: [
                    {
                      type: 'youtube',
                      id: 'm44wTn8nk9Y'
                    }
                  ],
                  specs: {
                    times: [
                      {
                        year: '2020',
                        month: '4',
                        annotation: '(5日)',
                      }
                    ],
                    platforms: [
                      {
                        name: 'WebGL'
                      }
                    ]
                  }
                },
                {
                  title: 'フォーリンパフェ',
                  subtitle: 'パフェ積みアクションゲーム',
                  themeColor: '#4ae0ef',
                  imageId: 'fall_in_parfait-ss1',
                  alt: 'フォーリンパフェのプレイ画面',
                  aspectRatio: {width: 16, height: 9},
                  description: [
                    '2020年8月に開催されたUnity1Weekで制作したゲーム。',
                    '『上から落ちてくる材料を器でキャッチしてパフェを作る』というシンプルな操作性ながら、パフェを大きくなるにつれて爆弾に当たりやすくなる、オンラインランキングの実装といった工夫により、上級者にとってもやり込みがいのあるゲームとなった。',
                    '一番の特長は『フォトモード』で、プレイヤーは自分の作ったパフェを撮影してTwitterに投稿することができる。',
                    'ゲームデザインの中にマーケティングの視点を持ち込んだ、ゲーム“商品”としての草分け的な作品となった。',
                    'Unity1Weekゲームジャムにて約500作品中総合部門46位、絵作り部門35位獲得。',
                    'デベロッパーズゲームコンテスト2020にて企業賞受賞。',
                    '福岡ゲームコンテスト2021、Ohayoo Casual Game Contestに出展。'
                  ],
                  buttons: [
                    {
                      popup: '今すぐプレイ',
                      title: [
                        'unityroomで',
                        '遊ぶ'
                      ],
                      target: 'https://unityroom.com/games/fallinparfait'
                    }
                  ],
                  slides: [
                    {
                      type: 'youtube',
                      id: 'ZIFt6yuOMAQ'
                    }
                  ],
                  specs: {
                    times: [
                      {
                        year: '2020',
                        month: '8',
                        annotation: '(1週間)',
                      },
                      {
                        year: '2020',
                        month: '12',
                        annotation: '(1ヶ月)',
                      }
                    ],
                    platforms: [
                      {
                        name: 'iOS',
                        version: '10',
                        orLater: true
                      },
                      {
                        name: 'Android',
                        version: '8',
                        orLater: true
                      },
                      {
                        name: 'WebGL'
                      }
                    ]
                  }
                },
                {
                  title: '爆買いマーケット',
                  subtitle: '爆買いアクションランゲーム',
                  themeColor: '#da3c26',
                  imageId: 'bakugai-img',
                  aspectRatio: {width: 1, height: 1},
                  alt: '',
                  description: [
                    'フォーリンパフェに続く、Unity1Week二作目。',
                    'ショッピングカートに搭乗してスーパーマーケットを爆走し、床の商品を拾ったり商品棚や他のプレイヤーを攻撃することでスコアを稼ぐ。',
                    '今回は初めてAIプレイヤーを導入した。それぞれのAIに性格付け（攻撃型・収集型・逃亡型）をすることで、プレイヤーは毎回刺激的なゲーム展開を楽しめるようになった。',
                    'Unity1Weekゲームジャムに出展。'
                  ],
                  buttons: [
                    {
                      popup: '今すぐプレイ',
                      title: [
                        'unityroomで',
                        '遊ぶ'
                      ],
                      target: 'https://unityroom.com/games/bakugaimarket'
                    }
                  ],
                  slides: [
                    {
                      type: 'youtube',
                      id: 'vTsy8NCYSNE'
                    }
                  ],
                  specs: {
                    times: [
                      {
                        year: '2020',
                        month: '2',
                        annotation: '(12日)',
                      }
                    ],
                    platforms: [
                      {
                        name: 'WebGL'
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            sectionType: 'imageList',
            cycleType: 'compact',
            title: 'NEWS',
            subtitle: 'チームからのお知らせ',
            themeColor: '#ff0200',
            id: 'news',
            contents: {
              shownItemsCount: 3,
              fallbackImageId: 'ssm-logo-landscape',
              aspectRatio: {width: 4, height: 3},
              articles: [
                {
                  imageId: '',
                  title: '『フォーリンパフェ』がデベロッパーズゲームコンテスト2020にて企業賞（f4samurai賞）を受賞！',
                  date: {
                    year: '2021',
                    month: '1',
                    day: '29'
                  },
                  url: 'https://twitter.com/MachiCollider/status/1355123713226625027'
                },
                {
                  imageId: '',
                  title: 'スーパースターマインが「活躍する電大人」に掲載！',
                  date: {
                    year: '2021',
                    month: '1',
                    day: '28'
                  },
                  url: 'https://www.dendai.ac.jp/dendai-people/20210128-01.html'
                },
                {
                  imageId: '',
                  title: '『れーぞく！ネクロマンスちゃん』がゲームクリエイター甲子園2020にて総合大賞3位、審査員特別賞（鈴木英仁賞）、話題賞を受賞！',
                  date: {
                    year: '2020',
                    month: '12',
                    day: '19'
                  },
                  url: 'https://www.4gamer.net/games/999/G999905/20201228102/'
                },
                {
                  imageId: '',
                  title: '『れーぞく！ネクロマンスちゃん』をデジゲー博2020に出展！',
                  date: {
                    year: '2020',
                    month: '11',
                    day: '29'
                  },
                  url: 'http://digigame-expo.org/'
                },
                {
                  imageId: '',
                  title: '『フォーリンパフェ』がUnity 1Weekゲームジャムにて総合ランキング、絵作りランキングに入賞！',
                  date: {
                    year: '2020',
                    month: '8',
                    day: '30'
                  },
                  url: 'https://unityroom.com/unity1weeks/17'
                },
                {
                  imageId: '',
                  title: '『SPINNER』をゲーム業界交流会に出展！',
                  date: {
                    year: '2020',
                    month: '2',
                    day: '6'
                  },
                  url: 'https://game.creators-guild.com/g4c/%E3%82%B2%E3%83%BC%E3%83%A0%E6%A5%AD%E7%95%8C%E4%BA%A4%E6%B5%81%E4%BC%9A%E3%81%AB%E6%BD%9C%E5%85%A5%EF%BC%81/'
                },
                {
                  imageId: '',
                  title: 'ゲームクリエイターズギルド様からインタビューをしていただきました！',
                  date: {
                    year: '2019',
                    month: '12',
                    day: '27'
                  },
                  url: 'https://game.creators-guild.com/g4c/interview-studentgamescreator-20190114/'
                },
                {
                  imageId: '',
                  title: '『SPINNER』がGCG EXPO 2019で最優秀賞を受賞！',
                  date: {
                    year: '2019',
                    month: '11',
                    day: '30'
                  },
                  url: 'https://game.creators-guild.com/g4c/event-realevent-20191205/'
                },
                {
                  imageId: '',
                  title: '『れーぞく！ネクロマンスちゃん』をゲーム制作者交流会 GAME^3に出展！',
                  date: {
                    year: '2019',
                    month: '9',
                    day: '8'
                  },
                  url: 'https://game3.trap.jp/10th/'
                }
              ]
            }
          },
          {
            sectionType: 'static',
            title: 'ABOUT',
            themeColor: '#f15a23',
            id: 'about',
            contents: {
              imageId: 'ssm-logo-landscape',
              aspectRatio: {width: 7, height: 3},
              article: [
                "スーパースターマインは大学サークル発、新進気鋭のゲーム制作チーム。",
                "面白いものが大好きです。"
              ],
              bottomButtonsLayout: 'left',
              bottomButtons: [
                {
                  title: [
                    'お問い合わせ'
                  ],
                  target: 'https://docs.google.com/forms/d/e/1FAIpQLSd6Z3feC7onaq9SJa1Blfdd7frPFCsm4zQUCfQr9XqPxM3gzA/viewform'
                },
                {
                  title: 'Twitter',
                  target: 'https://twitter.com/necromance_chan'
                }
              ]
            }
          },
          {
            sectionType: 'cards',
            title: 'MEMBERS',
            themeColor: '#f7931d',
            id: 'members',
            contents: {
              logoImageId: 'ssm-logo',
              logoImageSizes: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250],
              logoAspectRatio: {width: 3841 , height: 8167},
              imageDirectory: './img/members/',
              cards: [
                {
                  name: 'マチコー',
                  imageId: 'machiko',
                  post: [
                    'リーダー',
                    'プランナー'
                  ],
                  accounts: [
                    {
                      name: 'twitter',
                      id: 'MachiCollider'
                    },
                    {
                      name: 'facebook',
                      id: 'MachiCollider'
                    },
                    {
                      name: 'note',
                      id: 'machikou_mk2'
                    }
                  ]
                },
                {
                  name: 'いーだ',
                  imageId: 'i-da',
                  post: [
                    'プログラマー',
                    'マスタリングエンジニア'
                  ],
                  accounts: [
                    {
                      name: 'twitter',
                      id: 'GoodPaddyField5'
                    },
                    {
                      name: 'note',
                      id: '203_'
                    }
                  ]
                },
                {
                  name: 'Amu',
                  imageId: 'amu',
                  post: [
                    'UI/ロゴデザイナー',
                    'エフェクトクリエーター'
                  ],
                  accounts: [
                    {
                      name: 'twitter',
                      id: 'Amu＿dsgn'
                    }
                  ]
                },
                {
                  name: 'HIBIKI CUBE',
                  imageId: 'hibiki',
                  post: [
                    'Webエンジニア',
                    'CGモデラー'
                  ],
                  accounts: [
                    {
                      name: 'twitter',
                      id: 'hibiki_cube'
                    },
                    {
                      name: 'github',
                      id: 'HIBIKI-CUBE'
                    },
                    {
                      name: 'qiita',
                      id: 'HIBIKI-CUBE'
                    }
                  ]
                },
                {
                  name: 'Matsu',
                  imageId: '',
                  post: [
                    'プログラマー',
                    'レベルデザイナー'
                  ],
                  accounts: [
                    {
                      name: 'twitter',
                      id: 'sake_unity_stu'
                    },
                    {
                      name: 'github',
                      id: 'AtaruMatsudaira'
                    }
                  ]
                },
                {
                  name: 'ナミー',
                  imageId: '',
                  post: [
                    'デバッガー'
                  ],
                  accounts: [
                    {
                      name: 'twitter',
                      id: 'fi_matsu'
                    }
                  ]
                },
                {
                  name: 'えちょ',
                  imageId: 'echo',
                  post: [
                    'レベルデザイナー'
                  ],
                  accounts: [
                    {
                      name: 'twitter',
                      id: 'ysXKPSlvMZqVtIW'
                    }
                  ]
                },
                {
                  name: '十二月ねこ',
                  imageId: '',
                  post: [
                    'CGモデラー'
                  ],
                  accounts: [
                    {
                      name: 'twitter',
                      id: 'Subamaru_7'
                    }
                  ]
                },
                {
                  name: 'かずえもん',
                  imageId: 'kazuemon',
                  post: [
                    'Webデザイナー'
                  ],
                  accounts: [
                    {
                      name: 'twitter',
                      id: 'kazuemon_0602',
                      customUrl: '//k6n.jp/tw'
                    },
                    {
                      name: 'youtube',
                      id: 'kazuemon',
                      customUrl: '//k6n.jp/yt'
                    },
                    {
                      name: 'github',
                      id: 'kazuemon',
                      customUrl: '//k6n.jp/gh'
                    },
                  ]
                }
              ]
            }
          },
          {
            sectionType: 'footer',
            themeColor: '#fff',
            contents: {
              copyright: ['&copy; 2021', 'HIBIKI CUBE', 'スーパースターマイン'],
              codeLicense: {
                license: 'mpl-2.0',
                linkLabel: 'GitHub',
                url: 'https://github.com/HIBIKI-CUBE/superstarmine-web',
              },
              assetsLicense: {
                ccType: 'by-nd'
              }
            }
          }
        ]
      }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
