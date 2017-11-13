//1° longitude = cosine (latitude) * length of degree (miles) at equator.

searchBoxLength = 1.0
lngVarDelta = searchBoxLength/2.0/(Math.cos(37.785067 * Math.PI / 180) * 69)
latVarDelta = searchBoxLength/2.0/69.0
listingData = JSON.parse(relData)

function processInsSet(insSet) {
	lat = insSet.lat;
	lng = insSet.lng;
	minLng = lng - lngVarDelta
	maxLng = lng + lngVarDelta
	minLat = lat - latVarDelta
	maxLat = lat + latVarDelta
	console.log(minLng, maxLng, minLat, maxLat)
	rectangle.setBounds({
	    north: maxLat,
	    south: minLat,
	    east: maxLng,
	    west: minLng
	  });

	allListings = getReleventListings(insSet);
	avgWeeklyRev = getAvgRev(allListings)
	idealPriceWeek = getBestPrice(allListings)
	idealPriceBooking = getBestPriceBooking(allListings)
	return [avgWeeklyRev, idealPriceWeek, idealPriceBooking]
}

function getBestPriceBooking(allListings) {
	highestPerc = 0
	bestPrice = 0
	for (var listingString in allListings) {
		listing = allListings[listingString]
		occupied_percentage = listing.days_occupied/listing.days_available
		price = listing.price
		if (occupied_percentage >= highestPerc){
			highestPerc = occupied_percentage
			if (price > bestPrice) {
				bestPrice = price
			}
		}
	}
	console.log("best booking price", bestPrice)
	return bestPrice
}

function getBestPrice(allListings) {
	maxDailyRev = 0
	bestPrice = 0
	console.log(allListings);
	for (var listingString in allListings) {
		listing = allListings[listingString]
		occupied_percentage = listing.days_occupied/listing.days_available
		price = listing.price
		if (listing.days_available < 100){
			continue
		}
		if (price * occupied_percentage > maxDailyRev) {
			//console.log(price, occupied_percentage, listing.lid, listing.bath, listing.bed, listing.days_available)
			maxDailyRev = price * occupied_percentage
			bestPrice = price
		}
	}
	console.log("best revenue price", bestPrice)
	return bestPrice
}

function getAvgRev(allListings) {
	totaldailyrev = 0
	console.log(allListings);
	for (var listingString in allListings) {
		listing = allListings[listingString]
		totaldailyrev += (listing.days_occupied/listing.days_available) * listing.price
	}
	dailyRev = totaldailyrev / allListings.length
	weeklyRev = dailyRev * 7
	return weeklyRev
}

function getReleventListings(insSet) {
	relListings = []
	for (var lid in listingData) {
		curList = listingData[lid]
		appendToList = true;
		if (!(curList.lat < maxLat && curList.lat > minLat && curList.lng < maxLng && curList.lng > minLng)){ appendToList = false}
		if (insSet.bed > 0) {
			if (insSet.bed != curList.bed) {
				appendToList = false;
			}
		}
		if (insSet.bath > 0) {
			console.log("In bath")
			console.log(insSet.bath, curList.bath)
			if (insSet.bath != curList.bath){
				appendToList = false
			}
		}
		if (appendToList) {
			relListings.push(curList);
		}
	}
	console.log(relListings)
	return relListings;
}
