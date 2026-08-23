import {PredefinedGamepadModel} from '@antha/gamepad-type';
import {assert} from '@augment-vir/assert';
import {describe, it, testWeb} from '@augment-vir/test';
import {html} from 'element-vir';
import {
    DeviceInputType,
    GamepadInputDeviceKey,
    InputDeviceType,
    type GamepadDevice,
} from 'input-device-handler';
import {VirGamepadButton} from './gamepad/vir-gamepad-button.element.js';
import {VirGamepadInput} from './gamepad/vir-gamepad-input.element.js';
import {VirGamepadInputs} from './gamepad/vir-gamepad-inputs.element.js';
import {VirGamepad} from './gamepad/vir-gamepad.element.js';
import {VirEditMappingsModal} from './modals/vir-edit-mappings.modal.element.js';
import {VirApp} from './vir-app.element.js';

const testGamepadInput = {
    inputName: 'button-0',
    inputType: DeviceInputType.Button,
    value: 0,
};

const testGamepad = {
    currentInputs: {},
    deviceDetails: {
        axes: [],
        buttons: [
            testGamepadInput,
        ],
        deviceKey: GamepadInputDeviceKey.Gamepad1,
        gamepadName: 'Steam Deck browser gamepad',
        inputsByName: {
            [testGamepadInput.inputName]: testGamepadInput,
        },
        isConnected: true,
        mapping: '',
        serialized: true,
        timestamp: 0,
    },
    deviceKey: GamepadInputDeviceKey.Gamepad1,
    deviceName: 'Steam Deck browser gamepad',
    deviceType: InputDeviceType.Gamepad,
} satisfies Readonly<GamepadDevice>;

describe(VirApp.tagName, () => {
    it('renders', async () => {
        const instance = await testWeb.render(html`
            <${VirApp}></${VirApp}>
        `);

        assert.instanceOf(instance, VirApp);
    });

    it('immediately renders a newly saved input name', async () => {
        const instance = await testWeb.render(html`
            <${VirApp}></${VirApp}>
        `);

        assert.instanceOf(instance, VirApp);
        instance.instanceState.deviceHandler.pausePollingLoop();
        instance.instanceState.gamepadDevices = [
            testGamepad,
        ];
        instance.instanceState.savedGamepadLayouts.setValue([]);
        instance.instanceState.savedGamepadModelMap.setValue({
            [testGamepad.deviceName]: PredefinedGamepadModel.SteamDeck,
        });
        instance.instanceState.submittedChanges.setValue(undefined);
        await instance.updateComplete;

        const gamepad = instance.shadowRoot.querySelector(VirGamepad.tagName);
        assert.instanceOf(gamepad, VirGamepad);
        await gamepad.updateComplete;
        const gamepadInputs = gamepad.shadowRoot.querySelector(VirGamepadInputs.tagName);
        assert.instanceOf(gamepadInputs, VirGamepadInputs);
        await gamepadInputs.updateComplete;
        const gamepadInput = gamepadInputs.shadowRoot.querySelector(VirGamepadInput.tagName);
        assert.instanceOf(gamepadInput, VirGamepadInput);
        gamepadInput.click();
        await instance.updateComplete;

        const modal = instance.shadowRoot.querySelector(VirEditMappingsModal.tagName);
        assert.instanceOf(modal, VirEditMappingsModal);
        modal.dispatchEvent(
            new VirEditMappingsModal.events.inputMapSave({
                inputName: testGamepadInput.inputName,
                mappedName: 'Steam button',
            }),
        );
        await instance.updateComplete;
        await gamepad.updateComplete;
        await gamepadInputs.updateComplete;

        const updatedGamepadInput = gamepadInputs.shadowRoot.querySelector(VirGamepadInput.tagName);
        assert.instanceOf(updatedGamepadInput, VirGamepadInput);
        await updatedGamepadInput.updateComplete;
        const gamepadButton = updatedGamepadInput.shadowRoot.querySelector(
            VirGamepadButton.tagName,
        );
        assert.instanceOf(gamepadButton, VirGamepadButton);
        assert.strictEquals(
            gamepadButton.shadowRoot.querySelector('.button-name')?.textContent,
            'Steam button',
        );
    });
});
