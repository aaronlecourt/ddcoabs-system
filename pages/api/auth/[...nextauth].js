import connectMongo from '../../../utils/connectMongo';
import { connect } from "http2";
import User from '../../../models/User';
import NextAuth from "next-auth/next"
// import Providers from "next-auth/providers"
import CredentialsProviders from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProviders({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;
        
        try {
          await connectMongo();

          const user = await User.findOne({ email });

          if (!user) {
            console.log('user not found')
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            console.log('password did not match')
            return null;
          }

          console.log('log in success')
          return user;
        } catch (error) {
          console.log(error);
        }
      }
    })
    // Providers.GitHub({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // ...add more providers here
  ],
  callbacks: {
    // jwt: async ({ token, user }) => {
    //   // the user object is what returned from the Credentials login, it has `accessToken` from the server `/login` endpoint
    //   // assign the accessToken to the `token` object, so it will be available on the `session` callback
    //   if (user) {
    //     token.accessToken = user.accessToken
    //   }
    //   return token
    // },
    session: async ({ session, token }) => {
      const user = await User.findOne({ _id: token.sub });
      // Object.assign(session, {
      //   accessToken: token.accessToken
      // })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: user.role,
          // jwt: true
        },
      }
    },
  },

  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/home",
  }

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
};

export default NextAuth(authOptions)