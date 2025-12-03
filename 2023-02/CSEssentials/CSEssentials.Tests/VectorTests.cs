using CSEssentials.Mathematics.Vectors;

namespace CSEssentials.Tests;

public class VectorTests
{
    [Fact]
    public void Vector2_Lerp()
    {
        Assert.Equal(new Vector2(1, 1), Vector2.Lerp(new Vector2(0, 0), new Vector2(2, 2), 0.5f));
    }

    [Fact]
    public void Vector2i_Lerp()
    {
        Assert.Equal(new Vector2i(1, 1), Vector2i.Lerp(new Vector2i(0, 0), new Vector2i(2, 2), 0.5f));
    }

    [Fact]
    public void Vector3_Lerp()
    {
        Assert.Equal(new Vector3(1, 1, 1), Vector3.Lerp(new Vector3(0, 0, 0), new Vector3(2, 2, 2), 0.5f));
    }

    [Fact]
    public void Vector3i_Lerp()
    {
        Assert.Equal(new Vector3i(1, 1, 1), Vector3i.Lerp(new Vector3i(0, 0, 0), new Vector3i(2, 2, 2), 0.5f));
    }

    [Fact]
    public void Vector3_Bezier()
    {
        Vector3[] testMap = new Vector3[]
        {
            new Vector3(0, 0, 0), new Vector3(1, 1, 1),
            new Vector3(2, 2, 2), new Vector3(3, 3, 3),
            new Vector3(4, 4, 4)
        };

        Assert.Equal(new Vector3(1, 1, 1), Vector3.Bezier(testMap, 0.25f));
        Assert.Equal(new Vector3(0.64f, 0.64f, 0.64f), Vector3.Bezier(testMap, 0.16f));
        Console.WriteLine(new Vector3(0.64f, 0.64f, 0.64f));
    }
}
