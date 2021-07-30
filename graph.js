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
let currentGraph = new graph();
//------------------------functions-----------------------------------------
function drawLine( start, end, lineId ) 
{
	let points = document.querySelectorAll('.point');
	line = document.querySelector("#"+lineId);
	var x1 = points[start].getBoundingClientRect().left;
	var y1 = points[start].getBoundingClientRect().top;
	var x2 = points[end].getBoundingClientRect().left;
	var y2 = points[end].getBoundingClientRect().top;

	line.style.height = "0px";
	line.style.width = '0px';
	console.log( x1 + " " + y1 + " " + x2 + " " + y2 );
	line.style.left = ((x1+x2)/2)+"px";
	line.style.top = ((y1+y2)/2)+"px";
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
				currentGraph.positions.push(i);
				currentGraph.adjlist.push(new vertex());
				point.innerHTML = currentGraph.positions.length-1;
				point.style.zIndex = "1";
				point.style.boxShadow = '0 0 1px 2px black';
			}
			else
			{
				let k = parseInt(point.innerHTML);
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
				for( let j = 0 ; j < currentGraph.adjlist[k].neighbours.length ; j++ )
				{
					let m = currentGraph.adjlist[k].neighbours[j];
					let d = currentGraph.positions[m];
					let e = currentGraph.positions[k];
					let id = '';
					if( d < e )
						id = 'line'+d+''+e;
					else
						id = 'line'+e+''+d;
					document.querySelector('#'+id).remove();
				}
				currentGraph.positions.splice(k, 1);
				currentGraph.adjlist.splice(k, 1);
				console.log(currentGraph.adjlist[0].neighbours[0] + '   ' + typeof(currentGraph.adjlist[0].neighbours[0]));
				console.log(currentGraph.adjlist[1].neighbours[0] + '   ' + typeof(currentGraph.adjlist[1].neighbours[0]));
				for( let j = 0 ; j < currentGraph.adjlist.length ; j++ )
				{
					if( currentGraph.adjlist[j].neighbours.indexOf(k) != -1 )
					{
						console.log('j = ' + j + ' index = ' + currentGraph.adjlist[j].neighbours.indexOf(k));
						currentGraph.adjlist[j].neighbours.splice(currentGraph.adjlist[j].neighbours.indexOf(k), 1);
					}
					for( let a = 0 ; a < currentGraph.adjlist[j].neighbours.length ; a++ )
					{
						if( currentGraph.adjlist[j].neighbours[a] > k )
						{
							currentGraph.adjlist[j].neighbours[a]--;
						}
					}
				}
			}
			console.log(currentGraph);
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
					var line = document.createElement('div');
					document.querySelector('#lines').appendChild(line);
					if( start < end )
						line.id = "line"+start+''+end;
					else
						line.id = 'line'+end+''+start;
					line.start = currentGraph.positions.indexOf(start);
					line.end = currentGraph.positions.indexOf(end);
					drawLine( start, end, line.id );
					points[start].style.backgroundColor = 'lightblue';
					currentGraph.adjlist[points[start].innerHTML].neighbours.push(parseInt(points[end].innerHTML));
					currentGraph.adjlist[points[end].innerHTML].neighbours.push(parseInt(points[start].innerHTML));
					console.log(currentGraph);
					start = -1;
					end = -1;
				}
			}
		}
	}
	let lines = [];
	document.querySelector('#lines').onmouseover= () =>
	{
		lines = document.querySelector('#lines').querySelectorAll('div');
		console.log('end of insertline');
		for( let i = 0 ; i < lines.length ; i++ )
		{
			let line = lines[i];
			line.onclick = () =>
			{
				console.log('Helloline');
				if( document.querySelector('#insertline').checked === false )
					return;
				currentGraph.adjlist[line.start].neighbours.splice(currentGraph.adjlist[line.start].neighbours.indexOf(line.end), 1);
				currentGraph.adjlist[line.end].neighbours.splice(currentGraph.adjlist[line.end].neighbours.indexOf(line.start), 1);
				line.remove();
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
function getadjlist( object )
{
	let g = [];
	for( let i = 0 ; i < object.length ; i++ )
	{
		let v = new vertex();
		v.neighbours = object[i].neighbours;
		g.push(v);
	}
	return g;
}
function getgraph( object )
{
	let g = new graph();
	g.name = object.name;
	g.adjlist = getadjlist( object.adjlist );
	g.positions = object.positions;
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
	if( currentGraph.name === '' )
		currentGraph = new graph();
	currentGraph.name = newitem.id;
	let list = getlist();
	b = true;
	for( let i = 0 ; i < list.length ; i++ )
	{
		if( list[i].name === newitem.innerHTML )
		{
			b = false;
			break;
		}
	}
	if( b )
	{
		document.querySelector('#load').querySelector('ul').appendChild(newitem);
		document.querySelector('#newgraph').style.display = 'none';
		list.push(currentGraph);
		localStorage.graphs = JSON.stringify(list);
		loadGraph();
	}
	else
	{
		alert('This Graph already exists');
		document.querySelector('#newGraph').querySelector('form').value = "";
	}
	return false;
}

function clearCanvas()
{
	let points = document.querySelectorAll('.point');
	for( let i = 0 ; i < 400 ; i++ )
	{
		points[i].innerHTML = '';
		points[i].style.zIndex = '';
		points[i].style.boxShadow = 'none';
	}

	let lines = document.querySelector('#lines').querySelectorAll('div');
	for( let i = 0 ; i < lines.length ; i++ )
	{
		lines[i].remove();
	}
	unhide();
}

function loadGraph( name )
{
	clearCanvas();
	list = getlist();
	for( let i = 0 ; i < list.length ; i++ )
	{
		if( list[i].name === name )
		{
			currentGraph = list[i];
			break;
		}
	}
	document.querySelector('#graphName').innerHTML = 'GraphName :'+currentGraph.name;
	let points = document.querySelectorAll('.point');
	for( let i = 0 ; i < currentGraph.positions.length ; i++ )
	{
		let point = points[currentGraph.positions[i]];
		point.innerHTML = i;
		point.style.zIndex = '1';
		point.style.boxShadow = '0 0 1px 2px black';
	}
	for( let i = 0 ; i < currentGraph.adjlist.length ; i++ )
	{
		let m = i;
		for( let j = 0 ; j < currentGraph.adjlist[i].neighbours.length ; j++ )
		{
			let n = currentGraph.adjlist[i].neighbours[j];
			if( m < n )
			{
				let newitem = document.createElement('div');
				document.querySelector('#lines').appendChild(newitem)
				newitem.id = 'line'+currentGraph.positions[m]+''+currentGraph.positions[n];
				drawLine( currentGraph.positions[m], currentGraph.positions[n], newitem.id);
			}
		}
	}
	unhide();
	hide();
	blockEdit();
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

function saveGraph()
{
	console.log('Hello');
	let list = getlist();
	for( let i = 0 ; i < list.length ; i++ )
	{
		if( list[i].name === currentGraph.name )
		{
			list[i] = currentGraph;
			break;
		}
	}
	localStorage.graphs = JSON.stringify(list);
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

function blockEdit()
{
	document.querySelector('#editgraph').querySelector('input').checked = false;
	let iv = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[0];
	let il = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1];

	il.querySelector('input').disabled = true;
	il.querySelector('input').checked = false;
	il.querySelector('label').onmouseover = () =>{
		il.querySelector('label').style.cursor = 'not-allowed';
	}
	il.style.backgroundColor = 'tomato';
	iv.querySelector('input').disabled = true;
	iv.querySelector('input').checked = false;
	iv.querySelector('label').onmouseover = () =>{
		iv.querySelector('label').style.cursor = 'not-allowed';
	}
	iv.style.backgroundColor = 'tomato';
	hide();
}
//--------------------------------------Events----------------------------------------
document.addEventListener('DOMContentLoaded', function() 
	{
		let len = 0;

		document.querySelector('#load').onmouseover = () => {
    			document.querySelector('#load').querySelector('ul').style.display = 'initial';
			len = document.querySelector('#load').querySelector('ul').querySelectorAll('li').length;
			for( let i = 1 ; i < len ; i++ )
			{
				document.querySelector('#load').querySelector('ul').querySelectorAll('li')[i].onclick = () => {
					console.log('hello' + i);
					loadGraph( document.querySelector('#load').querySelector('ul').querySelectorAll('li')[i].id );
				}
			}
		}
		document.querySelector('#clear').onclick = () =>
		{
			clearCanvas();
		}
		document.querySelector('#reset').onclick = () =>
		{
			clearCanvas();
			if( currentGraph.name != '' )
				loadGraph();
		}
		document.querySelector('#load').onmouseout = () => {
    			document.querySelector('#load').querySelector('ul').style.display = 'none';
		}
		document.querySelector('#load').querySelector('ul').querySelectorAll('li')[0].onclick = () =>
		{
			document.querySelector('#newgraph').style.display = 'initial';
		}
		document.querySelector('#savegraph').onclick = ()=>
		{
			saveGraph();
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

		document.querySelector('#editgraph').querySelector('input').onclick = () => {
			if( currentGraph.name === '' )
			{
				alert("Select/Create a Graph to Edit");
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
				blockEdit();
			}
		}
	});

