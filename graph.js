//---------------------variables--------------------------
class graph
{
	constructor()
	{
		this.name = '';
		this.adjlist = [];
		this.positions = [];
		this.noOfEdges = 0;
		this.weighted = false;
		this.directed = false;
	}
}
class vertex
{
	constructor()
	{
		this.neighbours = [];
		this.weights = [];
	}
}
let currentGraph = new graph();
let sourcevertex = -1;
//------------------------functions-----------------------------------------
function drawLine( start, end, lineId ) 
{
	let points = document.querySelectorAll('.point');
	line = document.querySelector("#"+lineId);
	var x1 = points[start].offsetLeft;
	var y1 = points[start].offsetTop;
	var x2 = points[end].offsetLeft;
	var y2 = points[end].offsetTop;

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
	var p = document.createElement('p');
	if( currentGraph.directed === false )
		p.innerHTML = '';
	else
	{
		p.innerHTML = '&#9664';
	}
	p.style.position = 'absolute';
	p.style.padding = '0';
	p.style.marginTop = '-14px';
	p.style.fontSize = '25px';
	line.appendChild(p);
	line.querySelector('p').style.marginLeft = distance/2-12+'px';
	line.style.borderStyle = "solid";
	line.style.borderWidth = "2px";
	if( currentGraph.weighted )
	{
		var w = document.createElement('p');
		w.innerHTML = currentGraph.adjlist[line.start].weights[currentGraph.adjlist[line.start].neighbours.indexOf(line.end)];
		w.style.left = ((x1+x2)/2)+ "px";
		w.style.top = ((y1+y2)/2) + 20 + "px";
		w.style.margin = '0';
		w.id = 'weight'+lineId;
		w.style.display = 'none';
		w.style.zIndex = '4';
		document.querySelector('#lines').appendChild(w);
		line.onmouseover = () =>
		{
			document.querySelector('#weight'+lineId).style.display = 'initial';
		}
		line.onmouseout = () =>
		{
			document.querySelector('#weight'+lineId).style.display = 'none';
		}

	}
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
			if( document.querySelector('#options').querySelector('ul').querySelector('li').style.backgroundColor === 'tomato' )
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
					if( currentGraph.directed === false )
					{
						if( d < e )
							id = 'line'+d+''+e;
						else
							id = 'line'+e+''+d;
					}
					else
					{
						id = 'line'+e+''+d;
					}
					document.querySelector('#'+id).remove();
					currentGraph.noOfEdges--;
				}
				let pos = currentGraph.positions[k];
				currentGraph.positions.splice(k, 1);
				currentGraph.adjlist.splice(k, 1);
				for( let j = 0 ; j < currentGraph.adjlist.length ; j++ )
				{
					if( currentGraph.adjlist[j].neighbours.indexOf(k) != -1 )
					{
						console.log('j = ' + j + ' index = ' + currentGraph.adjlist[j].neighbours.indexOf(k));
						if( currentGraph.directed === false )
						{
							currentGraph.adjlist[j].neighbours.splice(currentGraph.adjlist[j].neighbours.indexOf(k), 1);
						}
						else
						{
							document.querySelector('#line'+currentGraph.positions[j]+pos).remove();
							currentGraph.adjlist[j].neighbours.splice(currentGraph.adjlist[j].neighbours.indexOf(k), 1);
							currentGraph.adjlist[j].weights.splice(currentGraph.adjlist[j].neighbours.indexOf(k), 1);
							currentGraph.noOfEdges--;
						}

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
			if( document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1].style.backgroundColor === 'tomato' )
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
					if( currentGraph.directed === false )
					{
						if( start < end )
							line.id = "line"+start+''+end;
						else
							line.id = 'line'+end+''+start;
					}
					else
					{
						line.id = 'line'+start+end;
					}
					if( document.querySelector('#'+line.id) )
					{
						console.log('returned');
						points[start].style.backgroundColor = 'lightblue';
						start = -1;
						end = -1;
						return;
					}
					document.querySelector('#lines').appendChild(line);
					line.start = currentGraph.positions.indexOf(start);
					line.end = currentGraph.positions.indexOf(end);
					points[start].style.backgroundColor = 'lightblue';
					if( currentGraph.directed === false )
					{
						currentGraph.adjlist[points[start].innerHTML].neighbours.push(parseInt(points[end].innerHTML));
						currentGraph.adjlist[points[end].innerHTML].neighbours.push(parseInt(points[start].innerHTML));
					}
					else
					{
						currentGraph.adjlist[points[start].innerHTML].neighbours.push(parseInt(points[end].innerHTML));
					}
					if( currentGraph.directed )
						currentGraph.adjlist[line.start].weights.push(0);
					else
					{
						currentGraph.adjlist[line.start].weights.push(0);
						currentGraph.adjlist[line.end].weights.push(0);
					}
					currentGraph.noOfEdges++;
					drawLine( start, end, line.id );
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
		if( document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1].style.backgroundColor === 'tomato' )
			return;
		console.log('end of insertline');
		for( let i = 0 ; i < lines.length ; i++ )
		{
			let line = lines[i];
			line.onclick = () =>
			{
				if( currentGraph.directed === false )
				{
					currentGraph.adjlist[line.start].neighbours.splice(currentGraph.adjlist[line.start].neighbours.indexOf(line.end), 1);
					currentGraph.adjlist[line.end].neighbours.splice(currentGraph.adjlist[line.end].neighbours.indexOf(line.start), 1);
				}
				else
				{
					currentGraph.adjlist[line.start].neighbours.splice(currentGraph.adjlist[line.start].neighbours.indexOf(line.end), 1);
				}
				currentGraph.noOfEdges--;
				line.remove();
				if( currentGraph.weighted )
					document.querySelector('#weight'+line.id).remove();
			}
		}
	}
}

