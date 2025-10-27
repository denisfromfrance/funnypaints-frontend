import { type ReactElement, useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Trash, TrashFill } from "react-bootstrap-icons";

import "./css/style.css"
import ScrollTo from "../custom-components/ScrollTo";
import StripePaymentDialog from "../custom-components/StripePaymentDialog";
import { POST } from "../utils/Utils";


export default function Cart(props: any): ReactElement{
    const [products, setProducts] = useState<any[]>([]);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [shippingIsSameAsBillingAddress, setShippingIsSameAsBillingAddress] = useState<boolean>(true);


    const [initiatePayment, setInitiatePayment] = useState(false);

    const clearCart = () => {
      POST("users/cart/clear", {}, () => {

      }, () => {});
    }

    useEffect(() => {
      setProducts(props?.cartItems);
      props?.cartItems.forEach((item: any) => {
        let cost = 0;
        if (item.cost){
          cost += item.cost;
        }
        setTotalCost(cost);
      })
    }, [props?.cartItems]);
    return (
      <>
        {initiatePayment ? <StripePaymentDialog /> : <></>}
        <Row className="page py-5 mt-5 justify-content-center">
          <Col xs={11} md={8} className="d-flex flex-column gap-2">
            {products.map((product) => {
              return (
                <Row className="">
                  <Card className="py-3 ps-4 pe-5">
                    <Row className="justify-content-start justify-content-md-center align-items-center">
                      <Col
                        xs={12}
                        md={4}
                        lg={3}
                        className="d-flex justify-content-center justify-content-md-start align-items-center"
                      >
                        <div
                          className="cart-product-preview"
                          style={{
                            backgroundImage: `url(${product?.modelImageURL})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                          }}
                        ></div>
                      </Col>

                      <Col xs={12} md={6} lg={9}>
                        <Row className="heading-5 justify-content-center justify-content-md-start mb-2 border-bottom">
                          Product Name
                        </Row>
                        <Row>
                          <Col xs={12} md={4}>
                            <Row className="text fw-medium pb-2">Sizes</Row>
                            <Row className="gap-1">
                              <span
                                className="rounded-2 w-auto me-1 px-2 pb-1"
                                style={{
                                  backgroundColor: "#5500FFAA",
                                  color: "white",
                                }}
                              >
                                20x30
                              </span>
                              <span
                                className="rounded-2 w-auto me-1 px-2 pb-1"
                                style={{
                                  backgroundColor: "#5500FFAA",
                                  color: "white",
                                }}
                              >
                                30x40
                              </span>
                              <span
                                className="rounded-2 w-auto me-1 px-2 pb-1"
                                style={{
                                  backgroundColor: "#5500FFAA",
                                  color: "white",
                                }}
                              >
                                30x45
                              </span>
                            </Row>
                          </Col>

                          <Col
                            xs={12}
                            md={4}
                            className="d-flex flex-column justify-content-center align-items-start align-items-md-center pt-2 pt-md-0"
                          >
                            <Row className=" fw-medium">
                              <Col xs={12} className="text fw-medium pb-2 px-0">
                                Subtotal
                              </Col>
                              <Col xs={12} className="w-auto heading-6 px-0">
                                ${product.cost}
                              </Col>
                            </Row>
                          </Col>

                          <Col xs={12} md={4}>
                            <Row className="justify-content-center justify-content-md-end align-items-center">
                              <button className="btn d-none d-md-flex w-auto px-0">
                                <Trash color="#FF0000" className="icon-25x25" />
                              </button>

                              <button className="btn btn-danger d-flex d-md-none w-auto text mt-3 mt-md-0">
                                <Trash className="icon-25x25" />
                                Remove From Cart
                              </button>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Row>
              );
            })}
            <Row className="justify-content-center" id="billing-information">
              <Col
                xs={12}
                md={10}
                lg={8}
                className="pt-5 d-flex flex-column gap-3"
              >
                <Row className="heading-5 fw-bold pt-5 pb-3">
                  Billing details
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <label className="required fw-medium">First name</label>
                    <input type="text" className="form-control" />
                  </Col>
                  <Col xs={12} md={6}>
                    <label className="required fw-medium">Last name</label>
                    <input type="text" className="form-control" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label className="fw-medium">Company name (optional)</label>
                    <input type="text" className=" form-control" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label className="required fw-medium">
                      Country / Region
                    </label>
                    <input type="text" className="form-control" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label>Spain</label>
                    <input type="text" className="form-control" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label className="required fw-medium">
                      Billing Street address
                    </label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="House number and street name"
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                    />
                  </Col>
                  <Col
                    xs={12}
                    className="d-flex flex-row-reverse justify-content-end gap-3 pt-2"
                  >
                    <label className="w-auto text">
                      Shipping address is same as billing address
                    </label>
                    <input
                      className=" form-check-input"
                      style={{ outline: "4px solid #0000FF33" }}
                      type="checkbox"
                      checked={shippingIsSameAsBillingAddress}
                      onChange={() => {
                        setShippingIsSameAsBillingAddress(
                          !shippingIsSameAsBillingAddress
                        );
                      }}
                    />
                  </Col>
                  <Col
                    xs={12}
                    className={
                      (shippingIsSameAsBillingAddress
                        ? "d-none"
                        : "d-flex flex-column") + " pt-3"
                    }
                  >
                    <label className="required fw-medium">
                      Shipping Street address
                    </label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="House number and street name"
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label className="required fw-medium">Postcode / ZIP</label>
                    <input type="text" className="form-control" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label className="required fw-medium">Town / City</label>
                    <input type="text" className="form-control" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label className="required fw-medium">Province</label>
                    <select className="form-select"></select>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label className="required fw-medium">Phone</label>
                    <input type="text" className="form-control" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label className="required fw-medium">Email address</label>
                    <input type="text" className="form-control" />
                  </Col>
                </Row>
                <Row className="heading-5 fw-bold pt-5 pb-3">
                  Additional information
                </Row>
                <Row>
                  <Col xs={12}>
                    <label className="fw-medium">Order notes (optional)</label>
                    <input type="text" className="form-control" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <label className="fw-medium">
                      Notes about your order, e.g. special notes for delivery.
                    </label>
                    <textarea className="form-control" rows={3}></textarea>
                  </Col>
                </Row>
                <Row className="">
                  <Col xs={12} className="d-flex justify-content-end">
                    <button
                      className="w-auto place-order-button"
                      onClick={() => {
                        setInitiatePayment(true);
                      }}
                    >
                      Place My Order
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col xs={11} md={4} lg={3} className="px-3 px-md-5 pt-5 pt-md-0">
            <Row className="heading-5">
              <Col xs={6} className="px-0 text-start">
                Total
              </Col>
              <Col xs={6} className="px-0 text-end">
                ${totalCost}
              </Col>
              <hr />
            </Row>
            <Row>
              <p className="text fw-light text-black-50 px-0 pt-3">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our privacy policy.
              </p>
              <hr />
            </Row>
            <Row className="d-flex flex-column gap-2 align-items-end justify-content-start">
              <ScrollTo target="billing-information">
                <button className="btn btn-warning text">
                  Proceed to Checkout
                </button>
              </ScrollTo>
              <button className="btn btn-danger text w-auto" onClick={clearCart}>
                <TrashFill /> Clear Cart</button>
            </Row>
          </Col>
        </Row>
      </>
    );
}