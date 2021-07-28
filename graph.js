//---------------------variables--------------------------

let NoOfVertices = 0;
let NoOfEdges = 0;
//------------------------functions-----------------------------------------
function drawLine( x1, y1, x2, y2, lineId ) 
{
	line = document.querySelector("#"+lineId);
	x1 = x1;
	x2 = x2;
	line.style.height = "0px";
	line.style.width = '0px';
	console.log( x1 + " " + y1 + " " + x2 + " " + y2 );
	line.style.left = ((x1+x2)/2)+"px";
	line.style.top = ((y1+y2)/2)+"px";
	line.style.backgroundColor = "black";
	distance = Math.sqrt( ((x1-x2)*(x1-x2)) + ((y1-y2)*(y1-y2)) ) - 30;
	sr = Math.atan2(y1-y2, x1-x2);
	slope = (sr * 180 ) / Math.PI;
	line.style.left = ((x1+x2)/2) - distance/2 + 11 + "px";
	line.style.top = ((y1+y2)/2) + 9 + "px";
	line.style.height = "1px";
	line.style.transform = "rotate(" + slope + "deg)";
	line.style.width = distance + "px";
	line.style.borderStyle = "solid";
	line.style.borderWidth = "2px";
	line.style.borderColor = "black";
	line.style.backgroundColor = "black";
	console.log(line);
}

function insertPoints()
{
	let points = document.querySelectorAll('.point');
	for( let i = 0 ; i < 400 ; i++ )
	{
		let point = points[i];
		point.onclick = () => 
		{
			if( document.querySelector('#insertvertex').checked === false )
				return;
			if( point.innerHTML == "" )
			{
				NoOfVertices++;
				point.innerHTML = NoOfVertices;
				point.style.zIndex = "1";
			}
			else
			{
				let k = point.innerHTML;
				point.innerHTML = "";
				point.style.zIndex = "";
				for( let j = 0 ; j < 400 ; j++ )
				{
					if( points[j].innerHTML != "" && points[j].innerHTML > k )
					{
						points[j].innerHTML = points[j].innerHTML - 1;
					}
				}
				NoOfVertices--;
			}
		}		
	}
}

function insertLine()
{
	let points = document.querySelectorAll('.point');
	let start = -1;
	let end = -1;
	for( let i = 0 ; i < 400 ; i++ )
	{
		let point = points[i];
		point.onclick = () =>
		{
			if( document.querySelector('#insertline').checked === false )
				return;
			if( point.innerHTML != "" )
			{
				if( start === -1 )
				{
					start = i;
					point.style.backgroundColor = 'lightgreen';
				}
				else if( i === start )
				{
				}
				else
				{
					end = i;
					var x1 = points[start].getBoundingClientRect().left;
					var y1 = points[start].getBoundingClientRect().top;
					var x2 = points[end].getBoundingClientRect().left;
					var y2 = points[end].getBoundingClientRect().top;
					var line = document.createElement('div');
					document.querySelector('#lines').appendChild(line);
					NoOfEdges++;
					line.id = "line"+NoOfEdges;
					drawLine( x1, y1, x2, y2, line.id );
					points[start].style.backgroundColor = 'lightblue';
					start = -1;
					end = -1;
				}
			}
		}
	}
}

function hide()
{
	let points = document.querySelectorAll('.point');
	for( let i = 0 ; i < 400 ; i++ )
	{
		if( points[i].innerHTML == "" )
		{
			points[i].style.visibility = "hidden";
		}
		else
		{
			points[i].style.borderWidth = '4px';
		}
	}
	document.querySelector('#container').backgroundColor = 'pink';
}

function editGraph()
{
	let iv = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[0];
	let il = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1];

	iv.onclick = () =>{
		if( iv.querySelector('input').checked == true )
		{
			il.querySelector('input').checked = false;
			iv.style.backgroundColor = 'red';
			il.style.backgroundColor = 'tomato';
			insertPoints();
		}
		else
		{
			il.querySelector('input').checked = false;
			iv.style.backgroundColor = 'tomato';
			il.style.backgroundColor = 'tomato';
		}
	}
	il.onclick = () =>{
		if( il.querySelector('input').checked === true )
		{
			iv.querySelector('input').checked = false;
			il.style.backgroundColor = 'red';
			iv.style.backgroundColor = 'tomato';
			hide();
			insertLine();
		}
		else
		{
			iv.querySelector('input').checked = false;
			iv.style.backgroundColor = 'tomato';
			il.style.backgroundColor = 'tomato';
		}
	}
}
//--------------------------------------Events----------------------------------------
document.addEventListener('DOMContentLoaded', function() 
	{
		let iv = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[0];
		let il = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1];

		il.querySelector('input').disabled = true;
		il.querySelector('label').onmouseover = () =>{
			il.querySelector('label').style.cursor = 'not-allowed';
		}
		iv.querySelector('input').disabled = true;
		iv.querySelector('label').onmouseover = () =>{
			iv.querySelector('label').style.cursor = 'not-allowed';
		}

		document.querySelector('#editgraph').querySelector('label').onclick = () => {
			if( document.querySelector('#editgraph').querySelector('input').checked === true )
			{
				il.querySelector('input').disabled = false;
				il.querySelector('label').onmouseover = () =>{
					il.querySelector('label').style.cursor = 'pointer';
				}
				iv.querySelector('input').disabled = false;
				iv.querySelector('label').onmouseover = () =>{
					iv.querySelector('label').style.cursor = 'pointer';
				}
				editGraph();
			}
			else
			{
				il.querySelector('input').disabled = true;
				il.querySelector('input').checked = false;
				il.querySelector('label').onmouseover = () =>{
					il.querySelector('label').style.cursor = 'not-allowed';
				}
				iv.querySelector('input').disabled = true;
				iv.querySelector('input').checked = false;
				iv.querySelector('label').onmouseover = () =>{
					iv.querySelector('label').style.cursor = 'not-allowed';
				}
			}
		}
	});