function changeWeight()
{
	console.log('changeweight');
	let lines = document.querySelector('#lines').querySelectorAll('div');
	for( let i = 0 ; i < lines.length ; i++ )
	{
		console.log(i);
		lines[i].onclick = () =>
		{
			if( !document.querySelector('#options').querySelector('ul').querySelectorAll('li')[7] )
			{
				console.log('clicked');
				let form = document.createElement('form');
				let input = document.createElement('input');
				input.style.width = '50px';
				form.onsubmit = ()=>
				{
					document.querySelector('#weight'+lines[i].id).innerHTML = input.value;
					console.log(lines[i]);
					console.log(lines[i].start+'  '+lines[i].end);
					if( currentGraph.directed )
						currentGraph.adjlist[lines[i].start].weights[currentGraph.adjlist[lines[i].start].neighbours.indexOf(lines[i].end)] = Number(input.value);
					else
					{
						currentGraph.adjlist[lines[i].start].weights[currentGraph.adjlist[lines[i].start].neighbours.indexOf(lines[i].end)] = Number(input.value);
						currentGraph.adjlist[lines[i].end].weights[currentGraph.adjlist[lines[i].end].neighbours.indexOf(lines[i].start)] = Number(input.value);
					}
					input.remove();
					form.remove();
					li.remove();
					return false;
				}
				let li = document.createElement('li');
				li.innerHTML = "Enter the weight: ";
				li.appendChild(form);
				form.appendChild(input);
				document.querySelector('#options').querySelector('ul').appendChild(li);
				li.style.display = 'flex';
				input.focus();
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
		v.weights = object[i].weights;
		g.push(v);
	}
	return g;
}
function getgraph( object )
{
	let g = new graph();
	g.name = object.name;
	g.noOfEdges = object.noOfEdges;
	g.adjlist = getadjlist( object.adjlist );
	g.positions = object.positions;
	g.weighted = object.weighted;
	g.directed = object.directed;
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
	document.querySelector('#newgraph').querySelector('#graphname').value = '';
	let buttons = document.querySelector('#newgraph').querySelectorAll('button');
	let ud  = true;
	let uw = true;
	buttons[0].onclick = () =>
	{
		buttons[1].style.color = 'black';
		buttons[1].style.backgroundColor = 'lightblue';
		buttons[0].style.color = 'white';
		buttons[0].style.backgroundColor = 'blue';
		ud = false;
	}
	buttons[1].onclick = () =>
	{
		buttons[0].style.color = 'black';
		buttons[0].style.backgroundColor = 'lightblue';
		buttons[1].style.color = 'white';
		buttons[1].style.backgroundColor = 'blue';
		ud = true;
	}
	buttons[2].onclick = () =>
	{
		buttons[3].style.color = 'black';
		buttons[3].style.backgroundColor = 'lightblue';
		buttons[2].style.color = 'white';
		buttons[2].style.backgroundColor = 'blue';
		uw = false;
	}
	buttons[3].onclick = () =>
	{
		buttons[2].style.color = 'black';
		buttons[2].style.backgroundColor = 'lightblue';
		buttons[3].style.color = 'white';
		buttons[3].style.backgroundColor = 'blue';
		uw = true;
	}
	buttons[4].onclick = () =>
	{
		let newitem = document.createElement('li');
		newitem.innerHTML = document.querySelector('#newgraph').querySelector('#graphname').value;
		newitem.id = newitem.innerHTML;
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
		if( newitem.innerHTML === '' )
		{
			alert('Enter valid name');
			document.querySelector('#newGraph').querySelector('input').value = "";
		}
		else if( newitem.innerHTML.length > 10 )
		{
			alert('Maximum length of the name must be 10');
		}
		else if( b )
		{
			document.querySelector('#load').querySelector('ul').appendChild(newitem);
			document.querySelector('#newgraph').style.display = 'none';
			g = new graph();
			g.name = newitem.innerHTML;
			g.weighted = !uw;
			g.directed = !ud;
			list.push(g);
			localStorage.graphs = JSON.stringify(list);
			currentGraph = g;
			loadGraph();
			document.querySelector('#newgraph').style.display = 'none';
		}
		else
		{
			alert('This Graph already exists');
			document.querySelector('#newGraph').querySelector('form').value = "";
		}
	}
	buttons[5].onclick = () =>
	{
		document.querySelector('#newgraph').style.display = 'none';
	}
}

function clearCanvas()
{
	let points = document.querySelectorAll('.point');
	for( let i = 0 ; i < 400 ; i++ )
	{
		points[i].innerHTML = '';
		points[i].style.zIndex = '';
		points[i].style.boxShadow = 'none';
		points[i].style.color = 'black';
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
	document.querySelector('#graphName').innerHTML = 'GraphName :'+currentGraph.name + '<div></div>';
	let uw = 'Unweighted';
	if( currentGraph.weighted )
		uw = 'Weighted';
	let ud = 'UnDirected';
	if( currentGraph.directed )
		ud = 'Directed';
	document.querySelector('#graphName').querySelector('div').innerHTML = 'No of Vertices = '+currentGraph.positions.length+'<br>No of Edges = '+currentGraph.noOfEdges+'<br>'+uw+'<br>'+ud;
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
		let d = currentGraph.positions[m];
		for( let j = 0 ; j < currentGraph.adjlist[i].neighbours.length ; j++ )
		{
			let n = currentGraph.adjlist[i].neighbours[j];
			let e = currentGraph.positions[n];
			if( currentGraph.directed === false )
			{
				if( d < e )
				{
					let newitem = document.createElement('div');
					newitem.start = i;
					newitem.end = n;
					document.querySelector('#lines').appendChild(newitem);
					newitem.id = 'line'+d+''+e;
					drawLine( currentGraph.positions[m], currentGraph.positions[n], newitem.id);
				}
			}
			else
			{
				let newitem = document.createElement('div');
				newitem.start = i;
				newitem.end = n;
				document.querySelector('#lines').appendChild(newitem);
				newitem.id = 'line'+d+''+e;
				drawLine( currentGraph.positions[m], currentGraph.positions[n], newitem.id);
			}
		}
	}
	unhide();
	hide();
	blockEdit();
	console.log(currentGraph);
}

function editGraph()
{
	document.querySelector('#editgraph').style.backgroundColor = 'darkviolet';
	let iv = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[0];
	let il = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1];
	let cw = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[2];
	let save = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[3];
	let del = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[4];

	iv.style.display = 'flex';
	il.style.display = 'flex';
	if( currentGraph.weighted )
		cw.style.display = 'flex';
	save.style.display = 'flex';
	del.style.display = 'flex';

	iv.onclick = () =>
	{
		iv.style.backgroundColor = 'red';
		il.style.backgroundColor = 'tomato';
		cw.style.backgroundColor = 'tomato';
		unhide();
		insertPoints();
	}
	il.onclick = () =>
	{
		iv.style.backgroundColor = 'tomato';
		il.style.backgroundColor = 'red';
		cw.style.backgroundColor = 'tomato';
		hide();
		insertLine();
	}
	save.onclick = () =>
	{
		iv.style.backgroundColor = 'tomato';
		il.style.backgroundColor = 'tomato';
		cw.style.backgroundColor = 'tomato';
		alert('Graph successfully saved');
		saveGraph();
	}
	del.onclick = () =>
	{
		il.style.backgroundColor = 'tomato';
		iv.style.backgroundColor = 'tomato';
		cw.style.backgroundColor = 'tomato';
		let list = getlist();
		for( let i = 0 ; i < list.length ; i++ )
		{
			if( list[i].name === currentGraph.name )
			{
				document.querySelector('#load').querySelector('ul').querySelectorAll('li')[i+1].remove();
				currentGraph = new graph();
				document.querySelector('#graphName').innerHTML = 'GraphName :'+currentGraph.name + '<div></div>';
				document.querySelector('#graphName').querySelector('div').innerHTML = '';
				list.splice(i, 1);
				localStorage.graphs = JSON.stringify(list);
				blockEdit();
				clearCanvas();
				return;
			}
		}
	}
	cw.onclick = () =>
	{
		iv.style.backgroundColor = 'tomato';
		il.style.backgroundColor = 'tomato';
		cw.style.backgroundColor = 'red';
		changeWeight();
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
	let uw = 'Unweighted';
	if( currentGraph.weighted )
		uw = 'Weighted';
	let ud = 'UnDirected';
	if( currentGraph.directed )
		ud = 'Directed';
	document.querySelector('#graphName').querySelector('div').innerHTML = 'No of Vertices = '+currentGraph.positions.length+'<br>No of Edges = '+currentGraph.noOfEdges+'<br>'+uw+'<br>'+ud;
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

function selectSourceVertex()
{
	let points = document.querySelectorAll('.point');
	for( let i = 0 ; i < 400 ; i++ )
	{
		points[i].onclick = () =>
		{
			if( document.querySelector('#selectsourcevertex').style.backgroundColor === 'lightgreen' )
				return;
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].innerHTML = 'SourceVertex: ' + currentGraph.positions.indexOf(i);
			document.querySelector('#selectsourcevertex').style.backgroundColor = 'lightgreen';
			document.querySelector('#selectsourcevertex').style.display = 'none';
			sourcevertex = i;
			points[i].style.backgroundColor = 'green';
			return;
		}
	}
}

function blockEdit()
{
	document.querySelector('#editgraph').style.backgroundColor = 'violet';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[0].style.display = 'none';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1].style.display = 'none';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[2].style.display = 'none';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[3].style.display = 'none';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[4].style.display = 'none';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[0].style.backgroundColor = 'tomato';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1].style.backgroundColor = 'tomato';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[2].style.backgroundColor = 'tomato';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[3].style.backgroundColor = 'tomato';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[4].style.backgroundColor = 'tomato';
	if( document.querySelector('#options').querySelector('ul').querySelectorAll('li')[7] )
	{
		document.querySelector('#options').querySelector('ul').querySelectorAll('li')[7].remove();
	}
}

