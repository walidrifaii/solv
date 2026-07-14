export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
};

export type CartProductInput = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  imageSrc: string;
  imageAlt: string;
  quantity?: number;
};
