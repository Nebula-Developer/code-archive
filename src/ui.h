/*
ui.h - Header for ui.cpp
*/

#ifndef GLOBE_UI_H
#define GLOBE_UI_H

#include <iostream>
#include <string>

class RGB {
    public:
        RGB() {
            this->r = 0;
            this->g = 0;
            this->b = 0;
        }

        RGB(int r, int g, int b) {
            this->r = r;
            this->g = g;
            this->b = b;
        }

        int r;
        int g;
        int b;

        std::string toESC() {
            return "\033[38;2;" + std::to_string(r) + ";" + std::to_string(g) + ";" + std::to_string(b) + "m";
        }

        std::string toBGESC() {
            return "\033[48;2;" + std::to_string(r) + ";" + std::to_string(g) + ";" + std::to_string(b) + "m";
        }
};

void writeAtPos(std::string text, int x, int y, RGB fg = RGB(), RGB bg = RGB());
void scrollbackMode();
void normalMode();
void ttyNormal();
void ttyRaw();

#endif
