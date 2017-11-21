#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import pygame.mixer
import serial
import time

base_path = os.path.dirname(os.path.abspath(__file__))

pygame.mixer.init()
pygame.mixer.music.set_volume(0.5)

pygame.mixer.music.load(base_path + "/audio/startup.mp3")
pygame.mixer.music.play()
time.sleep(3)
pygame.mixer.music.stop()

ser = serial.Serial("/dev/ttyACM0", 9600)

is_play = False
sound_id = 0
sound_id_max = 5
volume = [1.0, 0.7, 0.2, 0.6, 0.5, 0.4]

while True:
    line = ser.readline()
    command = line[0]

    if command == 'p':
        print("push play/stop")
        if is_play:
            print("stop")
            pygame.mixer.music.stop()
        else:
            print("play")
            pygame.mixer.music.load(base_path + "/audio/a%d.mp3" % sound_id)
            pygame.mixer.music.set_volume(volume[sound_id])
            pygame.mixer.music.play(-1)

        is_play = not is_play

    elif command == 'n':
        print("push next")
        sound_id += 1
        if sound_id > sound_id_max:
            sound_id = 0

        print("sound_id: %d" % sound_id)

        pygame.mixer.music.stop()
        pygame.mixer.music.load(base_path + "/audio/a%d.mp3" % sound_id)
        pygame.mixer.music.set_volume(volume[sound_id])
        pygame.mixer.music.play(-1)

        is_play = True

