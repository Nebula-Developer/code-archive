using System;
using PSH.Input;
using PSH.ConfigHandling;
using PSH.Math;
using PSH.Graphics;

namespace PSH {
    public class Pearl {
        /// <summary>
        /// Current (and only) shell.
        /// </summary>
        public static PearlShell ShellInstance = new PearlShell(new PearlInput(), new Config());

        public static void Main(string[] args) {
            Console.Clear();

            for (float t = 0; t < 1; t += 0.1f) {
                // Ease in out
                BezierCurve curve = new BezierCurve(0, 1);
                Vector2 point = curve.GetPoint(t);
                point.X = point.X * (float)Console.WindowWidth;
                point.Y = point.Y * (float)Console.WindowHeight;
                Console.SetCursorPosition((int)point.X, (int)point.Y);
                Console.Write("=");
            }

            Console.ReadLine();
            Syntax.PearlSyntax.FetchPathItems();
            ShellInstance.Init();
        }
    }
}