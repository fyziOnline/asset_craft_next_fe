# Dynamic Asset Type System

This document explains how to use the dynamic asset type system to create and register new asset types through the clientAssetType_select_all API integration.

## Overview

The dynamic asset type system allows you to:

1. Fetch available asset types from the server using the `clientAssetType_select_all` endpoint
2. Automatically register these asset types with default configurations
3. Create custom configurations for specific asset types
4. Use either the `DynamicSection` component for simple asset types or custom components for complex ones

## Components and Files

- **useAssetTypes.ts**: Hook for fetching asset types from the API
- **AssetTypeService.ts**: Service for managing asset types and their configurations
- **useAssetTypeService.ts**: Hook that provides the service functionality to components
- **AssetTypeDemo.tsx**: Example component showing how to use the service

## How to Use

### 1. Basic Usage in a Component

```tsx
import { useAssetTypeService } from '@/hooks/useAssetTypeService';

const MyComponent = () => {
  // Set autoRegister to true to automatically register all asset types
  const { availableAssetTypes, isLoading } = useAssetTypeService(true);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Available Asset Types</h1>
      <ul>
        {availableAssetTypes.map(type => (
          <li key={type.clientAssetTypeID}>{type.assetTypeName}</li>
        ))}
      </ul>
    </div>
  );
};
```

### 2. Custom Asset Type Configuration

```tsx
import { useAssetTypeService } from '@/hooks/useAssetTypeService';
import { AssetTypeConfig } from '@/app/generate-asset/assetsPromptCreationSection/assetTypeFactory';

const MyComponent = () => {
  const { registerCustomAssetType, getAssetTypeByName } = useAssetTypeService();
  
  const handleRegisterCustomType = () => {
    // Define a custom configuration
    const customConfig: AssetTypeConfig = {
      title: 'Custom Newsletter',
      fields: [
        {
          name: 'topic',
          type: 'text',
          label: 'Newsletter Subject',
          placeholder: 'Enter the subject for your newsletter',
          isRequired: true,
          rows: 4
        },
        {
          name: 'audience',
          type: 'dropdown',
          label: 'Target Audience',
          isRequired: true,
          options: [
            { label: 'Executives', value: 'executives' },
            { label: 'Technical Staff', value: 'technical' },
            { label: 'Partners', value: 'partners' }
          ]
        }
      ],
      validationRules: ['topic', 'audience']
    };
    
    // Register a type by name with a custom configuration
    registerCustomAssetType('Newsletter', customConfig);
  };
  
  return (
    <button onClick={handleRegisterCustomType}>
      Register Custom Newsletter Type
    </button>
  );
};
```

### 3. Integration with API Response

The system integrates with the `clientAssetType_select_all` endpoint, which returns data in this format:

```json
{
  "isSuccess": true,
  "errorOnFailure": "string",
  "clientAssetTypes": [
    {
      "clientAssetTypeID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "clientID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "assetTypeID": "3fa85f64-5717-4562-b3fc-2c963f66afa6", 
      "isEnabled": true,
      "assetTypeName": "string",
      "description": "string"
    }
  ]
}
```

## How It Works

1. **Fetching Asset Types**: The `useAssetTypes` hook calls the API to get available asset types.
2. **Asset Type Management**: The `AssetTypeService` provides methods to register and manage these types.
3. **Registration Process**: When you register an asset type, it:
   - Creates a configuration for the asset type
   - Associates the configuration with a component (DynamicSection for simple types)
   - Makes the asset type available in the UI

## Default Fields

By default, each asset type is registered with these fields:

- **Topic**: Text area for the main subject
- **Type**: Dropdown with standard options
- **Key Points**: Text area for important content to include

## Best Practices

1. **Auto-Register for Simple UIs**: Use `useAssetTypeService(true)` to auto-register all asset types with default configurations.
2. **Custom Registration for Complex UIs**: Manually register asset types with custom configurations when you need more control.
3. **Validation**: Always include required fields in the `validationRules` array.
4. **Component Selection**: Use `DynamicSection` for simple asset types, and create custom components for complex ones.

