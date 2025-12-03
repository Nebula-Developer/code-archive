using System;

namespace PSH.Math {
    public class BezierCurve {
        public float controlX, controlY;

        public BezierCurve(float controlX, float controlY) {
            this.controlX = controlX;
            this.controlY = controlY;
        }

        public PSH.Graphics.Vector2 GetPoint(float t) {
            float x = (float)System.Math.Pow(1 - t, 2) * 0 + 2 * (1 - t) * t * this.controlX + (float)System.Math.Pow(t, 2) * 1;
            float y = (float)System.Math.Pow(1 - t, 2) * 0 + 2 * (1 - t) * t * this.controlY + (float)System.Math.Pow(t, 2) * 1;
            return new PSH.Graphics.Vector2(x, y);
        }
    }
}