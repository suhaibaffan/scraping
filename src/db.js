import mysql from 'mysql';

export async function connectToDb ({ host, database, user, password }) {
    const connection = mysql.createConnection({
        host,
        user,
        password,
        database
    });

    connection.connect( err => {
        if ( err )
            console.log( err );
    });
    await setupUsersTable( connection );
    await setupScrapeTable( connection );
    return connection;
}

async function setupUsersTable ( connection ) {
    return new Promise( ( resolve, reject ) => {
        connection.query( "CREATE TABLE IF NOT EXISTS users"
            +"("
                +"id INT,"
                +"email VARCHAR(255) NOT NULL,"
                +"first_name VARCHAR(255),"
                +"last_name VARCHAR(255),"
                +"avatar VARCHAR(255),"
                +"UNIQUE KEY (id, email)"
            +")"
        , ( err, result ) => {
            if ( err ) {
                reject( err );
            }
            resolve( result );
        });
    });
}

async function setupScrapeTable ( connection ) {
    return new Promise( ( resolve, reject ) => {
        connection.query( "CREATE TABLE IF NOT EXISTS scraps"
            +"("
                +"date VARCHAR(255),"
                +"commission VARCHAR(255),"
                +"sale INT,"
                +"lead INT,"
                +"clicks INT,"
                +"epc VARCHAR(255),"
                +"impression INT,"
                +"cr VARCHAR(255),"
                +"UNIQUE KEY (date)"
            +")"
        , ( err, result ) => {
            if ( err ) {
                reject( err );
            }
            resolve( result );
        });
    });
}

export function saveUsers( users, conn ) {
    return new Promise( ( resolve, reject ) => {
        conn.query(
            'INSERT IGNORE INTO users ( id, email, first_name, last_name, avatar ) VALUES ?',
            [users.map( user => [user.id, user.email, user.first_name, user.last_name, user.avatar] )],
            ( err, result ) => {
                if ( err ) {
                    reject( err );
                }
                resolve( result );
            }
        );

    });
}

export function saveScrap( scraps, conn ) {
    return new Promise( ( resolve, reject ) => {
        conn.query(
            'INSERT IGNORE INTO scraps ( date, commission, sale, lead, clicks, epc, impression, cr ) VALUES ?',
            [ scraps ],
            ( err, result ) => {
                if ( err ) {
                    reject( err );
                }
                resolve( result );
            }
        );

    });
}

export function getUsers  ( conn ) {
    return  new Promise( ( resolve, reject ) => {
        conn.query( 
            'SELECT * FROM users'
        , ( err, result ) => {
            if ( err ) {
                reject( err );
            }
            resolve( result );
        });
    });
}

export function getScraps  ( conn ) {
    return  new Promise( ( resolve, reject ) => {
        conn.query( 
            'SELECT * FROM scraps'
        , ( err, result ) => {
            if ( err ) {
                reject( err );
            }
            resolve( result );
        });
    });
}
