import { renderToStaticMarkup } from "react-dom/server";
import { Home } from "./components/Home";
import { ContentPage } from "./components/ContentPage";
import { contentPages } from "./data/pages";

export function renderPages() {
  return [
    { path: "/", html: renderToStaticMarkup(<Home onStart={() => {}} onOpenRoom={() => {}} />) },
    ...contentPages.map((page) => ({ ...page, html: renderToStaticMarkup(<ContentPage page={page} />) }))
  ];
}
