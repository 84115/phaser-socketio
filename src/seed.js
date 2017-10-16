var fs = require('fs');

var fill = function (min=1, max=30) {
	var min = Math.ceil(min);
	var max = Math.floor(max);

	// The maximum is exclusive and
	// The minimum is inclusive
	return Math.floor(Math.random() * (max - min)) + min;
}

var range = (x=0, y=1) => {
	if (x > y) {
		return range(y, x).reverse();
	}

	return x === y ? [y] : [x, ...range(x + 1, y)];
}

var path = file => 'static/assets/tile/omega-' + file + '.csv';

var tiles = range(0, 30).map(tile => fs.readFileSync(path(tile), 'utf8'));

var csvToArray = function(cell) {
	return tiles[cell]
		.replace(/\n$/, '')
		.split('\n')
		.map(x => x.split(','));
};




// 196 unique tiles with border
var tilemap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),0],
    [0,fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),0],
    [0,fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),0],
    [0,fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),0],
    [0,fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),0],
    [0,fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),0],
    [0,fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),0],
    [0,fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),0],
    [0,fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),0],
    [0,fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),fill(),0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,15,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,18,19,17,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
].map(row => row.map(csvToArray));

var tilemap_height = tilemap.length;
var tilemap_width = tilemap[0].length;
var cell_height = tilemap[0][0].length;

var csv = "";
var stack = 0;

// TILEMAP-ROW
for (var i = 0; i < tilemap_height; i++) {
	for (var j = 0; j < tilemap_width; j++) {
		for (var k = 0; k < cell_height; k++) {
			// console.log(tilemap[i][k][j].toString(), i, j, k, stack, tilemap_width);

			csv += tilemap[i][k][j].toString();

			if (k == tilemap_width-1) {
				csv += '\n';
			}
			else {
				csv += ',';
			}

			if (stack < tilemap_width) {
				stack++;
			}
			else {
				stack = 0;
			}
		}
	}
}





fs.writeFileSync(path('compiled'), csv, 'utf8');
