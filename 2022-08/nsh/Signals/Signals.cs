using System;
using System.Runtime.InteropServices;

namespace NSH.Signals {
    public class ShellSignals {
        public static void HandleSignal(PosixSignal signal, Action<PosixSignalContext> callback) {
            PosixSignalRegistration.Create(signal, (sig) => {
                sig.Cancel = true;
                callback(sig);
            });
        }

        public static void HandleIgnoredSignals() {
            HandleSignal(PosixSignal.SIGTSTP, (sig) => {
                Console.WriteLine("SIGTSTP");
            });

            HandleSignal(PosixSignal.SIGQUIT, (sig) => {
                Console.WriteLine("SIGQUIT");
            });

            HandleSignal(PosixSignal.SIGINT, (sig) => {
                Console.WriteLine("SIGINT");
            });
        }
    }
}