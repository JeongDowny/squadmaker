import React, { HTMLAttributes } from "react";

// iconify-icon 웹 컴포넌트를 JSX에서 사용하기 위한 타입 선언
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "iconify-icon": React.DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          icon?: string;
          width?: string | number;
          height?: string | number;
          rotate?: string | number;
          flip?: string;
          inline?: boolean;
        },
        HTMLElement
      >;
    }
  }
}
