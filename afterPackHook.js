const fs = require('fs');
const { exec } = require('@actions/exec');
const path = require('path');
const plist = require('plist');
const config = require('./app/config');

exports.default = async function (context) {
    console.log("\n\n starting after pack hook \n\n");
    const APP_NAME = context.packager.appInfo.productFilename;
    const APP_OUT_DIR = context.appOutDir;
    //update quick look extension plist
    const plistPath = path.join(`${APP_OUT_DIR}`, `${APP_NAME}.app/Contents/Plugins/PreviewExtension.appex/Contents/Info.plist`);
    try {
        const plistObj = plist.parse(fs.readFileSync(plistPath, "utf8"));
        plistObj["CFBundleIdentifier"] = "tech.praharsh.vudit.PreviewExtension";
        plistObj["NSExtension"]["NSExtensionAttributes"]["QLSupportedContentTypes"] = [
            "public.plain-text",
            "public.text",
            "public.xml",
            "public.html",
            "public.source-code",
            "public.content",
            "public.item",
            "public.data",
            "public.archive",
            "public.image"
        ];
        plistObj["QLJS"]["loadingStrategy"] = "navigationComplete";
        plistObj["QLJS"]["pagePath"] = "app/quicklook/preview.html";
        fs.writeFileSync("app/quicklook/typemap.js", "");
        fs.writeFileSync("app/quicklook/typemap.js", "let fileTypeMapStr = `" + JSON.stringify(config.fileTypeMap) + "`; let fileTypeMap = JSON.parse(fileTypeMapStr);");
        fs.writeFileSync(plistPath, plist.build(plistObj));
        await exec("codesign", [
            "--sign",
            "-",
            "--force",
            "--entitlements",
            path.join("node_modules", "quicklookjs", "dist", "PreviewExtension.entitlements"),
            path.join(`${APP_OUT_DIR}`, `${APP_NAME}.app/Contents/PlugIns/PreviewExtension.appex`)
        ]);
        console.log("\n\n after pack hook completed \n\n");
    } catch (err) {
        console.log("error occurred while updating plist: ", err);
    }
}