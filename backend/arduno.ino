#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

ESP8266WebServer server(80);

const char* ssid = "";
const char* password = "";

const char* serverUrl = "http://192.168.127.13:5000/api/UvData";

const int uvSensorPin = A0;
float uvIndex = 0.0;
const float uvThreshold = 11.0;  

LiquidCrystal_I2C lcd(0x27, 16, 2);

unsigned long previousLCDUpdateTime = 0;
unsigned long previousPostTime = 0;
const long lcdInterval = 3000;  
const long postInterval = 3000; 

float convertAnalogToUV(int sensorValue) {
  return sensorValue * (3.3 / 1024.0) * 10.0;
}

void sendUVDataToServer(float uvIndex) {
  WiFiClient client;

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    if (http.begin(client, serverUrl)) {
      char jsonData[40];
      snprintf(jsonData, sizeof(jsonData), "{\"uvIndex\": \"%.2f\"}", uvIndex);

      http.addHeader("Content-Type", "application/json");
      http.setTimeout(5000);  

      int httpResponseCode = http.POST(jsonData);

      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }

      http.end();  
    } else {
      Serial.println("Unable to connect to server");
    }
  } else {
    Serial.println("WiFi not connected");
  }
}

void setup() {
  Serial.begin(115200);

  lcd.init();
  lcd.backlight(); 
  lcd.setCursor(0, 0);
  lcd.print("Connecting...");

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  int wifiRetryCount = 0;
  while (WiFi.status() != WL_CONNECTED && wifiRetryCount < 20) {
    delay(1000);
    Serial.print(".");
    wifiRetryCount++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected!");
    lcd.setCursor(0, 0);
    lcd.print("WiFi Connected  ");
  } else {
    Serial.println("Failed to connect to WiFi.");
    lcd.setCursor(0, 0);
    lcd.print("WiFi Failed     ");
    return;  
  }

  server.begin();
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - previousLCDUpdateTime >= lcdInterval) {
    previousLCDUpdateTime = currentMillis;  

    int uvSensorValue = analogRead(uvSensorPin);
    uvIndex = convertAnalogToUV(uvSensorValue);  // Convert sensor value to UV Index

    Serial.print("UV Index: ");
    Serial.println(uvIndex, 2);  
    if (uvIndex > uvThreshold) {
      // If UV Index exceeds threshold, show warning
      lcd.setCursor(0, 0);
      lcd.print("UV ALERT! HIGH  ");
      lcd.setCursor(0, 1);
      lcd.print("UV Index:       ");
      lcd.setCursor(10, 1);
      lcd.print(uvIndex, 2);  
    } else {
      lcd.setCursor(0, 0);
      lcd.print("UV Index:       ");
      lcd.setCursor(9, 0);
      lcd.print(uvIndex, 2);
    }
  }

  // Post UV data to the server
  if (currentMillis - previousPostTime >= postInterval) {
    previousPostTime = currentMillis;  
    sendUVDataToServer(uvIndex);  
  }
}
