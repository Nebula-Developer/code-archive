import "./tailwind.css";
import type { JSX } from "solid-js";

export default function LayoutDefault(props: { children?: JSX.Element }) {
  return <div class="w-full min-h-screen h-0 bg-red-500">{props.children}</div>;
}
