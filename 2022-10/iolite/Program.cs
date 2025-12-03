using System;

namespace Iolite;

public static class Terminal {
    public static void Main(String[] args) {
        Arguments.Parse(args);

        if (Arguments.InputFile == null) Environment.Exit(1); // This shouldn't happen, but just to make the compiler happy.

        IoliteFormatter formatter = new IoliteFormatter();
        formatter.BeginFormatterSequence(Arguments.InputFile);

        Console.WriteLine(formatter.Data);
    }
}