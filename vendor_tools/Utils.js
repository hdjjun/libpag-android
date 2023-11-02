const fs = require("fs");
const path = require("path");
const os = require("os");
const childProcess = require("child_process");
const crypto = require("crypto");

function createDirectory(filePath, mode) {
    if (mode === undefined) {
        mode = 511 & (~process.umask());
    }
    filePath = path.resolve(filePath);
    try {
        fs.mkdirSync(filePath, mode);
    } catch (err0) {
        switch (err0.code) {
            case 'ENOENT':
                createDirectory(path.dirname(filePath), mode);
                createDirectory(filePath, mode);
                break;
            default:
                let stat = void 0;
                try {
                    stat = fs.statSync(filePath);
                } catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) {
                    throw err0;
                }
                break;
        }
    }
}

function deletePath(path) {
    try {
        fs.rmSync(path, { recursive: true, force: true });
    } catch (e) {
    }
}

function deleteEmptyDir(path) {
    try {
        if (!fs.lstatSync(path).isDirectory()) {
            return;
        }
        let files = fs.readdirSync(path);
        if (files.length === 0) {
            fs.rmdirSync(path);
        }
    } catch (e) {
    }
}

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, "utf-8");
    } catch (e) {
        return "";
    }
}

function getModifyTime(filePath) {
    try {
        return fs.statSync(filePath).mtime.toString();
    } catch (e) {
        return "";
    }
}

function writeFile(filePath, content) {
    if (fs.existsSync(filePath)) {
        deletePath(filePath);
    }
    let folder = path.dirname(filePath);
    if (!fs.existsSync(folder)) {
        createDirectory(folder);
    }
    let fd;
    try {
        fd = fs.openSync(filePath, 'w', 438);
    } catch (e) {
        fs.chmodSync(filePath, 438);
        fd = fs.openSync(filePath, 'w', 438);
    }
    if (fd) {
        if (typeof content == "string") {
            fs.writeSync(fd, content, 0, 'utf8');
        } else {
            fs.writeSync(fd, content, 0, content.length, 0);
        }
        fs.closeSync(fd);
    }
    fs.chmodSync(filePath, 438);
    return true;
}

function copyPath(source, target) {
    if (fs.existsSync(target)) {
        deletePath(target);
    }
    if (fs.statSync(source).isDirectory()) {
        let files = fs.readdirSync(source);
        for (let fileName of files) {
            let filePath = path.join(source, fileName);
            let targetPath = path.join(target, fileName);
            copyPath(filePath, targetPath);
        }
    } else {
        let folder = path.dirname(target);
        if (!fs.existsSync(folder)) {
            createDirectory(folder);
        }
        fs.copyFileSync(source, target);
    }
}

function findFiles(filePath) {
    let list = [];
    if (fs.lstatSync(filePath).isDirectory()) {
        let files = fs.readdirSync(filePath);
        for (let file of files) {
            let curPath = path.join(filePath, file);
            list = list.concat(findFiles(curPath));
        }
    } else {
        list.push(filePath);
    }
    return list;
}

function formatString(format) {
    let objects = new Array(arguments.length);
    for (let index = 0; index < arguments.length; index++) {
        objects[index] = arguments[index];
    }
    return objects.join(' ');
}

function log(message) {
    let text = formatString.apply(this, arguments);
    if (text) {
        text += "\n";
    }
    process.stdout.write(text);
}

function error(message) {
    let text = formatString.apply(this, arguments);
    if (text) {
        text += "\n";
    }
    process.stderr.write(text);
}

function getHash(content) {
    let hash = crypto.createHash('sha1')
    hash.update(content)
    return hash.digest('hex')
}

function exec(cmd, dir, quiet) {
    let options = {
        shell: os.platform() === "win32" ? "cmd.exe" : true,
        cwd: dir,
        env: process.env
    }

    if (!quiet) {
        options.stdio = "inherit";
    }

    let result = childProcess.spawnSync(cmd, options);
    if (result.status !== 0) {
        if (quiet) {
            log(result.stdout);
            error(result.stderr);
        }
        process.exit(1);
    }
}

function escapeSpace(cmd) {
    if (!cmd || cmd.indexOf(" ") === -1 || cmd.charAt(0) === "\"" || cmd.charAt(0) === "\'") {
        return cmd;
    }
    return "\"" + cmd + "\"";
}

exports.createDirectory = createDirectory;
exports.deletePath = deletePath;
exports.deleteEmptyDir = deleteEmptyDir;
exports.getModifyTime = getModifyTime;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.copyPath = copyPath;
exports.findFiles = findFiles;
exports.getHash = getHash;
exports.exec = exec;
exports.log = log;
exports.error = error;
exports.escapeSpace = escapeSpace;
