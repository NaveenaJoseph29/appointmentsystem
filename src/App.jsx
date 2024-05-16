import { React } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from "../src/component/Login";
import Secure from "../src/component/Login";
import PatientList from './Pages/PatientList';
import Details from './Pages/PatientDetail';
import CreateAppointment from './Pages/CreateAppointment';
import CreatePatient from './Pages/CreatePatient';
import AppointmentCharges from './stripe/paymentInfo';
import StripePayment from "./stripe/StripePayment";
import PaymentSuccess from './stripe/PaymentSuccess';


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
          <Route path="/secure" element={<Secure />} />
        <Route path="/dashboard" element={<PatientList />} />
        <Route path="/details/:patientId" element={<Details />} />
        <Route path="/createAppointment/:patientId" element={<CreateAppointment />} />
        <Route path="/createPatient" element={<CreatePatient />} />
        <Route path='/AppointmentCharges' element={<AppointmentCharges/>}/>
        <Route path='/StripePayment' element={<StripePayment/>}/>
        <Route path="/success" element={<PaymentSuccess />} />

      </Routes>
    </Router>
  );
}

export default App;
