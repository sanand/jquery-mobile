/*
* jQuery Mobile Framework : "page" plugin
* Copyright (c) jQuery Project
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
(function($, undefined ) {

$.widget( "mobile.page", $.mobile.widget, {
	options: {
		backBtnText: "Back",
		addBackBtn: true,
		degradeInputs: {
			color: false,
			date: false,
			datetime: false,
			"datetime-local": false,
			email: false,
			month: false,
			number: false,
			range: "number",
			search: true,
			tel: false,
			time: false,
			url: false,
			week: false
		},
		keepNative: "[data-role='none'], .ui-nojs"
	},
	
	_create: function() {
		var $elem = this.element,
			o = this.options;	

		if ( this._trigger( "beforeCreate" ) === false ) {
			return;
		}
		
		//some of the form elements currently rely on the presence of ui-page and ui-content
		// classes so we'll handle page and content roles outside of the main role processing
		// loop below.
		$elem.find( "[data-role='page'], [data-role='content']" ).andSelf().each(function() {
			$(this).addClass( "ui-" + $(this).data( "role" ) );
		});
		
		$elem.find( "[data-role='nojs']" ).addClass( "ui-nojs" );

		this._enchanceControls();
		
		// pre-find data els
		var $dataEls = $elem.find( "[data-role]" ).andSelf().each(function() {
			var $this = $( this ),
				role = $this.data( "role" ),
				theme = $this.data( "theme" );
			
			//apply theming and markup modifications to page,header,content,footer
			if ( role === "header" || role === "footer" ) {
				$this.addClass( "ui-bar-" + (theme || $this.parent('[data-role=page]').data( "theme" ) || "a") );
				
				// add ARIA role
				$this.attr( "role", role === "header" ? "banner" : "contentinfo" );
				
				//right,left buttons
				var $headeranchors = $this.children( "a" ),
					leftbtn = $headeranchors.hasClass( "ui-btn-left" ),
					rightbtn = $headeranchors.hasClass( "ui-btn-right" );
				
				if ( !leftbtn ) {
					leftbtn = $headeranchors.eq( 0 ).not( ".ui-btn-right" ).addClass( "ui-btn-left" ).length;
				}

				if ( !rightbtn ) {
					rightbtn = $headeranchors.eq( 1 ).addClass( "ui-btn-right" ).length;
				}
				
				// auto-add back btn on pages beyond first view
				if ( o.addBackBtn && role === "header" &&
						($.mobile.urlStack.length > 1 || $(".ui-page").length > 1) &&
						!leftbtn && !$this.data( "noBackBtn" ) ) {

					$( "<a href='#' class='ui-btn-left' data-icon='arrow-l'>"+ o.backBtnText +"</a>" )
						.click(function() {
							history.back();
							return false;
						})
						.prependTo( $this );
				}
				
				//page title	
				$this.children( "h1, h2, h3, h4, h5, h6" )
					.addClass( "ui-title" )
					//regardless of h element number in src, it becomes h1 for the enhanced page
					.attr({ "tabindex": "0", "role": "heading", "aria-level": "1" });

			} else if ( role === "content" ) {
				if ( theme ) {
					$this.addClass( "ui-body-" + theme );
				}

				// add ARIA role
				$this.attr( "role", "main" );

			} else if ( role === "page" ) {
				$this.addClass( "ui-body-" + (theme || "c") );
			}
			
			switch(role) {
				case "header":
				case "footer":
				case "page":
				case "content":
					$this.addClass( "ui-" + role );
					break;
				case "collapsible":
				case "fieldcontain":
				case "navbar":
				case "listview":
				case "dialog":
					$this[ role ]();
					break;
			}
		});
		
		//links in bars, or those with data-role become buttons
		$elem.find( "[data-role='button'], .ui-bar a, .ui-header a, .ui-footer a" )
			.not( ".ui-btn" )
			.not(o.keepNative)
			.buttonMarkup();

		$elem	
			.find("[data-role='controlgroup']")
			.controlgroup();
		
		//links within content areas
		$elem.find( "a:not(.ui-btn):not(.ui-link-inherit)" )
			.not(o.keepNative)
			.addClass( "ui-link" );	
		
		//fix toolbars
		$elem.fixHeaderFooter();
	},
	
	_enchanceControls: function() {
		var o = this.options;
			
		// degrade inputs to avoid poorly implemented native functionality
		this.element.find( "input" ).not(o.keepNative).each(function() {
			var type = this.getAttribute( "type" ),
				optType = o.degradeInputs[ type ] || "text";
			
			if ( o.degradeInputs[ type ] ) {
				$( this ).replaceWith(
					$( "<div>" ).html( $(this).clone() ).html()
						.replace( /type="([a-zA-Z]+)"/, "type="+ optType +" data-type='$1'" ) );
			}
		});
		
		// enchance form controls
		this.element
			.find( "[type='radio'], [type='checkbox']" )
			.not(o.keepNative)
			.checkboxradio();

		this.element
			.find( "button, [type='button'], [type='submit'], [type='reset'], [type='image']" )
			.not(o.keepNative)
			.button();

		this.element
			.find( "input, textarea" )
			.not( "[type='radio'], [type='checkbox'], button, [type='button'], [type='submit'], [type='reset'], [type='image']" )
			.not(o.keepNative)
			.textinput();

		this.element
			.find( "input, select" )
			.not(o.keepNative)
			.filter( "[data-role='slider'], [data-type='range']" )
			.slider();

		this.element
			.find( "select:not([data-role='slider'])" )
			.not(o.keepNative)
			.selectmenu();
	}
});

})( jQuery );
