import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      activeOrganizationId?: string;
    } & Session['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    orgId?: string;
  }
}
