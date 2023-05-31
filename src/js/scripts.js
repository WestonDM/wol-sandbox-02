$(document).ready(function(){

    $( ".member_link" ).on( "click", function( event ) {
        event.preventDefault();
        console.log('thingy');
    });
    
});



function menuOpener() {
	var mainMenu = document.getElementById("mainnav");
    //console.log(mainMenu);
	if(mainMenu.className === "topnav") {
		mainMenu.className += " responsive";
	} else {
		mainMenu.className = "topnav";
	}
}

/******  Main Menu Dropdown  ******/

$(function() { // Dropdown toggle
	$('.dropdown-toggle').click(function() {
		$('.dropdown').slideUp();
		$(this).next('.dropdown').slideToggle();
		console.log('target-down');
	});

	$(document).click(function(e) {
		var target = e.target;
		if(!$(target).is('.dropdown-toggle') && !$(target).parents().is('.dropdown-toggle'))
		//{ $('.dropdown').hide(); }
		{
			$('.dropdown').slideUp();
		}
	});
});


