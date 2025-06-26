import { ControlElement, VerticalLayout } from "@jsonforms/core";

const textControl: ControlElement = {
    type: "Control",
    scope: "#/properties/text",
    options: {
        renderer: "CustomTextArea"
    }
}

const linkControl: ControlElement = {
    type: "Control",
    scope: "#/properties/link",
    options: {
        renderer: "CustomTextArea"
    }
}

const sectionsControl: ControlElement = {
    type: 'Control',
    scope: '#/properties/sections',
    options:
    {
        detail: {
            type: "VerticalLayout",
            elements: [
                textControl,
                linkControl
            ]
        }
    }
}

const builControlSection = () => {
    return sectionsControl
}

// const image_urlControl: ControlElement = {
//     type: "Control",
//     scope: "#/properties/image_url",
//     options: {
//         renderer: "ImagePickerController"
//     }
// }
const image_urlControl: ControlElement = {
    type: "Control",
    scope: "#/properties/image_url",
    options : {
        renderer : "ImagePickerController",
        "allowedTypes": ["Image"],
        "allowedOrientations": ["Square"]
    }
}
const spl_image_urlControl: ControlElement = {
    type: "Control",
    scope: "#/properties/image_url1_width-348_height-380",
    options : {
        renderer : "ImagePickerController",
        "allowedTypes": ["Image"],
        "allowedOrientations": ["Square"]
    }
}
const spl2_image_urlControl: ControlElement = {
    type: "Control",
    scope: "#/properties/image_url2_width-116_height-116",
    options : {
        renderer : "ImagePickerController",
        "allowedTypes": ["Image"],
        "allowedOrientations": ["Square"]
    }
}
const spl3_image_urlControl: ControlElement = {
    type: "Control",
    scope: "#/properties/image_url3_width-116_height-116",
    options : {
        renderer : "ImagePickerController",
        "allowedTypes": ["Image"],
        "allowedOrientations": ["Square"]
    }
}
const spl4_image_urlControl: ControlElement = {
    type: "Control",
    scope: "#/properties/image_url4_width-116_height-116",
    options : {
        renderer : "ImagePickerController",
        "allowedTypes": ["Image"],
        "allowedOrientations": ["Square"]
    }
}
const spl5_image_urlControl: ControlElement = {
    type: "Control",
    scope: "#/properties/image_url4_width-348_height-380",
    options : {
        renderer : "ImagePickerController",
        "allowedTypes": ["Image"],
        "allowedOrientations": ["Square"]
    }
}

// const createImageControl = (propertyName: string): ControlElement => ({
//   type: "Control",
//   scope: `#/properties/${propertyName}`,
//   options: {
//     renderer: "ImagePickerController",
//     "allowedTypes": ["Image"],
//     "allowedOrientations": ["Square"]
//   }
// });
// const generateImageControls = (schema: any): ControlElement[] => {
//   const imageControls: ControlElement[] = [];
  
//   if (schema.properties) {
//     Object.keys(schema.properties).forEach(propName => {
//       if (propName.includes('image_url')) {
//         imageControls.push(createImageControl(propName));
//       }
//     });
//   }
  
//   return imageControls;
// };

export const linkedIn_Uischema: VerticalLayout = {
    type: "VerticalLayout",
    elements: [
        sectionsControl,
        image_urlControl,
        spl_image_urlControl,
        spl2_image_urlControl,
        spl3_image_urlControl,
        spl4_image_urlControl,
        spl5_image_urlControl
    ]
}
// export const linkedIn_Uischema: VerticalLayout = {
//     type: "VerticalLayout",
//     elements: [
//         sectionsControl,
//         image_urlControl
//     ]
// }

export const linkedIn_noImage_Uischema: VerticalLayout = {
    type: "VerticalLayout",
    elements: [
        sectionsControl
    ]
}