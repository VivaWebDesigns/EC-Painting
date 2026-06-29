import { useEffect } from "react";

interface SeoOptions {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  const matches = Array.from(document.head.querySelectorAll<HTMLMetaElement>(`meta[${attr}="${name}"]`));
  let el = matches[0];
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  matches.slice(1).forEach((duplicate) => duplicate.remove());
  el.setAttribute("content", content);
}

function removeMeta(name: string, property = false) {
  const attr = property ? "property" : "name";
  document.head.querySelectorAll(`meta[${attr}="${name}"]`).forEach((el) => el.remove());
}

export function useSeo({ title, description, ogImage, canonical, noindex }: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;

    if (title) document.title = title;

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, true);
    }

    if (title) setMeta("og:title", title, true);

    if (ogImage) {
      setMeta("og:image", ogImage, true);
    } else {
      removeMeta("og:image", true);
    }

    if (canonical) {
      const matches = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));
      let link = matches[0];
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      matches.slice(1).forEach((duplicate) => duplicate.remove());
      link.setAttribute("href", canonical);
    }

    if (noindex) {
      setMeta("robots", "noindex,nofollow");
    } else {
      removeMeta("robots");
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, ogImage, canonical, noindex]);
}
