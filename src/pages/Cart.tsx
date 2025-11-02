import { type ReactElement, useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Download, Trash, TrashFill } from "react-bootstrap-icons";

import "./css/style.css"
import ScrollTo from "../custom-components/ScrollTo";
// import StripePaymentDialog from "../custom-components/StripePaymentDialog";
import { POST } from "../utils/Utils";

import { useStripe } from "@stripe/react-stripe-js";
import { useElements } from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe("pk_test_51SMZqfHAel19XjBlMv2ob3DaKHJ481oaOT6vsWbQNLqS182pZIV7r0f8eCeYRVtdWgWrMWiOw6UKUYaC0yRFhTxt00rUhLZbQU");
const stripePromise = loadStripe("pk_live_hS05mNDeo3jDDQJjHgpJucWj");

type BillingDetails = {
  firstName: string,
  lastName: string,
  company: string,
  country: string,
  billingStreetAddress: string,
  shippingStreetAddress: string,
  shippingDestinationType: string,
  postCode: string,
  city: string,
  province: string,
  phone: string,
  emailAddress: string,
  notes: string
};


function FormElement(props: {products: any[], setData: CallableFunction}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState<boolean>(false);

  const [shippingIsSameAsBillingAddress, setShippingIsSameAsBillingAddress] = useState<boolean>(true);
  // const [initiatePayment, setInitiatePayment] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // setLoading(true);

    const billingDetails: BillingDetails = {
      firstName: (document.getElementById("firstName") as HTMLInputElement).value,
      lastName: (document.getElementById("lastName") as HTMLInputElement).value,
      company: (document.getElementById("company") as HTMLInputElement).value,
      country: (document.getElementById("country") as HTMLInputElement).value,
      billingStreetAddress: (document.getElementById("billingStreetAddress") as HTMLInputElement).value,
      shippingStreetAddress: (document.getElementById("shippingStreetAddress") as HTMLInputElement).value,
      shippingDestinationType: (document.getElementById("shippingDestinationType") as HTMLInputElement).value,
      postCode: (document.getElementById("postCode") as HTMLInputElement).value,
      city: (document.getElementById("city") as HTMLInputElement).value,
      province: (document.getElementById("province") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      emailAddress: (document.getElementById("emailAddress") as HTMLInputElement).value,
      notes: (document.getElementById("notes") as HTMLInputElement).value
    };

    POST(
      "art/pay",
      {products: props.products, billingDetails: billingDetails},
      async (response: any) => {
        const invoiceID = response.data.invoiceID;
        const cardElement = elements?.getElement(CardElement);
        if (cardElement && stripe) {
          const result = await stripe.confirmCardPayment(
            response.data.clientSecret,
            {
              payment_method: {
                card: cardElement
              },
            }
          );

          if (result.error) {
            setLoading(false);
            alert(result.error.message);
          } else {
            console.log(response);
            if (result.paymentIntent.status == "succeeded") {
              setLoading(false);
              if (invoiceID){
                props.setData(invoiceID)
              }
              alert("Payment succeeded!");
            }
          }
        }
      },
      () => {}
    );
  };
  return (
    <form onSubmit={handleSubmit} className="">
      <Row>
        <Col xs={12} md={6}>
          <label className="required fw-medium">First name</label>
          <input type="text" id="firstName" className="form-control" />
        </Col>
        <Col xs={12} md={6}>
          <label className="required fw-medium">Last name</label>
          <input type="text" id="lastName" className="form-control" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="fw-medium">Company name (optional)</label>
          <input type="text" id="company" className=" form-control" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="required fw-medium">Country / Region</label>
          <input type="text" id="country" className="form-control" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="required fw-medium">Billing Street address</label>
          <input
            id="billingStreetAddress"
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
            (shippingIsSameAsBillingAddress ? "d-none" : "d-flex flex-column") +
            " pt-3"
          }
        >
          <label className="required fw-medium">Shipping Street address</label>

          <input
            type="text"
            id="shippingStreetAddress"
            className="form-control mb-2"
            placeholder="House number and street name"
          />

          <input
            type="text"
            className="form-control"
            id="shippingDestinationType"
            placeholder="Apartment, suite, unit, etc. (optional)"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="required fw-medium">Postcode / ZIP</label>
          <input type="text" id="postCode" className="form-control" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="required fw-medium">Town / City</label>
          <input type="text" id="city" className="form-control" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="required fw-medium">Province</label>

          <input type="text" id="province" className="form-control"/>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="required fw-medium">Phone</label>

          <input type="text" id="phone" className="form-control" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="required fw-medium">Email address</label>

          <input type="text" id="emailAddress" className="form-control" />
        </Col>
      </Row>
      <Row className="heading-5 fw-bold pt-5 pb-3">Additional information</Row>
      <Row className="pb-3">
        <Col xs={12}>
          <label className="fw-medium">Order notes (optional)</label>

          <textarea
            placeholder="Notes about your order, e.g. special notes for delivery."
            className="form-control"
            id="notes"
            rows={3}
          ></textarea>
        </Col>
      </Row>
      <CardElement className=" form-control" />
      <button className="btn btn-primary mt-2" disabled={loading || !stripe}>
        Pay
      </button>
    </form>
  );
}


