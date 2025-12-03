using SFML.Graphics;
using SFML.System;

namespace SFMLE;

public interface Element {
    public void Update() { }
    public void Draw(RenderTarget target, RenderStates states) { }
    public TransformableElement Parent { get; set; }
}
