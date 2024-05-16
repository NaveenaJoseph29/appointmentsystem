//PaymentForm.js

import React, { useState } from "react";
import {
	PaymentElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";

const PAYMENT_SUCESS_URL = "http://localhost:5173/success";

const PaymentForm = () => {
    // const { patientId } = useParams();
	const stripe = useStripe();
	const elements = useElements();

	const [message, setMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!stripe || !elements) return;
	
		setIsLoading(true);
		setMessage("Payment in Progress");
	
		try {
			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: PAYMENT_SUCESS_URL,
				},
			});
	
			if (error) {
				setMessage("Some Error Occurred: " + error.message);
			} else {
				setMessage("Payment Successful!");
				window.location.href = PAYMENT_SUCESS_URL;
			}
		} catch (error) {
			setMessage("Some Error Occurred: " + error.message);
		}
	
		setIsLoading(false);
	};
	const handleCancelClick = () => {
		window.history.back();
	  };
	

	return (
		<div className="container mx-auto">
			<form onSubmit={handleSubmit}>
				<div className="details_container">
					<div className="details_card">
						<h1 className="patient_name">
							Complete your payment here!
						</h1>
						<PaymentElement />
						<div className="card-actions justify-center">
							<a className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" style={{marginRight:"10px"}} onClick={handleCancelClick}>Cancel</a>
							<button
								className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3"
								disabled={isLoading || !stripe || !elements}
							>
								{isLoading ? "Loading..." : "Pay now"}
							</button>
						</div>
						{message && <div>{message}</div>}
					</div>
				</div>
			</form>
		</div>
	);
};

export default PaymentForm;
