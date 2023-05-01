#ifdef _WIN32
#error "Windows is not natively supported by this shell. If you would like to use this shell on Windows, please use the Windows Subsystem for Linux (WSL)."
#endif

#include <stdio.h>

#include "input.hpp"
#include "exec.hpp"
#include "term.hpp"
#include "signal.hpp"

void signal_handler(int sig);

int main(int argc, char **argv) {
    no_flush_term();
    set_output_mode();
    // With signal() add our Signal Handler to Ctrl-C
    signal(SIGINT, signal_handler);

    while (true) {
        std::string input = read_input();
        int status = execute_primary(input);
    }
}

// Signal handler
void signal_handler(int sig) {
    write_term("Got signal: ");
    write_term(std::to_string(sig));
    write_term("\n");
}
