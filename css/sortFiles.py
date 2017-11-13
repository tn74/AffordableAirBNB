import os
import csv

with open('listings.csv', 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        print(len(row))