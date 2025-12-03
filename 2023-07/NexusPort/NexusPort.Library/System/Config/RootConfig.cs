using System.IO;
using System.Text.RegularExpressions;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Diagnostics;

namespace NexusPort.System;

public static class RootConfig {
    public static JSON Root;
    public static JSONBound<int> Initializer;

    static RootConfig() {
        Root = new JSON("NexusConfig.json");
        Initializer = new JSONBound<int>("RootInt", Root, -1);
    }
}
