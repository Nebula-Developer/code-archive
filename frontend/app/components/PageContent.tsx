"use client";

import { useEffect, useRef } from "react";

export const PageStyles = `
h1, h2, h3, h4, h5, h6, p {
  font-weight: 300;
  margin: 0;
}

h1 { font-size: 3rem; }
h2 { font-size: 2.5rem; }
h3 { font-size: 2rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }

body, .content {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
`;


export default function PageContent({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // if a shadow dom exists, use it, otherwise make one.
    if (ref.current && ref.current.shadowRoot) {
      ref.current.shadowRoot.innerHTML = `<style>${PageStyles}</style> <div class="content">${content}</div>`;
    } else if (ref.current) {
      const shadow = ref.current.attachShadow({ mode: "open" });
      shadow.innerHTML = `<style>${PageStyles}</style> <div class="content">${content}</div>`;
    }
  }, [content]);

  return (
    <div ref={ref} />
  );
}

