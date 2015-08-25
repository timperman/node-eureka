var express = require('express'),
    Eureka = require('eureka-js-client').Eureka;

var app = express();

var instanceVars = {
  APP_ID: "app",
  HOST_NAME: "hostName",
  IP_ADDR: "ipAddr",
  PORT: "port",
  VIP_ADDR: "vipAddress"
};

var eurekaVars = {
  EUREKA_HOST: "host",
  EUREKA_PORT: "port"
};

function buildConfig() {
  var config = { instance: {}, eureka: {} };

  for (key in instanceVars) {
    if (process.env[key])
      config.instance[instanceVars[key]] = process.env[key];
  }

  if (process.env.DATA_CENTER_NAME) {
    config.instance.dataCenterInfo = { name: process.env.DATA_CENTER_NAME };
  }

  for (key in eurekaVars) {
    if (process.env[key])
      config.instance[eurekaVars[key]] = process.env[key];
  }

  return config;
}

var config = buildConfig();
console.log("Starting with configuration", config);

var client = new Eureka(config);
client.start();

app.get('/', function (req, res) {
  res.json(config);
})

app.get('/instance', function (req, res) {
  res.json(client.getInstancesByAppId(req.query.id));
})

app.get('/vip', function (req, res) {
  res.json(client.getInstancesByVipAddress(req.query.vipAddress));
})

app.listen(process.env.PORT || 3000);
