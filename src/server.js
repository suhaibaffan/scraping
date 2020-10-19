import Koa from 'koa';
import KoaRouter from 'koa-router';
import logger from 'koa-logger';
import chalk from 'chalk';
import { getUsers, getScraps } from './db';

export default async function startServer ( conn ) {
    const app = new Koa();
    app.use( errorHandlerMiddleware() );
    app.use( logger() );

    const router = new KoaRouter();

    router.get( '/test', ( ctx, next ) => {
        ctx.body = 'Server is up.'
    });

    router.get( '/users', async ( ctx ) => {
        const users = await getUsers( conn );
        console.log( users.length );
        const response = await buildUserHtml( users );
        // console.log( users );
        ctx.set('Content-Type', 'text/html');
        ctx.body = response;
        return ctx;
    });

    router.get( '/scraps', async ( ctx ) => {
        const scraps = await getScraps( conn );
        const response = await buildScrapHtml( scraps );
        ctx.set('Content-Type', 'text/html');
        ctx.body = response;
        return ctx;
    });

    app.use( router.routes() );
    app.use( router.allowedMethods() );
    app.on( 'error', err => {
        console.log( err );
    });

    app.listen( 8080 );

    console.log( `HTTP server listening on port ${chalk.bold( 8080 )}` );
}

async function buildUserHtml ( data ) {
    const htmltitle = `<h3> <a href="http://localhost:8080/users">Users</a> <a href="http://localhost:8080/scraps">Scraps</a> </h3>`
    let body = " ";
    for ( const element of data ) {
        body = body.concat( `<div>
            <img src="${element.avatar}" width="20" height="20">
            <span> ${element.first_name} </span> <span> ${element.last_name} </span>
            <span style="padding-left:10px"> ${element.email} </span>
            </div>
        `);
    }
    return Buffer.from( `${htmltitle} ${body}` );
}

async function buildScrapHtml ( data ) {
    const htmltitle = `<h3><a href="http://localhost:8080/users">Users</a>  <a href="http://localhost:8080/scraps">Scraps</a> </h3>`
    let body = `<div>
    <span> Date </span>
    <span style="padding-left:60px"> Commission </span>
    <span style="padding-left:10px"> Click </span>
    <span style="padding-left:10px"> Sales </span>
    <span style="padding-left:10px"> Leads </span>
    <span style="padding-left:10px"> EPC </span>
    <span style="padding-left:10px"> Impression </span>
    </div>`;
    for ( const element of data ) {
        body = body.concat( `<div>
            <span> ${element.date} </span>
            <span style="padding-left:30px"> ${element.commission} </span>
            <span style="padding-left:30px"> ${element.clicks} </span>
            <span style="padding-left:30px"> ${element.sale} </span>
            <span style="padding-left:30px"> ${element.lead} </span>
            <span style="padding-left:30px"> ${element.epc} </span>
            <span style="padding-left:30px"> ${element.impression} </span>
            </div>
        `);
    }
    return Buffer.from( `${htmltitle} ${body}` );
}

function errorHandlerMiddleware () {
    return async ( ctx, next ) => {
        try {
            await next();
        } catch ( err ) {
            ctx.status = err.status || 500;
            ctx.body = err.message || err.toString();
        }
    };
}