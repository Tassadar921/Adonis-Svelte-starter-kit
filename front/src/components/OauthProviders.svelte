<script lang="ts">
    import Icon from '#components/Icon.svelte';
    import { showToast } from '#services/toastService';
    import { PUBLIC_GITHUB_REPOSITORY } from '$env/static/public';

    type Provider = 'google' | 'github' | 'discord';

    const handleOauthClick = async (provider: Provider): Promise<void> => {
        try {
            window.location.href = `${PUBLIC_GITHUB_REPOSITORY}/api/auth/${provider}`;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };
</script>

<div class="flex justify-around">
    <button type="button" onclick={() => handleOauthClick('google')} class="rounded-full cursor-pointer">
        <Icon name="google" size={42} />
    </button>
    <button type="button" onclick={() => handleOauthClick('github')} class="rounded-full cursor-pointer">
        <Icon name="github" size={42} />
    </button>
    <button type="button" onclick={() => handleOauthClick('discord')} class="rounded-full cursor-pointer">
        <Icon name="discord" size={42} />
    </button>
</div>
