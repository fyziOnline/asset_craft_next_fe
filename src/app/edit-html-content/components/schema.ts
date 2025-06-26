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
        // "allowedTypes": ["Image"],
        // "allowedOrientations": ["Square"]
    }
}

export const UiSchema: VerticalLayout = {
    type: "VerticalLayout",
    elements: [
        sectionsControl,
        image_urlControl,

    ]
}

export const linkedIn_noImage_Uischema: VerticalLayout = {
    type: "VerticalLayout",
    elements: [
        sectionsControl
    ]
}