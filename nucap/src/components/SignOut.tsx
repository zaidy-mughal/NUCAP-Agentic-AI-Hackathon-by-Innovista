'use client';

import { SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function SignOut() {
	return (
		<SignOutButton signOutOptions={{ redirectUrl: '/sign-in' }}>
			<Button variant="ghost">Sign Out</Button>
		</SignOutButton>
	);
}


