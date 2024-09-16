import Stripe from "stripe";

async function Payment({
  stripe = new Stripe(process.env.STRIPE_KEY),
  payment_method_types = ["card"],
  mode = "payment",
  customer_email,
  metadata = {},
  cancel_url = process.env.Cancel_URL,
  success_url = process.env.Success_URL,
  discounts = [],
  line_items = [],
} = {}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types,
    mode,
    customer_email,
    metadata,
    cancel_url,
    success_url,
    discounts,
    line_items,
  });
  return session;
}

export default Payment;
