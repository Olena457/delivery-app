// export type Category = {
//   id: number;
//   name: string;
// };

// export type Shop = {
//   id: number;
//   name: string;
//   description?: string;
// };

// export type Product = {
//   id: number;
//   title: string;
//   price: number;
//   image?: string | null; 
//   categoryId: number;
//   shopId: number;
//   category?: Category;
//   rating?: number; 
// };

// export type CartItem = Product & {
//   quantity: number;
// };

// export type UserInfo = {
//   userName: string;
//   userEmail: string;
//   userPhone: string;
//   address: string;
// } | null;

// export type UserState = {
//   info: UserInfo;
//   orderHistory: number[];
//   lastOrderId: number | null; 
// };

// export type CreateOrderDto = {
//   userName: string;
//   userEmail: string;
//   userPhone: string;
//   address: string;
//   items: {
//     itemId: number;
//     quantity: number;
//   }[];
//   totalPrice: number;
// };

// export type OrderHistoryItem = {
//   id: number;
//   createdAt: string;
//   totalPrice: number;
//   status: string;
//   address: string;
//   items: {
//     id: number;
//     quantity: number;
//     item: {
//       title: string;
//       price: number;
//       image: string | null;
//     };
//   }[];
// };

// export type HistoryResponse = OrderHistoryItem[];
export type Category = {
  id: number;
  name: string;
};

export type Shop = {
  id: number;
  name: string;
  description?: string;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  image?: string | null;
  categoryId: number;
  shopId: number;
  category?: Category;
  rating?: number;
  _count?: {
    reviews: number;
  };
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
};

export type CreateOrderDto = {
  userName: string;
  userEmail: string;
  userPhone: string;
  address: string;
  items: {
    itemId: number;
    quantity: number;
  }[];
  totalPrice: number;
};

export type OrderHistoryItem = {
  id: number;
  createdAt: string;
  totalPrice: number;
  status: string;
  address: string;
  items: {
    id: number;
    quantity: number;
    item: {
      title: string;
      price: number;
      image: string | null;
      category?: Category;
    };
  }[];
};

export type HistoryResponse = OrderHistoryItem[];
