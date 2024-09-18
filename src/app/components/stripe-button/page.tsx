'use client';

import StripeService from "@/services/stripe.service";
import {useEffect, useState} from "react";
import {User} from "@/models/user.model";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,

} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js";
import {Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@nextui-org/modal";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

const CheckoutForm = ({clientSecret, resetClientSecret}: any) => {
    const redirectToConfirmation = (event: any) => {
        console.log(event)
        window.location.replace('/payment/confirmation');
    }
    const options: any = {
        clientSecret,
        onComplete: (e:any) => redirectToConfirmation(e),
    }
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    const handleClose = () => {
        resetClientSecret()
        onClose()
    }

    useEffect(() => {
        onOpen()
    }, [])

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Paiement de votre panier</ModalHeader>
                        <ModalBody>
                            <div id="checkout" className="mb-5 rounded-2xl border overflow-hidden">
                                <EmbeddedCheckoutProvider
                                    stripe={stripePromise}
                                    options={options}
                                >
                                    <EmbeddedCheckout/>
                                </EmbeddedCheckoutProvider>
                            </div>
                        </ModalBody>

                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

const StripeButton = ({amount}: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [stripeId, setStripeId] = useState<string>('');
    const [clientSecret, setClientSecret] = useState<string>('');

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user: User = JSON.parse(userJson);
            setStripeId(user.stripe_id as string);
        }
    }, [])

    const handleCheckout = async () => {
        setLoading(true);
        StripeService.createPayment(amount, stripeId).then((res: any) => {
            setLoading(false);
            setClientSecret(res.client_secret);
        })
    };

    const resetClientSecret = () => {
        setClientSecret('')
    }

    return (
        <div>
            <button
                onClick={handleCheckout}
                disabled={loading}
                className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition"
            >
                {loading ? 'Redirection...' : 'Procéder au paiement'}
            </button>
            {clientSecret && <CheckoutForm clientSecret={clientSecret} resetClientSecret={resetClientSecret} />}
        </div>
    );
};

export default StripeButton;