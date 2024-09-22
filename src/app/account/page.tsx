'use client';

import {User} from "@/models/user.model";
import {Suspense, useEffect, useState} from "react";
import getUser from "@/utils/get-user";
import ClientProfilePage from "@/app/account/components/customer/page";
import VendorProfilePage from "@/app/account/components/vendor/page";
import {useRouter, useSearchParams} from "next/navigation";
import UserService from "@/services/user.service";
import Loading from "@/app/components/loading/page";

const AccountPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const [role, setRole] = useState<User['role'] | null>(null);

    useEffect(() => {
        const user = getUser();

        if (!user) {
            router.push('/login');
        }

        const userToEdit = searchParams.get('userId')

        if (userToEdit && user?.role === 'admin') {
            UserService.getUserById(userToEdit).then((response) => {
                setRole(response.data?.role)
            })
        } else {
            setRole(user?.role);
        }
    }, [])

    if (!role) return <Loading />

    if (role === 'client' || role === 'admin') {
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