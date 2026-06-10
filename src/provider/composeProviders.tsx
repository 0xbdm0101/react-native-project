import React from "react";

/**
 * 将多个 Provider 组合成一个组件
 * 替代 foxact/compose-context-provider，纯 React 实现
 *
 * 用法：
 *   composeProviders(
 *     [StorageProvider, {}],
 *     [I18nProvider, { locale: 'zh' }],
 *     [SwrProvider, {}],
 *   )
 */
export function composeProviders(
  ...providers: Array<
    | [React.ComponentType<React.PropsWithChildren>, Record<string, unknown>?]
    | React.ComponentType<React.PropsWithChildren>
  >
) {
  return ({ children }: React.PropsWithChildren) =>
    providers.reduceRight((acc, provider) => {
      const [Provider, props] = Array.isArray(provider)
        ? provider
        : [provider, {}];
      return <Provider {...props}>{acc}</Provider>;
    }, children as React.ReactElement);
}
