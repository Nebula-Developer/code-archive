import './style.css'
import { render } from "solid-js/web";
import App from "./App";

render(
  () => <App />,
  document.getElementById("app") as HTMLElement
)

window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
