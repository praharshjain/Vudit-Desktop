const fs = require('fs');
const path = require('path');

exports.default = async function (context) {
    const APP_NAME = context.packager.appInfo.productFilename;
    const APP_OUT_DIR = context.appOutDir;
    const to = path.join(`${APP_OUT_DIR}`, `${APP_NAME}.app/Contents/Resources/app/package.json`);
    fs.copyFile("package.json", to, (err) => {
        if (err) {
            console.log("\n\n\n error in copying package.json: ", err);
        }
    });
}