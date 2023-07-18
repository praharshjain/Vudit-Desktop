const path = require('path');
const data = require(path.join(__dirname, 'package.json'));
const file_types = require(path.join(__dirname, 'file_types.json'));
data.build.fileAssociations = file_types;
module.exports = data.build;