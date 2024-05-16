import { useState, useEffect, React } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import AppointmentCharges from '../stripe/paymentInfo';


function DetailsCard({ label, value }) {
    return (
      <div className="details_card">
        <h3 className="details_label">{label}</h3>
        <p className="details_value">{value}</p>
      </div>
    );
  }

function Details() {
    const { patientId } = useParams();
    const [patientDetails, setPatientDetails] = useState(null);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [loadingPatient, setLoadingPatient] = useState(true);
    const [loadingAppointment, setLoadingAppointment] = useState(true);
    const [errorPatient, setErrorPatient] = useState(null);
    const [errorAppointment, setErrorAppointment] = useState(null);
    const handleCancelClick = () => {
      window.history.back();
      };
  
    useEffect(() => {
      const fetchPatientDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/patients/${patientId}`);
          setPatientDetails(response.data);
        } catch (error) {
          setErrorPatient('Error fetching patient details');
        } finally {
          setLoadingPatient(false);
        }
      };
  
      fetchPatientDetails();
    }, [patientId]);
  
    useEffect(() => {
      const fetchAppointmentDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/appointment/${patientId}`);
          setAppointmentDetails(response.data);
        } catch (error) {
          setErrorAppointment('Error fetching appointment details');
        } finally {
          setLoadingAppointment(false);
        }
      };
  
      fetchAppointmentDetails();
    }, [patientId]);
  
    if (loadingPatient || loadingAppointment) {
      return <div>Loading...</div>;
    }
  
    if (errorPatient || !patientDetails) {
      return <div>No patient details found</div>;
    }
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // Adjust locale as needed
    };
  
    // Function to format time from "HH:MM:SS" to "HH:MM"
    const formatTime = (timeString) => {
      return timeString.slice(11, 16); // Extracting only HH:MM part
    };
  
    return (
      <div className='mainContainer'>
            <h1 className="patient_name">Patient : {patientDetails.name}</h1>
        <div className="details_container">
            
     <div className='cardContainer'> <div className="details_cards_container">
        <DetailsCard label="Age" value={patientDetails.age} />
        <DetailsCard label="Weight" value={patientDetails.weight} />
        <DetailsCard label="Height" value={patientDetails.height} />
        <DetailsCard label="Blood Group" value={patientDetails.bloodGroup} />
      </div></div>
      <div className="purpose_container">
        <h3 className="purpose_label">Purpose</h3>
        <p className="purpose_value">{patientDetails.purpose}</p>
      </div>
      <div className="buttonDiv">
        <a className="button btn cancel_btn" onClick={handleCancelClick}>Cancel</a>
        <a className="button btn create_appointment_btn" href={`/createAppointment/${patientId}`}>Create Appointment</a>
      </div>
    </div>
  
        <div style={{marginTop:"20px"}}>
        <h1 className="patient_name">Appointment Details </h1>
          {errorAppointment || !appointmentDetails ? (
            <h4>No appointments</h4>
          ) : (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor Name</th>
                  </tr>
                </thead>
                <tbody>
                {appointmentDetails.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{formatDate(appointment.date)}</td>
                      <td>{formatTime(appointment.time)}</td>
                      <td>{appointment.doctor_name}</td>
                    </tr>
                  ))}
                  {/* <tr>
                    <td>{appointmentDetails.date}</td>
                    <td>{appointmentDetails.time}</td>
                    <td>{appointmentDetails.doctor_name}</td>
                  </tr> */}
                </tbody>
              </table>
              <a className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" href="/StripePayment">Make Payment</a>
            </div>
          )}
        </div>
      </div>
    );
  }

export default Details;