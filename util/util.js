var util = {
    initWebgl: function(id){
        var canvas = document.getElementById(id);
        var gl = canvas.getContext('webgl');
        if (!gl) {
            console.log('webgl创建失败!');
            return null
        } else {
            return gl
        }

    },
    createProgramFromScripts: function(gl, shaderIds) {
        var vSharderSourcea = document.getElementById(shaderIds[0]).text
        var fSharderSourcea = document.getElementById(shaderIds[1]).text
        var vShader = this._createShader(gl, gl.VERTEX_SHADER, vSharderSourcea)
        var fShader = this._createShader(gl, gl.FRAGMENT_SHADER, fSharderSourcea)

        return this._createProgram(gl, vShader, fShader)
    },
    _createShader: function(gl, type, source) {
        var shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (success) return shader
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader)
    },
    _createProgram: function(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        var succes = gl.getProgramParameter(program, gl.LINK_STATUS)
        if (succes) {
            return program
        }
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program)
    },
}
