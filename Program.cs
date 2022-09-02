using System;
using NSH.Shell;
using NSH.Signals;

namespace NSH {
    public static class Root {
        public static void Main(string[] args) {
            Console.WriteLine("Comp");
            // ShellSignals.HandleIgnoredSignals();
            Autocomplete.GetEnvPath();
            Autocomplete.GetCWDFiles();
            Autocomplete.SortAutocomplete();
            NShell shell = new NShell();
            shell.Init();
        }
    }
}