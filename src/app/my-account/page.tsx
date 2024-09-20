'use client';

import {User} from "@/models/user.model";
import {useEffect, useState} from "react";
import getUser from "@/utils/get-user";
import ClientProfilePage from "@/app/my-account/components/customer/page";
import VendorProfilePage from "@/app/my-account/components/vendor/page";

const MyAccountPage = () => {
    const [role, setRole] = useState<User['role'] | null>(null);

    useEffect(() => {
        setRole(getUser()?.role);
    }, [])

    if (!role) return <div className="text-center text-2xl mt-20 font-bold">Chargement du profil...</div>

    if (role === 'client') {
        return (<ClientProfilePage />)
    } else if (role === 'artisan') {
        return (<VendorProfilePage />)
    }
}

export default MyAccountPage;