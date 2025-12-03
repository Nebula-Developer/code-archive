


// On load
$(function() {
    $("#navbar").load("/html/navbar.html");
    $("#footer").load("/html/footer.html");

    $(".nav li a[href='" + window.location.pathname + "']").parent().addClass("active");
});