function resetAlgo( algo )
{
	if( algo === 'bfs' )
	{
		let steps = document.querySelector('#bfscode').querySelectorAll('li');
		for( let i = 0 ; i < steps.length ; i++ )
		{
			steps[i].style.backgroundColor = 'orange';
		}
	}
	else if( algo === 'dfs' )
	{
		let steps = document.querySelector('#dfscode').querySelectorAll('li');
		steps[0].style.backgroundColor = 'red';
		for( let i = 1 ; i < steps.length ; i++ )
		{
			steps[i].style.backgroundColor = 'orange';
		}
	}
	else if( algo === 'mst' )
	{
		let steps = document.querySelector('#mstcode').querySelectorAll('li');
		for( let i = 0 ; i < steps.length ; i++ )
		{
			steps[i].style.backgroundColor = 'orange';
		}
	}
	else if( algo === 'dij' )
	{
		let steps = document.querySelector('#dijcode').querySelectorAll('li');
		for(let i = 0 ; i < steps.length ; i++ )
		{
			steps[i].style.backgroundColor = 'orange';
		}
	}
	else if( algo === 'gc' )
	{
		let steps = document.querySelector('#gccode').querySelectorAll('li');
		for(let i = 0 ; i < steps.length ; i++ )
		{
			steps[i].style.backgroundColor = 'orange';
		}
	}
}


function showTree( tree )
{
	console.log( 'in show tree');
	let lines = document.querySelector('#lines').querySelectorAll('div');
	for( let i = 0 ; i < lines.length ; i++ )
	{
		lines[i].style.visibility = 'hidden';
	}
	for( let i = 0 ; i < tree.positions.length ; i++ )
	{
		for( let j = 0 ; j < tree.adjlist[i].neighbours.length ; j++ )
		{
			let m = tree.positions[i];
			let n = tree.positions[tree.adjlist[i].neighbours[j]];
			if( currentGraph.directed === false )
			{
				if( m < n )
				{
					id = 'line'+m+n;
					document.querySelector('#lines').querySelector('#'+id).querySelector('p').innerHTML = '&#9664;';
					document.querySelector('#lines').querySelector('#'+id).style.visibility = 'visible';
					document.querySelector('#lines').querySelector('#'+id).style.backgroundColor = 'Darkviolet';
					document.querySelector('#lines').querySelector('#'+id).style.borderColor = 'Darkviolet';
					document.querySelector('#lines').querySelector('#'+id).style.color = 'Darkviolet';
				}
				else
				{
					id = 'line'+n+m;
					document.querySelector('#lines').querySelector('#'+id).querySelector('p').innerHTML = '&#9654;';
					document.querySelector('#lines').querySelector('#'+id).style.visibility = 'visible';
					document.querySelector('#lines').querySelector('#'+id).style.backgroundColor = 'Darkviolet';
					document.querySelector('#lines').querySelector('#'+id).style.borderColor = 'Darkviolet';
					document.querySelector('#lines').querySelector('#'+id).style.color = 'Darkviolet';
				}
			}
			else
			{
				id = '#line'+m+n;
				document.querySelector('#lines').querySelector(id).style.visibility = 'visible';
				document.querySelector('#lines').querySelector(id).style.backgroundColor = 'Darkviolet';
				document.querySelector('#lines').querySelector(id).style.borderColor = 'Darkviolet';
				document.querySelector('#lines').querySelector(id).style.color = 'Darkviolet';
			}
		}
	}
}

function hideTree( tree )
{
	let lines = document.querySelector('#lines').querySelectorAll('div');
	for( let i = 0 ; i < lines.length ; i++ )
	{
		lines[i].style.visibility = 'visible';
	}
	for( let i = 0 ; i < tree.positions.length ; i++ )
	{
		for( let j = 0 ; j < tree.adjlist[i].neighbours.length ; j++ )
		{
			let m = tree.positions[i];
			let n = tree.positions[tree.adjlist[i].neighbours[j]];
			if( currentGraph.directed === false )
			{
				if( m < n )
				{
					id = 'line'+m+n;
					document.querySelector('#lines').querySelector('#'+id).querySelector('p').innerHTML = '';
					document.querySelector('#lines').querySelector('#'+id).style.backgroundColor = 'black';
					document.querySelector('#lines').querySelector('#'+id).style.borderColor = 'black';
					document.querySelector('#lines').querySelector('#'+id).style.color = 'black';
				}
				else
				{
					id = 'line'+n+m;
					document.querySelector('#lines').querySelector('#'+id).querySelector('p').innerHTML = '';
					document.querySelector('#lines').querySelector('#'+id).style.backgroundColor = 'black';
					document.querySelector('#lines').querySelector('#'+id).style.borderColor = 'black';
					document.querySelector('#lines').querySelector('#'+id).style.color = 'black';
				}
			}
			else
			{
				id = '#line'+m+n;
				document.querySelector('#lines').querySelector(id).style.backgroundColor = 'black';
				document.querySelector('#lines').querySelector(id).style.borderColor = 'black';
				document.querySelector('#lines').querySelector(id).style.color = 'black';
			}
		}
	}

}

function createToolTips( algo )
{
	let points = document.querySelectorAll('.point');
	if( algo === 'bfs' )
	{
		for( let i = 0 ; i < currentGraph.positions.length ; i++ )
		{
			let tooltip = document.createElement('div');
			tooltip.innerHTML = 'd: <i>-1</i><br>p: <i>nil</i>';
			points[currentGraph.positions[i]].appendChild(tooltip);
		}
	}
	else if( algo === 'dfs' )
	{
		for( let i = 0 ; i < currentGraph.positions.length ; i++ )
		{
			let tooltip = document.createElement('div');
			tooltip.innerHTML = 'd: <i>-1</i><br>f: <i>-1</i><br>p: <i>nil</i>';
			points[currentGraph.positions[i]].appendChild(tooltip);
		}
	}
	else if( algo === 'dij' )
	{
		for( let i = 0 ; i < currentGraph.positions.length ; i++ )
		{
			let point = points[currentGraph.positions[i]];
			let tooltip = document.createElement('div');
			tooltip.innerHTML = 'd: '+ point.d + '<br>p: '+point.p;
			point.appendChild(tooltip);
		}
	}
}

