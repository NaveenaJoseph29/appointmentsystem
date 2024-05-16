import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import PaymentForm from "./PaymentForm";

const stripe = loadStripe('pk_test_51PFzEcSHs424eprLFByGbZoRoLiFbePB33YipEgsHBNY397QzOty82bqkMYexeshDvHkvhoRZCrwfs7x9x5QcXAC006EyzfmwI');

const StripePayment = () => {
    const [clientSecret, setClientSecret] = useState(null);
    useEffect(() => {
        const fetchPaymentIntent = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/create_payment_intent');
                if (response.data.client_secret) {
                    setClientSecret(response.data.client_secret);
                } else {
                    console.error('No client secret received from server');
                }
            } catch (error) {
                console.error('Error fetching payment intent:', error);
            }
        };

        fetchPaymentIntent();
    }, []);

    useEffect(() => {
        console.log(clientSecret);
    }, [clientSecret]);

    const options = {
        clientSecret,
        theme: "stripe",
    };

    return (
        clientSecret && (
            <Elements stripe={stripe} options={options}>
                <PaymentForm></PaymentForm>
            </Elements>
        )
    );
};

export default StripePayment;


