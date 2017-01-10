function onOffListenerCallback(name, checked){
	if(checked){
		if($('input#fromAddressInit').hasClass('controlDisabled'))
			$('input#fromAddressInit').removeClass('controlDisabled');
		if(!$('input#fromAddressInit').hasClass('controlBlurred'))
			$('input#fromAddressInit').addClass('controlBlurred');
		$('input#fromAddressInit').prop('disabled', true);
		
		if($('input#destAddressInit').hasClass('controlDisabled'))
			$('input#destAddressInit').removeClass('controlDisabled');
		if(!$('input#destAddressInit').hasClass('controlBlurred'))
			$('input#destAddressInit').addClass('controlBlurred');
		$('input#destAddressInit').prop('disabled', true);
		
		DG.checkOverride=true;	// This switch will stop on-off-switch functionality. This needs to be turned off on click of Cancel button

		pinMarker();
	}
	//document.getElementById("switch-listener-div").innerHTML = name + "=" + checked;
}
// Below function decides action on click of Delivery type buttons
$(document).ready(function(){
	$('p#bookCancelBtn').click(function () {
		$('div.on-off-switch-container').hide();
		$('div.pickup-type-container').show();
		if($('input#fromAddressInit').hasClass('controlBlurred'))
			$('input#fromAddressInit').removeClass('controlBlurred');
		$('input#fromAddressInit').prop('disabled', false);
		if($('input#destAddressInit').hasClass('controlBlurred'))
			$('input#destAddressInit').removeClass('controlBlurred');
		$('input#destAddressInit').prop('disabled', false);
		
		DG.checkOverride=false;	// This on-off-switch functionality which was disabled on Booking confirmation will be enabled once user click on Cancel.
		DG.OnOffSwitchObj.animateLeft(); // Also the Toggle button need to be Toggled Left (as in Not booked yet)
	});
});