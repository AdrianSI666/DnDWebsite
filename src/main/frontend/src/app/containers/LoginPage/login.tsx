import useSignIn from 'react-auth-kit/hooks/useSignIn';

interface ActionResult {
	error?: string;
}

interface LoginData {
	email: string;
    password: string
}

export default async function Login(formData: LoginData): Promise<ActionResult> {
	const signIn = useSignIn();
	const username = formData.email;
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: "Invalid username"
		};
	}
	const password = formData.password;
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return {
			error: "Invalid password"
		};
	}
    // if(signIn({}))
}
