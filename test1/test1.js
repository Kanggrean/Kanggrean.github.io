function task1(){
	var canvas = document.getElementById('tutorial1');
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(100, 0);
	ctx.lineTo(0, 200);
	ctx.lineTo(200, 200);
	ctx.fillStyle = "#FF0000";
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(300, 0);
	ctx.lineTo(200, 200);
	ctx.lineTo(400, 200);
	ctx.fillStyle = "#0000FF";
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(500, 0);
	ctx.lineTo(400, 200);
	ctx.lineTo(600, 200);
	ctx.fillStyle = "#00FF00";
	ctx.fill();
}


function task2(){
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	ctx.fillStyle="#00FF00";
	ctx.fillRect(0,0,200,100);
}

function task3(){
	var c=document.getElementById("tongshi");
	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(150, 0);
	ctx.lineTo(0, 100);
	ctx.lineTo(300, 100);
	ctx.fillStyle = "#00FFFF";
	ctx.fill();
	ctx.fillStyle="#00FFFF";
	ctx.fillRect(0,100,300,200);
}

function task4(){
	var c=document.getElementById("tongshi_bu");
	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(150, 0);
	ctx.lineTo(0, 100);
	ctx.lineTo(300, 100);
	ctx.fillStyle = "#FFFF00";
	ctx.fill();
	ctx.fillStyle="#FF00FF";
	ctx.fillRect(0,100,300,200);
}

function task5(){
	var bg = document.getElementById('bg');
	var ctx = bg.getContext('2d');
	setTrianglePath(ctx,200);
	ctx.fillStyle=fillColor(0,0,200,0,"#FF0000","rgba(0,0,0,0)",ctx);
	ctx.fill(); 
	var garyctx = bg.getContext('2d');
	setTrianglePath(garyctx,200);
	garyctx.fillStyle=fillColor(200,0,0,0,"#00ff00","rgba(0,0,0,0)",garyctx); 
	garyctx.fill();
	setTrianglePath(garyctx,200);
	garyctx.fillStyle=fillColor(0,0,0,200,"#0000ff","rgba(0,0,0,0)",garyctx); 
	garyctx.fill();
	// 画等边三角形
	function setTrianglePath(ctx,side){
	  var hight = side*Math.sin(Math.PI/3);
	  ctx.beginPath();
	  ctx.moveTo(side/2,0); 
	  ctx.lineTo(0,hight);
	  ctx.lineTo(side,hight); 
	}
	// 填充颜色
	function fillColor(x1,y1,x2,y2,color0,color1,ctx){
	  var gradient = ctx.createLinearGradient(x1,y1,x2,y2);
	  gradient.addColorStop(0,color0); //起始颜色
	  gradient.addColorStop(1,color1); //终点颜色
	  return gradient;
	}
}