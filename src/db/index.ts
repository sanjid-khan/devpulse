import  { Pool } from "pg"
import  { config } from "../config";


export const pool = new Pool({
    connectionString : config.connection_string
})


export const initDB = async ()=>{

    try{

        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS users(
              id   SERIAL PRIMARY KEY,
              name VARCHAR(150) NOT NULL,
              email VARCHAR(200) UNIQUE NOT NULL,
              password VARCHAR(200) NOT NULL,
              role VARCHAR(20)  DEFAULT  'contributor',

              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            )
            `
        );


        await pool.query(
            `
            CREATE TABLE IF NOT EXISTS issues (
            id  SERIAL PRIMARY KEY,

            title TEXT NOT NULL,
            description TEXT NOT NULL,

            type VARCHAR(40) NOT NULL,
            status VARCHAR(40) DEFAULT 'open',
            reporter_id INT NOT NULL,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `
        );

        console.log("Database connected successfully");

    }catch(error){
        console.log(error);
    }
}