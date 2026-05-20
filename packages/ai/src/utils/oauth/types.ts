import type { Api, Model } from "../../types.js";

export type OAuthCredentials = {
	refresh: string;
	access: string;
	expires: number;
	[key: string]: unknown;
};

export type OAuthProviderId = string;

/** @deprecated Use OAuthProviderId instead */
export type OAuthProvider = OAuthProviderId;

export type OAuthPrompt = {
	message: string;
	placeholder?: string;
	allowEmpty?: boolean;
};

export const OAUTH_LOGIN_METHODS = ["browser", "device-code"] as const;
export type OAuthLoginMethod = (typeof OAUTH_LOGIN_METHODS)[number];

export function isOAuthLoginMethod(value: string): value is OAuthLoginMethod {
	return OAUTH_LOGIN_METHODS.includes(value as OAuthLoginMethod);
}

export type OAuthAuthInfo = {
	url: string;
	instructions?: string;
	loginMethod?: OAuthLoginMethod;
};

export type OAuthSelectOption = {
	id: string;
	label: string;
};

export type OAuthSelectPrompt = {
	message: string;
	options: OAuthSelectOption[];
};

export interface OAuthLoginCallbacks {
	onAuth: (info: OAuthAuthInfo) => void;
	onPrompt: (prompt: OAuthPrompt) => Promise<string>;
	onProgress?: (message: string) => void;
	onManualCodeInput?: () => Promise<string>;
	/** Optional preferred login method; skips interactive method selection when set. */
	preferredLoginMethod?: OAuthLoginMethod;
	/** Show an interactive selector and return the selected option id, or undefined on cancel. */
	onSelect?: (prompt: OAuthSelectPrompt) => Promise<string | undefined>;
	signal?: AbortSignal;
}

export interface OAuthProviderInterface {
	readonly id: OAuthProviderId;
	readonly name: string;

	/** Run the login flow, return credentials to persist */
	login(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials>;

	/** Whether login uses a local callback server and supports manual code input. */
	usesCallbackServer?: boolean;

	/** Refresh expired credentials, return updated credentials to persist */
	refreshToken(credentials: OAuthCredentials): Promise<OAuthCredentials>;

	/** Convert credentials to API key string for the provider */
	getApiKey(credentials: OAuthCredentials): string;

	/** Optional: modify models for this provider (e.g., update baseUrl) */
	modifyModels?(models: Model<Api>[], credentials: OAuthCredentials): Model<Api>[];
}

/** @deprecated Use OAuthProviderInterface instead */
export interface OAuthProviderInfo {
	id: OAuthProviderId;
	name: string;
	available: boolean;
}
