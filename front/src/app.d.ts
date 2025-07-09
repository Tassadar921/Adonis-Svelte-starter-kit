// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
export type PageDataError = {
    type: 'success' | 'error';
    message: string;
};

declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        interface PageData {
            flash?: PageDataError;
        }
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
