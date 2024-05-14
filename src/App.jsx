import { useState, useEffect, React } from 'react';
import { BrowserRouter as Router, Routes, Route,useParams } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './App.css';
import axios from 'axios';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="/details/:patientId" element={<Details />} />
        <Route path="/createAppointment/:patientId" element={<CreateAppointment />} />
        <Route path="/createPatient" element={<CreatePatient />} />
        <Route path="/paymentForm" element={<PaymentForm />}/>
      </Routes>
    </Router>
  );
}


function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/patients');
        console.log(response)
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/patients/search/${searchTerm}`);
      setSearchResults(response.data);
      setError(null);
      setShowTable(true); 
    } catch (error) {
      console.error('Error searching patients:', error);
      setSearchResults([]);
      setError('Patient not found');
      setShowTable(false); 
    }
  };
  
  return (
    <>
      <div className='mainContainer'>

        
        <h1>Patients</h1>
        <div>
          <input
            type="text"
            className="my-4 rounded-3 border-dark form-control"
            style={{ margin: "17px" }}
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search by Patient Name"
            aria-label="Patient Name"
          />
          <div className="buttonDiv">
            <button className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" onClick={handleSearch}>Search</button>
          </div>
        </div>
        {error && <div>Error: {error}</div>}
        {showTable && ( 
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.mobile}</td>
                  <td>{patient.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!showTable && (
          <div>
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>NAME</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.mobile}</td>
                    <td>{patient.email}</td>
                    <td>
                      <a className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" href={`/details/${patient.id}`}>View Details</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <a className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" href="/createPatient" >Add Patient</a>
          </div>
        )}
      </div>
    </>
  );
}




function Details() {

  // const handlePayment = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:8000/appointment/create-payment', {});
  //     const paymentLink = response.data.payment_link;
  //     window.location.href = paymentLink; // Redirect to payment page
  //   } catch (error) {
  //     console.error('Error making payment:', error);
  //   }
  // };
  const { patientId } = useParams();
  console.log(patientId)
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/patients/${patientId}`);
        console.log('Response:', response.data); 
        setPatientDetails(response.data);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!patientDetails) {
    return <div>No patient details found</div>; 
  }

  return (
    <div className='mainContainer'>
      {/* <div className='subContainer'>
        <div className='card'>
          <h6>Age</h6>

        </div>
        <div className='card'>
        <h6>height</h6>

        </div>
        <div className='card'>
        <h6>weight</h6>

        </div>
        <div className='card'>
        <h6>Blood Group</h6>

        </div>
      </div> */}
      <h1>Name of the Patient: {patientDetails.name}</h1>
      <div className='details_sub_container'>
        <ul>
          <li>Age: {patientDetails.age}</li>
          <li>Weight: {patientDetails.weight}</li>
          <li>Height: {patientDetails.height}</li>
          <li>Blood Group: {patientDetails.bloodGroup}</li>
          <li>Purpose: {patientDetails.purpose}</li>
        </ul>
      </div>
      <div className='buttonDiv'>
        <a className="button btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" href='/'>Cancel</a>
        <a className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" href={`/createAppointment/${patientId}`}>Create Appointment</a>
      </div>

      <div>
        <h4>Appointment Details</h4>
        <div>
      <table>
        <thead>
          <tr>
          <th>Appointment Date</th>
          <th>Appointment Time</th>
          <th>Doctor's Name</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>23/05/2024</td>
          <td>9.00A.M</td>
          <td>Dr.Alestar</td>
        </tr>
        </tbody>
      </table>
      <a className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" href="/paymentForm">Make Payment</a>

        </div>
      </div>
    </div>

  );
}

function CreateAppointment() {

  
  const { patientId } = useParams();
  console.log(patientId)

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctor_name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const dateTime = `${formData.date}T${formData.time}:00`;
      const newData = { ...formData, time: dateTime,patient_id:patientId };
      
      await axios.post('http://localhost:8000/appointment/', newData);
      console.log('Form successfully submitted')
      setSuccessMessage('Appointment created successfully');
      setFormData({
        date: '',
        time: '',
        doctor_name: ''
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  }
  return (
    <>
      <div className='mainContainer'>
        <h1>Create Appointment</h1>
        <div className='appointmentContainer'>
          <div className='AppointmentSubContainer'>
            <h6>Appointment Date</h6>
            <input 
              type='date' 
              name='date' 
              value={formData.date} 
              onChange={handleChange}
            />
          </div>
          <div className='AppointmentSubContainer'>
            <h6>Appointment Time</h6>
            <input 
              type='time' 
              name='time' 
              value={formData.time} 
              onChange={handleChange}
            />
          </div>
          <div className='AppointmentSubContainer'>
            <h6>Doctor's Name</h6>
            <input 
              type='text' 
              name='doctor_name'
              value={formData.doctor_name} 
              onChange={handleChange}
            />
          </div>
          <div className='buttonDiv'>
            <button 
              className="button btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" 
              onClick={handleSubmit}
            >
              Submit
            </button>
            <a className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" href="/">Cancel</a>
          </div>
        </div>
      </div>
    </>
  );
}
function CreatePatient() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    bloodGroup: '',
    purpose: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8000/patients/', formData);
      setSuccessMessage('Patient created successfully');
      setFormData({
        name: '',
        mobile: '',
        email: '',
        age: '',
        height: '',
        weight: '',
        bloodGroup: '',
        purpose: ''
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      setErrorMessage('Failed to create patient. Please try again.');
    }
  };

  return (
    <div className="mainContainer">
      <h1>Create Patient</h1>
      <form className="formStyle" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Mobile:</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Height:</label>
          <input type="number" name="height" value={formData.height} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Weight:</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Blood Group:</label>
          <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Purpose:</label>
          <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

function PaymentForm()  {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

      try {
        const response = await axios.post('http://localhost:8000/process-payment/', {
          amount: 1000, 
          currency: 'inr',
          token: cardElement, 
        });
  
        if (response.data.status === 'success') {
          setPaymentSuccess(true);
          console.log('Payment successful! Charge ID:', response.data.charge_id);
        } else {
          setPaymentError(response.data.message);
          setPaymentSuccess(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setPaymentError('Payment failed. Please try again.');
        setPaymentSuccess(false);
      }
    };


  return (
    <div>
      <h1>MAKE YOUR PAYMENT</h1>
        <form onSubmit={handleSubmit}>
          <CardElement />
          <button type="submit" disabled={!stripe}>
            Pay Now
          </button>
          {paymentError && <div style={{ color: 'red' }}>{paymentError}</div>}
          {paymentSuccess && <div style={{ color: 'green' }}>Payment successful!</div>}
        </form>
    </div>
  );
};



export default App;
