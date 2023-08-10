import { Producto } from './producto.model';
import { ShoppingCartItem } from './shopping-cart-item.model';

export class ShoppingCart {

    items: ShoppingCartItem[] = [];

    constructor(private itemMap: any)
    {
        itemMap.forEach((element: ShoppingCartItem) => {
            this.items.push(element);
        });
    }
    getQty(producto: Producto)
    {
        let item = this.items.filter(item=> item.id === producto.id)[0];
        return item ? item.cantidad : 0;
    }
    get totalItemCount(): number {
        let count = 0;
        this.items.forEach(item => {
            count += item.cantidad;
        });
        return count;
    }
    get totalPrice()
    {
        let count = 0;
        this.items.forEach(item => {
            count += item.totalPrice;
        });
        return count;
    }
}