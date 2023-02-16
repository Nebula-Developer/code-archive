
function checkArgs(...args) {
    if (args.length % 2 != 0) throw new Error("Invalid number of arguments.");
    for (var i = 0; i < args.length; i += 2) if (typeof args[i] != args[i + 1]) return false;
    return true;
}

const empty = () => {};
const checkCallback = (callback) => callback && typeof callback == 'function';

module.exports = {
    check: checkArgs,
    empty,
    checkCallback
}
