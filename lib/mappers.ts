import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Product,
  User,
} from "@/types";
import { resolveUserPhotoUrl } from "@/lib/userPhoto";

interface MongoDocument {
  _id: string;
  id?: string;
}

export interface BackendProduct extends MongoDocument {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface BackendUser extends MongoDocument {
  name: string;
  email: string;
  photo?: string;
}

interface BackendOrderProductItem {
  product: BackendProduct | string;
  quantity: number;
}

export interface BackendOrder extends MongoDocument {
  user: string | MongoDocument;
  products: BackendOrderProductItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  orderNumber?: string;
  createdAt: string;
}

export function toId(doc: MongoDocument | string): string {
  if (typeof doc === "string") return doc;
  return doc._id ?? doc.id ?? "";
}

export function mapProduct(product: BackendProduct): Product {
  return {
    id: toId(product),
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category,
  };
}

export function mapUser(user: BackendUser): User {
  return {
    id: toId(user),
    name: user.name,
    email: user.email,
    photoUrl: resolveUserPhotoUrl(user.photo),
  };
}

function mapOrderItem(item: BackendOrderProductItem): OrderItem {
  const product = item.product;

  if (typeof product === "object" && product !== null) {
    return {
      productId: toId(product),
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  }

  return {
    productId: product,
    name: "",
    price: 0,
    quantity: item.quantity,
  };
}

export function mapOrder(order: BackendOrder): Order {
  return {
    id: toId(order),
    orderNumber: order.orderNumber,
    userId: toId(order.user),
    items: order.products.map(mapOrderItem),
    total: order.totalPrice,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
  };
}
