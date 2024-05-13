

var hoverTextContainer = $(".hover-text-container");
var hoverTextName = $(".hover-text-name");
var hoverTextDefinition = $(".hover-text-definition");

$(".hover-word").on("mouseover", function() { // shows a tooltip when hovering over a word
    var hoverWord = $(this).attr("data-define");
    var hoverWordName = $(this).text();
    hoverWordName = hoverWordName[0].toUpperCase() + hoverWordName.slice(1);

    hoverTextContainer.removeClass("hide");
    hoverTextName.text(hoverWordName);
    hoverTextDefinition.text(hoverWord);

    var pos = $(this).offset();
    var top = pos.top + $(this).height();
    var left = pos.left + $(this).width() / 2 - hoverTextContainer.width() / 2;

    hoverTextContainer.css({
        top: top + "px",
        left: left + "px"
    });
});

$(".hover-word").on("mouseout", function() { // removes the tooltip when the mouse leaves the word
    hoverTextContainer.addClass("hide");
});

$(".hover-text-container").on("mouseover", function() { // prevents the tooltip from disappearing when the mouse hovers over it
    hoverTextContainer.removeClass("hide");
});

$(".hover-text-container").on("mouseout", function() { // hides the tooltip when the mouse leaves it
    hoverTextContainer.addClass("hide");
});