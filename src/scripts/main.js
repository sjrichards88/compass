jQuery(function($) {

    /*----------------------

	Set variables

    ----------------------*/

	var contentSections = $('.cd-section'),
	sideNavWrap = $('#cd-vertical-nav'),
	navigationItems = $('#cd-vertical-nav a'),
	navigationItems2 = $('.navbar-nav li'),
	loaded = true,
	fixed_point = 0,
	ms_debug = true,
		// Responsive tracking
	ms_current_bootstrap_size = "md";   // Should be lg/md/sm/xs

	//On Load
	track_window_size();
	Adjust();
	$('.navbar-stick .navbar').after("<div class='navbar-filler'></div>");
	$.validate();
	// Debug
    if(ms_debug) {
        console.log("jQuery Ready, you are viewing template size: "+ms_current_bootstrap_size);
    }

	new WOW().init();

	window.addEventListener("load",function() {
	// Set a timeout...
		setTimeout(function(){
			// Hide the address bar!
			window.scrollTo(0, 1);
		}, 0);
	})

	$('.owl-book').owlCarousel({
		singleItem:true,
		items:1,
		pagination:false,
		autoPlay:3000
	});

	$('.owl-reviews').owlCarousel({
		items: 3,
		itemsDesktop: [1025,3],
		navigation: true,
		autoPlay: 5000,
		navigationText: ["<span class='icon icon-arrow-left'></span>","<span class='icon icon-arrow-right'></span>"]
	});

	$(".get-direction").tooltip({
	    direction: "top"
	});

	$(window).resize(function(){
		Adjust();
		resizeReviews();
		track_window_size();
		// Debug
	    if(ms_debug) {
	        console.log("jQuery Ready, you are viewing template size: "+ms_current_bootstrap_size);
	    }
	});

	$(window).on('scroll', function() {
		Adjust();
	});

	$(document).ready(function() {
		resizeReviews();
	});

	// $('.sample-button').click(function(){
	// 	$('#sample-form').slideDown();
	// 	event.preventDefault();
	// });

	$('form').submit(function(event){
		event.preventDefault();
		if($(this).find(".has-error").length > 0) {
			$('#contact').addClass('form-error');
			return;
		}
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

	//nav

	$('.navbar-nav li a').on('click', function() {
		$('.navbar-collapse').removeClass('in');
	});

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

    if (!Modernizr.touch) {
	    $('.green-circle-wrap').hover(
	       function(){ $(this).find('.green-circle').addClass('active') },
	       function(){ $(this).find('.green-circle').removeClass('active') }
		);
	}

    //Pathways
    $('.pathway-button').click(function(e) {
    	e.preventDefault();
    	var targetDiv = $(this).attr('href');
    	var minHeight = $(targetDiv).outerHeight(true);
    	var bg = $(this).data('bg');
    	$(this).toggleClass('active');
    	$('.pathway-button').not(this).toggleClass('non-active');
    	$(targetDiv).css('display', 'block');
    	$(targetDiv).toggleClass('active');
    	$(targetDiv).find('h1,p,img').css('visibility', 'visible');
    	if ($(this).hasClass('active')) {
    		$('.'+bg+', .close').addClass('active');
    	} else {
    		$('.'+bg+', .close').removeClass('active');
    	}
    	if ($(targetDiv).hasClass('active')) {
    		$(this).closest('section').css('height', minHeight);
    		//update side nav
			sideNavWrap.removeClass('black');
    	} else {
    		$(this).closest('section').css('height', 'auto');
    		//update side nav
			sideNavWrap.addClass('black');
    	}
    	if ($(targetDiv).length > 0) smoothScroll(targetDiv);
    });

    $('.close').on('click', function(e) {
    	e.preventDefault();
    	$('.close, .pathway-button, .info-wrap, .pathways-bg, .toggle').removeClass('active non-active');
    	if ($(this).closest('section').is('#pathways')) {
    		//update side nav
			sideNavWrap.addClass('black');
    	}
		$(this).closest('section').css('height', 'auto');
    });

    $('.toggle').on('click', function(e) {
    	e.preventDefault();
    	var toggleDiv = $(this).attr('href'),
    	scrollTo = $(this).data('scroll-to'),
    	currentText = $(this).text();
    	toggleText = $(this).data('toggle-text');
    	$('.profiles .toggleable').not(toggleDiv).removeClass('active');
    	$('.profiles .toggle').not($(this)).removeClass('active');
    	$(this).toggleClass('active');
    	if ($(toggleDiv).length > 0) {
    		$(toggleDiv).toggleClass('active');
    		if (scrollTo == null) scrollTo = toggleDiv;
    		smoothScroll(scrollTo);
    	} 
    });

    $('.show-more-profiles').click(function() {
    	var toggleDiv = $(this).data('toggle-class'),
    	scrollTo = $(this).data('scroll-to'),
    	currentText = $(this).text();
    	toggleText = $(this).data('toggle-text');
    	$(this).toggleClass('active');
    	if (toggleText != null) {
    		$(this).text(toggleText);
    		$(this).data('toggle-text', currentText);
    	}
    	$(this).closest('.reviews').find(toggleDiv).toggleClass('hidden');
    	if (scrollTo == null) scrollTo = toggleDiv;
	    smoothScroll(scrollTo);
    });

    /*----------------------

	Functions

    ----------------------*/

	function smoothScroll(target, padding) {
		if (padding == undefined) {
			var padding = 0;
			// if ($('nav.navbar').hasClass('navbar-fixed-top')) {
			// if (! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				padding = 100; //nav height
			// }
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
		// if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		// 	if($(window).scrollTop() > 0) {
		// 		$('.scroll-up').css('opacity', '1').addClass('slide-in');
		// 	} else {
		// 		$('.scroll-up').css('opacity', '0').removeClass('slide-in');
		// 	}
		// 	if ($(window).scrollTop() >= $('#who_we_are').outerHeight()) {
		// 		$('.cd-nav-trigger').css('opacity', '1');
		// 	} else {
		// 		$('.cd-nav-trigger').css('opacity', '0');
		// 	}
		// } else {
			if ($('body.home').length > 0) {
				if(!$('.navbar-stick .navbar').hasClass("navbar-fixed-top") && loaded) fixed_point = $('.navbar').offset().top;
			} else {
				fixed_point = 0;
			}
			
			if($(window).scrollTop() >= fixed_point && loaded) {
				$('.navbar-stick .navbar').addClass('navbar-fixed-top');
				if ($('body.home').length > 0) $('.navbar-filler').height($('.navbar').outerHeight(true));
			} else {
				$('.navbar-stick .navbar').removeClass('navbar-fixed-top');
				if ($('body.home').length > 0) $('.navbar-filler').height(0);
			}

			//For slide up on pahes other than home page add some padding before scroll
			if ($('body.home').length == 0) fixed_point = fixed_point + 100;

			if($(window).scrollTop() >= fixed_point && loaded) {
				$('.scroll-up').css('opacity', '1').addClass('slide-in');
			} else {
				$('.scroll-up').css('opacity', '0').removeClass('slide-in');
			}


		// }
	}

	function updateNavigation() {

		var windscroll = $(window).scrollTop();

		// contentSections.not('#profiles').each(function() {
		// 	$this = $(this);
			
		// 	var activeSection = $('#cd-vertical-nav a[href="#'+$this.attr('id')+'"]').data('number') - 1;
		// 	// if ( ( $this.offset().top - $(window).height() / 4 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height() / 4 > $(window).scrollTop() ) ) {
		// 	// 	navigationItems.eq(activeSection).addClass('active');
		// 	// 	navigationItems2.eq(activeSection).addClass('active');
		// 	// } else {
		// 	// 	navigationItems.eq(activeSection).removeClass('active');
		// 	// 	navigationItems2.eq(activeSection).removeClass('active');
		// 	// }

		// 	if ($this.offset().top <= windscroll + 100) {
		// 		navigationItems.each(function() {
		// 			$(this).removeClass('active');
		// 		});				
		// 		navigationItems2.each(function() {
		// 			$(this).removeClass('active');
		// 		});
		// 		navigationItems.eq(activeSection).addClass('active');
		// 		navigationItems2.eq(activeSection).addClass('active');
		// 	}

		// });

		navigationItems2.each(function() {
			$this = $(this).find('a');
			var targetDiv = $this.attr('href');
			//Check section exists
			if ($(targetDiv).length > 0) {
				if ($(targetDiv).offset().top <= windscroll + 200) {
					console.log(targetDiv);
					navigationItems2.each(function() { $(this).removeClass('active'); });
					$this.parent().addClass('active');
				}
			}
		});		

		navigationItems.each(function() {
			$this = $(this);
			var targetDiv = $this.attr('href');
			//Check section exists
			if ($(targetDiv).length > 0) {
				console.log(targetDiv);
				// if ($(targetDiv).offset().top <= windscroll + 200) {
				if ( $(targetDiv).offset().top - $(window).height() / 2 < $(window).scrollTop() ) {
					navigationItems.each(function() { $(this).removeClass('active'); });
					$this.addClass('active');
				}
			}
		});

		var activeSection = $('#cd-vertical-nav .active').attr('href');
	    console.log(activeSection);
		if (activeSection !== '#who_we_are' && activeSection !== '#contact' && activeSection !== undefined) {
			if (activeSection == '#pathways') {
				if ($('#pathways .pathways-bg.active').length > 0) {
					sideNavWrap.removeClass('black');
				} else {
					sideNavWrap.addClass('black');
				}
			} else {
				sideNavWrap.addClass('black');
			}
		} 
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

	function resizeReviews() {
		var maxHeight = -1;

		$('.profiles .reviews').each(function() {
			$(this).find('.review').each(function() {
				maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
			});
			$(this).find('.review').each(function() {
				$(this).height(maxHeight);
			});
		});
	}

	/**
	 * Monitors the size of the window and detects if the bootstrap template changes size
	 * Sets some global variables to help us keep track of the window size and bootstrap template being displayed
	 * @returns {void}
	 */
	function track_window_size()
	{
	    // Keep track of window/document height
	    ms_window_height = $(window).height();
	    ms_window_width = $(window).width();
	    ms_document_height = $(document).height();
	    ms_document_width = $(document).width();

	    // Keep track of bootstrap template size
	    var old_bootstrap_size = ms_current_bootstrap_size;
	    if($('#bootstrap_detector .visible-xs').is(':visible'))
	    {
	        ms_current_bootstrap_size = "xs";
	    }
	    // else if($('#bootstrap_detector .visible-ms').is(':visible'))
	    // {
	    //     ms_current_bootstrap_size = "ms";
	    // }
	    else if($('#bootstrap_detector .visible-sm').is(':visible'))
	    {
	        ms_current_bootstrap_size = "sm";
	    }
	    else if($('#bootstrap_detector .visible-md').is(':visible'))
	    {
	        ms_current_bootstrap_size = "md";
	    }
	    else if($('#bootstrap_detector .visible-lg').is(':visible'))
	    {
	        ms_current_bootstrap_size = "lg";
	    }

	    // Trigger a bootstrapResize?
	    if(old_bootstrap_size !== ms_current_bootstrap_size)
	    {
	        // Debug
	        if(ms_debug)
	        {
	            console.log('track_window_size: '+ms_current_bootstrap_size);
	        }

	        $(window).trigger('bootstrapResize');

	    }
	    return (old_bootstrap_size !== ms_current_bootstrap_size);
	}


});
