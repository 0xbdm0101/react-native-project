import React from "react";

/**
 * I18n Provider（占位）
 *
 * 后续可接入 i18n 库（如 i18next、react-intl、@lingui/react 等）
 * 目前直接透传 children
 */
export const I18nProvider = ({ children }: React.PropsWithChildren) => {
  return <>{children}</>;
};
