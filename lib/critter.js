function __getObj(str) {
    var obj = eval("(" + str + ")");
    if (typeof obj == 'function') return obj;
    else return false;
}

Object.prototype.extends = function(klass) {
    var obj;
    if(obj = __getObj(klass)) {
        this.prototype = new obj;
        this.prototype.constructor = this.name;
    }
};

Object.prototype.has = function(attr, opts) {
    var value;
    var writable = false;

    if (opts) {
        if ("value" in opts) value = opts["value"];
        if ("is" in opts) {
            if (opts["is"] == 'rw')
                writable = true;
        }
        else { throw new Error("has(): Expecting 'is'"); }
    }
    else
        throw new Error("has(): No options specified");

    Object.defineProperty(this, attr, {
        enumerable: false,
        configurable: false,
        writable: writable,
        value: value
    });
};

Object.prototype.method = function(name, cb) {
    if (typeof this == 'object') {
        var obj;
        if (obj = this.constructor.name) {
            obj = window[obj];
            //FIXME: for the love of god help me find a better solution to this
            eval("obj.prototype." + name + " = cb;");
            if (! (name in obj))
                obj[name] = cb;
        }
    }
    else { this[name] = cb; }
};

var __getElementsByClassName = function(className) {
    var hasClassName = new RegExp("(?:^|\\s)" + className + "(?:$|\\s)");
    var allElements = document.getElementsByTagName("*");
    var results = [];

    var element;
    for (var i = 0; (element = allElements[i]) != null; i++) {
        var elementClass = element.className;
        if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass))
            results.push(element);
    }

    return results;
};

Object.prototype.each = function(cb) {
    for(var i = 0; i < this.length; i++) {
        cb(this[i], i);
    }
};

Object.prototype.isArray = function() {
    if (Object.prototype.toString.call(this) === '[object Array]')
        return true;
    else
        return false;
};

function __createEvent(me, type, cb) {
    var doEvent = function(v) {
        if (v.addEventListener)
            v.addEventListener(type, cb, false);

        else if (v.attachEvent)
            v.attachEvent(on + type, cb);
    };

    if (me.isArray()) {
        me.each(function(val) {
            doEvent(val);
        });
    }
    else { doEvent(me); }
}

Object.prototype.clicked = function(fn) { __createEvent(this, 'click', fn); };
Object.prototype.double_clicked = function(fn) { __createEvent(this, 'dblclick', fn); };

var Critter = {
    evt: function(domObj, type, fn) {
        if(domObj.addEventListener)
            domObj.addEventListener(type, fn, false);  
        else if (domObj.attachEvent)
            domObj.attachEvent('on'+type, fn);  
        else
            domObj['on'+type] = fn;
    },

    when: function(e) {
        if (typeof e === 'object') return e;
        var sigil   = e.substring(0, 1);
        var element = e.substring(1, e.length);
        if (sigil == '#')
            return document.getElementById(element);

        else if (sigil == '.')
            return __getElementsByClassName(element);

        else
            return document.getElementsByTagName(e);
    },
    
    ready: function(cb) {
        if(document.addEventListener) {   // Mozilla, Opera, Webkit are all happy with this
            document.addEventListener("DOMContentLoaded", function() {
                document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
                cb();
            }, false);
        }
        else if(document.attachEvent) {   // IE sucks, so likes to be different
            document.attachEvent("onreadystatechange", function() {
                if(document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", arguments.callee);
                    cb();
                }
            });
        }
    }
};  

function println(str) {
    document.writeln(str + "<br />");
}
