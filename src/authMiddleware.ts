import passport from "koa-passport";
import { pool } from "./db";
import { Strategy } from "passport-local";
import bcrypt from 'bcrypt';

type UserType = {
  id: string;
  username: string;
  password: string;
};

export function authMiddleware() {
  passport.serializeUser((user: UserType, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const client = await pool.connect();
    const user = await client.query("SELECT * FROM users WHERE id=$1", [id]);
    done(null, user.rows[0]);
  });

  passport.use(
    new Strategy(async (username, password, done) => {
      try {
        const client = await pool.connect();
        const users = await client.query(
          "SELECT * FROM users WHERE username=$1",
          [username]
        );
        const user = users.rows[0];
        console.log({ user });
        if (await bcrypt.compare(password, user.password)) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        done(err);
      }
    })
  );
}
