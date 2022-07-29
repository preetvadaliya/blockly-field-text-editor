// Copyright (c) 2022 preet
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as Blockly from 'blockly/core';

/**
 * FieldTextEditor
 */
export class FieldTextEditor extends Blockly.FieldTextInput {
	/**
	 * Create a new FieldTextEditor.
	 * @param {string} value
	 * @param {Function} validator
	 * @param {Map} config
	 */
	constructor(value, displayText, validator, config) {
		super(value, validator, config);
		this.boundEvents_ = [];
		this.textAreaInput_ = null;
		this.displayText_ = displayText;
	}

	/**
	 * Convert field data to XML element.
	 * @param {HTMLElement} fieldElement
	 * @returns the XML element with field data.
	 */
	toXml(fieldElement) {
		fieldElement.textContent = this.getValue().replace(/\n/g, '&#10;');
		return fieldElement;
	}

	/**
	 * Extract data from XML field element.
	 * @param {HTMLElement} fieldElement
	 */
	fromXml(fieldElement) {
		this.setValue(fieldElement.textContent.replace(/&#10;/g, '\n'));
	}

	/**
	 * Create new TextEditorField.
	 * @param {Map} options
	 * @returns
	 */
	static fromJson(options) {
		return new FieldTextEditor(options['value'], options['displayText'], undefined, options);
	}

	showEditor_(e = undefined, _quietInput = undefined) {
		const noFocus = Blockly.utils.userAgent.MOBILE || Blockly.utils.userAgent.ANDROID || Blockly.utils.userAgent.IPAD;
		super.showEditor_(e, noFocus);
		const editor = this.dropdownCreate_();
		Blockly.DropDownDiv.getContentDiv().appendChild(editor);
		Blockly.DropDownDiv.setColour(this.sourceBlock_.style.colourPrimary, this.sourceBlock_.style.colourTertiary);
		Blockly.DropDownDiv.showPositionedByField(this, this.dropdownDispose_.bind(this));
	}

	render_() {
		super.render_();
		this.updateTextArea_();
	}

	dropdownCreate_() {
		const fieldWrapper = document.createElement('div');
		const lineNumberInput = document.createElement('textarea');
		const codeEditorInput = document.createElement('textarea');

		fieldWrapper.className = 'fieldCodeEditorContainer';
		codeEditorInput.className = 'fieldCodeEditorTextArea';
		lineNumberInput.className = 'fieldCodeEditorNumber';
		lineNumberInput.setAttribute('readonly', 'true');
		codeEditorInput.setAttribute('spellcheck', false);

		const updateEditor = function () {
			lineNumberInput.value = '';
			let lineCount = codeEditorInput.value.split('\n').length;
			let lineNumberInputValue = '';
			for (let i = 1; i <= lineCount; i++) {
				lineNumberInputValue += `${i}\n`;
			}
			lineNumberInput.value = lineNumberInputValue;
			lineNumberInput.style.width = lineCount.toString().length * 16 + 14 + 'px';
		};

		const updateScroll = function () {
			lineNumberInput.scrollTop = codeEditorInput.scrollTop;
		};

		codeEditorInput.addEventListener('keyup', updateEditor);
		codeEditorInput.addEventListener('keydown', updateEditor);
		codeEditorInput.addEventListener('change', updateEditor);
		codeEditorInput.addEventListener('input', updateEditor);
		codeEditorInput.addEventListener('scroll', updateScroll);
		codeEditorInput.value = this.getValue();
		updateEditor();
		this.textAreaInput_ = codeEditorInput;
		this.boundEvents_.push(
			Blockly.browserEvents.conditionalBind(codeEditorInput, 'input', this, this.onTextAreaChange_)
		);
		fieldWrapper.appendChild(lineNumberInput);
		fieldWrapper.appendChild(codeEditorInput);
		return fieldWrapper;
	}

	dropdownDispose_() {
		for (const event of this.boundEvents_) {
			Blockly.browserEvents.unbind(event);
		}
		this.textAreaInput_ = null;
	}

	onTextAreaChange_() {
		this.setEditorValue_(this.textAreaInput_.value);
	}

	updateTextArea_() {
		if (!this.textAreaInput_) {
			return;
		}
		this.textAreaInput_.value = this.getValue();
	}

	getDisplayText_() {
		return this.displayText_;
	}
}

Blockly.fieldRegistry.register('field_text_editor', FieldTextEditor);

Blockly.Css.register([
	/* eslint-disable indent */
	`
    .fieldCodeEditorContainer {
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
            -ms-flex-direction: row;
                flex-direction: row;
        height: 300px;
        width: 600px;
      }
      .fieldCodeEditorTextArea,
      .fieldCodeEditorNumber {
        width: 97.5%;
        border: none;
        outline: none !important;
        resize: none !important;
        margin: 0px !important;
        font-family: monospace;
      }
      .fieldCodeEditorTextArea  {
        padding: 8px 8px 8px 8px;
        overflow: auto;
        word-wrap: normal;
      }
      .fieldCodeEditorNumber {
        padding: 8px 0px 8px 0px;
        border-right: 1px solid rgba(0,0,0,0.12);
        width: 2.5%;
        overflow-y: hidden;
        overflow-x: auto;
        text-align: center;
      }
      .fieldCodeEditorNumber::-webkit-scrollbar {
        display: none;
      }
      .fieldCodeEditorTextArea::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      .fieldCodeEditorTextArea::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      .fieldCodeEditorTextArea::-webkit-scrollbar-thumb {
        background: #888;
      }
      .fieldCodeEditorTextArea::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
  `,
	/* eslint-enable indent */
]);
