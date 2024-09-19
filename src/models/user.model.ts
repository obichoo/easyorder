export interface User {
    _id?: string;
    stripe_id?: string;
    email?: string;
    password?: string;
    name?: string;
    role?: string | 'artisan' | 'client';
    company?: string;
    rating?: number;
    subscriber?: boolean;
    rate_amount?: number;
    profile_pic?: string;
    created_at?: Date;
    updated_at?: Date;
}