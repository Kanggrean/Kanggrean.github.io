"use strict";
///////////////////////////////////////////////////////////////////////////////////////////////////
//变量及常量定义///////////////////////////////////////////////////////////////////////////////////////////////////
const{vec3, vec4, mat3, mat4, quat} = glMatrix;
var canvas;
var gl;
var fileInput;
var meshdata;
var mesh;
var points = [];
var colors = [];
var acolor = [];
var lineIndex = [];
var color;
var modelViewMatrix = mat4.create();
var projectionMatrix = mat4.create();
var vBuffer = null;
var vPosition = null;
var cBuffer = null;
var vColor = null;
var iBuffer = null;
var lineCnt = 0;
var oleft = -3.0;
var oright = 3.0;
var oytop = 3.0;
var oybottom = -3.0;
var onear = -5;
var ofar = 10;
var oradius = 3.0;
var theta = 0.0;
var phi = 0.0;
var pleft = -10.0;
var pright = 10.0;
var pytop = 10.0;
var pybottom = -10.0;
var pnear = 0.01;
var pfar = 20;
var pradius = 3.0;
var fovy = 45.0 * Math.PI/180.0;
var aspect;
/* dx, dy, dz: the position of object */
var dx = 0;
var dy = 0;
var dz = 0;
var step = 0.1;

var dxt = 0;
var dyt = 0;
var dzt = 0;
var stept = 2;

var dxz = 0;
var dyz = 0;
var dzz = 0;

// scale
var sx = 1;
var sy = 1;
var sz = 1;

/* cx, cy, cz: the position of camera */
var cx = 0.0;
var cy = 1.0;
var cz = 0.0;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var eye = vec3.fromValues(cx, cy, cz);

var at = vec3.fromValues(0.0, 0.0, 0.0);
var up = vec3.fromValues(0.0, 1.0, 0.0);

var rquat = quat.create();

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var currentKey = [];

/* variables for interface control */
var projectionType = 1; // default is Orthographic(1), Perspective(2)
var drawType = 1; // default is WireFrame(1), Solid(2)
var viewType = [0]; // default is orthographic frontview(1), leftView(2), topView(3), isoview(4)
var viewcnt = 0; // view count default = 0, in orthographic or perspective mode

var changePos = 1; // default is Object(1), camera(2)

var currentColor = vec4.create();

var program = null;
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//键盘事件监听函数
function handleKeyDown(event) {
	// console.log(event.keyCode);
	var key = parseInt(event.keyCode);
	event.preventDefault();
	currentKey[key] = true;
	switch (key) {
		case 65: // left// a
			if(changePos == 1){
				dx -= step;
				document.getElementById("xpos").value = dx;
			}else if(changePos == 2){
				cx -= step;
				document.getElementById("xpos").value = cx;
			}
			break;
		case 68: // right// d
			if(changePos == 1){
				dx += step;
				document.getElementById("xpos").value = dx;
			}else if(changePos == 2){
				cx += step;
				document.getElementById("xpos").value = cx;
			}
			break;
		case 87: // up// w
			if(changePos == 1){
				dy += step;
				document.getElementById("ypos").value = dy;
			}else if(changePos == 2){
				cy += step;
				document.getElementById("ypos").value = cy;
			}
			break;
		case 83: // down// s
			if(changePos == 1){
				dy -= step;
				document.getElementById("ypos").value = dy;
			}else if(changePos == 2){
				cy -= step;
				document.getElementById("ypos").value = cy;
			}
			break;
		case 90: // away// z
			if(changePos == 1){
				dz += step;
				document.getElementById("zpos").value = dz;
			}else if(changePos == 2){
				cz += step;
				document.getElementById("zpos").value = cz;
			}
			break;
		case 88: // near// x
			if(changePos == 1){
				dz -= step;
				document.getElementById("zpos").value = dz;
			}else if(changePos == 2){
				cz -= step;
				document.getElementById("zpos").value = cz;
			}
			break;
		case 72: // ytheta-// h
			dyt -= stept;
			document.getElementById("yrot").value=dyt;
			break;
		case 75: //ytheta+// k
			dyt += stept;
			document.getElementById("yrot").value = dyt;
			break;
		case 85: //xtheta+// u
			dxt -= stept;
			document.getElementById("xrot").value = dxt;
			break;
		case 74: //xtheta-// j
			dxt += stept;
			document.getElementById("xrot").value = dxt;
			break;
		case 78: //ztheta+// n
			dzt += stept;
			document.getElementById("zrot").value = dzt;
			break;
		case 77: //ztheta-// m
			dzt -= stept;
			document.getElementById("zrot").value = dzt;
			break;
		case 39: // xzoom+// →
			dxz += step;
			document.getElementById("xzoom").value=dxz;
			console.log(document.getElementById("xzoom").value);
			break;
		case 37: // xzoom-// ←
			dxz -= step;
			document.getElementById("xzoom").value=dxz;
			console.log(document.getElementById("xzoom").value);
			break;
		case 38: // yzoom+// ↑
			dyz += step;
			document.getElementById("yzoom").value=dyz;
			break;
		case 40: // yzoom-// ↓
			dyz -= step;
			document.getElementById("yzoom").value=dyz;
			break;
		case 190: // zzoom+// ,
			dzz += step;
			document.getElementById("zzoom").value=dzz;
			break;
		case 188: // zzoom-// .
			dzz -= step;
			document.getElementById("zzoom").value=dzz;
			break;
		case 82: // r//reset
			dx = dy = dz = 0;
			cx = cy = 0; cz = 4;
			dxt = dyt = dzt = 0;
			dxz = dyz = dzz = 0;
			if(changePos == 1){
				document.getElementById("xpos").value = dx;
				document.getElementById("ypos").value = dy;
				document.getElementById("zpos").value = dz;			
			}else if(changePos == 2){
				document.getElementById("xpos").value = cx;
				document.getElementById("ypos").value = cy;
				document.getElementById("zpos").value = cz;
			}
			document.getElementById("xrot").value = dxt;
			document.getElementById("yrot").value = dyt;
			document.getElementById("zrot").value = dzt;
			document.getElementById("xzoom").value = dxz;
			document.getElementById("yzoom").value = dyz;
			document.getElementById("zzoom").value = dzz;
			break;
	}

	buildModelViewProj();
}

