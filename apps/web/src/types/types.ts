export type Category = {
  id: number;
  name: string;
};

export type Shop = {
  id: number;
  name: string;
  description?: string | null;
  rating: number;
  _count?: {
    reviews: number;
  };
};


export type Product = {
  id: number;
  title: string;
  price: number;
  image?: string | null;
  description?: string | null; 
  isAvailable?: boolean; 
  tags?: string | null; 
  categoryId: number;
  shopId: number;
  category?: Category;
};
export type CategoryFilter = Category & {
  isActive?: boolean;
  isDisabled?: boolean;
};

export type CartItem = Product & {
  quantity: number;
};

export type UserInfo = {
  userName: string;
  userEmail: string;
  userPhone: string;
  address: string;
};

export type UserState = {
  info: UserInfo | null;
  orderHistory: number[];
  lastOrderId: number | null;
  token: string | null;
};

export type OrderLineInput = {
  productId: number;
  quantity: number;
};

export type CreateOrderDto = {
  userName: string;
  userEmail: string;
  userPhone: string;
  address: string;
  items: OrderLineInput[];
  totalPrice: number;
};

export type OrderHistoryLine = {
  id: number;
  quantity: number;
  product: Product;
};

export type OrderHistoryItem = {
  id: number;
  createdAt: string;
  totalPrice: number;
  status: string;
  address: string;
  items: OrderHistoryLine[];
};

export type HistoryResponse = OrderHistoryItem[];

export type PaginatedProducts = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type ProductSort =
  | "price_asc"
  | "price_desc"
  | "title_asc"
  | "title_desc";
