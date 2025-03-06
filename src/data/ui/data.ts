import { PRESET_BUTTON_OPTION } from "./types"

export const PresetCropOptions:PRESET_BUTTON_OPTION[] = [
    {
        name: "Square (1:1)",
        aspectRatio : 1/1,
        aspectRatio_style :{
            width: "10px", aspectRatio: "1/1"
        }
    },
    {
        name: "Rectangle (16:9)",
        aspectRatio : 16/9,
        aspectRatio_style : {
            width: "30px", aspectRatio: "16/9"
        }
    },
    {
        name: "Classic (4:3)",
        aspectRatio : 4/3,
        aspectRatio_style : {
            width: "27px", aspectRatio: "4/3"
        }
    },
    {
        name: "Portrait (3:2)",
        aspectRatio : 3/2,
        aspectRatio_style : {
            width: "27px", aspectRatio: "3/2"
        }
    }
]