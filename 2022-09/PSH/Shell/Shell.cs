using System;
using PSH.Input;
using PSH.ConfigHandling;

namespace PSH {
    public class PearlShell {
        /// <summary>
        /// The input handler for the shell.
        /// </summary>
        public PearlInput ShellInput;

        /// <summary>
        /// Base config for the shell.
        /// </summary>
        public Config ShellConfig;

        public PearlShell(PearlInput Input, Config Config) {
            ShellInput = Input;
            ShellConfig = Config;
        }

        /// <summary>
        /// Initializes the shell.
        /// </summary>
        public virtual void Init() {
            Console.WriteLine("Pearl Shell v0.0.0");

            while (true) {
                String input = ShellInput.Read();
                Console.Write("\n");
                if(!Terminal.TermProc.Start(input)) break;
            }

            Console.WriteLine("Exit");
        }
    }
}