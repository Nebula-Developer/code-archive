/*
ui.cpp - The visual side of Globe
*/

#include "ui.h"
#include <unistd.h>
#include <termios.h>
#include <vector>
#include <sys/ioctl.h>

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

std::string underline = "\033[4m";
std::string reset = "\033[0m";

RGB fg1 = RGB(255, 255, 255);
RGB bg1 = RGB(60, 60, 80);
RGB fg2 = RGB(255, 255, 255);
RGB bg2 = RGB(70, 70, 90);
RGB bg = RGB(50, 50, 70);
RGB bgSel = RGB(100, 100, 120);


std::string choiceList(std::string prompt, std::vector<std::string> text, int startX, int startY, bool clear) {
    if (clear) clearBG(bg);
    int x,y;
    getWindowSize(&x, &y);

    int width = getLargestString(text);
    if (startX + width > x) width = x - startX;
    if (startY + text.size() > y) startY = y - text.size();

    if (startX < 0) startX = 0;
    if (startY < 0) startY = 0;

    std::string promptWidthSpan = "";
    for (int i = 0; i < width - prompt.length(); i++) promptWidthSpan += " ";
    writeAtPos(underline + prompt + promptWidthSpan + reset, startX, startY, fg1, bg1);

    startY++;

    for (int i = 0; i < text.size(); i++) {
        RGB fg = (i % 2 == 0) ? fg1 : fg2;
        RGB bg = (i % 2 == 0) ? bg1 : bg2;
        if (i == 0) bg = bgSel;
        std::string widthSpan = "";
        for (int j = 0; j < width - text[i].length(); j++) widthSpan += " ";

        writeAtPos(text[i] + widthSpan, startX, startY + i, fg, bg);
    }
    moveCursor(x, y);

    int selected = 0;

    while (true) {
        int c = getchar();
        if (c == 27) {
            c = getchar();
            if (c == 91) {
                c = getchar();
                int oldPos = startY + selected;
                int oldIndex = selected;

                if (c == 65) {
                    if (selected == 0) selected = text.size() - 1;
                    else selected--;
                    
                } else if (c == 66) {
                    if (selected == text.size() - 1) selected = 0;
                    else selected++;
                }

                int newPos = startY + selected;
                RGB fg = (selected % 2 == 0) ? fg1 : fg2;
                RGB bg = (selected % 2 == 0) ? bg1 : bg2;
                std::string widthSpan = "";
                for (int j = 0; j < width - text[selected].length(); j++) widthSpan += " ";
                writeAtPos(text[selected] + widthSpan, startX, newPos, fg, bgSel);
                std::string widthSpan2 = "";
                for (int j = 0; j < width - text[oldIndex].length(); j++) widthSpan2 += " ";
                writeAtPos(text[oldIndex] + widthSpan2, startX, oldPos, fg, bg);
            }
        }
        if (c == 10) break;
    }

    return text[selected];
}

void moveCursor(int x, int y) {
    std::cout << "\033[" << y << ";" << x << "H";
}

void getWindowSize(int* x, int* y) {
    struct winsize w;
    ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
    *x = w.ws_col;
    *y = w.ws_row;
}

void clearBG(RGB bg) {
    int x,y;
    getWindowSize(&x, &y);
    std::string output = bg.toBGESC();
    for (int i = 0; i <= y; i++) {
        for (int j = 0; j <= x; j++) {
            output += " ";
        }
        output += "\n";
    }
    writeAtPos(output, 0, 0, RGB(), bg);
}

int getLargestString(std::vector<std::string> text) {
    int largest = 0;
    for (int i = 0; i < text.size(); i++) {
        if (text[i].length() > largest) largest = text[i].length();
    }
    return largest;
}

void hideCursor() {
    std::cout << "\033[?25l";
}

void showCursor() {
    std::cout << "\033[?25h";
}
