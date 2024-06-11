import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import { LoadingContext } from "./Loading/Loadingcontext";

function CartState({ children }) {
  const TaxPercentage = 0.02;
  const [Cart, setCart] = useState([]);
  const [Total, setTotal] = useState(0);
  const [TaxAmount, setTaxAmount] = useState(0);
  const [OrderTotal, setOrderTotal] = useState(0);
  let { Loading, setLoading } = useContext(LoadingContext);

  const getCart = async () => {
    setLoading(true);
    let cartData = await axios.get(`http://localhost:6005/cart/`, {
      withCredentials: true,
    });
    let currentTotal = cartData.data.cart.total ? cartData.data.cart.total : 0;
    let taxedAmount = currentTotal * TaxPercentage;
    let currentOrderTotal = taxedAmount + currentTotal;
    setCart(cartData.data.cart.items);
    setTotal(currentTotal);
    setTaxAmount(taxedAmount);
    setOrderTotal(currentOrderTotal);
    setLoading(false);
  };

  useEffect(() => {
    getCart();
  }, []);

  const AddItem = async (productId, quantity, price, type) => {
    try {
      let data = await axios.post(
        `http://localhost:6005/cart/`,
        { productId, quantity, price },
        {
          withCredentials: true,
        }
      );

      toast.success("Item Added!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        draggable: false,
        closeOnClick: false,
        theme: "colored",
        transition: toast.flip,
        onClose: () => {
          if (type == "addToCart") {
            window.location.href = "/bytebazaar/shop";
          } else {
            window.location.href = "/bytebazaar/cart";
          }
        },
      });

      // console.log(data);
    } catch (err) {
      console.log(err.response.status);
      if (err.response.status == "401") {
        window.location.href = "/byteBazaar/login";
      }
      toast.error(err.response.data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        draggable: false,
        closeOnClick: false,
        theme: "colored",
        transition: toast.flip,
        onClose: () => {},
      });
    }
  };

  const RemoveApiCall = async (url) => {
    try {
      let response = await axios.delete(url, {
        withCredentials: true,
      });
      return response;
    } catch (err) {
      if (
        err.response &&
        err.response.status >= 400 &&
        err.response.status <= 500
      ) {
        // window.location.href = "/bytebazaar/login";
        console.log(err);
      }
    }
  };

  const RemoveItem = async (productId, subTotal) => {
    let url = `http://localhost:6005/cart/${productId}?subTotal=${subTotal}`;
    let response = await RemoveApiCall(url);
    getCart();
  };

  const EmptyCart = async () => {
    await RemoveApiCall("http://localhost:6005/cart/");
    setCart([]);
    setTotal(0);
    setTaxAmount(0);
    setOrderTotal(0);
  };

  return (
    <CartContext.Provider
      value={{
        Cart: Cart,
        Total: Total,
        Tax: TaxAmount,
        OrderTotal: OrderTotal,
        getCart,
        AddItem,
        RemoveItem,
        EmptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartState;
