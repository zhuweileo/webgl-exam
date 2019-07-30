function createShader(gl,type,source) {
    var shader = gl.createShader(type)
    gl.shaderSource(shader,source)
    gl.compileShader(shader)
    var success = gl.getShaderParameter(shader,gl.COMPILE_STATUS)
    if(success) return shader
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader)
}

function createProgram(gl,vertexShader,fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program,vertexShader)
    gl.attachShader(program,fragmentShader)
    gl.linkProgram(program)
    var succes = gl.getProgramParameter(program,gl.LINK_STATUS)
    if(succes) {
        return program
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program)
}


function initGlContext(id) {
    var canvas = document.getElementById(id);
    var gl = canvas.getContext('webgl');
    if(!gl){
        console.log('webgl创建失败!');
        return
    }

    var positions = new Float32Array([
        0,0,
        0,0.5,
        0.7,0,
    ])
    // 程序写入GPU
    var vSharderSourcea = document.getElementById('2d-vertex-shader').text
    var fSharderSourcea = document.getElementById('2d-fragment-shader').text
    var vShader = createShader(gl, gl.VERTEX_SHADER,vSharderSourcea)
    var fShader = createShader(gl, gl.FRAGMENT_SHADER ,fSharderSourcea)
    var program = createProgram(gl,vShader, fShader)

    // 数据写入GPU
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,positions, gl.STATIC_DRAW)

    // 清空画布
    gl.clearColor(1,1,0.5,1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    //
    var a_position_loc = gl.getAttribLocation(program,'a_position')
    gl.useProgram(program)
    gl.enableVertexAttribArray(a_position_loc)
    // gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer)

    var size = 2;          // 每次迭代运行提取两个单位数据
    var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    var normalize = false; // 不需要归一化数据
    var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                           // 每次迭代运行运动多少内存到下一个数据开始点
    var offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(
        a_position_loc, size, type, normalize, stride, offset)

    gl.drawArrays(gl.TRIANGLES,0,3)

    // setTimeout(function() {
    //     gl.clear(gl.COLOR_BUFFER_BIT)
    // },1000)

}

initGlContext('paper');

