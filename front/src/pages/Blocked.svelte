<script lang="ts">
    import { m } from '$lib/paraglide/messages';
    import { Title } from '$lib/components/ui/title';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '#components/Search.svelte';
    import Pagination from '#components/Pagination.svelte';
    import Button from '#components/Button.svelte';
    import { showToast } from '#services/toastService';
    import Subtitle from '#components/Subtitle.svelte';
    import ConfirmModal from '#components/ConfirmModal.svelte';
    import type PaginatedBlockedUsers from 'adonis-svelte-starter-kit-backend/app/types/paginated/paginated_blocked_users';
    import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';
    import type SerializedBlockedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_blocked_user';
    import Loader from '#components/Loader.svelte';
    import Icon from '#components/Icon.svelte';
    import { PUBLIC_API_BASE_URI, PUBLIC_DEFAULT_IMAGE } from '$env/static/public';
    import Meta from '#components/Meta.svelte';

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
                        <Button
                            ariaLabel="Unblock user"
                            customStyle
                            className="transition-all duration-300 hover:scale-110 transform text-green-600 hover:text-green-400"
                            on:click={() => handleShowUnblockModal(blocked.user)}
                        >
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

<ConfirmModal bind:showModal on:success={handleUnblockUser}>
    <Subtitle slot="header">{m['social.unblock.modal.title']()}</Subtitle>
    <p>{selectedBlockedUser.username} {m['social.unblock.modal.text']()}</p>
</ConfirmModal>
