import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { getCsrfToken, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default function LoginPage({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') {
    router.push('/');
  }

  return (
    <div className="container text-center">
      <div className="row align-items-center justify-content-md-center">
        <form
          className="col-md-auto"
          method="post"
          action="/api/auth/callback/credentials"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <h1 className="h3 mb-3 fw-normal">Sign in</h1>
          <div className="form-floating mb-3">
            <input
              id="usernameInput"
              type="text"
              className="form-control"
              name="username"
              // value={username}
              placeholder="johndoe"
              required
            />
            <label htmlFor="usernameInput">Username</label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="passwordInput"
              type="password"
              className="form-control"
              name="password"
              // value={password}
              placeholder="password"
              required
            />
            <label htmlFor="passwordInput">Password</label>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
