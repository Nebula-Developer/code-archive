var hoverTextContainer = $(".hover-text-container");
var hoverTextName = $(".hover-text-name");
var hoverTextDefinition = $(".hover-text-definition");

$(".hover-word").on("mouseover", function() { // shows a tooltip when hovering over a word
    var hoverWord = $(this).attr("data-define").trim();
    var hoverWordName = $(this).text().trim();
    hoverWordName = hoverWordName.replace(/[^a-zA-Z ]/g, ""); // removes any special characters
    hoverWordName = hoverWordName[0].toUpperCase() + hoverWordName.slice(1); // capitalizes the first letter of the word

    hoverTextContainer.removeClass("hide");
    hoverTextName.text(hoverWordName);
    hoverTextDefinition.html(hoverWord);

    var pos = $(this).offset(); // document position of the hover-word
    var top = pos.top + $(this).height();
    var left = pos.left + $(this).width() / 2 - hoverTextContainer.width() / 2;
    left = Math.max(0, left); // prevents from going off the left side of the screen

    hoverTextContainer.css({
        top: top + "px",
        left: left + "px"
    });
});

$(".hover-text-container").on("mouseover", () => hoverTextContainer.removeClass("hide"));
$(".hover-text-container, .hover-word").on("mouseout", () => hoverTextContainer.addClass("hide"));
