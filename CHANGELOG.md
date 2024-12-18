# Change Log

## [1.3.6] - 2024-11-23

### Added

- Included YAML file for GitHub Actions integration to auto publish to NPM on release.

### Changed

- Updated dependency `openai` to current version.

## [1.3.5] - 2024-07-18

### Added

- Included preliminary support for for additional OpenAI model `gpt-4o-mini`. Set `msg.topic` to `gpt-4o-mini` to select the new model.

### Changed

- Changed default behavior to use the new `GPT-4o-mini` model when no topic is selected.

## [1.3.4] - 2024-07-17

### Changed

- Depreciated edits api and complete migration to v4 of openai SDK.

## [1.3.3] - 2024-07-15

### Changed

- Properly migrate from v3 to v4 of openai SDK.

## [1.3.2] - 2024-07-12

### Added

- Included support for new message property `msg.model` to select any model.

## [1.3.1] - 2024-07-08

### Added

- Included support for image generation with the model `dall-e-3`

## [1.3.0] - 2024-07-08

### Changed

- Removed support for depreciated model `text-davinci-003`. `msg.topic` can no longer be set to `completion`
- Changed default behavior to use the new `GPT-4o` model. `msg.topic` can be set to `gpt4o`

## [1.2.17] - 2024-01-17

### Changed

- Properly included support for message properties `msg.API_KEY` and `msg.ORGANIZATION`

## [1.2.16] - 2024-01-17

### Changed

- Reverted function calling with GPT-4 model due to issues

### Added

- Included support for message properties `msg.API_KEY` and `msg.ORGANIZATION`

## [1.2.15] - 2024-01-12

### Changed

- Properly store credentials so they don't accidentally get exported in a flow

## [1.2.14] - 2024-01-12

### Changed

- Remembered to update changelog.

## [1.2.13] - 2024-01-12

### Changed

- Fixed formatting of help information displayed in the info tab of the editor.
- Included comments in `chatgpt.js`.

## [1.2.12] - 2023-11-07

### Changed

- Include function calling with GPT-4 model with the `msg.functions` property
- Updated documentation


## [1.2.11] - 2023-05-10

### Changed

- Include `msg` with errors, so that `catch` nodes can be used properly.
- Updated the example `generate-node-red-nodes.json` to support Mac OS generating Node-RED nodes and importing them directly into the editor automatically.

## [1.2.10] - 2023-04-14

### Added

- Included additional example. `generate-node-red-nodes.json` demonstrates how to generate Node-RED nodes and import them directly into the editor automatically (proof of concept for Windows). OpenAI models will write the code for you based on simple parameters.

## [1.2.9] - 2023-04-08

### Added

- Included support for using a proxy to access the OpenAI API. Set the `BaseUrl` property value to the proxy/vpn service's url that you would like to use.

## [1.2.8] - 2023-03-29

### Changed

- Updated help information displayed in the info tab of the editor. (improved formatting and documentation)

## [1.2.7] - 2023-03-29

### Changed

- Fixed properly setting `msg.topic` to lowercase characters.

## [1.2.6] - 2023-03-29

### Changed

- Removed unnecessary whitespace in node edit dialog.

## [1.2.5] - 2023-03-29

### Added

- Included support for using case insensitive topics input with the `msg.topic` property.

### Changed

- Updated help information displayed in the info tab of the editor. (less verbose "details" section)
- Updated error message and removed unnecessary whitespace.
- Updated `README.md` formatting and usage information.

## [1.2.4] - 2023-03-28

### Added

- Included the ability to set the behavior Topic in the node's edit dialog. Once set-up the node can be controlled with as little as a single required message property `msg.payload`. Behavior can still be set dynamically by selecting `read from msg.topic` and setting the `msg.topic` to the desired behavior.

### Changed

- Updated help information displayed in the info tab of the editor. (`msg.max_tokens` support is now documented)
- Updated the included example to demonstrate new features.

## [1.2.3] - 2023-03-23

### Added

- Included preliminary support for for additional OpenAI model `gpt-4`. Set `msg.topic` to `gpt4` to select the new model. (untested, currently still on waitlist)
- Included support for new message property `msg.suffix`, is expected to be a string that comes after a completion of inserted text.
- Included support for new message property `msg.n`, is expected to be an number, the number of responses desired.
- Included support for new message property `msg.temperature`, is expected to be an number, the sampling temperature to use.
- Included support for new message property `msg.top_p`, is expected to be an number, an alternative to sampling with temperature.
- Included support for new message property `msg.presence_penalty`, is expected to be an number, positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
- Included support for new message property `msg.frequency_penalty`, is expected to be an number, positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
- Included support for new message property `msg.echo`, is expected to be a boolean, echos back the prompt in addition to the completion when set to `true`.

### Changed

- Improved help information displayed in the info tab of the editor.

## [1.2.2] - 2023-03-10

### Changed

- Updated node to fix unnecessary whitespace in conversation history.

## [1.2.1] - 2023-03-10

### Changed

- Updated `package.json` keywords.

## [1.2.0] - 2023-03-10
 
### Added

- Included a CHANGELOG.md file to track changes to the project.
- Included support for additional OpenAI model `gpt-3.5-turbo`. Set `msg.topic` to `turbo` to select the new model.
- Included support for conversation history for new model `gpt-3.5-turbo`. 
- Included support for new message property `msg.history`, is expected to be an array of objects containing the conversation history.

### Changed

- Updated the included example to demonstrate new features, new screenshot.
- Upgrade dependencies: `"openai": "^3.2.1"`
