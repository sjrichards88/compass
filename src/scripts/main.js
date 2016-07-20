jQuery(function($) {

    /*----------------------

	Set variables

    ----------------------*/

	var contentSections = $('.cd-section'),
	sideNavWrap = $('#cd-vertical-nav'),
	navigationItems = $('#cd-vertical-nav a'),
	navigationItems2 = $('.navbar-nav li'),
	loaded = true,
	fixed_point = 0;

	//On Load
	Adjust();
	$('.navbar-stick .navbar').after("<div class='navbar-filler'></div>");
	$.validate();

	new WOW().init();

	$('.owl-book').owlCarousel({
		singleItem:true,
		items:1,
		pagination:false,
		autoPlay:3000
	});

	$('.owl-reviews').owlCarousel({
		items:3,
		navigation:true,
		autoPlay:5000,
		navigationText: ["<span></span>","<span></span>"]
	});

	$(".get-direction").tooltip({
	    direction: "top"
	});

	$(window).resize(function(){
		Adjust();
	});

	$(window).on('scroll', function() {
		Adjust();
	});

	// $('.sample-button').click(function(){
	// 	$('#sample-form').slideDown();
	// 	event.preventDefault();
	// });

	$('form').submit(function(){
		if($(this).find(".has-error").length > 0)
			return;
		event.preventDefault();
		var that = $(this),
			url = $(that).attr('action'),
			type = $(that).attr('method'),
			dataX = {};

		$(that).find("[name]").each(function(){
			dataX[$(this).attr("name")] = $(this).val();
		});

		$('.notification-box').addClass('active');

		$.ajax({
			type:'POST',
			url: url,
			data: dataX,
			success: function(response){
				$('.notification-box span').html(response);
					setTimeout(function(){
						$('.notification-box').removeClass('active');
						$('.notification-box span').html("Sending...");
					}, 4000);
				}
		});
	});

	// Mobile Nav
	// $('.mobile-nav > ul').html($('.navbar-nav').html());
	// $('.mobile-nav').append("<a href='#' class='close-btn'><i class='icon_close'></i></a>");

	// $('.navbar-toggle').click(function(event){
	// 	event.stopPropagation();
	// 	$('#wrapper').addClass('behind');
	// 	$('.mobile-nav').addClass('active');
	// });
	// $('.mobile-nav a.close-btn').click(function(event){
	// 	$('#wrapper').removeClass('behind');
	// 	$('.mobile-nav').removeClass('active');
	// 	event.preventDefault();
	// });

  	$('.touch .cd-nav-trigger').on('click', function() {
      $('.touch #cd-vertical-nav').toggleClass('open');
    });

    $('.scrollTo, #cd-vertical-nav a, .cd-scroll-down').on('click', function(e) {
      e.preventDefault();
      smoothScroll($(this.hash));
    });

    //How we help
    $('.green-circle-wrap').click(function(e) {
      e.preventDefault();
    });

    $('.green-circle-wrap').hover(
       function(){ $(this).find('.green-circle').addClass('active') },
       function(){ $(this).find('.green-circle').removeClass('active') }
	);

    //Pathways
    $('.pathway-button').on('click', function(e) {
    	e.preventDefault();
    	var targetDiv = $(this).attr('href');
    	var minHeight = $(targetDiv).outerHeight(true);
    	var bg = $(this).data('bg');
    	$(targetDiv).css('display', 'block');
    	$(targetDiv).toggleClass('active');
    	$(targetDiv).find('h1,p,img').css('visibility', 'visible');
    	$(this).toggleClass('active');
    	if ($(this).hasClass('active')) {
    		$('.'+bg+', .close').addClass('active');
    	} else {
    		$('.'+bg+', .close').removeClass('active');
    	}
    	if ($(targetDiv).hasClass('active')) {
    		$(this).closest('section').css('height', minHeight);
    	}
    	else $(this).closest('section').css('height', 'auto');
    	smoothScroll(targetDiv);
    });

    $('.close').on('click', function(e) {
    	e.preventDefault();
    	$('.close, .pathway-button, .info-wrap, .pathways-bg').removeClass('active');
		$(this).closest('section').css('height', 'auto');
    });

    $('.toggle').on('click', function(e) {
    	e.preventDefault();
    	var toggleDiv = $(this).attr('href'),
    	scrollTo = $(this).data('scroll-to'),
    	currentText = $(this).text();
    	toggleText = $(this).data('toggle-text');
    	if (toggleText != null) {
    		$(this).text(toggleText);
    		$(this).data('toggle-text', currentText);
    	}
    	if ($(toggleDiv).length > 0) {
    		$(toggleDiv).toggleClass('active');
    		if (scrollTo == null) scrollTo = toggleDiv;
    		smoothScroll(scrollTo);
    	}
    });

    /*----------------------

	Functions

    ----------------------*/

	function smoothScroll(target, padding) {
		console.log(padding);
		if (padding == undefined) {
			var padding = 0;
			// if ($('nav.navbar').hasClass('navbar-fixed-top')) {
				padding = $('nav.navbar').not('.no-fixed-nav nav.navbar').outerHeight(true);
			// }
		}
	    var scroll = $(target).offset().top - padding;
	    $('html, body').animate({
	        scrollTop: scroll
	    }, 500);
	}

	function Adjust() {
		if($(window).width() > 768) {
			verticalCenterContent();
		}
		updateNavigation();
		stickNavbar();
	}

	function stickNavbar() {
		if(!$('.navbar-stick .navbar').hasClass("navbar-fixed-top") && loaded) fixed_point = $('.navbar').offset().top;
		if($(window).scrollTop() >= fixed_point && loaded) {
			$('.navbar-stick .navbar').addClass('navbar-fixed-top');
			$('.navbar-filler').height($('.navbar').outerHeight(true));
			$('.scroll-up').css('opacity', '1');
		}
		else {
			$('.navbar-stick .navbar').removeClass('navbar-fixed-top');
			$('.navbar-filler').height(0);
			$('.scroll-up').css('opacity', '0');
		}
	}

	function updateNavigation() {
		contentSections.each(function() {
			$this = $(this);
			var activeSection = $('#cd-vertical-nav a[href="#'+$this.attr('id')+'"]').data('number') - 1;
			if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
				navigationItems.eq(activeSection).addClass('active');
				navigationItems2.eq(activeSection).addClass('active');
			} else {
				navigationItems.eq(activeSection).removeClass('active');
				navigationItems2.eq(activeSection).removeClass('active');
			}
		});

		var activeSection = $('#cd-vertical-nav .active').attr('href');
    console.log(activeSection);
		if (activeSection !== '#who_we_are' && activeSection !== '#contact' && activeSection !== undefined) sideNavWrap.addClass('black');
		else sideNavWrap.removeClass('black');
		console.log(activeSection);
	}

	function verticalCenterContent() {
		var contentHeight = 0;
		$('.vertical-center').each(function() {
			var contentHeight = 0,
			container = $(this).closest('.parent-container'),
			elementName = container.prop('nodeName'),
			containerHeight = container.height();
			if (elementName == 'HEADER') contentHeight = $('.strapline').outerHeight();

			$(this).css('top', ((containerHeight / 2 - $(this).height() / 2) - contentHeight));
		});
	}


});
