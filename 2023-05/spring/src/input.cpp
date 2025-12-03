#include <termios.h>
#include <iostream>
#include <unistd.h>

#include "term.hpp"
#include "input.hpp"

std::string bg_esc(int r, int g, int b) { return "\033[48;2;" + std::to_string(r) + ";" + std::to_string(g) + ";" + std::to_string(b) + "m"; }
std::string fg_esc(int r, int g, int b) { return "\033[38;2;" + std::to_string(r) + ";" + std::to_string(g) + ";" + std::to_string(b) + "m"; }

std::string prefix() {
    return bg_esc(0, 0, 0) + fg_esc(255, 255, 255) + " spring " + bg_esc(255, 255, 255) + fg_esc(0, 0, 0) + "$ ";
}

void get_input(std::string &command) {
    int x = 0;

    int posX, posY;
    get_term_pos(posX, posY);

    struct termios old_tio, new_tio;
    tcgetattr(STDIN_FILENO, &old_tio);
    new_tio = old_tio;
    new_tio.c_lflag &= (~ICANON & ~ECHO);
    tcsetattr(STDIN_FILENO, TCSANOW, &new_tio);

    while (true) {
        std::string prefixC = prefix();
        int prefixLen = length_without_escape_sequences(prefixC);

        std::string printingStr = set_term_pos(0, posY) + prefixC + command + set_term_pos(prefixLen + x + 1, posY);
        write(STDOUT_FILENO, printingStr.c_str(), printingStr.length());

        char c = getchar();
        if (c == '\n') break;
        
        command = command.insert(x, 1, c);
        x++;
    }

    std::cout << "\033[0m" << std::endl;
    tcsetattr(STDIN_FILENO, TCSANOW, &old_tio);
}
