const fs = require('fs');
const path = require('path');

exports.default = async function (context) {
    const APP_NAME = context.packager.appInfo.productFilename;
    const APP_OUT_DIR = context.appOutDir;
    const from = "package.json";
    //path for mac
    let to = path.join(`${APP_OUT_DIR}`, `${APP_NAME}.app/Contents/Resources/app/package.json`);
    fs.copyFile(from, to, (err) => {
        if (err) {
            //path for windows and linux
            to = path.join(`${APP_OUT_DIR}`, `/resources/app/package.json`);
            fs.copyFile(from, to, (err) => {
                if (err) {
                    console.log("\n\n\n error in copying package.json: ", err);
                }
            });
        }
    });
}