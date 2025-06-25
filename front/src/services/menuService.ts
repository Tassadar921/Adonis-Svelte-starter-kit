import { m } from '$lib/paraglide/messages';
import type { Component } from 'svelte';
import { Home, Handshake, UserPen, LogOut, Lock, User } from '@lucide/svelte';

interface Item {
    href: string;
    icon: Component;
    title: string;
}

interface Items {
    connected: Item[];
    notConnected: Item[];
}

export const menuItems: Items = {
    connected: [
        {
            href: '/',
            icon: Home,
            title: m['home.title'](),
        },
        {
            href: '/social',
            icon: Handshake,
            title: m['home.title'](),
        },
        {
            href: '/profile',
            icon: UserPen,
            title: m['home.title'](),
        },
        {
            href: '/logout',
            icon: LogOut,
            title: m['home.title'](),
        },
        {
            href: '/admin',
            icon: Lock,
            title: m['home.title'](),
        },
    ],
    notConnected: [
        {
            href: '/login',
            icon: User,
            title: m['login.title'](),
        },
        {
            href: '/create-account',
            icon: User,
            title: m['create-account.title'](),
        },
    ],
};
