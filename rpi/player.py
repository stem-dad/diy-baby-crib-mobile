#!/usr/bin/env python
#-*- cording: utf-8 -*-

import pygame.mixer
import serial
import time

pygame.mixer.init()
pygame.mixer.music.load("audio/6.mp3")
pygame.mixer.music.set_volume(1.0)

ser = serial.Serial("/dev/ttyUSB0", 9600)

is_play = False

while True:
    line = ser.readline()
    command = line[0]

    if command == 'p':
        if is_play:
            pygame.mixer.music.stop()
        else:
            pygame.mixer.music.play(-1)

        is_play = !is_play

    elif command == 'n':
        print("none")