function RunAlgorithm( algo )
{
	unhide();
	hide();
	blockEdit();
	if( currentGraph.name == '' )
	{
		alert('Select a graph to run the Algorithm');
		return;
	}
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[5].style.display = 'flex';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[6].style.display = 'flex';
	document.querySelector('#algorithm').style.display = 'initial';
	document.querySelector('#headings').querySelector('#reset').style.display = 'none';
	document.querySelector('#headings').querySelector('#clear').style.display = 'none';
	document.querySelector('#headings').querySelector('#load').style.display = 'none';
	document.querySelector('#headings').querySelector('#editgraph').style.display = 'none';
	document.querySelector('#headings').querySelector('#run').style.display = 'none';
	document.querySelector('#headings').querySelector('#algoname').style.display = 'flex';
	document.querySelector('#headings').querySelector('#algoname').innerHTML = 'Algorithm: '+algo;
	if( algo === 'Breadth First Search' )
		document.querySelector('#BFS').style.display = 'initial';
	else if( algo === 'Depth First Search' )
		document.querySelector('#DFS').style.display = 'initial';
	else if( algo === "Minimum Spanning Tree (Prim's)" )
		document.querySelector('#MST').style.display = 'initial';
	else if( algo === "Shortest Path (Dijkstra's)" )
		document.querySelector('#DIJ').style.display = 'initial';
	else if( algo === "Graph Coloring (Welsh-Powell)" )
		document.querySelector('#GC').style.display = 'initial';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[5].onclick = () =>
	{
		document.querySelector('#content').style.display = 'initial';
		clearCanvas();
		if( currentGraph.name != '' )
			loadGraph( currentGraph.name );
		blockEdit();
		resetAlgo();
		sourcevertex = -1;
		if( algo == 'Breadth First Search' )
		{
			runBFS();
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].innerHTML = 'SourceVertex:';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].innerHTML = 'CurrentVertex:';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].innerHTML = 'Adj[<p>CurrentVertex</p>]:<ul></ul>';
			document.querySelector('#queue').querySelector('ul').innerHTML = '';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[0].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].style.display = 'block';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[4].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[5].style.display = 'flex';
			document.querySelector('#selectsourcevertex').onclick = () =>
			{
				document.querySelector('#selectsourcevertex').style.backgroundColor = 'green';
				selectSourceVertex();
			}
		}
		else if( algo === 'Depth First Search' )
		{
			runDFS();
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].innerHTML = 'SourceVertex:';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].innerHTML = 'CurrentVertex:';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].innerHTML = 'Adj[<p>CurrentVertex</p>]:<ul></ul>';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[0].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].style.display = 'block';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[4].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[5].style.display = 'flex';
			document.querySelector('#selectsourcevertex').onclick = () =>
			{
				document.querySelector('#selectsourcevertex').style.backgroundColor = 'green';
				selectSourceVertex();
			}
		}
		else if( algo === "Minimum Spanning Tree (Prim's)" )
		{
			resetAlgo( 'mst' );
			document.querySelector('#edges').querySelector('ul').innerHTML = '';
			document.querySelector('#sets').querySelector('ul').innerHTML = '';
			runMST();
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[4].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[5].style.display = 'flex';
		}
		else if( algo === "Shortest Path (Dijkstra's)" )
		{
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].innerHTML = 'SourceVertex:';	
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].innerHTML = 'CurrentVertex:';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].innerHTML = 'Adj[<p>CurrentVertex</p>]:<ul></ul>';
			document.querySelector('#queue').querySelector('ul').innerHTML = '';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[0].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].style.display = 'block';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[4].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[5].style.display = 'flex';
			document.querySelector('#selectsourcevertex').onclick = () =>
			{
				document.querySelector('#selectsourcevertex').style.backgroundColor = 'green';
				selectSourceVertex();
			}
			runDIJ();
		}
		else if( algo == 'Graph Coloring (Welsh-Powell)' )
		{
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].innerHTML = 'u:';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].innerHTML = 'v: ';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].innerHTML = '<p>v</p>.neighbours:<ul></ul>';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[4].innerHTML = 'Colorable: ';
			document.querySelector('#vertices').querySelector('ul').innerHTML = '';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].style.display = 'block';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[4].style.display = 'flex';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[5].style.display = 'flex';
			runGC();
		}
	}
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[6].onclick = () =>
	{
		document.querySelector('#content').style.display = 'none';
		document.querySelector('#options').querySelector('ul').querySelectorAll('li')[5].style.display = 'none';
		document.querySelector('#options').querySelector('ul').querySelectorAll('li')[6].style.display = 'none';
		document.querySelector('#algorithm').style.display = 'none';
		document.querySelector('#BFS').style.display = 'none';
		document.querySelector('#DFS').style.display = 'none';
		document.querySelector('#MST').style.display = 'none';
		document.querySelector('#DIJ').style.display = 'none';
		document.querySelector('#GC').style.display = 'none';
		document.querySelector('#headings').querySelector('#reset').style.display = 'flex';
		document.querySelector('#headings').querySelector('#clear').style.display = 'flex';
		document.querySelector('#headings').querySelector('#load').style.display = 'inline-block';
		document.querySelector('#headings').querySelector('#editgraph').style.display = 'flex';
		document.querySelector('#headings').querySelector('#run').style.display = 'inline-block';
		document.querySelector('#headings').querySelector('#algoname').style.display = 'none';
		clearCanvas();
		if( currentGraph.name != '' )
			loadGraph( currentGraph.name );
		blockEdit();
		resetAlgo();
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].innerHTML = 'SourceVertex:';
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].innerHTML = 'CurrentVertex:';
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].innerHTML = 'Adj[<p>CurrentVertex</p>]:<ul></ul>';
			document.querySelector('#content').querySelector('ul').querySelectorAll('li')[4].innerHTML = 'Show Tree';
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[0].style.display = 'none';
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].style.display = 'none';
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].style.display = 'none';
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].style.display = 'none';
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[4].style.display = 'none';
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[5].style.display = 'none';
		sourcevertex = -1;
	}
}

function runBFS()
{
	for( let i = 0 ; i < currentGraph.adjlist.length ; i++ )
	{
		currentGraph.adjlist[i].neighbours.sort();
	}
	let tree = new graph();
	for( let i = 0 ; i < currentGraph.positions.length ; i++ )
	{
		tree.positions.push(currentGraph.positions[i]);
		tree.adjlist.push(new vertex());
	}
	let index = -1;
	let steps = document.querySelector('#bfscode').querySelectorAll('li');
	let points = document.querySelectorAll('.point');
	let currentvertex = document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2];
	let vadjvertex = document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3];
	let queue = document.querySelector('#BFS').querySelector('#queue').querySelector('ul');
	let cvertex = -1;
	let vvertex = -1;
	createToolTips('bfs');
	console.log(currentGraph);
	console.log(sourcevertex);
	let showtree = document.querySelector('#content').querySelector('ul').querySelector('#showtree');
	showtree.onclick = () =>
	{
		if( showtree.innerHTML === 'Show Tree' )
		{
			showTree( tree );
			showtree.innerHTML = 'Hide Tree';
		}
		else if( showtree.innerHTML === 'Hide Tree')
		{
			hideTree( tree );
			showtree.innerHTML = 'Show Tree';
		}
	}
	document.querySelector('#content').querySelector('ul').querySelector('#nextstep').onclick = () =>
	{
		if( sourcevertex === -1 )
		{
			alert('Select a source vertex');
			return;
		}
		console.log('index = ' + index );
		console.log('tree');
		console.log(tree);
		if( index === 13 )
			return;
		resetAlgo( 'bfs' );
		if( index == -1 )
		{
			steps[0].style.backgroundColor = 'yellow';
			for( let i = 0 ; i < currentGraph.positions.length ; i++ )
			{
				points[currentGraph.positions[i]].style.backgroundColor = 'white';
				points[currentGraph.positions[i]].d = -1;
			}
			index++;
		}
		else if( index == 0 )
		{
			steps[1].style.backgroundColor = 'yellow';
			points[sourcevertex].style.backgroundColor = 'grey';
			points[sourcevertex].d = 0;
			points[sourcevertex].querySelector('div').innerHTML = 'd: 0</br>p: <i>nil</i>';
			index++;
		}
		else if( index == 1 )
		{
			steps[2].style.backgroundColor = 'yellow';
			let element = document.createElement('li');
			element.innerHTML = ''+currentGraph.positions.indexOf(sourcevertex);
			queue.appendChild(element);
			index++;
		}
		else if( index == 2 )
		{
			steps[3].style.backgroundColor = 'yellow';
			if( queue.querySelectorAll('li').length === 0 )
			{
				index = 8;
			}
			else
			{
				index++;
			}
		}
		else if( index == 3 )
		{
			steps[4].style.backgroundColor = 'yellow';
			cvertex = Number(queue.querySelector('li').innerHTML);
			currentvertex.innerHTML = 'CurrentVertex: '+cvertex;
			queue.querySelector('li').style.animation = 'remove 2s linear';
			queue.querySelector('li').onanimationend = () =>
			{
				queue.querySelector('li').remove();
			}
			vadjvertex.querySelector('p').innerHTML = cvertex;
			for( let i = 0 ; i < currentGraph.adjlist[cvertex].neighbours.length ; i++ )
			{
				let element = document.createElement('li');
				element.innerHTML = currentGraph.adjlist[cvertex].neighbours[i];
				vadjvertex.querySelector('ul').appendChild(element);
			}
			index++;
		}
		else if( index === 4 )
		{
			steps[5].style.backgroundColor = 'yellow';
			if( vvertex === -1 )
			{
				if( currentGraph.adjlist[cvertex].neighbours.length != 0 )
				{
					vvertex = 0;
					index++;
					vadjvertex.querySelector('ul').querySelectorAll('li')[vvertex].style.backgroundColor = 'lightblue';
				}
				else
				{
					vvertex = -1;
					index = 7;
				}
			}
			else if( currentGraph.adjlist[cvertex].neighbours.length-1 > vvertex )
			{
				vvertex++;
				index++;
				vadjvertex.querySelector('ul').querySelectorAll('li')[vvertex-1].style.backgroundColor = 'pink';
				vadjvertex.querySelector('ul').querySelectorAll('li')[vvertex].style.backgroundColor = 'lightblue';
			}
			else
			{
				vvertex = -1;
				index = 7;
			}
		}
		else if( index === 5 )
		{
			steps[6].style.backgroundColor = 'yellow';
			if( points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].style.backgroundColor === 'white' )
			{
				index++;
			}
			else
			{
				if( currentGraph.adjlist[cvertex].neighbours.length-1 === vvertex )
					index = 7;
				else
					index = 4;
			}
		}
		else if( index == 6 )
		{
			steps[7].style.backgroundColor = 'yellow';
			points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].style.backgroundColor = 'grey';
			points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].d = points[currentGraph.positions[cvertex]].d+1; 
			points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].querySelector('div').innerHTML = 'd: '+(points[currentGraph.positions[cvertex]].d+1)+'<br>p: '+cvertex; 
			tree.adjlist[cvertex].neighbours.push(currentGraph.adjlist[cvertex].neighbours[vvertex]);
			let element = document.createElement('li');
			element.innerHTML = ''+currentGraph.adjlist[cvertex].neighbours[vvertex];
			queue.appendChild(element);
			if( currentGraph.adjlist[cvertex].neighbours.length-1 === vvertex )
				index = 7;
			else
				index = 4;
		}
		else if( index == 7 )
		{
			steps[8].style.backgroundColor = 'yellow';
			points[currentGraph.positions[cvertex]].style.backgroundColor = 'black';
			points[currentGraph.positions[cvertex]].color = 'black';
			points[currentGraph.positions[cvertex]].style.color = 'white';
			for( let i = 0 ; i < currentGraph.adjlist[cvertex].neighbours.length ; i++ )
			{
				vadjvertex.querySelector('ul').querySelector('li').remove();
			}
			vvertex = -1;
			index = 2;
		}
		else if( index == 8 )
		{
			steps[9].style.backgroundColor = 'yellow';
			showTree(tree);
		}
	}
}

