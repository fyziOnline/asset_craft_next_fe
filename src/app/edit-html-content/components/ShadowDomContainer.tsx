import { useEffect, useRef } from "react";

interface ShadowDomContainerProps {
  htmlContent: string;
  cssContent?: string;
}

const ShadowDomContainer: React.FC<ShadowDomContainerProps> = ({ htmlContent, cssContent = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      let shadowRoot = containerRef.current.shadowRoot;

      if (!shadowRoot) {
        shadowRoot = containerRef.current.attachShadow({ mode: "open" });
      }

      shadowRoot.innerHTML = `
        <style>
          ${cssContent}
        </style>
        ${htmlContent}
      `;
    }
  }, [htmlContent, cssContent]);

  return <div
    id="container" // dont remove it
    ref={containerRef}></div>;
};

export default ShadowDomContainer;
