import CallScriptPage from "@/app/generate-asset/assetsPromptCreationSection/CallScriptPage"
import EmailPage from "@/app/generate-asset/assetsPromptCreationSection/EmailPage"
import LandingPage from "@/app/generate-asset/assetsPromptCreationSection/LandingPage"
import LinkedInPage from "@/app/generate-asset/assetsPromptCreationSection/LinkedinPage"
import { Template } from "@/types/templates"
import { ComponentType } from "react"

export type PageType = 'Email' | 'LinkedIn' | 'Landing Page' | 'Call Script'

interface PageParams {
    params: {
            template: Template
            project_name?: string
    }
}

const PAGE_COMPONENT : Record<PageType,ComponentType<PageParams>> = {
    'Email' : EmailPage,
    'LinkedIn' : LinkedInPage,
    'Landing Page' : LandingPage,
    'Call Script' : CallScriptPage
}

export default PAGE_COMPONENT