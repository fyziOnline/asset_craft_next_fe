/**
 * Utility functions for processing HTML content
 */

/**
 * Adds data attributes to block elements in HTML content based on their module ID
 * This is necessary for identifying blocks for editing and toggling visibility
 */
export function addBlockIdentifiers(html: string): string {
  if (!html) return '';

  // Parse the HTML into a DOM structure
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find all module rows (tr elements with mktoModule class)
  const moduleRows = doc.querySelectorAll('tr.mktoModule');
  
  moduleRows.forEach(row => {
    const id = row.getAttribute('id');
    const blockId = row.getAttribute('data-block');
    
    if (id) {
      // Add data-block attribute if not already present
      if (!blockId) {
        row.setAttribute('data-block', id);
      }
    }
  });
  
  // Convert back to HTML string
  return doc.body.innerHTML;
}

/**
 * Creates properly formatted HTML with blocks replaced
 */
export function formatContentWithBlocks(layoutHTML: string, blocksHTML: string): string {
  if (!layoutHTML) return blocksHTML;
  
  return layoutHTML.replace('[(blocks)]', blocksHTML);
}

/**
 * Adds an ID to each block in the HTML
 * Used for creating edit points with the enhanced shadow DOM container
 */
export function processBlockHTML(blockHTML: string, blockName: string, assetVersionBlockID: string, ignoreBlock: number = 0): string {
  if (!blockHTML) return '';
  
  // Try to find the first tr element and add data-block and id attributes
  const parser = new DOMParser();
  const doc = parser.parseFromString(blockHTML, 'text/html');
  
  // First try to target the mktoModule tr
  let targetElement = doc.querySelector('tr.mktoModule');
  
  // If no mktoModule found, try the first tr
  if (!targetElement) {
    targetElement = doc.querySelector('tr');
  }
  
  // If still no target, try table element
  if (!targetElement) {
    targetElement = doc.querySelector('table');
  }
  
  // If we found a target element, add our identification attributes
  if (targetElement) {
    if (!targetElement.hasAttribute('id')) {
      targetElement.setAttribute('id', blockName);
    }
    
    targetElement.setAttribute('data-block', blockName);
    targetElement.setAttribute('data-block-id', assetVersionBlockID);
    
    // Mark hidden blocks with data-hidden attribute
    if (ignoreBlock === 1) {
      targetElement.setAttribute('data-hidden', 'true');
    }
  }
  
  return doc.body.innerHTML;
}

/**
 * Check if HTML content is a table structure
 */
export function isTableStructure(html: string): boolean {
  return html.includes('<table') && html.includes('<tr') && html.includes('<td');
}

/**
 * Generate controls container styles for different asset types
 */
export function getControlsContainerStyles(assetType: string): string {
  // Default styles for controls container
  const defaultStyles = `
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9999;
    pointer-events: all;
  `;
  
  switch (assetType?.toLowerCase()) {
    case 'landing page':
      return `
        ${defaultStyles}
        right: -140px;
      `;
    case 'linkedin':
      return `
        ${defaultStyles}
        right: -120px;
      `;
    default:
      return `
        ${defaultStyles}
        right: -100px;
      `;
  }
} 