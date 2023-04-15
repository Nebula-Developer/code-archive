const path = require('path');

const root = require.main.path;
const public = path.join(root, 'public');
const private = path.join(root, 'private');
const resources = path.join(public, 'resources');
const pages = path.join(public, 'pages');
const files = path.join(private, 'files');

const getRoot = (p) => path.join(root, p);
const getPublic = (p) => path.join(public, p);
const getPrivate = (p) => path.join(private, p);
const getResources = (p) => path.join(resources, p);
const getPages = (p) => path.join(pages, p);
const getFiles = (p) => path.join(files, p);

module.exports = { 
    root, public, private, resources, pages, files,
    getRoot, getPublic, getPrivate, getResources, getPages, getFiles
};
