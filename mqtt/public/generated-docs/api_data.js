define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./public/generated-docs/main.js",
    "group": "/Users/gauravbansal/Deakin/SIT209/TrackMe/mqtt/public/generated-docs/main.js",
    "groupTitle": "/Users/gauravbansal/Deakin/SIT209/TrackMe/mqtt/public/generated-docs/main.js",
    "name": ""
  },
  {
    "type": "get",
    "url": "/mqtt",
    "title": "AllDevices An array of all devices",
    "group": "MQTT",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "\n[\n {\n         \"message\": \"published new message\"\n         \"deviceId\"\n         \"ts\"\n         \"loc\"\n         \"temp\"\n }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n\"underfined\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./mqtt.js",
    "groupTitle": "MQTT",
    "name": "GetMqtt"
  }
] });
