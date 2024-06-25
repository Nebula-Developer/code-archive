var homeAboutBackground = $('.home-about-background');

var map = $('map');
var image = $('#imageMap');
var wrapper = $('#wrapper');
var svg = $('#svg');
var polygon = $('#polygon');

// This positions the about-section background relative to the scroll
// to make it feel more dynamic.
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
		// This old version was written without JQuery and was a bit of a mess:

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
			// Calculate the normalised coordinates
			curArr.push([
				coordsArray[i] / image.width,
				coordsArray[i + 1] / image.height,
			]);
		}

		curArr = curArr.map(function (coord) {
			// Round coordinates to 2 decimal places because JS often
			// has floating point errors
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

// When the image loads or resizes, we need to update the image areas
// because the image dimensions will have changed.
window.addEventListener('resize', updateImageAreas);
window.addEventListener('load', updateImageAreas);
image.on('load', updateImageAreas);

$('body').on('contextmenu', 'area', function (e) {
	// Prevent right-clicking on the areas
	return false;
});

$('body').on('mouseover', 'area', function (e) {
	// Show the hover polygon when the mouse enters the area
	svg.css('opacity', '1');

	var coords = e.target
		.getAttribute('coords')
		.split(',')
		.map(function (coord) {
			return parseInt(coord);
		});

	var points = [];
	for (var i = 0; i < coords.length; i += 2) {
		// We push all the points into
		// an array of arrays, where each
		// sub-array is the pair of coordinates
		points.push(coords.slice(i, i + 2));
	}

	// We then map the points to a string
	// because it has strict formatting
	var path = points
		.map(function (point) {
			return point.join(',');
		})
		.join(' ');

	// Set the points attribute of the polygon to the path
	polygon.attr('points', path);
});

$('body').on('mouseout', 'area', function (e) {
	// Hide the hover polygon when the mouse leaves the area
	svg.css('opacity', '0');
});
