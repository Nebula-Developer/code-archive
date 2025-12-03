using SFML.Window;

namespace VN;

public static class VisualNovelEvents {
    public class Event<EventType> {
        public Dictionary<Element, EventHandler<EventType>> Events { get; private set; } = new Dictionary<Element, EventHandler<EventType>>();
        public void Add(Element element, Action<EventType> elmHandler, Action<EventHandler<EventType>> callback) {
            EventHandler<EventType> handler = (_, e) => { elmHandler(e); };
            Events.Add(element, handler);
            callback(handler);
        }
        public void Remove(Element element, Action<EventHandler<EventType>> callback) {
            callback(Events[element]);
            Events.Remove(element);
        }
    }

    public static Event<SizeEventArgs> ResizeEvents { get; private set; } = new Event<SizeEventArgs>();
    public static Event<KeyEventArgs> KeyPressEvents { get; private set; } = new Event<KeyEventArgs>();
    public static Event<KeyEventArgs> KeyReleaseEvents { get; private set; } = new Event<KeyEventArgs>();
    public static Event<MouseButtonEventArgs> MousePressEvents { get; private set; } = new Event<MouseButtonEventArgs>();
    public static Event<MouseButtonEventArgs> MouseReleaseEvents { get; private set; } = new Event<MouseButtonEventArgs>();
    public static Event<MouseMoveEventArgs> MouseMoveEvents { get; private set; } = new Event<MouseMoveEventArgs>();
    public static Event<MouseWheelScrollEventArgs> MouseScrollEvents { get; private set; } = new Event<MouseWheelScrollEventArgs>();

    public static void AddElement(Element e) {
        ResizeEvents.Add(e, e.Resize, (handler) => { VisualNovel.Window.Resized += handler; });
        KeyPressEvents.Add(e, e.KeyPress, (handler) => { VisualNovel.Window.KeyPressed += handler; });
        KeyReleaseEvents.Add(e, e.KeyRelease, (handler) => { VisualNovel.Window.KeyReleased += handler; });
        MousePressEvents.Add(e, e.MousePress, (handler) => { VisualNovel.Window.MouseButtonPressed += handler; });
        MouseReleaseEvents.Add(e, e.MouseRelease, (handler) => { VisualNovel.Window.MouseButtonReleased += handler; });
        MouseMoveEvents.Add(e, e.MouseMove, (handler) => { VisualNovel.Window.MouseMoved += handler; });
        MouseScrollEvents.Add(e, e.MouseScroll, (handler) => { VisualNovel.Window.MouseWheelScrolled += handler; });
    }

    public static void RemoveElement(Element e) {
        ResizeEvents.Remove(e, (handler) => { VisualNovel.Window.Resized -= handler; });
        KeyPressEvents.Remove(e, (handler) => { VisualNovel.Window.KeyPressed -= handler; });
        KeyReleaseEvents.Remove(e, (handler) => { VisualNovel.Window.KeyReleased -= handler; });
        MousePressEvents.Remove(e, (handler) => { VisualNovel.Window.MouseButtonPressed -= handler; });
        MouseReleaseEvents.Remove(e, (handler) => { VisualNovel.Window.MouseButtonReleased -= handler; });
        MouseMoveEvents.Remove(e, (handler) => { VisualNovel.Window.MouseMoved -= handler; });
        MouseScrollEvents.Remove(e, (handler) => { VisualNovel.Window.MouseWheelScrolled -= handler; });
    }
}