function runDFS()
{
	for( let i = 0 ; i < currentGraph.adjlist.length ; i++ )
	{
		currentGraph.adjlist[i].neighbours.sort();
	}
	let tree = new graph();
	for( let i = 0 ; i < currentGraph.positions.length ; i++ )
	{
		tree.positions.push(currentGraph.positions[i]);
		tree.adjlist.push(new vertex());
	}
	let index = -1;
	let steps = document.querySelector('#dfscode').querySelectorAll('li');
	let points = document.querySelectorAll('.point');
	let currentvertex = document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2];
	let vadjvertex = document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3];
	let cvertex = -1;
	let vvertex = -1;
	let time = 0;
	createToolTips('dfs');
	console.log(currentGraph);
	console.log(sourcevertex);
	let showtree = document.querySelector('#content').querySelector('ul').querySelector('#showtree');
	showtree.onclick = () =>
	{
		if( showtree.innerHTML === 'Show Tree' )
		{
			showTree( tree );
			showtree.innerHTML = 'Hide Tree';
		}
		else if( showtree.innerHTML === 'Hide Tree' )
		{
			hideTree( tree );
			showtree.innerHTML = 'Show Tree';
		}
	}
	stack = [];
	document.querySelector('#content').querySelector('ul').querySelector('#nextstep').onclick = () =>
	{
		if( sourcevertex === -1 )
		{
			alert('Select a source vertex');
			return;
		}
		console.log('index = ' + index );
		console.log('tree');
		console.log(tree);
		console.log(currentGraph);
		if( index === 14 )
			return;
		resetAlgo('dfs');
		if( index === -1 )
		{
			steps[1].style.backgroundColor = 'yellow';
			for( let i = 0 ; i < currentGraph.positions.length ; i++ )
			{
				points[currentGraph.positions[i]].style.backgroundColor = 'white';
				points[currentGraph.positions[i]].d = -1;
				points[currentGraph.positions[i]].f = -1;
				points[currentGraph.positions[i]].p = -1;
			}
			index++;
		}
		else if( index === 0 )
		{
			steps[2].style.backgroundColor = 'yellow';
			steps[0].innerHTML = 'Time = 0';
			index++;
		}
		else if( index === 1 )
		{
			steps[3].style.backgroundColor = 'yellow';
			cvertex = Number(currentGraph.positions.indexOf(sourcevertex));
			index++;
		}
		else if( index === 2 )
		{
			steps[6].style.backgroundColor = 'yellow';
			currentvertex.innerHTML = 'CurrentVertex: '+cvertex;
			let len = vadjvertex.querySelector('ul').querySelectorAll('li').length;
			for( let i = 0 ; i < len ; i++ )
			{
				vadjvertex.querySelector('ul').querySelector('li').remove();
			}
			for( let i = 0 ; i < currentGraph.adjlist[cvertex].neighbours.length ; i++ )
			{
				let element = document.createElement('li');
				element.innerHTML = currentGraph.adjlist[cvertex].neighbours[i];
				vadjvertex.querySelector('ul').appendChild(element);
			}
			index++;
		}
		else if( index === 3 )
		{
			steps[7].style.backgroundColor = 'yellow';
			time++;
			steps[0].innerHTML = 'Time = '+time;
			index++;
		}
		else if( index === 4 )
		{
			steps[8].style.backgroundColor = 'yellow';
			points[currentGraph.positions[cvertex]].d = time; 
			points[currentGraph.positions[cvertex]].querySelector('div').innerHTML = 'd: '+points[currentGraph.positions[cvertex]].d+'<br>f: '+points[currentGraph.positions[cvertex]].f+'<br>p: '+points[currentGraph.positions[cvertex]].p;
			index++;
		}
		else if( index === 5 )
		{
			steps[9].style.backgroundColor = 'yellow';
			points[currentGraph.positions[cvertex]].style.backgroundColor = 'grey';
			index++;
		}
		else if( index === 6 )
		{
			steps[10].style.backgroundColor = 'yellow';
			console.log(vvertex);
			currentvertex.innerHTML = 'CurrentVertex: '+cvertex;
			let len = vadjvertex.querySelector('ul').querySelectorAll('li').length;
			for( let i = 0 ; i < len ; i++ )
			{
				vadjvertex.querySelector('ul').querySelector('li').remove();
			}
			for( let i = 0 ; i < currentGraph.adjlist[cvertex].neighbours.length ; i++ )
			{
				let element = document.createElement('li');
				element.innerHTML = currentGraph.adjlist[cvertex].neighbours[i];
				vadjvertex.querySelector('ul').appendChild(element);
			}
			if( vvertex === -1 )
			{
				if( currentGraph.adjlist[cvertex].neighbours.length != 0 )
				{
					vvertex = 0;
					index++;
					vadjvertex.querySelector('ul').querySelectorAll('li')[vvertex].style.backgroundColor = 'lightblue';
				}
				else
				{
					vvertex = -1;
					index = 10;
				}
			}
			else if( currentGraph.adjlist[cvertex].neighbours.length-1 > vvertex )
			{
				vvertex++;
				index++;
				vadjvertex.querySelector('ul').querySelectorAll('li')[vvertex-1].style.backgroundColor = 'pink';
				vadjvertex.querySelector('ul').querySelectorAll('li')[vvertex].style.backgroundColor = 'lightblue';
			}
			else
			{
				vvertex = -1;
				index = 10;
			}
		}
		else if( index === 7 )
		{
			steps[11].style.backgroundColor = 'yellow';
			if( points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].style.backgroundColor === 'white' )
			{
				index++;
			}
			else
			{
				index = 6;
			}
		}
		else if( index === 8 )
		{
			steps[12].style.backgroundColor = 'yellow';
			points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].querySelector('div').innerHTML = 'd: '+points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].d + '<br>f: '+points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].f+'<br>p: '+ cvertex;
			points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].p = cvertex;
			tree.adjlist[cvertex].neighbours.push(currentGraph.adjlist[cvertex].neighbours[vvertex]);
			index++;
		}
		else if( index === 9 )
		{
			steps[13].style.backgroundColor = 'yellow';
			points[currentGraph.positions[cvertex]].vv = vvertex;
			cvertex = currentGraph.adjlist[cvertex].neighbours[vvertex];
			vvertex = -1;
			index = 2;
		}
		else if( index === 10 )
		{
			steps[14].style.backgroundColor = 'yellow';
			points[currentGraph.positions[cvertex]].style.backgroundColor = 'black';
			points[currentGraph.positions[cvertex]].style.color = 'white';
			index++;
		}
		else if( index === 11 )
		{
			steps[15].style.backgroundColor = 'yellow';
			time++;
			steps[0].innerHTML = 'Time = '+time;
			index++;
		}
		else if( index === 12 )
		{
			steps[16].style.backgroundColor = 'yellow';
			points[currentGraph.positions[cvertex]].f = time;
			points[currentGraph.positions[cvertex]].querySelector('div').innerHTML = 'd: '+points[currentGraph.positions[cvertex]].d+'<br>f: '+points[currentGraph.positions[cvertex]].f+'<br>p: '+ points[currentGraph.positions[cvertex]].p;

			cvertex = points[currentGraph.positions[cvertex]].p;
			if( cvertex === -1 )
			{
				index = 13;
				console.log(cvertex);
			}
			else
			{
				vvertex = points[currentGraph.positions[cvertex]].vv;
				index = 6;
			}
		}
		else if( index === 13 )
		{
			steps[4].style.backgroundColor = 'yellow';
			showTree( tree, sourcevertex );
			return;
		}
	}
}

