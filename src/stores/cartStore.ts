import { defineStore } from 'pinia';
import { formatPrice, formatToBRL } from "@/helpers/formatPrice";
import { createOrder } from "@/api/orderAPI"

export interface Product {
  id: number;
  title: string;
  image_url?: string;
  amount: number;
  price: string;
  store_id: number;
  total_price?: string;
}

export interface CartState {
  items: Product[];
  storeId: number | null;
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    storeId: null,
  }),
  actions: {
    addToCart(product: Product) {
      if (this.storeId === null) {
        this.storeId = product.store_id;
      } else if (this.storeId !== product.store_id) {
        if (!confirm('Esse produto que você adicionará é de uma loja diferente dos produtos do carrinho. Adicionar esse produto fará com que o seu carrinho seja limpo antes da adição. Tem certeza que quer continuar?')) {
          return;
        }
        this.items = [];
        this.storeId = product.store_id;
      }
    
      const numericPrice = product.amount * parseFloat(formatPrice(product.price));
      product.total_price = formatToBRL(numericPrice)

      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.amount += product.amount;
      } else {
        this.items.push({ ...product, amount: product.amount });
      }
    },
    removeFromCart(productId: number) {
      this.items = this.items.filter(item => item.id !== productId);
      if (this.items.length === 0) {
        this.storeId = null;
      }
    },
    clearCart() {
      this.items = [];
      this.storeId = null;
    },
    async checkout() {
      try {
        if (!this.storeId) {
          throw new Error('Não há loja selecionada.');
        }

        const orderData = {
          order: {
            store_id: this.storeId,
            order_items: this.items.map(item => ({
              product_id: item.id,
              amount: item.amount
            }))
          }
        };

        const response = await createOrder(orderData);
        this.clearCart();
        return response;
      } catch (error) {
        // console.error('error:', error);
      }
    },
  },
  getters: {
    totalPrice(state) {
      const total = state.items.reduce((acc, item) => {
        const numericPrice = parseFloat(formatPrice(item.price));
        return acc + numericPrice * item.amount;
      }, 0);
      return formatToBRL(total);
    },
  },
});
