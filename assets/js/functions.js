/*
 * Template functions file.
 *
 */
jQuery( function() { "use strict";

	var screen_has_mouse = false,
		$body = jQuery( "body" ),
		$logo = jQuery( "#identity" ),
		$languages = jQuery( "#identity .languages" ),
		$social_links = jQuery( "#social-profiles" ),
		$menu = jQuery( "#site-menu" ),
		$content_wrap = jQuery( ".content-wrap" ),
		$hero_media = jQuery( ".hero-media" ),
		$hero_carousel = jQuery( ".hero-media .owl-carousel" ),
		win_width = jQuery( window ).width();

	// Simple way of determining if user is using a mouse device.
	function themeMouseMove() {
		screen_has_mouse = true;
	}
	function themeTouchStart() {
		jQuery( window ).off( "mousemove.leluxe" );
		screen_has_mouse = false;
		setTimeout(function() {
			jQuery( window ).on( "mousemove.leluxe", themeMouseMove );
		}, 250);
	}
	if ( ! navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ) {
		jQuery( window ).on( "touchstart.leluxe", themeTouchStart ).on( "mousemove.leluxe", themeMouseMove );
		if ( window.navigator.msPointerEnabled ) {
			document.addEventListener( "MSPointerDown", themeTouchStart, false );
		}
	}

	// Initialize custom scrollbars
	if ( jQuery.fn.overlayScrollbars ) {
		jQuery( "body, .additional-menu-content" ).each( function() {
			jQuery( this ).overlayScrollbars({
				nativeScrollbarsOverlaid: {
					initialize : false
				},
				overflowBehavior: {
					x : "hidden"
				},
				scrollbars: {
					autoHide: "scroll"
				}
			});
		});
	}

	// Handle both mouse hover and touch events for traditional menu + mobile hamburger.
	jQuery( ".site-menu-toggle" ).on( "click.leluxe", function( e ) {
		$body.toggleClass( "mobile-menu-opened" );
		jQuery( window ).resize();
		if ( ! $body.hasClass( "mobile-menu-opened" ) ) {
			$menu.removeAttr( "style" );
			$social_links.removeAttr( "style" );
		}
		e.preventDefault();
	});

	jQuery( "#site-menu .menu-expand" ).on( "click.leluxe", function ( e ) {
		var $parent = jQuery( this ).parent();
		if ( jQuery( ".site-menu-toggle" ).is( ":visible" ) ) {
			$parent.toggleClass( "collapse" );
		}
		e.preventDefault();
	});
	jQuery( "#site-menu .current-menu-parent" ).addClass( "collapse" );

	jQuery( document ).on({
		mouseenter: function() {
			if ( screen_has_mouse ) {
				jQuery( this ).addClass( "hover" );
			}
		},
		mouseleave: function() {
			if ( screen_has_mouse ) {
				jQuery( this ).removeClass( "hover" );
			}
		}
	}, "#site-menu li" );

	if ( jQuery( "html" ).hasClass( "touchevents" ) ) {
		jQuery( "#site-menu li.menu-item-has-children > a:not(.menu-expand)" ).on( "click.leluxe", function (e) {
			if ( ! screen_has_mouse && ! window.navigator.msPointerEnabled && ! jQuery( ".site-menu-toggle" ).is( ":visible" ) ) {
				var $parent = jQuery( this ).parent();
				if ( ! $parent.parents( ".hover" ).length ) {
					jQuery( "#site-menu li.menu-item-has-children" ).not( $parent ).removeClass( "hover" );
				}
				$parent.toggleClass( "hover" );
				e.preventDefault();
			}
		});
	} else {
		// Toggle visibility of dropdowns on keyboard focus events.
		jQuery( "#site-menu li > a:not(.menu-expand), #top .site-title a, #social-links-menu a:first" ).on( "focus.leluxe blur.leluxe", function(e) {
			if ( screen_has_mouse && ! jQuery( "#top .site-menu-toggle" ).is( ":visible" ) ) {
				var $parent = jQuery( this ).parent();
				if ( ! $parent.parents( ".hover" ).length ) {
					jQuery( "#site-menu .menu-item-has-children.hover" ).not( $parent ).removeClass( "hover" );
				}
				if ( $parent.hasClass( "menu-item-has-children" ) ) {
					$parent.addClass( "hover" );
				}
				e.preventDefault();
			}
		});
	}

	// Handle tab navigation with hash links.
	jQuery( ".tabs a" ).on( "click.leluxe", function (e) {
		if ( jQuery( this ).hasClass( "tab-link-active" ) ) {
			e.preventDefault();
			return;
		}
		var $target = jQuery( jQuery( this ).attr( "href" ) );
		$target.attr( "data-id", $target.attr( "id" ) ).attr( "id", "" );
	});

	jQuery( window ).on( "hashchange", function() {
		if ( ! window.location.hash ) {
			return;
		}
		var $active_tab_content = jQuery( '.tab-content[data-id="' + window.location.hash.substring( 1 ) + '"]' );
		if ( $active_tab_content.length == 0 ) {
			return;
		}
		$active_tab_content.attr( "id", $active_tab_content.data( "id" ) );
		var $tab_container = $active_tab_content.parent();
		$tab_container.find( ".tab-content:not(#" + $active_tab_content.data( "id" ) + ")" ).removeClass( "tab-active" );
		$active_tab_content.addClass( "tab-active" );
		$tab_container.find( ".tabs a" ).removeClass( "tab-link-active" ).filter( '[href="' + window.location.hash + '"]' ).addClass( "tab-link-active" );
	});

	if ( window.location.hash ) {
		var $active_tab = jQuery( '.tabs a[href="' + window.location.hash + '"]' ), offset_correction;
		if ( $active_tab.length > 0 ) {
			$active_tab.trigger( "click" );
			jQuery( window ).trigger( "hashchange" );
			setTimeout( function() {
				offset_correction = $menu.outerHeight();
				window.scrollTo({
					top: $active_tab.parents( ".tab-container" ).offset().top - offset_correction,
					behavior: "instant"
				});
			}, 1);
		} else {
			if ( win_width >= 1200 ) {
				offset_correction = $menu.outerHeight() + 60;
			} else {
				offset_correction = 60;
			}
			jQuery( "body" ).animate({
				"scrollTop": jQuery( window.location.hash ).offset().top - offset_correction,
				"scrollLeft": 0
			}, {
				duration: 300
			});
		}
	}
	jQuery( ".tab-container" ).addClass( "tabs-loaded" );

	// Handle sharing widget
	jQuery( ".share-widget-container > a" ).on( "click.leluxe", function (e) {
		var $parent = jQuery( this ).parent();
		$parent.toggleClass( "show-dropdown" );
		e.preventDefault();
	});

	jQuery( document ).on( "click.leluxe", function ( e ) {
		if ( jQuery( e.target ).parents( ".share-widget-container" ).length > 0 || jQuery( e.target ).hasClass( "share-widget-container" ) ) {
			return;
		}
		jQuery( ".share-widget-container.show-dropdown" ).removeClass( "show-dropdown" );
	});

	// Handle custom booking controls.
	jQuery( ".booking-form .field > a" ).on( "click.leluxe", function (e) {
		var $field = jQuery( this ).parent();
		$field.toggleClass( "show-dropdown" ).siblings().removeClass( "show-dropdown" );
		e.preventDefault();
	});
	jQuery( ".booking-form .dropdown .values a" ).on( "click.leluxe", function (e) {
		jQuery( this ).parent().addClass( "selected" ).siblings().removeClass( "selected" );
		var $field = jQuery( this ).parents( ".field" );
		jQuery( "input[type=hidden]", $field ).val( jQuery( this ).data( "value" ) );
		jQuery( "span.field-value", $field ).html( jQuery( this ).html() );
		e.preventDefault();
	});
	jQuery( document ).on( "click.leluxe", function ( e ) {
		if ( jQuery( e.target ).parents( ".Zebra_DatePicker" ).length > 0 || jQuery( e.target ).hasClass( "Zebra_DatePicker" ) || ( ( jQuery( e.target ).parent( "a.mdi" ).length > 0 || jQuery( e.target ).is( "a.mdi" ) ) && jQuery( e.target ).parents( ".booking-form .field" ).length > 0 ) ) {
			return;
		}
		jQuery( ".booking-form .field" ).removeClass( "show-dropdown" );
	});

	if ( jQuery.fn.Zebra_DatePicker ) {
		jQuery.fn.Zebra_DatePicker.defaults = {
			format: 'Y-m-d',
			first_day_of_week: 1,
			days: [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
			months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
			header_captions: {
				days: 'F Y',
				months: 'Y',
				years: 'Y1 - Y2'
			},
			navigation: [ '<em class="mdi mdi-arrow-left"></em>','<em class="mdi mdi-arrow-right"></em>', '<em class="mdi mdi-arrow-up"></em>', '<em class="mdi mdi-arrow-down"></em>' ],
			disable_time_picker: false,
			show_icon: false,
			readonly_element: false,
			show_clear_date: false,
			show_select_today: false
		};
		var onSelectDate = function ( format, date, dateObj ) {
			var $field = jQuery( this ). parents( ".field" );
			$field.removeClass( "show-dropdown" );
			jQuery( ".short", $field ).html( dateObj.getDate() + " " + jQuery.fn.Zebra_DatePicker.defaults.months[dateObj.getMonth()].slice(0, 3) + " " + ( dateObj.getYear() + "" ).slice(-2) );
			jQuery( ".long", $field ).html( dateObj.getDate() + " " + jQuery.fn.Zebra_DatePicker.defaults.months[dateObj.getMonth()] + " " + dateObj.getFullYear() );
			if ( $field.hasClass( "field-checkin" ) && win_width >= 568 ) {
				jQuery( ".booking-form .field-date.field-checkout" ).addClass( "show-dropdown" );
			}
		};
		jQuery( ".booking-form .field-date.field-checkin input" ).Zebra_DatePicker({
			always_visible: jQuery( ".booking-form .field-date.field-checkin" ),
			direction: true,
			pair: jQuery( ".booking-form .field-date.field-checkout input" ),
			onSelect: onSelectDate
		});
		jQuery( ".booking-form .field-date.field-checkout input" ).Zebra_DatePicker({
			always_visible: jQuery( ".booking-form .field-date.field-checkout" ),
			direction: 1,
			onSelect: onSelectDate
		});

		jQuery( ".booking-form-full .field-checkin .custom-date-field" ).Zebra_DatePicker({
			container: jQuery( ".booking-form-full .field-checkin" ),
			direction: true,
			pair: jQuery( ".booking-form-full .field-checkout .custom-date-field" ),
			open_on_focus: true
		});

		jQuery( ".booking-form-full .field-checkout .custom-date-field" ).Zebra_DatePicker({
			container: jQuery( ".booking-form-full .field-checkout" ),
			direction: 1,
			open_on_focus: true
		});
	}

	if ( jQuery.fn.owlCarousel ) {
		var multiple_items = jQuery( ".item", $hero_carousel ).length > 1,
			prev_video_active;
		if ( ! multiple_items ) {
			jQuery( ".booking-form" ).addClass( "full-width" );
		}
		var onTranslate = function( event ) {
				jQuery( "video", event.target ).each( function() {
					this.pause();
				});
			},
			onTranslated = function( event ) {
				jQuery( ".owl-item.active video", event.target ).each( function() {
					this.play();
				});
				if ( jQuery( ".owl-item.active .light-hero-colors", event.target ).length > 0 ) {
					$body.addClass( "light-hero-colors" );
				} else {
					$body.removeClass( "light-hero-colors" );
				}
			};
		$hero_carousel.owlCarousel({
			items: 1,
			loop: multiple_items,
			mouseDrag: multiple_items,
			touchDrag: multiple_items,
			nav: true,
			navElement: 'a href="#"',
			navText: [ '<span class="mdi mdi-arrow-left"></span>','<span class="mdi mdi-arrow-right"></span>' ],
			dots: false,
			lazyLoad: true,
			lazyLoadEager: 1,
			video: true,
			responsiveRefreshRate: 0,
			onTranslate: onTranslate,
			onTranslated: onTranslated,
			onLoadedLazy: onTranslated,
			onInitialized: function( event ) {
				if ( multiple_items ) {
					$body.addClass( "hero-has-nav" );
				}
				jQuery( '<div class="owl-expand"><a href="#"><span class="mdi"></span></a></div>' ).insertAfter( jQuery( ".owl-nav", event.target ) ).on( "click.leluxe", function ( e ) {
					e.preventDefault();
					if ( $body.hasClass( "expanded-hero-start" ) ) {
						return;
					}

					var initialAttribs, finalAttribs, completed = 0, duration = $hero_carousel.data( "expand-duration" ), $hero_collection = $hero_media.add( $hero_carousel );
					if ( isNaN( duration ) ) {
						duration = 1000;
					}

					$body.toggleClass( "expanded-hero" ).addClass( "expanded-hero-start" ).removeClass( "expanded-hero-completed" );
					if ( $body.hasClass( "expanded-hero" ) ) {
						initialAttribs = {
							"right": $hero_media.css( "right" ),
							"textIndent": 0
						};
						finalAttribs = {
							"right": 0,
							"textIndent": 100
						};
					} else {
						initialAttribs = {
							"textIndent": 100,
							"right": 0
						};
						$hero_media.css( "right", "" );
						finalAttribs = {
							"textIndent": 0,
							"right": $hero_media.css( "right" )
						};
						$hero_media.css( "right", "0" );
					}

					jQuery( ".hero-media .mdi-spin" ).css( initialAttribs ).animate( finalAttribs,
					{
						duration: duration,
						easing: "easeOutCubic",
						step: function ( now, fx ) {
							if ( "right" == fx.prop ) {
								$hero_collection.css( "right", now );
								$hero_carousel.data( "owl.carousel" ).refresh( true );
							} else {
								$content_wrap.css({
									"-webkit-transform": "translate(" + now + "%)",
									"-ms-transform"    : "translate(" + now + "%)",
									"transform"        : "translate(" + now + "%)",
								});
							}
						},
						complete: function() {
							completed++;
							if ( completed < 1) {
								return;
							}
							$body.addClass( "expanded-hero-completed" ).removeClass( "expanded-hero-start" );
							// clear JS set properties, as they will be set in the CSS as well by the "expanded-hero-completed" selector
							$hero_media.add( $hero_carousel ).add( $content_wrap ).removeAttr( "style" );
						}
					});

					if ( ! $body.hasClass( "has-booking" ) ) {
						var $nav_buttons = jQuery( this ).add( jQuery( this ).prev( ".owl-nav" ) );
						$nav_buttons.animate({
							"bottom": ( - jQuery( this ).outerHeight() )
						},
						{
							duration: duration / 2,
							complete: function() {
								var $nav = jQuery( ".owl-nav", $hero_carousel ),
									$expand = jQuery( ".owl-expand", $hero_carousel ),
									right_expand;
								if ( $body.hasClass( "expanded-hero" ) ) {
									$nav.css({
										"right": 0
									});
									if ( $nav.hasClass( "disabled" ) ) {
										right_expand = 0;
									} else {
										right_expand = $nav.outerWidth();
									}
									$expand.css({
										"right": right_expand,
										"margin-right": 0
									});
								} else {
									jQuery( this ).css({
										"right": "",
										"margin-right": ""
									});
								}
								jQuery( this ).animate({
									"bottom": 0
								},
								{
									duration: duration / 2,
									complete: function() {
										if ( ! $body.hasClass( "expanded-hero" ) ) {
											jQuery( this ).removeAttr( "style" );
										}
									}
								});
							}
						});
					}
				});

				jQuery( ".owl-stage", event.target ).on( "dblclick.leluxe", function ( e ) {
					$hero_carousel.find( ".owl-expand:visible" ).trigger( "click.leluxe" );
				});

				var tapedTwice = false;
				jQuery( ".owl-stage", event.target ).on( "touchstart.leluxe", function ( e ) {
					if ( ! tapedTwice ) {
						tapedTwice = true;
						setTimeout( function() {
							tapedTwice = false;
						}, 300 );
					} else {
						$hero_carousel.find( ".owl-expand:visible" ).trigger( "click.leluxe" );
					}
				});

				setTimeout(function() {
					jQuery( ".mdi-loading", $hero_media).addClass( "finished" );
				}, 1000);
			}
		});
	}

	if ( jQuery.fancybox ) {
		jQuery.fancybox.defaults.hideScrollbar = false;
		jQuery.fancybox.defaults.backFocus     = false;
	}

	jQuery( ".menu-overlay" ).on( "click.leluxe", function (e) {
		if ( e.offsetX < 0 && $body.hasClass( "mobile-menu-opened" ) ) {
			jQuery( ".site-menu-toggle" ).trigger( "click.leluxe" );
		}
	});

	jQuery( window ).on( "resize", function() {
		win_width = jQuery( window ).width();

		if ( $body.hasClass( "mobile-menu-opened" ) ) {
			var menu_pos = 0;
			if ( win_width < 767 ) {
				$menu.css( {
					top: $logo.position().top * 2 + $logo.outerHeight()
				} );
				$social_links.css( {
					top: $languages.offset().top
				} );
			} else {
				$menu.removeAttr( "style" );
				$social_links.removeAttr( "style" );
			}
		} else {
			if ( $body.hasClass( "full-content" ) ) {
				$content_wrap.css( "padding-top", "" );
				var contentTop = parseInt( $content_wrap.css( "padding-top" ), 10 ), logoHeight = jQuery( ".logo", $logo ).outerHeight() + $logo.offset().top * 2;
				if ( logoHeight > contentTop ) {
					$content_wrap.css( "padding-top", logoHeight );
				}
			}
		}
	});

	if ( $body.hasClass( "full-content" ) ) {
		jQuery( window ).resize();
	}
});

jQuery.extend( jQuery.easing, {
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	}
});
