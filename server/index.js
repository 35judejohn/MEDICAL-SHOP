import express from 'express';
import cors from 'cors';
import doctors from './data/doctors.js';

const app = express();
const port = process.env.PORT || 3000;
const bookings = [];

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

app.post('/api/bookings', (req, res) => {
  const { doctorId, patientName, contactInfo, doctorName } = req.body;
  if (!doctorId || !patientName || !contactInfo) {
    return res.status(400).json({ error: 'Missing booking details' });
  }

  const doctor = doctors.find((item) => item.id === doctorId);
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }

  bookings.push({ id: bookings.length + 1, doctorId, doctorName, patientName, contactInfo, createdAt: new Date().toISOString() });
  res.status(201).json({ success: true });
});

app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.get('*', (req, res) => {
  res.sendFile(new URL('../dist/index.html', import.meta.url).pathname);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
