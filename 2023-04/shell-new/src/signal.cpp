#include <functional>
#include <csignal>
#include <iostream>

void signal_handler(int sig, std::function<void()> callback) {
    signal(sig, [](int sig) {
        if (callback) {
            callback();
        }
    });
}
