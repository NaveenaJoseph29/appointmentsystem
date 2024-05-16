import { useState, useEffect, React } from 'react';
import '../App.css';
import axios from 'axios';


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
        <h1 className="patient_name">Patients </h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <input
            type="text"
            className="my-4 rounded-3 border-dark form-control"
            style={{
              margin: "17px", width: "auto",
              backgroundColor: "black",
              color: "aliceblue"
            }}
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search by Patient Name"
            aria-label="Patient Name"
          />
          <button className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" style={{ marginRight: "10px" }} onClick={handleSearch}>Search</button>
        </div>
        {error && <div>Error: {error}</div>}
        {showTable && (
          <div>
            <a className="btn addPatientBtn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" href="/dashboard" >Back</a>
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
                    <td>
                      <a className="btn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" href={`/details/${patient.id}`}>View Details</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!showTable && (
          <div className="addPatientbuttonDiv">
            <a className="btn addPatientBtn text-bg-secondary p-3 btn-primary border-dark px-5 my-4 rounded-3" href="/createPatient" >Add Patient</a>
            <table className='PatientListTableStyle'>
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

          </div>
        )}
      </div>
    </>
  );
}


export default PatientList;