import React from "react";
import { ControlProps, isStringControl, rankWith } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { TextareaAutosize } from "@mui/material";

const CustomTextRenderer = (props: ControlProps) => {
    const { data, handleChange, path, label, required } = props;

    return (
        <div className="relative w-full">
            <div className="absolute top-[-10px] left-[10px] bg-white px-[6px] font-semibold flex transition-all" >
                <div className="peer-hover:text-[#01A982] peer-focus:text-[#01A982] text-[12px]">{label ?? ""}</div>
                {required ? <div className="ml-[2px] text-[red] text-[12px]">{"*"}</div> : null}
            </div>

            <TextareaAutosize
                defaultValue={data}
                onChange={(event) => handleChange(path, event.target.value)}
                minRows={1}
                maxRows={3}
                className="peer w-full border hover:border-[#01A982] focus:border-[#01A982] outline-none p-3 rounded-[8px] resize-none scrollbar-hide"
            />
        </div>
    );
};

// Named export for tester and renderer
export const CustomTextArea = withJsonFormsControlProps(CustomTextRenderer);
export const CustomTextTester = rankWith(4, isStringControl);
