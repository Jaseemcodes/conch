import { useEffect } from "react";
import api from "./api";

/**
 * Dynamically applies Meta tags, OpenGraph, Canonical, and Robots indexing to document head
 */
export function applyPageSEO(metaObj = {}, descArg, kwArg) {
  let normalized = metaObj;
  if (typeof metaObj === "string") {
    normalized = {
      title: metaObj,
      description: descArg,
      keywords: kwArg
    };
  }

  const {
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    isIndexable = true
  } = normalized || {};

  // Title
  if (title) {
    document.title = title;
  }

  // Helper to upsert meta tag
  const setMetaTag = (attribute, name, content) => {
    if (!content) return;
    let tag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attribute, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  // Meta Description
  if (description) {
    setMetaTag("name", "description", description);
  }

  // Meta Keywords
  if (keywords) {
    const kwStr = Array.isArray(keywords) ? keywords.join(", ") : keywords;
    setMetaTag("name", "keywords", kwStr);
  }

  // Open Graph
  setMetaTag("property", "og:title", ogTitle || title || "");
  setMetaTag("property", "og:description", ogDescription || description || "");
  if (ogImage) {
    setMetaTag("property", "og:image", ogImage);
  }

  // Robots Indexing
  setMetaTag("name", "robots", isIndexable ? "index, follow" : "noindex, nofollow");

  // Canonical Link
  if (canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }
}

/**
 * React Hook to fetch and apply SEO for a specific page by its pageId
 */
export function usePageSEO(pageId, fallbackDefaults = {}) {
  useEffect(() => {
    let isMounted = true;

    // Apply fallbacks immediately
    if (fallbackDefaults && Object.keys(fallbackDefaults).length > 0) {
      applyPageSEO(fallbackDefaults);
    }

    if (!pageId) return;

    // Fetch live SEO configuration from backend
    api.get(`/seo/page/${pageId}`)
      .then(res => {
        if (isMounted && res.data && res.data.success && res.data.data) {
          applyPageSEO(res.data.data);
        }
      })
      .catch(err => {
        console.warn(`[SEO] Using fallback defaults for page: ${pageId}`);
      });

    return () => {
      isMounted = false;
    };
  }, [pageId]);
}
