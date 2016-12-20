var globalMapObj = {};
function initMap() {
	if (navigator.geolocation) {
		// Step 1: Get User's current coordinates
		navigator.geolocation.getCurrentPosition(showInitMap);
	} else {
		x.innerHTML = "Geolocation is not supported by this browser.";
	}
  }
function showInitMap(position) {
	// Step 1: Get User's current coordinates
	var initLat=position.coords.latitude;
	var initLong=position.coords.longitude;
	console.log('Initial lat:'+initLat+' lng:'+initLong);
	globalMapObj.latLngObj = {lat: initLat, lng: initLong};

	globalMapObj.map = new google.maps.Map(document.getElementById('map_canvas'), {
	  zoom: 15,
	  center: globalMapObj.latLngObj,
	  disableDefaultUI: true,
	  clickableIcons: false
	});

	// Display From and Destination inputBox within the Map
	var inputDiv1 = document.getElementById('inputDiv1');
	globalMapObj.map.controls[google.maps.ControlPosition.TOP_CENTER].push(inputDiv1);
	var inputDiv2 = document.getElementById('inputDiv2');
	globalMapObj.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(inputDiv2);
	
	//var inputDiv3 = document.getElementById('inputDiv3');
	//globalMapObj.map.controls[google.maps.ControlPosition.TOP_CENTER].push(inputDiv3);
	
	// Display a centerMarker in Map, which stays in Map center even if User drags Map
	// map.Marker class will not have such a feature
	//$('<div/>').addClass('centerMarker').appendTo(globalMapObj.map.getDiv());
	var initMarker = new google.maps.Marker({
		position: globalMapObj.map.getCenter(),
		map: globalMapObj.map,
		icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
	});
	globalMapObj.initMarker=initMarker;
	// Set map's center to be global latLng, even if User zooms the Map
	globalMapObj.map.addListener('zoom_changed',function() {
		globalMapObj.map.setCenter(globalMapObj.latLngObj);
	});
	globalMapObj.dragListener = globalMapObj.map.addListener('drag',function() {
		initMarker.setPosition(globalMapObj.map.getCenter());
	});
	// Update global latLng, when user changes map's center by dragging the map
	globalMapObj.dragendListener = globalMapObj.map.addListener('dragend',function() {
		globalMapObj.latLngObj = globalMapObj.map.getCenter();
		// This method will find place name for current latLng and set in From inputBox
		geocodeLatLng(globalMapObj.map, globalMapObj.latLngObj, ['fromAddressInit','fromAddress']);
	});
	// This method will attach AutoComplete feature to From & Dest inputBoxes
	autoCompletePlacesFrom(globalMapObj.map);
	autoCompletePlacesDest(globalMapObj.map);
	// This method will find place name for current latLng and set in From inputBox
	geocodeLatLng(globalMapObj.map, globalMapObj.latLngObj, ['fromAddressInit','fromAddress']);
}
	
