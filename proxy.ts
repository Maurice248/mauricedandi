import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/dashboards/:path*", "/protected/:path*", "/api/api-keys/:path*"],
};
