<script lang="ts">
    import Form from '../shared/Form.svelte';
    import Input from '../shared/Input.svelte';
    import PasswordInput from '../shared/PasswordInput.svelte';
    import { showToast } from '../../services/toastService';
    import axios from 'axios';
    import Title from '../shared/Title.svelte';
    import Link from '../shared/Link.svelte';
    import { navigate } from '../../stores/locationStore';
    import { setProfile } from '../../stores/profileStore';
    import { t } from 'svelte-i18n';
    import Breadcrumbs from '../shared/Breadcrumbs.svelte';
    import Icon from '../shared/Icon.svelte';

    let email: string = '';
    let password: string = '';
    let canSubmit: boolean = false;

    const handleSuccess = async (event: CustomEvent): Promise<void> => {
        localStorage.setItem('apiToken', event.detail.token.token);
        localStorage.setItem('apiTokenExpiration', event.detail.token.expiresAt);
        axios.defaults.headers.common['Authorization'] = `Bearer ${event.detail.token.token}`;

        setProfile(event.detail.user);

        showToast($t('toast.login.success'));
        navigate('/');
    };

    const handleOauthClick = async (provider: 'google' | 'github' | 'discord'): Promise<void> => {
        try {
            window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/${provider}`;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    $: canSubmit = !!email && !!password;
</script>

<Title title={$t('login.title')} hasBackground />

<Breadcrumbs hasBackground items={[{ label: $t('home.title'), path: '/' }, { label: $t('login.title') }]} />

<Form action="/api/auth" method="post" on:success={handleSuccess} isValid={canSubmit}>
    <div class="flex justify-around">
        <button type="button" on:click={() => handleOauthClick('google')} class="rounded-full p-3">
            <Icon name="google" size={42} />
        </button>
        <button type="button" on:click={() => handleOauthClick('github')} class="rounded-full">
            <Icon name="github" size={42} />
        </button>
        <button type="button" on:click={() => handleOauthClick('discord')} class="rounded-full">
            <Icon name="discord" size={42} />
        </button>
    </div>
    <Input type="email" name="email" placeholder={$t('common.email.placeholder')} label={$t('common.email.label')} bind:value={email} />
    <PasswordInput bind:value={password} />
    <div class="w-full mb-3">
        <Link href="/reset-password" className="text-primary-500 hover:text-white duration-300 transition-colors">Forgot password ?</Link>
    </div>
</Form>