function handleKeyUp(event) {
	currentKey[event.keyCode] = false;
}

//鼠标事件监听
function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

function handleMouseUp(event) {
	mouseDown = false;
}
//鼠标移动位置变化关系
function handleMouseMove(event) {
	if (!mouseDown)
		return;

	var newX = event.clientX;
	var newY = event.clientY;

	var deltaX = (newX - lastMouseX);
	var d = deltaX;
	theta = theta - parseFloat(d);

	var deltaY = (newY - lastMouseY);
	d = deltaY;
	phi = phi - parseFloat(d);

	lastMouseX = newX;
	lastMouseY = newY;
	buildModelViewProj();
}

//检查被选中的选项
function checkInput(){
	var ptype = document.getElementById("ortho").checked;//正交投影
	if(ptype) {
		projectionType = 1;
	}else{
		if(document.getElementById("persp").checked)//透视投影
			projectionType = 2;
	}

	var dtype = document.getElementById("wire").checked;//线框模式
	if(dtype){
		drawType = 1;
	}else{
		if(document.getElementById("solid").checked)//实体模式
			drawType = 2;
	}

	var hexcolor = document.getElementById("objcolor").value.substring(1);//颜色选择
	var rgbHex = hexcolor.match(/.{1,2}/g);
	currentColor = vec4.fromValues( 
		parseInt(rgbHex[0], 16)/255.0,
		parseInt(rgbHex[1], 16)/255.0,
		parseInt(rgbHex[2], 16)/255.0,
		1.0
	);
}

//恢复滑块值
function restoreSliderValue(changePos){
	if (changePos == 1) {
		document.getElementById("xpos").value = dx;
		document.getElementById("ypos").value = dy;
		document.getElementById("zpos").value = dz;
	}
	if (changePos == 2) {
		document.getElementById("xpos").value = cx;
		document.getElementById("ypos").value = cy;
		document.getElementById("zpos").value = cz;
	}
	document.getElementById("xrot").value = Math.floor(dxt);
	document.getElementById("yrot").value = Math.floor(dyt);
	document.getElementById("zrot").value = Math.floor(dzt);
	document.getElementById("xzoom").value = dxz;
	document.getElementById("yzoom").value = dyz;
	document.getElementById("zzoom").value = dzz;
}

window.onload = function initWindow(){
	canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}

	gl.clearColor(0.17647, 0.17647, 0.208, 1.0);
	gl.enable(gl.DEPTH_TEST);

	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	initInterface();

	checkInput();
	
	// document.getElementById("reSet").onclick = function(){
	// 	function restoreSliderValue();
	// }
}

