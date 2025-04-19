import { MongoClient } from 'mongodb'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set')
  throw new Error('Please add your MongoDB connection string to .env.local')
}

const uri = process.env.DATABASE_URL
console.log('MongoDB connection string available:', !!process.env.DATABASE_URL)
const options = {
  // Add connection options here if needed
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,  // 45 seconds
  maxPoolSize: 50,
  minPoolSize: 5
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

try {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
        .catch(err => {
          console.error('MongoDB connection error:', err)
          // Return a rejected promise to propagate the error
          return Promise.reject(err)
        })
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
      .catch(err => {
        console.error('MongoDB connection error:', err)
        // Return a rejected promise to propagate the error
        return Promise.reject(err)
      })
  }
} catch (error) {
  console.error('Error setting up MongoDB connection:', error)
  // Create a rejected promise to propagate the error
  clientPromise = Promise.reject(error)
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
