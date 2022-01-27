 // import packages
 import fs from "fs";

 // read all files, including those in sub directories, of a directory
function dirFlat(dir) {
    const stuff = fs.readdirSync(dir).map(v => {
        const start = dir.slice(-1) === "/" ? dir : dir + "/";
        const stats = fs.statSync((dir.slice(-1) === "/" ? dir : dir + "/") + v);
        const isDir = stats.isDirectory();
        const recursion = isDir ? dirFlat((dir.slice(-1) === "/" ? dir : dir + "/") + v) : [v];
        return recursion.map(v => (!isDir ? start : "") + v);
    }).flat(Infinity);

    return stuff;
}

export default dirFlat;