# Asset Types System Documentation

This document explains the centralized asset types system used throughout the application, which ensures consistency and type safety when working with asset types.

## Overview

The system provides:

1. A centralized `AssetType` enum for referencing asset types
2. Helper functions for working with asset types
3. Mapping utilities for converting between different representations of asset types
4. Type-safe access to asset type configurations

## AssetType Enum

The core of the system is the `AssetType` enum defined in `src/types/assetTypes.ts`:

```typescript
export enum AssetType {
  EMAIL = 'Email',
  LINKEDIN = 'LinkedIn',
  LANDING_PAGE = 'Landing Page',
  CALL_SCRIPT = 'Call Script'
}
```

These values match the asset types received from the API.

## Utility Functions

### Asset Type Information

```typescript

// Check if a string is a valid asset type
isValidAssetType('Email') // true
isValidAssetType('Unknown') // false

// Get all available asset types
getAllAssetTypes() // Returns all values in the AssetType enum
```

### URL and Routing Utilities

```typescript
// Convert asset type to a URL-friendly slug
assetTypeToSlug(AssetType.LANDING_PAGE) // "landing-page"

// Convert a slug back to an asset type
slugToAssetType('landing-page') // AssetType.LANDING_PAGE
```

### Extended Utilities (in assetTypeUtils.ts)

```typescript
// Get asset type from URL parameter
getAssetTypeFromParam('Email') // AssetType.EMAIL

// Get URL slug for an asset type
getAssetTypeSlug(AssetType.EMAIL) // "email"

// Convert URL slug to asset type
getAssetTypeFromSlug('email') // AssetType.EMAIL

// Check if an asset type needs special handling
isSpecialAssetType(AssetType.CALL_SCRIPT) // true

// Get comprehensive details about an asset type
getAssetTypeDetails(AssetType.EMAIL) 
/* Returns: {
  type: AssetType.EMAIL,
  description: "Email content for marketing campaigns",
  slug: "email",
  isValid: true,
  isSpecial: false
} */
```

## Integration With Existing Systems

The AssetType enum is integrated with:

1. **Page Mapping**: `PAGE_COMPONENT` in `pageMap.ts` uses the enum as keys
2. **Section Configuration**: `assetSectionConfig` in `assetSections/index.ts` uses the enum as keys
3. **URL Slugs**: `ListTypePage` in `dataGlobal.ts` maps enum values to URL-friendly slugs

## Migrating From String Literals

If you're working with code that still uses string literals, you can convert:

```typescript
// Old way
const assetType = 'Email';
// New way 
const assetType = AssetType.EMAIL;
```

For handling potential string inputs from user input or APIs:

```typescript
// Convert string to AssetType safely
function processAssetType(typeString: string) {
  if (isValidAssetType(typeString)) {
    // It's a valid type, safe to treat as AssetType
    const assetType = typeString as AssetType;
    // Use the asset type...
  } else {
    // Handle invalid type
    console.error(`Invalid asset type: ${typeString}`);
  }
}
```

## Example Usage

### In Component Props

```typescript
interface MyComponentProps {
  assetType: AssetType;
}

const MyComponent: React.FC<MyComponentProps> = ({ assetType }) => {
  // Get the description from the asset type object in your data
  return (
    <div>
      <h1>{assetType} Generator</h1>
      {/* Display the asset type name or get description from API */}
      <p>{assetType}</p>
    </div>
  );
};
```

### In URL Handling

```typescript
// In a page component
const { assetType } = useParams();
const validAssetType = getAssetTypeFromParam(assetType);

if (!validAssetType) {
  return <div>Invalid asset type</div>;
}

// Use the valid asset type
return <AssetForm assetType={validAssetType} />;
``` 