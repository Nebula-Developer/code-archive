

using engine.Framework.Graphics;
using engine.Framework.Graphics.Renderers;

using SkiaSharp;

public class TestApp : Application {

}

public static class Program {
    public static void Main(string[] args) {
        TestApp app = new();
        GlApplication glApp = new(app);
        
        glApp.Run();

        // MultithreadedBackendLoader loader = new();

        // int counter = 0;
        // for (int i = 0; i < 100; i++) {
        //     Thread.Sleep(Math.Max(1, new Random().Next(1000)));
        //     Task task = loader.PerformLoadTask(() => {
        //         Console.WriteLine(counter++ + " Hello from thread " + Thread.CurrentThread.ManagedThreadId);
        //         // Thread.Sleep(Math.Max(1, new Random().Next(1000)));
        //         // Thread.Sleep(Math.Max(1, new Random().Next(1000)));
        //     });
        // }

        // Console.ReadKey();
    }
}