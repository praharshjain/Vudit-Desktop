const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

exports.default = async function (context) {
    const APP_NAME = context.packager.appInfo.productFilename;
    const APP_OUT_DIR = context.appOutDir;

    // Step 1: Copy package.json
    await copyPackageJson(APP_OUT_DIR, APP_NAME);

    // Step 2: Minify files and cleanup
    await optimizeApp(APP_OUT_DIR, APP_NAME);
}

async function copyPackageJson(APP_OUT_DIR, APP_NAME) {
    const from = "package.json";
    // Path for mac
    let to = path.join(`${APP_OUT_DIR}`, `${APP_NAME}.app/Contents/Resources/app/package.json`);

    return new Promise((resolve) => {
        fs.copyFile(from, to, (err) => {
            if (err) {
                // Path for windows and linux
                to = path.join(`${APP_OUT_DIR}`, `/resources/app/package.json`);
                fs.copyFile(from, to, (err) => {
                    if (err) {
                        console.log("\n\n\n error in copying package.json: ", err);
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    });
}

async function optimizeApp(APP_OUT_DIR, APP_NAME) {
    // Determine the resources path based on platform
    let resourcesPath = path.join(`${APP_OUT_DIR}`, `${APP_NAME}.app/Contents/Resources/app`);

    if (!fs.existsSync(resourcesPath)) {
        // Windows/Linux path
        resourcesPath = path.join(`${APP_OUT_DIR}`, `resources/app`);
    }

    if (!fs.existsSync(resourcesPath)) {
        console.log('⚠️  Could not find app resources path, skipping optimization');
        return;
    }

    console.log('🚀 Starting app optimization...');

    // Minify JavaScript files
    await minifyJavaScript(resourcesPath);

    // Minify CSS files
    await minifyCSS(resourcesPath);

    // Remove unnecessary files
    await cleanupFiles(resourcesPath);

    console.log('✅ App optimization complete!');
}

async function minifyJavaScript(dir) {
    const files = getAllFiles(dir, '.js');
    let count = 0;
    let savedBytes = 0;

    for (const file of files) {
        // Skip already minified files and node_modules
        if (file.endsWith('.min.js') || file.includes('node_modules')) continue;

        try {
            const code = fs.readFileSync(file, 'utf8');
            const originalSize = code.length;

            const result = await minify(code, {
                compress: {
                    dead_code: true,
                    drop_console: false,
                    drop_debugger: true,
                    keep_classnames: true,
                    keep_fnames: true
                },
                mangle: false,
                format: {
                    comments: false
                }
            });

            if (result.code) {
                fs.writeFileSync(file, result.code);
                savedBytes += originalSize - result.code.length;
                count++;
            }
        } catch (err) {
            console.warn(`  ⚠️  Could not minify ${path.basename(file)}: ${err.message}`);
        }
    }

    console.log(`  ✓ Minified ${count} JavaScript files (saved ${(savedBytes / 1024 / 1024).toFixed(2)} MB)`);
}

async function minifyCSS(dir) {
    const files = getAllFiles(dir, '.css');
    const cleaner = new CleanCSS({ level: 2 });
    let count = 0;
    let savedBytes = 0;

    for (const file of files) {
        // Skip already minified files and node_modules
        if (file.endsWith('.min.css') || file.includes('node_modules')) continue;

        try {
            const css = fs.readFileSync(file, 'utf8');
            const originalSize = css.length;
            const result = cleaner.minify(css);

            if (!result.errors.length) {
                fs.writeFileSync(file, result.styles);
                savedBytes += originalSize - result.styles.length;
                count++;
            }
        } catch (err) {
            console.warn(`  ⚠️  Could not minify ${path.basename(file)}: ${err.message}`);
        }
    }

    console.log(`  ✓ Minified ${count} CSS files (saved ${(savedBytes / 1024 / 1024).toFixed(2)} MB)`);
}

async function cleanupFiles(dir) {
    let removedCount = 0;

    // Remove source maps
    const mapFiles = getAllFiles(dir, '.map');
    mapFiles.forEach(file => {
        try {
            fs.unlinkSync(file);
            removedCount++;
        } catch (err) {
            // Ignore errors
        }
    });

    // Remove .DS_Store files
    const dsStoreFiles = getAllFiles(dir, '.DS_Store');
    dsStoreFiles.forEach(file => {
        try {
            fs.unlinkSync(file);
            removedCount++;
        } catch (err) {
            // Ignore errors
        }
    });

    console.log(`  ✓ Removed ${removedCount} unnecessary files (source maps, .DS_Store)`);
}

function getAllFiles(dir, ext) {
    const files = [];

    function traverse(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);

            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    // Skip node_modules in subdirectories
                    if (item !== 'node_modules') {
                        traverse(fullPath);
                    }
                } else if (stat.isFile()) {
                    if (ext === '.DS_Store' && item === '.DS_Store') {
                        files.push(fullPath);
                    } else if (fullPath.endsWith(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        } catch (err) {
            // Ignore permission errors
        }
    }

    traverse(dir);
    return files;
}