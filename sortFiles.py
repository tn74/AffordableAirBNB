import os
import csv
import json

with open('airbnb-sep-2017/listings.csv', 'r') as f:
	reader = csv.reader(f)
	row = next(reader)
	for i in range(len(row)):
		print(str(i) + ": " + str(row[i]))

datadict = {}
with open('airbnb-sep-2017/listings.csv', 'r') as f:
	reader = csv.reader(f)
	for row in reader:
		lid = row[0]
		if lid == 'id': continue
		lat = float(row[48])
		lng = float(row[49])
		bath = row [54]
		bed = row[55]
		if len(bath) > 0:
			bath = float(bath)
		if len(bed) > 0:
			bed = float(bed)
		guests_included = float(row[65])
		price = row[60]
		price = price.split('$')[1]
		price = price.split('\"')[0]
		price = float(''.join(price.split(',')))
		neighbordhood = row[38]
		datadict[lid] = [lid, lat, lng, neighbordhood, bath, bed, guests_included, price]

calendardict = {}
with open('airbnb-sep-2017/calendar.csv', 'r') as f_calendar:
	reader = csv.reader(f_calendar)
	for row in reader:
		lid = row[0]
		if lid == "listing_id":
			continue
		date_available = row[1]
		available = row[2]
		price = row[3]
		if not lid in calendardict:
			# [Days Available, Days Occupied, Average Price When Vacant]
			calendardict[lid] = [0, 0, 0]
		calendardict[lid][0] += 1
		if (available == "f"):
			calendardict[lid][1] += 1
		else:
			av = float(calendardict[lid][0])
			price = price.split('$')[1]
			price = price.split('\"')[0]
			price = float(''.join(price.split(',')))
			daysUnavailable = av - float(calendardict[lid][1])
			calendardict[lid][2] = (((daysUnavailable-1) * calendardict[lid][2] + price)) / daysUnavailable



writeDict = {}
for key in datadict:
	if '\'' in datadict[key][3] and 'Hunter' not in datadict[key][3]:
		continue
	elif 'Hunter' in datadict[key][3]:
		datadict[key][3] = "Hunters Point"
	writeDict[key] = {}
	if key in calendardict:
		writeDict[key]['lid'] = datadict[key][0]
		writeDict[key]['lat'] = datadict[key][1]
		writeDict[key]['lng'] = datadict[key][2]
		writeDict[key]['neighborhood'] = datadict[key][3]
		writeDict[key]['bath'] = datadict[key][4]
		writeDict[key]['bed'] = datadict[key][5]
		writeDict[key]['guests_included'] = datadict[key][6]
		writeDict[key]['price'] = datadict[key][7]
		writeDict[key]['days_available'] = calendardict[key][0]
		writeDict[key]['days_occupied'] = calendardict[key][1]
		writeDict[key]['vacant_price'] = calendardict[key][2]
jsonString = json.dumps(writeDict)
outFile = open('data/listingsProcessed.json', 'w')
outFile.write('relData = \'' + jsonString + '\'')


