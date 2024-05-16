import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./stripeApp.css";
import StripePayment from "./StripePayment";
import AppointmentCharges from "./paymentInfo";
import PaymentSuccess from "./PaymentSuccess";
 
const stripeApp = () => {
    return (
        <div className="stripeApp">
            <BrowserRouter>
                <Routes>
                    <Route path="charges" element={<AppointmentCharges />} />
                    <Route path="payment" element={<StripePayment />} />
                    <Route path="success" element={<PaymentSuccess />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};
 
export default stripeApp;