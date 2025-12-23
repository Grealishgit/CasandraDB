import cassandra from 'cassandra-driver';
import dotenv from 'dotenv';

dotenv.config();

// Connect to local Cassandra container
export const client = new cassandra.Client({
    contactPoints: [process.env.CASSANDRA_CONTACT_POINTS], // matches docker-compose
    localDataCenter: process.env.CASSANDRA_LOCAL_DATACENTER, // matches docker-compose
    keyspace: process.env.CASSANDRA_KEYSPACE       // existing keyspace
});

// console.log('Cassandra Client Config:', {
//     contactPoints: process.env.CASSANDRA_CONTACT_POINTS,
//     localDataCenter: process.env.CASSANDRA_LOCAL_DATACENTER,
//     keyspace: process.env.CASSANDRA_KEYSPACE
// });


export const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to Cassandra!');

        // Simple query test
        // const result = await client.execute('SELECT * FROM users;');
        // console.log('Rows:', result.rows.length);

    } catch (err) {
        console.error('Error connecting to Cassandra:', err);
        process.exit(1); // Exit if database connection fails
    }
    // DON'T shutdown the client - it needs to stay connected for the app to work!
}




// Insert a new user
// const insertQuery = 'INSERT INTO users (id, name) VALUES (uuid(), ?)';
// await client.execute(insertQuery, ['Hunter1'], { prepare: true });
// console.log('Inserted a new user.');


