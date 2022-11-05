using System;
using System.Runtime.InteropServices;
using System.Diagnostics;

namespace Prysm;

public static class Program {
    // int start_proc(char *exec_name, char **args, int argCount) (prysm_proc.dylib)
    [DllImport("prysm_proc.dylib")]
    public static extern int start_proc(String exec_name, String[] args, int argCount);

    public static void Main(String[] args) {
        // Enable terminal mode
        Console.WriteLine("Enabling terminal mode...");
        Console.Write("\x1b[?1049h");
        
        while(true) {
            String input = Console.ReadLine() ?? "";
            String[] split = input.Split(' ');
            String exec_name = split[0];
            
            start_proc(exec_name, split, split.Length);
        }
    }
}