import mysql from 'mysql';

export async function connectToDb ({ host, database, user, password }) {
    try {
        const connection = mysql.createConnection({
            host,
            user,
            password,
            database
        });
    
        return connection.connect();
    } catch ( err ) {
        console.log( err );
    }
}
