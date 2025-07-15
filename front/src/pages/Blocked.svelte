<script lang="ts">
    import { m } from '#lib/paraglide/messages';
    import { Title } from '#lib/components/ui/title';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '#components/Search.svelte';
    import Pagination from '#components/Pagination.svelte';
    import { Button } from '$lib/components/ui/button';
    import { showToast } from '#services/toastService';
    import Loader from '#components/Loader.svelte';
    import Icon from '#components/Icon.svelte';
    import { PUBLIC_API_BASE_URI, PUBLIC_DEFAULT_IMAGE } from '$env/static/public';
    import { type PaginatedBlockedUsers, type SerializedUser, type SerializedBlockedUser } from 'backend/types';
    import Meta from '#components/Meta.svelte';
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

    let isLoading: boolean = false;
    let paginatedBlockedUsers: PaginatedBlockedUsers;
    let searchBaseUrl: string = '/api/blocked';
    let query: string = '';
    let selectedBlockedUser: SerializedUser;
    let showModal: boolean = false;

    onMount(async (): Promise<void> => {
        await updateBlockedUsers();
    });

    const handleSearch = async (): Promise<void> => {
        searchBaseUrl = `/api/blocked?${query ? `query=${query}` : ''}`;
        await updateBlockedUsers();
    };

    const updateBlockedUsers = async () => {
        try {
            const { data } = await axios.get(searchBaseUrl);
            paginatedBlockedUsers = data.blockedUsers;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const handleUnblockUser = async (): Promise<void> => {
        try {
            const { data } = await axios.delete(`/api/blocked/cancel/${selectedBlockedUser.id}`);
            paginatedBlockedUsers.blockedUsers = paginatedBlockedUsers.blockedUsers.filter((currentUser: SerializedBlockedUser) => {
                return currentUser.user.id !== selectedBlockedUser.id;
            });
            showToast(data.message);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
        showModal = false;
    };

    const handleShowUnblockModal = (user: SerializedUser): void => {
        selectedBlockedUser = user;
        showModal = true;
    };
</script>

<Meta title={m['social.blocked.meta.title']()} description={m['social.blocked.meta.description']()} keywords={m['social.blocked.meta.keywords']().split(', ')} pathname="/social/blocked" />

<Title title={m['social.blocked.title']()} />

{#if paginatedBlockedUsers}
    <Search
        selected
        bind:results={paginatedBlockedUsers.blockedUsers}
        placeholder={m['social.blocked.search.placeholder']()}
        label={m['social.blocked.search.label']()}
        name="search-blocked"
        minChars={3}
        bind:search={query}
        on:search={handleSearch}
    />

    <div class="flex flex-wrap gap-5 justify-center my-5">
        {#if paginatedBlockedUsers.blockedUsers.length}
            <div class="flex flex-col gap-1 w-full">
                {#each paginatedBlockedUsers.blockedUsers as blocked}
                    <div
                        class="flex justify-between items-center h-12 border border-gray-300 dark:border-gray-800 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-300 px-3"
                    >
                        <div class="flex gap-5 flex-wrap items-center">
                            {#if blocked.user.profilePicture}
                                <img
                                    alt={blocked.user.username}
                                    src={`${PUBLIC_API_BASE_URI}/api/static/profile-picture/${blocked.user.id}?token=${localStorage.getItem('apiToken')}`}
                                    class="w-10 rounded-full"
                                />
                            {:else}
                                <img alt={blocked.user.username} src={PUBLIC_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
                            {/if}
                            <p>{blocked.user.username}</p>
                        </div>
                        <Button aria-label="Unblock user" onclick={() => handleShowUnblockModal(blocked.user)}>
                            <Icon name="unblock" />
                        </Button>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="my-5">{m['social.blocked.none']()}</p>
        {/if}
    </div>
    <Pagination bind:paginatedObject={paginatedBlockedUsers} baseUri={searchBaseUrl} />
{:else}
    <Loader {isLoading} />
{/if}

<AlertDialog open={showModal}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>{m['social.unblock.modal.title']()}</AlertDialogTitle>
            <AlertDialogDescription>{m['social.unblock.modal.text']({ username: selectedBlockedUser.username || '' })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>{m['common.cancel']()}</AlertDialogCancel>
            <AlertDialogAction onclick={handleUnblockUser}>{m['common.continue']()}</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
