const router = require("express").Router();
const pool = require("../../config/database");
const bodyParser = require('body-parser');
module.exports = router;

router.use(bodyParser.json());
router.post('/GetUserDetailsByNRICNumber', async (req, res) => {
    try {
        const body = req.body
        // Query to fetch data from PostgreSQL based on the input ID
        if (!body && !body.nric_number) {
            res.status(400).json({ error: 'Invalid request body or missing nric_number' });
        }
        const query = 'SELECT * FROM public.patient p WHERE p.nric_number = $1';
        const { rows } = await pool.query(query, [body.nric_number]);
        if (rows.length === 0) {
            // If no data is found for the given ID, return 404 Not Found
            res.status(404).json({ error: 'patient not found' });
        } else {
            res.json(rows);
        }
    } catch (err) {
        console.error('Error fetching data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/GetserialNumber', async (req, res) => {
    try {
        const body = req.body
        if (!body && !body.nric_number && !body.queue_array) {
            res.status(400).json({ error: 'Invalid request body or missing nric_number and queue_array'});
        }
        const query = 'SELECT p.id FROM public.patient p WHERE p.nric_number = $1';
        const { rows } = await pool.query(query, [body.nric_number]);
        if (rows.length === 0) {
            res.status(404).json({ error: 'patient not found' });
        }
        const id = rows[0].id
        var insertquery = `INSERT INTO public.appointment (nric_number, patient_id, appointment_date, `;
        var values = `'${body.nric_number}', '${id}', now(), `;
        for (var i = 0; i < body.queue_array.length; i++) {
            if (body.queue_array[i] == 'consultation') {
                var strId = (i + 1).toString();
                if (i == 0) {
                    insertquery += `appointment_consultation_status, consultation_priority, `;
                    values += `'pending', '${strId}', `;
                } else {
                    insertquery += `appointment_consultation_status, consultation_priority, `;
                    values += `'init', '${strId}', `;
                }
            }
            if (body.queue_array[i] == 'labtest') {
                var strId = (i + 1).toString();
                if (i == 0) {
                    insertquery += `appointment_lab_test_status, lab_test_priority, `;
                    values += `'pending', '${strId}', `;
                } else {
                    insertquery += `appointment_lab_test_status, lab_test_priority, `;
                    values += `'init', '${strId}', `;
                }
            }
            if (body.queue_array[i] == 'medicine') {
                var strId = (i + 1).toString();
                if (i == 0) {
                    insertquery += `appointment_medicine_status, medicine_priority, `;
                    values += `'pending', '${strId}', `;
                } else {
                    insertquery += `appointment_medicine_status, medicine_priority, `;
                    values += `'init', '${strId}', `;
                }
            }
            if (body.queue_array[i] == 'payment') {
                var strId = (i + 1).toString();
                if (i == 0) {
                    insertquery += `appointment_payment_status, payment_priority, `;
                    values += `'pending', '${strId}', `;
                } else {
                    insertquery += `appointment_payment_status, payment_priority, `;
                    values += `'init', '${strId}', `;
                }
            }
        }
        values += `now(), now(), now()`;
        insertquery += `booking_date, created_at, updated_at) VALUES (${values}) RETURNING id as serial_number;`;
        const { rows:resultrows } = await pool.query(insertquery);
        const serialNumber = resultrows[0].serial_number; 

        var queueQuery = `INSERT INTO public.${body.queue_array[0]}_queue
        ( appointment_id, status, ${body.queue_array[0]}_date, created_at, updated_at)
        VALUES( ${serialNumber}, 'active'::character varying, now(), now(), now());`
        await pool.query(queueQuery)
        res.json({ serialNumber});
    } catch (err) {
        console.error('Error fetching data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/ListQueueOnRole', async (req, res) => {
try{
    const body = req.body
    if (!body && !body.role) {
        res.status(400).json({ error: 'Invalid request body or missing role'});
    }
    const query = `select a.nric_number, a.id as serial_number, q.id as ${req.body.role}_queue_number,q.status, a.booking_date ,p."name" ,p.address ,p.email ,p.age ,p.phone_no  from ${req.body.role}_queue q inner join appointment a on q.appointment_id = a.id 
    inner join patient p on p.id = a.patient_id`
    const {rows} = await pool.query(query)
    res.json(rows)
}catch (err) {
        console.error('Error fetching data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/NoShow',async (req,res)=>{
try{
    const body = req.body
    if (!body && !body.role && !body.queue_id && !body.serial_number) {
        res.status(400).json({ error: 'Invalid request body or missing role, queue_id or serial_number'});
    }
    var query = `update public.${body.role}_queue
    set status='inactive'::character varying, updated_at=now()
    where id = ${req.body.queue_id};`
    await pool.query(query)
    query = `UPDATE public.appointment
    SET appointment_consultation_status='NoShow', consultation_priority=0, appointment_medicine_status='NoShow', medicine_priority=0, appointment_lab_test_status='NoShow', lab_test_priority=0, appointment_payment_status='NoShow', payment_priority=0, updated_at=now()
    WHERE id= ${req.body.serial_number};`
    await pool.query(query)
    res.status(200).json({message:"Noted the patient who didn't show up"})
}catch (err) {
        console.error('Error fetching data', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});