#include <iostream>
#include <cctype>
#include <string>

#include "input.hpp"
#include "term.hpp"

std::string create_string(const char *str, ...) {
    std::string result = str;

    va_list args;
    va_start(args, str);

    while (true) {
        const char *arg = va_arg(args, const char *);

        if (arg == NULL) break;
        else result += arg;
    }

    va_end(args);

    return result;
}

std::string read_input() {
    std::string input;

    flush_term();
    set_input_mode();
    no_flush_term();

    bool fetching = true;
    set_term_pos_x(0);
    write_term("> ");

    int x = 0;

    while (fetching) {
        char c = getchar();

        bool is_printable_char = isprint(c);

        if (c == '\n') fetching = false;
        else if (c == 127) {
            if (x > 0) {
                input.erase(x - 1, 1);
                x--;
            }
        }
        else if (c == 27) {
            getchar();
            char arrow = getchar();

            switch (arrow) {
                case 'C':
                    if (x < input.length()) x++;
                    break;

                case 'D':
                    if (x > 0) x--;
                    break;
            }
        }
        else if (c == 9) {
            for (int i = 0; i < 4; i++) {
                input.insert(x, 1, ' ');
                x++;
            }
        }
        else if (is_printable_char) {
            input.insert(x, 1, c);
            x++;
        }

        set_term_pos_x(3);
        write_term(create_string(input.c_str(), " "));
        set_term_pos_x(3 + x);
        flush_term();
    }

    write_term("\n");
    flush_term();
    resume_flush_term();

    return input;
}
