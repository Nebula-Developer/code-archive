using System.Runtime.InteropServices;
using System;

namespace PSH.Signals {
    public static class Signal {
        public static void Ignore(PosixSignal signal) {
            PosixSignalRegistration.Create(signal, (sig) => {
                sig.Cancel = true;
            });
        }

        public static void Handle(PosixSignal signal, Action handler, bool cancel = true) {
            PosixSignalRegistration.Create(signal, (sig) => {
                handler();
                if (cancel) sig.Cancel = true;
            });
        }
    }
}