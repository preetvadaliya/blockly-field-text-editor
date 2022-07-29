/**
 * @fileoverview TextEditor field test playground.
 * @author preetvadaliya@gmail.com (Preet Vadaliya)
 */

import * as Blockly from 'blockly';
import { generateFieldTestBlocks, createPlayground } from '@blockly/dev-tools';
import '../src/index';

const toolbox = generateFieldTestBlocks('field_text_editor', [
	{
		label: 'TextEditor Field Demo',
		args: {
			value: '1\n2',
			displayText: 'Text Editor',
		},
	},
]);

/**
 * Create a workspace.
 * @param {HTMLElement} blocklyDiv The blockly container div.
 * @param {!Blockly.BlocklyOptions} options The Blockly options.
 * @return {!Blockly.WorkspaceSvg} The created workspace.
 */
function createWorkspace(blocklyDiv, options) {
	const workspace = Blockly.inject(blocklyDiv, options);
	return workspace;
}

document.addEventListener('DOMContentLoaded', function () {
	const defaultOptions = {
		toolbox,
	};
	createPlayground(document.getElementById('root'), createWorkspace, defaultOptions);
});
