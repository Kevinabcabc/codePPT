const versions = [
  {
    data: [
      "\\version_00\\index.html",
      "\\version_00\\index.js",
      "\\version_00\\info.json",
      "\\version_00\\config\\browserRendererConfig.js",
      "\\version_00\\modules\\reactivity.global.js",
      "\\version_00\\renderer\\createRenderer.js",
      "\\version_00\\renderer\\defineAsyncComponent.js",
      "\\version_00\\renderer\\index.js",
      "\\version_00\\symbols\\symbols.js",
      "\\version_00\\tools\\hasPropsChanged.js",
      "\\version_00\\tools\\lis.js",
      "\\version_00\\tools\\queueJob.js",
      "\\version_00\\tools\\resolveProps.js",
      "\\version_00\\tools\\shouldSetAsProps.js",
    ],
    path: "version_00",
    info: { title: "异步组件", info: "初步封装defineAsyncComponent函数" },
  },
  {
    data: [
      "\\version_01\\index.html",
      "\\version_01\\index.js",
      "\\version_01\\info.json",
      "\\version_01\\config\\browserRendererConfig.js",
      "\\version_01\\modules\\reactivity.global.js",
      "\\version_01\\renderer\\createRenderer.js",
      "\\version_01\\renderer\\defineAsyncComponent.js",
      "\\version_01\\renderer\\index.js",
      "\\version_01\\symbols\\symbols.js",
      "\\version_01\\tools\\hasPropsChanged.js",
      "\\version_01\\tools\\lis.js",
      "\\version_01\\tools\\queueJob.js",
      "\\version_01\\tools\\resolveProps.js",
      "\\version_01\\tools\\shouldSetAsProps.js",
    ],
    path: "version_01",
    info: {
      title: "异步组件",
      info: "支持指定超时时长，超时支持配置Error组件",
    },
  },
  {
    data: [
      "\\version_02\\index.js",
      "\\version_02\\index.html",
      "\\version_02\\info.json",
      "\\version_02\\config\\browserRendererConfig.js",
      "\\version_02\\modules\\reactivity.global.js",
      "\\version_02\\renderer\\createRenderer.js",
      "\\version_02\\renderer\\defineAsyncComponent.js",
      "\\version_02\\renderer\\index.js",
      "\\version_02\\tools\\hasPropsChanged.js",
      "\\version_02\\tools\\lis.js",
      "\\version_02\\tools\\queueJob.js",
      "\\version_02\\tools\\resolveProps.js",
      "\\version_02\\tools\\shouldSetAsProps.js",
      "\\version_02\\symbols\\symbols.js",
    ],
    path: "version_02",
    info: { title: "异步组件", info: "处理异步组件加载中发生的错误" },
  },
  {
    data: [
      "\\version_03\\index.html",
      "\\version_03\\index.js",
      "\\version_03\\info.json",
      "\\version_03\\config\\browserRendererConfig.js",
      "\\version_03\\modules\\reactivity.global.js",
      "\\version_03\\renderer\\createRenderer.js",
      "\\version_03\\renderer\\index.js",
      "\\version_03\\symbols\\symbols.js",
      "\\version_03\\renderer\\defineAsyncComponent.js",
      "\\version_03\\tools\\lis.js",
      "\\version_03\\tools\\hasPropsChanged.js",
      "\\version_03\\tools\\queueJob.js",
      "\\version_03\\tools\\resolveProps.js",
      "\\version_03\\tools\\shouldSetAsProps.js",
    ],
    path: "version_03",
    info: { title: "异步组件", info: "支持配置Loading组件以及Loading延迟" },
  },
  {
    data: [
      "\\version_04\\index.html",
      "\\version_04\\index.js",
      "\\version_04\\info.json",
      "\\version_04\\config\\browserRendererConfig.js",
      "\\version_04\\modules\\reactivity.global.js",
      "\\version_04\\symbols\\symbols.js",
      "\\version_04\\renderer\\defineAsyncComponent.js",
      "\\version_04\\renderer\\createRenderer.js",
      "\\version_04\\tools\\lis.js",
      "\\version_04\\renderer\\index.js",
      "\\version_04\\tools\\hasPropsChanged.js",
      "\\version_04\\tools\\queueJob.js",
      "\\version_04\\tools\\resolveProps.js",
      "\\version_04\\tools\\shouldSetAsProps.js",
    ],
    path: "version_04",
    info: {
      title: "异步组件",
      info: "支持配置Loading组件以及Loading延迟--解决umount问题",
    },
  },
  {
    data: [
      "\\version_05\\index.html",
      "\\version_05\\index.js",
      "\\version_05\\info.json",
    ],
    path: "version_05",
    info: { title: "异步组件", info: "重试机制实现原理" },
  },
  {
    data: [
      "\\version_06\\index.html",
      "\\version_06\\index.js",
      "\\version_06\\info.json",
      "\\version_06\\config\\browserRendererConfig.js",
      "\\version_06\\modules\\reactivity.global.js",
      "\\version_06\\renderer\\createRenderer.js",
      "\\version_06\\renderer\\defineAsyncComponent.js",
      "\\version_06\\renderer\\index.js",
      "\\version_06\\symbols\\symbols.js",
      "\\version_06\\tools\\lis.js",
      "\\version_06\\tools\\queueJob.js",
      "\\version_06\\tools\\hasPropsChanged.js",
      "\\version_06\\tools\\shouldSetAsProps.js",
      "\\version_06\\tools\\resolveProps.js",
    ],
    path: "version_06",
    info: { title: "异步组件", info: "重试机制实现" },
  },
  {
    data: [
      "\\version_07\\index.html",
      "\\version_07\\index.js",
      "\\version_07\\info.json",
      "\\version_07\\config\\browserRendererConfig.js",
      "\\version_07\\modules\\reactivity.global.js",
      "\\version_07\\renderer\\createRenderer.js",
      "\\version_07\\renderer\\defineAsyncComponent.js",
      "\\version_07\\renderer\\index.js",
      "\\version_07\\symbols\\symbols.js",
      "\\version_07\\tools\\lis.js",
      "\\version_07\\tools\\hasPropsChanged.js",
      "\\version_07\\tools\\queueJob.js",
      "\\version_07\\tools\\resolveProps.js",
      "\\version_07\\tools\\shouldSetAsProps.js",
    ],
    path: "version_07",
    info: { title: "函数式组件", info: "函数式组件实现" },
  },
];
export default versions;
