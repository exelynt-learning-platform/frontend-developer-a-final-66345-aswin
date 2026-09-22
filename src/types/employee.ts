export interface employee {
    id: string;
    name: string;
    mail: string;
    ph_no: string;
    country: string;
    state: string;
    city: string;
    avatar?: string;
    role?: string;
    joinedDate?: string;
}

export interface emp_formData {
    name: string;
    mail: string;
    ph_no: string;
    country: string;
    state: string;
    city: string;
}

export interface RawEmployee {
    id?: string | number;
    name?: string;
    mail?: string;
    email?: string;
    emailId?: string;
    ph_no?: string;
    mobile?: string;
    phone?: string;
    country?: string;
    state?: string;
    city?: string;
    district?: string;
    avatar?: string;
    role?: string;
    joinedDate?: string;
    createdAt?: string;
    [key: string]: unknown;
}

export const normalizeEmployee = (raw: RawEmployee): employee => {
    return {
        id: String(raw?.id ?? ''),
        name: raw?.name ?? '',
        mail: raw?.mail || raw?.email || raw?.emailId || '',
        ph_no: raw?.ph_no || raw?.mobile || raw?.phone || '',
        country: raw?.country ?? '',
        state: raw?.state ?? '',
        city: raw?.city || raw?.district || '',
        ...(raw?.avatar ? { avatar: raw.avatar } : {}),
        ...(raw?.role ? { role: raw.role } : {}),
        ...(raw?.joinedDate || raw?.createdAt ? { joinedDate: raw.joinedDate || raw.createdAt } : {})
    }
}