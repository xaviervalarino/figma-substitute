let keyupTimeout;
let regex = true;
document.getElementById("panel").addEventListener("keyup", (e) => {
  if (e.target.tagName === "INPUT" && e.target.value.length) {
    clearTimeout(keyupTimeout);
    keyupTimeout = setTimeout(function () {
      parent.postMessage(
        {
          pluginMessage: {
            type: e.target.id,
            value: e.target.value,
            regex: regex,
          },
        },
        "*"
      );
    }, 700);
  }
});
document.getElementById("set-regex").onclick = (e) => {
  e.preventDefault();
  if (e.currentTarget.className.includes("icon-button--selected")) {
    e.currentTarget.classList.remove("icon-button--selected");
    regex = false;
  } else {
    e.currentTarget.classList.add("icon-button--selected");
    regex = true;
  }
};
document.getElementById("find-button").onclick = () => {
  parent.postMessage({ pluginMessage: { type: "find-button" } }, "*");
};
onmessage = (event) => {
  document.getElementById("count").textContent = event.data.pluginMessage;
};
