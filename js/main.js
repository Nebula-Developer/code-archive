var hoverTextContainer = $('.hover-text-container');
var hoverTextName = $('.hover-text-name');
var hoverTextDefinition = $('.hover-text-definition');

// add a listener to the hover event of a hover-word element.
$('.hover-word').on('mouseover', function () {
	// get the information of the word from the dom
	var hoverWord = $(this).attr('data-define').trim();
	var hoverWordName = $(this).text().trim();

	hoverWordName = hoverWordName.replace(/[^a-zA-Z ]/g, ''); // removes any special characters
	hoverWordName = hoverWordName[0].toUpperCase() + hoverWordName.slice(1); // capitalizes the first letter of the word

	// modify the hover text wrapper content and amke it visible
	hoverTextName.text(hoverWordName);
	hoverTextDefinition.html(hoverWord);
	hoverTextContainer.removeClass('hide');

	var pos = $(this).offset(); // document position of the hover-word
	var top = pos.top + $(this).height();
	var left = pos.left + $(this).width() / 2 - hoverTextContainer.width() / 2;
	left = Math.max(0, left); // prevents from going off the left side of the screen

	// modify the container positioning (append px as it is modifying the css properties)
	hoverTextContainer.css({
		top: top + 'px',
		left: left + 'px',
	});
});

$('.hover-text-container').on('mouseover', () => // when the mouse is over the hover text container, keep it visible
	hoverTextContainer.removeClass('hide')
);
$('.hover-text-container, .hover-word').on('mouseout', () => // when the mouse leaves either the hover word or the hover text container, hide the hover text container
	hoverTextContainer.addClass('hide')
);
