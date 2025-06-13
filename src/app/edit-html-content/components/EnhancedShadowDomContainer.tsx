import React, { useEffect, useRef, useMemo } from "react";
import { AssetBlockProps } from "@/types/templates";
import { usePathname } from "next/navigation";

interface EnhancedShadowDomContainerProps {
  htmlContent: string;
  cssContent?: string;
  blocks: AssetBlockProps[];
  onEditBlock: (block: AssetBlockProps) => void;
  onToggleBlockVisibility: (blockId: string, ignoreBlock: number) => void;
  assetTypeIcon?: string | null;
  onUnmatchedBlocks?: (blockIds: string[]) => void;
}

const EnhancedShadowDomContainer: React.FC<EnhancedShadowDomContainerProps> = ({ 
  htmlContent, 
  cssContent = "", 
  blocks,
  onEditBlock,
  onToggleBlockVisibility,
  assetTypeIcon,
  onUnmatchedBlocks
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  const getPathName = usePathname();  

  const isApproverPage = getPathName === "/approver-page"

  // Filter blocks that should be editable
  const editableBlocks = useMemo(() => {
    return blocks.filter(block => 
      block.blockName !== '_global_1' && 
      block.blockData !== "{}" && 
      block.blockData !== ""
    );
  }, [blocks]);

  useEffect(() => {
    // Setup shadow DOM and render content
    if (!containerRef.current) return;
    
    // Create shadow DOM if it doesn't exist
    if (!shadowRootRef.current) {
      shadowRootRef.current = containerRef.current.attachShadow({ mode: "open" });
    }
    
    const shadowRoot = shadowRootRef.current;
    
    // Clear existing content
    while (shadowRoot.firstChild) {
      shadowRoot.removeChild(shadowRoot.firstChild);
    }
    
    // Create and add styles
    const style = document.createElement("style");
    style.textContent = `
      ${cssContent}
      
      /* Add data-block-id attribute to each block for easier selection */
      [data-block-id] {
        position: relative !important;
      }
      
      /* Special style for edit buttons container */
      .edit-button-container {
        position: absolute;
        top: 5px;
        right: -110px; /* Increase spacing from content */
        background-color: rgba(200, 200, 200, 0.9); /* Changed to grey background */
        border: 1px solid #666;
        border-radius: 6px;
        padding: 8px 10px;
        display: ${isApproverPage ? 'none' : 'flex'}; /* Hide on approver page */
        align-items: center;
        gap: 12px; /* More space between buttons */
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }
      
      /* Make SVG icons more visible with white color and thicker strokes */
      .edit-button-container svg {
        stroke: #333;
        fill: #333;
        stroke-width: 2.5px; /* Thicker strokes for better visibility */
      }
      
      /* Ensure the buttons themselves have proper spacing and hover effects */
      .edit-button {
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
      }
      
      .edit-button:hover {
        background-color: rgba(0, 168, 129, 0.2); /* Green hover effect */
      }
      
      /* Green hover effect for SVG icons */
      .edit-button:hover svg {
        stroke: #00A881;
        fill: #00A881;
      }
      
      /* Tooltip styles */
      .edit-tooltip {
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        font-size: 12px;
        padding: 3px 6px;
        border-radius: 3px;
        opacity: 0;
        visibility: hidden;
        white-space: nowrap;
        transition: opacity 0.2s, visibility 0.2s;
      }
      
      /* Show tooltip on hover */
      .edit-button:hover .edit-tooltip {
        opacity: 1;
        visibility: visible;
      }
      
      /* Style links to open in new tab */
      a {
        cursor: pointer;
      }
      
      /* Style for hidden block indicator */
      .hidden-block-indicator {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 3px dashed #ff5555;
        opacity: 0.9; /* Increased opacity for better visibility */
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 9000;
        font-family: Arial, sans-serif;
      }
      
      .hidden-indicator-message {
        background-color: rgba(0, 0, 0, 0.85); /* Darker background */
        color: white;
        padding: 10px 15px; /* Larger padding */
        border-radius: 4px;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5); /* Stronger shadow */
        text-align: center;
        max-width: 80%;
        line-height: 1.3;
        border: 1px solid rgba(255, 255, 255, 0.3); /* Subtle white border */
      }
      
      /* Special treatment for blocks that are hidden */
      [data-block-id].hidden-block {
        position: relative;
        opacity: 0.4; /* Decreased opacity further */
        min-height: 60px;
        border: 3px dashed #ff4400; /* Thicker border */
        background-color: rgba(255, 68, 0, 0.05); /* Very light orange tint */
        background-image: repeating-linear-gradient(
          45deg,
          rgba(255, 68, 0, 0.1),
          rgba(255, 68, 0, 0.1) 10px,
          rgba(255, 68, 0, 0.05) 10px,
          rgba(255, 68, 0, 0.05) 20px
        ); /* Diagonal striped pattern */
      }
    `;
    shadowRoot.appendChild(style);
    
    // Create content container
    const contentContainer = document.createElement("div");
    contentContainer.className = "content-container";
    contentContainer.innerHTML = htmlContent;
    
    // Track found blocks
    const foundBlockIds = new Set<string>();
    
    // Process links to open in new tab
    contentContainer.querySelectorAll('a').forEach(link => {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          window.open(href, '_blank');
        }
      });
    });
    
    // First round: find tables with data-block or id attributes matching our blocks
    editableBlocks.forEach(block => {
      const blockId = block.assetVersionBlockID;
      
      // Different selectors to try
      const selectors = [
        `[data-block="${blockId}"]`,
        `[id="${blockId}"]`,
        `[data-block-id="${blockId}"]`,
        `table[data-block="${blockId}"]`,
        `table[id="${blockId}"]`,
        `table.editable-block[data-block="${block.blockName}"]`,
        `table.st-module-wrapper-table[data-block="${block.blockName}"]`,
        `[data-block="${block.blockName}"]`,
        `[id="${block.blockName}"]`
      ];
      
      // Try each selector until we find a match
      let element = null;
      for (const selector of selectors) {
        element = contentContainer.querySelector(selector);
        if (element) break;
      }
      
      if (element) {
        // Found a match, mark it for edit buttons
        element.setAttribute('data-block-id', blockId);
        foundBlockIds.add(blockId);
        
        // Add edit button container
        const editBtnContainer = document.createElement('div');
        editBtnContainer.className = 'edit-button-container';
        editBtnContainer.dataset.forBlock = blockId;

        const styleMap = {
          "Landing Page": "-95px",
          "LinkedIn": "-120px",
          "Call Script": "-150px",
          "Email": "-120px"
      };
      
      // Apply the correct style or default to -110px
      editBtnContainer.style.right = styleMap[assetTypeIcon as keyof typeof styleMap] || "-110px";
        
        // If the block is hidden, add a visual indicator
        if (block.ignoreBlock === 1) {
          element.classList.add('hidden-block');
          const hiddenIndicator = document.createElement('div');
          hiddenIndicator.className = 'hidden-block-indicator';
          
          const messageBox = document.createElement('div');
          messageBox.className = 'hidden-indicator-message';
          messageBox.textContent = 'Hidden Block: Click "Show" to restore';
          
          hiddenIndicator.appendChild(messageBox);
          element.appendChild(hiddenIndicator);
        }
        
        // Edit button
        const editButton = document.createElement('div');
        editButton.className = 'edit-button';
        editButton.style.position = 'relative';
        editButton.style.cursor = 'pointer';
        
        const editTooltip = document.createElement('span');
        editTooltip.className = 'edit-tooltip';
        editTooltip.textContent = 'Edit';
        editButton.appendChild(editTooltip);
        
        editButton.innerHTML += `
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 39 39" fill="none">
            <path d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        `;
        
        // Add edit click handler
        editButton.addEventListener('click', () => {
          const blockToEdit = blocks.find(b => b.assetVersionBlockID === blockId);
          if (blockToEdit) {
            onEditBlock(blockToEdit);
          }
        });
        
        // Visibility toggle button
        const toggleButton = document.createElement('div');
        toggleButton.className = 'edit-button';
        toggleButton.style.position = 'relative';
        toggleButton.style.cursor = 'pointer';
        
        const toggleTooltip = document.createElement('span');
        toggleTooltip.className = 'edit-tooltip';
        toggleTooltip.textContent = block.ignoreBlock === 0 ? 'Hide' : 'Show';
        toggleButton.appendChild(toggleTooltip);
        
        const isVisible = block.ignoreBlock === 0;
        
        toggleButton.innerHTML += isVisible ? `
          <svg clip-rule="evenodd" width="22" height="22" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path d="m-960-256h1280v800h-1280z" fill="none"></path>
            <path d="m13.673 10.345-3.097 3.096 39.853 39.854 3.097-3.097z" fill="#333" stroke="#333" stroke-width="1"></path>
            <path d="m17.119 19.984 2.915 2.915c-3.191 2.717-5.732 6.099-7.374 9.058l-.005.01c4.573 7.646 11.829 14.872 20.987 13.776 2.472-.296 4.778-1.141 6.885-2.35l2.951 2.95c-4.107 2.636-8.815 4.032-13.916 3.342-9.198-1.244-16.719-8.788-21.46-17.648 2.226-4.479 5.271-8.764 9.017-12.053zm6.63-4.32c2.572-1.146 5.355-1.82 8.327-1.868.165-.001 2.124.092 3.012.238.557.092 1.112.207 1.659.35 8.725 2.273 15.189 10.054 19.253 17.653-1.705 3.443-3.938 6.398-6.601 9.277l-2.827-2.827c1.967-2.12 3.622-4.161 4.885-6.45 0 0-1.285-2.361-2.248-3.643-.619-.824-1.27-1.624-1.954-2.395-.54-.608-2.637-2.673-3.136-3.103-3.348-2.879-7.279-5.138-11.994-5.1-1.826.029-3.582.389-5.249.995z" fill-rule="nonzero" fill="#333" stroke="#333" stroke-width="1"></path>
            <path d="m25.054 27.92 2.399 2.398c-.157.477-.243.987-.243 1.516 0 2.672 2.169 4.841 4.841 4.841.529 0 1.039-.085 1.516-.243l2.399 2.399c-1.158.65-2.494 1.02-3.915 1.02-4.425 0-8.017-3.592-8.017-8.017 0-1.421.371-2.756 1.02-3.914zm6.849-4.101c.049-.001.099-.002.148-.002 4.425 0 8.017 3.593 8.017 8.017 0 .05 0 .099-.001.148z" fill="#333" stroke="#333" stroke-width="1"></path>
          </svg>
        ` : `
          <svg clip-rule="evenodd" width="22" height="22" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path d="m32.513 13.926c10.574.15 19.141 9.894 23.487 18.074 0 0-1.422 2.892-2.856 4.895-.694.969-1.424 1.913-2.191 2.826-.547.65-1.112 1.283-1.698 1.898-5.237 5.5-12.758 9.603-20.7 8.01-8.823-1.77-15.732-9.498-20.058-17.629 0 0 1.248-2.964 2.69-4.964.646-.897 1.324-1.77 2.034-2.617.544-.649 1.108-1.282 1.691-1.897 4.627-4.876 10.564-8.63 17.601-8.596zm-.037 4c-5.89-.022-10.788 3.267-14.663 7.35-.527.555-1.035 1.127-1.527 1.713-.647.772-1.265 1.569-1.854 2.386-.544.755-1.057 1.805-1.451 2.59 3.773 6.468 9.286 12.323 16.361 13.742 6.563 1.317 12.688-2.301 17.016-6.846.529-.555 1.04-1.128 1.534-1.715.7-.833 1.366-1.694 1.999-2.579.557-.778 1.144-1.767 1.588-2.567-3.943-6.657-10.651-13.944-19.003-14.074z" fill="#333" stroke="#333" stroke-width="1.5"></path>
            <path d="m32.158 23.948c4.425 0 8.018 3.593 8.018 8.017 0 4.425-3.593 8.017-8.018 8.017-4.424 0-8.017-3.592-8.017-8.017 0-4.424 3.593-8.017 8.017-8.017zm0 4.009c2.213 0 4.009 1.796 4.009 4.008 0 2.213-1.796 4.009-4.009 4.009-2.212 0-4.008-1.796-4.008-4.009 0-2.212 1.796-4.008 4.008-4.008z" fill="#333" stroke="#333" stroke-width="1.5"></path>
          </svg>
        `;
        
        // Add toggle click handler
        toggleButton.addEventListener('click', () => {
          onToggleBlockVisibility(blockId, block.ignoreBlock);
        });
        
        // Add buttons to container
        // Only add edit button if the block is not hidden
        if (block.ignoreBlock === 0) {
          editBtnContainer.appendChild(editButton);
        }
        editBtnContainer.appendChild(toggleButton);
        
        // Add container to block
        element.appendChild(editBtnContainer);
      }
    });
    
    // Second pass: If table selectors didn't work, try a more direct approach
    if (foundBlockIds.size < editableBlocks.length) {
      // Try to find table elements based on class or table structure
      const allTables = contentContainer.querySelectorAll('table.editable-block, table.st-module-wrapper-table, table');
      
      allTables.forEach(table => {
        // Check data-block attribute
        const blockName = table.getAttribute('data-block');
        const tableId = table.getAttribute('id');
        
        // Find any blocks that might match this table
        editableBlocks.forEach(block => {
          const blockId = block.assetVersionBlockID;
          
          // Skip blocks we've already found
          if (foundBlockIds.has(blockId)) return;
          
          // Check if this table matches any of our blocks
          if (
            (blockName && (blockName === blockId || blockName === block.blockName)) ||
            (tableId && (tableId === blockId || tableId === block.blockName))
          ) {
            // Found a match
            table.setAttribute('data-block-id', blockId);
            foundBlockIds.add(blockId);
            
            // Create edit button container (same as above)
            const editBtnContainer = document.createElement('div');
            editBtnContainer.className = 'edit-button-container';
            editBtnContainer.dataset.forBlock = blockId;
            
            // Add indicator if block is hidden
            if (block.ignoreBlock === 1) {
              table.classList.add('hidden-block');
              const hiddenIndicator = document.createElement('div');
              hiddenIndicator.className = 'hidden-block-indicator';
              
              const messageBox = document.createElement('div');
              messageBox.className = 'hidden-indicator-message';
              messageBox.textContent = 'Hidden Block: Click "Show" to restore';
              
              hiddenIndicator.appendChild(messageBox);
              table.appendChild(hiddenIndicator);
            }
            
            // Edit button
            const editButton = document.createElement('div');
            editButton.className = 'edit-button';
            editButton.style.position = 'relative';
            editButton.style.cursor = 'pointer';
            
            const editTooltip = document.createElement('span');
            editTooltip.className = 'edit-tooltip';
            editTooltip.textContent = 'Edit';
            editButton.appendChild(editTooltip);
            
            editButton.innerHTML += `
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 39 39" fill="none">
                <path d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            `;
            
            editButton.addEventListener('click', () => {
              const blockToEdit = blocks.find(b => b.assetVersionBlockID === blockId);
              if (blockToEdit) {
                onEditBlock(blockToEdit);
              }
            });
            
            // Visibility toggle button
            const toggleButton = document.createElement('div');
            toggleButton.className = 'edit-button';
            toggleButton.style.position = 'relative';
            toggleButton.style.cursor = 'pointer';
            
            const toggleTooltip = document.createElement('span');
            toggleTooltip.className = 'edit-tooltip';
            toggleTooltip.textContent = block.ignoreBlock === 0 ? 'Hide' : 'Show';
            toggleButton.appendChild(toggleTooltip);
            
            const isVisible = block.ignoreBlock === 0;
            
            toggleButton.innerHTML += isVisible ? `
              <svg clip-rule="evenodd" width="22" height="22" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <path d="m-960-256h1280v800h-1280z" fill="none"></path>
                <path d="m13.673 10.345-3.097 3.096 39.853 39.854 3.097-3.097z" fill="#333" stroke="#333" stroke-width="1"></path>
                <path d="m17.119 19.984 2.915 2.915c-3.191 2.717-5.732 6.099-7.374 9.058l-.005.01c4.573 7.646 11.829 14.872 20.987 13.776 2.472-.296 4.778-1.141 6.885-2.35l2.951 2.95c-4.107 2.636-8.815 4.032-13.916 3.342-9.198-1.244-16.719-8.788-21.46-17.648 2.226-4.479 5.271-8.764 9.017-12.053zm6.63-4.32c2.572-1.146 5.355-1.82 8.327-1.868.165-.001 2.124.092 3.012.238.557.092 1.112.207 1.659.35 8.725 2.273 15.189 10.054 19.253 17.653-1.705 3.443-3.938 6.398-6.601 9.277l-2.827-2.827c1.967-2.12 3.622-4.161 4.885-6.45 0 0-1.285-2.361-2.248-3.643-.619-.824-1.27-1.624-1.954-2.395-.54-.608-2.637-2.673-3.136-3.103-3.348-2.879-7.279-5.138-11.994-5.1-1.826.029-3.582.389-5.249.995z" fill-rule="nonzero" fill="#333" stroke="#333" stroke-width="1"></path>
                <path d="m25.054 27.92 2.399 2.398c-.157.477-.243.987-.243 1.516 0 2.672 2.169 4.841 4.841 4.841.529 0 1.039-.085 1.516-.243l2.399 2.399c-1.158.65-2.494 1.02-3.915 1.02-4.425 0-8.017-3.592-8.017-8.017 0-1.421.371-2.756 1.02-3.914zm6.849-4.101c.049-.001.099-.002.148-.002 4.425 0 8.017 3.593 8.017 8.017 0 .05 0 .099-.001.148z" fill="#333" stroke="#333" stroke-width="1"></path>
              </svg>
            ` : `
              <svg clip-rule="evenodd" width="22" height="22" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <path d="m32.513 13.926c10.574.15 19.141 9.894 23.487 18.074 0 0-1.422 2.892-2.856 4.895-.694.969-1.424 1.913-2.191 2.826-.547.65-1.112 1.283-1.698 1.898-5.237 5.5-12.758 9.603-20.7 8.01-8.823-1.77-15.732-9.498-20.058-17.629 0 0 1.248-2.964 2.69-4.964.646-.897 1.324-1.77 2.034-2.617.544-.649 1.108-1.282 1.691-1.897 4.627-4.876 10.564-8.63 17.601-8.596zm-.037 4c-5.89-.022-10.788 3.267-14.663 7.35-.527.555-1.035 1.127-1.527 1.713-.647.772-1.265 1.569-1.854 2.386-.544.755-1.057 1.805-1.451 2.59 3.773 6.468 9.286 12.323 16.361 13.742 6.563 1.317 12.688-2.301 17.016-6.846.529-.555 1.04-1.128 1.534-1.715.7-.833 1.366-1.694 1.999-2.579.557-.778 1.144-1.767 1.588-2.567-3.943-6.657-10.651-13.944-19.003-14.074z" fill="#333" stroke="#333" stroke-width="1.5"></path>
                <path d="m32.158 23.948c4.425 0 8.018 3.593 8.018 8.017 0 4.425-3.593 8.017-8.018 8.017-4.424 0-8.017-3.592-8.017-8.017 0-4.424 3.593-8.017 8.017-8.017zm0 4.009c2.213 0 4.009 1.796 4.009 4.008 0 2.213-1.796 4.009-4.009 4.009-2.212 0-4.008-1.796-4.008-4.009 0-2.212 1.796-4.008 4.008-4.008z" fill="#333" stroke="#333" stroke-width="1.5"></path>
              </svg>
            `;
            
            toggleButton.addEventListener('click', () => {
              onToggleBlockVisibility(blockId, block.ignoreBlock);
            });
            
            // Only add edit button if the block is not hidden
            if (block.ignoreBlock === 0) {
              editBtnContainer.appendChild(editButton);
            }
            editBtnContainer.appendChild(toggleButton);
            table.appendChild(editBtnContainer);
          }
        });
      });
    }
    
    // Add the content to shadow DOM
    shadowRoot.appendChild(contentContainer);
    
    // Get unmatched blocks
    const unmatchedIds = editableBlocks
      .filter(block => !foundBlockIds.has(block.assetVersionBlockID))
      .map(block => block.assetVersionBlockID);
    
    // Trigger callback if provided
    if (onUnmatchedBlocks && unmatchedIds.length > 0) {
      onUnmatchedBlocks(unmatchedIds);
    }
    
    return () => {
      // Cleanup
    };
  }, [htmlContent, cssContent, blocks]);

  return (
    <div 
      ref={containerRef} 
      className="enhanced-shadow-container contents"
      style={{ position: 'relative', width: '100%' }}
    />
  );
};

export default EnhancedShadowDomContainer; 