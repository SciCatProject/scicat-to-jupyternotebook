# SciCat Jupyter Notebook integration

## Start up workflow

1) Retrieve data from POST request
   In this example (file: data.json), it would be:
```json
{
  "user" : "your_nice_scicat_user",
  "instance_id" : "idce5fec2-6a5e-11ed-9932-874c95750a47",
  "scicat_instance_url" : "https://your.scicat.instance.ext",
  "scicat_token" : "your_scicat_token",
  "datasets" : [
    "20.500.12269/99ae086f-62dc-4228-a283-cc1c988c9e59",
    "20.500.12269/041e81c7-f96f-4447-bb34-c8047a6425ac",
    "20.500.12269/6a67b6e6-a202-4a6c-9859-4fecd6655165",
    "20.500.12269/f685a72d-663f-4592-b593-110624d70eb5"
  ]
}
```

2) extract relevant information:
   - INSTANCE_ID: idce5fec2-6a5e-11ed-9932-874c95750a47
   - USERNAME: your_nice_scicat_user

3) create destination folder in BASE_DESTINATION_FOLDER, which is provided as configuration to the service through an environment variable
   - BASE_DESTINATION_FOLDER: ./labs
   - DESTINATION_FOLDER: <BASE_DESTINATION_FOLDER>/<INSTANCE_ID> = ./labs/idce5fec2-6a5e-11ed-9932-874c95750a47

4) cd in the destination folder

5) create the destination jupyter notebook _scjn_idce5fec2-6a5e-11ed-9932-874c95750a47.ipynb_ from the jupyter notebook template _scjnt/scjnt.ipynb_
   substituting <INSTANCE_ID>, <JSON_DATA> and <USERNAME>. Please check the example notebooks provided
   - DESTINATION_JN: scjn_<INSTANCE_ID>.ipynb = scjn_idce5fec2-6a5e-11ed-9932-874c95750a47.ipynb

6) start jupyter lab in a new process
   > jupyter lab --no-browser

7) retrieve URL and token to connect
   Run command:
   > jupyter lab list
Currently running servers:
http://localhost:8888/?token=d9f3d7853ce7363290e90da7edc14e5d3c4b5b36abe153d2 :: ./labs/idce5fec2-6a5e-11ed-9932-874c95750a47/scjn_idce5fec2-6a5e-11ed-9932-874c95750a47.ipynb

   Extract:
   - BASE_URL: http://localhost:8888/
   - TOKEN: d9f3d7853ce7363290e90da7edc14e5d3c4b5b36abe153d2

8) create destination URL
   - DESTINATION_URL: <BASE_URL>/lab/tree/<DESTINATION_JN>?token=<TOKEN>
     http://localhost:8888/lab/tree/scjn_idce5fec2-6a5e-11ed-9932-874c95750a47.ipynb?token=d9f3d7853ce7363290e90da7edc14e5d3c4b5b36abe153d2
 

## Folder content

- data.json
  Example data file with post data: data.json
- README.md
  This file with folder content and workflow explanation
- scjnt/scjnt.ipynb
  SciCat Jupyter Notebook template
- labs/idce5fec2-6a5e-11ed-9932-874c95750a47/scjn_idce5fec2-6a5e-11ed-9932-874c95750a47.ipynb
  Destination SciCat Jupyter Notebook ready to be used as it should appear to the user as soon Jupyter lab opens
- labs/idce5fec2-6a5e-11ed-9932-874c95750a47/scjn_idce5fec2-6a5e-11ed-9932-874c95750a47_run.ipynb
  Destination SciCat Jupyter Notebook with all cells run

