using System;
using NSH.Shell;

namespace NSH {
    public static class Root {
        public static void Main(string[] args) {
            NShell shell = new NShell();
            shell.Init();
        }
    }
}