function pushEdges()
{
	list = [];
	console.log('pushedges()');
	if( currentGraph.directed )
	{
		for( let i = 0 ; i < currentGraph.positions.length ; i++ )
		{
			for( let j = 0 ; j < currentGraph.adjlist[i].neighbours.length ; j++ )
			{
				let li = document.createElement('li');
				document.querySelector('#MST').querySelector('#edges').querySelector('ul').appendChild(li);
				li.innerHTML = '('+i+','+currentGraph.adjlist[i].neighbours[j]+')';
				if( currentGraph.weighted )
				{
					list.push({start:i, end:currentGraph.adjlist[i].neighbours[j], weight: currentGraph.adjlist[i].weights[j]});
				}
				else
				{
					list.push({start:i, end:currentGraph.adjlist[i].neighbours[j], weight: '0'});
				}
			}
		}
	}
	else
	{
		for( let i = 0 ; i < currentGraph.positions.length ; i++ )
		{
			for( let j = 0 ; j < currentGraph.adjlist[i].neighbours.length ; j++ )
			{
				if( i < currentGraph.adjlist[i].neighbours[j] )
				{
					let li = document.createElement('li');
					document.querySelector('#MST').querySelector('#edges').querySelector('ul').appendChild(li);
					li.innerHTML = '('+i+','+currentGraph.adjlist[i].neighbours[j]+')';
					if( currentGraph.weighted )
					{
						list.push({start:i, end:currentGraph.adjlist[i].neighbours[j], weight: currentGraph.adjlist[i].weights[j]});
					}
					else
					{
						list.push({start:i, end:currentGraph.adjlist[i].neighbours[j], weight: '0'});
					}
				}
			}
		}
	}
	return list;
}

function sortWeight( a, b )
{
	if( a.weight < b.weight )
		return -1;
	else
		return 1;
	return 0;
}

function runMST()
{
	let tree = new graph();
	for( let i = 0 ; i < currentGraph.positions.length ; i++ )
	{
		tree.positions.push(currentGraph.positions[i]);
		tree.adjlist.push(new vertex());
	}
	let index = -1;
	let steps = document.querySelector('#mstcode').querySelectorAll('li');
	let edges = document.querySelector('#MST').querySelector('#edges').querySelector('ul');
	let sets = document.querySelector('#MST').querySelector('#sets').querySelector('ul');
	console.log(currentGraph);
	let showtree = document.querySelector('#content').querySelector('ul').querySelector('#showtree');
	showtree.onclick = () =>
	{
		if( showtree.innerHTML === 'Show Tree' )
		{
			showTree( tree, sourcevertex );
			showtree.innerHTML = 'Hide Tree';
		}
		else if( showtree.innerHTML === 'Hide Tree')
		{
			hideTree( tree, sourcevertex );
			showtree.innerHTML = 'Show Tree';
		}
	}
	let s = [];
	for( let i = 0 ; i < currentGraph.positions.length ; i++ )
	{
		s.push(i);
	}
	listOfEdges = pushEdges();
	console.log(listOfEdges);
	b = false;
	currentEdge = 0;
	document.querySelector('#content').querySelector('ul').querySelector('#nextstep').onclick = () =>
	{
		resetAlgo('mst');
		console.log('index = ' + index );
		if( index === -1 )
		{
			steps[0].style.backgroundColor = 'yellow';
			showTree( tree );
			index++;
		}
		else if( index === 0 )
		{
			steps[1].style.backgroundColor = 'yellow';
			for( let i = 0 ; i < s.length ; i++ )
			{
				let li = document.createElement('li');
				li.innerHTML = s[i];
				sets.appendChild(li);
			}
			index++;
			hideTree( tree );
		}
		else if( index === 1 )
		{
			steps[2].style.backgroundColor = 'yellow';
			if( currentGraph.weighted )
			{
				listOfEdges.sort( sortWeight );
				for( let i = 0 ; i < listOfEdges.length ; i++ )
				{
					edges.querySelectorAll('li')[i].innerHTML = '('+listOfEdges[i].start+','+listOfEdges[i].end+')';
				}
			}
			index++;
		}
		else if( index === 2 )
		{
			hideTree( tree );
			steps[3].style.backgroundColor = 'yellow';
			if( b )
			{
				edges.querySelector('li').remove();
				listOfEdges.splice(0, 1);
			}
			b = true;
			if( edges.querySelectorAll('li').length === 0 )
			{
				index = 6;
			}
			else
			{
				edges.querySelector('li').style.backgroundColor = 'lightblue';
				index++;
			}
		}
		else if( index === 3 )
		{
			steps[4].style.backgroundColor = 'yellow';
			if( s[listOfEdges[0].start] != s[listOfEdges[0].end] )
				index++;
			else
				index = 2;
		}
		else if( index === 4 )
		{
			steps[5].style.backgroundColor = 'yellow';
			sets.querySelectorAll('li')[s[listOfEdges[0].end]].style.display = 'none';
			sets.querySelectorAll('li')[s[listOfEdges[0].start]].innerHTML = sets.querySelectorAll('li')[s[listOfEdges[0].start]].innerHTML + ',' + sets.querySelectorAll('li')[s[listOfEdges[0].end]].innerHTML;
			let k = s[listOfEdges[0].end];
			for( let i = 0 ; i < s.length ; i++ )
			{
				if( s[i] == k )
				{
					s[i] = s[listOfEdges[0].start];
				}
			}
			index++;
		}
		else if( index === 5 )
		{
			steps[6].style.backgroundColor = 'yellow';
			tree.adjlist[listOfEdges[0].start].neighbours.push(listOfEdges[0].end);
			showTree( tree );	
			index = 2;
		}
		else if( index === 6 )
		{
			steps[7].style.backgroundColor = 'yellow';
			showTree( tree );
			return;
		}
	}

}

