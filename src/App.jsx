import { useEffect, useMemo, useState } from 'react';
import './App.css';

const specialties = ['All', 'General Practitioner', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Psychiatrist'];

function App() {
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => res.json())
      .then(setDoctors)
      .catch(() => setDoctors([]));
  }, []);

  const filteredDoctors = useMemo(() => {
    if (selectedSpecialty === 'All') return doctors;
    return doctors.filter((doctor) => doctor.specialty === selectedSpecialty);
  }, [doctors, selectedSpecialty]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedDoctor) {
      setMessage('Please choose a doctor before booking.');
      return;
    }

    const payload = {
      doctorId: selectedDoctor.id,
      patientName,
      contactInfo,
      doctorName: selectedDoctor.name
    };

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setMessage('Booking requested successfully! The clinic will contact you soon.');
      setPatientName('');
      setContactInfo('');
      setSelectedDoctor(null);
    } else {
      setMessage('There was a problem creating your booking request.');
    }
  };

  return (
    <div className="app-shell">
      <header className="hero-banner">
        <div>
          <p className="eyebrow">E-Medical Care</p>
          <h1>Book a session with your chosen doctor</h1>
          <p>Find qualified specialists near you, choose your preferred doctor, and request an appointment instantly.</p>
        </div>
      </header>

      <main className="content-grid">
        <section className="doctors-panel">
          <div className="panel-header">
            <h2>Available Doctors</h2>
            <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>

          <div className="doctor-list">
            {filteredDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="doctor-headline">
                  <h3>{doctor.name}</h3>
                  <span>{doctor.specialty}</span>
                </div>
                <p>{doctor.description}</p>
                <p className="meta">Experience: {doctor.experience} years</p>
              </article>
            ))}
          </div>
        </section>

        <section className="booking-panel">
          <div className="panel-header">
            <h2>Book a Session</h2>
          </div>
          <form className="booking-form" onSubmit={handleSubmit}>
            <label>
              Patient name
              <input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </label>

            <label>
              Contact information
              <input
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Email or phone"
                required
              />
            </label>

            <label>
              Selected doctor
              <input value={selectedDoctor ? selectedDoctor.name : ''} readOnly placeholder="Select a doctor" />
            </label>

            <button type="submit" disabled={!selectedDoctor || !patientName || !contactInfo}>
              Request Booking
            </button>
          </form>

          {message && <div className="alert">{message}</div>}
        </section>
      </main>
    </div>
  );
}

export default App;
