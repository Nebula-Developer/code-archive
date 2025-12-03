namespace Iolite;

public static class Arguments {
    public static string? InputFile = null;
    public static string OutputFile = "iolite.out";
    public static bool COutput = false;

    public static Tuple<String, String>[] Args = new Tuple<string, string>[] {
        new Tuple<string, string>("-h | --help", "Display this help message"),
        new Tuple<string, string>("-o | --output", "Spesify the output file"),
        new Tuple<string, string>("-co | --coutput", "Supply the C translation along with the executable")
    };

    public static void PrintHelp() {
        Console.WriteLine("Usage: iolite [options] [file]");
        Console.WriteLine("Options:");

        foreach (var arg in Args) {
            Console.WriteLine(arg.Item1 + "\t\t" + arg.Item2);
        }
    }

    public static void Parse(String[] args) {
        for (int i = 0; i < args.Length; i++) {
            switch (args[i]) {
                case "-h":
                case "--help":
                    PrintHelp();
                    Environment.Exit(0);
                    break;

                case "-o":
                case "--output":
                    if (i + 1 < args.Length) {
                        OutputFile = args[i + 1];
                        i++;
                    } else {
                        Console.WriteLine("Error: No output file specified");
                        Environment.Exit(1);
                    }
                    break;

                case "-co":
                case "--coutput":
                    COutput = true;
                    break;

                default:
                    if (InputFile != null)
                        Console.WriteLine("Warning: Multiple input files specified.");

                    InputFile = args[i];
                    break;
            }
        }

        if (InputFile == null) {
            Console.WriteLine("Error: No input file specified");
            Environment.Exit(1);
        }
    }
}
