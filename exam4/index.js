

function initGlContext(id) {
    var canvas = document.getElementById(id);
    var gl = canvas.getContext('webgl');
    if(!gl){
        console.log('webgl创建失败!');
        return
    }

    var positions = new Float32Array([
        0,0,
        0,50,
        100,0,

    ])
    // 程序写入GPU
    var program = util.createProgramFromScripts(gl,['2d-vertex-shader','2d-fragment-shader'])

    // 创建buffer
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer)
    // gl.bufferData(gl.ARRAY_BUFFER,positions, gl.STATIC_DRAW)

    // 变量绑定位置buffer
    var a_position_loc = gl.getAttribLocation(program,'a_position')
    gl.useProgram(program)
    gl.enableVertexAttribArray(a_position_loc)
    // 变量绑定分辨率数据
    var u_resolution_loc = gl.getUniformLocation(program,'u_resolution')
    gl.uniform2f(u_resolution_loc,gl.canvas.width,gl.canvas.height)

    //
    var u_color = gl.getUniformLocation(program,'u_color')

    var size = 2;          // 每次迭代运行提取两个单位数据
    var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    var normalize = false; // 不需要归一化数据
    var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                           // 每次迭代运行运动多少内存到下一个数据开始点
    var offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(
        a_position_loc, size, type, normalize, stride, offset)

    // 清空画布
    gl.clearColor(1,1,0.5,1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 开画
    gl.uniform4fv(u_color,[0.1,0.2,0.3,1])
    gl.bufferData(gl.ARRAY_BUFFER,positions,gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES,0,3)



}

initGlContext('paper');

