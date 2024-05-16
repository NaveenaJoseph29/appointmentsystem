import { useState, React } from 'react';
import '../App.css';
import axios from 'axios';


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
    const handleCancelClick = () => {
		window.history.back();
	  };
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
        <div className='createPatientmainContainer'>
            <h1 className="patient_name"> Add Patient </h1>
            <div className='createPatientSubContainer'>

                <form className="formStyle" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ alignSelf: "center" }} htmlFor="name">Name:</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter patient's name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ alignSelf: "center" }} htmlFor="mobile">Mobile:</label>
                        <input
                            id="mobile"
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Enter patient's mobile number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ alignSelf: "center" }} htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter patient's email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ alignSelf: "center" }} htmlFor="age">Age:</label>
                        <input
                            id="age"
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter patient's age"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ alignSelf: "center" }} htmlFor="height">Height:</label>
                        <input
                            id="height"
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="Enter patient's height"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ alignSelf: "center" }} htmlFor="weight">Weight:</label>
                        <input
                            id="weight"
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="Enter patient's weight"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ alignSelf: "center" }} htmlFor="bloodGroup">Blood Group:</label>
                        <input
                            id="bloodGroup"
                            type="text"
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            placeholder="Enter patient's blood group"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ alignSelf: "center" }} htmlFor="purpose">Purpose:</label>
                        <input
                            id="purpose"
                            type="text"
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            placeholder="Enter purpose of visit"
                            required
                        />
                    </div>
                </form>
                <div className='buttonDiv' style={{ marginBottom: "10px",paddingBottom: "15px" }}>
                    <a className="button btn cancel_btn" onClick={handleCancelClick}>Cancel</a>
                    <a className="button btn create_appointment_btn" onClick={handleSubmit}>Submit</a>
                </div>
                {successMessage && <h4 className="successMessage">{successMessage}</h4>}
                {errorMessage && <h4 className="errorMessage">{errorMessage}</h4>}
            </div>
        </div>
    );
}
export default CreatePatient;