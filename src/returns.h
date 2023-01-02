/*
Central return class for all functions
*/

#ifndef RETURNS_H
#define RETURNS_H

#include <iostream>

class Return {
    public:
        Return() {
            this->success = true;
            this->message = "";
        }

        // success, then va list
        Return(bool success, ...) {
            this->success = success;
            va_list args;
            va_start(args, success);
            this->message = va_arg(args, char*);
            va_end(args);
        }

        bool success;
        std::string message;
};

#endif