function geocodeLatLng(map, latLngObj, elementIdArray) {
	// Step 2:	Call Reverse Geocode API, using current latLng, fetch Place
	var geocoder = new google.maps.Geocoder;
	//var infowindow = new google.maps.InfoWindow;
	geocoder.geocode({'location': latLngObj}, function(results, status) {
	  if (status === 'OK') {
		// Here we are fetching the City and State of the User
		if (results[0]) {
			/*var city="";
			var state="";
			var addressParts = results[0].address_components;
			addressParts.forEach( function (addressPart){
				if(addressPart.types[0]==="locality" && addressPart.types[1]==="political")
					city=addressPart.long_name;
				if(addressPart.types[0]==="administrative_area_level_1" && addressPart.types[1]==="political")
					state=addressPart.long_name;
			});
			console.log(city + '  ' +state);
			document.getElementById("fromAddress").value=city + '  ' +state;
			map.setZoom(12);
			setTimeout(function () {
				smoothZoom (map, 16, map.getZoom());
				document.getElementById(elementId).value=results[0].formatted_address;
			}, 1500);
			*/
			elementIdArray.forEach(function(elementId){
				document.getElementById(elementId).value=results[0].formatted_address;
			});
		  /*var marker = new google.maps.Marker({
			position: latLngObj,
			map: map
		  });*/
		  //infowindow.setContent(results[1].formatted_address);
		  //infowindow.open(map, marker);
		} else {
		  window.alert('No results found');
		}
	  } else {
		window.alert('Geocoder failed due to: ' + status);
	  }
	});
}
function autoCompletePlacesFrom(map){
	var fromAddress = document.getElementById('fromAddress');
	var autoCompleteOptions = {
	  componentRestrictions: {country: 'in'}
	};
	var autocompleteFrom = new google.maps.places.Autocomplete(fromAddress, autoCompleteOptions);
	autocompleteFrom.bindTo('bounds', map);

	//var infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
	  map: map,
	  anchorPoint: new google.maps.Point(0, -29)
	});

	autocompleteFrom.addListener('place_changed', function() {

		// Closing original marker, as user has seleted Autocomplete marker
		globalMapObj.initMarker.setMap(null);
	  //infowindow.close();
	  marker.setVisible(false);
	  if(globalMapObj.fromMarker)
		globalMapObj.fromMarker.setMap(null);

	  var place = autocompleteFrom.getPlace();
	  if (!place.geometry) {
		// User entered the name of a Place that was not suggested and
		// pressed the Enter key, or the Place Details request failed.
		window.alert("No details available for input: '" + place.name + "'");
		return;
	  }

	  // If the place has a geometry, then present it on a map.
	  /*if (place.geometry.viewport) {
		console.log('AutoComplete Place\'s Viewport');
		map.fitBounds(place.geometry.viewport);
	  } else {
		console.log('AutoComplete Place\'s Location');
		map.setCenter(place.geometry.location);
		map.setZoom(16);
	  }*/
	 // map.setCenter(place.geometry.location);
	  
	  marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
	  marker.setPosition(place.geometry.location);
	  marker.setVisible(true);
	  marker.addListener('click', function() {
		  pinMarker();
	  });
	  unpinMarker(marker);
	  
	  globalMapObj.latLngObj = place.geometry.location;
	  globalMapObj.fromMarker=marker;
	  google.maps.event.removeListener(globalMapObj.dragendListener);
	  globalMapObj.dragendListener = globalMapObj.map.addListener('dragend',function() {
		globalMapObj.latLngObj = globalMapObj.map.getCenter();
		geocodeLatLng(globalMapObj.map, globalMapObj.latLngObj, ['fromAddressInit','fromAddress']);
	  });
	  globalMapObj.fromAddressText=$('input#fromAddress').val();
	  /*
	  var address = '';
	  if (place.address_components) {
		address = [
		  (place.address_components[0] && place.address_components[0].short_name || ''),
		  (place.address_components[1] && place.address_components[1].short_name || ''),
		  (place.address_components[2] && place.address_components[2].short_name || '')
		].join(' ');
	  }*/
	  setMapBounds();
	  //infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
	  //infowindow.open(map, marker);
	  hideLocSelectionPartial('fromAddressInit');
	});
}
function autoCompletePlacesDest(map){
	var destAddress = document.getElementById('destAddress');
	var autoCompleteOptions = {
	  componentRestrictions: {country: 'in'}
	};
	var autocompleteDest = new google.maps.places.Autocomplete(destAddress, autoCompleteOptions);
	autocompleteDest.bindTo('bounds', map);

	
	var marker = new google.maps.Marker({
	  map: map,
	  anchorPoint: new google.maps.Point(0, -29)
	});

	autocompleteDest.addListener('place_changed', function() {

	  marker.setVisible(false);
	  if(globalMapObj.destMarker)
		globalMapObj.destMarker.setMap(null);
	  var place = autocompleteDest.getPlace();
	  if (!place.geometry) {
		// User entered the name of a Place that was not suggested and
		// pressed the Enter key, or the Place Details request failed.
		window.alert("No details available for input: '" + place.name + "'");
		return;
	  }

	  // If the place has a geometry, then present it on a map.
	 /* if (place.geometry.viewport) {
		console.log('AutoComplete Place\'s Viewport');
		map.fitBounds(place.geometry.viewport);
		map.setCenter(place.geometry.location);
	  } else { */
		console.log('AutoComplete Place\'s Location');
		//map.setCenter(place.geometry.location);
		//map.setZoom(13);
	  //}
	  marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
	  marker.setPosition(place.geometry.location);
	  marker.setVisible(true);
	  marker.addListener('click', function() {
		  pinMarker();
	  });
	  unpinMarker(marker);
	  
	  globalMapObj.latLngObj = place.geometry.location;
	  globalMapObj.destMarker=marker;

	  google.maps.event.removeListener(globalMapObj.dragendListener);
	  globalMapObj.dragendListener = globalMapObj.map.addListener('dragend',function() {
		globalMapObj.latLngObj = globalMapObj.map.getCenter();
		geocodeLatLng(globalMapObj.map, globalMapObj.latLngObj, ['destAddressInit','destAddress']);
	  });
	  var address = '';
	  if (place.address_components) {
		address = [
		  (place.address_components[0] && place.address_components[0].short_name || ''),
		  (place.address_components[1] && place.address_components[1].short_name || ''),
		  (place.address_components[2] && place.address_components[2].short_name || '')
		].join(' ');
	  }
	  setMapBounds();
	  //$('input#destAddressInit').val(address); // Google places doesn't give Places name appropriate compared to Reverse Geocode API, hence commenting this line
	  geocodeLatLng(globalMapObj.map, globalMapObj.latLngObj, ['destAddress','destAddressInit']);
	  globalMapObj.destAddressText=$('input#destAddress').val();
	  $('input#destAddressInit').val($('input#destAddress').val());
	  hideLocSelectionPartial('destAddressInit');
	  
	  var infowindow = new google.maps.InfoWindow();
	  infowindow.setContent('Click to pin Marker');
	  infowindow.open(map, marker);
	  setTimeout(function(){
		infowindow.close();
	  }, 3000);
	  
	});
}
function pinMarker(){
	google.maps.event.removeListener(globalMapObj.dragListener);
	google.maps.event.removeListener(globalMapObj.dragendListener);
}
function unpinMarker(marker){
	google.maps.event.removeListener(globalMapObj.dragListener);
	globalMapObj.dragListener = globalMapObj.map.addListener('drag',function() {
		marker.setPosition(globalMapObj.map.getCenter());
	});
}
function setMapBounds(){
	var bounds = new google.maps.LatLngBounds();
	if(globalMapObj.fromMarker){
		console.log('from:'+globalMapObj.fromMarker.getPosition());
		bounds.extend(globalMapObj.fromMarker.getPosition());
	}
	if(globalMapObj.destMarker){
		console.log('dest:'+globalMapObj.destMarker.getPosition());
		bounds.extend(globalMapObj.destMarker.getPosition());
	}
	globalMapObj.map.fitBounds(bounds);
	// Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
	/*
	var boundsListener = google.maps.event.addListener((globalMapObj.map), 'bounds_changed', 	function(event) {
			this.setZoom(15);
			google.maps.event.removeListener(boundsListener);
		});
	*/
}
/*function smoothZoom (map, max, cnt) {
	if (cnt > max) {
		return;
	}
	else {
		z = google.maps.event.addListener(map, 'zoom_changed', function(event){
			google.maps.event.removeListener(z);
			smoothZoom(map, max, cnt + 1);
		});
		setTimeout(function(){
			map.setZoom(cnt)
		}, 40); // 40ms might not work well on all systems
	}
}*/

