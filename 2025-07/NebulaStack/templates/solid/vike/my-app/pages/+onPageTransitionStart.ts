import consola from "consola";
import type { OnPageTransitionStartAsync } from "vike/types";

export const onPageTransitionStart: OnPageTransitionStartAsync = async () => {
  consola.debug("Page transition start");
  document.querySelector("body")?.classList.add("page-is-transitioning");
};
