export const checkoutContent = {
  eyebrow: "Secure Checkout",
  title: "Complete your order",
  description:
    "Confirm your details and delivery preference. Payment is cash on delivery.",
  emptyTitle: "Your cart is empty",
  emptyDescription: "Add products from the shop before checking out.",
  successTitle: "Order received",
  successDescription:
    "Thank you. Pay cash on delivery when your order arrives. Our team will contact you to confirm timing.",
} as const;

export const paymentMethods = [
  {
    id: "cod",
    label: "Cash on delivery",
    description: "Pay in cash when your order arrives.",
  },
] as const;

export type PaymentMethodId = (typeof paymentMethods)[number]["id"];

/** Flat delivery fee in QAR; waived above freeShippingFrom */
export const DELIVERY_FEE = 15;
export const FREE_SHIPPING_FROM = 200;

export function getDeliveryFee(subtotal: number) {
  return subtotal >= FREE_SHIPPING_FROM ? 0 : DELIVERY_FEE;
}
