import { useLocation } from "react-router-dom";
import { useState } from "react";

const SubscribePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [selectedPlan, setSelectedPlan] = useState("monthly");

  const plans = {
    monthly: {
      name: "Monthly Plan",
      price: 99,
    },
    yearly: {
      name: "Yearly Plan",
      price: 1999,
    },
  };

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          plan: selectedPlan,
        }),
      });

      const data = await res.json();

      // Redirect to Stripe
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      
      <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
      <p className="mb-6 text-gray-600">Subscribed Email: {email}</p>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* Monthly Plan */}
        <div
          onClick={() => setSelectedPlan("monthly")}
          className={`cursor-pointer p-6 rounded-2xl shadow-lg border-2 ${
            selectedPlan === "monthly"
              ? "border-blue-600"
              : "border-gray-200"
          } bg-white`}
        >
          <h2 className="text-xl font-semibold mb-2">Monthly</h2>
          <p className="text-3xl font-bold mb-4">₹99</p>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>✔ Latest cracker updates</li>
            <li>✔ Exclusive offers</li>
            <li>✔ Festival discounts</li>
          </ul>
        </div>

        {/* Yearly Plan */}
        <div
          onClick={() => setSelectedPlan("yearly")}
          className={`cursor-pointer p-6 rounded-2xl shadow-lg border-2 ${
            selectedPlan === "yearly"
              ? "border-blue-600"
              : "border-gray-200"
          } bg-white relative`}
        >
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            SAVE 15%
          </span>

          <h2 className="text-xl font-semibold mb-2">Yearly</h2>
          <p className="text-3xl font-bold mb-4">₹999</p>
          <ul className="text-sm space-y-2 text-gray-600">
            <li>✔ Everything in Monthly</li>
            <li>✔ Priority offers</li>
            <li>✔ Early access deals</li>
          </ul>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handlePayment}
        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default SubscribePage;