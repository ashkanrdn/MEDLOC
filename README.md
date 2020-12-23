# MedLoc-Heroku-API
Deployment code for the MedLoc API in Heroku

# Dashboard development code

# API documentation
This API is built using the Flask framwork on Python

# Install requirements to run API locally
- Copy the github repository into your machine
- Run terminal as administrator to avoid any conflics due to limited access
- Look up your folder location inside the terminal
- Once in the directory folder run the following command "pip install -r requirements.txt" (without quotes)
- All the corresponding libraries should now be installed on your system

# Running the API locally
In order to the only the API locally on your system after installing all the required libraries, simply execute the app.py file

# Data Organization & Storage
At the moment the data used for this dashaboard is stored locally on this github repo
All the dta is within the "Data" folder

# Note - file names with the nomenclature "master" indicate the current main document being used
- hexagon_collection_master.geojson - Holds all the information indexed into the hexagonal grid created for the city of Chicago
- metadata_collection_master.json - Holds all the external information related to the organization, processing and souce of each data set used
                                    currently is still work in progress and not all the data has been cited

# Local Testing
There are multiple options to test the API locally, 

These are the two currently implemented request links
Use the local address that you get when runnign the app.py file before the dashes

/get_kmeans_silouhette_optimun_cluster_number/
/get_kmeans_cluster/

See list_of_features.txt to fins what are the avaiable features to test the application

For more information about what these request actually do look at the documentation on the app.py file

To test the APi you can either use POSTMAN or the requests_tester.py file

# Procfile
This document is a WSGI HTTP server that serves the Flask application at Heroku.