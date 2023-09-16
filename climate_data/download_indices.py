import os
import requests

urls = [
    'https://psl.noaa.gov/gcos_wgsp/Timeseries/Data/nino34.long.anom.data',
    'https://psl.noaa.gov/gcos_wgsp/Timeseries/Data/nino12.long.anom.data',
    'https://psl.noaa.gov/gcos_wgsp/Timeseries/Data/nino3.long.anom.data',
    'https://psl.noaa.gov/gcos_wgsp/Timeseries/Data/nino4.long.anom.data'
]

# Define the directory where you want to save the files
directory = "climate_indices"
os.makedirs(directory, exist_ok=True)

for url in urls:
    response = requests.get(url)
    response.raise_for_status()  # If the request failed this will raise an exception

    # Modify the filename
    filename = url.split('/')[-1]
    filename = filename.replace('.long.anom', '')

    # Use os.path.join to create the full path including the directory
    full_path = os.path.join(directory, filename)

    with open(full_path, 'wb') as file:
        file.write(response.content)

print("All files downloaded successfully")

