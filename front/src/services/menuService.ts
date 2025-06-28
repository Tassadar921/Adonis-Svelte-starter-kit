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
            title: m['social.title'](),
        },
        {
            href: '/profile',
            icon: UserPen,
            title: m['profile.title'](),
        },
        {
            href: '/logout',
            icon: LogOut,
            title: m['logout.title'](),
        },
        {
            href: '/admin',
            icon: Lock,
            title: m['admin.title'](),
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
