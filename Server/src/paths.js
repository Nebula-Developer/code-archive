const path = require('path');
const fs = require('fs');

const __root = require.main.path;
const __private = path.join(__root, 'private');
const __public = path.join(__root, 'public');

if (!fs.existsSync(__private)) fs.mkdirSync(__private);
if (!fs.existsSync(__public)) fs.mkdirSync(__public);

const getRoot = (...args) => path.join(__root, ...args);
const getPrivate = (...args) => path.join(__private, ...args);
const getPublic = (...args) => path.join(__public, ...args);

module.exports = { root: __root, private: __private, public: __public, getRoot, getPrivate, getPublic };
