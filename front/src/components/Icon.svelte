<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import { toCamelCase } from '#lib/services/stringService';

    const iconNames = [
        'Book',
        'Camera',
        'Moon',
        'Sun',
        'Burger',
        'Close',
        'Settings',
        'ChevronLeft',
        'ChevronRight',
        'DoubleChevronLeft',
        'DoubleChevronRight',
        'Home',
        'User',
        'UserRemove',
        'Eye',
        'EyeSlash',
        'Trash',
        'Undo',
        'ArrowDown',
        'ArrowUp',
        'Euro',
        'Dollar',
        'Upload',
        'Search',
        'Pen',
        'Plus',
        'Minus',
        'Save',
        'Check',
        'Exchange',
        'PaperClip',
        'Send',
        'Download',
        'Help',
        'Clear',
        'ArrowLeft',
        'ArrowRight',
        'OpenSource',
        'ChevronDown',
        'ChevronUp',
        'EnglishFlag',
        'FrenchFlag',
        'People',
        'Game',
        'Stop',
        'Bell',
        'RemoveUser',
        'AddUser',
        'Unblock',
        'Confirm',
        'Crown',
        'Invite',
        'Copy',
        'Bot',
        'Spinner',
        'Attack',
        'Move',
        'Infantry',
        'Ship',
        'Google',
        'Github',
        'Discord',
        'Admin',
    ] as const;

    type PascalCase = (typeof iconNames)[number];
    type CamelCase<S extends string> = S extends `${infer First}${infer Rest}` ? `${Lowercase<First>}${Rest}` : S;

    type Props = {
        name: PascalCase | CamelCase<PascalCase>;
        size?: number;
    };

    let { name = $bindable(), size = 24 }: Props = $props();

    let currentName: string = '';

    let IconComponent: typeof SvelteComponent | undefined = $state();

    const setIcon = async (name: string): Promise<void> => {
        const camelCaseName = toCamelCase(name);
        const module = await import(`#icons/${camelCaseName}.svelte`);
        IconComponent = module.default;
    };

    $effect((): void => {
        if (name && name !== currentName) {
            currentName = name;
            (async () => {
                await setIcon(name);
            })();
        }
    });
</script>

{#if IconComponent}
    <IconComponent {size} class="transition-all duration-300" />
{/if}
