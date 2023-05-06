import { useDispatch, useSelector } from "react-redux";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { Fragment, useEffect } from "react";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending",
        message: "Sending Cart Data",
      })
    );
    const sendCart = async () => {
      const response = await fetch(
        "https://react-redux-fcd3e-default-rtdb.firebaseio.com//cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Sending cart data failed");
      }

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success",
          message: "Sent Cart Data Successfully",
        })
      );
    };

    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCart().catch((err) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending Cart Data failed",
        })
      );
    });
  }, [cart, dispatch]);
  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