function runDIJ()
{
	let tree = new graph();
	for( let i = 0 ; i < currentGraph.positions.length ; i++ )
	{
		tree.positions.push(currentGraph.positions[i]);
		tree.adjlist.push( new vertex() );
	}
	let index = -1;
	let steps = document.querySelector('#dijcode').querySelectorAll('li');
	let points = document.querySelectorAll('.point');
	let currentvertex = document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2];
	let vadjvertex = document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3];
	let queue = document.querySelector('#DIJ').querySelector('#queue').querySelector('ul');
	let cvertex = -1;
	let vvertex = -1;
	console.log(currentGraph);
	console.log(sourcevertex);
	let showtree = document.querySelector('#content').querySelector('ul').querySelector('#showtree');
	showtree.onclick = () =>
	{
		if( showtree.innerHTML === 'Show Tree' )
		{
			showTree( tree );
			showtree.innerHTML = 'Hide Tree';
		}
		else if( showtree.innerHTML === 'Hide Tree')
		{
			hideTree( tree );
			showtree.innerHTML = 'Show Tree';
		}
	}
	document.querySelector('#content').querySelector('ul').querySelector('#nextstep').onclick = () =>
	{
		if( sourcevertex === -1 )
		{
			alert('Select a source vertex');
			return;
		}
		console.log('index = ' + index );
		console.log('tree');
		console.log(tree);
		resetAlgo( 'dij' );
		if( index === -1 )
		{
			steps[0].style.backgroundColor = 'yellow';
			for( let i = 0 ; i < currentGraph.positions.length ; i++ )
			{
				points[currentGraph.positions[i]].style.backgroundColor = 'white';
				points[currentGraph.positions[i]].d = 1.7976931348623157E+10308;
				points[currentGraph.positions[i]].p = -1;
			}
			createToolTips('dij');
			index++;
		}
		else if( index === 0 )
		{
			steps[1].style.backgroundColor = 'yellow';
			points[sourcevertex].d = 0;
			points[sourcevertex].querySelector('div').innerHTML = 'd: '+points[sourcevertex].d +  '<br>p: '+points[sourcevertex].p;
			index++;
		}
		else if( index === 1 )
		{
			steps[2].style.backgroundColor = 'yellow';
			for( let i = 0 ; i < currentGraph.positions.length ; i++ )
			{
				let element = document.createElement('li');
				element.innerHTML = i+'<br>'+points[currentGraph.positions[i]].d;
				queue.appendChild(element);
			}
			index++;
		}
		else if( index === 2 )
		{
			steps[3].style.backgroundColor = 'yellow';
			b = false;
			for( let i = 0 ; i < queue.querySelectorAll('li').length ; i++ )
			{
				if( queue.querySelectorAll('li')[i].style.display != 'none' )
				{
					b = true;
					break;
				}
			}
			if( !b )
			{
				index = 9;
				return;
			}
			index++;
		}
		else if( index === 3 )
		{
			steps[4].style.backgroundColor = 'yellow';

			let minindex = 0;
			let min = 1.7976931348623157E+10308;
			for( let i = 0 ; i < currentGraph.positions.length ; i++ )
			{
				if( points[currentGraph.positions[i]].style.backgroundColor === 'white' )
				{
					if( points[currentGraph.positions[i]].d <= min )
					{
						min = points[currentGraph.positions[i]].d;
						minindex = i;
					}
				}
			}
			cvertex = minindex;
			currentvertex.innerHTML = 'CurrentVertex: '+cvertex;
			queue.querySelectorAll('li')[minindex].style.animation = 'remove 1s linear';
			queue.querySelectorAll('li')[minindex].onanimationend = () =>
			{
				queue.querySelectorAll('li')[minindex].style.display = 'none';
			}

			vadjvertex.querySelector('p').innerHTML = cvertex;
			vadjvertex.querySelector('ul').innerHTML = '';
			for( let i = 0 ; i < currentGraph.adjlist[cvertex].neighbours.length ; i++ )
			{
				let element = document.createElement('li');
				element.innerHTML = currentGraph.adjlist[cvertex].neighbours[i];
				vadjvertex.querySelector('ul').appendChild(element);
			}
			index++;
		}
		else if( index === 4 )
		{
			steps[5].style.backgroundColor = 'yellow';
			points[currentGraph.positions[cvertex]].style.backgroundColor = 'black';
			points[currentGraph.positions[cvertex]].style.color = 'white';
			index++;
		}
		else if( index === 5 )
		{
			steps[6].style.backgroundColor = 'yellow';
			if( vvertex === -1 )
			{
				if( currentGraph.adjlist[cvertex].neighbours.length != 0 )
				{
					vvertex = 0;
					index++;
					vadjvertex.querySelector('ul').querySelectorAll('li')[vvertex].style.backgroundColor = 'lightblue';
				}
				else
				{
					vvertex = -1;
					index = 2;
				}
			}
			else if( currentGraph.adjlist[cvertex].neighbours.length-1 > vvertex )
			{
				vvertex++;
				index++;
				vadjvertex.querySelector('ul').querySelectorAll('li')[vvertex-1].style.backgroundColor = 'pink';
				vadjvertex.querySelector('ul').querySelectorAll('li')[vvertex].style.backgroundColor = 'lightblue';
			}
			else
			{
				vvertex = -1;
				index = 2;
			}
		}
		else if( index === 6 )
		{
			steps[7].style.backgroundColor = 'yellow';
			if( currentGraph.weighted )
			{
				if( points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].d > (points[currentGraph.positions[cvertex]].d + currentGraph.adjlist[cvertex].weights[vvertex] ) )
					index++;
				else
					index = 5;
			}
			else
			{
				if( points[currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]]].d > (points[currentGraph.positions[cvertex]].d + 1 ) )
					index++;
				else
					index = 5;
			}
		}
		else if( index === 7 )
		{
			steps[8].style.backgroundColor = 'yellow';
			let y = currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]];
			if( currentGraph.weighted )
				points[y].d = (points[currentGraph.positions[cvertex]].d + currentGraph.adjlist[cvertex].weights[vvertex] );
			else
				points[y].d = (points[currentGraph.positions[cvertex]].d + 1 );
			points[y].querySelector('div').innerHTML = 'd: '+points[y].d + '<br>p: '+ points[y].p;

			queue.querySelectorAll('li')[currentGraph.adjlist[cvertex].neighbours[vvertex]].innerHTML = currentGraph.adjlist[cvertex].neighbours[vvertex] + '<br>' + points[y].d;
			index++;
		}
		else if( index === 8 )
		{
			steps[9].style.backgroundColor = 'yellow';
			let y = currentGraph.positions[currentGraph.adjlist[cvertex].neighbours[vvertex]];
			points[y].p = cvertex;
			points[y].querySelector('div').innerHTML = 'd: ' + points[y].d + '<br>p: ' + points[y].p;
			index = 5;
			tree.adjlist[cvertex].neighbours.push(currentGraph.adjlist[cvertex].neighbours[vvertex] );
		}
		else if( index === 9 )
		{
			steps[10].style.backgroundColor = 'yellow';
			showTree(tree);
		}
	}
}

function getNeighbours()
{
	let list = [];
	if( currentGraph.directed )
	{

		for( let i = 0 ; i < currentGraph.positions.length ; i++ )
		{
			let l = {index: i, n:[]};
			for( let j = 0 ; j < currentGraph.adjlist[i].neighbours.length ; j++ )
			{
				l.n.push(currentGraph.adjlist[i].neighbours[j]);
			}
			for( let j = 0 ; j < currentGraph.positions.length ; j++ )
			{
				for( let k = 0 ; k < currentGraph.adjlist[j].neighbours.length ; k++ )
				{
					if( i === currentGraph.adjlist[j].neighbours[k] )
					{
						l.n.push(j);
					}
				}
			}
			list.push(l);
		}
	}
	else
	{
		for( let i = 0 ; i < currentGraph.positions.length ; i++ )
		{
			let l = {index: i, n:[]};
			for( let j = 0 ; j < currentGraph.adjlist[i].neighbours.length ; j++ )
			{
				l.n.push(currentGraph.adjlist[i].neighbours[j]);
			}
			list.push(l);
		}
	}
	return list;
}

function sortDegree( a, b )
{
	if( a.n.length < b.n.length )
		return 1;
	else 
		return -1;
	return 0;
}

