

const AppointmentCharges = () => {
	return (
		<div className="flex justify-center">
			<div className="card w-96 bg-gray-200 shadow-xl">
				
				<div className="card-body">
					<h2 className="card-title">
						Full Stack Development with React & Node JS - Live
					</h2>
					<p>
						Looking to become a full-stack developer? This live, online course
						with a focus on the popular JS library React for front-end and
						Node.js for back-end along with APIs and deployment is a must-have
						program for any aspiring developer.
					</p>
					<p>
						<b>Course Price: $40.00</b>
					</p>
					<div className="card-actions justify-center">
						<a
							className="btn btn-primary rounded-lg text-white mt-5"
							href="/StripePayment" 
						>
							Purchase
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AppointmentCharges;
