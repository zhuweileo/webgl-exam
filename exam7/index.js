
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
    var directions = new Float32Array([
        0,0,1,  0,0,1,  0,0,1,  0,0,1,  0,0,1,  0,0,1,
        0,0,-1,  0,0,-1,  0,0,-1,  0,0,-1,  0,0,-1,  0,0,-1,
        0,1,0,  0,1,0,  0,1,0,  0,1,0,  0,1,0,  0,1,0,
        0,-1,0,  0,-1,0,  0,-1,0,  0,-1,0,  0,-1,0,  0,-1,0,
        -1,0,0,  -1,0,0,  -1,0,0,  -1,0,0,  -1,0,0,  -1,0,0,
        1,0,0,  1,0,0,  1,0,0,  1,0,0,  1,0,0,  1,0,0,
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

    var mat = new Matrix4();
    var viewMat = new Matrix4();
    var projectMat = new Matrix4();

    // 相机
    var fovy = 30,aspect=1,near=1,far = 100;
    // projectMat.setOrtho(-1,1,-1,1,-1,4)
    projectMat.setPerspective(fovy,aspect,near,far)
    viewMat.setLookAt(3,3, 7, 0,0,0, 0,1,0);
    mat.set(projectMat).multiply(viewMat)
    var u_matrix_loc = gl.getUniformLocation(program, 'u_matrix')
    gl.uniformMatrix4fv(u_matrix_loc, false, mat.elements)

    var normalMat = new Matrix4();
    normalMat.setIdentity();
    var u_normal_mat = gl.getUniformLocation(program, 'u_normal_mat');
    gl.uniformMatrix4fv(u_normal_mat, false, normalMat.elements)

    // 光线
    var vec3 = new Vector3([5,10.0,6.0]);
    vec3.normalize();
    var u_light = gl.getUniformLocation(program, 'u_parallel_light_direction')
    gl.uniform3fv(u_light,vec3.elements)

    var u_parallel_light_color = gl.getUniformLocation(program, 'u_parallel_light_color')
    gl.uniform3fv(u_parallel_light_color,new Float32Array([1.0,1.0,1.0]))

    var u_environment_light_color = gl.getUniformLocation(program, 'u_environment_light_color')
    gl.uniform3fv(u_environment_light_color,new Float32Array([0.2,0.2,0.2]))

    bindArrayBuffer(points,program,'a_position',gl.FLOAT,false);
    bindArrayBuffer(colors,program,'a_color',gl.UNSIGNED_BYTE,true);
    bindArrayBuffer(directions,program,'a_direction',gl.FLOAT,false);

    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(1, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, 36)

    function bindArrayBuffer(data,program,attribute,type,normal) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        var a_loc = gl.getAttribLocation(program,attribute)
        gl.enableVertexAttribArray(a_loc);
        var size = 3;          // 每次迭代运行提取两个单位数据
        var dataType = type || gl.FLOAT;   // 每个单位的数据类型是32位浮点型
        var normalize = normal; // 不需要归一化数据
        var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
        var offset = 0;        // 从缓冲起始位置开始读取
        gl.vertexAttribPointer(a_loc, size, dataType, normalize, stride, offset)
    }

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
        // console.log(x.toFixed(2),z.toFixed(2));
        renderView(x,5,z);

        requestAnimationFrame(animation)
    }
    // animation(0);

    function renderView(x,y,z) {
        var mat = new Matrix4();
        var viewMat = new Matrix4();
        var projectMat = new Matrix4();
        var normal = new Matrix4();
        var model = new Matrix4();

        // model.setIdentity()
        model.setRotate(z,0,1,0)
        // projectMat.setOrtho(-1,1,-1,1,8,100)
        projectMat.setPerspective(fovy,aspect,near,far)
        viewMat.setLookAt(x,y,7, 0,0,0, 0,1,0);
        mat.set(projectMat).multiply(viewMat).multiply(model)
        gl.uniformMatrix4fv(u_matrix_loc, false, mat.elements);

        normal.setInverseOf(model);
        normal.transpose();
        gl.uniformMatrix4fv(u_normal_mat, false, normal.elements);

        gl.drawArrays(gl.TRIANGLES, 0, 36)
    }

    function bind() {
        var ranges = document.querySelectorAll('.view-range')
        ranges.forEach(function(range) {
            range.addEventListener('input',function() {
                var x = (parseFloat(ranges[0].value) + 0) * 1;
                var y = (parseFloat(ranges[1].value) + 0) * 1;
                var z = (parseFloat(ranges[2].value) + 0) * 1;
                console.log(x,y,z);
                renderView(x,y,z);
            })
        })
    }
    bind();
}

main();
