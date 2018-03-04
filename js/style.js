//  function used for click sidebar toggle to hide sidebar 
$(document).ready(function() {
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
        $('#map').css("width", "100vw");
    });
});