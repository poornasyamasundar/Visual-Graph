//---------------------variables--------------------------
class graph
{
	constructor()
	{
		this.name = '';
		this.adjlist = [];
		this.positions = [];
	}
}
class vertex
{
	constructor()
	{
		this.neighbours = [];
	}
}
let currentGraph = '';
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
				point.style.boxShadow = '0 0 1px 2px black';
			}
			else
			{
				let k = point.innerHTML;
				point.innerHTML = "";
				point.style.zIndex = "";
				point.style.boxShadow = "none";
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
					start = -1;
					end = -1;
					point.style.backgroundColor = 'lightblue';
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
	}
}

function unhide()
{
	let points = document.querySelectorAll('.point');
	for( let i = 0 ; i < 400 ; i++ )
	{
		points[i].style.visibility = 'visible';
		points[i].style.backgroundColor = 'lightblue';
	}
}
function getgraph( object )
{
	let g = new graph();
	g.name = object.name;
	g.adjlist = object.adjlist;
	g.positions = object.adjlist;
	return g;
}
function getlist()
{
	let object = JSON.parse(localStorage.graphs);
	let g = [];
	for( let i = 0 ; i < object.length ; i++ )
	{
		g.push(getgraph(object[i]));
	}
	return g;
}

function submitGraphName()
{
	let newitem = document.createElement('li');
	newitem.innerHTML = document.querySelector('#newgraph').querySelector('#graphname').value;
	newitem.id = newitem.innerHTML;
	currentGraph = new graph();
	currentGraph.name = newitem.id;
	if( !localStorage.getItem(currentGraph.name) )
	{
		document.querySelector('#load').querySelector('ul').appendChild(newitem);
		document.querySelector('#newgraph').style.display = 'none';
		let list = getlist();
		list.push(currentGraph);
		localStorage.graphs = JSON.stringify(list);
	}
	else
	{
		alert('This Graph already exists');
		document.querySelector('#newGraph').querySelector('form').value = "";
	}
	return false;
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
			unhide();
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

function updateGraphList()
{
	let list = getlist(JSON.parse(localStorage.graphs));
	for( let i = 0 ; i < list.length ; i++ )
	{
		let newitem = document.createElement('li');
		newitem.id = list[i].name;
		newitem.innerHTML = list[i].name;
		document.querySelector('#load').querySelector('ul').appendChild(newitem);
	}

}
//--------------------------------------Events----------------------------------------
document.addEventListener('DOMContentLoaded', function() 
	{
		document.querySelector('#load').onmouseover = () => {
    			document.querySelector('#load').querySelector('ul').style.display = 'initial';
		}
		document.querySelector('#load').onmouseout = () => {
    			document.querySelector('#load').querySelector('ul').style.display = 'none';
		}
		document.querySelector('#load').querySelector('ul').querySelector('li').onclick = () =>
		{
			document.querySelector('#newgraph').style.display = 'initial';
		}
		if( !localStorage.graphs )
		{
			localStorage.graphs = JSON.stringify([]);
		}
		updateGraphList();
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
			if( currentGraph === '' )
			{
				alert('load a graph to edit');
				return;
			}
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
				unhide();
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
				hide();
			}
		}
	});

