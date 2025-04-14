
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const winston = require('winston');
const { check, validationResult } = require('express-validator');

const app = express();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ]
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MySQL Database Connection Pool
const createDbPool = async () => {
  return mysql.createPool({
    host:'localhost',
    user:'root',
    password:'Welcome2023',
    database:'hotel_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

// Initialize database connection
let db;
(async () => {
  try {
    db = await createDbPool();
    logger.info('✅ Connected to MySQL Database');
  } catch (err) {
    logger.error('❌ MySQL Connection Failed:', err);
    process.exit(1);
  }
})();

// Validation middleware
const validateCustomer = [
  check('name').notEmpty().trim().withMessage('Name is required'),
  check('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  check('phone').notEmpty().trim().withMessage('Phone is required')
];

const validateReservation = [
  check('customerId').isInt().withMessage('Valid customer ID is required'),
  check('roomTypeId').isInt().withMessage('Valid room type ID is required'),
  check('startDate').isDate().withMessage('Valid start date is required'),
  check('endDate').isDate().withMessage('Valid end date is required')
];

const validateComplaint = [
  check('customer_id').isInt().withMessage('Valid customer ID is required'),
  check('complaint').notEmpty().trim().withMessage('Complaint description is required')
];

// Routes
const router = express.Router();

// Dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const [dashboardTable] = await db.query(`
      SELECT
        r.id AS reservation_id,
        c.name AS customer_name,
        rt.type AS room_type,
        r.start_date,
        r.end_date,
        comp.complaint,
        comp.status AS complaint_status
      FROM reservations r
      LEFT JOIN customers c ON r.customer_id = c.id
      LEFT JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN complaints comp ON r.customer_id = comp.customer_id
    `);

    const dashboardData = {
      totalRevenue: 150000,
      occupancyRate: 75,
      availableRooms: 25,
      totalReservations: 100,
      recentActivity: [
        { description: 'Reservation #101 created', time: '2 hours ago' },
        { description: 'Customer John Doe checked in', time: '5 hours ago' },
        { description: 'Room 203 cleaned', time: '1 day ago' }
      ],
      dashboardTable
    };

    res.json(dashboardData);
  } catch (err) {
    logger.error('Failed to retrieve dashboard data:', err);
    next(err);
  }
});

// Room Types
router.get('/room-types', async (req, res, next) => {
  try {
    const [results] = await db.query('SELECT * FROM room_types');
    res.json(results);
  } catch (err) {
    logger.error('Error fetching room types:', err);
    next(err);
  }
});

router.post('/room-types', [
  check('type').notEmpty().trim(),
  check('availability').isInt({ min: 0 }),
  check('rate').isFloat({ min: 0 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { type, availability, rate } = req.body;
    const [result] = await db.query(
      'INSERT INTO room_types (type, availability, rate) VALUES (?, ?, ?)',
      [type, availability, rate]
    );
    res.status(201).json({ id: result.insertId, type, availability, rate });
  } catch (err) {
    logger.error('Error adding room type:', err);
    next(err);
  }
});

// Customers
router.get('/customers', async (req, res, next) => {
  try {
    const [results] = await db.query('SELECT * FROM customers');
    res.json(results);
  } catch (err) {
    logger.error('Error fetching customers:', err);
    next(err);
  }
});

router.post('/customers', validateCustomer, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone } = req.body;
    const [result] = await db.query(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone]
    );
    res.status(201).json({ id: result.insertId, name, email, phone });
  } catch (err) {
    logger.error('Error adding customer:', err);
    next(err);
  }
});

router.delete('/customers/:id', async (req, res, next) => {
  try {
    const [result] = await db.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    logger.error('Error deleting customer:', err);
    next(err);
  }
});

// Reservations
router.get('/reservations', async (req, res, next) => {
  try {
    const [results] = await db.query('SELECT * FROM reservations');
    res.json(results);
  } catch (err) {
    logger.error('Error fetching reservations:', err);
    next(err);
  }
});

router.post('/reservations', validateReservation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { customerId, roomTypeId, startDate, endDate } = req.body;
    
    const [checkResults] = await db.query(
      `SELECT * FROM reservations 
       WHERE room_type_id = ? 
       AND ((start_date <= ? AND end_date >= ?) 
       OR (start_date <= ? AND end_date >= ?))`,
      [roomTypeId, endDate, startDate, startDate, endDate]
    );

    if (checkResults.length > 0) {
      return res.status(400).json({ error: 'Room type is not available for the selected dates' });
    }

    const [result] = await db.query(
      'INSERT INTO reservations (customer_id, room_type_id, start_date, end_date) VALUES (?, ?, ?, ?)',
      [customerId, roomTypeId, startDate, endDate]
    );

    res.status(201).json({ id: result.insertId, customerId, roomTypeId, startDate, endDate });
  } catch (err) {
    logger.error('Error adding reservation:', err);
    next(err);
  }
});

router.put('/reservations/:id', validateReservation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { customerId, roomTypeId, startDate, endDate } = req.body;
    const reservationId = req.params.id;

    const [checkResults] = await db.query(
      `SELECT * FROM reservations 
       WHERE room_type_id = ? AND id != ? 
       AND ((start_date <= ? AND end_date >= ?) 
       OR (start_date <= ? AND end_date >= ?))`,
      [roomTypeId, reservationId, endDate, startDate, startDate, endDate]
    );

    if (checkResults.length > 0) {
      return res.status(400).json({ error: 'Room type is not available for the selected dates' });
    }

    const [result] = await db.query(
      'UPDATE reservations SET customer_id = ?, room_type_id = ?, start_date = ?, end_date = ? WHERE id = ?',
      [customerId, roomTypeId, startDate, endDate, reservationId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    res.json({ message: 'Reservation updated successfully' });
  } catch (err) {
    logger.error('Error updating reservation:', err);
    next(err);
  }
});

// Complaints
router.get('/complaints', async (req, res, next) => {
  try {
    const [results] = await db.query('SELECT * FROM complaints');
    res.json(results);
  } catch (err) {
    logger.error('Error fetching complaints:', err);
    next(err);
  }
});

router.post('/complaints', validateComplaint, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { customer_id, complaint } = req.body;
    const [result] = await db.query(
      'INSERT INTO complaints (customer_id, complaint, status) VALUES (?, ?, ?)',
      [customer_id, complaint, 'Pending']
    );
    res.status(201).json({ id: result.insertId, customer_id, complaint, status: 'Pending' });
  } catch (err) {
    logger.error('Error adding complaint:', err);
    next(err);
  }
});

router.put('/complaints/:id', async (req, res, next) => {
  const complaintId = req.params.id;
  const { status } = req.body;

  if (!status || !['Pending', 'In Progress', 'Resolved'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required (Pending, In Progress, Resolved)' });
  }

  try {
    const [result] = await db.query(
      'UPDATE complaints SET status = ? WHERE id = ?',
      [status, complaintId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json({ message: 'Complaint status updated successfully' });
  } catch (err) {
    logger.error('Error updating complaint status:', err);
    next(err);
  }
});

// Use router with /api prefix
app.use('/api', router);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});