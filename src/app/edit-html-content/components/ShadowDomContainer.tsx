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

      // Clear old content
      while (shadowRoot.firstChild) {
        shadowRoot.removeChild(shadowRoot.firstChild);
      }

      // Create style element
      const style = document.createElement("style");
      style.textContent = cssContent;
      shadowRoot.appendChild(style);

      // Render HTML content
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = htmlContent;

      // Process all <a> links
      tempContainer.querySelectorAll("a").forEach((link) => {
        link.target = "_blank"; // Open in a new tab
        link.rel = "noopener noreferrer"; // Enhance security
        link.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent default behavior
          const href = link.getAttribute("href");
          if (href) {
            window.open(href, "_blank");
          }
        });
      });

      // Attach content to Shadow DOM
      shadowRoot.appendChild(tempContainer);
    }
  }, [htmlContent, cssContent]);

  return <div
    id="container" // don't remove this
    ref={containerRef}></div>;
};

export default ShadowDomContainer;
