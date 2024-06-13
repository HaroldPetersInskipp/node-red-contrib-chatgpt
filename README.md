# node-red-contrib-custom-chatgpt4o

![Platform](https://img.shields.io/badge/platform-Node--RED-red)
![npm](https://img.shields.io/npm/v/node-red-contrib-custom-chatgpto.svg)
![Downloads](https://img.shields.io/npm/dt/node-red-contrib-custom-chatgpto.svg)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

Supercharge your Node-RED flows with AI! Seamlessly integrate with OpenAI's powerful models like GPT-4, GPT-4o and DALL·E 2, and unlock a world of creative possibilities. Create imaginative chatbots, automate content generation, or build AI-driven experiences. The power of AI is just a node away!

## Table of Contents

- [node-red-contrib-custom-chatgpt](#node-red-contrib-custom-chatgpt)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Setup](#setup)
  - [Usage](#usage)
    - [Additional optional properties](#additional-optional-properties)
  - [Examples](#examples)
  - [External Links](#external-links)
  - [Bugs and Feature Requests](#bugs-and-feature-requests)
  - [Changelog](#changelog)
  - [License](#license)

## Getting Started

To start using `node-red-contrib-custom-chatgpt4o`, you can install it through the built-in Node-RED Palette manager or using npm:

```sh
npm install node-red-contrib-custom-chatgpt4o
```

## Setup

- [Follow this guide to get your OpenAI API key](https://platform.openai.com/account/api-keys)
- [Here's how to get your Organization ID](https://platform.openai.com/account/org-settings)

With these, you're ready to configure your `node-red-contrib-custom-chatgpt4o` nodes.

## Usage

With `node-red-contrib-custom-chatgpt4o`, you have the power to select the behavior of the node by setting the Topic property value to `image`, `edit`, `turbo` , or `gpt4` / `gpt4o`. You can control the node with a single required message property `msg.payload` or dynamically set the behavior with incoming messages using `read from msg.topic`.

For detailed information on the usage of these modes, please refer to the [OpenAI API documentation](https://beta.openai.com/docs/).

<del>1. When `msg.topic` is set to `completion`:</del>

   - <del>[Required] `msg.payload` should be a well-written prompt that provides enough information for the model to know what you want and how it should respond. Its success generally depends on the complexity of the task and quality of your prompt. A good rule of thumb is to think about how you would write a word problem for a middle schooler to solve.</del>

2. When `msg.topic` is set to `image`:

   - [Required] `msg.payload` should be a prompt of text description of the desired image.

   - [Optional] `msg.size` should be a string of the desired image dimensions. [Default:`256x256`]

   - [Optional] `msg.format` should be a string of either `b64_json` or `url`. [Default:`b64_json`]

3. When `msg.topic` is set to `edit`:

   - [Required] `msg.payload` should be a prompt of text to use as a starting point for the edit.

   - [Required] `msg.last` should be a string of text to use as the input to be edited.

4. When `msg.topic` is set to `turbo`:

   - [Required] `msg.payload` should be a well-written prompt that provides enough information for the model to know what you want and how it should respond. Its success generally depends on the complexity of the task and quality of your prompt.

   - [Optional] `msg.history` should be an array of objects containing the conversation history. [Default:`[]`]

5. When `msg.topic` is set to `gpt4` or `gpt4o`:

   - [Required] `msg.payload` should be a well-written prompt that provides enough information for the model to know what you want and how it should respond. Its success generally depends on the complexity of the task and quality of your prompt.

   - [Optional] `msg.history` should be an array of objects containing the conversation history. [Default:`[]`]

### Additional optional properties

The following optional inputs are supported - `msg.max_tokens`, `msg.suffix`, `msg.n`, `msg.temperature`, `msg.top_p`, `msg.presence_penalty`, `msg.frequency_penalty`, `msg.echo`, `msg.API_KEY` and `msg.ORGANIZATION`. See the nodes built-in help tab for more information on how they are used.

## External Links

- [Node-RED](https://flows.nodered.org/node/node-red-contrib-custom-chatgpt)
- [Libraries.io](https://libraries.io/npm/node-red-contrib-custom-chatgpto)
- [npm](https://www.npmjs.com/package/node-red-contrib-custom-chatgpto)

## Bugs and Feature Requests

Encountered a bug or have an idea for a new feature? We'd love to hear from you! Feel free to [submit an issue](https://github.com/HaroldPetersInskipp/node-red-contrib-chatgpt/issues) on our GitHub page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
