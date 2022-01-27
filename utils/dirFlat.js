 // import packages
 import fs from "fs";

 // read all files, including those in sub directories, of a directory
function dirFlat(dir) {
    let stuff = fs.readdirSync(dir).map(v => {
        let start = dir.slice(-1) === "/" ? dir : dir + "/";
        let stats = fs.statSync((dir.slice(-1) === "/" ? dir : dir + "/") + v);
        let isDir = stats.isDirectory();
        let recursion = isDir ? dirFlat((dir.slice(-1) === "/" ? dir : dir + "/") + v) : [v];
        return recursion.map(v => (!isDir ? start : "") + v);
    }).flat(Infinity);

    return stuff;
}

export default dirFlat;