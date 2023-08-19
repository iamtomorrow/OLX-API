![tomorrow-developers](https://github.com/iamtomorrow/OLX-API/assets/72582696/5057a258-0afd-4618-ae8d-1640e20203c3)

OLX API

API Reference
=============
The OLX Data API lets you incorporate functions normally executed on the OLX website into your own website or application. The lists below identify the different types of resources that you can retrieve using the API. The API also supports methods to insert, update, or delete many of these resources.

This reference guide explains how to use the API to perform all of these operations. The guide is organized by resource type. A resource represents a type of item that comprises part of the YouTube experience, such as a video, a playlist, or a subscription. For each resource type, the guide lists one or more data representations, and resources are represented as JSON objects. The guide also lists one or more supported methods (LIST, POST, DELETE, etc.) for each resource type and explains how to use those methods in your application.

Calling the API
===============
To call the OLX API you need to specify a specific endpoint predefined to retrieve data returned from the API. In the following lines, you can find these endpoints and their returns.

Before calling the API
======================
We recommend you use http://localhost:port/ping before continuing. This is a testing endpoint to test the API server status. It returns a JSON with the following structure: { pong: “pong” } if everything is fine. 

Database & Rest API diagram
========================
![database](https://github.com/iamtomorrow/OLX-API/assets/72582696/a3f25399-a9cf-402d-9ed6-6775446ce239)

References / Endpoints / Methods
![states](https://github.com/iamtomorrow/OLX-API/assets/72582696/3b8ecfbd-5add-4f32-8277-1229a5e328e9)
