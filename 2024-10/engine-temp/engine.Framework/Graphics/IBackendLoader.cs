using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public interface IBackendLoader {
    Task PerformLoadTask(Action loadAction);
    int[] GetLoad();
}

public class BackendLoader : IBackendLoader {
    private bool _stress = false;
    public Task PerformLoadTask(Action loadAction) {
        _stress = true;
        loadAction();
        _stress = false;
        return Task.CompletedTask;
    }

    public int[] GetLoad() => new int[] { _stress ? 1 : 0 };
}

public class BackendLoaderThread {
    public ConcurrentQueue<LoaderAction> LoadQueue { get; } = new();
    public Thread LoadThread { get; private set; }
    private readonly AutoResetEvent _workAvailable = new(false);
    private bool _running = true;

    public BackendLoaderThread() {
        LoadThread = new Thread(WorkLoop) {
            IsBackground = true
        };
        LoadThread.Start();
    }

    public void Enqueue(LoaderAction loadAction) {
        LoadQueue.Enqueue(loadAction);
        _workAvailable.Set();
    }

    private void WorkLoop() {
        while (_running) {
            _workAvailable.WaitOne();

            while (LoadQueue.TryDequeue(out var loaderAction)) {
                loaderAction.Action();
                loaderAction.TaskCompletionSource.SetResult(true);
            }
        }
    }

    public void Stop() {
        _running = false;
        _workAvailable.Set();
        LoadThread.Join();
    }
}

public struct LoaderAction {
    public Action Action;
    public TaskCompletionSource<bool> TaskCompletionSource;
}

public class MultithreadedBackendLoader : IBackendLoader {
    public List<BackendLoaderThread> Loaders { get; } = new();

    public MultithreadedBackendLoader(int threadCount = 4) {
        for (int i = 0; i < threadCount; i++)
            Loaders.Add(new BackendLoaderThread());
    }

    public Task PerformLoadTask(Action loadAction) {
        var taskCompletionSource = new TaskCompletionSource<bool>();

        var loader = Loaders.OrderBy(l => l.LoadQueue.Count).First();
        loader.Enqueue(new LoaderAction {
            Action = loadAction,
            TaskCompletionSource = taskCompletionSource
        });

        return taskCompletionSource.Task;
    }

    public void StopAll() {
        foreach (var loader in Loaders) {
            loader.Stop();
        }
    }

    public int[] GetLoad() => Loaders.Select(l => l.LoadQueue.Count).ToArray();
}
