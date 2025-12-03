#include <iostream>
#include <string>
#include <unordered_map>

class IntegratedCommand {
public:
    IntegratedCommand(const std::string& name, void (*func)()) : name_(name), func_(func) {}

    const std::string& name() const { return name_; }
    void operator()() const { func_(); }

private:
    std::string name_;
    void (*func_)();
};
