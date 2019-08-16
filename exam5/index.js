
function main() {
    // var gl = util.initWebgl('gl');
    // if(!gl) return

    var canvas = document.getElementById('gl');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('webgl创建失败!');
        return
    }

    var points = new Float32Array([
        // 前面
        -0.5,0.5,0.5, 0.5,-0.5,0.5,  -0.5,-0.5,0.5,
        -0.5,0.5,0.5, 0.5,0.5,0.5,   0.5,-0.5,0.5,
        // 后面
        0.5,0.5,-0.5, -0.5,-0.5,-0.5, 0.5,-0.5,-0.5,
        0.5,0.5,-0.5, -0.5,0.5,-0.5, -0.5,-0.5,-0.5,
        //上面
        0.5,0.5,0.5,  -0.5,0.5,0.5,  -0.5,0.5,-0.5,
        0.5,0.5,0.5,  -0.5,0.5,-0.5, 0.5,0.5,-0.5,
        //下面
        -0.5,-0.5,0.5,  0.5,-0.5,0.5,  -0.5,-0.5,-0.5,
        0.5,-0.5,0.5,  0.5,-0.5,-0.5, -0.5,-0.5,-0.5,
        //左面
        -0.5,0.5,0.5,  -0.5,-0.5,0.5,  -0.5,0.5,-0.5,
        -0.5,-0.5,0.5,  -0.5,-0.5,-0.5, -0.5,0.5,-0.5,
        // 右面
        0.5,0.5,0.5,  0.5,0.5,-0.5, 0.5,-0.5,0.5,
        0.5,-0.5,0.5,  0.5,0.5,-0.5,  0.5,-0.5,-0.5,
    ])
    var red = [200,0,0] ,green = [0,200,0], blue = [0,0,200]
    var colors = new Uint8Array([
        // 前面
        ...red,...red,...red,
        ...red,...red,...red,
        ...red,...red,...red,
        ...red,...red,...red,
        ...green,...green,...green,
        ...green,...green,...green,
        ...green,...green,...green,
        ...green,...green,...green,
        ...blue,...blue,...blue,
        ...blue,...blue,...blue,
        ...blue,...blue,...blue,
        ...blue,...blue,...blue,
    ])
    var program = util.createProgramFromScripts(gl,['vertex','fragment'])
    gl.useProgram(program)

    var poBuffer = gl.createBuffer()
    var colorBuffer = gl.createBuffer()

    var u_matrix_loc = gl.getUniformLocation(program, 'u_matrix')
    var mat = new Matrix4();
    var viewMat = new Matrix4();
    var projectMat = new Matrix4();

    var fovy = 30,aspect=1,near=3,far = 100;
    // projectMat.setOrtho(-1,1,-1,1,-1,4)
    projectMat.setPerspective(fovy,aspect,near,far)
    viewMat.setLookAt(5,8, 0, 0,0,0, 0,1,0);
    mat.set(projectMat).multiply(viewMat)
    gl.uniformMatrix4fv(u_matrix_loc, false, mat.elements)

    gl.bindBuffer(gl.ARRAY_BUFFER,poBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
    var a_position_loc = gl.getAttribLocation(program,'a_position')
    gl.enableVertexAttribArray(a_position_loc);
    var size = 3;          // 每次迭代运行提取两个单位数据
    var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    var normalize = false; // 不需要归一化数据
    var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    var offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(
        a_position_loc, size, type, normalize, stride, offset)

    gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
    var a_color_loc = gl.getAttribLocation(program,'a_color')
    gl.enableVertexAttribArray(a_color_loc);
    var size1 = 3;          // 每次迭代运行提取两个单位数据
    var type1 = gl.UNSIGNED_BYTE;   // 每个单位的数据类型是32位浮点型
    var normalize1 = true; // 不需要归一化数据
    var stride1 = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    var offset1 = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(
        a_color_loc, size1, type1, normalize1, stride1, offset1)

    gl.enable(gl.DEPTH_TEST)
    // gl.enable(gl.CULL_FACE)
    gl.clearColor(1, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, 36)

    var then = 0;
    var speed = 2;
    var x = 5;
    var decrease = true
    function animation(now) {
        var time = now - then;
        then = now;
        if( decrease ) {
            x -= time / 1000 * speed;
            if(x <= -5) {x= -5; decrease = false; }
        } else {
            x += time / 1000 * speed;
            if(x >= 5) { x = 5; decrease = true; }
        }
        var z = 0
        if(decrease) {
            z = Math.sqrt(25 - x*x);
        } else {
            z = -Math.sqrt(25 - x*x);
        }
        console.log(x.toFixed(2),z.toFixed(2));
        renderView(x,5,z);

        requestAnimationFrame(animation)
    }
    animation(0);

    function renderView(x,y,z) {
        var mat = new Matrix4();
        var viewMat = new Matrix4();
        var projectMat = new Matrix4();
        // projectMat.setOrtho(-1,1,-1,1,8,100)
        projectMat.setPerspective(fovy,aspect,near,far)
        viewMat.setLookAt(x,y,z, 0,0,0, 0,1,0);
        mat.set(projectMat).multiply(viewMat)
        gl.uniformMatrix4fv(u_matrix_loc, false, mat.elements)
        gl.drawArrays(gl.TRIANGLES, 0, 36)
    }

    function bind() {
        var ranges = document.querySelectorAll('.view-range')
        ranges.forEach(function(range) {
            range.addEventListener('input',function() {
                var x = ranges[0].value;
                var y = ranges[1].value;
                var z = ranges[2].value;
                console.log(x,y,z);
                renderView(x,y,z);
            })
        })
    }
    bind();
}

main();
