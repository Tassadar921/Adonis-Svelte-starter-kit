<script lang="ts">
    import { m } from '$lib/paraglide/messages';
    import { onMount } from 'svelte';
    import { raw } from '#services/stringService';
    import Loader from '#components/Loader.svelte';
    import Icon from '#components/Icon.svelte';
    import { PUBLIC_API_BASE_URI } from '$env/static/public';

    type Props = {
        name: string;
        description: string;
        title: string;
        width?: number;
        accept: string;
        fileName?: string;
        file?: File;
        pathPrefix: string;
        id: number;
        disabled?: boolean;
    };

    let { name, description, title, width = 96, accept, fileName, file, pathPrefix, id, disabled = false }: Props = $props();

    let acceptedFormats: string = $state('');
    let isDragging: boolean = $state(false);
    let previewSrc: string = $state(`${PUBLIC_API_BASE_URI}/api/static/${pathPrefix}/${id}?token=${localStorage.getItem('apiToken')}`);
    let inputRef: HTMLInputElement;
    let isLoading: boolean = $state(false);

    onMount((): void => {
        title = title ?? m['common.file.description']();
        description = description ?? m['common.file.description']();
        acceptedFormats = accept
            .split(' ')
            .map((format) => `.${format}`)
            .join(',');
    });

    const processFiles = (files: FileList): void => {
        if (disabled) {
            return;
        }
        if (files.length > 0) {
            isLoading = true;
            file = files[0];
            fileName = file.name;

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    previewSrc = e.target?.result as string;
                };
                reader.readAsDataURL(file);
            } else {
                previewSrc = '';
            }
            isLoading = false;
        } else {
            file = undefined;
            fileName = '';
            previewSrc = '';
        }
    };

    const handleFileChange = (event: Event): void => {
        const target = event.target as HTMLInputElement;
        if (!disabled && target.files) {
            processFiles(target.files);
        }
    };

    const handleDragOver = (event: DragEvent): void => {
        if (!disabled) {
            event.preventDefault();
            isDragging = true;
        }
    };

    const handleDragLeave = (): void => {
        if (!disabled) {
            isDragging = false;
        }
    };

    const handleDrop = (event: DragEvent): void => {
        if (!disabled) {
            event.preventDefault();
            isDragging = false;
            if (event.dataTransfer?.files) {
                processFiles(event.dataTransfer.files);
            }
        }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            inputRef.click();
        }
    };
</script>

<Loader {isLoading} />

<div class="flex flex-col w-full my-5">
    {#if title}
        <h3 class="font-semibold text-center mb-2">{title}</h3>
    {/if}
    <button
        type="button"
        class={`w-${width} flex flex-col items-center justify-center border-2 border-gray-400 dark:border-white rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 m-auto p-3`}
        class:bg-blue-50={isDragging && !disabled}
        class:border-blue-500={isDragging && !disabled}
        onclick={() => !disabled && inputRef.click()}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        onkeydown={handleKeyDown}
        aria-label="File uploader"
        {disabled}
    >
        <input bind:this={inputRef} type="file" class="hidden" {name} accept={acceptedFormats} onchange={handleFileChange} {disabled} />
        <span class="text-primary-500">
            <Icon name="upload" size={35} />
        </span>
        <span class="text-center text-sm text-gray-500 my-3">
            {#if fileName}
                {#if previewSrc}
                    <div class="mt-3 flex justify-center">
                        <img src={previewSrc} alt="Preview" class="w-24 h-24 object-cover rounded" />
                    </div>
                {:else}
                    {fileName}
                {/if}
            {:else}
                {@html raw(description)}
            {/if}
        </span>
    </button>
</div>
