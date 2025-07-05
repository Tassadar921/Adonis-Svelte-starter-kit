<script lang="ts">
    import { m } from '$lib/paraglide/messages';
    import { Title } from '$lib/components/ui/title';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '#components/Search.svelte';
    import Pagination from '#components/Pagination.svelte';
    import Modal from '#components/Modal.svelte';
    import Subtitle from '#components/Subtitle.svelte';
    import AddFriends from '#partials/friends/AddFriends.svelte';
    import Button from '#components/Button.svelte';
    import ConfirmModal from '#components/ConfirmModal.svelte';
    import { showToast } from '#services/toastService';
    import { profile } from '#stores/profileStore';
    import { transmit } from '#stores/transmitStore';
    import type PaginatedFriends from 'adonis-svelte-starter-kit-backend/app/types/paginated/paginated_friends';
    import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';
    import type SerializedFriend from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_friend';
    import Loader from '#components/Loader.svelte';
    import Icon from '#components/Icon.svelte';
    import Meta from '#components/Meta.svelte';
    import { PUBLIC_API_BASE_URI, PUBLIC_DEFAULT_IMAGE } from '$env/static/public';

    let isLoading: boolean = $state(false);
    let paginatedFriends: PaginatedFriends | undefined = $state();
    let searchBaseUrl: string = $state('/api/friends');
    let query: string = $state('');

    let selectedFriend: SerializedUser | undefined = $state();

    let showAddFriendsModal: boolean = $state(false);
    let showConfirmRemoveFriendModal: boolean = $state(false);
    let showBlockingModal: boolean = $state(false);

    onMount(async (): Promise<void> => {
        await updateFriends();
    });

    const handleSearch = async (): Promise<void> => {
        searchBaseUrl = `/api/friends?${query ? `query=${query}` : ''}`;
        const { data } = await axios.get(searchBaseUrl);
        paginatedFriends = data.friends;
    };

    const updateFriends = async (): Promise<void> => {
        try {
            const { data } = await axios.get(searchBaseUrl);
            paginatedFriends = data.friends;
        } catch (error: any) {}
    };

    const handleShowRemoveFriendModal = (user: SerializedUser): void => {
        selectedFriend = user;
        showConfirmRemoveFriendModal = true;
    };

    const handleRemoveFriend = async (): Promise<void> => {
        try {
            const { data } = await axios.delete(`/api/friends/remove/${selectedFriend?.id}`);
            if (paginatedFriends) {
                paginatedFriends.friends = paginatedFriends.friends.filter((friendObject: SerializedFriend) => friendObject.friend.id !== selectedFriend?.id);
            }
            showToast(data.message);
            showConfirmRemoveFriendModal = false;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const handleShowBlockingModal = (user: SerializedUser): void => {
        selectedFriend = user;
        showBlockingModal = true;
    };

    const handleBlockUser = async (): Promise<void> => {
        try {
            const { data } = await axios.get(`/api/blocked/add/${selectedFriend?.id}`);
            if (paginatedFriends) {
                paginatedFriends.friends = paginatedFriends.friends.filter((friendObject: SerializedFriend) => friendObject.friend.id !== selectedFriend?.id);
            }
            showToast(data.message);
            showBlockingModal = false;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const setupEvents = async (): Promise<void> => {
        // update when a friend removes us from its friends
        const removeFriend = $transmit!.subscription(`notification/friend/remove/${$profile!.id}`);
        await removeFriend.create();
        removeFriend.onMessage(async (user: SerializedUser) => {
            if (paginatedFriends) {
                paginatedFriends.friends = paginatedFriends?.friends.filter((friendObject: SerializedFriend) => friendObject.friend.id !== user.id);
            }
        });

        const blockFriend = $transmit!.subscription(`notification/blocked/${$profile!.id}`);
        await blockFriend.create();
        blockFriend.onMessage(async (user: SerializedUser) => {
            if (paginatedFriends) {
                paginatedFriends.friends = paginatedFriends?.friends.filter((friendObject: SerializedFriend) => friendObject.friend.id !== user.id);
            }
        });
    };

    $effect((): void => {
        if ($profile) {
            setupEvents();
        }
    });
</script>

<Meta title={m['social.friends.meta.title']()} description={m['social.friends.meta.description']()} keywords={m['social.friends.meta.keywords']().split(', ')} pathname="/social/friends" />

<Title title={m['social.friends.title']()} />

{#if paginatedFriends}
    <div class="flex gap-3 items-center">
        <Button
            ariaLabel="Add a friend"
            customStyle
            className="rounded-full bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 p-1 mb-1.5"
            onclick={() => (showAddFriendsModal = true)}
        >
            <Icon name="plus" />
        </Button>
    </div>

    <Search
        selected
        bind:results={paginatedFriends.friends}
        placeholder={m['social.friends.search.placeholder']()}
        label={m['social.friends.search.label']()}
        name="search-friend"
        bind:search={query}
        on:search={handleSearch}
    />

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
                            <Button
                                ariaLabel="Remove friend"
                                customStyle
                                className="transition-all duration-300 hover:scale-110 transform text-red-600 hover:text-red-400"
                                on:click={() => handleShowRemoveFriendModal(friendObject.friend)}
                            >
                                <Icon name="removeUser" />
                            </Button>
                            <Button
                                ariaLabel="Block user"
                                customStyle
                                className="transition-all duration-300 hover:scale-110 transform text-red-600 hover:text-red-400"
                                on:click={() => handleShowBlockingModal(friendObject.friend)}
                            >
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
    <Pagination bind:paginatedObject={paginatedFriends} baseUrl={searchBaseUrl} />
{:else}
    <Loader {isLoading} />
{/if}

<Modal bind:showModal={showAddFriendsModal} fullWidth>
    <Subtitle slot="header">{m['social.friends.add.title']()}</Subtitle>
    <AddFriends on:updateFriends={updateFriends} />
</Modal>

<ConfirmModal bind:showModal={showConfirmRemoveFriendModal} on:success={handleRemoveFriend}>
    <Subtitle slot="header">{m['social.friends.remove.modal.title']()}</Subtitle>
    <p>{selectedFriend?.username} {m['social.friends.remove.modal.text']()}</p>
</ConfirmModal>

<ConfirmModal bind:showModal={showBlockingModal} on:success={handleBlockUser}>
    <Subtitle slot="header">{m['social.blocked.modal.title']()}</Subtitle>
    <p>{selectedFriend?.username} {m['social.blocked.modal.text']()}</p>
</ConfirmModal>
