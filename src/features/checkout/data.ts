export const checkoutContent = {
  eyebrow: "Secure Checkout",
  title: "Complete your order",
  description:
    "Confirm your details and delivery preference. We'll follow up to finalize payment and timing.",
  emptyTitle: "Your cart is empty",
  emptyDescription: "Add products from the shop before checking out.",
  successTitle: "Order received",
  successDescription:
    "Thank you. Our team will contact you shortly to confirm delivery and payment.",
} as const;

export const paymentMethods = [
  {
    id: "cod",
    label: "Cash on delivery",
    description: "Pay when your order arrives.",
  },
  {
    id: "card-delivery",
    label: "Card on delivery",
    description: "Pay by card with our courier.",
  },
  {
    id: "transfer",
    label: "Bank transfer",
    description: "We’ll send transfer details after confirmation.",
  },
] as const;

export type PaymentMethodId = (typeof paymentMethods)[number]["id"];

/** Flat delivery fee in QAR; waived above freeShippingFrom */
export const DELIVERY_FEE = 15;
export const FREE_SHIPPING_FROM = 200;

export function getDeliveryFee(subtotal: number) {
  return subtotal >= FREE_SHIPPING_FROM ? 0 : DELIVERY_FEE;
}
