#include <iostream>
#include <vector>

#include "util.hpp"

char **stringv_to_charv(std::vector<std::string> stringv) {
    char **charv = new char*[stringv.size() + 1];
    for (int i = 0; i < stringv.size(); i++) {
        charv[i] = new char[stringv[i].length() + 1];
        for (int j = 0; j < stringv[i].length(); j++) {
            charv[i][j] = stringv[i][j];
        }
        charv[i][stringv[i].length()] = '\0';
    }
    charv[stringv.size()] = NULL;
    return charv;
}
