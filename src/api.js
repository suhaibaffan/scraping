import axios from 'axios';

export async function runScript( dbConnection ) {
    const { data: page1Data } = await axios.get( 'https://reqres.in/api/users?page=1' );
    const { data: page2Data } = await axios.get( 'https://reqres.in/api/users?page=2' );
    console.log( page1Data.data.length, page2Data.data.length );
    // save into db
}
