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
	p.innerHTML = '';
	p.style.position = 'absolute';
	p.style.padding = '0';
	p.style.marginTop = '-14px';
	p.style.fontSize = '25px';
	line.appendChild(p);
	line.querySelector('p').style.marginLeft = distance/2-12+'px';

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
					if( d < e )
						id = 'line'+d+''+e;
					else
						id = 'line'+e+''+d;
					document.querySelector('#'+id).remove();
				}
				currentGraph.positions.splice(k, 1);
				currentGraph.adjlist.splice(k, 1);
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
				if( document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1].style.backgroundColor === 'tomato' )
					return;
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
	document.querySelector('#newgraph').querySelector('#graphname').value = '';
	document.querySelector('#newgraph').querySelectorAll('button')[0].onclick = () =>
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
			document.querySelector('#newGraph').querySelector('form').value = "";
		}
		if( b )
		{
			document.querySelector('#load').querySelector('ul').appendChild(newitem);
			document.querySelector('#newgraph').style.display = 'none';
			g = new graph();
			g.name = newitem.innerHTML;
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
	document.querySelector('#newgraph').querySelectorAll('button')[1].onclick = () =>
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
		let d = currentGraph.positions[m];
		for( let j = 0 ; j < currentGraph.adjlist[i].neighbours.length ; j++ )
		{
			let n = currentGraph.adjlist[i].neighbours[j];
			let e = currentGraph.positions[n];
			if( d < e )
			{
				let newitem = document.createElement('div');
				newitem.start = i;
				newitem.end = j;
				document.querySelector('#lines').appendChild(newitem)
				newitem.id = 'line'+d+''+e;
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
	document.querySelector('#editgraph').style.backgroundColor = 'darkviolet';
	let iv = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[0];
	let il = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1];
	let save = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[2];
	let del = document.querySelector('#options').querySelector('ul').querySelectorAll('li')[3];

	iv.style.display = 'flex';
	il.style.display = 'flex';
	save.style.display = 'flex';
	del.style.display = 'flex';

	iv.onclick = () =>
	{
		iv.style.backgroundColor = 'red';
		il.style.backgroundColor = 'tomato';
		unhide();
		insertPoints();
	}
	il.onclick = () =>
	{
		iv.style.backgroundColor = 'tomato';
		il.style.backgroundColor = 'red';
		hide();
		insertLine();
	}
	save.onclick = () =>
	{
		iv.style.backgroundColor = 'tomato';
		il.style.backgroundColor = 'tomato';
		alert('Graph successfully saved');
		saveGraph();
	}
	del.onclick = () =>
	{
		il.style.backgroundColor = 'tomato';
		iv.style.backgroundColor = 'tomato';
		let list = getlist();
		for( let i = 0 ; i < list.length ; i++ )
		{
			if( list[i].name === currentGraph.name )
			{
				document.querySelector('#load').querySelector('ul').querySelectorAll('li')[i+1].remove();
				currentGraph = new graph();
				list.splice(i, 1);
				localStorage.graphs = JSON.stringify(list);
				blockEdit();
				clearCanvas();
				return;
			}
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
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[0].style.backgroundColor = 'tomato';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[1].style.backgroundColor = 'tomato';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[2].style.backgroundColor = 'tomato';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[3].style.backgroundColor = 'tomato';
}

function resetAlgo()
{
	let steps = document.querySelector('#bfscode').querySelectorAll('li');
	for( let i = 0 ; i < steps.length ; i++ )
	{
		steps[i].style.backgroundColor = 'orange';
	}
}


function showTree( tree, s )
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
			if( m < n )
			{
				id = 'line'+m+n;
				document.querySelector('#lines').querySelector('#'+id).querySelector('p').innerHTML = '&#9664;';
				document.querySelector('#lines').querySelector('#'+id).style.visibility = 'visible';
			}
			else
			{
				id = 'line'+n+m;
				document.querySelector('#lines').querySelector('#'+id).querySelector('p').innerHTML = '&#9654;';
				document.querySelector('#lines').querySelector('#'+id).style.visibility = 'visible';
			}
		}
	}
}

function hideTree( tree, s )
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
			if( m < n )
			{
				id = 'line'+m+n;
				document.querySelector('#lines').querySelector('#'+id).querySelector('p').innerHTML = '';
			}
			else
			{
				id = 'line'+n+m;
				document.querySelector('#lines').querySelector('#'+id).querySelector('p').innerHTML = '';
			}
		}
	}

}

function createToolTips()
{
	let points = document.querySelectorAll('.point');
	for( let i = 0 ; i < currentGraph.positions.length ; i++ )
	{
		let tooltip = document.createElement('div');
		tooltip.innerHTML = 'd: <i>-1</i><br>p: <i>nil</i>';
		points[currentGraph.positions[i]].appendChild(tooltip);
	}
}

function RunAlgorithm( algo )
{
	if( currentGraph.name == '' )
	{
		alert('Select a graph to run the Algorithm');
		return;
	}
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[4].style.display = 'flex';
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[5].style.display = 'flex';
	document.querySelector('#algorithm').style.display = 'initial';
	document.querySelector('#headings').querySelector('#reset').style.display = 'none';
	document.querySelector('#headings').querySelector('#clear').style.display = 'none';
	document.querySelector('#headings').querySelector('#load').style.display = 'none';
	document.querySelector('#headings').querySelector('#editgraph').style.display = 'none';
	document.querySelector('#headings').querySelector('#run').style.display = 'none';
	document.querySelector('#headings').querySelector('#algoname').style.display = 'flex';
	document.querySelector('#headings').querySelector('#algoname').innerHTML = 'Algorithm: '+algo;
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[4].onclick = () =>
	{
		document.querySelector('#content').style.display = 'initial';
		document.querySelector('#selectsourcevertex').style.display = 'flex';
		clearCanvas();
		if( currentGraph.name != '' )
			loadGraph( currentGraph.name );
		blockEdit();
		resetAlgo();
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[1].innerHTML = 'SourceVertex:';
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[2].innerHTML = 'CurrentVertex:';
		document.querySelector('#content').querySelector('ul').querySelectorAll('li')[3].innerHTML = 'Adj[<p>CurrentVertex</p>]:<ul></ul>';
		document.querySelector('#queue').querySelector('ul').innerHTML = '';
		sourcevertex = -1;
		document.querySelector('#selectsourcevertex').onclick = () =>
		{
			document.querySelector('#selectsourcevertex').style.backgroundColor = 'green';
			selectSourceVertex();
		}
		runBFS();
	}
	document.querySelector('#options').querySelector('ul').querySelectorAll('li')[5].onclick = () =>
	{
		document.querySelector('#content').style.display = 'none';
		document.querySelector('#options').querySelector('ul').querySelectorAll('li')[4].style.display = 'none';
		document.querySelector('#options').querySelector('ul').querySelectorAll('li')[5].style.display = 'none';
		document.querySelector('#algorithm').style.display = 'none';
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
		document.querySelector('#queue').querySelector('ul').innerHTML = '';
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
	createToolTips();
	console.log(currentGraph);
	console.log(sourcevertex);
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
		resetAlgo();
		if( document.querySelector('#start').checked === false )
		{
			clearCanvas();
			if( currentGraph.name != '' )
				loadGraph(currentGraph.name);
			return;
		}
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
			queue.querySelector('li').style.animation = 'remove 2s linear'
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
			for( let i = 0 ; i < 1 ; i++ )
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

