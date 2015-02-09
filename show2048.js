function showNumber(i,j,randnum)
{
	var numberCell=$('#number-cell-'+i+'-'+j);
	numberCell.css('background-color',getNumberBgCl(randnum));
	numberCell.css('color',getNumberCl(randnum));
	numberCell.text(randnum);

	numberCell.animate(
	{
		width:cellSideLength,
		height:cellSideLength,
		top:getPosTop(i,j),
		left:getPosLeft(i,j)

	},50);
		
}
function showMove(fromx,fromy,tox,toy)
{
	var numberCell=$('#number-cell-'+fromx+'-'+fromy);
	numberCell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},200);
}