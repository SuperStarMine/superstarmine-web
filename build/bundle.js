
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

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
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
    			add_location(h2, file, 42, 6, 1064);
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
    			add_location(h3, file, 45, 6, 1116);
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
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

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
    			add_location(div0, file, 40, 2, 1018);
    			attr_dev(div1, "class", "padding svelte-1g2xbe3");
    			add_location(div1, file, 48, 2, 1157);
    			attr_dev(section, "id", /*id*/ ctx[3]);
    			set_style(section, "--themeColor", /*themeColor*/ ctx[2]);
    			set_style(section, "--backgroundColor", /*backgroundColor*/ ctx[4]);
    			set_style(section, "--textColor", /*textColor*/ ctx[5]);
    			attr_dev(section, "class", "svelte-1g2xbe3");
    			add_location(section, file, 39, 0, 899);
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
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], dirty, null, null);
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
    		{ id } = $$props;

    	const writable_props = ["title", "subtitle", "themeColor", "id"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Common_frame> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("themeColor" in $$props) $$invalidate(2, themeColor = $$props.themeColor);
    		if ("id" in $$props) $$invalidate(3, id = $$props.id);
    		if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Color: color,
    		title,
    		subtitle,
    		themeColor,
    		id,
    		backgroundColor,
    		textColor
    	});

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("subtitle" in $$props) $$invalidate(1, subtitle = $$props.subtitle);
    		if ("themeColor" in $$props) $$invalidate(2, themeColor = $$props.themeColor);
    		if ("id" in $$props) $$invalidate(3, id = $$props.id);
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

    	return [title, subtitle, themeColor, id, backgroundColor, textColor, $$scope, slots];
    }

    class Common_frame extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			title: 0,
    			subtitle: 1,
    			themeColor: 2,
    			id: 3
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
    }

    /* src/picture.svelte generated by Svelte v3.32.1 */
    const file$1 = "src/picture.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (43:2) {#each imageExtensionsShort as ext, i}
    function create_each_block(ctx) {
    	let source;
    	let source_type_value;
    	let source_srcset_value;

    	const block = {
    		c: function create() {
    			source = element("source");
    			attr_dev(source, "type", source_type_value = "image/" + /*ext*/ ctx[22]);
    			attr_dev(source, "sizes", /*sizes*/ ctx[1]);
    			attr_dev(source, "srcset", source_srcset_value = /*resolveSrcsets*/ ctx[17](/*imageDirectory*/ ctx[11], /*imageExtensionsShort*/ ctx[12], /*imageSizes*/ ctx[13], /*imageId*/ ctx[0], /*loading*/ ctx[16], /*tinyImageExtensionsShort*/ ctx[14], /*tinyImageSize*/ ctx[15])[/*i*/ ctx[24]]);
    			add_location(source, file$1, 43, 4, 1588);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, source, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*imageExtensionsShort*/ 4096 && source_type_value !== (source_type_value = "image/" + /*ext*/ ctx[22])) {
    				attr_dev(source, "type", source_type_value);
    			}

    			if (dirty & /*sizes*/ 2) {
    				attr_dev(source, "sizes", /*sizes*/ ctx[1]);
    			}

    			if (dirty & /*imageDirectory, imageExtensionsShort, imageSizes, imageId, loading, tinyImageExtensionsShort, tinyImageSize*/ 129025 && source_srcset_value !== (source_srcset_value = /*resolveSrcsets*/ ctx[17](/*imageDirectory*/ ctx[11], /*imageExtensionsShort*/ ctx[12], /*imageSizes*/ ctx[13], /*imageId*/ ctx[0], /*loading*/ ctx[16], /*tinyImageExtensionsShort*/ ctx[14], /*tinyImageSize*/ ctx[15])[/*i*/ ctx[24]])) {
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
    		source: "(43:2) {#each imageExtensionsShort as ext, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let picture;
    	let t;
    	let img;
    	let img_srcset_value;
    	let img_loading_value;
    	let mounted;
    	let dispose;
    	let each_value = /*imageExtensionsShort*/ ctx[12];
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
    			attr_dev(img, "srcset", img_srcset_value = /*resolveSrcsets*/ ctx[17](/*imageDirectory*/ ctx[11], /*imageExtensionsShort*/ ctx[12], /*imageSizes*/ ctx[13], /*imageId*/ ctx[0], /*loading*/ ctx[16], /*tinyImageExtensionsShort*/ ctx[14], /*tinyImageSize*/ ctx[15])[getSafeImageExtensionIndex(/*imageExtensionsShort*/ ctx[12])]);
    			attr_dev(img, "alt", /*alt*/ ctx[2]);
    			attr_dev(img, "width", /*width*/ ctx[3]);
    			attr_dev(img, "height", /*height*/ ctx[4]);
    			attr_dev(img, "loading", img_loading_value = /*loadLazy*/ ctx[10] ? "lazy" : "eager");
    			add_location(img, file$1, 45, 2, 1774);
    			attr_dev(picture, "class", /*pictureClass*/ ctx[5]);
    			attr_dev(picture, "title", /*title*/ ctx[8]);
    			attr_dev(picture, "style", /*style*/ ctx[9]);
    			add_location(picture, file$1, 41, 0, 1479);
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

    			if (dirty & /*imageExtensionsShort, sizes, resolveSrcsets, imageDirectory, imageSizes, imageId, loading, tinyImageExtensionsShort, tinyImageSize*/ 260099) {
    				each_value = /*imageExtensionsShort*/ ctx[12];
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

    			if (dirty & /*imageDirectory, imageExtensionsShort, imageSizes, imageId, loading, tinyImageExtensionsShort, tinyImageSize*/ 129025 && img_srcset_value !== (img_srcset_value = /*resolveSrcsets*/ ctx[17](/*imageDirectory*/ ctx[11], /*imageExtensionsShort*/ ctx[12], /*imageSizes*/ ctx[13], /*imageId*/ ctx[0], /*loading*/ ctx[16], /*tinyImageExtensionsShort*/ ctx[14], /*tinyImageSize*/ ctx[15])[getSafeImageExtensionIndex(/*imageExtensionsShort*/ ctx[12])])) {
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

    			if (dirty & /*loadLazy*/ 1024 && img_loading_value !== (img_loading_value = /*loadLazy*/ ctx[10] ? "lazy" : "eager")) {
    				attr_dev(img, "loading", img_loading_value);
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
    		{ loadLazy = true } = $$props,
    		{ imageDirectory = contents.imageDirectory || globalSettings.imageDirectory } = $$props,
    		{ imageExtensionsShort = contents.imageExtensionsShort || globalSettings.imageExtensionsShort } = $$props,
    		{ imageSizes = contents.imageSizes || globalSettings.imageSizes } = $$props,
    		{ tinyImageExtensionsShort = contents.tinyImageExtensionsShort || globalSettings.tinyImageExtensionsShort } = $$props,
    		{ tinyImageSize = contents.tinyImageSize || globalSettings.tinyImageSize } = $$props;

    	let loading = true;
    	const dispatch = createEventDispatcher();
    	addEventListener("load", () => $$invalidate(16, loading = false));

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
    		"loadLazy",
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
    		if ("contents" in $$props) $$invalidate(18, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(19, globalSettings = $$props.globalSettings);
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
    		if ("useTiny" in $$props) $$invalidate(20, useTiny = $$props.useTiny);
    		if ("loadLazy" in $$props) $$invalidate(10, loadLazy = $$props.loadLazy);
    		if ("imageDirectory" in $$props) $$invalidate(11, imageDirectory = $$props.imageDirectory);
    		if ("imageExtensionsShort" in $$props) $$invalidate(12, imageExtensionsShort = $$props.imageExtensionsShort);
    		if ("imageSizes" in $$props) $$invalidate(13, imageSizes = $$props.imageSizes);
    		if ("tinyImageExtensionsShort" in $$props) $$invalidate(14, tinyImageExtensionsShort = $$props.tinyImageExtensionsShort);
    		if ("tinyImageSize" in $$props) $$invalidate(15, tinyImageSize = $$props.tinyImageSize);
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
    		loadLazy,
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
    		if ("contents" in $$props) $$invalidate(18, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(19, globalSettings = $$props.globalSettings);
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
    		if ("useTiny" in $$props) $$invalidate(20, useTiny = $$props.useTiny);
    		if ("loadLazy" in $$props) $$invalidate(10, loadLazy = $$props.loadLazy);
    		if ("imageDirectory" in $$props) $$invalidate(11, imageDirectory = $$props.imageDirectory);
    		if ("imageExtensionsShort" in $$props) $$invalidate(12, imageExtensionsShort = $$props.imageExtensionsShort);
    		if ("imageSizes" in $$props) $$invalidate(13, imageSizes = $$props.imageSizes);
    		if ("tinyImageExtensionsShort" in $$props) $$invalidate(14, tinyImageExtensionsShort = $$props.tinyImageExtensionsShort);
    		if ("tinyImageSize" in $$props) $$invalidate(15, tinyImageSize = $$props.tinyImageSize);
    		if ("loading" in $$props) $$invalidate(16, loading = $$props.loading);
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
    		loadLazy,
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
    			contents: 18,
    			globalSettings: 19,
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
    			useTiny: 20,
    			loadLazy: 10,
    			imageDirectory: 11,
    			imageExtensionsShort: 12,
    			imageSizes: 13,
    			tinyImageExtensionsShort: 14,
    			tinyImageSize: 15
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Picture",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[18] === undefined && !("contents" in props)) {
    			console.warn("<Picture> was created without expected prop 'contents'");
    		}

    		if (/*globalSettings*/ ctx[19] === undefined && !("globalSettings" in props)) {
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

    		if (/*useTiny*/ ctx[20] === undefined && !("useTiny" in props)) {
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

    	get loadLazy() {
    		throw new Error("<Picture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadLazy(value) {
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
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (68:4) {#each contents.items as item}
    function create_each_block$1(ctx) {
    	let div;
    	let t_value = /*item*/ ctx[13].label + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[9](/*item*/ ctx[13]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "header_navigation_list_items svelte-hf9dok");
    			add_location(div, file$2, 68, 6, 3248);
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
    			if (dirty & /*contents*/ 1 && t_value !== (t_value = /*item*/ ctx[13].label + "")) set_data_dev(t, t_value);
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
    		source: "(68:4) {#each contents.items as item}",
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
    	let div0;
    	let t8;
    	let t9;
    	let div1;
    	let svg2;
    	let current;
    	let mounted;
    	let dispose;

    	picture = new Picture({
    			props: {
    				click: /*func*/ ctx[5],
    				title: "クリックするとページの先頭に戻ります",
    				pictureClass: "header_picture",
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
    			div0 = element("div");
    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			div1 = element("div");
    			svg2 = svg_element("svg");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "ui_button header_button_checkbox svelte-hf9dok");
    			input.checked = true;
    			attr_dev(input, "name", "header_button_checkbox");
    			attr_dev(input, "id", "header_button_checkbox");
    			add_location(input, file$2, 49, 2, 2018);
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "class", "svelte-hf9dok");
    			add_location(path0, file$2, 52, 6, 2323);
    			attr_dev(path1, "d", "M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z");
    			attr_dev(path1, "class", "svelte-hf9dok");
    			add_location(path1, file$2, 53, 6, 2368);
    			attr_dev(svg0, "class", "header_button_svg svelte-hf9dok");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			add_location(svg0, file$2, 51, 4, 2265);
    			attr_dev(label0, "for", "header_button_checkbox");
    			attr_dev(label0, "class", "header_button svelte-hf9dok");
    			attr_dev(label0, "title", "クリックするとナビゲーションを開閉できます");
    			add_location(label0, file$2, 50, 2, 2172);
    			attr_dev(span0, "class", "break-scope svelte-hf9dok");
    			add_location(span0, file$2, 59, 10, 2631);
    			attr_dev(span1, "class", "break-scope svelte-hf9dok");
    			add_location(span1, file$2, 59, 51, 2672);
    			attr_dev(span2, "class", "header_navigation_close_button_text svelte-hf9dok");
    			add_location(span2, file$2, 58, 8, 2570);
    			attr_dev(path2, "d", "M0 0h24v24H0z");
    			attr_dev(path2, "fill", "none");
    			attr_dev(path2, "class", "svelte-hf9dok");
    			add_location(path2, file$2, 62, 10, 2812);
    			attr_dev(path3, "d", "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z");
    			attr_dev(path3, "class", "svelte-hf9dok");
    			add_location(path3, file$2, 63, 10, 2860);
    			attr_dev(svg1, "class", "header_navigation_close_button_svg svelte-hf9dok");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			add_location(svg1, file$2, 61, 8, 2733);
    			attr_dev(label1, "for", "header_button_checkbox");
    			attr_dev(label1, "class", "header_navigation_close_button svelte-hf9dok");
    			add_location(label1, file$2, 57, 4, 2486);
    			attr_dev(div0, "class", "header_close_area svelte-hf9dok");
    			add_location(div0, file$2, 66, 4, 3080);
    			attr_dev(svg2, "class", "header_button_svg svelte-hf9dok");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "fill", "white");
    			add_location(svg2, file$2, 71, 6, 3411);
    			attr_dev(div1, "class", "header_button_dummy svelte-hf9dok");
    			add_location(div1, file$2, 70, 4, 3371);
    			attr_dev(nav, "class", "header_navigation svelte-hf9dok");
    			add_location(nav, file$2, 56, 2, 2450);

    			attr_dev(header_1, "title", window.CSS.supports(`(backdrop-filter:blur(10px)) or (-webkit-backdrop-filter:blur(10px)) or (-moz-backdrop-filter:blur(10px)`)
    			? ""
    			: "Firefoxをお使いの方はabout:configを開いてbackdrop-filterを有効にすると他のブラウザーと同じ見た目にすることができます。");

    			set_style(header_1, "--itemsCount", /*contents*/ ctx[0].items.length);
    			attr_dev(header_1, "class", "svelte-hf9dok");
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
    			append_dev(nav, div0);
    			append_dev(nav, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(nav, null);
    			}

    			append_dev(nav, t9);
    			append_dev(nav, div1);
    			append_dev(div1, svg2);
    			/*header_1_binding*/ ctx[10](header_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[7], false, false, false),
    					listen_dev(div0, "touchstart", /*touchstart_handler*/ ctx[8], { passive: true }, false, false)
    				];

    				mounted = true;
    			}
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
    						each_blocks[i].m(nav, t9);
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
    			/*header_1_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
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

    	const click_handler = () => $$invalidate(3, checkbox.checked = false, checkbox);
    	const touchstart_handler = () => $$invalidate(3, checkbox.checked = false, checkbox);
    	const click_handler_1 = item => triggerSmoothScroll(item.id);

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
    		touchstart_handler,
    		click_handler_1,
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

    /* src/date-list.svelte generated by Svelte v3.32.1 */

    const file$5 = "src/date-list.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (18:10) {:else}
    function create_else_block$2(ctx) {
    	let span;
    	let t_value = /*article*/ ctx[1].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$5, 18, 12, 903);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && t_value !== (t_value = /*article*/ ctx[1].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(18:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (14:10) {#if Array.isArray(article.title)}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*article*/ ctx[1].title;
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
    				each_value_1 = /*article*/ ctx[1].title;
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
    		source: "(14:10) {#if Array.isArray(article.title)}",
    		ctx
    	});

    	return block;
    }

    // (15:12) {#each article.title as title}
    function create_each_block_1$1(ctx) {
    	let span;
    	let t_value = /*title*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "break-scope");
    			add_location(span, file$5, 15, 14, 812);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && t_value !== (t_value = /*title*/ ctx[4] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(15:12) {#each article.title as title}",
    		ctx
    	});

    	return block;
    }

    // (6:2) {#each contents.articles as article}
    function create_each_block$3(ctx) {
    	let li;
    	let a;
    	let time;

    	let t0_value = (/*article*/ ctx[1].date.year
    	? ("0000" + /*article*/ ctx[1].date.year).slice(-4)
    	: "") + (/*article*/ ctx[1].date.month
    	? "/" + ("00" + /*article*/ ctx[1].date.month).slice(-2)
    	: "") + (/*article*/ ctx[1].date.day
    	? "/" + ("00" + /*article*/ ctx[1].date.day).slice(-2)
    	: "") + "";

    	let t0;
    	let time_datetime_value;
    	let t1;
    	let div;
    	let show_if;
    	let a_href_value;
    	let t2;

    	function select_block_type(ctx, dirty) {
    		if (show_if == null || dirty & /*contents*/ 1) show_if = !!Array.isArray(/*article*/ ctx[1].title);
    		if (show_if) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			time = element("time");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");
    			if_block.c();
    			t2 = space();
    			attr_dev(time, "class", "date svelte-1d2013d");

    			attr_dev(time, "datetime", time_datetime_value = (/*article*/ ctx[1].date.year
    			? ("0000" + /*article*/ ctx[1].date.year).slice(-4)
    			: "") + (/*article*/ ctx[1].date.month
    			? "-" + ("00" + /*article*/ ctx[1].date.month).slice(-2)
    			: "") + (/*article*/ ctx[1].date.day
    			? "-" + ("00" + /*article*/ ctx[1].date.day).slice(-2)
    			: ""));

    			add_location(time, file$5, 9, 8, 203);
    			attr_dev(div, "class", "title-container svelte-1d2013d");
    			add_location(div, file$5, 12, 8, 680);
    			attr_dev(a, "href", a_href_value = /*article*/ ctx[1].url);
    			attr_dev(a, "class", "svelte-1d2013d");
    			add_location(a, file$5, 7, 6, 116);
    			attr_dev(li, "class", "entry svelte-1d2013d");
    			add_location(li, file$5, 6, 4, 91);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, time);
    			append_dev(time, t0);
    			append_dev(a, t1);
    			append_dev(a, div);
    			if_block.m(div, null);
    			append_dev(li, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && t0_value !== (t0_value = (/*article*/ ctx[1].date.year
    			? ("0000" + /*article*/ ctx[1].date.year).slice(-4)
    			: "") + (/*article*/ ctx[1].date.month
    			? "/" + ("00" + /*article*/ ctx[1].date.month).slice(-2)
    			: "") + (/*article*/ ctx[1].date.day
    			? "/" + ("00" + /*article*/ ctx[1].date.day).slice(-2)
    			: "") + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*contents*/ 1 && time_datetime_value !== (time_datetime_value = (/*article*/ ctx[1].date.year
    			? ("0000" + /*article*/ ctx[1].date.year).slice(-4)
    			: "") + (/*article*/ ctx[1].date.month
    			? "-" + ("00" + /*article*/ ctx[1].date.month).slice(-2)
    			: "") + (/*article*/ ctx[1].date.day
    			? "-" + ("00" + /*article*/ ctx[1].date.day).slice(-2)
    			: ""))) {
    				attr_dev(time, "datetime", time_datetime_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}

    			if (dirty & /*contents*/ 1 && a_href_value !== (a_href_value = /*article*/ ctx[1].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(6:2) {#each contents.articles as article}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let ul;
    	let each_value = /*contents*/ ctx[0].articles;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1d2013d");
    			add_location(ul, file$5, 4, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*contents, Array*/ 1) {
    				each_value = /*contents*/ ctx[0].articles;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
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

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Date_list", slots, []);
    	let { contents } = $$props;
    	const writable_props = ["contents"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Date_list> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    	};

    	$$self.$capture_state = () => ({ contents });

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contents];
    }

    class Date_list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { contents: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Date_list",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Date_list> was created without expected prop 'contents'");
    		}
    	}

    	get contents() {
    		throw new Error("<Date_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Date_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
          controller: _extends$1({
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

    function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
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
          fadeEffect: _extends$2({}, Fade)
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

    /* src/slide-hero-swiper.svelte generated by Svelte v3.32.1 */

    const { document: document_1 } = globals;
    const file$6 = "src/slide-hero-swiper.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (51:6) <SwiperSlide>
    function create_default_slot_1(ctx) {
    	let picture;
    	let t;
    	let current;

    	picture = new Picture({
    			props: {
    				imgClass: "slide-img",
    				sizes: "" + (/*standardWidth*/ ctx[2] / 16 * 9 / /*article*/ ctx[10].aspectRatio.height * /*article*/ ctx[10].aspectRatio.width + "vw"),
    				contents: /*contents*/ ctx[0],
    				globalSettings: /*globalSettings*/ ctx[1],
    				imageId: /*article*/ ctx[10].imageId,
    				width: /*article*/ ctx[10].aspectRatio.width,
    				height: /*article*/ ctx[10].aspectRatio.height,
    				useTiny: true,
    				loadLazy: false
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
    			if (dirty & /*standardWidth, contents*/ 5) picture_changes.sizes = "" + (/*standardWidth*/ ctx[2] / 16 * 9 / /*article*/ ctx[10].aspectRatio.height * /*article*/ ctx[10].aspectRatio.width + "vw");
    			if (dirty & /*contents*/ 1) picture_changes.contents = /*contents*/ ctx[0];
    			if (dirty & /*globalSettings*/ 2) picture_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*contents*/ 1) picture_changes.imageId = /*article*/ ctx[10].imageId;
    			if (dirty & /*contents*/ 1) picture_changes.width = /*article*/ ctx[10].aspectRatio.width;
    			if (dirty & /*contents*/ 1) picture_changes.height = /*article*/ ctx[10].aspectRatio.height;
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
    		source: "(51:6) <SwiperSlide>",
    		ctx
    	});

    	return block;
    }

    // (50:4) {#each contents.articles as article}
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

    			if (dirty & /*$$scope, standardWidth, contents, globalSettings*/ 8199) {
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
    		source: "(50:4) {#each contents.articles as article}",
    		ctx
    	});

    	return block;
    }

    // (32:2) <Swiper     centeredSlides={true}     spaceBetween={4}     slidesPerView={'auto'}     grabCursor={true}     speed={transitionDuration}     slideToClickedSlide={true}     loop={true}     on:swiper={e => {       const [swiper] = e.detail;       window.addEventListener('load', () => setTimeout(() => {         swiper.loopDestroy();         swiper.loopCreate();         swiper.update();       }))}}     loopedSlides={contents.articles.length}     controller={{ control: controlledSwiper }}   >
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
    		source: "(32:2) <Swiper     centeredSlides={true}     spaceBetween={4}     slidesPerView={'auto'}     grabCursor={true}     speed={transitionDuration}     slideToClickedSlide={true}     loop={true}     on:swiper={e => {       const [swiper] = e.detail;       window.addEventListener('load', () => setTimeout(() => {         swiper.loopDestroy();         swiper.loopCreate();         swiper.update();       }))}}     loopedSlides={contents.articles.length}     controller={{ control: controlledSwiper }}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let link0;
    	let link0_href_value;
    	let link1;
    	let link2;
    	let t0;
    	let div;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let swiper;
    	let t2;
    	let img1;
    	let img1_src_value;
    	let current;

    	swiper = new Swiper$1({
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

    	swiper.$on("swiper", /*swiper_handler*/ ctx[8]);

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			link2 = element("link");
    			t0 = space();
    			div = element("div");
    			img0 = element("img");
    			t1 = space();
    			create_component(swiper.$$.fragment);
    			t2 = space();
    			img1 = element("img");
    			attr_dev(link0, "rel", "preload");
    			attr_dev(link0, "href", link0_href_value = "/img/" + /*contents*/ ctx[0].articles[0].imageId + "@" + /*preloadWidth*/ ctx[5] + "w.webp");
    			attr_dev(link0, "as", "image");
    			add_location(link0, file$6, 24, 2, 828);
    			attr_dev(link1, "rel", "preload");
    			attr_dev(link1, "href", "/swiper-bundle.min.css");
    			attr_dev(link1, "as", "style");
    			add_location(link1, file$6, 25, 2, 926);
    			attr_dev(link2, "rel", "stylesheet");
    			attr_dev(link2, "type", "text/css");
    			attr_dev(link2, "href", "/swiper-bundle.min.css");
    			add_location(link2, file$6, 26, 2, 990);
    			attr_dev(img0, "class", "arrow left svelte-1ssy7h5");
    			if (img0.src !== (img0_src_value = "/img/arrow.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "左のスライドへ");
    			attr_dev(img0, "width", "309.94");
    			attr_dev(img0, "height", "355.04");
    			add_location(img0, file$6, 30, 2, 1103);
    			attr_dev(img1, "class", "arrow right svelte-1ssy7h5");
    			if (img1.src !== (img1_src_value = "/img/arrow.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "右のスライドへ");
    			attr_dev(img1, "width", "309.94");
    			attr_dev(img1, "height", "355.04");
    			add_location(img1, file$6, 55, 2, 2083);
    			attr_dev(div, "class", "slide-hero svelte-1ssy7h5");
    			add_location(div, file$6, 29, 0, 1076);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, link0);
    			append_dev(document_1.head, link1);
    			append_dev(document_1.head, link2);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, img0);
    			append_dev(div, t1);
    			mount_component(swiper, div, null);
    			append_dev(div, t2);
    			append_dev(div, img1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*contents*/ 1 && link0_href_value !== (link0_href_value = "/img/" + /*contents*/ ctx[0].articles[0].imageId + "@" + /*preloadWidth*/ ctx[5] + "w.webp")) {
    				attr_dev(link0, "href", link0_href_value);
    			}

    			const swiper_changes = {};
    			if (dirty & /*contents*/ 1) swiper_changes.loopedSlides = /*contents*/ ctx[0].articles.length;
    			if (dirty & /*controlledSwiper*/ 8) swiper_changes.controller = { control: /*controlledSwiper*/ ctx[3] };

    			if (dirty & /*$$scope, contents, standardWidth, globalSettings*/ 8199) {
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
    			detach_dev(link2);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(swiper);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $sync;
    	validate_store(sync, "sync");
    	component_subscribe($$self, sync, $$value => $$invalidate(9, $sync = $$value));
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

    	const preloadWidth = globalSettings.imageSizes.find(v => v > document.body.getBoundingClientRect().width * (standardWidth / 100) * (devicePixelRatio || 1)) || globalSettings.imageSizes.slice(-1)[0];
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
    		if ("pairId" in $$props) $$invalidate(6, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(7, isParent = $$props.isParent);
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
    		contents,
    		pairId,
    		isParent,
    		globalSettings,
    		standardWidth,
    		transitionDuration,
    		controlledSwiper,
    		preloadWidth,
    		$sync
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("pairId" in $$props) $$invalidate(6, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(7, isParent = $$props.isParent);
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
    		preloadWidth,
    		pairId,
    		isParent,
    		swiper_handler
    	];
    }

    class Slide_hero_swiper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			contents: 0,
    			pairId: 6,
    			isParent: 7,
    			globalSettings: 1,
    			standardWidth: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slide_hero_swiper",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*contents*/ ctx[0] === undefined && !("contents" in props)) {
    			console.warn("<Slide_hero_swiper> was created without expected prop 'contents'");
    		}

    		if (/*pairId*/ ctx[6] === undefined && !("pairId" in props)) {
    			console.warn("<Slide_hero_swiper> was created without expected prop 'pairId'");
    		}

    		if (/*isParent*/ ctx[7] === undefined && !("isParent" in props)) {
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

    var Sister;

    /**
    * @link https://github.com/gajus/sister for the canonical source repository
    * @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
    */
    Sister = function () {
        var sister = {},
            events = {};

        /**
         * @name handler
         * @function
         * @param {Object} data Event data.
         */

        /**
         * @param {String} name Event name.
         * @param {handler} handler
         * @return {listener}
         */
        sister.on = function (name, handler) {
            var listener = {name: name, handler: handler};
            events[name] = events[name] || [];
            events[name].unshift(listener);
            return listener;
        };

        /**
         * @param {listener}
         */
        sister.off = function (listener) {
            var index = events[listener.name].indexOf(listener);

            if (index !== -1) {
                events[listener.name].splice(index, 1);
            }
        };

        /**
         * @param {String} name Event name.
         * @param {Object} data Event data.
         */
        sister.trigger = function (name, data) {
            var listeners = events[name],
                i;

            if (listeners) {
                i = listeners.length;
                while (i--) {
                    listeners[i].handler(data);
                }
            }
        };

        return sister;
    };

    var sister = Sister;

    var loadScript = function load (src, opts, cb) {
      var head = document.head || document.getElementsByTagName('head')[0];
      var script = document.createElement('script');

      if (typeof opts === 'function') {
        cb = opts;
        opts = {};
      }

      opts = opts || {};
      cb = cb || function() {};

      script.type = opts.type || 'text/javascript';
      script.charset = opts.charset || 'utf8';
      script.async = 'async' in opts ? !!opts.async : true;
      script.src = src;

      if (opts.attrs) {
        setAttributes(script, opts.attrs);
      }

      if (opts.text) {
        script.text = '' + opts.text;
      }

      var onend = 'onload' in script ? stdOnEnd : ieOnEnd;
      onend(script, cb);

      // some good legacy browsers (firefox) fail the 'in' detection above
      // so as a fallback we always set onload
      // old IE will ignore this and new IE will set onload
      if (!script.onload) {
        stdOnEnd(script, cb);
      }

      head.appendChild(script);
    };

    function setAttributes(script, attrs) {
      for (var attr in attrs) {
        script.setAttribute(attr, attrs[attr]);
      }
    }

    function stdOnEnd (script, cb) {
      script.onload = function () {
        this.onerror = this.onload = null;
        cb(null, script);
      };
      script.onerror = function () {
        // this.onload = null here is necessary
        // because even IE9 works not like others
        this.onerror = this.onload = null;
        cb(new Error('Failed to load ' + this.src), script);
      };
    }

    function ieOnEnd (script, cb) {
      script.onreadystatechange = function () {
        if (this.readyState != 'complete' && this.readyState != 'loaded') return
        this.onreadystatechange = null;
        cb(null, script); // there is no way to catch loading errors in IE8
      };
    }

    var loadYouTubeIframeApi = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });



    var _loadScript2 = _interopRequireDefault(loadScript);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = function (emitter) {
      /**
       * A promise that is resolved when window.onYouTubeIframeAPIReady is called.
       * The promise is resolved with a reference to window.YT object.
       */
      var iframeAPIReady = new Promise(function (resolve) {
        if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
          resolve(window.YT);

          return;
        } else {
          var protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';

          (0, _loadScript2.default)(protocol + '//www.youtube.com/iframe_api', function (error) {
            if (error) {
              emitter.trigger('error', error);
            }
          });
        }

        var previous = window.onYouTubeIframeAPIReady;

        // The API will call this function when page has finished downloading
        // the JavaScript for the player API.
        window.onYouTubeIframeAPIReady = function () {
          if (previous) {
            previous();
          }

          resolve(window.YT);
        };
      });

      return iframeAPIReady;
    };

    module.exports = exports['default'];
    });

    /**
     * Helpers.
     */
    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} [options]
     * @throws {Error} throw an error if val is not a non-empty string or a number
     * @return {String|Number}
     * @api public
     */

    var ms = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse(val);
      } else if (type === 'number' && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(val)
      );
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + 'd';
      }
      if (ms >= h) {
        return Math.round(ms / h) + 'h';
      }
      if (ms >= m) {
        return Math.round(ms / m) + 'm';
      }
      if (ms >= s) {
        return Math.round(ms / s) + 's';
      }
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtLong(ms) {
      return plural(ms, d, 'day') ||
        plural(ms, h, 'hour') ||
        plural(ms, m, 'minute') ||
        plural(ms, s, 'second') ||
        ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + ' ' + name;
      }
      return Math.ceil(ms / n) + ' ' + name + 's';
    }

    var debug = createCommonjsModule(function (module, exports) {
    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = ms;

    /**
     * The currently active debug mode names, and names to skip.
     */

    exports.names = [];
    exports.skips = [];

    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
     */

    exports.formatters = {};

    /**
     * Previous log timestamp.
     */

    var prevTime;

    /**
     * Select a color.
     * @param {String} namespace
     * @return {Number}
     * @api private
     */

    function selectColor(namespace) {
      var hash = 0, i;

      for (i in namespace) {
        hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }

      return exports.colors[Math.abs(hash) % exports.colors.length];
    }

    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function createDebug(namespace) {

      function debug() {
        // disabled?
        if (!debug.enabled) return;

        var self = debug;

        // set `diff` timestamp
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;

        // turn the `arguments` into a proper Array
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }

        args[0] = exports.coerce(args[0]);

        if ('string' !== typeof args[0]) {
          // anything else let's inspect with %O
          args.unshift('%O');
        }

        // apply any `formatters` transformations
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          // if we encounter an escaped % then don't increase the array index
          if (match === '%%') return match;
          index++;
          var formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);

            // now we need to remove `args[index]` since it's inlined in the `format`
            args.splice(index, 1);
            index--;
          }
          return match;
        });

        // apply env-specific formatting (colors, etc.)
        exports.formatArgs.call(self, args);

        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }

      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);

      // env-specific initialization logic for debug instances
      if ('function' === typeof exports.init) {
        exports.init(debug);
      }

      return debug;
    }

    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
      exports.save(namespaces);

      exports.names = [];
      exports.skips = [];

      var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
      var len = split.length;

      for (var i = 0; i < len; i++) {
        if (!split[i]) continue; // ignore empty strings
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }
    }

    /**
     * Disable debug output.
     *
     * @api public
     */

    function disable() {
      exports.enable('');
    }

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
    });

    /**
     * This is the web browser implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    var browser$1 = createCommonjsModule(function (module, exports) {
    exports = module.exports = debug;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = 'undefined' != typeof chrome
                   && 'undefined' != typeof chrome.storage
                      ? chrome.storage.local
                      : localstorage();

    /**
     * Colors.
     */

    exports.colors = [
      'lightseagreen',
      'forestgreen',
      'goldenrod',
      'dodgerblue',
      'darkorchid',
      'crimson'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    function useColors() {
      // NB: In an Electron preload script, document will be defined but not fully
      // initialized. Since we know we're in Chrome, we'll just detect this case
      // explicitly
      if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
        return true;
      }

      // is webkit? http://stackoverflow.com/a/16459606/376773
      // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
      return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
        // is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
        // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
        // double check webkit in userAgent just in case we are in a worker
        (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return '[UnexpectedJSONParseError]: ' + err.message;
      }
    };


    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
      var useColors = this.useColors;

      args[0] = (useColors ? '%c' : '')
        + this.namespace
        + (useColors ? ' %c' : ' ')
        + args[0]
        + (useColors ? '%c ' : ' ')
        + '+' + exports.humanize(this.diff);

      if (!useColors) return;

      var c = 'color: ' + this.color;
      args.splice(1, 0, c, 'color: inherit');

      // the final "%c" is somewhat tricky, because there could be other
      // arguments passed either before or after the %c, so we need to
      // figure out the correct index to insert the CSS into
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ('%%' === match) return;
        index++;
        if ('%c' === match) {
          // we only are interested in the *last* %c
          // (the user may have provided their own)
          lastC = index;
        }
      });

      args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */

    function log() {
      // this hackery is required for IE8/9, where
      // the `console.log` function doesn't have 'apply'
      return 'object' === typeof console
        && console.log
        && Function.prototype.apply.call(console.log, console, arguments);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem('debug');
        } else {
          exports.storage.debug = namespaces;
        }
      } catch(e) {}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch(e) {}

      // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
      if (!r && typeof process !== 'undefined' && 'env' in process) {
        r = process.env.DEBUG;
      }

      return r;
    }

    /**
     * Enable namespaces listed in `localStorage.debug` initially.
     */

    exports.enable(load());

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {}
    }
    });

    var functionNames = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });


    /**
     * @see https://developers.google.com/youtube/iframe_api_reference#Functions
     */
    exports.default = ['cueVideoById', 'loadVideoById', 'cueVideoByUrl', 'loadVideoByUrl', 'playVideo', 'pauseVideo', 'stopVideo', 'getVideoLoadedFraction', 'cuePlaylist', 'loadPlaylist', 'nextVideo', 'previousVideo', 'playVideoAt', 'setShuffle', 'setLoop', 'getPlaylist', 'getPlaylistIndex', 'setOption', 'mute', 'unMute', 'isMuted', 'setVolume', 'getVolume', 'seekTo', 'getPlayerState', 'getPlaybackRate', 'setPlaybackRate', 'getAvailablePlaybackRates', 'getPlaybackQuality', 'setPlaybackQuality', 'getAvailableQualityLevels', 'getCurrentTime', 'getDuration', 'removeEventListener', 'getVideoUrl', 'getVideoEmbedCode', 'getOptions', 'getOption', 'addEventListener', 'destroy', 'setSize', 'getIframe'];
    module.exports = exports['default'];
    });

    var eventNames = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });


    /**
     * @see https://developers.google.com/youtube/iframe_api_reference#Events
     * `volumeChange` is not officially supported but seems to work
     * it emits an object: `{volume: 82.6923076923077, muted: false}`
     */
    exports.default = ['ready', 'stateChange', 'playbackQualityChange', 'playbackRateChange', 'error', 'apiChange', 'volumeChange'];
    module.exports = exports['default'];
    });

    var PlayerStates = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = {
      BUFFERING: 3,
      ENDED: 0,
      PAUSED: 2,
      PLAYING: 1,
      UNSTARTED: -1,
      VIDEO_CUED: 5
    };
    module.exports = exports["default"];
    });

    var FunctionStateMap = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });



    var _PlayerStates2 = _interopRequireDefault(PlayerStates);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = {
      pauseVideo: {
        acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PAUSED],
        stateChangeRequired: false
      },
      playVideo: {
        acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PLAYING],
        stateChangeRequired: false
      },
      seekTo: {
        acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PLAYING, _PlayerStates2.default.PAUSED],
        stateChangeRequired: true,

        // TRICKY: `seekTo` may not cause a state change if no buffering is
        // required.
        timeout: 3000
      }
    };
    module.exports = exports['default'];
    });

    var YouTubePlayer_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });



    var _debug2 = _interopRequireDefault(browser$1);



    var _functionNames2 = _interopRequireDefault(functionNames);



    var _eventNames2 = _interopRequireDefault(eventNames);



    var _FunctionStateMap2 = _interopRequireDefault(FunctionStateMap);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /* eslint-disable promise/prefer-await-to-then */

    var debug = (0, _debug2.default)('youtube-player');

    var YouTubePlayer = {};

    /**
     * Construct an object that defines an event handler for all of the YouTube
     * player events. Proxy captured events through an event emitter.
     *
     * @todo Capture event parameters.
     * @see https://developers.google.com/youtube/iframe_api_reference#Events
     */
    YouTubePlayer.proxyEvents = function (emitter) {
      var events = {};

      var _loop = function _loop(eventName) {
        var onEventName = 'on' + eventName.slice(0, 1).toUpperCase() + eventName.slice(1);

        events[onEventName] = function (event) {
          debug('event "%s"', onEventName, event);

          emitter.trigger(eventName, event);
        };
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _eventNames2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var eventName = _step.value;

          _loop(eventName);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return events;
    };

    /**
     * Delays player API method execution until player state is ready.
     *
     * @todo Proxy all of the methods using Object.keys.
     * @todo See TRICKY below.
     * @param playerAPIReady Promise that resolves when player is ready.
     * @param strictState A flag designating whether or not to wait for
     * an acceptable state when calling supported functions.
     * @returns {Object}
     */
    YouTubePlayer.promisifyPlayer = function (playerAPIReady) {
      var strictState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var functions = {};

      var _loop2 = function _loop2(functionName) {
        if (strictState && _FunctionStateMap2.default[functionName]) {
          functions[functionName] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return playerAPIReady.then(function (player) {
              var stateInfo = _FunctionStateMap2.default[functionName];
              var playerState = player.getPlayerState();

              // eslint-disable-next-line no-warning-comments
              // TODO: Just spread the args into the function once Babel is fixed:
              // https://github.com/babel/babel/issues/4270
              //
              // eslint-disable-next-line prefer-spread
              var value = player[functionName].apply(player, args);

              // TRICKY: For functions like `seekTo`, a change in state must be
              // triggered given that the resulting state could match the initial
              // state.
              if (stateInfo.stateChangeRequired ||

              // eslint-disable-next-line no-extra-parens
              Array.isArray(stateInfo.acceptableStates) && stateInfo.acceptableStates.indexOf(playerState) === -1) {
                return new Promise(function (resolve) {
                  var onPlayerStateChange = function onPlayerStateChange() {
                    var playerStateAfterChange = player.getPlayerState();

                    var timeout = void 0;

                    if (typeof stateInfo.timeout === 'number') {
                      timeout = setTimeout(function () {
                        player.removeEventListener('onStateChange', onPlayerStateChange);

                        resolve();
                      }, stateInfo.timeout);
                    }

                    if (Array.isArray(stateInfo.acceptableStates) && stateInfo.acceptableStates.indexOf(playerStateAfterChange) !== -1) {
                      player.removeEventListener('onStateChange', onPlayerStateChange);

                      clearTimeout(timeout);

                      resolve();
                    }
                  };

                  player.addEventListener('onStateChange', onPlayerStateChange);
                }).then(function () {
                  return value;
                });
              }

              return value;
            });
          };
        } else {
          functions[functionName] = function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return playerAPIReady.then(function (player) {
              // eslint-disable-next-line no-warning-comments
              // TODO: Just spread the args into the function once Babel is fixed:
              // https://github.com/babel/babel/issues/4270
              //
              // eslint-disable-next-line prefer-spread
              return player[functionName].apply(player, args);
            });
          };
        }
      };

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _functionNames2.default[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var functionName = _step2.value;

          _loop2(functionName);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return functions;
    };

    exports.default = YouTubePlayer;
    module.exports = exports['default'];
    });

    var dist = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



    var _sister2 = _interopRequireDefault(sister);



    var _loadYouTubeIframeApi2 = _interopRequireDefault(loadYouTubeIframeApi);



    var _YouTubePlayer2 = _interopRequireDefault(YouTubePlayer_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /**
     * @typedef YT.Player
     * @see https://developers.google.com/youtube/iframe_api_reference
     * */

    /**
     * @see https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
     */
    var youtubeIframeAPI = void 0;

    /**
     * A factory function used to produce an instance of YT.Player and queue function calls and proxy events of the resulting object.
     *
     * @param maybeElementId Either An existing YT.Player instance,
     * the DOM element or the id of the HTML element where the API will insert an <iframe>.
     * @param options See `options` (Ignored when using an existing YT.Player instance).
     * @param strictState A flag designating whether or not to wait for
     * an acceptable state when calling supported functions. Default: `false`.
     * See `FunctionStateMap.js` for supported functions and acceptable states.
     */

    exports.default = function (maybeElementId) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var strictState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var emitter = (0, _sister2.default)();

      if (!youtubeIframeAPI) {
        youtubeIframeAPI = (0, _loadYouTubeIframeApi2.default)(emitter);
      }

      if (options.events) {
        throw new Error('Event handlers cannot be overwritten.');
      }

      if (typeof maybeElementId === 'string' && !document.getElementById(maybeElementId)) {
        throw new Error('Element "' + maybeElementId + '" does not exist.');
      }

      options.events = _YouTubePlayer2.default.proxyEvents(emitter);

      var playerAPIReady = new Promise(function (resolve) {
        if ((typeof maybeElementId === 'undefined' ? 'undefined' : _typeof(maybeElementId)) === 'object' && maybeElementId.playVideo instanceof Function) {
          var player = maybeElementId;

          resolve(player);
        } else {
          // asume maybeElementId can be rendered inside
          // eslint-disable-next-line promise/catch-or-return
          youtubeIframeAPI.then(function (YT) {
            // eslint-disable-line promise/prefer-await-to-then
            var player = new YT.Player(maybeElementId, options);

            emitter.on('ready', function () {
              resolve(player);
            });

            return null;
          });
        }
      });

      var playerApi = _YouTubePlayer2.default.promisifyPlayer(playerAPIReady, strictState);

      playerApi.on = emitter.on;
      playerApi.off = emitter.off;

      return playerApi;
    };

    module.exports = exports['default'];
    });

    var YoutubePlayer = /*@__PURE__*/getDefaultExportFromCjs(dist);

    /* node_modules/svelte-youtube/src/index.svelte generated by Svelte v3.32.1 */
    const file$7 = "node_modules/svelte-youtube/src/index.svelte";

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "id", /*id*/ ctx[0]);
    			add_location(div0, file$7, 143, 2, 4083);
    			attr_dev(div1, "class", /*className*/ ctx[1]);
    			add_location(div1, file$7, 142, 0, 4057);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			/*div0_binding*/ ctx[5](div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 1) {
    				attr_dev(div0, "id", /*id*/ ctx[0]);
    			}

    			if (dirty & /*className*/ 2) {
    				attr_dev(div1, "class", /*className*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*div0_binding*/ ctx[5](null);
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

    const PlayerState = {
    	UNSTARTED: -1,
    	ENDED: 0,
    	PLAYING: 1,
    	PAUSED: 2,
    	BUFFERING: 3,
    	CUED: 5
    };

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Src", slots, []);
    	let { id = undefined } = $$props; // HTML element ID for player (optional)
    	let { videoId } = $$props; // Youtube video ID (required)
    	let { options = undefined } = $$props; // YouTube player options (optional)
    	let { class: className } = $$props; // HTML class names for container element
    	let playerElem; // player DOM element reference
    	let player; // player API instance

    	// Create and tear down player as component mounts or unmounts
    	onMount(() => createPlayer());

    	function createPlayer() {
    		player = YoutubePlayer(playerElem, options);

    		// Register event handlers
    		player.on("ready", onPlayerReady);

    		player.on("error", onPlayerError);
    		player.on("stateChange", onPlayerStateChange);
    		player.on("playbackRateChange", onPlayerPlaybackRateChange);
    		player.on("playbackQualityChange", onPlayerPlaybackQualityChange);

    		// Tear down player when done
    		return () => player.destroy();
    	}

    	function play(videoId) {
    		// this is needed because the loadVideoById function always starts playing,
    		// even if you have set autoplay to 1 whereas the cueVideoById function
    		// never starts autoplaying
    		if (player && videoId) {
    			if (options && options.playerVars && options.playerVars.autoplay === 1) {
    				player.loadVideoById(videoId);
    			} else {
    				player.cueVideoById(videoId);
    			}
    		}
    	}

    	// -------------------------------------------
    	// Event handling
    	// -------------------------------------------
    	const dispatch = createEventDispatcher();

    	/**
     * https://developers.google.com/youtube/iframe_api_reference#onReady
     *
     * @param {Object} event
     *   @param {Object} target - player object
     */
    	function onPlayerReady(event) {
    		dispatch("ready", event);

    		// Start playing
    		play(videoId);
    	}

    	/**
     * https://developers.google.com/youtube/iframe_api_reference#onError
     *
     * @param {Object} event
     *   @param {Integer} data  - error type
     *   @param {Object} target - player object
     */
    	function onPlayerError(event) {
    		dispatch("error", event);
    	}

    	/**
     * https://developers.google.com/youtube/iframe_api_reference#onStateChange
     *
     * @param {Object} event
     *   @param {Integer} data  - status change type
     *   @param {Object} target - actual YT player
     */
    	function onPlayerStateChange(event) {
    		dispatch("stateChange", event);

    		switch (event.data) {
    			case PlayerState.ENDED:
    				dispatch("end", event);
    				break;
    			case PlayerState.PLAYING:
    				dispatch("play", event);
    				break;
    			case PlayerState.PAUSED:
    				dispatch("pause", event);
    				break;
    		}
    	}

    	/**
     * https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange
     *
     * @param {Object} event
     *   @param {Float} data    - playback rate
     *   @param {Object} target - actual YT player
     */
    	function onPlayerPlaybackRateChange(event) {
    		dispatch("playbackRateChange", event);
    	}

    	/**
     * https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange
     *
     * @param {Object} event
     *   @param {String} data   - playback quality
     *   @param {Object} target - actual YT player
     */
    	function onPlayerPlaybackQualityChange(event) {
    		dispatch("playbackQualityChange", event);
    	}

    	const writable_props = ["id", "videoId", "options", "class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Src> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			playerElem = $$value;
    			$$invalidate(2, playerElem);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("videoId" in $$props) $$invalidate(3, videoId = $$props.videoId);
    		if ("options" in $$props) $$invalidate(4, options = $$props.options);
    		if ("class" in $$props) $$invalidate(1, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({
    		PlayerState,
    		onMount,
    		createEventDispatcher,
    		YoutubePlayer,
    		id,
    		videoId,
    		options,
    		className,
    		playerElem,
    		player,
    		createPlayer,
    		play,
    		dispatch,
    		onPlayerReady,
    		onPlayerError,
    		onPlayerStateChange,
    		onPlayerPlaybackRateChange,
    		onPlayerPlaybackQualityChange
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("videoId" in $$props) $$invalidate(3, videoId = $$props.videoId);
    		if ("options" in $$props) $$invalidate(4, options = $$props.options);
    		if ("className" in $$props) $$invalidate(1, className = $$props.className);
    		if ("playerElem" in $$props) $$invalidate(2, playerElem = $$props.playerElem);
    		if ("player" in $$props) player = $$props.player;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*videoId*/ 8) {
    			// Update videoId and load new video if URL changes
    			play(videoId);
    		}
    	};

    	return [id, className, playerElem, videoId, options, div0_binding];
    }

    class Src extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { id: 0, videoId: 3, options: 4, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Src",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*videoId*/ ctx[3] === undefined && !("videoId" in props)) {
    			console.warn("<Src> was created without expected prop 'videoId'");
    		}

    		if (/*className*/ ctx[1] === undefined && !("class" in props)) {
    			console.warn("<Src> was created without expected prop 'class'");
    		}
    	}

    	get id() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get videoId() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set videoId(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/youtube-iframe.svelte generated by Svelte v3.32.1 */
    const file$8 = "src/youtube-iframe.svelte";

    // (11:2) {#if load}
    function create_if_block$6(ctx) {
    	let youtube;
    	let current;

    	youtube = new Src({
    			props: {
    				videoId: /*id*/ ctx[2],
    				class: "description-youtube-iframe",
    				options: {
    					width: "640",
    					height: "360",
    					playerVars: { autoplay: 1, playsinline: 1 }
    				}
    			},
    			$$inline: true
    		});

    	youtube.$on("ready", /*ready_handler*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(youtube.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(youtube, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const youtube_changes = {};
    			if (dirty & /*id*/ 4) youtube_changes.videoId = /*id*/ ctx[2];
    			youtube.$set(youtube_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(youtube.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(youtube.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(youtube, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(11:2) {#if load}",
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
    				imgClass: "description-youtube-thumbnail",
    				contents: /*contents*/ ctx[0],
    				globalSettings: /*globalSettings*/ ctx[1],
    				sizes: /*sizes*/ ctx[3],
    				imageId: /*id*/ ctx[2],
    				width: "16",
    				height: "9"
    			},
    			$$inline: true
    		});

    	let if_block = /*load*/ ctx[4] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(picture.$$.fragment);
    			t0 = space();
    			img = element("img");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(img, "class", "play-icon svelte-1vh6ykm");
    			if (img.src !== (img_src_value = "/img/youtube.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "YouTubeの再生ボタン");
    			attr_dev(img, "width", "44");
    			attr_dev(img, "height", "31");
    			add_location(img, file$8, 9, 2, 379);
    			attr_dev(div, "class", div_class_value = "youtube-wrapper " + (/*load*/ ctx[4] ? "load" : "") + " svelte-1vh6ykm");
    			add_location(div, file$8, 7, 0, 171);
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
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const picture_changes = {};
    			if (dirty & /*contents*/ 1) picture_changes.contents = /*contents*/ ctx[0];
    			if (dirty & /*globalSettings*/ 2) picture_changes.globalSettings = /*globalSettings*/ ctx[1];
    			if (dirty & /*sizes*/ 8) picture_changes.sizes = /*sizes*/ ctx[3];
    			if (dirty & /*id*/ 4) picture_changes.imageId = /*id*/ ctx[2];
    			picture.$set(picture_changes);

    			if (/*load*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*load*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*load*/ 16 && div_class_value !== (div_class_value = "youtube-wrapper " + (/*load*/ ctx[4] ? "load" : "") + " svelte-1vh6ykm")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(picture.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(picture.$$.fragment, local);
    			transition_out(if_block);
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

    	let { contents } = $$props,
    		{ globalSettings } = $$props,
    		{ id } = $$props,
    		{ sizes } = $$props;

    	let load = false;
    	const writable_props = ["contents", "globalSettings", "id", "sizes"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Youtube_iframe> was created with unknown prop '${key}'`);
    	});

    	const ready_handler = e => {
    		window.addEventListener("slide", () => {
    			e.detail.target.pauseVideo();
    		});
    	};

    	const click_handler = () => $$invalidate(4, load = true);

    	$$self.$$set = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("id" in $$props) $$invalidate(2, id = $$props.id);
    		if ("sizes" in $$props) $$invalidate(3, sizes = $$props.sizes);
    	};

    	$$self.$capture_state = () => ({
    		YouTube: Src,
    		Picture,
    		contents,
    		globalSettings,
    		id,
    		sizes,
    		load
    	});

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    		if ("globalSettings" in $$props) $$invalidate(1, globalSettings = $$props.globalSettings);
    		if ("id" in $$props) $$invalidate(2, id = $$props.id);
    		if ("sizes" in $$props) $$invalidate(3, sizes = $$props.sizes);
    		if ("load" in $$props) $$invalidate(4, load = $$props.load);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contents, globalSettings, id, sizes, load, ready_handler, click_handler];
    }

    class Youtube_iframe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			contents: 0,
    			globalSettings: 1,
    			id: 2,
    			sizes: 3
    		});

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

    		if (/*sizes*/ ctx[3] === undefined && !("sizes" in props)) {
    			console.warn("<Youtube_iframe> was created without expected prop 'sizes'");
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

    	get sizes() {
    		throw new Error("<Youtube_iframe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sizes(value) {
    		throw new Error("<Youtube_iframe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/slide-description.svelte generated by Svelte v3.32.1 */

    const { document: document_1$1 } = globals;
    const file$9 = "src/slide-description.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_10(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (69:14) {:else}
    function create_else_block_4(ctx) {
    	let t_value = /*article*/ ctx[12].subtitle + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*article*/ ctx[12].subtitle + "")) set_data_dev(t, t_value);
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
    	let each_value_10 = /*article*/ ctx[12].subtitle;
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
    				each_value_10 = /*article*/ ctx[12].subtitle;
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
    	let t_value = /*subtitle*/ ctx[36] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*subtitle*/ ctx[36] + "")) set_data_dev(t, t_value);
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
    	let t_value = /*article*/ ctx[12].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*article*/ ctx[12].title + "")) set_data_dev(t, t_value);
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
    	let each_value_9 = /*article*/ ctx[12].title;
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
    				each_value_9 = /*article*/ ctx[12].title;
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
    	let t_value = /*title*/ ctx[18] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*title*/ ctx[18] + "")) set_data_dev(t, t_value);
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

    // (85:14) {#if button.popup}
    function create_if_block_12(ctx) {
    	let div;
    	let t_value = /*button*/ ctx[15].popup + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "popup svelte-dbw5pa");
    			add_location(div, file$9, 85, 16, 3287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*button*/ ctx[15].popup + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(85:14) {#if button.popup}",
    		ctx
    	});

    	return block;
    }

    // (93:16) {:else}
    function create_else_block_2(ctx) {
    	let t_value = /*button*/ ctx[15].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*button*/ ctx[15].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(93:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (89:16) {#if Array.isArray(button.title)}
    function create_if_block_11(ctx) {
    	let each_1_anchor;
    	let each_value_8 = /*button*/ ctx[15].title;
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
    				each_value_8 = /*button*/ ctx[15].title;
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
    		source: "(89:16) {#if Array.isArray(button.title)}",
    		ctx
    	});

    	return block;
    }

    // (90:18) {#each button.title as title}
    function create_each_block_8(ctx) {
    	let span;
    	let t_value = /*title*/ ctx[18] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "break-scope svelte-dbw5pa");
    			add_location(span, file$9, 90, 20, 3537);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*title*/ ctx[18] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(90:18) {#each button.title as title}",
    		ctx
    	});

    	return block;
    }

    // (88:14) <Button target={button.target} bg="#3183fd" width="auto">
    function create_default_slot_5(ctx) {
    	let show_if;
    	let t;

    	function select_block_type_2(ctx, dirty) {
    		if (show_if == null || dirty[0] & /*contents*/ 2) show_if = !!Array.isArray(/*button*/ ctx[15].title);
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
    		source: "(88:14) <Button target={button.target} bg=\\\"#3183fd\\\" width=\\\"auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (84:12) {#each article.buttons as button}
    function create_each_block_7(ctx) {
    	let t;
    	let button;
    	let current;
    	let if_block = /*button*/ ctx[15].popup && create_if_block_12(ctx);

    	button = new Button({
    			props: {
    				target: /*button*/ ctx[15].target,
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
    			if (/*button*/ ctx[15].popup) {
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
    			if (dirty[0] & /*contents*/ 2) button_changes.target = /*button*/ ctx[15].target;

    			if (dirty[0] & /*contents*/ 2 | dirty[1] & /*$$scope*/ 256) {
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
    		source: "(84:12) {#each article.buttons as button}",
    		ctx
    	});

    	return block;
    }

    // (101:10) {#if article.slides}
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
    				speed: /*transitionDuration*/ ctx[4],
    				updateOnImagesReady: true,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swiper.$on("snapIndexChange", /*snapIndexChange_handler*/ ctx[9]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(swiper.$$.fragment);
    			attr_dev(div, "class", "slide svelte-dbw5pa");
    			add_location(div, file$9, 101, 12, 3846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(swiper, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiper_changes = {};

    			if (dirty[0] & /*contents, globalSettings, standardWidth*/ 7 | dirty[1] & /*$$scope*/ 256) {
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
    		source: "(101:10) {#if article.slides}",
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
    				id: /*slide*/ ctx[27].id,
    				sizes: "@media (orientation: portrait) " + /*standardWidth*/ ctx[2] + "vw, " + /*standardWidth*/ ctx[2] * 0.975 / 2 + "vw"
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
    			if (dirty[0] & /*contents*/ 2) yframe_changes.id = /*slide*/ ctx[27].id;
    			if (dirty[0] & /*standardWidth*/ 4) yframe_changes.sizes = "@media (orientation: portrait) " + /*standardWidth*/ ctx[2] + "vw, " + /*standardWidth*/ ctx[2] * 0.975 / 2 + "vw";
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
    	let if_block = /*slide*/ ctx[27].type == "youtube" && create_if_block_10(ctx);

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
    			if (/*slide*/ ctx[27].type == "youtube") {
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

    			if (dirty[0] & /*contents, globalSettings, standardWidth*/ 7 | dirty[1] & /*$$scope*/ 256) {
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

    // (103:14) <Swiper                 centeredSlides={true}                 autoHeight={true}                 spaceBetween={0}                 slidesPerView={1}                 speed={transitionDuration}                 updateOnImagesReady={true}                 on:snapIndexChange={() => window.dispatchEvent(new CustomEvent('slide'))}               >
    function create_default_slot_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_6 = /*article*/ ctx[12].slides;
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
    			if (dirty[0] & /*contents, globalSettings, standardWidth*/ 7) {
    				each_value_6 = /*article*/ ctx[12].slides;
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
    		source: "(103:14) <Swiper                 centeredSlides={true}                 autoHeight={true}                 spaceBetween={0}                 slidesPerView={1}                 speed={transitionDuration}                 updateOnImagesReady={true}                 on:snapIndexChange={() => window.dispatchEvent(new CustomEvent('slide'))}               >",
    		ctx
    	});

    	return block;
    }

    // (128:14) {:else}
    function create_else_block_1(ctx) {
    	let t_value = /*article*/ ctx[12].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*article*/ ctx[12].description + "")) set_data_dev(t, t_value);
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
    	let each_value_5 = /*article*/ ctx[12].description;
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
    				each_value_5 = /*article*/ ctx[12].description;
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
    	let t_value = /*p*/ ctx[25] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "" + (null_to_empty(/*i*/ ctx[14] == 0 ? "first-line" : "") + " svelte-dbw5pa"));
    			add_location(p, file$9, 125, 18, 4838);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*p*/ ctx[25] + "")) set_data_dev(t, t_value);
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
    function create_if_block_2$1(ctx) {
    	let div;
    	let t;
    	let if_block0 = /*article*/ ctx[12].specs.times && create_if_block_4(ctx);
    	let if_block1 = /*article*/ ctx[12].specs.platforms && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "specs svelte-dbw5pa");
    			add_location(div, file$9, 132, 14, 5057);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*article*/ ctx[12].specs.times) {
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

    			if (/*article*/ ctx[12].specs.platforms) {
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
    		id: create_if_block_2$1.name,
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
    	let each_value_4 = /*article*/ ctx[12].specs.times;
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

    			attr_dev(span, "class", "tag svelte-dbw5pa");
    			add_location(span, file$9, 135, 20, 5177);
    			attr_dev(div, "class", "times svelte-dbw5pa");
    			add_location(div, file$9, 134, 18, 5137);
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
    				each_value_4 = /*article*/ ctx[12].specs.times;
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
    	let t0_value = /*time*/ ctx[23].year + "";
    	let t0;
    	let t1;

    	let t2_value = (!(/*time*/ ctx[23].month || /*time*/ ctx[23].day)
    	? /*time*/ ctx[23].annotation
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
    			if (dirty[0] & /*contents*/ 2 && t0_value !== (t0_value = /*time*/ ctx[23].year + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*contents*/ 2 && t2_value !== (t2_value = (!(/*time*/ ctx[23].month || /*time*/ ctx[23].day)
    			? /*time*/ ctx[23].annotation
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
    	let t0_value = /*time*/ ctx[23].month + "";
    	let t0;
    	let t1;
    	let t2_value = (!/*time*/ ctx[23].day ? /*time*/ ctx[23].annotation : "") + "";
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
    			if (dirty[0] & /*contents*/ 2 && t0_value !== (t0_value = /*time*/ ctx[23].month + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*contents*/ 2 && t2_value !== (t2_value = (!/*time*/ ctx[23].day ? /*time*/ ctx[23].annotation : "") + "")) set_data_dev(t2, t2_value);
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
    	let t0_value = /*time*/ ctx[23].day + "";
    	let t0;
    	let t1;
    	let t2_value = /*time*/ ctx[23].annotation + "";
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
    			if (dirty[0] & /*contents*/ 2 && t0_value !== (t0_value = /*time*/ ctx[23].day + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*contents*/ 2 && t2_value !== (t2_value = /*time*/ ctx[23].annotation + "")) set_data_dev(t2, t2_value);
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

    	let t3_value = (/*i*/ ctx[14] + 1 != /*article*/ ctx[12].specs.times.length
    	? ", "
    	: "") + "";

    	let t3;
    	let if_block0 = /*time*/ ctx[23].year && create_if_block_7(ctx);
    	let if_block1 = /*time*/ ctx[23].month && create_if_block_6(ctx);
    	let if_block2 = /*time*/ ctx[23].day && create_if_block_5(ctx);

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
    			attr_dev(time, "class", "break-scope svelte-dbw5pa");

    			attr_dev(time, "datetime", time_datetime_value = (/*time*/ ctx[23].year
    			? ("0000" + /*time*/ ctx[23].year).slice(-4)
    			: "") + (/*time*/ ctx[23].month
    			? "-" + ("00" + /*time*/ ctx[23].month).slice(-2)
    			: "") + (/*time*/ ctx[23].day
    			? "-" + ("00" + /*time*/ ctx[23].day).slice(-2)
    			: ""));

    			add_location(time, file$9, 138, 22, 5358);
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
    			if (/*time*/ ctx[23].year) {
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

    			if (/*time*/ ctx[23].month) {
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

    			if (/*time*/ ctx[23].day) {
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

    			if (dirty[0] & /*contents*/ 2 && time_datetime_value !== (time_datetime_value = (/*time*/ ctx[23].year
    			? ("0000" + /*time*/ ctx[23].year).slice(-4)
    			: "") + (/*time*/ ctx[23].month
    			? "-" + ("00" + /*time*/ ctx[23].month).slice(-2)
    			: "") + (/*time*/ ctx[23].day
    			? "-" + ("00" + /*time*/ ctx[23].day).slice(-2)
    			: ""))) {
    				attr_dev(time, "datetime", time_datetime_value);
    			}

    			if (dirty[0] & /*contents*/ 2 && t3_value !== (t3_value = (/*i*/ ctx[14] + 1 != /*article*/ ctx[12].specs.times.length
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
    	let each_value_3 = /*article*/ ctx[12].specs.platforms;
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

    			attr_dev(span, "class", "tag svelte-dbw5pa");
    			add_location(span, file$9, 155, 20, 6265);
    			attr_dev(div, "class", "platforms svelte-dbw5pa");
    			add_location(div, file$9, 154, 18, 6221);
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
    				each_value_3 = /*article*/ ctx[12].specs.platforms;
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
    	let t0_value = /*platform*/ ctx[21].name + "";
    	let t0;
    	let t1;
    	let t2_value = (/*platform*/ ctx[21].version || "") + "";
    	let t2;
    	let t3_value = (/*platform*/ ctx[21].orLater ? "以降" : "") + "";
    	let t3;

    	let t4_value = (/*i*/ ctx[14] + 1 != /*article*/ ctx[12].specs.platforms.length
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
    			attr_dev(span, "class", "break-scope svelte-dbw5pa");
    			add_location(span, file$9, 157, 22, 6390);
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
    			if (dirty[0] & /*contents*/ 2 && t0_value !== (t0_value = /*platform*/ ctx[21].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*contents*/ 2 && t2_value !== (t2_value = (/*platform*/ ctx[21].version || "") + "")) set_data_dev(t2, t2_value);
    			if (dirty[0] & /*contents*/ 2 && t3_value !== (t3_value = (/*platform*/ ctx[21].orLater ? "以降" : "") + "")) set_data_dev(t3, t3_value);

    			if (dirty[0] & /*contents*/ 2 && t4_value !== (t4_value = (/*i*/ ctx[14] + 1 != /*article*/ ctx[12].specs.platforms.length
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
    function create_if_block_1$2(ctx) {
    	let div;
    	let t_value = /*button*/ ctx[15].popup + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "popup svelte-dbw5pa");
    			add_location(div, file$9, 170, 14, 6864);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*button*/ ctx[15].popup + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(170:12) {#if button.popup}",
    		ctx
    	});

    	return block;
    }

    // (178:14) {:else}
    function create_else_block$4(ctx) {
    	let t_value = /*button*/ ctx[15].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*button*/ ctx[15].title + "")) set_data_dev(t, t_value);
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
    function create_if_block$7(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*button*/ ctx[15].title;
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
    				each_value_2 = /*button*/ ctx[15].title;
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(174:14) {#if Array.isArray(button.title)}",
    		ctx
    	});

    	return block;
    }

    // (175:16) {#each button.title as title}
    function create_each_block_2$1(ctx) {
    	let span;
    	let t_value = /*title*/ ctx[18] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "break-scope svelte-dbw5pa");
    			add_location(span, file$9, 175, 18, 7133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*contents*/ 2 && t_value !== (t_value = /*title*/ ctx[18] + "")) set_data_dev(t, t_value);
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
    		if (show_if == null || dirty[0] & /*contents*/ 2) show_if = !!Array.isArray(/*button*/ ctx[15].title);
    		if (show_if) return create_if_block$7;
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
    	let if_block = /*button*/ ctx[15].popup && create_if_block_1$2(ctx);

    	button = new Button({
    			props: {
    				target: /*button*/ ctx[15].target,
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
    			if (/*button*/ ctx[15].popup) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const button_changes = {};
    			if (dirty[0] & /*contents*/ 2) button_changes.target = /*button*/ ctx[15].target;

    			if (dirty[0] & /*contents*/ 2 | dirty[1] & /*$$scope*/ 256) {
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
    	let div6;
    	let div2;
    	let div0;
    	let span0;
    	let show_if_2;
    	let t0;
    	let span1;
    	let show_if_1;
    	let t1;
    	let div1;
    	let t2;
    	let div4;
    	let t3;
    	let div3;
    	let article;
    	let show_if;
    	let t4;
    	let t5;
    	let div5;
    	let t6;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (show_if_2 == null || dirty[0] & /*contents*/ 2) show_if_2 = !!Array.isArray(/*article*/ ctx[12].subtitle);
    		if (show_if_2) return create_if_block_14;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type(ctx, [-1]);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (show_if_1 == null || dirty[0] & /*contents*/ 2) show_if_1 = !!Array.isArray(/*article*/ ctx[12].title);
    		if (show_if_1) return create_if_block_13;
    		return create_else_block_3;
    	}

    	let current_block_type_1 = select_block_type_1(ctx, [-1]);
    	let if_block1 = current_block_type_1(ctx);
    	let each_value_7 = /*article*/ ctx[12].buttons;
    	validate_each_argument(each_value_7);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_7.length; i += 1) {
    		each_blocks_1[i] = create_each_block_7(get_each_context_7(ctx, each_value_7, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let if_block2 = /*article*/ ctx[12].slides && create_if_block_9(ctx);

    	function select_block_type_3(ctx, dirty) {
    		if (show_if == null || dirty[0] & /*contents*/ 2) show_if = !!Array.isArray(/*article*/ ctx[12].description);
    		if (show_if) return create_if_block_8;
    		return create_else_block_1;
    	}

    	let current_block_type_2 = select_block_type_3(ctx, [-1]);
    	let if_block3 = current_block_type_2(ctx);
    	let if_block4 = /*article*/ ctx[12].specs && create_if_block_2$1(ctx);
    	let each_value_1 = /*article*/ ctx[12].buttons;
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
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			if_block0.c();
    			t0 = space();
    			span1 = element("span");
    			if_block1.c();
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div4 = element("div");
    			if (if_block2) if_block2.c();
    			t3 = space();
    			div3 = element("div");
    			article = element("article");
    			if_block3.c();
    			t4 = space();
    			if (if_block4) if_block4.c();
    			t5 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			attr_dev(span0, "class", "subtitle svelte-dbw5pa");
    			add_location(span0, file$9, 63, 12, 2590);
    			attr_dev(span1, "class", "title svelte-dbw5pa");
    			add_location(span1, file$9, 72, 12, 2879);
    			attr_dev(div0, "class", "headline svelte-dbw5pa");
    			add_location(div0, file$9, 62, 10, 2555);
    			attr_dev(div1, "class", "buttons pc svelte-dbw5pa");
    			add_location(div1, file$9, 82, 10, 3167);
    			attr_dev(div2, "class", "title-container svelte-dbw5pa");
    			add_location(div2, file$9, 61, 8, 2515);
    			attr_dev(article, "class", "svelte-dbw5pa");
    			add_location(article, file$9, 122, 12, 4703);
    			attr_dev(div3, "class", "description svelte-dbw5pa");
    			add_location(div3, file$9, 121, 10, 4665);
    			attr_dev(div4, "class", "description-container svelte-dbw5pa");
    			add_location(div4, file$9, 99, 8, 3767);
    			attr_dev(div5, "class", "buttons mobile svelte-dbw5pa");
    			add_location(div5, file$9, 167, 8, 6746);
    			attr_dev(div6, "class", "slide-container svelte-dbw5pa");
    			set_style(div6, "--backgroundColor", /*backgroundColor*/ ctx[5][/*i*/ ctx[14]]);
    			set_style(div6, "--themeColor", /*contents*/ ctx[1].articles[/*i*/ ctx[14]].themeColor);
    			add_location(div6, file$9, 60, 6, 2381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, span0);
    			if_block0.m(span0, null);
    			append_dev(div0, t0);
    			append_dev(div0, span1);
    			if_block1.m(span1, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div6, t2);
    			append_dev(div6, div4);
    			if (if_block2) if_block2.m(div4, null);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, article);
    			if_block3.m(article, null);
    			append_dev(div3, t4);
    			if (if_block4) if_block4.m(div3, null);
    			append_dev(div6, t5);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			insert_dev(target, t6, anchor);
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
    				each_value_7 = /*article*/ ctx[12].buttons;
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
    						each_blocks_1[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_7.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*article*/ ctx[12].slides) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*contents*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_9(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div4, t3);
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

    			if (/*article*/ ctx[12].specs) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_2$1(ctx);
    					if_block4.c();
    					if_block4.m(div3, null);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (dirty[0] & /*contents*/ 2) {
    				each_value_1 = /*article*/ ctx[12].buttons;
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
    						each_blocks[i].m(div5, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*contents*/ 2) {
    				set_style(div6, "--themeColor", /*contents*/ ctx[1].articles[/*i*/ ctx[14]].themeColor);
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
    			if (detaching) detach_dev(div6);
    			if_block0.d();
    			if_block1.d();
    			destroy_each(each_blocks_1, detaching);
    			if (if_block2) if_block2.d();
    			if_block3.d();
    			if (if_block4) if_block4.d();
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t6);
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

    			if (dirty[0] & /*contents, globalSettings, standardWidth*/ 7 | dirty[1] & /*$$scope*/ 256) {
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

    // (43:0) <Swiper   allowSlideNext={false}   allowSlidePrev={false}   allowTouchMove={false}   autoHeight={true}   spaceBetween={0}   slidesPerView={1}   speed={transitionDuration}   loop={true}   loopAdditionalSlides={contents.articles.length - 1}   effect='fade'   fadeEffect={{crossFade: true}}   on:swiper={setControlledSwiper}   on:snapIndexChange={() => window.dispatchEvent(new CustomEvent('slide'))}   controller={{ control: controlledSwiper ? controlledSwiper : null }} >
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
    			if (dirty[0] & /*backgroundColor, contents, transitionDuration, globalSettings, standardWidth*/ 55) {
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
    		source: "(43:0) <Swiper   allowSlideNext={false}   allowSlidePrev={false}   allowTouchMove={false}   autoHeight={true}   spaceBetween={0}   slidesPerView={1}   speed={transitionDuration}   loop={true}   loopAdditionalSlides={contents.articles.length - 1}   effect='fade'   fadeEffect={{crossFade: true}}   on:swiper={setControlledSwiper}   on:snapIndexChange={() => window.dispatchEvent(new CustomEvent('slide'))}   controller={{ control: controlledSwiper ? controlledSwiper : null }} >",
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
    				speed: /*transitionDuration*/ ctx[4],
    				loop: true,
    				loopAdditionalSlides: /*contents*/ ctx[1].articles.length - 1,
    				effect: "fade",
    				fadeEffect: { crossFade: true },
    				controller: {
    					control: /*controlledSwiper*/ ctx[3]
    					? /*controlledSwiper*/ ctx[3]
    					: null
    				},
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	swiper.$on("swiper", /*setControlledSwiper*/ ctx[6]);
    	swiper.$on("snapIndexChange", /*snapIndexChange_handler_1*/ ctx[10]);

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			t = space();
    			create_component(swiper.$$.fragment);
    			attr_dev(link0, "rel", "preload");
    			attr_dev(link0, "href", "/swiper-bundle.min.css");
    			attr_dev(link0, "as", "style");
    			attr_dev(link0, "class", "svelte-dbw5pa");
    			add_location(link0, file$9, 38, 2, 1694);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "type", "text/css");
    			attr_dev(link1, "href", "/swiper-bundle.min.css");
    			attr_dev(link1, "class", "svelte-dbw5pa");
    			add_location(link1, file$9, 39, 2, 1758);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1$1.head, link0);
    			append_dev(document_1$1.head, link1);
    			insert_dev(target, t, anchor);
    			mount_component(swiper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const swiper_changes = {};
    			if (dirty[0] & /*contents*/ 2) swiper_changes.loopAdditionalSlides = /*contents*/ ctx[1].articles.length - 1;

    			if (dirty[0] & /*controlledSwiper*/ 8) swiper_changes.controller = {
    				control: /*controlledSwiper*/ ctx[3]
    				? /*controlledSwiper*/ ctx[3]
    				: null
    			};

    			if (dirty[0] & /*contents, globalSettings, standardWidth*/ 7 | dirty[1] & /*$$scope*/ 256) {
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
    	component_subscribe($$self, sync, $$value => $$invalidate(11, $sync = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Slide_description", slots, []);

    	let { pairId } = $$props,
    		{ isParent } = $$props,
    		{ globalSettings } = $$props,
    		{ contents } = $$props,
    		{ standardWidth } = $$props;

    	const transitionDuration = globalSettings.transitionDuration,
    		backgroundColor = contents.articles.map(v => color(v.themeColor).lightness(95).desaturate(0.3).hex());

    	Swiper.use([Controller$1, EffectFade]);
    	let controlledSwiper = null;

    	const setControlledSwiper = e => {
    		const [swiper] = e.detail;
    		set_store_value(sync, $sync.controlledSwiper = null, $sync);

    		// set Controller swiper instance
    		setTimeout(
    			() => {
    				$$invalidate(3, controlledSwiper = swiper);
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

    	const writable_props = ["pairId", "isParent", "globalSettings", "contents", "standardWidth"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Slide_description> was created with unknown prop '${key}'`);
    	});

    	const snapIndexChange_handler = () => window.dispatchEvent(new CustomEvent("slide"));
    	const snapIndexChange_handler_1 = () => window.dispatchEvent(new CustomEvent("slide"));

    	$$self.$$set = $$props => {
    		if ("pairId" in $$props) $$invalidate(7, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(8, isParent = $$props.isParent);
    		if ("globalSettings" in $$props) $$invalidate(0, globalSettings = $$props.globalSettings);
    		if ("contents" in $$props) $$invalidate(1, contents = $$props.contents);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
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
    		standardWidth,
    		transitionDuration,
    		backgroundColor,
    		controlledSwiper,
    		setControlledSwiper,
    		$sync
    	});

    	$$self.$inject_state = $$props => {
    		if ("pairId" in $$props) $$invalidate(7, pairId = $$props.pairId);
    		if ("isParent" in $$props) $$invalidate(8, isParent = $$props.isParent);
    		if ("globalSettings" in $$props) $$invalidate(0, globalSettings = $$props.globalSettings);
    		if ("contents" in $$props) $$invalidate(1, contents = $$props.contents);
    		if ("standardWidth" in $$props) $$invalidate(2, standardWidth = $$props.standardWidth);
    		if ("controlledSwiper" in $$props) $$invalidate(3, controlledSwiper = $$props.controlledSwiper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		globalSettings,
    		contents,
    		standardWidth,
    		controlledSwiper,
    		transitionDuration,
    		backgroundColor,
    		setControlledSwiper,
    		pairId,
    		isParent,
    		snapIndexChange_handler,
    		snapIndexChange_handler_1
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
    				pairId: 7,
    				isParent: 8,
    				globalSettings: 0,
    				contents: 1,
    				standardWidth: 2
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

    		if (/*pairId*/ ctx[7] === undefined && !("pairId" in props)) {
    			console.warn("<Slide_description> was created without expected prop 'pairId'");
    		}

    		if (/*isParent*/ ctx[8] === undefined && !("isParent" in props)) {
    			console.warn("<Slide_description> was created without expected prop 'isParent'");
    		}

    		if (/*globalSettings*/ ctx[0] === undefined && !("globalSettings" in props)) {
    			console.warn("<Slide_description> was created without expected prop 'globalSettings'");
    		}

    		if (/*contents*/ ctx[1] === undefined && !("contents" in props)) {
    			console.warn("<Slide_description> was created without expected prop 'contents'");
    		}

    		if (/*standardWidth*/ ctx[2] === undefined && !("standardWidth" in props)) {
    			console.warn("<Slide_description> was created without expected prop 'standardWidth'");
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

    	get standardWidth() {
    		throw new Error("<Slide_description>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set standardWidth(value) {
    		throw new Error("<Slide_description>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/footer.svelte generated by Svelte v3.32.1 */

    const { Object: Object_1 } = globals;
    const file$a = "src/footer.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (42:2) {#if contents.copyright}
    function create_if_block_4$1(ctx) {
    	let section;
    	let div;
    	let show_if;
    	let t0;
    	let span0;
    	let t2;
    	let span1;

    	function select_block_type(ctx, dirty) {
    		if (show_if == null || dirty & /*contents*/ 1) show_if = !!Array.isArray(/*contents*/ ctx[0].copyright);
    		if (show_if) return create_if_block_5$1;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx, -1);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if_block.c();
    			t0 = space();
    			span0 = element("span");
    			span0.textContent = "Hash: 836d1a";
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "Build: 21/4/24-19:36";
    			attr_dev(span0, "class", "break-scope");
    			add_location(span0, file$a, 51, 8, 2251);
    			attr_dev(span1, "class", "break-scope");
    			add_location(span1, file$a, 52, 8, 2305);
    			add_location(div, file$a, 43, 6, 1909);
    			attr_dev(section, "class", "copyright svelte-1wdp62n");
    			add_location(section, file$a, 42, 4, 1875);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, span0);
    			append_dev(div, t2);
    			append_dev(div, span1);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_block.d();
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

    // (49:8) {:else}
    function create_else_block$5(ctx) {
    	let span;
    	let raw_value = /*contents*/ ctx[0].copyright + "";

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "break-scope");
    			add_location(span, file$a, 49, 10, 2169);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && raw_value !== (raw_value = /*contents*/ ctx[0].copyright + "")) span.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(49:8) {:else}",
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
    	let raw_value = /*copyright*/ ctx[3] + "";

    	let t_value = (/*i*/ ctx[5] + 1 != /*contents*/ ctx[0].copyright.length
    	? ", "
    	: "") + "";

    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			html_tag = new HtmlTag(t);
    			attr_dev(span, "class", "break-scope");
    			add_location(span, file$a, 46, 12, 2028);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			html_tag.m(raw_value, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contents*/ 1 && raw_value !== (raw_value = /*copyright*/ ctx[3] + "")) html_tag.p(raw_value);

    			if (dirty & /*contents*/ 1 && t_value !== (t_value = (/*i*/ ctx[5] + 1 != /*contents*/ ctx[0].copyright.length
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

    // (57:2) {#if contents.codeLicense}
    function create_if_block_1$3(ctx) {
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
    	let if_block1 = /*contents*/ ctx[0].codeLicense.linkLabel && /*contents*/ ctx[0].codeLicense.url && create_if_block_2$2(ctx);

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
    			add_location(div0, file$a, 58, 6, 2460);
    			attr_dev(section0, "class", "license svelte-1wdp62n");
    			add_location(section0, file$a, 57, 4, 2428);
    			add_location(div1, file$a, 66, 6, 2891);
    			attr_dev(section1, "class", "license svelte-1wdp62n");
    			add_location(section1, file$a, 65, 4, 2859);
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
    					if_block1 = create_if_block_2$2(ctx);
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(57:2) {#if contents.codeLicense}",
    		ctx
    	});

    	return block;
    }

    // (61:8) {#if contents.codeLicense.linkLabel && contents.codeLicense.url}
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
    			add_location(a, file$a, 61, 10, 2740);
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
    		source: "(61:8) {#if contents.codeLicense.linkLabel && contents.codeLicense.url}",
    		ctx
    	});

    	return block;
    }

    // (69:8) {#if contents.codeLicense.linkLabel && contents.codeLicense.url}
    function create_if_block_2$2(ctx) {
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
    			add_location(a, file$a, 69, 10, 3135);
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
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(69:8) {#if contents.codeLicense.linkLabel && contents.codeLicense.url}",
    		ctx
    	});

    	return block;
    }

    // (75:2) {#if contents.assetsLicense.ccType}
    function create_if_block$8(ctx) {
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
    			attr_dev(img0, "width", "80");
    			attr_dev(img0, "height", "15");
    			attr_dev(img0, "loading", "lazy");
    			add_location(img0, file$a, 77, 105, 3464);
    			attr_dev(a0, "rel", "license");
    			attr_dev(a0, "href", a0_href_value = "http://creativecommons.org/licenses/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/");
    			add_location(a0, file$a, 77, 8, 3367);
    			attr_dev(a1, "rel", "license");
    			attr_dev(a1, "href", a1_href_value = "http://creativecommons.org/licenses/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/");
    			add_location(a1, file$a, 77, 430, 3789);
    			add_location(div0, file$a, 76, 6, 3353);
    			attr_dev(section0, "class", "creative-commons svelte-1wdp62n");
    			add_location(section0, file$a, 75, 4, 3312);
    			attr_dev(img1, "alt", "クリエイティブ・コモンズ・ライセンス");
    			set_style(img1, "border-width", "0");
    			set_style(img1, "display", "inline-block");
    			set_style(img1, "vertical-align", "middle");
    			set_style(img1, "margin-right", "1ch");
    			if (img1.src !== (img1_src_value = "https://i.creativecommons.org/l/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/80x15.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "width", "80");
    			attr_dev(img1, "height", "15");
    			attr_dev(img1, "loading", "lazy");
    			add_location(img1, file$a, 82, 113, 4591);
    			attr_dev(a2, "rel", "license");
    			attr_dev(a2, "href", a2_href_value = "https://creativecommons.org/licenses/" + /*contents*/ ctx[0].assetsLicense.ccType + "/4.0/deed.ja");
    			add_location(a2, file$a, 82, 8, 4486);
    			attr_dev(a3, "rel", "license");
    			attr_dev(a3, "href", "https://creativecommons.org/licenses/by-nd/4.0/deed.ja");
    			add_location(a3, file$a, 82, 381, 4859);
    			add_location(div1, file$a, 81, 6, 4472);
    			attr_dev(section1, "class", "creative-commons svelte-1wdp62n");
    			add_location(section1, file$a, 80, 4, 4431);
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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(75:2) {#if contents.assetsLicense.ccType}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let footer;
    	let t0;
    	let t1;
    	let if_block0 = /*contents*/ ctx[0].copyright && create_if_block_4$1(ctx);
    	let if_block1 = /*contents*/ ctx[0].codeLicense && create_if_block_1$3(ctx);
    	let if_block2 = /*contents*/ ctx[0].assetsLicense.ccType && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			set_style(footer, "--itemsCount", /*func*/ ctx[2]());
    			attr_dev(footer, "class", "svelte-1wdp62n");
    			add_location(footer, file$a, 40, 0, 1702);
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
    					if_block1 = create_if_block_1$3(ctx);
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
    					if_block2 = create_if_block$8(ctx);
    					if_block2.c();
    					if_block2.m(footer, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*contents*/ 1) {
    				set_style(footer, "--itemsCount", /*func*/ ctx[2]());
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
    	let { contents } = $$props;

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

    	const writable_props = ["contents"];

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
    	};

    	$$self.$capture_state = () => ({ contents, licenses });

    	$$self.$inject_state = $$props => {
    		if ("contents" in $$props) $$invalidate(0, contents = $$props.contents);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contents, licenses, func];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { contents: 0 });

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
    	}

    	get contents() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contents(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/cards.svelte generated by Svelte v3.32.1 */
    const file$b = "src/cards.svelte";

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

    // (33:10) {#if card.imageId}
    function create_if_block$9(ctx) {
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
    			attr_dev(div, "class", "left svelte-1bmpvwl");
    			add_location(div, file$b, 33, 12, 1027);
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
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(33:10) {#if card.imageId}",
    		ctx
    	});

    	return block;
    }

    // (41:14) {#each card.post as post}
    function create_each_block_2$2(ctx) {
    	let span;
    	let t_value = /*post*/ ctx[13] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-1bmpvwl");
    			add_location(span, file$b, 41, 16, 1595);
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
    		source: "(41:14) {#each card.post as post}",
    		ctx
    	});

    	return block;
    }

    // (52:10) {#each card.accounts as account}
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
    			attr_dev(img, "class", "svelte-1bmpvwl");
    			add_location(img, file$b, 54, 14, 2484);
    			attr_dev(span, "class", "id svelte-1bmpvwl");
    			add_location(span, file$b, 55, 14, 2743);
    			attr_dev(a, "class", a_class_value = "social-button " + /*account*/ ctx[10].name + " " + (/*card*/ ctx[7].accounts.length > 2 ? "iconOnly" : "") + " svelte-1bmpvwl");

    			attr_dev(a, "href", a_href_value = /*account*/ ctx[10].customUrl
    			? /*account*/ ctx[10].customUrl
    			: `https://${/*socialConsts*/ ctx[5].urls[/*account*/ ctx[10].name]}/${/*account*/ ctx[10].id}`);

    			set_style(a, "--popupContent", "'" + ((/*account*/ ctx[10].name == "twitter" ? "@" : "") + /*account*/ ctx[10].id) + "'");
    			add_location(a, file$b, 52, 12, 2184);
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

    			if (dirty & /*contents*/ 1 && a_class_value !== (a_class_value = "social-button " + /*account*/ ctx[10].name + " " + (/*card*/ ctx[7].accounts.length > 2 ? "iconOnly" : "") + " svelte-1bmpvwl")) {
    				attr_dev(a, "class", a_class_value);
    			}

    			if (dirty & /*contents*/ 1 && a_href_value !== (a_href_value = /*account*/ ctx[10].customUrl
    			? /*account*/ ctx[10].customUrl
    			: `https://${/*socialConsts*/ ctx[5].urls[/*account*/ ctx[10].name]}/${/*account*/ ctx[10].id}`)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*contents*/ 1) {
    				set_style(a, "--popupContent", "'" + ((/*account*/ ctx[10].name == "twitter" ? "@" : "") + /*account*/ ctx[10].id) + "'");
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
    		source: "(52:10) {#each card.accounts as account}",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#each contents.cards as card}
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
    	let if_block = /*card*/ ctx[7].imageId && create_if_block$9(ctx);
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
    			attr_dev(div0, "class", "name svelte-1bmpvwl");
    			add_location(div0, file$b, 38, 12, 1472);
    			attr_dev(div1, "class", "post svelte-1bmpvwl");
    			add_location(div1, file$b, 39, 12, 1520);
    			set_style(div2, "opacity", "0");
    			set_style(div2, "width", "1ch");
    			add_location(div2, file$b, 45, 14, 1701);
    			attr_dev(div3, "class", "logo svelte-1bmpvwl");
    			add_location(div3, file$b, 44, 12, 1668);
    			attr_dev(div4, "class", div4_class_value = "right " + (/*card*/ ctx[7].imageId ? "" : "noImage") + " svelte-1bmpvwl");
    			add_location(div4, file$b, 37, 10, 1408);
    			attr_dev(div5, "class", "upper svelte-1bmpvwl");
    			add_location(div5, file$b, 31, 8, 966);
    			attr_dev(div6, "class", "lower svelte-1bmpvwl");
    			add_location(div6, file$b, 50, 8, 2109);
    			attr_dev(div7, "class", "card svelte-1bmpvwl");
    			add_location(div7, file$b, 30, 6, 939);
    			attr_dev(div8, "class", "card_wrapper svelte-1bmpvwl");
    			add_location(div8, file$b, 29, 4, 906);
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
    					if_block = create_if_block$9(ctx);
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

    			if (!current || dirty & /*contents*/ 1 && div4_class_value !== (div4_class_value = "right " + (/*card*/ ctx[7].imageId ? "" : "noImage") + " svelte-1bmpvwl")) {
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
    		source: "(29:2) {#each contents.cards as card}",
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

    			attr_dev(div, "class", "card_container svelte-1bmpvwl");
    			add_location(div, file$b, 27, 0, 840);
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
    const file$c = "src/App.svelte";

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

    // (24:0) {#if settings.find(v => v.sectionType == 'navHeader')}
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
    		source: "(24:0) {#if settings.find(v => v.sectionType == 'navHeader')}",
    		ctx
    	});

    	return block;
    }

    // (35:41) 
    function create_if_block_3$2(ctx) {
    	let cframe;
    	let current;

    	cframe = new Common_frame({
    			props: {
    				id: /*id*/ ctx[10],
    				title: /*title*/ ctx[5],
    				subtitle: /*subtitle*/ ctx[6],
    				themeColor: /*themeColor*/ ctx[7],
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
    		source: "(35:41) ",
    		ctx
    	});

    	return block;
    }

    // (33:38) 
    function create_if_block_2$3(ctx) {
    	let footer;
    	let current;

    	footer = new Footer({
    			props: { contents: /*contents*/ ctx[9] },
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
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(33:38) ",
    		ctx
    	});

    	return block;
    }

    // (31:41) 
    function create_if_block_1$4(ctx) {
    	let desc;
    	let current;

    	desc = new Slide_description({
    			props: {
    				contents: /*contents*/ ctx[9],
    				globalSettings: /*globalSettings*/ ctx[1],
    				pairId: /*pairId*/ ctx[11],
    				isParent: /*isParent*/ ctx[12],
    				standardWidth: /*standardWidth*/ ctx[2]
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
    			if (dirty & /*standardWidth*/ 4) desc_changes.standardWidth = /*standardWidth*/ ctx[2];
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(31:41) ",
    		ctx
    	});

    	return block;
    }

    // (29:4) {#if sectionType == "slideHero"}
    function create_if_block$a(ctx) {
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
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(29:4) {#if sectionType == \\\"slideHero\\\"}",
    		ctx
    	});

    	return block;
    }

    // (41:41) 
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
    		source: "(41:41) ",
    		ctx
    	});

    	return block;
    }

    // (39:44) 
    function create_if_block_5$2(ctx) {
    	let dlist;
    	let current;

    	dlist = new Date_list({
    			props: { contents: /*contents*/ ctx[9] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dlist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dlist_changes = {};
    			if (dirty & /*settings*/ 1) dlist_changes.contents = /*contents*/ ctx[9];
    			dlist.$set(dlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(39:44) ",
    		ctx
    	});

    	return block;
    }

    // (37:8) {#if sectionType == "static"}
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
    		source: "(37:8) {#if sectionType == \\\"static\\\"}",
    		ctx
    	});

    	return block;
    }

    // (36:6) <Cframe {id} {title} {subtitle} {themeColor}>
    function create_default_slot$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_4$2, create_if_block_5$2, create_if_block_6$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*sectionType*/ ctx[8] == "static") return 0;
    		if (/*sectionType*/ ctx[8] == "dateList") return 1;
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
    		source: "(36:6) <Cframe {id} {title} {subtitle} {themeColor}>",
    		ctx
    	});

    	return block;
    }

    // (28:2) {#each settings as {title, subtitle, themeColor, sectionType, contents, id, pairId, isParent}
    function create_each_block$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_if_block_1$4, create_if_block_2$3, create_if_block_3$2];
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
    		source: "(28:2) {#each settings as {title, subtitle, themeColor, sectionType, contents, id, pairId, isParent}",
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
    			add_location(main, file$c, 26, 0, 1110);
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
    	let { settings } = $$props, { globalSettings } = $$props;
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
    		Dlist: Date_list,
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
            sectionType: 'dateList',
            title: 'NEWS',
            subtitle: 'チームからのお知らせ',
            themeColor: '#ff0200',
            id: 'news',
            contents: {
              shownItemsCount: 3,
              articles: [
                {
                  title: '『フォーリンパフェ』がデベロッパーズゲームコンテスト2020にて企業賞（f4samurai賞）を受賞！',
                  date: {
                    year: '2021',
                    month: '1',
                    day: '29'
                  },
                  url: 'https://twitter.com/MachiCollider/status/1355123713226625027'
                },
                {
                  title: 'スーパースターマインが「活躍する電大人」に掲載！',
                  date: {
                    year: '2021',
                    month: '1',
                    day: '28'
                  },
                  url: 'https://www.dendai.ac.jp/dendai-people/20210128-01.html'
                },
                {
                  title: '『れーぞく！ネクロマンスちゃん』がゲームクリエイター甲子園2020にて総合大賞3位、審査員特別賞（鈴木英仁賞）、話題賞を受賞！',
                  date: {
                    year: '2020',
                    month: '12',
                    day: '19'
                  },
                  url: 'https://www.4gamer.net/games/999/G999905/20201228102/'
                },
                {
                  title: '『れーぞく！ネクロマンスちゃん』をデジゲー博2020に出展！',
                  date: {
                    year: '2020',
                    month: '11',
                    day: '29'
                  },
                  url: 'http://digigame-expo.org/'
                },
                {
                  title: '『フォーリンパフェ』がUnity 1Weekゲームジャムにて総合ランキング、絵作りランキングに入賞！',
                  date: {
                    year: '2020',
                    month: '8',
                    day: '30'
                  },
                  url: 'https://unityroom.com/unity1weeks/17'
                },
                {
                  title: '『SPINNER』をゲーム業界交流会に出展！',
                  date: {
                    year: '2020',
                    month: '2',
                    day: '6'
                  },
                  url: 'https://game.creators-guild.com/g4c/%E3%82%B2%E3%83%BC%E3%83%A0%E6%A5%AD%E7%95%8C%E4%BA%A4%E6%B5%81%E4%BC%9A%E3%81%AB%E6%BD%9C%E5%85%A5%EF%BC%81/'
                },
                {
                  title: 'ゲームクリエイターズギルド様からインタビューをしていただきました！',
                  date: {
                    year: '2019',
                    month: '12',
                    day: '27'
                  },
                  url: 'https://game.creators-guild.com/g4c/interview-studentgamescreator-20190114/'
                },
                {
                  title: '『SPINNER』がGCG EXPO 2019で最優秀賞を受賞！',
                  date: {
                    year: '2019',
                    month: '11',
                    day: '30'
                  },
                  url: 'https://game.creators-guild.com/g4c/event-realevent-20191205/'
                },
                {
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
