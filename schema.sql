-- public.patient definition

-- Drop table

-- DROP TABLE public.patient;

CREATE TABLE public.patient (
	id serial4 NOT NULL,
	nric_number varchar NULL,
	"name" varchar NULL,
	address varchar NULL,
	phone_no varchar NULL,
	email varchar NULL,
	age varchar NULL,
	dob varchar NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	CONSTRAINT patient_pkey PRIMARY KEY (id)
);


INSERT INTO public.patient (nric_number, "name", address, phone_no, email, age, dob)
VALUES
    ('S2756238H', 'John Doe', '123 Main St, City', '123-456-7890', 'john.doe@example.com', '30', '1994-05-15'),
    ('S2756239I', 'Jane Smith', '456 Elm St, Town', '987-654-3210', 'jane.smith@example.com', '25', '1999-10-20'),
    ('S2756240J', 'Michael Johnson', '789 Oak St, Village', '456-789-0123', 'michael.johnson@example.com', '40', '1984-03-08'),
    ('S2756241K', 'Emily Brown', '101 Pine St, Hamlet', '789-012-3456', 'emily.brown@example.com', '35', '1989-07-12'),
    ('S2756242L', 'Christopher Lee', '202 Maple St, County', '012-345-6789', 'christopher.lee@example.com', '28', '1996-12-25'),
    ('S2756243M', 'Jessica Martinez', '303 Birch St, Borough', '234-567-8901', 'jessica.martinez@example.com', '32', '1992-09-30'),
    ('S2756244N', 'David Wilson', '404 Cedar St, Township', '345-678-9012', 'david.wilson@example.com', '45', '1979-06-18'),
    ('S2756245O', 'Sarah Taylor', '505 Walnut St, Manor', '567-890-1234', 'sarah.taylor@example.com', '27', '1997-04-05'),
    ('S2756246P', 'Matthew Anderson', '606 Spruce St, Park', '678-901-2345', 'matthew.anderson@example.com', '38', '1986-11-28'),
    ('S2756247Q', 'Amanda Garcia', '707 Cedar St, Estate', '789-012-3456', 'amanda.garcia@example.com', '31', '1993-08-17');


create table public.appointment (
id serial primary key,
nric_number varchar null, 
patient_id int null,
appointment_date timestamp  default now(),
appointment_consultation_status varchar default null,
consultation_priority int default 0,
appointment_medicine_status varchar default null,
medicine_priority int default 0,
appointment_labtest_status varchar default null,
labtest_priority int default 0,
appointment_payment_status varchar default null,
payment_priority int default 0,
booking_date timestamp  default now(),
created_at timestamp  default now(),
updated_at timestamp  default now()
)



create table public.consultation_queue (
id serial primary key,
appointment_id int null,
status varchar default 'active',
consultation_date timestamp  default now(),
created_at timestamp  default now(),
updated_at timestamp  default now()
) 

create table public.medicine_queue (
id serial primary key,
appointment_id int null,
status varchar default 'active',
medicine_date timestamp  default now(),
created_at timestamp  default now(),
updated_at timestamp  default now()
) 

create table public.labtest_queue (
id serial primary key,
appointment_id int null,
status varchar default 'active',
labtest_date timestamp  default now(),
created_at timestamp  default now(),
updated_at timestamp  default now()
) 

create table public.payment_queue (
id serial primary key,
appointment_id int null,
status varchar default 'active',
payment_date timestamp  default now(),
created_at timestamp  default now(),
updated_at timestamp  default now()
)