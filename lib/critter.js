"use strict";

function __getObj(str) {
    var obj = eval("(" + str + ")");
    if (typeof obj == 'function') return obj;
    else return false;
}

Object.prototype.extends = function(klass) {
   var obj;
   if(obj = __getObj(klass))
        this.prototype = new obj;
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

function println(str) {
    document.writeln(str + "<br />");
}
