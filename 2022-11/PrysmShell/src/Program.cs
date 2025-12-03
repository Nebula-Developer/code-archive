using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using Prysm.Input;

namespace Prysm;

public static class Program {
    // int exec(char *cmd, char *args[], int argc)
    [DllImport("exec.lib")]
    public static extern int exec(string cmd, string[] args, int argc);
    
    public static void Main(String[] args) {
        while (true) {
            string input = PrysmInput.Read();
            string[] split = input.Split(' ');

            exec(split[0], split, split.Length);
        }
        return;
    }
}