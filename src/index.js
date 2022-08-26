/// <reference types="vite/client" />

import styles from "./style.css?inline";

/**
 * Register it before joining room:
 * ```js
 * WindowManager.register({
 *   kind: "Speech",
 *   src: Speech
 * })
 * ```
 * Then you can use it in your room:
 * ```js
 * manager.addApp({ kind: 'Speech' })
 * ```
 * Read more about how to make a netless app here:
 * https://github.com/netless-io/window-manager/blob/master/docs/develop-app.md
 *
 * @type {import("@netless/window-manager").NetlessApp}
 */
const Speech = {
  kind: "文本朗读",
  setup(context) {
    const box = context.getBox();
    box.mountStyles(styles);

    const storage = context.createStorage("speech", { textarea: "" });
    const speech = new SpeechSynthesisUtterance();

    const $content = document.createElement("div");
    $content.className = "app-container";
    box.mountContent($content);

    // 文本输入
    const $textarea = document.createElement("textarea");
    $textarea.className = "app-textarea";
    $textarea.placeholder = "请输入文本";
    $content.appendChild($textarea);
    $textarea.addEventListener("input", (e) => {
      storage.setState({ textarea: e.target.value });
    });

    // 操作包裹层
    const $options = document.createElement("div");
    $options.className = "app-options";
    $content.appendChild($options);
    // 开始
    const $speak = document.createElement("button");
    $speak.className = "app-speak";
    $speak.innerText = "朗读";
    $options.appendChild($speak);
    $speak.onclick = ev => {
      storage.setState({ textarea: $textarea.value });
      if (!('speechSynthesis' in window)) {
        throw alert("对不起，您的浏览器不支持")
      }
      // 开始朗读
      if ($textarea.value === "") {
        throw alert("请输入文本")
      }
      speechSynthesis.cancel();
      speech.text = $textarea.value;
      speech.lang = "zh-CN";
      speechSynthesis.speak(speech);
    };
    // 暂停
    const $pause = document.createElement("button");
    $pause.innerText = "暂停";
    $options.appendChild($pause);
    $pause.onclick = ev => {
      speechSynthesis.pause();
    };
    // 继续
    const $resume = document.createElement("button");
    $resume.innerText = "继续";
    $options.appendChild($resume);
    $resume.onclick = ev => {
      speechSynthesis.resume();
    };
    // 清空文本
    const $clear = document.createElement("button");
    $clear.className = "app-clear";
    $clear.innerText = "清空文本";
    $content.appendChild($clear);
    $clear.onclick = ev => {
      $textarea.value = "";
      storage.setState({ textarea: "" });
      speechSynthesis.cancel();
    };

    function refresh() {
      $textarea.value = String(storage.state.textarea);
    }
    const dispose = storage.addStateChangedListener(refresh);
    refresh();

    context.emitter.on("destroy", () => {
      dispose();
    });
  },
};

export default Speech;

