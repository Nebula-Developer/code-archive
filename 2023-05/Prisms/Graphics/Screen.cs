using SFML.Graphics;
using SFML.System;
using SFML.Window;
using System.Collections.Generic;
using System;
using System.Linq;

namespace Prisms;

public abstract class Screen {
    protected RenderWindow window;

    public Screen(RenderWindow window) {
        this.window = window;
    }

    public virtual void LoadContent() { }
    public virtual void Update() { }
    public virtual void Draw() { }
    public virtual void Resize() { }
}
