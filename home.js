

var homeAboutBackground = $(".home-about-background");

$(window).on("scroll", function() {
    // get the scroll top value
    var st = $(this).scrollTop();
    // set the background position
    homeAboutBackground.css({
        "background-position": st / 4 + "px center"
    });
});


