var homeAboutBackground = $('.home-about-background');
// var map = document.querySelector('map');
// var image = document.getElementById('image');
// var wrapper = document.getElementById('wrapper');
// var svg = document.getElementById('svg');
// var polygon = document.getElementById('polygon');
var map = $('map');
var image = $('#image');
var wrapper = $('#wrapper');
var svg = $('#svg');
var polygon = $('#polygon');

$(window).on('scroll', function () {
	var st = $(this).scrollTop();
	homeAboutBackground.css({
		'background-position': st / 4 + 'px ' + Math.sin(st / 100) * 10 + 'px', // the sin gives it a bit more of a wave effect, although it's not very noticeable
	});
});

function updateImageAreas() {
	map.html(''); // clear the map
	svg.css('opacity', '0'); // hide the svg

	wrapper.css('width', image.width() + 'px');
	wrapper.css('height', image.height() + 'px');

	for (var coord in coords) {
		// var area = document.createElement('area');
		// area.setAttribute('shape', 'poly');
		// area.setAttribute(
		// 	'coords',
		// 	coords[coord]
		// 		.map(function (coord) {
		// 			return (
		// 				coord[0] * image.width + ',' + coord[1] * image.height
		// 			);
		// 		})
		// 		.join(',')
		// );
		// area.setAttribute('href', coord);
		// area.setAttribute('target', '_blank');
		// area.setAttribute('title', coord);
		// map.appendChild(area);

		var area = $('<area></area>');
		area.attr('shape', 'poly');

		area.attr(
			'coords',
			coords[coord]
				.map(function (coord) {
					return (
						coord[0] * image.width() +
						',' +
						coord[1] * image.height()
					);
				})
				.join(',')
		);

		area.attr('href', coord);
		area.attr('target', '_blank');
		area.attr('title', coord);

		map.append(area);
	}
}

function logNormalisedAreas() {
	// for all of the areas, get their normal coords and console.log them as an array
	var areas = map.querySelectorAll('area');
	var coords = [];
	areas.forEach(function (area) {
		var coordsString = area.getAttribute('coords');
		var coordsArray = coordsString.split(',');
		var curArr = [];
		for (var i = 0; i < coordsArray.length; i += 2) {
			curArr.push([
				coordsArray[i] / image.width,
				coordsArray[i + 1] / image.height,
			]);
		}

		curArr = curArr.map(function (coord) {
			return [
				Math.round(coord[0] * 100) / 100,
				Math.round(coord[1] * 100) / 100,
			];
		});

		coords.push(JSON.stringify(curArr));
	});

	console.log(JSON.stringify(coords, null, 2).replaceAll('"', ''));
}

updateImageAreas();
window.addEventListener('resize', updateImageAreas);

$('body').on('contextmenu', 'area', function (e) {
	return false;
});

$('body').on('mouseover', 'area', function (e) {
	svg.css('opacity', '1');

	var coords = e.target
		.getAttribute('coords')
		.split(',')
		.map(function (coord) {
			return parseInt(coord);
		});

	var points = [];
	for (var i = 0; i < coords.length; i += 2) {
		points.push(coords.slice(i, i + 2));
	}

	var path = points
		.map(function (point) {
			return point.join(',');
		})
		.join(' ');

	polygon.attr('points', path);
});

$('body').on('mouseout', 'area', function (e) {
	svg.css('opacity', '0');
});
