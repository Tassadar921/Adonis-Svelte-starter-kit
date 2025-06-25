<script lang="ts">
    import { onMount } from 'svelte';
    import ThemeSwitch from '#components/ThemeSwitch.svelte';
    import Button from '#components/Button.svelte';
    import CommonMenu from './CommonMenu.svelte';
    import FlagMenu from './FlagMenu.svelte';
    import Icon from '#components/Icon.svelte';

    let isOpen: boolean = false;

    let menuElement: HTMLElement;
    let buttonContainerElement: HTMLDivElement;

    const closeMenu = () => {
        isOpen = false;
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (!menuElement.contains(event.target as Node) && !buttonContainerElement.contains(event.target as Node)) {
            closeMenu();
        }
    };

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<div class="relative z-20 flex justify-start">
    <div class="mt-3">
        <!-- Bind the button element reference -->
        <div bind:this={buttonContainerElement}>
            <Button id="menu-button" customStyle className="text-primary-500 hover:text-primary-800 duration-300 transition-colors {isOpen ? 'opacity-0' : ''}" onclick={() => (isOpen = !isOpen)}>
                <Icon name="burger" />
            </Button>
        </div>

        <!-- Bind the menu element reference -->
        <nav
            id="menu"
            class:-translate-x-full={!isOpen}
            class="fixed top-0 left-0 w-64 h-full bg-gray-700 dark:bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-[9999]"
            bind:this={menuElement}
        >
            <div class="flex justify-between items-center p-4">
                <div class="flex gap-5 justify-center items-center">
                    <ThemeSwitch />
                    <div class="mt-2">
                        <FlagMenu />
                    </div>
                </div>
                <Button onclick={closeMenu}>
                    <Icon name="close" />
                </Button>
            </div>

            <CommonMenu on:click={closeMenu} />
        </nav>
    </div>
</div>
