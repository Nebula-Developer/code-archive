
function checkArgs(...args) {
    var len = args.length;
    if (len % 2 !== 0) return false;
    
    for (var i = 0; i < len; i += 2)
        if (typeof args[i] !== args[i + 1]) return false;

    return true;
}

module.exports = {
    checkArgs
};
