import {useState} from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useElements } from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement } from "@stripe/react-stripe-js";
import { POST } from "../utils/Utils";
import { Col, Row } from "react-bootstrap";

const stripePromise = loadStripe("pk_test_51SMZqfHAel19XjBlMv2ob3DaKHJ481oaOT6vsWbQNLqS182pZIV7r0f8eCeYRVtdWgWrMWiOw6UKUYaC0yRFhTxt00rUhLZbQU");


function FormElement(){
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: any) => {
      e.preventDefault();
      setLoading(true);

      const amount = 50;
      POST(
        "art/pay",
        { amount },
        async (response: any) => {
          const cardElement = elements?.getElement(CardElement);
          if (cardElement && stripe) {
            const result = await stripe.confirmCardPayment(
              response.data.clientSecret,
              {
                payment_method: {
                  card: cardElement,
                },
              }
            );

            if (result.error) {
              alert(result.error.message);
            } else {
              if (result.paymentIntent.status == "succeeded") {
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
        <CardElement className=" form-control" />
        <button className="btn btn-primary mt-2" disabled={loading || !stripe}>
          Pay
        </button>
      </form>
    );
}

export default function StripePaymentDialog(){
    
    return (
      <Row
        className="position-fixed d-flex justify-content-center align-items-center vw-100 vh-100 top-0 start-0"
        style={{ backgroundColor: "#5555", zIndex: 1000 }}
      >
        <Col xs={11} md={6} lg={4} className="bg-white rounded-2 py-2 px-4">
          <Row className="heading-6 pb-3">Stripe Payment</Row>
          <Row>
            <Elements stripe={stripePromise}>
              <FormElement />
            </Elements>
          </Row>
        </Col>
      </Row>
    );
}