/* Public metadata only. No API calls, storage, analytics, or automatic app launch. */
(function (root) {
  "use strict";

  const routes = Object.freeze({
    todo: "todo",
    memo: "content",
    notice: "content",
    content: "content",
    routine: "routine",
    timeline: "timeline",
    schedule: "todo",
    ledger: "ledger",
    "ledger-report": "ledger-report",
  });
  const owns = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

  function identifier(value) {
    return value.length > 0 && value.length <= 80 && !/[^A-Za-z0-9_-]/.test(value);
  }

  function appLinkForSharedUrl(input) {
    if (typeof input !== "string" || input.length > 2048 || /[\u0000-\u0020\u007f]/.test(input)) return null;
    // Exact authority/path match prevents redirects, userinfo, ports, encoded
    // path segments, and alternate schemes. Data is accepted only after '#'.
    const match = /^https:\/\/mkh4327\.github\.io\/withwedo-links\/([a-z-]+)\/#(.+)$/.exec(input);
    if (!match || (!owns(routes, match[1]) && match[1] !== "invite")) return null;
    if (match[1] === "invite") {
      const parts = match[2].split("&");
      if (parts.length !== 1) return null;
      const pair = parts[0].split("=");
      if (pair.length !== 2) return null;
      try {
        const key = decodeURIComponent(pair[0]);
        const code = decodeURIComponent(pair[1]);
        if (key !== "invite_code" || code.length < 8 || code.length > 32 || /[^A-Za-z0-9]/.test(code)) return null;
        // Only fill the existing join form. The app still validates expiry,
        // permissions, and the user's explicit confirmation before joining.
        return "com.gachi.todo://invite?invite_code=" + code.toUpperCase();
      } catch (_) {
        return null;
      }
    }
    const parts = match[2].split("&");
    if (parts.length !== 2) return null;
    const values = Object.create(null);
    try {
      for (const part of parts) {
        const pair = part.split("=");
        if (pair.length !== 2) return null;
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);
        if ((key !== "id" && key !== "group") || owns(values, key) || !identifier(value)) return null;
        values[key] = value;
      }
    } catch (_) {
      // decodeURIComponent fails closed for malformed escapes/invalid UTF-8.
      return null;
    }
    if (!owns(values, "id") || !owns(values, "group")) return null;
    if (match[1] === "ledger-report" && !/^(?:19|20|21)[0-9]{2}-(?:0[1-9]|1[0-2])$/.test(values.id)) return null;
    return "com.gachi.todo://" + routes[match[1]] + "/" + values.id + "?group=" + values.group;
  }

  function activate(document, input) {
    const button = document.getElementById("open-app");
    const status = document.getElementById("link-status");
    if (!button || !status) return;
    const target = appLinkForSharedUrl(input);
    if (!target) {
      button.removeAttribute("href");
      button.setAttribute("aria-disabled", "true");
      button.setAttribute("tabindex", "-1");
      status.textContent = "공유받은 링크를 다시 확인해 주세요.";
      return;
    }
    button.setAttribute("href", target);
    button.removeAttribute("aria-disabled");
    button.removeAttribute("tabindex");
    status.textContent = target.indexOf("com.gachi.todo://invite?") === 0
      ? "앱에서 초대 확인을 눌러 그룹 참여 화면을 열어 보세요."
      : "앱에서 보기를 눌러 공유한 내용을 열어 보세요.";
  }

  if (typeof module === "object" && module.exports) {
    module.exports = { appLinkForSharedUrl, activate };
  } else if (root.document && root.location) {
    activate(root.document, root.location.href);
  }
})(typeof globalThis === "object" ? globalThis : this);
