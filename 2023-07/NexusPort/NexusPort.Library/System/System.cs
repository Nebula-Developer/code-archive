using System.IO;

namespace NexusPort.System;

public static partial class Nexus {
    public static void Init() {
        if (!Directory.Exists(Paths.Root)) Directory.CreateDirectory(Paths.Root);
    }
}