var board=new Array();
var score=0;

var hasConflicted = new Array();

var startx;
var starty;
var endx;
var endy;


$(document).ready(function()
{
	prepareForMobile();
	newgame();
});



function prepareForMobile()

{
	if( documentWidth > 500 )
	{
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
	$("#grid-container").css('width',gridContainerWidth-2*cellSpace);
	$("#grid-container").css('height',gridContainerWidth-2*cellSpace);
	$("#grid-container").css('padding',cellSpace);
	$("#grid-container").css('border-radius',0.02*gridContainerWidth);
	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame()
{
	init();
	oneNumber();
	oneNumber();
}

function init()
{
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++)
		{
			var gridCell=$('#grid-cell-'+i+"-"+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
			
		}
		for(var i=0;i<4;i++)
		{
			board[i]=new Array();
			 hasConflicted[i]=new Array();
			for(var j=0;j<4;j++)
			{
				board[i][j]=0;
				 hasConflicted[i][j] = false;
			}
			
		}
		updateBoardView();

			
}

function updateBoardView()
{
	$(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) );
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2);
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBgCl( board[i][j] ) );
                theNumberCell.css('color',getNumberCl( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }
             hasConflicted[i][j] = false;
		}
		$('.number-cell').css('line-height',cellSideLength+'px');
		$('.number-cell').css('font-size',0.6*cellSideLength+'px');
}
function oneNumber()
{
	if(nospace(board))
		return false;
	
	var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );

    var times = 0;
    while( times < 50 )
    {
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );

        times ++;
    }
    if( times == 50 )
    {
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0 ; j < 4 ; j ++ )
            {
                if( board[i][j] == 0 )
                {
                    randx = i;
                    randy = j;
                }
            }
    }
	var randnum=Math.random()<0.5?2:4;
	board[randx][randy]=randnum;
	showNumber(randx,randy,randnum);
	return true;
}


$(document).keydown(function(event)
{
	
	switch(event.keyCode)
	{
		case 37: if(moveLeft())
		{
			setTimeout("oneNumber()",210); 
			setTimeout("isgameover()",400) ;
		}
		break;
		case 38: 
		{
			event.preventDefault();
			if(moveUp())
			{

				setTimeout("oneNumber()",210); 
				setTimeout("isgameover()",400) ;
			}
		}
		break;
		case 39: if(moveRight())
		{
			setTimeout("oneNumber()",210); 
			setTimeout("isgameover()",400) ;
		}
		break;
		case 40: 
		{	
			event.preventDefault();

			if(moveDown())
			{
				setTimeout("oneNumber()",220); 
				setTimeout("isgameover()",400) ;
			}
		}
		break;
		default:
	}
});

document.addEventListener('touchstart',function(event)
{
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend',function(event)
{
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;
	var deltax=endx-startx;
	var deltay=endy-starty;
	if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth)
		return;
	event.preventDefault();
	if(Math.abs(deltax)>=Math.abs(deltay))
	{
		if(deltax>=0)
		{
			if( moveRight() )
			{
                setTimeout("oneNumber()",220);
                setTimeout("isgameover()",400);
            }
		}
		else
		{
			if( moveLeft() ){
                setTimeout("oneNumber()",210);
                setTimeout("isgameover()",400);
            }
		}
	}
	else
	{
		if(deltay>=0)
		{
			if(moveDown())
			{
				setTimeout("oneNumber()",210); 
				setTimeout("isgameover()",400) ;
			}
		}
		else
		{
			if(moveUp())
			{

				setTimeout("oneNumber()",210); 
				setTimeout("isgameover()",400) ;
			}
		}
	}
});

////////////////////////////////////////////////////////////////////////////////////////////以上没问题
function updateScore(i,j)
{
	score+=board[i][j];
	$('#score').text(score);

}
function isgameover()
{
    if( nospace( board ) && nomove( board ) )
    {
        gameover();
    }
}

function gameover()
{
    alert('gameover!');
}
function moveLeft()
{
	if(!canMoveLeft(board))
		return false;
	//moveLeft
	for(var i=0;i<4;i++)
		for(var j=1;j<4;j++)
		{
			if(board[i][j]!=0)
			{
				for(var k=0;k<j;k++)
				{
					if((board[i][k]==0&&noBlockHorizon(i,k,j,board)))
					{
						//move
						showMove(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[i][k]==board[i][j]&&noBlockHorizon(i,k,j,board)&&!hasConflicted[i][k])
					{
						// move add
						showMove(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						hasConflicted[i][k] = true;
						updateScore(i,k);
						continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()",200);
	return true;
}
function moveUp()
{
	if(!canMoveUp(board))
		return false;
	for(var j=0;j<4;j++)
		for(var i=1;i<4;i++)
		
		{
			if(board[i][j]!=0)
				for(var k=0;k<i;k++)
				{
					if(board[k][j]==0&&noBlockVertical(k,j,i,board))
					{
						showMove(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[k][j]==board[i][j]&&noBlockVertical(k,j,i,board) && !hasConflicted[k][j] )
					{
						showMove(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						hasConflicted[k][j] = true;
						updateScore(k,j);
						continue;
					}
				}
		}
	setTimeout("updateBoardView()",200);
	return true;
}
function moveRight()
{
	if(!canMoveRight(board))
		return false;
	 for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- )
		{
			if(board[i][j]!=0)
				for(var k=3;k>j;k--)
				{
					if(board[i][k]==0&&noBlockHorizon(i,j,k,board))
					{
						showMove(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[i][k]==board[i][j]&&noBlockHorizon(i,j,k,board)&&!hasConflicted[i][k])
					{
						showMove(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						hasConflicted[i][k] = true;
						updateScore(i,k);
						continue;
					}
				}
		}
	setTimeout("updateBoardView()",200);
	return true;
}
function moveDown()
{

	if(!canMoveDown(board))
		return false;
	 for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- )
		{
			if(board[i][j]!=0)
				for(var k=3;k>i;k--)
				{
					if(board[k][j]==0&&noBlockVertical(i,j,k,board))
					{
						showMove(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[k][j]==board[i][j]&&noBlockVertical(i,j,k,board) && !hasConflicted[k][j] )
					{
						showMove(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						hasConflicted[k][j] = true;
						updateScore(k,j);
						continue;
					}
				}
		}
	setTimeout("updateBoardView()",200);
	return true;
}