"use client";

import { useEffect } from "react";
import { contentsHref } from "@/lib/outline";

/**
 * The course grid used to be on the homepage, at /#contents and /#module-N.
 * Old links (bookmarks, shared links, pages a learner saved offline) land
 * here; the hash never reaches the server, so this sends them on to
 * /contents and /contents#module-N in the browser.
 */
export function ContentsRedirect() {
  useEffect(() => {
    const follow = () => {
      const hash = window.location.hash;
      if (hash === "#contents") window.location.replace(contentsHref);
      else if (/^#module-\d+$/.test(hash)) window.location.replace(`${contentsHref}${hash}`);
    };
    follow();
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, []);
  return null;
}
