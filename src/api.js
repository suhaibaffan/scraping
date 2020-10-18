import axios from 'axios';
import { info } from './log';
import { saveUsers } from './db';

export async function runScript( dbConnection ) {
    info( 'Fetching users.' );
    const { data: page1Data } = await axios.get( 'https://reqres.in/api/users?page=1' );
    const { data: page2Data } = await axios.get( 'https://reqres.in/api/users?page=2' );

    await saveUsers( [...page1Data.data, ...page2Data.data ], dbConnection );
    info( 'Script completed.' );
}
