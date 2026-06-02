const mqtt = require("mqtt");
const env = require("../config/env");

function startMqttClient(io, onSensorData) {
  const mqttUrl = `mqtt://${env.MQTT_HOST}:${env.MQTT_PORT}`;
  const client = mqtt.connect(mqttUrl);

  client.on("connect", () => {
    console.log("MQTT Broker'a bağlandı.");

    client.subscribe(env.MQTT_TOPIC, (err) => {
      if (err) {
        console.error("MQTT subscribe hatası:", err.message);
        return;
      }

      console.log(`'${env.MQTT_TOPIC}' topic'ine abone olundu.`);
    });
  });

  client.on("message", (_topic, message) => {
    try {
      const sensorData = JSON.parse(message.toString());
      onSensorData(sensorData);
      io.emit("live_data", sensorData);
    } catch (err) {
      console.error("Gelen MQTT mesajı ayrıştırılamadı:", err.message);
    }
  });

  client.on("error", (err) => {
    console.error("MQTT Hatası:", err.message);
  });

  return client;
}

module.exports = {
  startMqttClient,
};
