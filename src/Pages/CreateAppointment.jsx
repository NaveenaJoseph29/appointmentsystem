import { useState,  React } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CreateAppointment() {
    const { patientId } = useParams();
    console.log(patientId);
  
    const [formData, setFormData] = useState({
      date: '',
      time: '',
      doctor_name: ''
    });
  
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const handleCancelClick = () => {
      window.history.back();
      };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      
        if (name === 'date') {
          const selectedDate = new Date(value);
          const currentDate = new Date();
          if (selectedDate < currentDate) {
            setErrorMessage('Cannot select past dates.');
          } else {
            setErrorMessage('');
          }
        }
      };
    
    const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const dateTime = `${formData.date}T${formData.time}:00`;
    const newData = { ...formData, time: dateTime, patient_id: patientId };
    
    await axios.post('http://localhost:8000/appointment/', newData);
    console.log('Form successfully submitted');
    setSuccessMessage('Appointment created successfully');
    setFormData({
      date: '',
      time: '',
      doctor_name: ''
    });
    history.push(`/details/${patientId}`);
  } catch (error) {
    console.error('Error creating appointment:', error);
  }
};
  
    return (
      <>
       <h1 className="patient_name"> Create Appointment </h1>
        <div className='appointmentmainContainer'>
          <div className='appointmentContainer'>
            <div className='AppointmentSubContainer'>
              <h6>Appointment Date</h6>
              <input 
                type='date' 
                name='date' 
                value={formData.date} 
                onChange={ handleChange}
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
              <a className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" onClick={handleCancelClick}>Cancel</a>
            </div>
          </div>
        </div>
        {errorMessage && (
          <div className="errprMessage" >
            <h3 style={{ fontWeight: 'bold', position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center',color:"red" }}>{errorMessage}</h3>
          </div>
        )}
         {successMessage && (
                <div className="successMessage" >
                    <h3 style={{ fontWeight: 'bold',  bottom: '20px', width: '100%', textAlign: 'center', color: "green" }}>{successMessage}</h3>
                </div>
            )}
      </>
    );
  }

export default CreateAppointment;