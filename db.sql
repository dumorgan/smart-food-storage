CREATE TABLE public."Authentication"
(
  "idAuth" integer NOT NULL DEFAULT nextval('"Authentication_idAuth_seq"'::regclass),
  "createdAt" timestamp with time zone DEFAULT now(),
  "idUser" integer,
  token text,
  CONSTRAINT "Authentication_pkey" PRIMARY KEY ("idAuth")
)
WITH (
  OIDS=TRUE
);
ALTER TABLE public."Authentication"
  OWNER TO postgres;

CREATE TABLE public."Measures"
(
  amount real,
  "timestamp" timestamp with time zone DEFAULT now(),
  "idScale" integer NOT NULL,
  "idMeasure" integer NOT NULL DEFAULT nextval('"measure_idMeasure_seq"'::regclass),
  CONSTRAINT "Measures_pkey" PRIMARY KEY ("idMeasure")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Measures"
  OWNER TO postgres;


CREATE TABLE public."Products"
(
  name character(18),
  "idProduct" integer NOT NULL DEFAULT nextval('"product_idProduct_seq"'::regclass),
  "idUser" integer,
  CONSTRAINT "Products_pkey" PRIMARY KEY ("idProduct")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Products"
  OWNER TO postgres;

CREATE TABLE public."Scales"
(
  "idUser" integer NOT NULL,
  "idScale" integer NOT NULL DEFAULT nextval('"scale_idScale_seq"'::regclass),
  mac text,
  "currentWeight" real,
  CONSTRAINT "Scales_pkey" PRIMARY KEY ("idScale")
)
WITH (
  OIDS=TRUE
);
ALTER TABLE public."Scales"
  OWNER TO postgres;

CREATE TABLE public."Shipments"
(
  "expirationDate" timestamp without time zone,
  "idProduct" integer NOT NULL,
  totalpurchased real,
  "idShipment" integer NOT NULL DEFAULT nextval('good_idgood_seq'::regclass),
  "idScale" integer,
  "createdAt" timestamp with time zone DEFAULT now(),
  name text,
  CONSTRAINT "Shipment_pkey" PRIMARY KEY ("idShipment")
)
WITH (
  OIDS=TRUE
);
ALTER TABLE public."Shipments"
  OWNER TO postgres;

CREATE TABLE public."Users"
(
  username text,
  email text,
  password text,
  "idUser" integer NOT NULL DEFAULT nextval('"user_idUser_seq"'::regclass),
  CONSTRAINT "Users_pkey" PRIMARY KEY ("idUser")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public."Users"
  OWNER TO postgres;
