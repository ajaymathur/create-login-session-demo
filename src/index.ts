import koa from 'koa';
import session from 'koa-session';
import passport from 'koa-passport';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { routes } from './routes';
import { authMiddleware } from './authMiddleware';

async function main() {
    const app = new koa();
    const router = new Router();

    app.keys = ["8c9d4711-e84a-4c5f-982a-de9ea425116b"];

    app.use(session({}, app));

    app.use(bodyParser());

    authMiddleware();
    app.use(passport.initialize());
    app.use(passport.session());

    routes(router);

    app.use(router.routes()).use(router.allowedMethods());

    app.listen(3001);
}

main().catch(err => console.log(err));