//初始化缓冲区
function initBuffers(){
	vBuffer = gl.createBuffer();
	cBuffer = gl.createBuffer();
}

//初始化界面
function initInterface(){
	fileInput = document.getElementById("fileInput");
	fileInput.addEventListener("change", function (event) {
		var file = fileInput.files[0];
		var reader = new FileReader();

		reader.onload = function (event) {
			meshdata = reader.result;
			initObj();
		}
		reader.readAsText(file);
	});

	var projradios = document.getElementsByName("projtype");
	for (var i = 0; i < projradios.length; i++) {
		projradios[i].addEventListener("click", function (event) {
			var value = this.value;
			if (this.checked) {
				projectionType = parseInt(value);
			}
			buildModelViewProj();
		});
	}

	var drawradios = document.getElementsByName("drawtype");
	for (var i = 0; i < drawradios.length; i++) {
		drawradios[i].onclick = function () {
			var value = this.value;
			if (this.checked) {
				drawType = parseInt(value);
			}
			updateModelData();
		}
	}

	document.getElementById("objcolor").addEventListener("input", function (event) {
		var hexcolor = this.value.substring(1);
		var rgbHex = hexcolor.match(/.{1,2}/g);
		currentColor = vec4.fromValues(
			parseInt(rgbHex[0], 16) * 1.0 / 255.0,
			parseInt(rgbHex[1], 16) * 1.0 / 255.0,
			parseInt(rgbHex[2], 16) * 1.0 / 255.0,
			1.0
		);
		updateColor();
	});

	document.getElementById("xpos").addEventListener("input", function(event){
		if(changePos===1)
			dx = this.value;
		else if(changePos===2)
			cx = this.value;
		buildModelViewProj();
	});
	document.getElementById("ypos").addEventListener("input", function(event){
		if(changePos===1)
			dy = this.value;
		else if(changePos===2)
			cy = this.value;
		buildModelViewProj();
	});
	document.getElementById("zpos").addEventListener("input", function(event){
		if(changePos===1)
			dz = this.value;
		else if(changePos===2)
			cz = this.value;
		buildModelViewProj();
	});

	document.getElementById("xrot").addEventListener("input", function(event){
		dxt = this.value;
		buildModelViewProj();
	});
	document.getElementById("yrot").addEventListener("input", function(event){
		dyt = this.value;
		buildModelViewProj();
	});
	document.getElementById("zrot").addEventListener("input",function(event){
		dzt = this.value;
		buildModelViewProj();
	});
	document.getElementById("xzoom").addEventListener("input", function(event){
		dxz = this.value;
		buildModelViewProj();
	});
	document.getElementById("yzoom").addEventListener("input", function(event){
		dyz = this.value;
		buildModelViewProj();
	});
	document.getElementById("zzoom").addEventListener("input",function(event){
		dzz = this.value;
		buildModelViewProj();
	});

	var postypeRadio = document.getElementsByName("posgrp");
	for (var i = 0; i < postypeRadio.length; i++) {
		postypeRadio[i].addEventListener("click", function (event) {
			var value = this.value;
			if (this.checked) {
				changePos = parseInt(value);
				restoreSliderValue(changePos);
			}
		});
	}

	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
}

function buildMultiViewProj(type){
	if(type[0] == 0)
		render();
	else
		rendermultiview();
}

function initObj(){
	mesh = new OBJ.Mesh(meshdata);
	// mesh.normalBuffer, mesh.textureBuffer, mesh.vertexBuffer, mesh.indexBuffer
	OBJ.initMeshBuffers(gl, mesh);

	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);

	vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var bcolor = [];
	for(var i=0; i<mesh.vertexBuffer.numItems; i++)
		bcolor.push(currentColor[0], currentColor[1], currentColor[2], currentColor[3]);

	if(cBuffer == null) 
		cBuffer = gl.createBuffer();

	// setColors
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bcolor), gl.STATIC_DRAW);

	vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vColor );

	dx = -1.0 * (parseFloat(mesh.xmax) + parseFloat(mesh.xmin))/2.0;
	dy = -1.0 * (parseFloat(mesh.ymax) + parseFloat(mesh.ymin))/2.0;
	dz = -1.0 * (parseFloat(mesh.zmax) + parseFloat(mesh.zmin))/2.0;

	var maxScale;
	var scalex = Math.abs(parseFloat(mesh.xmax)-parseFloat(mesh.xmin));
	var scaley = Math.abs(parseFloat(mesh.ymax)-parseFloat(mesh.ymin));
	var scalez = Math.abs(parseFloat(mesh.zmax)-parseFloat(mesh.zmin));

	maxScale = Math.max(scalex, scaley, scalez);

	sx = 2.0/maxScale;
	sy = 2.0/maxScale;
	sz = 2.0/maxScale;

	dx = 0;
	dy = 0;
	dz = 0;

	updateModelData();
	buildModelViewProj();
	updateColor();

	render();
}

