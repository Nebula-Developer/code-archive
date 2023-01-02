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
        Return(bool success, std::string message) {
            this->success = success;
            this->message = message;
        }

        bool success;
        std::string message;
};

#endif