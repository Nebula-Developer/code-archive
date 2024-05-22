var homeAboutBackground = $('.home-about-background');

$(window).on('scroll', function () {
	var st = $(this).scrollTop();
	homeAboutBackground.css({
		'background-position': st / 4 + 'px ' + Math.sin(st / 100) * 10 + 'px', // the sin gives it a bit more of a wave effect, although it's not very noticeable
	});
});
