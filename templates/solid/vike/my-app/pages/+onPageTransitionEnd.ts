import consola from "consola";
import type { OnPageTransitionEndAsync } from "vike/types";

export const onPageTransitionEnd: OnPageTransitionEndAsync = async () => {
  consola.debug("Page transition end");
  document.querySelector("body")?.classList.remove("page-is-transitioning");
};
