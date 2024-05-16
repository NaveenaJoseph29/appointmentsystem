//PaymentSuccess.js

const PaymentSuccess = () => {
	return (
		<div className="details_container"style={{
			margin: 0,
    position: "absolute",
    top: "50%",
    left: "50%",
    "-ms-transform": "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)"}}>
	<div className="details_card">
		<h1 className="patient_name">Your Payment is successful !</h1>
	</div>
		</div >
	);
}

export default PaymentSuccess;
