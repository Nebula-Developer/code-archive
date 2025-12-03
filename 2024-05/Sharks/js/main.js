var hoverTextContainer = $('.hover-text-container');
var hoverTextName = $('.hover-text-name');
var hoverTextDefinition = $('.hover-text-definition');

// Add a listener to the hover event of a hover-word element.
$('.hover-word').on('mouseover', function () {
	// Get the information of the word from the dom
	var hoverWord = $(this).attr('data-define').trim();
	var hoverWordName = $(this).text().trim();

	// Removes any special characters using a regex,
	// then capitalizes the first letter of the word.
	// This all saves us having to write a title for each
	// word.. but also means we have to write more javascript.
	hoverWordName = hoverWordName.replace(/[^a-zA-Z ]/g, '');
	hoverWordName = hoverWordName[0].toUpperCase() + hoverWordName.slice(1);

	// Modify the hover text wrapper content and amke it visible
	hoverTextName.text(hoverWordName);
	hoverTextDefinition.html(hoverWord);
	hoverTextContainer.removeClass('hide');

	var pos = $(this).offset(); // This is the document position of the hovered word
	var top = pos.top + $(this).height();
	var left = pos.left + $(this).width() / 2 - hoverTextContainer.width() / 2;
	left = Math.max(0, left); // Prevents from going off the left side of the screen

	// Modify the container positioning (append px as it is modifying the css properties)
	hoverTextContainer.css({
		top: top + 'px',
		left: left + 'px',
	});
});

// When the mouse is over the hover text container, keep it visible for
// interacting with the links or text inside it.
$('.hover-text-container').on('mouseover', () => 
	hoverTextContainer.removeClass('hide')
);

// When the mouse leaves either the hover word or the hover text container, hide the hover text container.
// JQuery uses CSS selectors, which makes this easy (similar to document.querySelectorAll('.hover-text-container, .hover-word')...)
$('.hover-text-container, .hover-word').on('mouseout', () => 
	hoverTextContainer.addClass('hide')
);
