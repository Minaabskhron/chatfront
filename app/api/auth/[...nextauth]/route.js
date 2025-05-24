import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials", // Display name for this provider
      credentials: {
        // Defines login form fields
        email: { label: "Email", type: "email" }, // Email input
        password: { label: "Password", type: "password" }, // Password input
      },
      async authorize(credentials) {
        // This function is called when user submits login form
        try {
          // Send credentials to your backend API
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASEURL}/api/v1/user/signin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials), // Send email/password
            }
          );

          const user = await res.json(); // Parse API response

          if (!res.ok) {
            // If HTTP status is not 200-299
            throw new Error(user.error || "Authentication failed");
          }

          // Returned object gets stored in JWT
          return user;
        } catch (error) {
          throw new Error(error.message); // Rejects login
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt", // Uses JWT for session management
  },
  secret: process.env.AUTH_SECRET, // Encryption key
  callbacks: {
    async jwt({ token, user }) {
      // Called when:
      // - User logs in (initial token creation)
      // - Session is accessed (token updates)

      if (user) {
        // First login
        token.accessToken = user.token; // Store API's JWT
        token.role = user.user.role; // Add custom claim
        token.name = user.user.name; // <-- Add this line
        token.email = user.user.email; // optional
        token.username = user.user.username; // optional
        token._id = user.user._id;
      }
      return token; // Becomes available in session callback
    },
    async session({ session, token }) {
      // Exposes data to client components via useSession()
      session.accessToken = token.accessToken; // For API calls
      session.user.role = token.role; // For role-based UI
      session.user.name = token.name; // <-- Add this line
      session.user.email = token.email; // optional
      session.user.username = token.username; // optional
      session.user._id = token._id; // optional
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
