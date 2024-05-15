const router = require("express").Router();
const pool = require("../../config/database");
const bodyParser = require('body-parser');
module.exports = router;

router.use(bodyParser.json());
router.post('/GetUserDetailsByNRICNumber', async (req, res) => {
    try {
       const body = req.body
        // Query to fetch data from PostgreSQL based on the input ID
        if (body && body.nric_number) {
            const query = 'SELECT * FROM public.patient p WHERE p.nric_number = $1';
            const { rows } = await pool.query(query, [body.nric_number]);
            if (rows.length === 0) {
                // If no data is found for the given ID, return 404 Not Found
                res.status(404).json({ error: 'Data not found' });
            } else {
                res.json(rows);
            }
        } else {
            res.status(400).json({ error: 'Invalid request body or missing nric_number' });
        }
       
    }  catch (err) {
        console.error('Error fetching data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});