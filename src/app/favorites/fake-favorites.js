import {User} from "@/models/user.model";
import {Product} from "@/models/product.model";

const favoriteProducts = [
    {
        id: 1,
        user_id: 1,
        products: [
            {
                id: 1,
                name: 'Product 1',
                description: 'Description 1',
                price_in_cent: 1000,
                stock: 10,
                artisan_id: 1,
                created_at: '2020-01-01',
                updated_at: '2020-01-01'
            },
            {
                id: 2,
                name: 'Product 2',
                description: 'Description 2',
                price_in_cent: 2000,
                stock: 20,
                artisan_id: 2,
                created_at: '2020-01-01',
                updated_at: '2020-01-01'
            }
        ],
    }
];

// export interface FavoriteVendor {
//     id?: number;
//     user_id: User['id'];
//     vendor: Array<Product['id']>;
// }
const favoriteVendors= []

export { favoriteProducts, favoriteVendors };