var map;
var marker;
var rectangle;
var currentLoc = [0, 0];
var currentIns = new instructionSet(0,0,0,0,0)

// Process data when user submits property information. Calls 
$( "#get-info" ).submit(function( event ) {
	serArr = $(this).serializeArray();
	address = serArr[0]["value"]

	// Use coordinates if provided
	if (serArr[1]["value"].length > 0) {
		coordArr = serArr[1]["value"].substring(1, serArr[1]["value"].length-1).split(",")
		lat = parseFloat(coordArr[0])
		long = parseFloat(coordArr[1])
		if (lat != NaN && long != NaN) {
			setCurrentLoc(lat, long);
			markMap();
		} 
		else { alert("Uh-oh, it looks like those coordinates aren't valid! Are they in the form '(lat, long)'?")}
	} 

	// If not provided coordinates, geocode the address
	else if (serArr[0]["value"].length > 0){
		codeAddress(serArr[0]["value"]);
		console.log("After Code Address")
		console.log(currentLoc)
		markMap();
	}

	if (serArr[2]["value"].length > 0) {beds = parseFloat(serArr[2]["value"])}
	else {beds = -1}

	if (serArr[3]["value"].length > 0) {baths = parseFloat(serArr[2]["value"])}
	else {baths = -1}

	optType = serArr[4]["value"]
	currentIns.bed = beds
	currentIns.bath = baths
	currentIns.opt = optType
	console.log(currentIns)
	event.preventDefault();
});

function initMap() {
		var sfcapone = {lat: 37.785067, lng: -122.399868};
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 11,
			center: sfcapone
		});
		marker = new google.maps.Marker({
			position: sfcapone,
			map: map
		});
		rectangle = new google.maps.Rectangle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          bounds: {
            north: 37.785067 + 0.02,
            south: 37.785067 - 0.02,
            east: -122.399868 + 0.02,
            west: -122.399868 - 0.02
          }
        });
	}

function markMap() {
	console.log("Mark Map:")
	console.log(currentLoc)
	pt = new google.maps.LatLng(currentLoc[0], currentLoc[1])
	map.setCenter(pt);
	marker.setPosition(pt)
}

function codeAddress(address) {
	var geocoder = new google.maps.Geocoder()
	console.log("Inside Code address")
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == 'OK') {
			map.setCenter(results[0].geometry.location);
			setCurrentLoc(results[0].geometry.location.lat(), results[0].geometry.location.lng());
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
	}

function setCurrentLoc(lat, long) {
	console.log("Inside Set CurrentLoc")
	currentLoc[0] = lat;
	currentLoc[1] = long;
	currentIns.lat = lat;
	currentIns.lng = long;
	markMap();
	retVals = processInsSet(currentIns)
	console.log("RETVALS")
	console.log(retVals)
	setOutputs(retVals[0], retVals[1], retVals[2])
}

function setOutputs(avgIncome, revPrice, bookPrice ) {
	$("#avg-income").text("Average Weekly Income: $" + avgIncome.toFixed(2));
	$("#recommended-price-revenue").text("Price to Maximize Revenue: $" + revPrice.toFixed(2));
	$("#recommended-price-booking").text("Price to Maximize Booking: $" + bookPrice.toFixed(2));
}

function instructionSet(lat, long, bed, bath, opt) {
	this.lat = lat;
	this.lng = long;
	this.bed = bed;
	this.bath = bath;
	this.opt = opt;
}


