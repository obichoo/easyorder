'use client';

import {User} from "@/models/user.model";
import {Suspense, useEffect, useState} from "react";
import getUser from "@/utils/get-user";
import ClientProfilePage from "@/app/account/components/customer/page";
import VendorProfilePage from "@/app/account/components/vendor/page";
import {useSearchParams} from "next/navigation";
import UserService from "@/services/user.service";

const AccountPage = () => {
    const searchParams = useSearchParams()
    const [role, setRole] = useState<User['role'] | null>(null);

    useEffect(() => {
        const userToEdit = searchParams.get('userId')
        if (userToEdit) {
            UserService.getUserById(userToEdit).then((response) => {
                setRole(response.data?.role)
            })
        } else {
            setRole(getUser()?.role);
        }
    }, [])

    if (!role) return <div className="text-center text-2xl mt-20 font-bold">Chargement du profil...</div>

    if (role === 'client') {
        return (<ClientProfilePage />)
    } else if (role === 'artisan') {
        return (<VendorProfilePage />)
    }
}

const PageWithSearchParams = () => {
    return (
        <Suspense>
            <AccountPage />
        </Suspense>
    )
}


export default PageWithSearchParams;