function runGC()
{
	let index = -1;
	let steps = document.querySelector('#gccode').querySelectorAll('li');
	let points = document.querySelectorAll('.point');
	let u = document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1];
	let v = document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2];
	let vneighbours = document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3];
	let vertices = document.querySelector('#GC').querySelector('#vertices').querySelector('ul');
	let uv = -1;
	let vv = -1;
	let counter1 = -1;
	let counter2 = -1;
	let colors = ['Aqua', 'blue', 'brown', 'chartreuse', 'chocolate', 'DarkMagenta', 'Fuchsia', 'Indigo'];
	neighbours = getNeighbours();
	console.log(neighbours);
	console.log(currentGraph);
	for( let i = 0 ; i < currentGraph.positions.length ; i++ )
	{
		points[currentGraph.positions[i]].style.backgroundColor = 'white';
	}
	document.querySelector('#content').querySelector('ul').querySelector('#nextstep').onclick = () =>
	{
		console.log('index = ' + index );
		resetAlgo('gc');
		if( index === -1 )
		{
			steps[0].style.backgroundColor = 'yellow';
			for( let i = 0 ; i < currentGraph.positions.length ; i++ )
			{
				let element = document.createElement('li');
				element.innerHTML = neighbours[i].index + '<br>deg: '+neighbours[i].n.length;
				vertices.appendChild(element);
			}
			index++;
		}
		else if( index === 0 )
		{
			steps[1].style.backgroundColor = 'yellow';
			neighbours.sort( sortDegree );
			for( let i = 0 ; i < currentGraph.positions.length ; i++ )
			{
				vertices.querySelectorAll('li')[i].innerHTML = neighbours[i].index + '<br>deg: '+neighbours[i].n.length;
			}
			index++;
		}
		else if( index === 1 )
		{
			steps[2].style.backgroundColor = 'yellow';
			if( vertices.querySelectorAll('li').length === 0 )
			{
				index = 13;
				return;
			}
			else
			{
				index++;
			}
		}
		else if( index === 2 )
		{
			steps[3].style.backgroundColor = 'yellow';
			uv = neighbours.splice(0,1)[0].index;
			console.log(uv);
			u.innerHTML = 'u: '+uv;
			vertices.querySelector('li').remove();
			index++;
		}
		else if( index === 3 )
		{
			steps[4].style.backgroundColor = 'yellow';
			points[currentGraph.positions[uv]].style.backgroundColor = colors[0];
			colors.splice(0, 1);
			index++;
		}
		else if( index === 4 )
		{
			steps[5].style.backgroundColor = 'yellow';
			if( counter1 === -1 )
			{
				if( vertices.querySelectorAll('li').length != 0 )
				{
					counter1 = 0;
					index++;
					v.innerHTML = 'v: '+neighbours[counter1].index;
					vv = neighbours[counter1].index;
					vneighbours.querySelector('ul').innerHTML = '';
					vneighbours.querySelector('p').innerHTML = vv;
					for( let i = 0 ; i < neighbours[counter1].n.length ; i++ )
					{
						let element = document.createElement('li');
						element.innerHTML = neighbours[counter1].n[i];
						vneighbours.querySelector('ul').appendChild(element);
					}
					counter2 = -1;
				}
				else
				{
					counter1 = -1;
					index = 1;
				}
			}
			else if( counter1 < vertices.querySelectorAll('li').length-1 )
			{
				counter1++;
				index++;
				v.innerHTML = 'v: '+neighbours[counter1].index;
				vv = neighbours[counter1].index;
				vneighbours.querySelector('ul').innerHTML = '';
				vneighbours.querySelector('p').innerHTML = vv;
				for( let i = 0 ; i < neighbours[counter1].n.length ; i++ )
				{
					let element = document.createElement('li');
					element.innerHTML = neighbours[counter1].n[i];
					vneighbours.querySelector('ul').appendChild(element);
				}
				counter2 = -1;
			}
			else
			{
				counter1 = -1;
				index = 1;
			}
		}
		else if( index === 5 )
		{
			steps[6].style.backgroundColor = 'yellow';
			document.querySelector('#showtree').innerHTML = 'Colorable: True';
			index++;
		}
		else if( index === 6 )
		{
			steps[7].style.backgroundColor = 'yellow';
			if( counter2 === -1 )
			{
				if( neighbours[counter1].n.length != 0 )
				{
					counter2 = 0;
					index++;
					vneighbours.querySelector('ul').querySelectorAll('li')[counter2].style.backgroundColor = 'lightblue';
				}
				else
				{
					counter2 = -1;
					index = 10;
				}
			}
			else if( counter2 < neighbours[counter1].n.length-1 )
			{
				counter2++;
				index++;
				vneighbours.querySelector('ul').querySelectorAll('li')[counter2].style.backgroundColor = 'lightblue';
			}
			else
			{
				counter2 = -1;
				index = 10;
			}
		}
		else if( index === 7 )
		{
			steps[8].style.backgroundColor = 'yellow';
			if( points[currentGraph.positions[uv]].style.backgroundColor === points[currentGraph.positions[neighbours[counter1].n[counter2]]].style.backgroundColor )
			{
				index++;
			}
			else
				index = 6;
		}
		else if( index === 8 )
		{
			steps[9].style.backgroundColor = 'yellow';
			document.querySelector('#showtree').innerHTML = 'Colorable: False';
			index++;
		}
		else if( index === 9 )
		{
			steps[10].style.backgroundColor = 'yellow';
			index++;
		}
		else if( index === 10 )
		{
			steps[11].style.backgroundColor = 'yellow';
			if( document.querySelector('#showtree').innerHTML === 'Colorable: True' )
			{
				index++;
			}
			else
			{
				index = 4;
			}
		}
		else if( index === 11 )
		{
			steps[12].style.backgroundColor = 'yellow';
			points[currentGraph.positions[vv]].style.backgroundColor = points[currentGraph.positions[uv]].style.backgroundColor;
			index++;
		}
		else if( index === 12 )
		{
			steps[13].style.backgroundColor = 'yellow';
			vertices.querySelectorAll('li')[counter1].remove();
			neighbours.splice(counter1,1);
			counter1--;
			index = 4;
		}
		else if( index === 13 )
		{
			steps[14].style.backgroundColor = 'yellow';
			alert('Total Number of colors used = '+ (8-colors.length));
			return;
		}
	}
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
		document.querySelector('#run').onmouseover = () =>
		{
			document.querySelector('#run').querySelector('ul').style.display = 'initial';
			for( let i = 0 ; i < 5 ; i++ )
			{
				document.querySelector('#run').querySelector('ul').querySelectorAll('li')[i].onclick = () =>
				{
					RunAlgorithm(document.querySelector('#run').querySelector('ul').querySelectorAll('li')[i].innerHTML);
				}	
			}
		}
		document.querySelector('#run').onmouseout = () =>
		{
			document.querySelector('#run').querySelector('ul').style.display = 'none';
		}
		document.querySelector('#load').onmouseout = () => {
			document.querySelector('#load').querySelector('ul').style.display = 'none';
		}
		document.querySelector('#load').querySelector('ul').querySelectorAll('li')[0].onclick = () =>
		{
			document.querySelector('#newgraph').style.display = 'initial';
			submitGraphName();
		}
		document.querySelector('#clear').onclick = () =>
		{
			clearCanvas();
		}
		document.querySelector('#reset').onclick = () =>
		{
			clearCanvas();
			if( currentGraph.name != '' )
				loadGraph( currentGraph.name );
			blockEdit();
		}
		document.querySelector('#options').querySelector('ul').querySelectorAll('li')[2].onclick = () => 
		{
			if( document.querySelector('#options').querySelector('ul').querySelectorAll('li')[2].querySelector('input').checked === true )
			{
				document.querySelector('#content').querySelector('ul').querySelectorAll('li')[0].innerHTML = 'SourceVertex: ';
				clearCanvas();
				if( currentGraph.name != '' )
					loadGraph( currentGraph.name );
				selectSourceVertex();
			}
			else
			{
				return;
			}
		}
		if( !localStorage.graphs )
		{
			localStorage.graphs = JSON.stringify([]);
		}
		updateGraphList();

		document.querySelector('#editgraph').onclick = () => {
			if( currentGraph.name === '' )
			{
				alert("Select/Create a Graph to Edit");
				return;
			}
			if( document.querySelector('#editgraph').style.backgroundColor === 'violet' )
			{
				editGraph();
			}
			else
			{
				blockEdit();
				hide();
			}
		}
	});

