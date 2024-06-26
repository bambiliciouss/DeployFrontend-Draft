import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  removeItemFromCart,
  removeProductFromCart,
  addProductToCart,
} from "../../actions/cartActions";
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";

import CheckoutSteps from "./CheckoutSteps";
const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { cartProductItems } = useSelector((state) => state.cartProduct);

  const storeBranchinfo = JSON.parse(sessionStorage.getItem("selectedStore"));
  const increaseQty = (id, quantity) => {
    const newQty = quantity + 1;
    dispatch(addItemToCart(id, newQty));
  };
  const decreaseQty = (id, quantity) => {
    const newQty = Math.max(1, quantity - 1);
    dispatch(addItemToCart(id, newQty));
  };

  const increasePQty = (id, quantity) => {
    const newQty = quantity + 1;
    dispatch(addProductToCart(id, newQty));
  };
  const decreasePQty = (id, quantity) => {
    const newQty = Math.max(1, quantity - 1);
    dispatch(addProductToCart(id, newQty));
  };



  const removeCartItemHandler = (id) => {
    console.log(id);
    dispatch(removeItemFromCart(id));
  };

  const removeProductItemHandler = (id) => {
    console.log(id);
    dispatch(removeProductFromCart(id));
  };

  let navigate = useNavigate();

  const checkoutHandler = () => {
    navigate("/containerstatus");
  };
  return (
    <Fragment>
      <AuthNavbar />
      <MetaData title={"Your Cart"} />

      <div
        className="user-profile-container"
        style={{
          minHeight: "700px",
          marginTop: "100px",
          marginLeft: "10%",
          marginRight: "10%",
        }}>
        <CheckoutSteps store gallon />
        <div className="col-md-12">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                <Card className="bg-secondary shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h3 className="mb-0">Your Cart</h3>
                      </Col>
                      <Col xs="4">
                        <button
                          className="btn btn-white btn-block"
                          onClick={() => navigate("/gallon/order")}>
                          Add More Items
                        </button>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <p>
                      <strong>
                        Selected Store: {storeBranchinfo.storebranch.branch}{" "}
                      </strong>
                    </p>{" "}
                    <p>
                      <strong>
                        {" "}
                        Address: {
                          storeBranchinfo.storebranch.address.houseNo
                        }{" "}
                        {storeBranchinfo.storebranch.address.streetName}{" "}
                        {storeBranchinfo.storebranch.address.purokNum}{" "}
                        {storeBranchinfo.storebranch.address.barangay}{" "}
                        {storeBranchinfo.storebranch.address.city}
                      </strong>
                    </p>{" "}
                    {cartItems.length === 0 && cartProductItems.length === 0 ? (
                      <p>Your Cart is Empty</p>
                    ) : (
                      <>
                        <div className="row d-flex justify-content-between">
                          <div className="col-12 col-lg-8">
                            {cartItems.map((item) => (
                              <Fragment>
                                <hr />
                                {/* <div className="cart-item" key={item.gallon_id}>
                                  <div className="row">
                                    <div className="col-3">
                                      <p id="card_item_price">{item.type}</p>
                                    </div>

                                    <div className="col-2">
                                      <p id="card_item_price">
                                      ₱{item.price}.00
                                      </p>
                                    </div>

                                    <button
                                      className="btn btn-danger"
                                      onClick={() =>
                                        decreaseQty(item.gallon, item.quantity)
                                      }>
                                      -
                                    </button>
                                    <div className="col-2">
                                      <p id="card_item_price">
                                        {item.quantity} pc(s)
                                      </p>
                                    </div>
                                    <button
                                      className="btn btn-primary mr-2"
                                      onClick={() =>
                                        increaseQty(item.gallon, item.quantity)
                                      }>
                                      +
                                    </button>

                                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                      <i
                                        id="delete_cart_item"
                                        className="fa fa-trash btn btn-danger"
                                        onClick={() =>
                                          removeCartItemHandler(item.gallon)
                                        }>
                                        Remove
                                      </i>
                                    </div>
                                  </div>
                                </div> */}
                                <div className="cart-item" key={item.gallon_id}>
                                  <div className="row">
                                    <div className="col-3">
                                      <span className="item-type">
                                        {item.type} (REFILL)
                                      </span>
                                    </div>

                                    <div className="col-2">
                                      <span className="item-price">
                                        ₱{item.price}.00
                                      </span>
                                    </div>
                                    <div className="col-4">
                                      <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                          decreaseQty(
                                            item.gallon,
                                            item.quantity
                                          )
                                        }>
                                        -
                                      </button>

                                      <span className="item-quantity">
                                        {item.quantity} pc(s)
                                      </span>

                                      <button
                                        className="btn btn-primary mr-2"
                                        onClick={() =>
                                          increaseQty(
                                            item.gallon,
                                            item.quantity
                                          )
                                        }>
                                        +
                                      </button>
                                    </div>

                                    <div className="col-2">
                                      <i
                                        className="fa fa-trash btn btn-danger delete-cart-item"
                                        onClick={() =>
                                          removeCartItemHandler(item.gallon)
                                        }>
                                        Remove
                                      </i>
                                    </div>
                                  </div>
                                </div>

                                <hr />
                              </Fragment>
                            ))}

                            {cartProductItems.map((itemP) => (
                              <Fragment>
                                <hr />

                                <div
                                  className="cart-item"
                                  key={itemP.gallon_id}>
                                  <div className="row">
                                    <div className="col-3">
                                      <span className="item-type">
                                        {itemP.type.typeofGallon} (NEW
                                        CONTAINER) Total Stocks:{" "}
                                      
                                      </span>
                                    </div>

                                    <div className="col-2">
                                      <span className="item-price">
                                        ₱{itemP.price}.00
                                      </span>
                                    </div>
                                    <div className="col-4">
                                      <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                          decreasePQty(
                                            itemP.product,
                                            itemP.quantity
                                          )
                                        }>
                                        -
                                      </button>

                                      <span className="item-quantity">
                                        {itemP.quantity} pc(s)
                                      </span>

                                      <button
                                        className="btn btn-primary mr-2"
                                        onClick={() =>
                                          increasePQty(
                                            itemP.product,
                                            itemP.quantity
                                          )
                                        }>
                                        +
                                      </button>
                                    </div>

                                    <div className="col-2">
                                      <i
                                        className="fa fa-trash btn btn-danger delete-cart-item"
                                        onClick={() =>
                                          removeProductItemHandler(
                                            itemP.product
                                          )
                                        }>
                                        Remove
                                      </i>
                                    </div>
                                  </div>
                                </div>

                                <hr />
                              </Fragment>
                            ))}
                          </div>

                          <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary">
                              <h4>Order Summary</h4>

                              <hr />

                              <p>
                                No. of Item:{" "}
                                <span className="order-summary-values">
                                  {cartItems.reduce(
                                    (acc, item) => acc + Number(item.quantity),
                                    0
                                  ) +
                                    cartProductItems.reduce(
                                      (acc, itemP) =>
                                        acc + Number(itemP.quantity),
                                      0
                                    )}{" "}
                                  (Units)
                                </span>
                              </p>

                              <p>
                                Total:{" "}
                                <span className="order-summary-values">
                                  ₱
                                  {(
                                    cartItems.reduce(
                                      (acc, item) =>
                                        acc + item.quantity * item.price,
                                      0
                                    ) +
                                    cartProductItems.reduce(
                                      (acc, itemP) =>
                                        acc + itemP.quantity * itemP.price,
                                      0
                                    )
                                  ).toFixed(2)}
                                </span>
                              </p>

                              <hr />

                              <button
                                id="checkout_btn"
                                className="btn btn-primary btn-block"
                                onClick={checkoutHandler}>
                                Check out
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthFooter />
    </Fragment>
  );
};

export default Cart;
