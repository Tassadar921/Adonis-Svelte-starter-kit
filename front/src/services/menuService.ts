import { m } from '$lib/paraglide/messages';
import type { Component } from 'svelte';
import { Home, Handshake, UserPen, LogOut, Lock, User } from '@lucide/svelte';

export type MenuItemsListItem = {
    href: string;
    icon: Component;
    title: string;
};

interface MenuItemsList {
    connected: MenuItemsListItem[];
    notConnected: MenuItemsListItem[];
}

export const menuItems: MenuItemsList = {
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
            href: '/admin',
            icon: Lock,
            title: m['admin.title'](),
        },
        {
            href: '/logout',
            icon: LogOut,
            title: m['logout.title'](),
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
