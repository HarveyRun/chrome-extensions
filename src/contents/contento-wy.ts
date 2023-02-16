import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://study.163.com/*"]
}

window.addEventListener("load", () => {
    document.body.style.background = "blue";
})