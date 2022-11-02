import { ReactNode } from "react"

export type User = {
	id: number
	screen_name: string
	name: string
	email: string
	email_verified_at: string | null
	two_factor_recovery_codes: string | null
	two_factor_secret: string | null
	created_at: string
	updated_at: string | null
    description: string;
    age: number;
    gender: 'male' | 'female';
}

export type LoginData = {
	email: string,
	password: string,
    submit: string;
}

export type LoginErrorData = {
	email: string,
	password: string,
    submit: string;
}

export type RegisterData = {
    screen_name: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    description: string;
    age: number;
    gender: 'male' | 'female';
    submit: string;
}

export type RegisterErrorData = {
    screen_name: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    description: string;
    age: string;
    gender: string;
    submit: string;
}

export type authProps = {
	user: User | null;
	register: (registerData: RegisterData) => Promise<void>
	signin: (loginData: LoginData) => Promise<void>;
	signout: () => Promise<void>;
}

export type Props = {
  	children: ReactNode
}

export type RouteProps = {
	children: ReactNode,
	path: string,
	exact?: boolean
}

export type From = {
  	from: Location
}