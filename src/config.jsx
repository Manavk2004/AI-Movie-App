import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

export const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true 
})

const url = "https://wdaevyjyguqjbkcrsiqo.supabase.co"
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY

export const supabase = createClient(url, apiKey)