--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookmark; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookmark (
    bookmark_id integer NOT NULL,
    user_id integer,
    recipe_id integer
);


ALTER TABLE public.bookmark OWNER TO postgres;

--
-- Name: bookmark_bookmark_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookmark_bookmark_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookmark_bookmark_id_seq OWNER TO postgres;

--
-- Name: bookmark_bookmark_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookmark_bookmark_id_seq OWNED BY public.bookmark.bookmark_id;


--
-- Name: engagement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.engagement (
    engagement_id integer NOT NULL,
    user_id integer,
    recipe_id integer,
    type character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.engagement OWNER TO postgres;

--
-- Name: engagement_engagement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.engagement_engagement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.engagement_engagement_id_seq OWNER TO postgres;

--
-- Name: engagement_engagement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.engagement_engagement_id_seq OWNED BY public.engagement.engagement_id;


--
-- Name: ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredient (
    ingredient_id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.ingredient OWNER TO postgres;

--
-- Name: ingredient_ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredient_ingredient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ingredient_ingredient_id_seq OWNER TO postgres;

--
-- Name: ingredient_ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredient_ingredient_id_seq OWNED BY public.ingredient.ingredient_id;


--
-- Name: meal_plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.meal_plan (
    meal_plan_id integer NOT NULL,
    user_id integer,
    name character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.meal_plan OWNER TO postgres;

--
-- Name: meal_plan_meal_plan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.meal_plan_meal_plan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.meal_plan_meal_plan_id_seq OWNER TO postgres;

--
-- Name: meal_plan_meal_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.meal_plan_meal_plan_id_seq OWNED BY public.meal_plan.meal_plan_id;


--
-- Name: meal_plan_recipe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.meal_plan_recipe (
    meal_plan_id integer NOT NULL,
    recipe_id integer NOT NULL
);


ALTER TABLE public.meal_plan_recipe OWNER TO postgres;

--
-- Name: rating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rating (
    rating_id integer NOT NULL,
    user_id integer,
    recipe_id integer,
    score integer,
    review text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rating_score_check CHECK (((score >= 1) AND (score <= 5)))
);


ALTER TABLE public.rating OWNER TO postgres;

--
-- Name: rating_rating_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rating_rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rating_rating_id_seq OWNER TO postgres;

--
-- Name: rating_rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rating_rating_id_seq OWNED BY public.rating.rating_id;


--
-- Name: recipe_ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe_ingredient (
    recipe_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    quantity character varying(50) NOT NULL
);


ALTER TABLE public.recipe_ingredient OWNER TO postgres;

--
-- Name: recipe_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe_tag (
    recipe_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.recipe_tag OWNER TO postgres;

--
-- Name: recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipes (
    recipe_id integer NOT NULL,
    creator_id integer,
    title character varying(100) NOT NULL,
    description text,
    cook_time integer,
    prep_time integer,
    skill_level character varying(20) NOT NULL,
    source_platform character varying(50),
    source_url text,
    CONSTRAINT recipes_skill_level_check CHECK (((skill_level)::text = ANY ((ARRAY['Beginner'::character varying, 'Intermediate'::character varying, 'Advanced'::character varying])::text[])))
);


ALTER TABLE public.recipes OWNER TO postgres;

--
-- Name: recipes_recipe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recipes_recipe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recipes_recipe_id_seq OWNER TO postgres;

--
-- Name: recipes_recipe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recipes_recipe_id_seq OWNED BY public.recipes.recipe_id;


--
-- Name: shopping_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shopping_list (
    shopping_list_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.shopping_list OWNER TO postgres;

--
-- Name: shopping_list_ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shopping_list_ingredient (
    shopping_list_id integer NOT NULL,
    ingredient_id integer NOT NULL
);


ALTER TABLE public.shopping_list_ingredient OWNER TO postgres;

--
-- Name: shopping_list_shopping_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shopping_list_shopping_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shopping_list_shopping_list_id_seq OWNER TO postgres;

--
-- Name: shopping_list_shopping_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shopping_list_shopping_list_id_seq OWNED BY public.shopping_list.shopping_list_id;


--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag (
    tag_id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- Name: tag_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tag_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tag_tag_id_seq OWNER TO postgres;

--
-- Name: tag_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tag_tag_id_seq OWNED BY public.tag.tag_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    role character varying(20) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['General User'::character varying, 'Registered User'::character varying, 'Recipe Creator'::character varying, 'Administrator'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: bookmark bookmark_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmark ALTER COLUMN bookmark_id SET DEFAULT nextval('public.bookmark_bookmark_id_seq'::regclass);


--
-- Name: engagement engagement_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engagement ALTER COLUMN engagement_id SET DEFAULT nextval('public.engagement_engagement_id_seq'::regclass);


--
-- Name: ingredient ingredient_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient ALTER COLUMN ingredient_id SET DEFAULT nextval('public.ingredient_ingredient_id_seq'::regclass);


--
-- Name: meal_plan meal_plan_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meal_plan ALTER COLUMN meal_plan_id SET DEFAULT nextval('public.meal_plan_meal_plan_id_seq'::regclass);


--
-- Name: rating rating_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating ALTER COLUMN rating_id SET DEFAULT nextval('public.rating_rating_id_seq'::regclass);


--
-- Name: recipes recipe_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes ALTER COLUMN recipe_id SET DEFAULT nextval('public.recipes_recipe_id_seq'::regclass);


--
-- Name: shopping_list shopping_list_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_list ALTER COLUMN shopping_list_id SET DEFAULT nextval('public.shopping_list_shopping_list_id_seq'::regclass);


--
-- Name: tag tag_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag ALTER COLUMN tag_id SET DEFAULT nextval('public.tag_tag_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: bookmark; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookmark (bookmark_id, user_id, recipe_id) FROM stdin;
1	1	1
2	2	2
3	3	3
4	4	4
5	5	5
6	6	6
7	7	7
8	8	8
9	9	9
10	10	10
11	11	11
12	12	12
13	13	13
14	14	14
15	15	15
16	16	16
17	17	17
18	18	18
19	19	19
20	20	20
\.


--
-- Data for Name: engagement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.engagement (engagement_id, user_id, recipe_id, type, created_at) FROM stdin;
1	1	1	View	2025-03-28 18:33:50.207628
2	2	2	Like	2025-03-28 18:33:50.207628
3	3	3	Comment	2025-03-28 18:33:50.207628
4	4	4	View	2025-03-28 18:33:50.207628
5	5	5	Like	2025-03-28 18:33:50.207628
6	6	6	Comment	2025-03-28 18:33:50.207628
7	7	7	View	2025-03-28 18:33:50.207628
8	8	8	Like	2025-03-28 18:33:50.207628
9	9	9	Comment	2025-03-28 18:33:50.207628
10	10	10	View	2025-03-28 18:33:50.207628
11	11	11	Like	2025-03-28 18:33:50.207628
12	12	12	Comment	2025-03-28 18:33:50.207628
13	13	13	View	2025-03-28 18:33:50.207628
14	14	14	Like	2025-03-28 18:33:50.207628
15	15	15	Comment	2025-03-28 18:33:50.207628
16	16	16	View	2025-03-28 18:33:50.207628
17	17	17	Like	2025-03-28 18:33:50.207628
18	18	18	Comment\n	2025-03-28 18:33:50.207628
19	19	19	View	2025-03-28 18:33:50.207628
20	20	20	Like	2025-03-28 18:33:50.207628
\.


--
-- Data for Name: ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredient (ingredient_id, name) FROM stdin;
1	Chicken
2	Beef
3	Pasta
4	Rice
5	Tomato
6	Potato
7	Cheese
8	Milk
9	Egg
10	Bread
11	Salt
12	Pepper
13	Butter
14	Onion
15	Garlic
16	Flour
17	Sugar
18	Olive Oil
19	Cream
20	Fish
\.


--
-- Data for Name: meal_plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.meal_plan (meal_plan_id, user_id, name, description) FROM stdin;
1	1	Weight Loss Plan	A diet plan focused on calorie reduction.
2	2	Keto Plan	Low carb, high fat ketogenic diet.
3	3	Vegan Plan	Completely plant-based meal plan.
4	4	High Protein Plan	Protein-rich meals for muscle building.
5	5	Healthy Eating Plan	Balanced meals for optimal health.
6	6	Quick Meals Plan	Recipes ready in 30 minutes or less.
7	7	Comfort Food Plan	Indulgent comfort food for cheat days.
8	8	Holiday Specials Plan	Seasonal recipes for celebrations.
9	9	Low Carb Plan	Meals with reduced carbohydrate content.
10	10	Gluten-Free Plan	Gluten-free recipes for celiac and gluten sensitivity.
11	11	Breakfast Plan	Healthy and fulfilling breakfast ideas.
12	12	Lunch Plan	Satisfying lunch meals for workdays.
13	13	Dinner Plan	Hearty dinner recipes for families.
14	14	Snack Plan	Quick snacks to keep you energized.
15	15	Dessert Plan	Delicious desserts for sweet cravings.
16	16	American Plan	American cuisine classics.
17	17	Asian Plan	Authentic and fusion Asian dishes.
18	18	Italian Plan	Traditional and modern Italian recipes.
19	19	Mexican Plan	Spicy and flavorful Mexican dishes.
20	20	Kids Plan	Kid-friendly and fun meals.
\.


--
-- Data for Name: meal_plan_recipe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.meal_plan_recipe (meal_plan_id, recipe_id) FROM stdin;
1	1
2	2
3	3
4	4
5	5
6	6
7	7
8	8
9	9
10	10
11	11
12	12
13	13
14	14
15	15
16	16
17	17
18	18
19	19
20	20
\.


--
-- Data for Name: rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rating (rating_id, user_id, recipe_id, score, review, created_at) FROM stdin;
1	1	1	5	Excellent recipe!	2025-03-28 18:33:09.114673
2	2	2	4	Pretty good.	2025-03-28 18:33:09.114673
3	3	3	5	Amazing flavor!	2025-03-28 18:33:09.114673
4	4	4	3	Not bad.	2025-03-28 18:33:09.114673
5	5	5	5	Loved it.	2025-03-28 18:33:09.114673
6	6	6	4	Great taste.	2025-03-28 18:33:09.114673
7	7	7	5	Simple and tasty.	2025-03-28 18:33:09.114673
8	8	8	3	Could be better.	2025-03-28 18:33:09.114673
9	9	9	4	Solid dish.	2025-03-28 18:33:09.114673
10	10	10	5	Excellent!	2025-03-28 18:33:09.114673
11	11	11	4	Nice and easy.	2025-03-28 18:33:09.114673
12	12	12	3	Too difficult.	2025-03-28 18:33:09.114673
13	13	13	5	Delicious.	2025-03-28 18:33:09.114673
14	14	14	4	Pretty good.	2025-03-28 18:33:09.114673
15	15	15	5	Authentic.	2025-03-28 18:33:09.114673
16	16	16	5	Quick and easy.	2025-03-28 18:33:09.114673
17	17	17	4	Healthy and tasty.	2025-03-28 18:33:09.114673
18	18	18	5	Rich and chewy.	2025-03-28 18:33:09.114673
19	19	19	4	Nice comfort food.	2025-03-28 18:33:09.114673
20	20	20	5	Best cheesecake ever.	2025-03-28 18:33:09.114673
\.


--
-- Data for Name: recipe_ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe_ingredient (recipe_id, ingredient_id, quantity) FROM stdin;
1	1	200g
2	2	300g
3	3	100g
4	4	150g
5	5	2 cups
6	6	4 pcs
7	7	200ml
8	8	3 tbsp
9	9	500g
10	10	1 tsp
11	11	2 pcs
12	12	200ml
13	13	3 cloves
14	14	2 cups
15	15	1 tbsp
16	16	100g
17	17	200g
18	18	3 tbsp
19	19	300g
20	20	500ml
\.


--
-- Data for Name: recipe_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe_tag (recipe_id, tag_id) FROM stdin;
1	12
2	16
3	14
4	8
5	13
6	7
7	8
8	12
9	15
10	7
11	14
12	12
13	15
14	11
15	14
16	8
17	12
18	7
19	15
20	7
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipes (recipe_id, creator_id, title, description, cook_time, prep_time, skill_level, source_platform, source_url) FROM stdin;
1	3	Spaghetti Bolognese	Rich and hearty Italian pasta.	60	15	Intermediate	Blog	https://example.com/spaghetti
2	3	Chicken Salad	Healthy chicken salad.	0	10	Beginner	Blog	https://example.com/chicken-salad
3	6	Beef Stew	Slow-cooked beef stew.	120	30	Advanced	YouTube	https://youtube.com/beef-stew
4	9	Pancakes	Fluffy pancakes.	20	10	Beginner	Instagram	https://instagram.com/pancakes
5	3	Tacos	Mexican street tacos.	30	20	Intermediate	Blog	https://example.com/tacos
6	6	Chocolate Cake	Rich chocolate cake.	90	20	Advanced	Website	https://example.com/chocolate-cake
7	9	Omelette	Classic breakfast omelette.	10	5	Beginner	YouTube	https://youtube.com/omelette
8	3	Pizza	Homemade Italian pizza.	40	20	Intermediate	Blog	https://example.com/pizza
9	9	Burgers	Juicy beef burgers.	30	15	Intermediate	Instagram	https://instagram.com/burgers
10	3	Apple Pie	Traditional apple pie.	75	30	Advanced	Blog	https://example.com/apple-pie
11	6	Fried Rice	Chinese-style fried rice.	20	10	Beginner	Website	https://example.com/fried-rice
12	9	Lasagna	Hearty meat lasagna.	90	40	Advanced	YouTube	https://youtube.com/lasagna
13	9	Chicken Curry	Spicy chicken curry.	60	20	Intermediate	Instagram	https://instagram.com/chicken-curry
14	3	Steak	Perfectly cooked steak.	15	10	Advanced	Blog	https://example.com/steak
15	6	Sushi	Traditional sushi rolls.	60	30	Advanced	YouTube	https://youtube.com/sushi
16	9	Toast	Simple buttered toast.	5	2	Beginner	Instagram	https://instagram.com/toast
17	3	Salmon	Grilled salmon fillet.	25	10	Intermediate	Blog	https://example.com/salmon
18	6	Brownies	Chewy chocolate brownies.	45	20	Intermediate	Website	https://example.com/brownies
19	9	Soup	Vegetable soup.	40	20	Beginner	YouTube	https://youtube.com/soup
20	3	Cheesecake	Creamy cheesecake.	90	30	Advanced	Blog	https://example.com/cheesecake
\.


--
-- Data for Name: shopping_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shopping_list (shopping_list_id, user_id) FROM stdin;
1	1
2	2
3	3
4	4
5	5
6	6
7	7
8	8
9	9
10	10
11	11
12	12
13	13
14	14
15	15
16	16
17	17
18	18
19	19
20	20
\.


--
-- Data for Name: shopping_list_ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shopping_list_ingredient (shopping_list_id, ingredient_id) FROM stdin;
1	1
2	2
3	3
4	4
5	5
6	6
7	7
8	8
9	9
10	10
11	11
12	12
13	13
14	14
15	15
16	16
17	17
18	18
19	19
20	20
\.


--
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag (tag_id, name) FROM stdin;
1	Vegetarian
2	Vegan
3	Keto
4	Gluten-Free
5	Low Carb
6	High Protein
7	Dessert
8	Breakfast
9	Lunch
10	Dinner
11	Snack
12	Italian
13	Mexican
14	Asian
15	American
16	Healthy
17	Quick Meal
18	Comfort Food
19	Holiday Special
20	Low Fat
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, password, role) FROM stdin;
1	user1	user1@example.com	password1	General User
2	user2	user2@example.com	password2	Registered User
3	user3	user3@example.com	password3	Recipe Creator
4	user4	user4@example.com	password4	General User
5	user5	user5@example.com	password5	Administrator
6	user6	user6@example.com	password6	Recipe Creator
7	user7	user7@example.com	password7	Registered User
8	user8	user8@example.com	password8	General User
9	user9	user9@example.com	password9	Recipe Creator
10	user10	user10@example.com	password10	Administrator
11	user11	user11@example.com	password11	Registered User
12	user12	user12@example.com	password12	General User
13	user13	user13@example.com	password13	Recipe Creator
14	user14	user14@example.com	password14	Administrator
15	user15	user15@example.com	password15	General User
16	user16	user16@example.com	password16	Registered User
17	user17	user17@example.com	password17	Recipe Creator
18	user18	user18@example.com	password18	Administrator
19	user19	user19@example.com	password19	General User
20	user20	user20@example.com	password20	Registered User
\.


--
-- Name: bookmark_bookmark_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookmark_bookmark_id_seq', 20, true);


--
-- Name: engagement_engagement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.engagement_engagement_id_seq', 20, true);


--
-- Name: ingredient_ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredient_ingredient_id_seq', 20, true);


--
-- Name: meal_plan_meal_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.meal_plan_meal_plan_id_seq', 20, true);


--
-- Name: rating_rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rating_rating_id_seq', 20, true);


--
-- Name: recipes_recipe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipes_recipe_id_seq', 20, true);


--
-- Name: shopping_list_shopping_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shopping_list_shopping_list_id_seq', 20, true);


--
-- Name: tag_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tag_tag_id_seq', 20, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 20, true);


--
-- Name: bookmark bookmark_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmark
    ADD CONSTRAINT bookmark_pkey PRIMARY KEY (bookmark_id);


--
-- Name: engagement engagement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engagement
    ADD CONSTRAINT engagement_pkey PRIMARY KEY (engagement_id);


--
-- Name: ingredient ingredient_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_name_key UNIQUE (name);


--
-- Name: ingredient ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_pkey PRIMARY KEY (ingredient_id);


--
-- Name: meal_plan meal_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meal_plan
    ADD CONSTRAINT meal_plan_pkey PRIMARY KEY (meal_plan_id);


--
-- Name: meal_plan_recipe meal_plan_recipe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meal_plan_recipe
    ADD CONSTRAINT meal_plan_recipe_pkey PRIMARY KEY (meal_plan_id, recipe_id);


--
-- Name: rating rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (rating_id);


--
-- Name: recipe_ingredient recipe_ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_ingredient
    ADD CONSTRAINT recipe_ingredient_pkey PRIMARY KEY (recipe_id, ingredient_id);


--
-- Name: recipe_tag recipe_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_tag
    ADD CONSTRAINT recipe_tag_pkey PRIMARY KEY (recipe_id, tag_id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (recipe_id);


--
-- Name: shopping_list_ingredient shopping_list_ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_list_ingredient
    ADD CONSTRAINT shopping_list_ingredient_pkey PRIMARY KEY (shopping_list_id, ingredient_id);


--
-- Name: shopping_list shopping_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_list
    ADD CONSTRAINT shopping_list_pkey PRIMARY KEY (shopping_list_id);


--
-- Name: tag tag_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_name_key UNIQUE (name);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (tag_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: bookmark bookmark_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmark
    ADD CONSTRAINT bookmark_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(recipe_id) ON DELETE CASCADE;


--
-- Name: bookmark bookmark_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmark
    ADD CONSTRAINT bookmark_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: engagement engagement_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engagement
    ADD CONSTRAINT engagement_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(recipe_id) ON DELETE CASCADE;


--
-- Name: engagement engagement_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.engagement
    ADD CONSTRAINT engagement_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: meal_plan_recipe meal_plan_recipe_meal_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meal_plan_recipe
    ADD CONSTRAINT meal_plan_recipe_meal_plan_id_fkey FOREIGN KEY (meal_plan_id) REFERENCES public.meal_plan(meal_plan_id) ON DELETE CASCADE;


--
-- Name: meal_plan_recipe meal_plan_recipe_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meal_plan_recipe
    ADD CONSTRAINT meal_plan_recipe_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(recipe_id) ON DELETE CASCADE;


--
-- Name: meal_plan meal_plan_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.meal_plan
    ADD CONSTRAINT meal_plan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: rating rating_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(recipe_id) ON DELETE CASCADE;


--
-- Name: rating rating_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: recipe_ingredient recipe_ingredient_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_ingredient
    ADD CONSTRAINT recipe_ingredient_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredient(ingredient_id) ON DELETE CASCADE;


--
-- Name: recipe_ingredient recipe_ingredient_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_ingredient
    ADD CONSTRAINT recipe_ingredient_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(recipe_id) ON DELETE CASCADE;


--
-- Name: recipe_tag recipe_tag_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_tag
    ADD CONSTRAINT recipe_tag_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(recipe_id) ON DELETE CASCADE;


--
-- Name: recipe_tag recipe_tag_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_tag
    ADD CONSTRAINT recipe_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(tag_id) ON DELETE CASCADE;


--
-- Name: recipes recipes_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(user_id);


--
-- Name: shopping_list_ingredient shopping_list_ingredient_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_list_ingredient
    ADD CONSTRAINT shopping_list_ingredient_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredient(ingredient_id) ON DELETE CASCADE;


--
-- Name: shopping_list_ingredient shopping_list_ingredient_shopping_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_list_ingredient
    ADD CONSTRAINT shopping_list_ingredient_shopping_list_id_fkey FOREIGN KEY (shopping_list_id) REFERENCES public.shopping_list(shopping_list_id) ON DELETE CASCADE;


--
-- Name: shopping_list shopping_list_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_list
    ADD CONSTRAINT shopping_list_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

