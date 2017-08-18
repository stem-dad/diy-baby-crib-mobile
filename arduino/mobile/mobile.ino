#include <AccelStepper.h>
#include <MultiStepper.h>

#define STEP_MOTOR_1 12
#define STEP_MOTOR_2 11
#define STEP_MOTOR_3 10
#define STEP_MOTOR_4 9
#define STATUS_LED_PIN 13
#define RED_LED_PIN 8
#define PLAY_BUTTON_PIN A1
#define NEXT_BUTTON_PIN A2
#define ROTATE_BUTTON_PIN A0

#define HALFSTEP 8  // 4: full step, 8: half step

AccelStepper stepper1(HALFSTEP, STEP_MOTOR_1, STEP_MOTOR_3, STEP_MOTOR_2, STEP_MOTOR_4);
int rotateState = 0;

int rotateButtonState = 0;
int playButtonState = 0;
int nextButtonState = 0;

void onRedLed() {
  digitalWrite(RED_LED_PIN, LOW);
}

void offRedLed() {
  digitalWrite(RED_LED_PIN, HIGH);
}

void onStatusLed() {
  digitalWrite(RED_LED_PIN, HIGH);
}

void offStatusLed() {
  digitalWrite(RED_LED_PIN, LOW);
}


void setup() {
  pinMode(STEP_MOTOR_1, OUTPUT);
  pinMode(STEP_MOTOR_2, OUTPUT);
  pinMode(STEP_MOTOR_3, OUTPUT);
  pinMode(STEP_MOTOR_4, OUTPUT);
  
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);

  offStatusLed();
  offRedLed();
  
  pinMode(PLAY_BUTTON_PIN, INPUT_PULLUP); 
  pinMode(NEXT_BUTTON_PIN, INPUT_PULLUP); 
  pinMode(ROTATE_BUTTON_PIN, INPUT_PULLUP);

  stepper1.setMaxSpeed(100.0);
  stepper1.setAcceleration(200.0);
  stepper1.setSpeed(100);
  //stepper1.moveTo(40760);

  Serial.begin(9600);
}

void loop() {
//  digitalWrite(STATUS_LED_PIN, HIGH);
//  digitalWrite(RED_LED_PIN, LOW);
//  analogWrite(MOTOR_PIN, 255);
//  //digitalWrite(MOTOR_PIN, HIGH);
//  delay(3000);
//  digitalWrite(STATUS_LED_PIN, LOW);
//  digitalWrite(RED_LED_PIN, HIGH);
//  analogWrite(MOTOR_PIN, 30);
//  //digitalWrite(MOTOR_PIN, LOW);
//  delay(3000);
//  if(!digitalRead(ROTATE_BUTTON_PIN)){
//    onRedLed();
//  }
//  else{
//    offRedLed();
//  }

//  if (stepper1.distanceToGo() == 0) {
//    stepper1.moveTo(-stepper1.currentPosition());
//  }

  // ボタンが押されているか
  if(!digitalRead(ROTATE_BUTTON_PIN)){
    // ちょっと待って再度押されているか確認(チャタリングの簡易対策)
    delay(20);

    if(!digitalRead(ROTATE_BUTTON_PIN)){
      if(rotateButtonState == 0){
        rotateButtonState = 1;
      
        if(rotateState == 0){
          onRedLed();
          rotateState = 1;
          stepper1.enableOutputs();
        }
        else{
          offRedLed();
          rotateState = 0;
        } 
      }
    }
    else{
      offRedLed();
      rotateButtonState = 0;
    }
  }
  else{
    rotateButtonState = 0;
  }

  if(rotateState == 1){
    stepper1.runSpeed();
  }
  else {
    stepper1.stop();
    stepper1.disableOutputs();
  }

  if(!digitalRead(PLAY_BUTTON_PIN)){
    // ちょっと待って再度押されているか確認(チャタリングの簡易対策)
    delay(20);
  
    if(!digitalRead(PLAY_BUTTON_PIN)){
      if(playButtonState == 0){
        playButtonState = 1;
        Serial.print("p\n");
      }
    }
    else{
      playButtonState = 0;
    }
  }
  else{
    playButtonState = 0;
  }
  
  if(!digitalRead(NEXT_BUTTON_PIN)){
    // ちょっと待って再度押されているか確認(チャタリングの簡易対策)
    delay(20);
  
    if(!digitalRead(NEXT_BUTTON_PIN)){
      if(nextButtonState == 0){
        nextButtonState = 1;
        Serial.print("n\n");
      }
    }
    else{
      nextButtonState = 0;
    }
  }
  else{
    nextButtonState = 0;
  } 
}
