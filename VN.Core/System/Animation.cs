using System.Diagnostics;
using SFML.System;

namespace VN;

public static class Animation {
    private static object animationLock = new object();
    private static Dictionary<string, CancellationTokenSource> cancellationTokenSources = new Dictionary<string, CancellationTokenSource>();

    private static int id = 0;
    public static string GenID() => "Animation" + id++;

    public static void Animate(float duration, Action<float> callback, string name) {
        lock (animationLock) {
            if (cancellationTokenSources.ContainsKey(name)) {
                cancellationTokenSources[name].Cancel();
            }

            cancellationTokenSources[name] = new CancellationTokenSource();
            CancellationToken cancellationToken = cancellationTokenSources[name].Token;

            Task task = new Task(() => {
                Clock clock = new Clock();

                while (!cancellationToken.IsCancellationRequested && clock.ElapsedTime.AsMilliseconds() < duration) {
                    callback((float)clock.ElapsedTime.AsMilliseconds() / duration);
                }

                if (!cancellationToken.IsCancellationRequested) {
                    callback(1);
                    cancellationTokenSources.Remove(name);
                }
            }, cancellationToken);

            task.Start();
        }
    }

    public static void Animate(float duration, Action<float> callback, string name, Func<float, float> easing) {
        Animate(duration, (float time) => {
            callback(easing(time));
        }, name);
    }

    public static bool IsAnimating(string name) {
        return cancellationTokenSources.ContainsKey(name) && !cancellationTokenSources[name].IsCancellationRequested;
    }
}
