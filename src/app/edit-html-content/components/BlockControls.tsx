import React from 'react';

interface BlockControlsProps {
  assetVersionBlockID: string;
  isVisible: boolean;
  onEdit: (blockId: string) => void;
  onToggleVisibility: (blockId: string, currentState: number) => void;
  ignoreBlock: number;
}

const BlockControls: React.FC<BlockControlsProps> = ({
  assetVersionBlockID,
  isVisible,
  onEdit,
  onToggleVisibility,
  ignoreBlock
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      onEdit(assetVersionBlockID);
    } catch (error) {
      console.error("Error in edit click handler:", error);
    }
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      onToggleVisibility(assetVersionBlockID, ignoreBlock);
    } catch (error) {
      console.error("Error in toggle visibility click handler:", error);
    }
  };

  return (
    <div 
      className="block-controls-wrapper"
      style={{
        position: 'absolute',
        top: '5px',
        right: '5px',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        backgroundColor: '#f9f9f9',
        border: '2px dashed #ccc',
        borderRadius: '5px',
        padding: '4px 8px',
        pointerEvents: 'all',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}
    >
      <div 
        id="handle-button" 
        data-block-id={assetVersionBlockID} 
        data-type-div="edit"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '35px',
          height: '35px',
          cursor: 'pointer',
          borderRight: '2px solid #ccc',
          paddingRight: '5px',
          position: 'relative'
        }}
        onClick={handleEdit}
      >
        <span 
          className="tooltip" 
          style={{
            visibility: 'hidden',
            opacity: 0,
            position: 'absolute',
            top: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#b8b8b8',
            color: 'white',
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s'
          }}
        >
          Edit
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 39 39" fill="none">
          <path 
            d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125"
            stroke="#666666" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z"
            stroke="#666666" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div 
        id="handle-button" 
        data-block-id={assetVersionBlockID} 
        data-type-div="hidden-block"
        data-ignore-block={ignoreBlock}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '35px',
          height: '35px',
          cursor: 'pointer',
          position: 'relative'
        }}
        onClick={handleToggleVisibility}
      >
        <span 
          className="tooltip" 
          style={{
            visibility: 'hidden',
            opacity: 0,
            position: 'absolute',
            top: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#b8b8b8',
            color: 'white',
            fontSize: '12px',
            padding: '4px 8px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s'
          }}
        >
          {isVisible ? 'Hide' : 'Show'}
        </span>
        {isVisible ? (
          <svg clipRule="evenodd" width="33" height="33" fillRule="evenodd" strokeLinejoin="round"
            strokeMiterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="m32.513 13.926c10.574.15 19.141 9.894 23.487 18.074 0 0-1.422 2.892-2.856 4.895-.694.969-1.424 1.913-2.191 2.826-.547.65-1.112 1.283-1.698 1.898-5.237 5.5-12.758 9.603-20.7 8.01-8.823-1.77-15.732-9.498-20.058-17.629 0 0 1.248-2.964 2.69-4.964.646-.897 1.324-1.77 2.034-2.617.544-.649 1.108-1.282 1.691-1.897 4.627-4.876 10.564-8.63 17.601-8.596zm-.037 4c-5.89-.022-10.788 3.267-14.663 7.35-.527.555-1.035 1.127-1.527 1.713-.647.772-1.265 1.569-1.854 2.386-.544.755-1.057 1.805-1.451 2.59 3.773 6.468 9.286 12.323 16.361 13.742 6.563 1.317 12.688-2.301 17.016-6.846.529-.555 1.04-1.128 1.534-1.715.7-.833 1.366-1.694 1.999-2.579.557-.778 1.144-1.767 1.588-2.567-3.943-6.657-10.651-13.944-19.003-14.074z"
              stroke="#666666" 
              fill="#666666"
            />
            <path 
              d="m32.158 23.948c4.425 0 8.018 3.593 8.018 8.017 0 4.425-3.593 8.017-8.018 8.017-4.424 0-8.017-3.592-8.017-8.017 0-4.424 3.593-8.017 8.017-8.017zm0 4.009c2.213 0 4.009 1.796 4.009 4.008 0 2.213-1.796 4.009-4.009 4.009-2.212 0-4.008-1.796-4.008-4.009 0-2.212 1.796-4.008 4.008-4.008z"
              stroke="#666666" 
              fill="#666666"
            />
          </svg>
        ) : (
          <svg clipRule="evenodd" width="33" height="33" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path d="m-960-256h1280v800h-1280z" fill="none" />
            <path d="m13.673 10.345-3.097 3.096 39.853 39.854 3.097-3.097z" fill="#666666" />
            <path d="m17.119 19.984 2.915 2.915c-3.191 2.717-5.732 6.099-7.374 9.058l-.005.01c4.573 7.646 11.829 14.872 20.987 13.776 2.472-.296 4.778-1.141 6.885-2.35l2.951 2.95c-4.107 2.636-8.815 4.032-13.916 3.342-9.198-1.244-16.719-8.788-21.46-17.648 2.226-4.479 5.271-8.764 9.017-12.053zm6.63-4.32c2.572-1.146 5.355-1.82 8.327-1.868.165-.001 2.124.092 3.012.238.557.092 1.112.207 1.659.35 8.725 2.273 15.189 10.054 19.253 17.653-1.705 3.443-3.938 6.398-6.601 9.277l-2.827-2.827c1.967-2.12 3.622-4.161 4.885-6.45 0 0-1.285-2.361-2.248-3.643-.619-.824-1.27-1.624-1.954-2.395-.54-.608-2.637-2.673-3.136-3.103-3.348-2.879-7.279-5.138-11.994-5.1-1.826.029-3.582.389-5.249.995z" fillRule="nonzero" fill="#666666" />
            <path d="m25.054 27.92 2.399 2.398c-.157.477-.243.987-.243 1.516 0 2.672 2.169 4.841 4.841 4.841.529 0 1.039-.085 1.516-.243l2.399 2.399c-1.158.65-2.494 1.02-3.915 1.02-4.425 0-8.017-3.592-8.017-8.017 0-1.421.371-2.756 1.02-3.914zm6.849-4.101c.049-.001.099-.002.148-.002 4.425 0 8.017 3.593 8.017 8.017 0 .05 0 .099-.001.148z" fill="#666666" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default BlockControls; 