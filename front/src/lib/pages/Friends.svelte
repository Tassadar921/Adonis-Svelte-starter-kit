<script lang="ts">
    import { t } from 'svelte-i18n';
    import Title from '../shared/Title.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import Search from '../shared/Search.svelte';
    import Pagination from '../shared/Pagination.svelte';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import AddFriends from '../friends/AddFriends.svelte';
    import Button from '../shared/Button.svelte';
    import ConfirmModal from '../shared/ConfirmModal.svelte';
    import { showToast } from '../../services/toastService';
    import { profile } from '../../stores/profileStore';
    import { transmit } from '../../stores/transmitStore';
    import type PaginatedFriends from 'adonis-svelte-starter-kit-backend/app/types/paginated/paginated_friends';
    import type SerializedUser from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_user';
    import type SerializedFriend from 'adonis-svelte-starter-kit-backend/app/types/serialized/serialized_friend';
    import Loader from '../shared/Loader.svelte';
    import Icon from '../shared/Icon.svelte';
    import { MetaTags } from 'svelte-meta-tags';

    let isLoading: boolean = false;
    let paginatedFriends: PaginatedFriends;
    let searchBaseUrl: string = '/api/friends';
    let query: string = '';

    let selectedFriend: SerializedUser;

    let showAddFriendsModal: boolean = false;
    let showConfirmRemoveFriendModal: boolean = false;
    let showBlockingModal: boolean = false;

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
            const { data } = await axios.delete(`/api/friends/remove/${selectedFriend.id}`);
            paginatedFriends.friends = paginatedFriends.friends.filter((friendObject: SerializedFriend) => friendObject.friend.id !== selectedFriend.id);
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
            const { data } = await axios.get(`/api/blocked/add/${selectedFriend.id}`);
            paginatedFriends.friends = paginatedFriends.friends.filter((friendObject: SerializedFriend) => friendObject.friend.id !== selectedFriend.id);
            showToast(data.message);
            showBlockingModal = false;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const setupEvents = async (): Promise<void> => {
        // update when a friend removes us from its friends
        const removeFriend = $transmit.subscription(`notification/friend/remove/${$profile!.id}`);
        await removeFriend.create();
        removeFriend.onMessage(async (user: SerializedUser) => {
            paginatedFriends.friends = paginatedFriends.friends.filter((friendObject: SerializedFriend) => friendObject.friend.id !== user.id);
        });

        const blockFriend = $transmit.subscription(`notification/blocked/${$profile!.id}`);
        await blockFriend.create();
        blockFriend.onMessage(async (user: SerializedUser) => {
            paginatedFriends.friends = paginatedFriends.friends.filter((friendObject: SerializedFriend) => friendObject.friend.id !== user.id);
        });
    };

    $: {
        if ($profile) {
            setupEvents();
        }
    }
</script>

<MetaTags
    title={$t('social.friends.meta.title')}
    description={$t('social.friends.meta.description')}
    keywords={$t('social.friends.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/social/friends`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/social/friends`,
        },
    ]}
    openGraph={{
        title: $t('social.friends.meta.title'),
        description: $t('social.friends.meta.description'),
    }}
    twitter={{
        title: $t('social.friends.meta.title'),
        description: $t('social.friends.meta.description'),
    }}
/>

<Title title={$t('social.friends.title')} />

<Breadcrumbs items={[{ label: $t('home.title'), path: '/' }, { label: $t('social.title'), path: '/social' }, { label: $t('social.friends.title') }]} />

{#if paginatedFriends}
    <div class="flex gap-3 items-center">
        <Button
            ariaLabel="Add a friend"
            customStyle
            className="rounded-full bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 p-1 mb-1.5"
            on:click={() => (showAddFriendsModal = true)}
        >
            <Icon name="plus" />
        </Button>
    </div>

    <Search
        selected
        bind:results={paginatedFriends.friends}
        placeholder={$t('social.friends.search.placeholder')}
        label={$t('social.friends.search.label')}
        name="search-friend"
        bind:search={query}
        on:search={handleSearch}
    />

    <div class="flex flex-row flex-wrap gap-5 justify-center my-5">
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
                                    src={`${import.meta.env.VITE_API_BASE_URI}/api/static/profile-picture/${friendObject.friend.id}?token=${localStorage.getItem('apiToken')}`}
                                    class="w-10 rounded-full"
                                />
                            {:else}
                                <img alt={friendObject.friend.username} src={import.meta.env.VITE_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
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
            <p class="mt-5">{$t('social.friends.none')}</p>
        {/if}
    </div>
    <Pagination bind:paginatedObject={paginatedFriends} baseUrl={searchBaseUrl} />
{:else}
    <Loader {isLoading} />
{/if}

<Modal bind:showModal={showAddFriendsModal} fullWidth>
    <Subtitle slot="header">{$t('social.friends.add.title')}</Subtitle>
    <AddFriends on:updateFriends={updateFriends} />
</Modal>

<ConfirmModal bind:showModal={showConfirmRemoveFriendModal} on:success={handleRemoveFriend}>
    <Subtitle slot="header">{$t('social.friends.remove.modal.title')}</Subtitle>
    <p>{selectedFriend.username} {$t('social.friends.remove.modal.text')}</p>
</ConfirmModal>

<ConfirmModal bind:showModal={showBlockingModal} on:success={handleBlockUser}>
    <Subtitle slot="header">{$t('social.blocked.modal.title')}</Subtitle>
    <p>{selectedFriend.username} {$t('social.blocked.modal.text')}</p>
</ConfirmModal>
