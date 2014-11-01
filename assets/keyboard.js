
$(document).ready(function(){

	(function($) {
	  $.fn.nodoubletapzoom = function() {
		  $(this).bind('touchstart', function preventZoom(e) {
			var t2 = e.timeStamp
			  , t1 = $(this).data('lastTouch') || t2
			  , dt = t2 - t1
			  , fingers = e.originalEvent.touches.length;
			$(this).data('lastTouch', t2);
			if (!dt || dt > 500 || fingers > 1) return; // not double-tap

			e.preventDefault(); // double tap - prevent the zoom
			// also synthesize click events we just swallowed up
			$(this).trigger('click').trigger('click');
		  });
	  };
	})(jQuery);

	//$("body").nodoubletapzoom();
	create_keyboard("jsKeyBoard");

});
var keyboardPreview;
var keyboard_layout =   {
							'alpha' : {
										'default': [
											'` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
											'{tab} q w e r t y u i o p [ ] \\',
											'a s d f g h j k l ; \' {enter}',
											'{shift} z x c v b n m , . / {shift}',
											'{accept} {space} {cancel}'
										],
										'shift': [
											'~ ! @ # $ % ^ & * ( ) _ + {bksp}',
											'{tab} Q W E R T Y U I O P { } |',
											'A S D F G H J K L : " {enter}',
											'{shift} Z X C V B N M < > ? {shift}',
											'{accept} {space} {cancel}'
										]
									}
						}
function create_keyboard(class_name){
	$("."+class_name).click(function(){
		if(typeof keyboardContainer == 'undefined'){
				//create a div to hold the keyboard
				keyboardContainer = $('<div/>', {
					id: 'keyboardContainer',
					css: {'display' : 'block'},
				}).appendTo('body');

				keyboardPreview = $('<div />', {
					id: 'keyboardPreview'
				}).appendTo(keyboardContainer);

				kb_load_keyboard_container("alpha");
				handle_onclick_events(class_name);
		} else {
			keyboardContainer.toggle();
		}
	})
}
function append_message(btn_message){
	$(keyboardPreview).append(btn_message);
}
function handle_onclick_events(class_name){
	$(".keyboardBtn").click(function(){
		selected_button = $(this).text();

		if(selected_button.length > 1) special_button_click(selected_button, class_name);
		else append_message(selected_button);
	});
}
function special_button_click(button, class_name){
	switch (button){
		case 'enter':
			return append_message("<br />");
			break;
		case 'tab':
			return append_message("\t");
			break;
		case 'space':
			return append_message(" ");
			break;
		case 'bksp':
			current_message = $(keyboardPreview).html();
			$(keyboardPreview).html(current_message.substring(0, current_message.length-1));;
			break;
		case 'shift':
			default_container.toggle();
			$(".btnshift").toggleClass("activated");
			shift_container.toggle();
			break;
		case 'accept':
			keyboardContainer.hide();
			$("."+class_name).html(keyboardPreview.html());
			keyboardPreview.html("");
			break;
		case 'cancel':
			keyboardContainer.hide();
			keyboardPreview.html("");
			break;
	}
}
function kb_load_keyboard_container(choosen_layout){
	//get the current keyboard layout
	current_layout = keyboard_layout[choosen_layout];
	//create the container of the default keyboard
	default_container = $('<div/>', {'class': 'default_container'}).appendTo(keyboardContainer);
	kb_loop_to_get_keys(current_layout['default'], default_container);

	//create container for the shift keyboard
	shift_container = $('<div/>', {
							'class': 'shift_container', 
							css : {'display': 'none'}
						}).appendTo(keyboardContainer);
	kb_loop_to_get_keys(current_layout['shift'], shift_container);

	set_keyboard_position();
	
}
function set_keyboard_position(){
	keyboardContainer.css("top",(parseInt($(window).height()) - parseInt(keyboardContainer.css("height")))/2);
	keyboardContainer.css("left",(parseInt($(window).width()) - parseInt(keyboardContainer.css("width")))/2);
}
function kb_loop_to_get_keys(data_to_get, div_to_append){
	//get the default keyboard data
	for(x in data_to_get){
		//split the rows into key
		row_keys = data_to_get[x].toString().split(" ");

		//create the container of the row
		keyboard_row = $('<div/>', {
						'class': 'keyboard_row',
					}).appendTo(div_to_append);

		for(key in row_keys){
			//prepare the keys to be inserted on the container
			kb_build_button(row_keys[key], kb_check_special_button(row_keys[key]));
		}
	}
}
function kb_build_button(button_name, is_special_button){
	//if itis a special button remove the {} and add it to the class name
	if(is_special_button){
		button_name = button_name.substring(1,button_name.length-1)
		button_class_name = "keyboardBtn btn"+button_name;
	} else {
		button_class_name = "keyboardBtn";
	}

	key_container = $('<button/>', {
			"role":"button", 
			"aria-disabled":"false" ,
			"tabindex":"-1" ,
			"class":"ui-keyboard-button ui-keyboard-96 ui-state-default ui-corner-all "+button_class_name ,
			"data-value":button_name ,
			"name":"96",
			"data-pos":"0,0",
			"title":""
		}).appendTo(keyboard_row);


	$('<span/>', {
			text: button_name
		}).appendTo(key_container);


}
function kb_check_special_button(button_name){
	//return true if its a special button
	special_char_pattern = /{[a-zA-Z]+}/
	return button_name.search(special_char_pattern) != -1;
}
