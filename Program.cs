using System;

namespace Prysm;

public static class Program {
    public static void Main(String[] args) {
        // PrysmScript is a simple scripting language that is used to create
        // complex thinkspaces.
        string[] script = new string[] {
            "var a = 1",
            "log a",
            "a = 2",
            "log a",
        };

        Script.Run(script);
    }
}