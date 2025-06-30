<script lang="ts">
    import Button from '#components/Button.svelte';
    import { onMount } from 'svelte';
    import Icon from '#components/Icon.svelte';
    import { formatGameNumbers } from '#services/stringService';

    interface Props {
        value?: number;
        smallStep: number;
        largeStep: number;
        smallShiftStep: number;
        largeShiftStep: number;
        canDecrement: boolean;
        canIncrement: boolean;
        canBeZero?: boolean;
        name: string;
    }

    let { value = 0, smallStep, largeStep, smallShiftStep, largeShiftStep, canDecrement, canIncrement, canBeZero = false, name }: Props = $props();

    const applyStep = (step: number, shiftStep: number, direction: 'inc' | 'dec', shiftKey: boolean) => {
        const appliedStep = shiftKey ? shiftStep : step;

        if (direction === 'dec' && canDecrement) {
            value = Math.max(canBeZero ? 0 : smallStep, value - appliedStep);
        }

        if (direction === 'inc' && canIncrement) {
            value += appliedStep;
        }
    };

    const handleClick = (event: MouseEvent, step: number, shiftStep: number, direction: 'inc' | 'dec'): void => {
        applyStep(step, shiftStep, direction, event.shiftKey);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        let direction: 'inc' | 'dec';
        let step: number;
        let shiftStep: number;

        switch (event.key) {
            case 'ArrowUp':
                direction = 'inc';
                step = smallStep;
                shiftStep = smallShiftStep;
                break;
            case 'ArrowDown':
                direction = 'dec';
                step = smallStep;
                shiftStep = smallShiftStep;
                break;
            case 'PageUp':
                direction = 'inc';
                step = largeStep;
                shiftStep = largeShiftStep;
                break;
            case 'PageDown':
                direction = 'dec';
                step = largeStep;
                shiftStep = largeShiftStep;
                break;
            default:
                return;
        }

        event.preventDefault();
        applyStep(step, shiftStep, direction, event.shiftKey);
    };

    onMount(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    });
</script>

<input type="hidden" {name} {value} />

<div class="my-2 flex gap-3 justify-center items-center">
    <!-- Large Decrement -->
    <Button disabled={!canDecrement} onclick={(event: MouseEvent) => handleClick(event, largeStep, largeShiftStep, 'dec')}>
        <Icon name="doubleChevronLeft" />
    </Button>

    <!-- Small Decrement -->
    <Button disabled={!canDecrement} onclick={(event: MouseEvent) => handleClick(event, smallStep, smallShiftStep, 'dec')}>
        <Icon name="chevronLeft" />
    </Button>

    <!-- Value -->
    <p class="font-semibold min-w-[6rem] text-center">
        {formatGameNumbers(value)}
    </p>

    <!-- Small Increment -->
    <Button disabled={!canIncrement} onclick={(event: MouseEvent) => handleClick(event, smallStep, smallShiftStep, 'inc')}>
        <Icon name="chevronRight" />
    </Button>

    <!-- Large Increment -->
    <Button disabled={!canIncrement} onclick={(event: MouseEvent) => handleClick(event, largeStep, largeShiftStep, 'inc')}>
        <Icon name="doubleChevronRight" />
    </Button>
</div>
