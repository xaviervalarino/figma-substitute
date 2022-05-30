let keyupTimeout: number;
let regex = true;

document.getElementById("panel").addEventListener("keyup", (e) => {
  const input = e.target as HTMLInputElement;
  if (input.tagName === "INPUT" && input.value.length) {
    clearTimeout(keyupTimeout);
    keyupTimeout = setTimeout(function () {
      parent.postMessage(
        {
          pluginMessage: {
            type: input.id,
            value: input.value,
            regex: regex,
          },
        },
        "*"
      );
    }, 700);
  }
});
document.getElementById("set-regex").onclick = (e) => {
  const el = e.currentTarget as HTMLElement;
  e.preventDefault();
  if (el.className.includes("icon-button--selected")) {
    el.classList.remove("icon-button--selected");
    regex = false;
  } else {
    el.classList.add("icon-button--selected");
    regex = true;
  }
};
document.getElementById("find-button").onclick = () => {
  parent.postMessage({ pluginMessage: { type: "find-button" } }, "*");
};
onmessage = (event) => {
  document.getElementById("count").textContent = event.data.pluginMessage;
};
