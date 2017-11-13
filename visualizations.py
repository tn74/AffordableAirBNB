import matplotlib.pyplot as plt
import json
import math

with open('data/listingsProcessed.json', 'r') as f:
	jsonText = f.readlines()[0].split('\'')[1]

print(len(jsonText))
datadict = json.loads(jsonText)
print(datadict.keys())
print(datadict['1615260'])

latArr = []
lngArr = []
dataArr = []
logData = []
for listing in datadict:
	latArr.append(datadict[listing]['lat'])
	lngArr.append(datadict[listing]['lng'])
	
	try:
		dataArr.append(float(datadict[listing]['bed']))
	except:
		dataArr.append(0)
plt.scatter(latArr, lngArr, c=dataArr, vmin = 0, vmax = 3)
plt.ylabel('Longitude')
plt.xlabel('Latitude')
plt.title('Number of Beds in AirBNBs')
plt.colorbar()
plt.show()