var $ = jQuery;
$(document).ready(function() {
	var monthNames = [
	  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var today = new Date();
	var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
	console.log('Today ' + monthNames[today.getMonth()] + ' ' + today.getDate());
	$('select#dateselector').find('option[value="today"]').text('Today ' + monthNames[today.getMonth()] + ' ' + today.getDate());
	$('select#dateselector').find('option[value="tomorrow"]').text('Tomorrow ' + monthNames[tomorrow.getMonth()] + ' ' + tomorrow.getDate());
	$('select#dateselector').niceSelect();
});

$(function() {
	$( "#time-slider" ).slider({
	  range: true,
	  min: 1,
	  max: 24,
	  values: [ 5, 22 ],
	  slide: function( event, ui ) {
		$( "#timeRange" ).html(formatTo12hour(ui.values[ 0 ]) + " - " + formatTo12hour(ui.values[ 1 ]) );
		//$( "#amount1" ).val(ui.values[ 0 ]);
		//$( "#amount2" ).val(ui.values[ 1 ]);
	  }
	});
	$( "#timeRange" ).html(formatTo12hour($( "#time-slider" ).slider( "values", 0 )) +
	 " - " + formatTo12hour($( "#time-slider" ).slider( "values", 1 )) );
});
function formatTo12hour(val){
	if(val<1 || val>24)
		return null;
	if(val<12 && val>0)
		return val + "am";
	if(val===12)
		return val + "pm";
	if(val===24)
		return 12 + "am";
	if(val>12 && val<24)
		return val-12 + "pm";
}
$(document).ready(function(){
	$('div.delivery-type').click(function () {
		if($('input#fromAddressInit').hasClass('controlDisabled')){
			$('input#fromAddressInit').removeClass('controlDisabled');
			$('input#fromAddressInit').removeAttr("disabled");
		}
		if($('input#destAddressInit').hasClass('controlDisabled')){
			$('input#destAddressInit').removeClass('controlDisabled');
			$('input#destAddressInit').removeAttr("disabled");
		}
	});
	$('div.delivery-type input').change(function() {
		if(this.checked) {
			$('div.delivery-type input').prop('checked', false);
			this.checked = true;	// Here Unchecked box is Checked
			
			// Below we are making Input boxes blank if InputBox is Enabled and Delivery Type is changed
			$('input#fromAddressInit').val('');
			$('input#destAddressInit').val('');
			globalMapObj.fromAddressText=null;
			globalMapObj.destAddressText=null;
		}else{
			this.checked = true;	// Once checked, user not allowed to uncheck
		}
	});
});

function showLocSelectionPartial(caller) {
	if(caller=='fromAddressInit' && $('input#fromAddressInit').hasClass('controlDisabled'))
		return;
	if(caller=='destAddressInit' && $('input#destAddressInit').hasClass('controlDisabled'))
		return;
	$('div#inputDiv3_2').load('Landmark-partial.html');
	$('div#inputDiv3').show();
	$('div#inputDiv1').hide();
	if(caller=='fromAddressInit'){
		$('input#destAddress').hide();
		$('input#fromAddress').show();
	}
	else if(caller=='destAddressInit'){
		$('input#fromAddress').hide();
		$('input#destAddress').show();
	}
	var poppedDiv = globalMapObj.map.controls[google.maps.ControlPosition.TOP_CENTER].pop();
	var divTemp_inputDiv1 = document.createElement("div");
	divTemp_inputDiv1.innerHTML = poppedDiv.innerHTML;
	divTemp_inputDiv1.id='inputDiv1';
	divTemp_inputDiv1.className=poppedDiv.className;
	var placeholderDiv = document.getElementById('placeholderForMapPopDivs');
	placeholderDiv.appendChild(divTemp_inputDiv1);
	
	var inputDiv3 = document.getElementById('inputDiv3');
	globalMapObj.map.controls[google.maps.ControlPosition.TOP_CENTER].push(inputDiv3);

	// Below will make From Inputbox text as Selected
	$('input#fromAddress').focus(function() {
		console.log('focussed now');
		$(this).select();
	});
	// Below will make From Inputbox text as Selected
	$('input#fromAddress').on('mousedown.selectOnFocus', function() {
		if (!($(this).is(':focus'))) {
			$(this).focus();
			$(this).one('mouseup.selectOnFocus', function(up) {
				up.preventDefault();
			});
		}
	});
	// Below will make Dest Inputbox text as Selected
	$('input#destAddress').focus(function() {
		$(this).select();
	});
	// Below will make Dest Inputbox text as Selected
	$('input#destAddress').on('mousedown.selectOnFocus', function() {
		if (!($(this).is(':focus'))) {
			$(this).focus();
			$(this).one('mouseup.selectOnFocus', function(up) {
				up.preventDefault();
			});
		}
	});
	// This method will attach AutoComplete feature to From & Dest inputBoxes
	if(caller=='fromAddressInit'){
		autoCompletePlacesFrom(globalMapObj.map);
		geocodeLatLng(globalMapObj.map, globalMapObj.latLngObj, ['fromAddressInit','fromAddress']);
		focusBox(caller);
	}
	else if(caller=='destAddressInit'){
		autoCompletePlacesDest(globalMapObj.map);
		focusBox(caller);
	}
}
// Below function to give functionality to Clear (X) mark in Input box
function tog(v){return v?'addClass':'removeClass';} 
$(document).on('input', '.clearableInput', function(){
	$(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function( e ){
	$(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
}).on('touchstart click', '.onX', function( ev ){
	ev.preventDefault();
	$(this).removeClass('x onX').val('').change();
});
function focusBox(caller) {
	setTimeout(function () {
		if(caller=='fromAddressInit'){
			$('input#fromAddress').focus();
			$('.clearableInput').trigger("input");	// This will put Clear (X) mark in Input box having existing values
		}
		else if(caller=='destAddressInit'){
			$('input#destAddress').focus();
			$('.clearableInput').trigger("input");	// This will put Clear (X) mark in Input box having existing values
		}
	}, 200);
}
function hideLocSelectionPartial(caller) {
	$('div#inputDiv3').hide();
	$('div#inputDiv1').show();
	//if(caller=='fromAddressInit')
	$('input#fromAddressInit').val(globalMapObj.fromAddressText);
	$('input#destAddressInit').val(globalMapObj.destAddressText);
	
	var poppedDiv = globalMapObj.map.controls[google.maps.ControlPosition.TOP_CENTER].pop();
	var divTemp_inputDiv3 = document.createElement("div");
	divTemp_inputDiv3.innerHTML = poppedDiv.innerHTML;
	divTemp_inputDiv3.id='inputDiv3';
	divTemp_inputDiv3.className=poppedDiv.className;
	var placeholderDiv = document.getElementById('placeholderForMapPopDivs');
	placeholderDiv.appendChild(divTemp_inputDiv3);

	var inputDiv1 = document.getElementById('inputDiv1');
	globalMapObj.map.controls[google.maps.ControlPosition.TOP_CENTER].push(inputDiv1);
}

