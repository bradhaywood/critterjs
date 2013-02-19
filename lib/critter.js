"use strict";

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
}

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
}

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
}

function println(str) {
    document.writeln(str + "<br />");
}
