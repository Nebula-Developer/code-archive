#ifndef SIGNAL_HPP
#define SIGNAL_HPP

#include <functional>
#include <csignal>
#include <iostream>
#include <unistd.h>

void signal_handler(int sig, std::function<void()> callback);

#endif
