
function main() {
    var gl = util.initWebgl('gl');
    if(!gl) return
    var program = util.createProgramFromScripts(gl,['vertex','fragment'])
}
main();
