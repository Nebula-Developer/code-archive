using SFML.Graphics;
using SFML.System;
using SFML.Window;
using System.Collections.Generic;
using System;
using System.Linq;

namespace Prisms;

public class ScreenManager {
    public RenderWindow window;
    public List<Screen> screens = new();
    public List<Screen> activeScreens = new();

    public ScreenManager(RenderWindow window) {
        this.window = window;
    }
 
    public void LoadScreen(Screen screen, bool loadContent = true) {
        if (!screens.Contains(screen)) {
            screens.Add(screen);
        }

        if (loadContent)
            screen.LoadContent();
        
        activeScreens.Add(screen);
    }

    public void DisableScreen(Screen screen) {
        if (activeScreens.Contains(screen))
            activeScreens.Remove(screen);
    }

    public void UnloadScreen(Screen screen) {
        if (screens.Contains(screen))
            screens.Remove(screen);
    }

    public void UnloadAllScreens() => activeScreens.Clear();

    public void SwitchScreen(Screen screen) {
        UnloadAllScreens();
        LoadScreen(screen);
    }

    private void HandleActiveFunction(Action<Screen> function) {
        for (int i = 0; i < activeScreens.Count; i++) {
            if (activeScreens[i] == null) {
                activeScreens.RemoveAt(i);
                i--;
                continue;
            }

            function(activeScreens[i]);
        }
    }

    public void Update() => HandleActiveFunction(screen => screen.Update());
    public void Draw() => HandleActiveFunction(screen => screen.Draw());
    public void Resize() => HandleActiveFunction(screen => screen.Resize());
}
