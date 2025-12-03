using System;

namespace VN;

#nullable disable

public static class Mouse {
    public static int CurrentMouseIndex = -1;
    public static Element CurrentElement = null;

    public static bool IsEligibleForMouseHandle(Element element) {
        if (CurrentMouseIndex < element.zIndex || CurrentElement == null || CurrentElement == element) {
            CurrentMouseIndex = element.zIndex;
            CurrentElement = element;
            return true;
        } else {
            return false;
        }
    }

    public static void Leave(Element e) {
        if (CurrentElement == e) {
            CurrentElement = null;
            CurrentMouseIndex = -1;
        }
    }
}
