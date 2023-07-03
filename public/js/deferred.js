$('.dropdown').each(function() {
    var firstItem = $(this).find('.dropdown-item').first();
    $(this).append('<div class="dropdown-header"><p class="dropdown-header-text">' + firstItem.text() + '</p></div>');
    $(this).attr('data-value', firstItem.data('value') || firstItem.text());
    $(this).find('.dropdown-header').append('<i class="fas fa-caret-down dropdown-caret"></i>');

    $(this).trigger('change');
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
