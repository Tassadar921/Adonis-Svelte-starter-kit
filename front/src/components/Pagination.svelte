<script lang="ts">
    import { Button } from '$lib/components/ui/button/index';
    import axios from 'axios';
    import Loader from '#components/Loader.svelte';
    import Icon from '#components/Icon.svelte';

    interface PaginatedObject {
        currentPage: number;
        firstPage: number;
        lastPage: number;
        perPage: number;
        total: number;
    }

    type Props = {
        baseUri: string;
        paginatedObject: PaginatedObject;
        containerElement: Window | HTMLElement;
    };

    let { baseUri, paginatedObject, containerElement = window }: Props = $props();

    let canGoBack: boolean = $state(false);
    let canGoForward: boolean = $state(false);
    let isLoading: boolean = $state(false);

    const handleClick = async (page: number, perPage: number) => {
        try {
            isLoading = true;
            const { data } = await axios.get(`${baseUri}&page=${page}&perPage=${perPage}`);
            paginatedObject = data;
        } catch (error: any) {
            console.error('Failed to fetch paginated data:', error);
        } finally {
            isLoading = false;
            if (containerElement) {
                containerElement.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }
        }
    };

    $effect((): void => {
        canGoBack = paginatedObject.currentPage > paginatedObject.firstPage;
        canGoForward = paginatedObject.currentPage < paginatedObject.lastPage;
    });
</script>

<div class="my-2 flex gap-3 justify-center" class:hidden={paginatedObject.lastPage === 1}>
    {#if paginatedObject.currentPage}
        {#if !isLoading}
            <!-- First Page Button -->
            <Button disabled={!canGoBack} onclick={() => handleClick(paginatedObject.firstPage, paginatedObject.perPage)}>
                <Icon name="doubleChevronLeft" />
            </Button>
            <!-- Previous Page Button -->
            <Button disabled={!canGoBack} onclick={() => handleClick(paginatedObject.currentPage - 1, paginatedObject.perPage)}>
                <Icon name="arrowLeft" />
            </Button>
            <!-- Page Indicator -->
            <p>
                {paginatedObject.currentPage} / {paginatedObject.lastPage}
            </p>
            <!-- Next Page Button -->
            <Button disabled={!canGoForward} onclick={() => handleClick(paginatedObject.currentPage + 1, paginatedObject.perPage)}>
                <Icon name="chevronRight" />
            </Button>
            <!-- Last Page Button -->
            <Button disabled={!canGoForward} onclick={() => handleClick(paginatedObject.lastPage, paginatedObject.perPage)}>
                <Icon name="doubleChevronRight" />
            </Button>
        {:else}
            <Loader {isLoading} />
        {/if}
    {/if}
</div>
