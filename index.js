const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.beozs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // cars related apis
        const carsCollection = client.db('cars-collection').collection('cars')
        const bookingCollection = client.db('cars-collection').collection('booking')


        // recent cars added shows on homepage
        app.get('/cars', async (req, res) => {
            const cursor = carsCollection.find().limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })
        // available all cars shows on available car
        app.get('/allCars', async (req, res) => {
            const cursor = carsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // see details by id and get a single document
        app.get('/allCars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await carsCollection.findOne(query);
            res.send(result);
        })


        // send add car information to database
        app.post('/allCars', async (req, res) => {
            const newCar = req.body;
            const result = await carsCollection.insertOne(newCar);
            res.send(result);
        })
        // send booking car information to database
        app.post('/myBookings', async (req, res) => {
            const bookingData = req.body;
            const result = await bookingCollection.insertOne(bookingData);
            res.send(result);
        })

        // available booking cars shows on my bookings
        app.get('/myBookings', async (req, res) => {
            const cursor = bookingCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get my added cars data by gmail
        app.get('/myCars', async (req, res) => {
            const email = req.query.email;
            const query = { carAdder: email }
            const result = await carsCollection.find(query).toArray();
            res.send(result);
        })

        // delete from my added cars by id
        app.delete('/myCars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await carsCollection.deleteOne(query);
            res.send(result);
        })

        // get data from my cars by id and get a single document for update
        app.get('/myCars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await carsCollection.findOne(query);
            res.send(result);
        })
        // get data from my bookings by id and get a single document for update
        app.get('/myBookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookingCollection.findOne(query);
            res.send(result);
        })

        // set up updated data
        app.put('/myCars/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCar = req.body;
            const car = {
                $set: {
                    model: updatedCar.model,
                    price: updatedCar.price,
                    available: updatedCar.available,
                    registration_number: updatedCar.registration_number,
                    features: updatedCar.features,
                    description: updatedCar.description,
                    booking_count: updatedCar.booking_count,
                    image: updatedCar.image,
                    location: updatedCar.location,
                    datePosted: updatedCar.datePosted
                }
            }
            const result = await carsCollection.updateOne(filter, car, options);
            res.send(result)
        })
        // set up booking updated data
        app.put('/myBookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedBooking = req.body;
            const car = {
                $set: {
                    bookingDate: updatedBooking.bookingDate,

                }
            }
            const result = await bookingCollection.updateOne(filter, car, options);
            res.send(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Mh Renthub server Is Running')
})

app.listen(port, () => {
    console.log(`server is running at:${port}`);
})