function updateModelData(){
	if(vBuffer === null)
		vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vBuffer);
	lineIndex = [];
	for(var i = 0; i < mesh.indices.length; i+=3){
		lineIndex.push(mesh.indices[i], mesh.indices[i+1]);
		lineIndex.push(mesh.indices[i+1], mesh.indices[i + 2]);
		lineIndex.push(mesh.indices[i+2], mesh.indices[i]);
	}
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lineIndex), gl.STATIC_DRAW);
}

function updateColor(){
	var bcolor = [];
	for (var i = 0; i < mesh.vertexBuffer.numItems; i++)
		bcolor.push(currentColor[0], currentColor[1], currentColor[2], currentColor[3]);

	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bcolor), gl.STATIC_DRAW);

	vColor = gl.getAttribLocation(program, "vColor",);
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
}

function buildModelViewProj(){
	/* ModelViewMatrix & ProjectionMatrix */
	// eye = vec3.fromValues(cx, cy, cz);
	var localRadius;

	if(projectionType == 1){
		mat4.ortho( pMatrix, oleft, oright, oybottom, oytop, onear, ofar );
		localRadius = oradius;
	}else{
		aspect = 1;
		mat4.perspective(pMatrix, fovy, aspect, pnear, pfar);
		//mat4.frustum( pMatrix, pleft, pright, pybottom, pytop, pnear, pfar );
		localRadius = pradius;
	}

	var rthe = theta * Math.PI / 180.0;
	var rphi = phi * Math.PI / 180.0;
	if(changePos == 1){
		vec3.set(eye, localRadius * Math.sin(rthe) * Math.cos(rphi), localRadius * Math.sin(rthe) * Math.sin(rphi), localRadius * Math.cos(rthe)); 
		up = [0.0, 1.0, 0.0];
	}else if(changePos == 2){
		eye = [cx, cy, cz];
		vec3.set(up, localRadius * Math.sin(rthe) * Math.cos(rphi), localRadius * Math.sin(rthe) * Math.sin(rphi), localRadius * Math.cos(rthe)); 
	}

	mat4.lookAt(mvMatrix, eye, at, up);

	mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(dx, dy, dz));

	mat4.rotateZ(mvMatrix, mvMatrix, dzt * Math.PI / 180.0);
	mat4.rotateY(mvMatrix, mvMatrix, dyt * Math.PI / 180.0);
	mat4.rotateX(mvMatrix, mvMatrix, dxt * Math.PI / 180.0);

	//mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(dx, dy, dz));
	mat4.scale(mvMatrix, mvMatrix, vec3.fromValues(sx, sy, sz));

	modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
	gl.uniformMatrix4fv(modelViewMatrix, false, new Float32Array(mvMatrix));
	projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
	gl.uniformMatrix4fv(projectionMatrix, false, new Float32Array(pMatrix));
	var zoomLoc = gl.getUniformLocation(program, "zoom");
	gl.uniform3fv(zoomLoc, [dxz, dyz, dzz]);
}

var interval = setInterval(timerFunc, 30);

function timerFunc() {
	render();
}

function render(){
	gl.viewport( 0, 0, canvas.width, canvas.height );
	aspect = canvas.width / canvas.height;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	renderType(drawType);
}

function renderType(type){
	if (type == 1) {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vBuffer);
		gl.drawElements(gl.LINES, lineIndex.length, gl.UNSIGNED_SHORT, 0);
	} else {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
		gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
}
//重置操作
function reset(){
    document.getElementById("xpos").value = 0.0;
    document.getElementById("ypos").value = 0.0;
    document.getElementById("zpos").value = 0.0;

    document.getElementById("xrot").value = 0.0;
    document.getElementById("yrot").value = 0.0;
    document.getElementById("zrot").value = 0.0;

    document.getElementById("xzoom").value = 0.5;
    document.getElementById("yzoom").value = 0.5;
    document.getElementById("zzoom").value = 0.5;

    alert("已重置");
}