import bcrypt from "bcrypt";
import passport from 'koa-passport';
import { pool } from "./db";

export function routes(router) {
  router.get("/", (ctx) => (ctx.body = "This is homepage"));

  router.post("/register", async (ctx) => {
    const { username, password } = ctx.request.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const client = await pool.connect();
    await client.query(
      "insert into users(username, password) values ($1, $2)",
      [username, hashPassword]
    );
    ctx.body = "registered successfully";
  });

  router.post("/login", passport.authenticate("local", {
    successRedirect: '/app',
    failureRedirect: '/'
  }));

  router.get("/app", (ctx) => {
    const user = ctx.session.passport.user;
    console.log({ user });
    ctx.body = "App"});

    router.get('/logout', ctx => {
        ctx.logout();
    })
}
