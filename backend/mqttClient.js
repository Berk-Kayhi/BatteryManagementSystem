const mqtt = require("mqtt");

module.exports = function (io) {
  const TOPIC = "sensor/data";

  const client = mqtt.connect("mqtt://mosquitto:1883");

  client.on("connect", function () {
    console.log("MQTT Broker'a bağlandı.");
    client.subscribe(TOPIC, (err) => {
      if (!err) {
        console.log(`'${TOPIC}' topic'ine abone olundu.`);
      }
    });
  });

  client.on("message", function (topic, message) {
    try {
      const parsed = JSON.parse(message.toString());
      io.emit("live_data", parsed);
    } catch (err) {
      console.error("JSON parse hatası:", err);
    }
  });

  client.on("error", (err) => {
    console.error("MQTT Hatası:", err);
  });

  return client;
};
