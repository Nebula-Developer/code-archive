


// On load
$(function() {
    $("#navbar").load("/html/navbar.html");

    $(".nav li a[href='" + window.location.pathname + "']").parent().addClass("active");
});
