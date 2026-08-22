import {assert} from '@augment-vir/assert';
import {describe, it, testWeb} from '@augment-vir/test';
import {html} from 'element-vir';
import {VirApp} from './vir-app.element.js';

describe(VirApp.tagName, () => {
    it('renders', async () => {
        const instance = await testWeb.render(html`
            <${VirApp}></${VirApp}>
        `);

        assert.instanceOf(instance, VirApp);
    });
});
