import "markdown-it";
import { MarkdownItRendererOptionsUttori } from "./markdown-it-renderer";

// https://plusreturn.com/blog/how-to-extend-express-request-interface-in-typescript/
/** Add uttori to the Options type. */
declare module "markdown-it" {
  /** Test */
  interface Options {
    uttori: MarkdownItRendererOptionsUttori;
    events: Record<string, string[]>;
  }

}
