import React from 'react'

export type SocialPlatform = 
  | 'instagram'
  | 'facebook'
  | 'x'
  | 'twitter'
  | 'tiktok'
  | 'youtube'
  | 'linkedin'
  | 'pinterest'
  | 'snapchat'
  | 'whatsapp'
  | 'telegram'
  | 'github'
  | 'discord'
  | 'threads'
  | 'default'

interface SocialMediaIconProps extends React.SVGProps<SVGSVGElement> {
  platform: string
}

export const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'x', label: 'X (Twitter)' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'pinterest', label: 'Pinterest' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'github', label: 'GitHub' },
  { id: 'discord', label: 'Discord' },
  { id: 'threads', label: 'Threads' },
]

export default function SocialMediaIcon({ platform, className, ...props }: SocialMediaIconProps) {
  const normalized = platform.toLowerCase().trim()
  
  // Si no hay clase proporcionada, usamos el color por defecto de la marca
  const baseClass = className || ''
  
  switch (normalized) {
    case 'instagram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-[#E1306C]"} {...props}>
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-[#1877F2]"} {...props}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      )
    case 'twitter':
    case 'x':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-black dark:text-white"} {...props}>
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
        </svg>
      )
    case 'tiktok':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-black dark:text-white"} {...props}>
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-[#FF0000]"} {...props}>
          <path d="M2.5 7.1C2.5 7.1 2.3 5.4 3 4.6 3.8 3.7 4.8 3.7 5.2 3.7 7.7 3.5 12 3.5 12 3.5s4.3 0 6.8.2c.4 0 1.4 0 2.2.9.7.8.9 2.5.9 2.5s.2 2.1.2 4.2v1.4c0 2.1-.2 4.2-.2 4.2s-.2 1.7-.9 2.5c-.8.9-1.9.8-2.4.9-1.4.1-6.4.2-6.6.2h-.1c0 0-4.3 0-6.8-.2-.4 0-1.4 0-2.2-.9-.7-.8-.9-2.5-.9-2.5s-.2-2.1-.2-4.2V11.3c0-2.1.2-4.2.2-4.2z"/><path d="m9.7 15.5 6.4-3.6-6.4-3.6z"/>
        </svg>
      )
    case 'linkedin':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-[#0A66C2]"} {...props}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
        </svg>
      )
    case 'pinterest':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-[#E60023]"} {...props}>
          <line x1="12" x2="12" y1="22" y2="2"/><path d="M12 2A10 10 0 0 0 2 12c0 4.3 2.7 8 6.5 9.4.1-1.1.1-3 0-4l-1.5-5.5a13 13 0 0 1 .5-5.5c.7-2.3 2.5-3.6 4.5-3.6 1.8 0 2.8 1.4 2.8 3.1 0 2-1.3 5-2 7.8-.5 2.3 1.2 4.1 3.5 4.1 4.2 0 6.5-5.5 6.5-11.4A8.8 8.8 0 0 0 12 3a8.8 8.8 0 0 0-9.2 8.7c0 1.9.6 3.3 1.8 4.3.2.1.2.3.2.5-.2.8-.5 1.5-.5 1.6-.1.2-.3.3-.5.2-1.7-.6-2.5-2.5-2.5-5.3C2.8 7.3 7 3.3 12 3.3c4 0 7.6 3 7.6 7.6 0 4.4-2.5 7.6-5.8 7.6-1.6 0-3-.9-3.4-1.8 0 0-.7 3-.9 3.6-.3 1.2-1.1 2.7-1.7 3.6A10 10 0 0 0 12 22"/>
        </svg>
      )
    case 'snapchat':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-[#FFFC00]"} {...props}>
          <path d="M11.6 1.1A8.2 8.2 0 0 0 3.8 9c0 1 .3 2 .8 2.8-1.5.3-2.9.8-4.2 1.5.7 1.3 1.9 2 3.3 2.1-.2 1.7.5 3.3 1.8 4.5.3.3.6.4.9.2 1-.4 2-.8 3-.9h.6c1.1 0 2.2.3 3.1.8.8.5 1.8.6 2.7.2.3-.1.6-.3.8-.5 1.3-1.2 2-2.8 1.8-4.5 1.4-.1 2.6-.8 3.3-2.1-1.3-.7-2.7-1.2-4.2-1.5.5-.8.8-1.8.8-2.8 0-4.3-3.8-7.8-8.2-7.7Z"/>
        </svg>
      )
    case 'whatsapp':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-[#25D366]"} {...props}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      )
    case 'telegram':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-[#229ED9]"} {...props}>
          <path d="m15 10-4 4 6 6 4-16-18 7 4 2 2 6 3-4"/>
        </svg>
      )
    case 'github':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-[#181717] dark:text-white"} {...props}>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>
        </svg>
      )
    case 'discord':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-[#5865F2]"} {...props}>
          <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.81 8.42a7.18 7.18 0 0 0-3.3-1.61A2.12 2.12 0 0 0 4.3 8a13.3 13.3 0 0 0-1 8 7.42 7.42 0 0 0 3.48 2.05 13.84 13.84 0 0 0 1.58-2.6 7.4 7.4 0 0 1-2.48-1.16 7.72 7.72 0 0 0 6.62 0 7.4 7.4 0 0 1-2.48 1.16 13.84 13.84 0 0 0 1.58 2.6A7.42 7.42 0 0 0 19.7 16a13.3 13.3 0 0 0-1-8 2.12 2.12 0 0 0-.21-1.21 7.18 7.18 0 0 0-3.3 1.61 10.6 10.6 0 0 0-7.38 0Z"/>
        </svg>
      )
    case 'threads':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-black dark:text-white"} {...props}>
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 13.5936 21.602 15.0935 20.9126 16.4M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12ZM15 12V9.5C15 8.11929 16.1193 7 17.5 7C18.8807 7 20 8.11929 20 9.5V12.5C20 15.5376 17.5376 18 14.5 18C13.1251 18 11.867 17.5 10.8754 16.6667" />
        </svg>
      )
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={baseClass || "text-slate-500"} {...props}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      )
  }
}
