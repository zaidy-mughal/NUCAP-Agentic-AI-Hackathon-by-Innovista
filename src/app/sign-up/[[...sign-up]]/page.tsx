import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <SignUp 
        afterSignUpUrl="/profile/create"
        signInUrl="/sign-in"
      />
    </div>
  );
}

