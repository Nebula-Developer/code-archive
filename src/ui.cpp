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
    int x,y;
    getWindowSize(&x, &y);

    int width = getLargestString(text);
    if (startX < 0) startX = 0;
    if (startY < 0) startY = 0;

    int selected = 0;
    startY++;

    int oldY = 0;

    if (clear) clearBG(bg);

    // TODO: Cleanup
    while (true) {
        getWindowSize(&x, &y);

        if (clear && oldY < y) clearBG(bg);
        
        oldY = y;
        std::string promptWidthSpan = "";
        for (int i = 0; i < width - prompt.length(); i++) promptWidthSpan += " ";
        writeAtPos(underline + prompt + promptWidthSpan + reset, startX, startY - 1, fg1, bg1);

        int startIndex = 0;

        if (text.size() > y - startY) {
            startIndex = selected;
            if (startIndex > text.size() - (y + 1 - startY)) startIndex = text.size() - (y + 1 - startY);
        }

        for (int i = startIndex; i < text.size() && i < y + 1 - startY + startIndex; i++) {
            std::string textWidthSpan = "";
            for (int j = 0; j < width - text[i].length(); j++) textWidthSpan += " ";
            if (i == selected) writeAtPos(text[i] + textWidthSpan, startX, startY + i - startIndex, fg2, bgSel);
            else writeAtPos(text[i] + textWidthSpan, startX, startY + i - startIndex, fg2, bg2);
        }
            
        moveCursor(x, y);
        
        int c = getchar();
        if (c == 27) {
            c = getchar();
            if (c == 91) {
                c = getchar();
                
                if (c == 65) {
                    if (selected == 0) selected = text.size() - 1;
                    else selected--;
                    
                } else if (c == 66) {
                    if (selected == text.size() - 1) selected = 0;
                    else selected++;
                }
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
