<script lang="ts">
    import { m } from '#lib/paraglide/messages';
    import { Title } from '#lib/components/ui/title';
    import { onMount } from 'svelte';
    import Search from '#components/Search.svelte';
    import Pagination from '#components/Pagination.svelte';
    import AddFriends from '#partials/social/friends/AddFriends.svelte';
    import { Button } from '#lib/components/ui/button';
    import { profile } from '#stores/profileStore';
    import { waitForTransmit } from '#stores/transmitStore';
    import { type PaginatedFriends } from 'backend/types';
    import { type SerializedUser } from 'backend/types';
    import { type SerializedFriend } from 'backend/types';
    import Loader from '#components/Loader.svelte';
    import Icon from '#components/Icon.svelte';
    import Meta from '#components/Meta.svelte';
    import { PUBLIC_API_BASE_URI, PUBLIC_DEFAULT_IMAGE } from '$env/static/public';
    import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
    } from '#lib/components/ui/alert-dialog';
    import { Dialog, DialogContent, DialogHeader, DialogTitle } from '#lib/components/ui/dialog';
    import { wrappedFetch } from '#services/requestService';
    import { UserRoundPlus } from '@lucide/svelte';
    import type { Transmit } from '@adonisjs/transmit-client';

    let isLoading: boolean = $state(false);
    let paginatedFriends: PaginatedFriends | undefined = $state();
    let friends = $derived(paginatedFriends?.friends || []);
    let query: string = $state('');

    let selectedFriend: SerializedUser | undefined = $state();

    let showAddFriendsModal: boolean = $state(false);
    let showConfirmRemoveFriendModal: boolean = $state(false);
    let showBlockingModal: boolean = $state(false);

    // To avoid a tailwindcss bug where it's trying to parse the result of the placeholder if put directly into search's placeholder attribute
    const searchPlaceholder: string = m['social.friends.search.placeholder']();

    onMount(async (): Promise<void> => {
        await setupEvents();
        await updateFriends();
    });

    const updateFriends = async (page: number = 1, limit: number = 10): Promise<void> => {
        await wrappedFetch(`/social/friends?page=${page}&limit=${limit}&query=${query}`, { method: 'GET' }, (data) => {
            paginatedFriends = data.friends;
        });
    };

    const handleShowRemoveFriendModal = (user: SerializedUser): void => {
        selectedFriend = user;
        showConfirmRemoveFriendModal = true;
    };

    const handleRemoveFriend = async (): Promise<void> => {
        await wrappedFetch(`/social/friends/remove/${selectedFriend?.id}`, { method: 'DELETE' }, () => {
            if (paginatedFriends) {
                paginatedFriends.friends = paginatedFriends.friends.filter((friendObject) => friendObject.friend.id !== selectedFriend?.id);
            }
            showConfirmRemoveFriendModal = false;
        });
    };

    const handleShowBlockingModal = (user: SerializedUser): void => {
        selectedFriend = user;
        showBlockingModal = true;
    };

    const handleBlockUser = async (): Promise<void> => {
        await wrappedFetch(`/social/blocked/add/${selectedFriend?.id}`, { method: 'GET' }, () => {
            if (paginatedFriends) {
                paginatedFriends.friends = paginatedFriends.friends.filter((friendObject) => friendObject.friend.id !== selectedFriend?.id);
            }
            showBlockingModal = false;
        });
    };

    const setupEvents = async (): Promise<void> => {
        const transmit: Transmit = await waitForTransmit();

        const removeFriend = transmit.subscription(`notification/friend/remove/${$profile!.id}`);
        await removeFriend.create();
        removeFriend.onMessage(async (user: SerializedUser) => {
            if (paginatedFriends) {
                paginatedFriends.friends = paginatedFriends.friends.filter((f: SerializedFriend) => f.friend.id !== user.id);
            }
        });

        const blockFriend = transmit.subscription(`notification/blocked/${$profile!.id}`);
        await blockFriend.create();
        blockFriend.onMessage(async (user: SerializedUser) => {
            if (paginatedFriends) {
                paginatedFriends.friends = paginatedFriends.friends.filter((f: SerializedFriend) => f.friend.id !== user.id);
            }
        });
    };
</script>

<Meta title={m['social.friends.meta.title']()} description={m['social.friends.meta.description']()} keywords={m['social.friends.meta.keywords']().split(', ')} pathname="/social/friends" />

<Title title={m['social.friends.title']()} />

<div class="flex gap-3 items-center">
    <Button class="bg-green-500 rounded-full" size="icon" aria-label="Add a friend" onclick={() => (showAddFriendsModal = true)}>
        <UserRoundPlus class="size-6" />
    </Button>
</div>

<Search selected placeholder={searchPlaceholder} label={m['social.friends.search.label']()} name="search-friend" onSearch={() => updateFriends()} bind:search={query} bind:resultsArray={friends} />

{#if paginatedFriends}
    <div class="flex flex-wrap gap-5 justify-center my-5">
        {#if paginatedFriends.friends.length}
            <div class="flex flex-col gap-1 w-full">
                {#each paginatedFriends.friends as friendObject}
                    <div
                        class="flex justify-between items-center h-12 border border-gray-300 dark:border-gray-800 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-300 px-3"
                    >
                        <div class="flex gap-5 flex-wrap items-center">
                            {#if friendObject.friend.profilePicture}
                                <img
                                    alt={friendObject.friend.username}
                                    src={`${PUBLIC_API_BASE_URI}/api/static/profile-picture/${friendObject.friend.id}?token=${localStorage.getItem('apiToken')}`}
                                    class="w-10 rounded-full"
                                />
                            {:else}
                                <img alt={friendObject.friend.username} src={PUBLIC_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
                            {/if}
                            <p>{friendObject.friend.username}</p>
                        </div>
                        <div class="flex gap-10 pr-5">
                            <Button aria-label="Remove friend" onclick={() => handleShowRemoveFriendModal(friendObject.friend)}>
                                <Icon name="removeUser" />
                            </Button>
                            <Button aria-label="Block user" onclick={() => handleShowBlockingModal(friendObject.friend)}>
                                <Icon name="stop" />
                            </Button>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="mt-5">{m['social.friends.none']()}</p>
        {/if}
    </div>
    <Pagination paginatedObject={paginatedFriends} onChange={async (page: number, limit: number) => await updateFriends(page, limit)} />
{:else}
    <Loader {isLoading} />
{/if}

<Dialog bind:open={showAddFriendsModal}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>{m['social.friends.add.title']()}</DialogTitle>
        </DialogHeader>
        <AddFriends onUpdateFriends={updateFriends} />
    </DialogContent>
</Dialog>

<AlertDialog open={showConfirmRemoveFriendModal}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>{m['social.friends.remove.modal.title']()}</AlertDialogTitle>
            <AlertDialogDescription>{m['social.friends.remove.modal.text']({ username: selectedFriend?.username || '' })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>{m['common.cancel']()}</AlertDialogCancel>
            <AlertDialogAction onclick={handleRemoveFriend}>{m['common.continue']()}</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>

<AlertDialog open={showBlockingModal}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>{m['social.blocked.modal.title']()}</AlertDialogTitle>
            <AlertDialogDescription>{m['social.blocked.modal.text']({ username: selectedFriend?.username || '' })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>{m['common.cancel']()}</AlertDialogCancel>
            <AlertDialogAction onclick={handleBlockUser}>{m['common.continue']()}</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
