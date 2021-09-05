import * as React from "react";

declare module "*.md" {
  const content: string;
  export default content;
}

declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot: (options?: MatchImageSnapshotOptions) => R
    }
  }
}

interface Match<G extends { [key: string]: string } | any> {
  // Note that G is only undefined when the RegExp has no named capture groups
  groups: G
}

interface RegExp {
  exec<G extends { [key: string]: string } | undefined>(
    s: string
  ): null | Match<Partial<G>>
}

declare module "*.svg" {
  export const ReactComponent: React.FunctionComponent<React.SVGProps<
  SVGSVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}

// __DISABLE_TRANSITIONS__ variable is injected by Webpack to turn off animations during tests
declare var __DISABLE_TRANSITIONS__: boolean;

// 'react-scroll-sync' doesnt have types
declare module 'react-scroll-sync' {
  export const ScrollSync: React.FC;
  export const ScrollSyncPane: React.FC;
}

declare module '@mdx-js/react' {
  type ComponentType =
    | 'a'
    | 'blockquote'
    | 'code'
    | 'del'
    | 'em'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'hr'
    | 'img'
    | 'inlineCode'
    | 'li'
    | 'ol'
    | 'p'
    | 'pre'
    | 'strong'
    | 'sup'
    | 'table'
    | 'td'
    | 'thematicBreak'
    | 'tr'
    | 'ul'
  export type Components = {
    [key in ComponentType]?: React.ComponentType<any>
  }
  export interface MDXProviderProps {
    children: React.ReactNode
    components: Components
  }
  export class MDXProvider extends React.Component<MDXProviderProps> {}
}