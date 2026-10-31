module.exports = (RED) => {
    // Import required modules
    const { OpenAI } = require("openai");

    // Define a list of acceptable topics for the node
    const ACCEPT_TOPIC_LIST = [
        "gpt-4o-mini",
        "gpt4o",
        "image",
        "turbo",
        "gpt4",
        "dalle3",
    ].map((item) => item.toLowerCase());

    // gpt-3.5-turbo, gpt-4 and gpt-4-turbo were shut down on 2026-10-23; gpt-4o and gpt-4o-mini follow on 2027-01-14
    // https://developers.openai.com/api/docs/deprecations
    const DEFAULT_CHAT_MODEL = "gpt-6-luna";

    // Only send sampling params the user set: newer reasoning models reject non-default values
    const optionalNumber = (value) => (value == null || value === "" ? undefined : parseFloat(value));

    // Build the request shared by every chat topic
    const chatRequest = (msg) => {
        const model = msg.model || DEFAULT_CHAT_MODEL;
        return {
            model: model,
            messages: msg.history,
            temperature: optionalNumber(msg.temperature),
            top_p: optionalNumber(msg.top_p),
            n: parseInt(msg.n) || 1,
            stream: msg.stream || false,
            stop: msg.stop || undefined,
            max_completion_tokens: parseInt(msg.max_tokens) || 4000,
            presence_penalty: optionalNumber(msg.presence_penalty),
            frequency_penalty: optionalNumber(msg.frequency_penalty),
            reasoning_effort: msg.reasoning_effort || (model === DEFAULT_CHAT_MODEL ? "none" : undefined),
        };
    };

    // Main function that gets executed when a message is received
    const main = function (config) {
        const node = this;
        RED.nodes.createNode(node, config);

        // Handle incoming messages
        node.on("input", async(msg) => {
            // Extract API key from credentials or message
            const API_KEY = this.credentials.API_KEY || msg.API_KEY;

            // Initialize OpenAI configuration with the provided API key
            const configuration = {
                apiKey: API_KEY,
            };

            // Handle BaseUrl configuration if provided
            if (config.BaseUrl) {
                try {
                    // Update the base path if a valid URL is provided
                    const url = new URL(config.BaseUrl);
                    if (url.pathname === "/") {
                        url.pathname = "/v1";
                    }
                    configuration.basePath = url.toString();
                } catch {
                    // Display an error status if BaseUrl is not a valid URL
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: `BaseUrl(${config.BaseUrl}) isn't a valid url`,
                    });
                    return;
                }
            }

            // Initialize the OpenAI API client
            const openai = new OpenAI({apiKey: API_KEY});

            // Set node status to indicate processing
            node.status({
                fill: "green",
                shape: "dot",
                text: "Processing...",
            });

            // Check and normalize the provided topic in the message
            if (config.topic !== "__EMPTY__") {
                msg.topic = config.topic;
            }
            if (msg.topic) {
                msg.topic = msg.topic.toLowerCase();
            }

            // Validate if the provided topic is in the accepted topic list
            if (!ACCEPT_TOPIC_LIST.includes(msg.topic) && msg.topic !== "__empty__") {
                // Set node status and log error if the topic is incorrect
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: "msg.topic is incorrect",
                });
                node.error(`msg.topic must be a string set to one of the following values: ${ACCEPT_TOPIC_LIST.map((item) => ` '${item}' `).join(", ")}`);

                // Send the message
                node.send(msg);
            } else if (msg.topic === "image") {
                // Process messages with the "image" topic
                try {
                    // Make a request to OpenAI API for image creation
                    const response = await openai.images.generate({
                        prompt: msg.payload,
                        n: parseInt(msg.n) || 1,
                        size: msg.size || "256x256",
                        response_format: msg.format || "url",
                    });

                    // Process the response based on the specified format
                    if (msg.format === "b64_json") {
                        msg.payload = response.data[0].b64_json;
                    } else {
                        msg.payload = response.data[0].url;
                    }

                    // Set additional properties in the message
                    msg.full = response;

                    // Set node status
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });

                    // Send the message
                    node.send(msg);
                    // Handle errors
                } catch (error) {
                    // Set node status
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            } else if (msg.topic === "dalle3") {
                // Process messages with the "dalle3" topic
                try {
                    // Make a request to OpenAI API for image creation
                    const response = await openai.images.generate({
                        model: "dall-e-3",
                        prompt: msg.payload,
                        n: parseInt(msg.n) || 1,
                        size: msg.size || "1024x1024",
                    });
                    msg.payload = response.data[0].url;

                    // Set additional properties in the message
                    msg.full = response;

                    // Set node status
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });

                    // Send the message
                    node.send(msg);
                    // Handle errors
                } catch (error) {
                    // Set node status
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            } else if (msg.topic === "turbo") {
                // Process messages with the "turbo" topic
                try {
                    if (typeof msg.history === "undefined")
                        msg.history = [];
                    msg.topic = "turbo";
                    const input = {
                        role: "user",
                        content: msg.payload,
                    };
                    msg.history.push(input);
                    // Request a chat completion
                    const response = await openai.chat.completions.create(chatRequest(msg));
                    const trimmedContent =
                        response.choices[0].message.content.trim();
                    const result = {
                        role: "assistant",
                        content: trimmedContent,
                    };
                    msg.history.push(result);
                    // Extract completed text from the response
                    msg.payload = response.choices[0].message.content;
                    msg.full = response;
                    // Set node status
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });
                    // Send the message
                    node.send(msg);
                    // Handle errors
                } catch (error) {
                    // Set node status
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            } else if (msg.topic === "gpt4") {
                // Process messages with the "gpt4" topic
                try {
                    // Handle GPT-4 conversation logic
                    if (typeof msg.history === "undefined")
                        msg.history = [];
                    msg.topic = "gpt4";
                    const input = {
                        role: "user",
                        content: msg.payload,
                    };
                    msg.history.push(input);

                    // Request a chat completion
                    const response = await openai.chat.completions.create(chatRequest(msg));
                    const trimmedContent =
                        response.choices[0].message.content.trim();
                    const result = {
                        role: "assistant",
                        content: trimmedContent,
                    };
                    msg.history.push(result);
                    // Extract completed text from the response
                    msg.payload = response.choices[0].message.content;
                    msg.full = response;
                    // Set node status
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });
                    // Send the message
                    node.send(msg);
                    // Handle errors
                } catch (error) {
                    // Set node status
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            } else if (msg.topic === "gpt4o") {
                // Process messages with the "gpt4o" topic
                try {
                    // Handle GPT-4 conversation logic
                    if (typeof msg.history === "undefined")
                        msg.history = [];
                    msg.topic = msg.model ? msg.model : "gpt4o";
                    const input = {
                        role: "user",
                        content: msg.payload,
                    };
                    msg.history.push(input);

                    // Request a chat completion
                    const response = await openai.chat.completions.create(chatRequest(msg));
                    const trimmedContent =
                        response.choices[0].message.content.trim();
                    const result = {
                        role: "assistant",
                        content: trimmedContent,
                    };
                    msg.history.push(result);
                    // Extract completed text from the response
                    msg.payload = response.choices[0].message.content;
                    msg.full = response;
                    // Set node status
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });
                    // Send the message
                    node.send(msg);
                    // Handle errors
                } catch (error) {
                    // Set node status
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            } else {
                // Process messages with the "gpt-4o-mini" topic
                try {
                    // Handle GPT-4 conversation logic
                    if (typeof msg.history === "undefined")
                        msg.history = [];
                    msg.topic = msg.model ? msg.model : "gpt-4o-mini";
                    const input = {
                        role: "user",
                        content: msg.payload,
                    };
                    msg.history.push(input);

                    // Request a chat completion
                    const response = await openai.chat.completions.create(chatRequest(msg));
                    const trimmedContent =
                        response.choices[0].message.content.trim();
                    const result = {
                        role: "assistant",
                        content: trimmedContent,
                    };
                    msg.history.push(result);
                    // Extract completed text from the response
                    msg.payload = response.choices[0].message.content;
                    msg.full = response;
                    // Set node status
                    node.status({
                        fill: "blue",
                        shape: "dot",
                        text: "Response complete",
                    });
                    // Send the message
                    node.send(msg);
                    // Handle errors
                } catch (error) {
                    // Set node status
                    node.status({
                        fill: "red",
                        shape: "dot",
                        text: "Error",
                    });
                    if (error.response) {
                        node.error(error.response, msg);
                    } else {
                        node.error(error.message, msg);
                    }
                }
            }
        });
        // Clear the node status on node close
        node.on("close", () => {
            node.status({});
        });
    };

    // Register the node type with Node-RED
    RED.nodes.registerType("chatgpt", main, {
        credentials: {
            API_KEY: { type: "text" },
        },
    });
};
