import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://rohanthm:sC4AafvOOAQKBYVp@cluster0.manvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, latitude, longitude, message } = req.body;

    try {
      await client.connect();
      const database = client.db('notifier');
      const collection = database.collection('user_locations');

      const notification = {
        username,
        latitude,
        longitude,
      };

      await collection.insertOne(notification);
      res.status(201).json({ message: 'Notification saved to database' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving notification', error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}