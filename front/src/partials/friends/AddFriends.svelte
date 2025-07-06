<script lang="ts">
    import { m } from '#lib/paraglide/messages';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Pagination from '#components/Pagination.svelte';
    import { showToast } from '#services/toastService';
    import Search from '#components/Search.svelte';
    import Button from '#components/Button.svelte';
    import ConfirmModal from '#components/ConfirmModal.svelte';
    import Subtitle from '#components/Subtitle.svelte';
    import { transmit } from '#stores/transmitStore';
    import { profile } from '#stores/profileStore';
    import { createEventDispatcher } from 'svelte';
    import { setPendingFriendRequests } from '#stores/notificationStore';
    import type SerializedUser from 'backend/app/types/serialized/serialized_user';
    import type PaginatedUsers from 'backend/app/types/paginated/paginated_users';
    import type SerializedPendingFriend from 'backend/app/types/serialized/serialized_pending_friend';
    import Loader from '#components/Loader.svelte';
    import Icon from '#components/Icon.svelte';
    import { PUBLIC_API_BASE_URI } from '$env/static/public';

    const dispatch = createEventDispatcher();

    let isLoading: boolean = $state(false);
    let paginatedUsers: PaginatedUsers | undefined = $state();
    let searchBaseUrl: string = $state('/api/friends/add?');
    let query: string = $state('');
    let showModal: boolean = $state(false);
    let blockingUser: SerializedUser | undefined = $state();

    onMount(async (): Promise<void> => {
        await updateAddFriends();
    });

    const handleSearch = async (): Promise<void> => {
        searchBaseUrl = `/api/friends/add?${query ? `query=${query}` : ''}`;
        await updateAddFriends();
    };

    const updateAddFriends = async (): Promise<void> => {
        try {
            const { data } = await axios.get(searchBaseUrl);
            paginatedUsers = data.users;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const handleAddFriend = async (user: SerializedUser): Promise<void> => {
        try {
            const { data } = await axios.post('/api/friends/ask', {
                userId: user.id,
            });
            updateUser(user.id, { sentFriendRequest: true });
            showToast(data.message);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const handleCancelFriendRequest = async (user: SerializedUser): Promise<void> => {
        try {
            const { data } = await axios.delete(`/api/friends/pending/cancel/${user.id}`);
            updateUser(user.id, { sentFriendRequest: false });
            showToast(data.message);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const handleBlockUser = async (): Promise<void> => {
        try {
            const { data } = await axios.get(`/api/blocked/add/${blockingUser?.id}`);
            if (paginatedUsers) {
                paginatedUsers.users = paginatedUsers.users.filter((currentUser) => currentUser.id !== blockingUser?.id);
            }
            showToast(data.message);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
        showModal = false;
    };

    const updateUser = (userId: number, updates: Partial<SerializedUser>): void => {
        if (!paginatedUsers) {
            return;
        }
        paginatedUsers = {
            ...paginatedUsers,
            users: paginatedUsers.users.map((user) => (user.id === userId ? { ...user, ...updates } : user)),
        };
    };

    const handleShowBlockingModal = (user: SerializedUser): void => {
        blockingUser = user;
        showModal = true;
    };

    const setupEvents = async (): Promise<void> => {
        // sender updated when receiver accepts friend request
        const acceptedFriendRequest = $transmit!.subscription(`notification/add-friend/accept/${$profile!.id}`);
        await acceptedFriendRequest.create();
        acceptedFriendRequest.onMessage((user: SerializedUser) => {
            if (paginatedUsers) {
                paginatedUsers.users = paginatedUsers.users.filter((currentUser) => currentUser.id !== user?.id);
            }
            dispatch('updateFriends');
        });

        // sender updated when friend request is refused by receiver
        const refuseFriendRequest = $transmit!.subscription(`notification/add-friend/refuse/${$profile!.id}`);
        await refuseFriendRequest.create();
        refuseFriendRequest.onMessage((user: SerializedUser) => {
            updateUser(user.id, { sentFriendRequest: false });
        });

        // receiver updated when request received
        const receivedFriendRequest = $transmit!.subscription(`notification/add-friend/${$profile!.id}`);
        await receivedFriendRequest.create();
        receivedFriendRequest.onMessage((pendingFriendRequest: SerializedPendingFriend) => {
            updateUser(pendingFriendRequest.notification.from.id, { receivedFriendRequest: true });
        });

        // receiver updated when his request is cancelled by sender
        const cancelFriendRequest = $transmit!.subscription(`notification/add-friend/cancel/${$profile!.id}`);
        await cancelFriendRequest.create();
        cancelFriendRequest.onMessage((pendingFriendRequest: SerializedPendingFriend) => {
            updateUser(pendingFriendRequest.notification.from.id, { receivedFriendRequest: false });
        });

        // receiver updated when becomes blocked
        const blockedUser = $transmit!.subscription(`notification/blocked/${$profile!.id}`);
        await blockedUser.create();
        blockedUser.onMessage((user: SerializedUser) => {
            if (paginatedUsers) {
                paginatedUsers.users = paginatedUsers.users.filter((currentUser) => currentUser.id !== user?.id);
            }
        });

        // receiver updated when becomes unblocked
        const unblockedUser = $transmit!.subscription(`notification/unblocked/${$profile!.id}`);
        await unblockedUser.create();
        unblockedUser.onMessage(async () => {
            await updateAddFriends();
        });

        // update when a user removes us from its friends
        const removeFriend = $transmit!.subscription(`notification/friend/remove/${$profile!.id}`);
        await removeFriend.create();
        removeFriend.onMessage(async () => {
            await updateAddFriends();
        });
    };

    const handleAcceptPendingRequest = async (user: SerializedUser): Promise<void> => {
        try {
            const { data } = await axios.post('/api/friends/accept', { userId: user.id });
            showToast(data.message, 'success', '/friends');
            await setPendingFriendRequests();
            if (paginatedUsers) {
                paginatedUsers.users = paginatedUsers.users.filter((currentUser) => currentUser.id !== user?.id);
            }
            dispatch('updateFriends');
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const handleRefusePendingRequest = async (user: SerializedUser): Promise<void> => {
        try {
            const { data } = await axios.post('/api/friends/refuse', { userId: user.id });
            showToast(data.message, 'success', '/friends');
            await setPendingFriendRequests();
            updateUser(user.id, { receivedFriendRequest: false });
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    $effect((): void => {
        if ($profile) {
            setupEvents();
        }
    });
</script>

{#if paginatedUsers}
    <Search
        selected
        bind:results={paginatedUsers.users}
        placeholder={m['social.friends.add.search.placeholder']()}
        label={m['social.friends.add.search.label']()}
        name="search-user"
        minChars={3}
        bind:search={query}
        on:search={handleSearch}
    />

    <div class="flex flex-wrap gap-5 justify-center my-5">
        {#if paginatedUsers.users.length}
            <div class="flex flex-col gap-1 w-full">
                {#each paginatedUsers.users as user}
                    <div
                        class="flex justify-between items-center h-12 border border-gray-300 dark:border-gray-800 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-300 px-3"
                    >
                        <div class="flex gap-5 flex-wrap items-center">
                            {#if user.profilePicture}
                                <img alt={user.username} src={`${PUBLIC_API_BASE_URI}/api/static/profile-picture/${user.id}?token=${localStorage.getItem('apiToken')}`} class="w-10 rounded-full" />
                            {:else}
                                <img alt={user.username} src={PUBLIC_API_BASE_URI} class="max-h-10 rounded-full" />
                            {/if}
                            <p>{user.username}</p>
                        </div>
                        <div class="flex gap-5">
                            {#if user.sentFriendRequest}
                                <Button
                                    ariaLabel="Cancel friend request"
                                    customStyle
                                    className="transition-all duration-300 hover:scale-110 transform text-red-600 hover:text-red-500"
                                    on:click={() => handleCancelFriendRequest(user)}
                                >
                                    <Icon name="close" />
                                </Button>
                            {:else if user.receivedFriendRequest}
                                <div class="flex gap-5">
                                    <Button
                                        ariaLabel="Accept as friend"
                                        customStyle
                                        className="transition-all duration-300 hover:scale-110 transform text-green-600 hover:text-green-400"
                                        on:click={() => handleAcceptPendingRequest(user)}
                                    >
                                        <Icon name="confirm" />
                                    </Button>
                                    <Button
                                        ariaLabel="Refuse friend request"
                                        customStyle
                                        className="transition-all duration-300 hover:scale-110 transform text-red-600 hover:text-red-400"
                                        on:click={() => handleRefusePendingRequest(user)}
                                    >
                                        <Icon name="close" />
                                    </Button>
                                </div>
                            {:else}
                                <Button
                                    ariaLabel="Send friend request"
                                    customStyle
                                    className="transition-all duration-300 hover:scale-110 transform text-green-600 hover:text-green-400 flex gap-1"
                                    on:click={() => handleAddFriend(user)}
                                >
                                    <Icon name="addUser" />
                                </Button>
                            {/if}
                            <Button
                                ariaLabel="Block user"
                                customStyle
                                className="transition-all duration-300 hover:scale-110 transform text-red-600 hover:text-red-400"
                                on:click={() => handleShowBlockingModal(user)}
                            >
                                <Icon name="stop" />
                            </Button>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="my-5">{m['social.friends.add.none']()}</p>
        {/if}
    </div>
    <Pagination bind:paginatedObject={paginatedUsers} baseUrl={searchBaseUrl} />
{:else}
    <Loader {isLoading} />
{/if}

<ConfirmModal bind:showModal on:success={handleBlockUser}>
    <Subtitle slot="header">{m['social.blocked.modal.title']()}</Subtitle>
    <p>{blockingUser?.username} {m['social.blocked.modal.text']()}</p>
</ConfirmModal>
