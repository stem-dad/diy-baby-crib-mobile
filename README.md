# DIY Bay Crib Mobile

## Initialize Raspberry Pi and Rasbian

Initial username: pi, password: raspberry

```
sudo apt-get update && sudo apt-get -y dist-upgrade && sudo apt-get -y autoremove && sudo apt-get autoclean
sudo raspi-config
# 5 Interfacing Options -> P2 SSH -> Enable
# 5 Interfacing Options -> P1 Camera -> Enable
# And reboot

sudo apt-get install vim tmux git avahi-daemon
sudo vi /etc/hostname
# raspberrypi to mobile
```

and add following lines to .ssh/config on local pc

```
Host mobile
  Hostname mobile.local
  User pi
  IdentitiesOnly yes 
```

and you can login with SSH

```
$ ssh mobile
Linux mobile 4.9.41+ #1023 Tue Aug 8 15:47:12 BST 2017 armv6l

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sat Aug 19 00:10:36 2017 from fe80::469:b2da:d84a:7412%eth0

SSH is enabled and the default password for the 'pi' user has not been changed.
This is a security risk - please login as the 'pi' user and type 'passwd' to set a new password.

pi@mobile:~ $
```
