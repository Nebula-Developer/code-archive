Hi there.
Thank you so much for installing FAN onto your system. To get started, run the corresponding installer for your system.

Please make sure that you compile FAN for your system. It's really easy to do. Just the following:

Open up Terminal if you are on MacOS / Linux, or CMD if you are on Windows.
Make sure you have GCC installed. On Linux, use apt, dnf, etc.. On Mac, install Xcode.
For Windows, download it online, chances are you already have it installed.

Next, use CD <Path to where you installed FAN>. This can look like the following:
MACOS: cd /Users/<username>/Downloads/FAN/
LINUX: cd /home/Downloads/FAN/
WINDOWS: cd C:\Users\<user>\Downloads\FAN
It may vary.

Then, type/paste in the following two commands:
gcc -o alias/fan Fan.c
gcc -o alias/Fan Fan.c

And just like that you're done.
Please compile the project, as if you are on a different operating system, it will simply not work.
I usually leave a compile for linux, as that is where I do most of my programming, so you may not need to, but it is highly recommended, as sometimes there might be a version failure.