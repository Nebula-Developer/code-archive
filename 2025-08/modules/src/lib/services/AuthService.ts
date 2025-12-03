import { createMutable } from "solid-js/store";
import { BaseService } from "../core/BaseService";

/**
 * Authentication service state interface
 */
export interface AuthState {
	loggedIn: boolean;
	user: string | null;
}

/**
 * Authentication service events
 */
export const AuthEventType = {
	LOGIN: "auth:login",
	LOGOUT: "auth:logout",
} as const;

/**
 * Login event payload
 */
export interface LoginPayload {
	user: string;
}

/**
 * Authentication service
 */
export class AuthService extends BaseService {
	static readonly SERVICE_ID = "nebula.authservice";
	private _state: AuthState;

	constructor() {
		super(AuthService.SERVICE_ID);
		this._state = createMutable<AuthState>({ loggedIn: false, user: null });
	}

	/**
	 * Get the reactive state
	 */
	get state(): AuthState {
		return this._state;
	}

	/**
	 * Login a user
	 */
	login(username: string): void {
		this._state.loggedIn = true;
		this._state.user = username;
		this.emit(AuthEventType.LOGIN, { user: username });
	}

	/**
	 * Logout the current user
	 */
	logout(): void {
		this._state.loggedIn = false;
		this._state.user = null;
		this.emit(AuthEventType.LOGOUT, {});
	}
}
