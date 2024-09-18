export interface User {
    id?: number;
    email: string;
    password: string;
    name: string;
    role: string | 'artisan' | 'client';
    company: string;
    rating : number;
    subscriber: boolean;
    rate_amount: number;
    profile_pic: string;
    created_at: Date;
    updated_at: Date;
}