export default function Cart(props: any): ReactElement{
    const [products, setProducts] = useState<any[]>([]);
    const [totalCost, setTotalCost] = useState<number>(0);

    const clearCart = () => {
      POST("users/cart/clear", {}, () => {

      }, () => {});
    }

    const removeCartItem = (id: any) => {
      if (id){
        POST("users/cart/remove-item", {id: id}, () => {
          alert("Item removed successfully!");
        }, () => {
          alert("something went wrong! please try again later!")
        });
      }
    }

    // const [paymentData, setPaymentData] = useState<
    //   { paymentStatus: string; invoiceID: number } | undefined
    // >();
    // const paymentDataRef = useRef(paymentData);
    // const setPaymentDataRef = (
    //   data:
    //     | {
    //         paymentStatus: string;
    //         invoiceID: number;
    //       }
    //     | undefined
    // ) => {
    //   if (data) {
    //     paymentDataRef.current = data;
    //     setPaymentData(data);
    //     getInvoice(data.invoiceID);
    //   }
    // };

    const [invoiceData, setInvoiceData] = useState<any>({});
    const [orderedData, setOrderedData] = useState<any>({});
    const [showInvoice, setShowInvoice] = useState<boolean>(false);
    const getInvoice = (invoiceID: number) => {
      POST(
        "users/payment/invoice",
        { invoiceID: invoiceID },
        (response: any) => {
          const data = response?.data;
          console.log(data);
          // setPaymentData(data);
          setInvoiceData(data?.invoiceData);
          setOrderedData(data?.orderedData);
          setShowInvoice(true)
        },
        () => {}
      );
    };

    useEffect(() => {
      setProducts(props?.cartItems);
      let cost = 0;
      props?.cartItems.forEach((item: any) => {
        if (item.cost){
          cost += item.cost;
        }
        setTotalCost(cost);
      })
    }, [props?.cartItems, totalCost]);
    return (
      <>
        {/* {initiatePayment ? <StripePaymentDialog /> : <></>} */}
        <Row
          className={
            "vh-100 vw-100 position-fixed top-0 start-0 bg-white overflow-y-scroll pt-5 mt-3 " +
            (showInvoice ? "d-flex" : "d-none")
          }
          style={{ zIndex: 300 }}
        >
          <Col xs={12}>
            <Row className="justify-content-center align-items-start py-5">
              {/* {JSON.stringify(paymentData)} */}
              <Col xs={11} lg={6} className="d-flex flex-column gap-2">
                <Row className="justify-content-end gap-2">
                  <button
                    className="btn btn-success w-auto"
                    onClick={() => {
                      setShowInvoice(false);
                    }}
                  >
                    <Download /> Download
                  </button>
                  <button
                    className="btn btn-danger w-auto"
                    onClick={() => {
                      setShowInvoice(false);
                    }}
                  >
                    CLOSE
                  </button>
                </Row>
                <Row className="fw-bold">
                  <h2>Invoice</h2>
                  <hr />
                </Row>
                <Row>
                  <Col xs={4} lg={3} className="fw-medium">
                    Invoice ID:
                  </Col>
                  <Col xs={4} lg={8}>
                    {invoiceData?.invoiceID}
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} lg={3} className="fw-medium">
                    Invoice Date:
                  </Col>
                  <Col xs={4} lg={4}>
                    {invoiceData?.invoiceDate}
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} lg={3} className="fw-medium">
                    Payment Date:
                  </Col>
                  <Col xs={4} lg={4}>
                    {invoiceData?.paymentDate}
                  </Col>
                </Row>
                <Row>
                  <Col xs={4} lg={3} className="fw-medium">
                    Currency
                  </Col>
                  <Col xs={4} lg={4}>
                    {invoiceData?.amount} {invoiceData?.currency}
                  </Col>
                </Row>
                <Row className="">
                  <Col xs={4} lg={3} className="fw-medium">
                    Payment Status
                  </Col>
                  <Col xs={4} lg={4}>
                    <span
                      className="p-1 px-2"
                      style={{
                        backgroundColor: invoiceData?.paymentStatus
                          ? "#00FF0033"
                          : "#FF000033",
                        borderRadius: "10px",
                      }}
                    >
                      {invoiceData?.paymentStatus}
                    </span>
                  </Col>
                </Row>
                <Row className="py-3">
                  <Col xs={12} className="d-flex flex-column gap-2">
                    <Row>
                      <Col xs={4} lg={3} className="fw-medium">
                        Customer Email
                      </Col>
                      <Col xs={4} lg={4}>
                        {invoiceData?.customerEmail}
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={4} lg={3} className="fw-medium">
                        Billing Address
                      </Col>
                      <Col xs={4} lg={4}>
                        {invoiceData?.billingAddress}
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={4} lg={3} className="fw-medium">
                        Shipping Address
                      </Col>
                      <Col xs={4} lg={4}>
                        {invoiceData?.shippingAddress}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Row className="fw-bold pt-4">
                      <h5>Ordered Items</h5>
                      <hr />
                    </Row>
                    <Row className="py-2">
                      <Col xs={12}>
                        <Row className="mb-2 justify-content-evenly">
                          {/* {JSON.stringify(information)} */}
                          <Col xs={12} md={3} className="fw-bold">
                            Image
                          </Col>
                          <Col xs={12} md={3} className="fw-bold">
                            Name & Category
                          </Col>
                          <Col xs={12} md={3} className="fw-bold">
                            Sizes
                          </Col>
                        </Row>
                        {/* {JSON.stringify(orderedData)} */}
                        {Object.entries(orderedData ? orderedData : {})?.map(
                          (information) => {
                            const productData: any = information[1];

                            return (
                              <Row className="mb-2 justify-content-evenly border-top py-2">
                                {/* {JSON.stringify(information)} */}
                                <Col xs={12} md={3}>
                                  <div
                                    style={{
                                      width: "100px",
                                      height: "150px",
                                      backgroundImage: `url(${productData?.image})`,
                                      backgroundSize: `contain`,
                                    }}
                                  ></div>
                                </Col>
                                <Col xs={12} md={3}>
                                  <strong>Name:</strong>
                                  <br /> {productData?.name}
                                  <br />
                                  <br />
                                  <strong>Category:</strong>
                                  <br /> {productData?.category}
                                  <br />
                                </Col>
                                <Col xs={12} md={3}>
                                  {Object.entries(productData?.variations)?.map(
                                    (information: any) => {
                                      const variation = information[0];
                                      const sizes: any = information[1]?.sizes;
                                      return (
                                        <>
                                          <Row>{variation}</Row>
                                          <Row className="gap-2">
                                            {sizes?.map((size: any) => {
                                              return (
                                                <span
                                                  className="px-2 py-1 rounded-2 w-auto"
                                                  style={{
                                                    backgroundColor:
                                                      "#2200FF22",
                                                  }}
                                                >
                                                  {size}
                                                </span>
                                              );
                                            })}
                                          </Row>
                                        </>
                                      );
                                    }
                                  )}
                                </Col>
                              </Row>
                            );
                          }
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <hr />
                  <Col xs={12}>
                    <Row className="fw-bold">Total</Row>
                    <Row className="fw-medium">
                      {invoiceData?.amount} {invoiceData?.currency}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
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
                              <button
                                className="btn d-none d-md-flex w-auto px-0"
                                onClick={() => {
                                  removeCartItem(product?.id);
                                }}
                              >
                                <Trash color="#FF0000" className="icon-25x25" />
                              </button>

                              <button
                                className="btn btn-danger d-flex d-md-none w-auto text mt-3 mt-md-0"
                                onClick={() => {
                                  removeCartItem(product?.id);
                                }}
                              >
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
                className="pt-5 d-flex flex-column gap-3 pb-3"
              >
                <Row className="heading-5 fw-bold pt-5 pb-3">
                  Billing details
                </Row>

                <Elements stripe={stripePromise}>
                  <FormElement products={products} setData={getInvoice} />
                </Elements>
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
              <button
                className="btn btn-danger text w-auto"
                onClick={clearCart}
              >
                <TrashFill /> Clear Cart
              </button>
            </Row>
          </Col>
        </Row>
      </>
    );
}