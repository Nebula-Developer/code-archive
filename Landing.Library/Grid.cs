public static class Grid {
    public static int[] GetPositions(int width, int offset, int count) {
        int[] positions = new int[count];
        float space = (float)width / (count - 1); // Calculate the spacing correctly

        for (int i = 0; i < count; i++) {
            positions[i] = (int)(i * space) + offset;
        }

        return positions;
    }
}
