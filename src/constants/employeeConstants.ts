export const DEFAULT_PAGE_SIZE = 5

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80'

export const AVATAR_PLACEHOLDERS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
]

export const COUNTRY_FLAG_MAP: Record<string, string> = {
    india: '🇮🇳',
    usa: '🇺🇸',
    'united states': '🇺🇸',
    america: '🇺🇸',
    canada: '🇨🇦',
    uk: '🇬🇧',
    'united kingdom': '🇬🇧',
    britain: '🇬🇧',
    germany: '🇩🇪',
    australia: '🇦🇺',
    france: '🇫🇷',
    japan: '🇯🇵',
    singapore: '🇸🇬'
}

export const getCountryFlag = (countryName: string = ''): string => {
    const name = countryName.toLowerCase().trim()
    for (const [key, flag] of Object.entries(COUNTRY_FLAG_MAP)) {
        if (name.includes(key)) {
            return flag
        }
    }
    return '🌐'
}

export const getAvatarUrl = (id: string, index: number): string => {
    const num = parseInt(id, 10)
    return isNaN(num)
        ? AVATAR_PLACEHOLDERS[index % AVATAR_PLACEHOLDERS.length]
        : AVATAR_PLACEHOLDERS[num % AVATAR_PLACEHOLDERS.length]
}
