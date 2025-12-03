using System.Runtime.InteropServices;
using System;

namespace Prysm.System;

public static class Output {
    // void move(int x, int y)
    [DllImport("printing.lib")]
    public static extern void move(int x, int y);

    // void printfxy(int x, int y, char *str)
    [DllImport("printing.lib")]
    public static extern void printfxy(int x, int y, string str);

    // void print(char *str)
    [DllImport("printing.lib")]
    public static extern void print(string str);

    // void flush()
    [DllImport("printing.lib")]
    public static extern void flush();
}