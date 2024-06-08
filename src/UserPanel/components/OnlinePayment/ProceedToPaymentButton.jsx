import React from "react";
import { Link } from "react-router-dom";

function ProceedToPaymentButton() {
  return (
    <Link
      to="/onlinePayment"
      type="submit"
      className="w-full inline-flex items-center justify-center rounded bg-Purple py-2 px-3 text-md text-white transition duration-300 hover:bg-gray-800 focus:ring-2 focus:ring-purple-500"
    >
      Proceed to Payment
    </Link>
  );
}

export default ProceedToPaymentButton;
