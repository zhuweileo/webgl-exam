
function initGlContext(id,img) {
    var canvas = document.getElementById(id);
    var gl = canvas.getContext('webgl');
    if(!gl){
        console.log('webgl创建失败!');
        return
    }

    var positions = new Float32Array([
        0,0.5,
        0,0,
        0.5,0,
        0,0.5,
        0.5,0,
        0.5,0.5
    ])
    var texpos = new Float32Array([
        0.0,  0.0,
        0.0,  1.0,
        1.0,  1.0,
        0.0,  0.0,
        1.0,  1.0,
        1.0,  0.0,
    ])
    // 程序写入GPU
    var program = util.createProgramFromScripts(gl,['2d-vertex-shader','2d-fragment-shader'])
    gl.useProgram(program)
    //顶点坐标
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,positions,gl.STATIC_DRAW)
    //
    var posLoc = gl.getAttribLocation(program,'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,0,0)

    // 纹理坐标
    var texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,texBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,texpos,gl.STATIC_DRAW)
    //
    var texLoc = gl.getAttribLocation(program,'a_texture')
    gl.enableVertexAttribArray(texLoc)
    gl.vertexAttribPointer(texLoc,2,gl.FLOAT,false,0,0)


    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img)

    gl.clearColor(1,0,1,1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES,0 ,6)
}


function main(){
    var img = new Image()
    img.src = './1.jpg';
    img.onload = function() {
        initGlContext('paper',img)
    }
}
main();


