$('.dropdown').each(function() {
    $(this).append('<div class="dropdown-header"><p class="dropdown-header-text">' + $(this).find('.dropdown-item').first().text() + '</p></div>');
    $(this).attr('data-value', $(this).find('.dropdown-header').text());
    $(this).find('.dropdown-header').append('<i class="fas fa-caret-down dropdown-caret"></i>');
});

$('.dropdown-header').click(function() {
    $(this).parent().toggleClass('active');
});

$('.dropdown-item').click(function() {
    var parent = $(this).parent().parent();
    var header = parent.find('.dropdown-header').find('.dropdown-header-text');

    parent.toggleClass('active');
    parent.attr('data-value', $(this).data('value') || $(this).text());
    header.text($(this).text());

    // Call all listeners for this elements 'change' event
    parent.trigger('change');
});
