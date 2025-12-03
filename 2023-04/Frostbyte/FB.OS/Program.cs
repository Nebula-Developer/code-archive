using System;

namespace FB.OS;

public static class Program {
    public static void Main(String[] args) {
        Console.WriteLine("This is a test.");
        Console.ReadKey();
        double mathTest = 0;

        for (int i = 0; i < 10000; i++) {
            Console.WriteLine(i);
            mathTest = Math.PI * i;
        }

        Console.WriteLine("Math test: " + mathTest);

        Console.ReadKey();
    }
}