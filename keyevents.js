$(document).on('click', '.message img', function() {
    const clone = $(this).clone(true);
    coverImage(clone.attr('src'));
});

$('#fullscreen-image-cover-wrapper').on('click', function(event) {
    if (event.target !== this) return;
    $('#fullscreen-image-cover-wrapper').addClass('hidden');
});

function coverImage(src) {
    $('#fullscreen-image').attr('src', src);
    $('#fullscreen-image-cover-wrapper').removeClass('hidden');
}

$(document).on('keydown', function(event) {
    if (event.key === 'Escape') {
        event.preventDefault();
        if (event.originalEvent.repeat) return;

        if (!$('#fullscreen-image-cover-wrapper').hasClass('hidden')) {
            $('#fullscreen-image-cover-wrapper').addClass('hidden');
            return;
        }
    }
});
