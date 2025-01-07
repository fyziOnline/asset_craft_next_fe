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

const image_urlControl: ControlElement = {
    type: "Control",
    scope: "#/properties/image_url",
    options: {
        renderer: "CustomTextArea"
    }
}

export const linkedIn_Uischema: VerticalLayout = {
    type: "VerticalLayout",
    elements: [
        sectionsControl,
        image_urlControl
    ]

}