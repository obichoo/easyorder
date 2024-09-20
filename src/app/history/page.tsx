'use client';

import {FaBox, FaUser, FaTag, FaChevronDown, FaChevronUp} from 'react-icons/fa';
import {useEffect, useState} from 'react';
import getUser from "@/utils/get-user";
import {User} from "@/models/user.model";
import {Order} from "@/models/order.model";
import OrderService from "@/services/order.service";
import {OrderItem} from "@/models/order-item.model";
import {Product} from "@/models/product.model";
import {useRouter} from "next/navigation";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/modal";
import CommentService from "@/services/comment.service";
import Link from "next/link";

const PurchasesHistoryTable = ({ orders, loading }: { orders: Order[], loading: boolean }) => {
    const router = useRouter();
    const [userId, setUserId] = useState<User['_id']>('');
    const [expandedOrders, setExpandedOrders] = useState<Order['_id'][]>([]);
    const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(null); // Pour l'item sélectionné
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Pour l'ordre sélectionné
    const { isOpen: isRatingModalOpen, onOpen: openRatingModal, onClose: closeRatingModal } = useDisclosure(); // Gestion de la modale de notation
    const { isOpen: isConfirmModalOpen, onOpen: openConfirmModal, onClose: closeConfirmModal } = useDisclosure(); // Gestion de la modale de confirmation de réception
    const [rate, setRate] = useState(0); // Note du vendeur
    const [content, setContent] = useState(''); // Commentaire pour la note
    const [isSubmitting, setIsSubmitting] = useState(false); // État de chargement

    useEffect(() => {
        const user: User | null = getUser();
        if (!user) return;
        setUserId(user._id);
    }, []);

    const getStatus = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return 'En attente';
            case 'processing':
                return 'En cours de traitement';
            case 'shipped':
                return 'Expédiée';
            case 'delivered':
                return 'Livrée';
            case 'cancelled':
                return 'Annulée';
            default:
                return 'Statut inconnu';
        }
    };

    const toggleCommandDetails = (order: Order) => {
        if (expandedOrders.includes(order._id as Order['_id'])) {
            setExpandedOrders(expandedOrders.filter((orderId: Order['_id']) => orderId !== order._id));
        } else {
            setExpandedOrders([...expandedOrders, order._id as Order['_id']]);
        }
    };

    const openRatingModalForItem = (orderItem: OrderItem) => {
        setSelectedOrderItem(orderItem); // On enregistre l'item de la commande sélectionné
        openRatingModal(); // On ouvre la modale
    };

    const openConfirmModalForOrder = (order: Order) => {
        setSelectedOrder(order); // On enregistre la commande sélectionnée
        openConfirmModal(); // On ouvre la modale
    };

    const handleConfirmRating = () => {
        setIsSubmitting(true); // Activer le mode "loading"
        CommentService.createComment({
            rate: rate,
            content: content,
            sender_id: userId,
            recipient_id: ((selectedOrderItem?.product_id as Product)?.artisan_id as User)?._id, // Le vendeur à qui la note est attribuée
        })
            .then(() => {
                setRate(0);
                setContent('');
                closeRatingModal(); // Fermer la modale
            })
            .finally(() => {
                setIsSubmitting(false); // Désactiver le mode "loading" après la soumission
            });
    };

    const handleConfirmReception = () => {
        setIsSubmitting(true); // Activer le mode "loading"
        OrderService.updateOrder({
            _id: selectedOrder?._id,
            status: 'delivered', // Marquer la commande comme livrée
        })
            .then(() => {
                (orders.find((order: Order) => order._id === selectedOrder?._id) as Order).status = 'delivered';
                closeConfirmModal(); // Fermer la modale
            })
            .finally(() => {
                setIsSubmitting(false); // Désactiver le mode "loading"
            });
    };

    const handleCloseRatingModal = () => {
        setRate(0);
        setContent('');
        closeRatingModal();
    };

    return (
        <div className="w-full">
            <h2 className="text-4xl font-semibold text-center text-easyorder-black mb-12">
                Historique des achats
            </h2>

            {
                !loading ? (
                    <div>
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            {
                                orders.length === 0 ? (
                                    <div className="flex justify-center items-center h-12">
                                        <p className="text-lg text-easyorder-black">Vous n'avez pas encore effectué d'achat.</p>
                                    </div>
                                ) : (
                                    orders.map((order: Order, index) => (
                                        <div key={order?._id}>
                                            <div className="flex justify-between items-center">
                                                <div className="cursor-pointer flex items-center gap-3" onClick={() => toggleCommandDetails(order)}>
                                                    <div>
                                                        <p className="text-lg font-semibold">Commande n° {index + 1} ({new Date(order.created_at as any).toLocaleDateString()})</p>
                                                        <p>Total
                                                            : {order.total_in_cent ? order.total_in_cent / 100 + ' €' : 'Prix non défini'}</p>
                                                        <p>Statut
                                                            : {getStatus(order.status)} ({new Date(order.updated_at as any).toLocaleDateString()})</p>
                                                    </div>
                                                    <div>
                                                        {
                                                            expandedOrders.includes(order._id as Order['_id']) ? (
                                                                <FaChevronUp/>
                                                            ) : (
                                                                <FaChevronDown/>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    {/* Bouton pour confirmer la réception */}
                                                    {order.status !== 'delivered' && (
                                                        <button
                                                            onClick={() => openConfirmModalForOrder(order)}
                                                            className="bg-easyorder-green text-easyorder-black p-2 shadow rounded hover:bg-easyorder-black hover:text-easyorder-gray transition"
                                                        >
                                                            Confirmer la réception
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div
                                                style={{ height: ((order.items?.length as number) * 128) + 'px' }}
                                                className={`transition-all duration-300 ease-in-out overflow-hidden ${!expandedOrders.includes(order._id as Order['_id']) && '!h-0'}`}
                                            >
                                                {order.items?.map((orderItem: OrderItem | any, index: number) => (
                                                    <div key={orderItem?._id} className="grid grid-cols-[112px_auto] gap-3 h-28 mt-4">
                                                        <Link href={`/products/${orderItem.product_id?._id}`} className="relative h-28 w-28">
                                                            <img
                                                                src={orderItem.product_id?.pictures?.[0]?.url || 'https://via.placeholder.com/150'}
                                                                alt={orderItem.product_id?.name}
                                                                className="w-full h-full object-cover rounded-md mr-4 cursor-pointer"
                                                            />
                                                        </Link>

                                                        <div className="flex justify-between items-center">
                                                            <div className="truncate">
                                                                <div
                                                                    className="text-lg font-semibold text-easyorder-black truncate">
                                                                    {orderItem.product_id?.name}
                                                                </div>
                                                                <div className="mt-2 text-sm text-gray-600">
                                                                    <FaUser className="inline-block mr-2"/>
                                                                    <Link href={`/artisans/${orderItem.product_id?.artisan_id?._id}`}>
                                                                        Vendeur :
                                                                        <span className="text-easyorder-green pl-1">
                                                                            {orderItem.product_id?.artisan_id?.name}
                                                                        </span>
                                                                    </Link>
                                                                </div>
                                                                <div className="mt-1 text-sm text-gray-600">
                                                                    <FaTag className="inline-block mr-2"/>
                                                                    Prix
                                                                    : {orderItem?.price_in_cent ? orderItem.price_in_cent / 100 + ' €' : 'Prix non défini'}
                                                                </div>
                                                                <div className="mt-1 text-sm text-gray-600">
                                                                    <FaBox className="inline-block mr-2"/>
                                                                    Quantité : {orderItem.quantity}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    onClick={() => openRatingModalForItem(orderItem)}
                                                                    className="bg-easyorder-green text-easyorder-black p-2 shadow rounded hover:bg-easyorder-black hover:text-easyorder-gray transition"
                                                                >
                                                                    Noter le vendeur
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {
                                                index < orders.length - 1 && <hr className="my-4"/>
                                            }
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-easyorder-green"/>
                    </div>
                )
            }

            {/* Modal for rating the seller */}
            <Modal isOpen={isRatingModalOpen} onClose={handleCloseRatingModal}>
                <ModalContent>
                    <ModalHeader>
                        Noter le vendeur
                    </ModalHeader>
                    <ModalBody>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Note (0-5)</label>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(Number(e.target.value))}
                                min="0"
                                max="5"
                                step={0.5}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Commentaire</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                rows={4}
                            ></textarea>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
                            onClick={handleCloseRatingModal}
                        >
                            Annuler
                        </button>
                        <button
                            className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition"
                            onClick={handleConfirmRating}
                            disabled={isSubmitting} // Désactiver le bouton pendant la requête
                        >
                            {isSubmitting ? 'Chargement...' : 'Confirmer'}
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal for confirming reception */}
            <Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal}>
                <ModalContent>
                    <ModalHeader>
                        Confirmer la réception
                    </ModalHeader>
                    <ModalBody>
                        <p>Êtes-vous sûr d'avoir reçu votre commande ?</p>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
                            onClick={closeConfirmModal}
                        >
                            Annuler
                        </button>
                        <button
                            className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition"
                            onClick={handleConfirmReception}
                            disabled={isSubmitting} // Désactiver le bouton pendant la requête
                        >
                            {isSubmitting ? 'Chargement...' : 'Confirmer'}
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

const SellsHistoryTable = ({ orders, loading }: { orders: Order[], loading: boolean }) => {
    const router = useRouter();
    const [expandedOrders, setExpandedOrders] = useState<Order['_id'][]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // État de chargement

    const statusOptions = [
        { value: 'processing', label: 'En traitement' },
        { value: 'shipped', label: 'Expédiée' },
        { value: 'delivered', label: 'Livrée' },
        { value: 'cancelled', label: 'Annulée' }
    ];

    const getStatus = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return 'En attente';
            case 'processing':
                return 'En traitement';
            case 'shipped':
                return 'Expédiée';
            case 'delivered':
                return 'Livrée';
            case 'cancelled':
                return 'Annulée';
            default:
                return 'Statut inconnu';
        }
    };

    const updateStatus = (status: Order['status']) => {
        setIsSubmitting(true); // Activer le mode "loading"
        OrderService.updateOrder({
            _id: selectedOrder?._id,
            status
        })
            .then(() => {
                (orders.find((order: Order) => order._id === selectedOrder?._id) as Order).status = status;
                setSelectedOrder(null);
                setSelectedStatus('');
                onClose(); // Fermer la modale après la mise à jour
            })
            .catch(e => {
                console.log(e);
            })
            .finally(() => {
                setIsSubmitting(false); // Désactiver le mode "loading"
            });
    };

    const toggleCommandDetails = (order: Order) => {
        if (expandedOrders.includes(order._id as Order['_id'])) {
            setExpandedOrders(expandedOrders.filter((orderId: Order['_id']) => orderId !== order._id));
        } else {
            setExpandedOrders([...expandedOrders, order._id as Order['_id']]);
        }
    };

    const goToProduct = (productId: Product['_id']) => {
        router.push(`/products/${productId}`);
    };

    const openStatusModal = (order: Order) => {
        setSelectedOrder(order);
        setSelectedStatus(order.status as string);
        onOpen();
    };

    const handleConfirm = () => {
        updateStatus(selectedStatus as Order['status']);
    };

    return (
        <div className="w-full">
            <h2 className="text-4xl font-semibold text-center text-easyorder-black mb-12">
                Historique des ventes
            </h2>

            {
                !loading ? (
                    <div>
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            {
                                orders.length === 0 ? (
                                    <div className="flex justify-center items-center h-12">
                                        <p className="text-lg text-easyorder-black">Vous n'avez pas encore effectué de vente.</p>
                                    </div>
                                ) : (
                                    orders.map((order: Order | any, index) => (
                                        <div key={order?._id}>
                                            <div className="flex justify-between items-center">
                                                <div
                                                    className="cursor-pointer flex items-center gap-3"
                                                    onClick={() => toggleCommandDetails(order)}>
                                                    <div>
                                                        <p className="text-lg font-semibold">Commande n° {index + 1} ({new Date(order.created_at as any).toLocaleDateString()})</p>
                                                        <p>Total : {order.total_in_cent ? order.total_in_cent / 100 + ' €' : 'Prix non défini'}</p>
                                                        <p>Statut : {getStatus(order.status)} ({new Date(order.updated_at as any).toLocaleDateString()})</p>
                                                    </div>
                                                    <div>
                                                        {
                                                            expandedOrders.includes(order._id as Order['_id']) ? (
                                                                <FaChevronUp></FaChevronUp>
                                                            ) : (
                                                                <FaChevronDown></FaChevronDown>
                                                            )
                                                        }
                                                    </div>
                                                </div>

                                                <div>
                                                    <button
                                                        onClick={() => openStatusModal(order)}
                                                        className="bg-easyorder-green text-easyorder-black p-2 shadow rounded hover:bg-easyorder-black hover:text-easyorder-gray transition">
                                                        Modifier le statut
                                                    </button>
                                                </div>
                                            </div>

                                            <div
                                                style={{ height: ((order.items?.length as number) * 128) + 'px' }}
                                                className={`transition-all duration-300 ease-in-out overflow-hidden ${!expandedOrders.includes(order._id as Order['_id']) && '!h-0'}`}
                                            >
                                                {order.items?.map((orderItem: OrderItem | any, index: number) => (
                                                    <div key={orderItem?._id}
                                                         className="grid grid-cols-[112px_auto] gap-3 h-28 mt-4">
                                                        <div className="relative h-28 w-28">
                                                            <img
                                                                onClick={() => goToProduct(orderItem.product_id?._id)}
                                                                src={orderItem.product_id?.pictures?.[0]?.url || 'https://via.placeholder.com/150'}
                                                                alt={orderItem.product_id?.name}
                                                                className="w-full h-full object-cover rounded-md mr-4 cursor-pointer"
                                                            />
                                                        </div>

                                                        <div className="truncate">
                                                            <div
                                                                className="text-lg font-semibold text-easyorder-black truncate">
                                                                {orderItem.product_id?.name}
                                                            </div>
                                                            <div className="mt-2 text-sm text-gray-600">
                                                                <FaUser className="inline-block mr-2" />
                                                                Vendu à : {order.user_id?.name}
                                                            </div>
                                                            <div className="mt-1 text-sm text-gray-600">
                                                                <FaTag className="inline-block mr-2" />
                                                                Prix
                                                                : {orderItem?.price_in_cent ? orderItem.price_in_cent / 100 + ' €' : 'Prix non défini'}
                                                            </div>
                                                            <div className="mt-1 text-sm text-gray-600">
                                                                <FaBox className="inline-block mr-2" />
                                                                Quantité : {orderItem.quantity}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {
                                                index < orders.length - 1 &&
                                                <hr className="my-4" />
                                            }
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-easyorder-green" />
                    </div>
                )
            }

            {/* Modal for updating order status */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>
                        Modifier le statut de la commande
                    </ModalHeader>
                    <ModalBody>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                        <button
                            className="bg-easyorder-green text-white px-4 py-2 rounded-md hover:bg-easyorder-black transition"
                            onClick={handleConfirm}
                            disabled={isSubmitting} // Désactiver le bouton pendant la soumission
                        >
                            {isSubmitting ? 'Chargement...' : 'Confirmer'}
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

const History = () => {
    const [role, setRole] = useState<User['role']>("client");
    const [userId, setUserId] = useState<User['_id']>('');
    const [boughtOrders, setBoughtOrders] = useState<Order[]>([]);
    const [soldOrders, setSoldOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const user: User | null = getUser()

        if (!user) return;

        setRole(user.role);
        setUserId(user._id)
    }, [])

    useEffect(() => {
        getOrders()
    }, [userId]);

    const getOrders = () => {
        setLoading(true);

        OrderService.getAllOrders()
            .then(response => {
                setBoughtOrders(response.data.filter((order: Order) => (order.user_id as User)?._id === userId && order.status !== 'pending'));

                if (role === 'artisan') {
                    const soldOrders = response.data.map((order: Order) => {
                        const newOrder: Order = {
                            ...order,
                            items: order.items?.filter((orderItem: OrderItem | any) => orderItem.product_id?.artisan_id?._id === userId) as any
                        };

                        return newOrder;
                    })
                    setSoldOrders(soldOrders.filter((order: Order) => (order?.items?.length as number) > 0 && order.status !== 'pending'));
                }

                setLoading(false);
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <main className={`my-8 px-6  w-full ${role === 'artisan' && 'grid grid-cols-2 gap-10'}`}>
            <PurchasesHistoryTable loading={loading} orders={boughtOrders}/>
            {
                role === 'artisan' &&
                <SellsHistoryTable loading={loading} orders={soldOrders}/>
            }
        </main>
    );
};

export default History;
