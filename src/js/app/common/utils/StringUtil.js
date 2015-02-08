String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function generateRandomString(l) {
    if (l == null) {
        l = 64;
    }
    
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var randomstring = '';
    for (var i = 0; i < l; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    
    return randomstring;
}

function isEmpty(s) {
    return !s.length;
}

function isBlank(s) {
    return isEmpty(s.trim());
}