import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const products = {
  svickova: { name: "Svíčková", price: 15200 },
  rizek: { name: "Řízek", price: 13400 }
};

app.post("/create-session", async (req, res) => {
  const product = products[req.body.product];
  if (!product) return res.status(400).json({ error: "Neznámý produkt" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "czk",
        product_data: { name: product.name },
        unit_amount: product.price
      },
      quantity: 1
    }],
    success_url: "https://majstrmajkl.github.io/Dejsijidlo/success.html",
    cancel_url: "https://majstrmajkl.github.io/Dejsijidlo/cancel.html"
  });

  res.json({ id: session.id });
});

app.listen(3000, () => console.log("Server běží"));
