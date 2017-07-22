#define LED_PIN 13
#define MOTOR_PIN 9

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(MOTOR_PIN, OUTPUT); 
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  analogWrite(MOTOR_PIN, 100);
  delay(3000);
  digitalWrite(LED_PIN, LOW);
  analogWrite(MOTOR_PIN, 0);
  delay(3000);
}
