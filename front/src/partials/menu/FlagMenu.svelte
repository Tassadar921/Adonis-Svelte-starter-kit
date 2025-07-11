<script lang="ts">
    import { onMount } from 'svelte';
    import { Button } from '#lib/components/ui/button';
    import Icon from '#components/Icon.svelte';
    import { type LanguageCode, language } from '#stores/languageStore';
    import { location } from '#stores/locationStore';
    import { ChevronDown } from '@lucide/svelte';
    import { setLocale } from '#lib/paraglide/runtime';
    import { goto } from '$app/navigation';

    type FlagName = 'englishFlag' | 'frenchFlag';

    interface Flag {
        icon: FlagName;
        label: string;
        value: LanguageCode;
    }

    let flags: Flag[] = [
        { icon: 'englishFlag', label: 'English', value: 'en' },
        { icon: 'frenchFlag', label: 'Français', value: 'fr' },
    ];
    let selectedFlag: Flag = $state(flags[0]);
    let isExpanded: boolean = $state(false);
    let popoverRef: HTMLDivElement | undefined = $state();
    let buttonContainerElement: HTMLDivElement | undefined = $state();

    onMount(() => {
        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    });

    const togglePopover = (): void => {
        isExpanded = !isExpanded;
    };

    const selectFlag = async (flag: Flag): Promise<void> => {
        if ($language === flag.value) {
            return;
        }

        selectedFlag = flag;
        isExpanded = false;

        await goto(`/${flag.value}${$location}`);
        setLocale(flag.value);
        window.location.reload();
    };

    const handleClickOutside = (event: MouseEvent): void => {
        if (popoverRef && !popoverRef.contains(event.target as Node) && !buttonContainerElement?.contains(event.target as Node)) {
            isExpanded = false;
        }
    };

    $effect((): void => {
        const match: Flag | undefined = flags.find((flag) => flag.value === $language);
        selectedFlag = match || flags[0];
    });
</script>

<div class="relative inline-block" bind:this={buttonContainerElement}>
    <Button variant="outline" onclick={togglePopover}>
        <Icon bind:name={selectedFlag.icon} />
        <div class="dark:text-primary-500 transform transition-transform duration-300" class:rotate-180={isExpanded}>
            <ChevronDown />
        </div>
    </Button>

    {#if isExpanded}
        <div class="absolute mt-2 bg-white dark:bg-gray-800 shadow-md rounded-lg z-50 w-32 p-2 border border-gray-200 right-0" bind:this={popoverRef}>
            {#each flags as flag}
                <Button aria-disabled={$language === flag.value} variant="outline" class="w-full" onclick={async () => await selectFlag(flag)}>
                    <Icon name={flag.icon} />
                    <p class="capitalize">{flag.label}</p>
                </Button>
            {/each}
        </div>
    {/if}
</div>
