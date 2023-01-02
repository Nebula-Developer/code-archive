/*
ui.cpp - The visual side of Globe
*/

#include "ui.h"
#include <unistd.h>
#include <termios.h>

void writeAtPos(std::string text, int x, int y, RGB fg, RGB bg) {
    std::cout << "\033[" << y << ";" << x << "H" << fg.toESC() << bg.toBGESC() << text << "\033[0m";
}

void scrollbackMode() {
    std::cout << "\033[?1049h";
}

void normalMode() {
    std::cout << "\033[?1049l";
}

// To fix getchar() waiting for input, use this:
void ttyRaw() {
    struct termios raw;
    tcgetattr(STDIN_FILENO, &raw);
    raw.c_lflag &= ~(ECHO | ICANON);
    tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw);
}

void ttyNormal() {
    struct termios raw;
    tcgetattr(STDIN_FILENO, &raw);
    raw.c_lflag |= (ECHO | ICANON);
    tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw);
}
